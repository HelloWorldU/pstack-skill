# 来源行动手册

why 技能为每个可用的证据类别派出一名调查员，每人只读下面一份针对该来源的行动手册。这些手册是针对常见 MCP 的具体示例。同一类别换用不同的 MCP 时，照此改编。

| 类别 | 行动手册 | 手册所基于的 MCP 示例 |
|---|---|---|
| 版本控制历史 | [`code-archaeology.md`](./sources/code-archaeology.md) | git、`gh` |
| 工单 / 任务跟踪 | [`linear.md`](./sources/linear.md) | Linear（可改编用于 Jira、GitHub Issues、Plane、Shortcut） |
| 长文档 | [`notion.md`](./sources/notion.md) | Notion（可改编用于 Confluence、Google Docs、Coda） |
| 团队即时聊天 | [`slack.md`](./sources/slack.md) | Slack（可改编用于 Discord、Microsoft Teams、Mattermost） |
| 基础设施可观测性 | [`datadog.md`](./sources/datadog.md) | Datadog（可改编用于 New Relic、Honeycomb、Grafana、Splunk） |
| 错误 / 异常跟踪 | [`sentry.md`](./sources/sentry.md) | Sentry（可改编用于 Rollbar、Bugsnag、Airbrake） |
| 产品分析数仓 | [`databricks.md`](./sources/databricks.md) | Databricks SQL（可改编用于 Snowflake、BigQuery、ClickHouse、dbt） |

跨来源通用：

- [`incident-postmortem.md`](./sources/incident-postmortem.md)。如果目标代码看起来是防御性的（空值检查、重试、超时、限流、特性开关、出口守卫、OOM 处理），追加这一份。
