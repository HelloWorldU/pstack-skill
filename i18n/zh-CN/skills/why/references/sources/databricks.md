# Databricks 分析与系统表

## 这个信息源包含什么

Databricks 是产品分析、数据管道和数仓遥测层。它与 Datadog 互补：Datadog 是*基础设施/运行时*视角，Databricks 是*产品/数据*视角（用户做了什么、跑了哪些实验、功能使用情况如何演变、某个阈值常量是从哪来的）。

- **产品分析事件。** `your_warehouse.events.analytics_track_event`（原始表）以及按事件类型化、去重后的 dbt 模型，位于 `<your_analytics_db>.<schema>.<table>`。用户行为：功能调用、点击、接受/拒绝、提交、客户端上报的错误。
- **用量与计费事件。** `your_warehouse.events.usage_event` / `<your_analytics_db>.<schema>.stg_usage_events`、`your_warehouse.events.raw_model_event` / `<your_analytics_db>.<schema>.stg_raw_model_events`。用于成本或量级驱动的决策。
- **实验 / 功能开关数据。** 曝光（exposure）表和结果表。**Schema 因公司而异。** 在假定表名之前先用 `SHOW TABLES` 探查。
- **系统表。** `system.query.history`、`system.compute.warehouses`、`system.billing.*`、`system.access.audit`。回答“这条查询贵不贵？”“多久才有人跑一次这个？”“数仓负载什么时候飙升过？”
- **dbt 血缘。** `<your_analytics_db>.<schema>` 中的模型揭示了哪些管道依赖某张表/某个字段。上游变更经常会推动消费方代码的改动。
- **Databricks notebooks。** 工程师在改代码之前写的探索性分析。**无法通过 SQL MCP 查询。** 如果你怀疑动机记录在某个 notebook 里，把它明确标为缺口。

## 如何搜索

使用 Databricks SQL MCP。主要工具：`execute_sql_read_only`。如果它返回 `statement_id`，用 `poll_sql_result` 轮询，而不是重新执行。

**先摸清情况再查询。** Schema 因公司而异。在信任任何表名之前先探查：

```sql
SHOW TABLES IN <your_analytics_db>.<schema> LIKE '*<keyword>*';
DESCRIBE TABLE <your_analytics_db>.<schema>.stg_<event>;
```

**每个查询都要限定时间范围。** 这些表非常庞大，不加约束的扫描会超时。用 `_timestamp`（事件表）或 `start_time`（`system.query.history`）过滤，时间窗口要覆盖发布日期，通常取前后各约 30 天，只有理由充分时才放宽。

**优先用类型化的 dbt 模型，而不是原始表。** `<your_analytics_db>.<schema>.<table>` 是去重、类型化且做了 liquid clustering 的。`your_warehouse.events.analytics_track_event` 有重复数据，`properties_json` 未类型化。模型命名规律：`stg_<source>_<event_name_with_underscores>`，其中 `<source>` 是 `app`、`backend`、`website` 或 `cli`。当仅靠命名规律无法确定时，用 `SHOW TABLES` 确认确切模型名。只有在还没有对应的 dbt 模型、或者你需要的事件还处在 dbt 刷新延迟期内时，才退回原始表。

**类型化 dbt 模型的列约定**（了解这些可以省掉一次 `DESCRIBE` 往返）：

- `_timestamp`、`_id`、`_auth_id`、`_request_id`、`event_name`。每个模型都有
- `properties_<name>`。类型化、下划线命名的事件属性（`properties_entrypoint`、`properties_size_bytes` 等）
- `context_team_id`、`context_client_version`、`context_country`、`context_client_os`。预提取的客户端上下文

### 往往有回报的调查模式

选择与目标匹配的“表 + 列”组合：

1. **事件用量轨迹。** 在 PR 合并前后 ±30 天的窗口内，统计相关 `stg_*` 模型的每日计数。如果在合并后一两天内出现从零到稳定量级的阶跃，这是该 PR 上线了此功能的强间接证据。衰减到零则暗示功能被弃用或删除。
2. **护栏 / 防御性检查的来源。** 在 PR 之前 14 天内，相关 `properties_<name>` 列的分布（中位数 / p99 / 最大值）。如果 p99 与目标代码中的阈值常量吻合，说明这个数字是从数据里选出来的。
3. **实验 / 功能开关查询。** 用 `SHOW TABLES ... LIKE '*experiment*'` 找到曝光表，然后按变体拉取 PR 日期附近相关开关键的曝光计数。
4. **迁移、回填或性能重写的查询历史证据。** 在 `system.query.history` 中用 `statement_text ILIKE '%<table_or_symbol>%'` 过滤并收紧 `start_time` 窗口，找出很可能促成这次变更的昂贵查询（按 `total_duration_ms` 排序，或聚合 `SUM(read_bytes)`、`COUNT(*)`）。
5. **dbt 血缘。** 如果目标代码读写 `<your_analytics_db>.<schema>` 中的模型，模型自身的 git 历史（就在这个仓库里）往往记录着动机。把这条线索交还给 git 调查员，不要自己追。

## 这里什么样的证据算好证据

除了上面那些模式形态之外：

- 某个错误分类事件的计数在防御性代码 PR 之后几天内降到接近零。暗示该 PR 解决了那类错误
- 曝光表的某一行列出了目标的功能开关键，并且在 PR 发布日期前后有 “shipped”/“concluded” 的决定

## 常见陷阱

- **被埋点 ≠ 因果。** 一个事件的存在只说明有人觉得值得记录它，并不能说明目标代码是*因为它*才存在的。在声称因果关系之前，先配上来自 git 调查员的 PR/提交引用。
- **悄无声息的埋点变更。** 事件量的阶跃可能意味着开始记录了一个新事件，而不是用户行为变了。在把陡增解读为功能上线信号之前，先检查同一窗口内有没有埋点相关的 PR。
- **Schema 漂移。** 事件属性会演变。今天类型化 dbt 模型上的某个列，在目标代码编写时可能还不存在。较早的数据里，该属性可能只存在于原始的 `properties_json` 中。
- **dbt 刷新延迟。** `<your_analytics_db>.<schema>.*` 按计划重建（通常每小时/每天）。对于最近几个小时的事件，退回 `your_warehouse.events.*` 并按 `_id` 去重。
- **公司特有的表。** 实验、功能开关、计费和用量表各不相同。报告一张你从未确认存在的表上的结果，是典型的翻车方式。先用 `SHOW TABLES` / `DESCRIBE TABLE` 探查。
- **留存断崖。** 如果相关窗口早于表的留存期或 dbt 模型的创建日期，那是一个*缺口*，而不是空结果。明确指出来，免得综合者把“没有结果”读成“没有活动”。
- **Notebook 不可查询。** SQL MCP 看不到 Databricks notebooks。如果你怀疑动机记录在某个 notebook 里，返回一个缺口。

## 应该返回什么

对每一条相关发现：
- 类型（产品事件 / 实验曝光 / 用量或计费事件 / 系统表行 / dbt 模型）
- 完全限定表名，以及你实际执行的查询
- 查询的时间窗口
- 紧凑的数值摘要（计数、百分位数、首次/末次出现时间戳）。**不要倾倒原始数据行。**
- 与目标发布日期的时间相关性（例如“首行出现于 2024-08-15，PR #49074 于 2024-08-14 合并”）
- 相关性 + 强度：直接 / 间接 / 弱
