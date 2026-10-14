# 改代码之前先理解它

修改你不理解的代码，正是微妙回归溜进线上产品的方式——这一点对代理和你同样成立。代理通常以两种方式之一失败：误读了你的意图，或缺少把工作做对的上下文。[提示词里放什么](./02-poteto-mode.md#what-goes-in-a-prompt) 解决第一种，本页解决第二种。

pstack 给你四个入口。`/how` 解释代码现在做什么。`/why` 挖出它之所以长成这样的原因。`/teach` 把两者融合成一次讲解。`/recall` 重建你自己在某个主题上的近期上下文。每一个还会让代理用你能检验的语言解释自己。你就是这样监督一个可能比你更懂代码的代理的。

![一位侦探拿着放大镜研究机器蓝图，机器人们在一旁取来案卷；她身后的证据板在 /how 和 /why 之下把线索连在一起。](./images/understanding.jpg)

## 从只读调查开始

当原因不明时，要的是发现，不是修复：

```text
/poteto-mode investigate why background jobs time out every few hours. give me what we know, what data you used, and your best hypotheses. don't change any code yet.
```

"don't change any code yet" 会把它路由到 [Investigation 行动手册](../../skills/poteto-mode/playbooks/investigation.md)。它运行 `/how`，对动机类问题加上 `/why`，并返回一份带引用的解释。对于选项之间的取舍，它返回一份带权衡表格的建议。问一句"what data you used"，会迫使代理把证据与猜测分开。当发现指向一个修复时，把它作为新任务启动。

## 用 `/how` 追踪行为

```text
/how do we dedupe notifications? is there an n+1 when we look up subscribers?
```

问出你真正想问的问题。[`/how`](../../skills/how/SKILL.md) 阅读代码，以资深工程师带你熟悉子系统的水平作答：运行时流程、关键类型、不直观的部分。对大的子系统，它会先派出两到四个只读探索者。对狭窄的问题，它直接读代码然后解释。

## 用 `/why` 挖出历史

```text
/why was the retry limit set to five? does the reason still hold?
```

[`/why`](../../skills/why/SKILL.md) 像侦办悬案的侦探一样工作。它从版本控制开始，然后并行查询你的 MCP 暴露的所有证据类别——工单跟踪、长文档、团队聊天、可观测性、错误跟踪、分析数据。报告引用一切来源，把直接证据与推断分开，并在记录单薄时说"看起来是"。空结果也会被报告，因为"没人写下原因"本身就是一个答案。

两者天然可以组合。当你怀疑历史能解释这团乱麻时，`do why first then how` 是一条完全合格的提示词。

## 用 `/teach` 真正弄懂

```text
/teach me how this PR changes retries. convince me it fixes the cause and not the symptom.
```

[`/teach`](../../skills/teach/SKILL.md) 用于摘要不够的时候。它运行 `/how` 和 `/why`——对小改动也许只运行其中一个——并把发现编织成一份平实的讲解，一张图一张图地逐步构建。"convince me"（说服我）这个框架值得借鉴：它把讲解变成一场你可以戳一戳的论证，而不是一次参观。

它对代理自己的取舍同样有效：

```text
/teach me why you implemented it this way and not with a queue. what did you trade off, and why?
```

讲解对代理的帮助不亚于对你的帮助。一个必须解释自己工作的代理，必须去读代码并为每个论断拿出证据，而不是自信地断言然后继续往前走。

## 用 `/recall` 重建你自己的上下文

```text
/recall catch me up on the export work from last week
```

[`/recall`](../../skills/recall/SKILL.md) 挖掘你自己近期的聊天加上共享记录（工单、之前的修复、仍在触发的错误），交回一份关于现状和下一步的简报。你的旧聊天保存着新代理没有的上下文，所以在旧主题上开新工作时，先把它加载进来，再交出新的输入：

```text
/recall my work on the virtualized list from yesterday, then read this bug report.
```

如果你想恢复某一个具体聊天，那是下面的 Session pickup 行动手册，不是 `/recall`。

## 用 Session pickup 接手之前的工作

当另一个代理（或上周的你）把一个分支留在半途：

```text
/poteto-mode take over this branch. read the decision log, figure out what's done, and continue from there. don't redo finished work.
```

[Session pickup 行动手册](../../skills/poteto-mode/playbooks/session-pickup.md) 把之前留下的轨迹当作权威。它重建分支状态和决策，指明恢复点，并对着原始目标验证继承来的结论，而不是一切从头推导。

**陷阱：** 不要因为"代理反正会读代码"就跳过本页的技能。没有追踪过的模型就直接动手改代码的代理，倾向于在第一个看似合理的地方修症状。先跑 `/how`，比修第二个 bug 便宜。

下一篇：[设计变更](./04-design.md)。
