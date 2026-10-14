# 分诊自动化提示词

> 供复制的设置工作流使用的源材料。在 `automate` 确认复制的技能包已提交到自动化将要运行的仓库之后，把这段意图改写成内置的 `automate` 草稿。

本次运行请阅读并遵循 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`。

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

创建意图应将其描述为已配置来源 Slack 频道中的一条新的顶层报告。

把来源频道和根讨论串时间戳视为不可变。如果任一缺失或与配置不符，立即停止，不发布消息，也不写入工单跟踪系统。

已提交的操作文件负责分类、附件审阅、原因追溯、路由、去重、跟踪系统写入和最终结论。不发布进度消息。绝不在来源频道发布根消息。

协调者是唯一的 Slack 发帖者。任何被委派的工作者必须是只读的、只返回发现，并被明确禁止一切 Slack 写操作。

以恰好一个已配置标记结束唯一的结论：

```text
[benny:bug]
[benny:performance]
[benny:other]
```

bug 或性能标记可以追加 `tracker=<URL>`。
