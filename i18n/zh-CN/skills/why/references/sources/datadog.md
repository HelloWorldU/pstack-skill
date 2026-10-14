# Datadog 遥测

## 这个信息源包含什么

Datadog 保存运行时记录——生产环境里实际发生了什么，与计划过或讨论过的东西相对。

- **指标（Metrics）。** 团队埋点的计数器、仪表值、直方图。一个指标的*存在本身*就是证据：有人认为这个数字值得盯。
- **监控器与告警（Monitors & alerts）。** 团队认为值得把人叫醒的条件。一个会在 `rate_limit_hit > 10/min` 时触发的监控器，是团队担心这个阈值的直接证据。
- **仪表盘（Dashboards）。** 团队认为某个子系统中重要内容的精选视图。
- **APM traces 与 spans。** 请求级的运行时数据，用于回答“这里为什么慢”/“这里为什么有超时”这类问题。
- **日志（Logs）。** 海量事件记录，往往保存着促成防御性代码的错误状况。
- **事故（Incidents）。** 带有时间线和关联复盘的正式事故记录。
- **Notebooks。** 团队的探索性调查，常带有假设和分析。

## 如何搜索

使用 Datadog MCP。先广撒网，再收窄。

1. **确定归属服务。**

   ```
   search_datadog_services (filter by name or team)
   search_datadog_service_dependencies (see upstream/downstream)
   ```

2. **先看仪表盘和监控器。**

   ```
   search_datadog_dashboards (query: feature name, service name, symbol)
   search_datadog_monitors   (same queries)
   ```

   当某个仪表盘或监控器覆盖目标时，记下它的查询和盯守的阈值。阈值往往就是“为什么这里被钳制在 N？”的答案。

3. **目标周边的指标。**

   ```
   search_datadog_metrics (by name pattern, e.g., the feature or symbol)
   get_datadog_metric_context (metadata: description, units, tags)
   get_datadog_metric (timeseries; "was there a spike around the PR date?")
   ```

   把指标的轨迹与目标的添加/变更日期关联起来是强有力的佐证：“`payment_timeout` 指标在 2023-11-03 飙升，重试逻辑于 2023-11-06 合并。”

4. **日志。收窄，别倾倒。**

   ```
   search_datadog_logs (raw log patterns near the target, set use_log_patterns=true)
   analyze_datadog_logs (SQL-style aggregations, only when you need counts)
   ```

   用符号、错误字符串或功能名搜索。**强烈建议限定时间范围**（例如变更前后各 30 天）。

5. **APM spans 与 traces。**

   ```
   aggregate_spans    (stats: "how often does this endpoint fail?")
   search_datadog_spans (inspect individual spans)
   get_datadog_trace  (a specific trace ID)
   ```

   对超时、重试、慢路径和跨服务行为很有用。

6. **事故。**

   ```
   search_datadog_incidents (by title, team, date range)
   get_datadog_incident     (full detail for a specific incident)
   ```

   如果目标看起来是防御性的，搜索它被添加前后的事故。时间线里包含 “added defensive check for X” 的事故，是近乎直接的证据。

## 这里什么样的证据算好证据

- 一个监控器，其查询和阈值与代码强制的约束相吻合（代码钳制在 100，监控器在请求超过 100/min 时告警）
- 由目标代码作者创建的仪表盘，其中的 widget 与代码所测量或防范的内容相对应
- 一个指标在代码合并前一刻出现生产尖峰，之后保持稳定
- 引用了目标代码、相同符号或相同错误字符串的事故记录
- 日志显示防御性代码本可防止的特定错误模式，时间戳落在变更之前的窗口内

## 常见陷阱

- **相关不是因果。** PR 之前的尖峰和之后的稳定是提示性的，不是定论——同一窗口里可能还落了别的变更。检查相邻的 PR。
- **过度拟合你找到的图表。** 图表反映的是制作者的框架。一个叫 “retry success rate” 的图表证明团队关心重试成功率，并不能证明某一行代码为什么存在。
- **消失的遥测。** 指标可能被重命名、删除，或者留存期很短。如果你找不到相关窗口的数据，那是缺口，不是空结果。
- **规模带来的噪音。** 按服务、标签和时间窗口积极地收窄日志搜索。用 `analyze_datadog_logs` 聚合，而不是倾倒原始日志。
- **被埋点 ≠ 因果。** 指标说明有人觉得值得测量某个东西，并不能说明代码是*因为它*才加的。与提交/PR 日期交叉核对。

## 应该返回什么

对每个相关条目：
- 类型（仪表盘 / 监控器 / 指标 / 日志模式 / trace / 事故 / notebook）
- 标题或名称
- 链接或标识符（仪表盘 ID、监控器 ID、指标名、事故 ID）
- 负责人/作者及创建/修改日期
- 与问题相关的具体条件、查询或原文（尽量逐字引用）
- 相关性：这对目标代码暗示了什么，关联强度如何
