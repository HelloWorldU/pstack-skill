---
name: reflect
description: "在活动转录上并行派生三名评审子代理，浮现可沉淀的教训，并把每条教训路由到对某个现有技能的具体修改。当用户说 reflect 时使用。"
disable-model-invocation: true
---

# Reflect

挖掘当前对话中可沉淀的教训，然后把它们路由成技能修改。

当用户说「reflect」或「/reflect」时调用。对话琐碎、跑题、或已被父代理正确遵循的现有技能覆盖时跳过。一次性的个例不是教训。

## 1. 定位活动转录

扇出之前，在系统提示词给出的 `agent-transcripts/` 目录里找到本次对话的转录。不要跨 `~/.cursor/projects/*/` 去 glob。那会跨越工作区边界，读到无关项目的私密对话。

```bash
ls -t <agent-transcripts>/*.jsonl <agent-transcripts>/*/*.jsonl <agent-transcripts>/*/subagents/*.jsonl 2>/dev/null | head -10
```

这覆盖了旧的扁平布局（`<id>.jsonl`）、当前的嵌套布局（`<id>/<id>.jsonl`）和子代理布局（`<parent>/subagents/<child>.jsonl`）。对每个候选文件，读它的第一行 JSONL。取 `message.content[0].text` 包含本次对话开场用户消息的那个文件。如果没有匹配，改为传一份紧凑的会话摘要。

## 2. 并行派生三名评审员

一条消息，三个 `Task` 调用，`subagent_type: generalPurpose`，agent 模式（`readonly: false`）。评审员需要 MCP 访问权限来查转录引用的工单、聊天线程和可观测性链路，而 readonly 会剥掉 MCP。

每名评审员和综合者都在 `pstack-models.mdc` 规则里有一条角色行和一个默认值。把 `model` 设为该行的值；规则或该行缺失时用默认值。当值为 `auto` 或 `inherit-parent` 时，不要设置 `model`。如果 Task 工具拒绝某个 slug，改用默认值并说明情况。如果连默认值也被拒绝，从报错信息里取同系列最接近的有效 slug。每个子代理的推理档位和快速或标准速度，按 **poteto-mode** 技能的 Subagents 一节为这项任务来挑。

| 视角 | 角色行 | 默认 `model` | 提示词模板 |
|---|---|---|---|
| 判断（Judgment） | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/judgment-reviewer.md` |
| 工具（Tooling） | `reflect tooling` | `grok-4.7-xhigh-fast` | `references/tooling-reviewer.md` |
| 发散（Divergent） | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/divergent-reviewer.md` |

把每个模板逐字传入，在标记处替换为转录路径或摘要。评审员在 `Task` 响应正文里返回发现。

## 3. 综合

一次 `Task` 调用，`subagent_type: generalPurpose`，`model` 取 `reflect judgment, divergent, synthesizer` 那一行（默认 `claude-opus-5-5-xhigh`），agent 模式（`readonly: false`）。它会通过 MCP 对引用做抽查核实，而 readonly 会剥掉 MCP。把 `references/synthesizer.md` 逐字传入，在标记处内联每位评审员的完整输出。它返回一份 Accepted / Rejected / Backlog（已接受 / 已驳回 / 待办）清单。

## 4. 结构性强制检查

把 Accepted 清单里那些用 lint 规则、脚本、元数据开关或运行时检查能更可靠地强制执行的条目移到 Backlog。参见 **encode-lessons-in-structure** 原则技能。

## 5. 应用

把综合者完整的 Accepted / Rejected / Backlog 输出呈现给用户，在应用任何 Accepted 修改之前等待明确批准。由用户挑选子集，并可能改道路由。技能修改影响组织里每一个未来的代理。不要自动应用。

Backlog 条目不必等待，直接逐条提交到团队的 devex 或待办追踪器。只有 Accepted 清单需要等批准。

严格按照每个获批行的路由执行：

- 对现有技能的琐碎修改（加一行要点、收紧一句话、纠正一个过时事实）：父代理直接做。
- 对现有技能的实质修改（新小节、新模式表格、超过约 10 行）：交给 Cursor 内置的 `create-skill` 技能，跑它的起草 / 测试 / 迭代循环。
- `tune description: <skill path>`（技能存在，但本该触发时没触发）：交给 `create-skill`，跑它的 description 优化循环。
- `new skill via create-skill: <kebab-name>`：交给 `create-skill` 创建。不要临时自创结构。

如果你的环境自带 SKILL.md 校验器，在宣布完成之前对每个被改动的技能跑一遍。

## 6. 向用户汇报

简短列表，不要前言：

- 已应用的修改：`<skill path>`。改了什么，每条一行。
- 新建的技能：`<skill path>`。每条一行（罕见）。
- 已提交到 devex 追踪器的待办：`<issue title>`（`<tags>`）。每条一行。
- 已丢弃：每条被驳回的发现一行，附综合者给出的理由。
