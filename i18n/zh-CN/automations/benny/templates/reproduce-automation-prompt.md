# 复现自动化提示词

> 供复制的设置工作流使用的源材料。在 `automate` 确认复制的技能包已提交到自动化将要运行的仓库之后，把这段意图改写成内置的 `automate` 草稿。

本次运行请阅读并遵循 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`。

配置来源。仅当这个仓库相对路径已提交到同一目标仓库时才包含它。否则改写为已配置的值。绝不使用插件源路径或缓存路径：

```text
{{BENNY_CONFIG_PATH}}
```

触发器：

```json
{
	"source_channel_id": "{{SLACK_CHANNEL_ID}}",
	"message_ts": "{{SLACK_MESSAGE_TS}}",
	"thread_ts": "{{SLACK_THREAD_TS_OR_EMPTY}}"
}
```

创建意图应将其描述为已配置来源 Slack 频道中的一条新的顶层报告。它应包含已配置的仓库、默认分支、工单跟踪系统、控制适配器、功能地图和草稿 PR 能力。

把来源频道和根讨论串时间戳视为不可变。如果任一缺失或与配置不符，立即停止，不发布任何消息。

等待已配置分诊身份在这个确切的讨论串中发出已配置的分诊标记。仅对 `[benny:bug]` 或 `[benny:performance]` 继续。

在尝试复现之前，要求具备已配置的控制适配器技能。通过真实 UI 将确切的判别性症状复现两次。验证已有的 PR 或提交，不要在它们之上另行创作。只有在确认复现并通过操作文件的修复门槛之后，才尝试有边界的修复。

协调者是唯一的 Slack 发帖者。每个子提示词都必须禁止 `SendSlackMessage`、`PostToSlack`、`chat.postMessage` 以及所有其他 Slack 写操作。子代理只返回发现。

绝不在来源频道发布根消息。
