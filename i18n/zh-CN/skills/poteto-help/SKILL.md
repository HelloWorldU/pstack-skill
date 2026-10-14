---
name: poteto-help
description: 引导用户完成 pstack 设置、/poteto-mode 的使用，并为任务挑选合适的技能、行动手册或原则。输入 /poteto-help 并附上你的问题。
disable-model-invocation: true
---

# Poteto 帮助

回答用户关于 pstack 的问题，递给他们一条可以直接发送的提示词，并附上答案来源文件的链接。对于帮助类问题，不要直接开工。用户问的是"怎么做"，而一次 pstack 运行要消耗实打实的 token，所以把提示词交给他们自己发送。

如果消息是在请求干活，比如"use pstack to fix this bug"，那就不是帮助类问题。阅读 [`poteto-mode`](../poteto-mode/SKILL.md)，在它之下完成工作，并顺带提一次：自定义模式（Custom Mode）可以让它持续生效。

本文件把问题映射到持有答案的技能和指南页面上。细节以那些文件为准。引用之前，先阅读你路由到的那个文件；当它与本映射不一致时，以它为准。这里的链接指向已安装插件的内部，用户可能打不开，所以要给用户该文件的公开副本：`https://github.com/cursor/plugins/blob/main/pstack/` 后接其路径。

## 弄清他们需要什么

从消息和对话中推断需求。如果是有明确指向的情形，比如"哪个技能评审 PR？"，直接跳到对应小节。如果需求仍不清楚，问一道单选题，选项如下，然后只回答他们选中的那一节：

- 完成安装设置
- 用 `/poteto-mode` 开始一个任务
- 为某个情形挑选技能
- 修复一次出错的运行
- 把 pstack 变成我自己的

检查那些会改变答案的状态，并且只在它确实改变答案时才提及：

- 没有 `~/.cursor/rules/pstack-models.mdc` 意味着这个用户还没运行过 `/setup-pstack`，所以每个角色都使用默认模型。
- 项目中没有 `verify-*` 技能或其他应用驱动装置，意味着代理没有以脚本方式驱动应用的途径。当问题涉及证明改动有效时，提及 `/create-verification-skill`。

当模型规则缺失且这一点要紧时，询问用户是否现在就想为每个角色挑选模型并设定推理预算。以下情况属于要紧：用户是新手、问题关于设置或成本、或答案取决于运行哪些模型。每次对话最多问一次。如果需求也不明确，把两个问题一起问。提供两个选择：

- 现在：把 `/setup-pstack` 给他们输入，同时也回答他们的问题。
- 稍后：回答他们的问题，并加一行说明：在运行 `/setup-pstack` 之前，每个角色都保持默认模型。

## 完成安装设置

1. 在聊天中输入 `/add-plugin pstack` 安装，或从侧边栏的 Customize 进入安装。
2. 运行 [`/setup-pstack`](../setup-pstack/SKILL.md)。它会询问推理预算，为每个角色映射一个模型，并写入一条规则。该规则对新对话生效。
3. 用 `/poteto-mode`、一个目标和一个可判定通过或失败的检查，开始一个真实任务。

在用户调用某个技能之前，安装本身不改变任何东西。只有 `/setup-pstack` 会从用户的话语中自动加载。细节见 [README](../../README.md) 和[指南第 1 页](../../docs/guide/01-setup.md)。按照 [`references/prompting.md`](references/prompting.md)，主动提出帮他们措辞第一条提示词。

如果用户担心的是成本，说明 token 花在了哪里以及如何少花。pstack 的额外 token 消耗在子代理和评审面板上。重新运行 `/setup-pstack`，选择更小的预算或更便宜的模型。设置为 `auto` 或 `inherit-parent` 的角色运行在对话所用的模型上，当对话使用 Auto 或更便宜的模型时就能省 token。更短的面板列表意味着运行更少的子代理——每个条目一个。把 `/poteto-mode` 留给需要严谨对待的工作。

pstack 是为 Cursor 打造的。它的技能采用 Agent Skills 格式，所以其他工具也能读取。但大多数工作流技能——包括 `/poteto-mode`、`/how`、`/why` 和 `/teach`——会以按角色配置的模型派生 Cursor 子代理，而自定义模式和 `/loop` 是 Cursor 的功能，所以这些部分在其他工具里可能无法工作。

## 用 `/poteto-mode` 开始一个任务

`/poteto-mode` 会把任务匹配到一本行动手册，把手册的步骤复制进待办列表，并在步骤需要时运行其他技能。被跳过的步骤会以 `skip: <原因>` 的形式留在列表里。好的提示词说明目标以及如何判定完成，不会罗列技能——因为手写的技能序列往往会丢掉或重排行动手册本来会保留的步骤。帮忙措辞之前先阅读 [`references/prompting.md`](references/prompting.md)。示例见[指南第 2 页](../../docs/guide/02-poteto-mode.md)。

`/poteto-mode` 是否持续生效，取决于用户的启动方式：

- 在 `/poteto-mode` 上按 Enter，会把技能附加到这一条消息上。随着对话推进，它会逐渐淡出。
- 在 Mac 上按 Option+Enter 或在 Windows 上按 Alt+Enter，或从技能条目选择 Use as Mode，会把它变成自定义模式（Custom Mode）。此后每一轮它都在上下文中，直到用户退出该模式；而闲聊性质的轮次不会带上它。
- Cursor 的文档在 Agents 窗口和 CLI 中列出了自定义模式。在其他地方，每个新任务都用 `/poteto-mode` 开头。

话题涉及此处时，附上 [Cursor 的技能文档](https://cursor.com/docs/skills)链接。对话进行到一半时说"new task"（新任务），会让模式重新匹配一本新的行动手册。`/poteto-mode` 为其行动手册步骤派生的子代理本来就会使用 `poteto-agent`。想让自己派生的子代理也获得同样的风格，用 `subagent_type: "poteto-agent"` 来启动它。

## 挑选技能

默认答案是 `/poteto-mode`，它会在步骤需要时运行大多数其他技能。当用户想要的比行动手册给的更多或更少时，直接点名某个技能。推荐之前先阅读那个技能，并给出一条示例提示词。

| 用户想要 | 技能 |
|---|---|
| 严谨地完成任何非平凡任务 | [`/poteto-mode`](../poteto-mode/SKILL.md) |
| 在开始之前确认代理理解了他们的目标和问题 | [`/in-your-own-words`](../in-your-own-words/SKILL.md) |
| 在开始前把任务定得更高：更专业、更聚焦成果、不过度规定细节 | [`/sharpen`](../sharpen/SKILL.md) |
| 了解代码现在如何工作，或新代码应该放在哪里 | [`/how`](../how/SKILL.md) |
| 了解代码为什么是现在这个样子，或某个数字从何而来 | [`/why`](../why/SKILL.md) |
| 用平实的语言理解一个改动或子系统 | [`/teach`](../teach/SKILL.md) |
| 回顾自己最近在某个主题上的工作 | [`/recall`](../recall/SKILL.md) |
| 用几句平实的话和小图示，回顾自上次发消息以来这个对话里发生的变化，并附带足够上下文来决定每个待办事项 | [`/ketchup`](../ketchup/SKILL.md) |
| 知道一个小 diff 可能在自身之外破坏什么 | [`/blast-radius`](../blast-radius/SKILL.md) |
| 在跨越函数边界的代码动工之前，先敲定类型和模块形态 | [`/architect`](../architect/SKILL.md) |
| 对同一份简报做多次尝试，合并出最好的一个 | [`/arena`](../arena/SKILL.md) |
| 以云端代理方式对各个切片并行检查，或让多个工人竞速 | [`/swarm`](../swarm/SKILL.md) |
| 让不同的模型评审一个 diff 并尝试击破它 | [`/interrogate`](../interrogate/SKILL.md) |
| 当存在廉价的本地测试时，以测试先行的方式修 bug | [`/tdd`](../tdd/SKILL.md) |
| 把 TypeScript 规则应用到 `.ts` 或 `.tsx` 工作上 | [`/typescript-best-practices`](../typescript-best-practices/SKILL.md) |
| 在评审前剥离注释，由没写过这些注释的评审者来看 | [`/no-comments`](../no-comments/SKILL.md) |
| 清除散文中的 AI 痕迹 | [`/unslop`](../unslop/SKILL.md) |
| 按标准写文档、RFC、README、PR 描述或提交信息 | [`/technical-writing`](../technical-writing/SKILL.md) |
| 用大白话再听一遍上一条回复 | [`/bro`](../bro/SKILL.md) |
| 给代理一个以脚本方式驱动应用并证明行为的途径 | [`/create-verification-skill`](../create-verification-skill/SKILL.md) |
| 让验证技能及其功能地图重新与应用对齐 | [`/maintain-verification-skill`](../maintain-verification-skill/SKILL.md) |
| 在报告或依据某个性能数字行动之前，先审查它 | [`/benchmark-checklist`](../benchmark-checklist/SKILL.md) |
| 运行一个大型或跨面的改动，或一个离开后再回来评审的改动 | [`/figure-it-out`](../figure-it-out/SKILL.md) |
| 在一次运行中维护决策日志，并在事后回顾 | [`/show-me-your-work`](../show-me-your-work/SKILL.md) |
| 为每个角色挑选模型并设定推理预算 | [`/setup-pstack`](../setup-pstack/SKILL.md) |
| 把自己的工作习惯变成个人模式技能 | [`/automate-me`](../automate-me/SKILL.md) |
| 把已完成任务带来的教训转化为技能修改 | [`/reflect`](../reflect/SKILL.md) |
| 阻止代理在这个仓库里重蹈覆辙 | [`/correct`](../correct/SKILL.md) |
| 构建一个按钮能通过 webhook 唤醒 Grok Bot 的页面 | [`/make-bot-ui`](../make-bot-ui/SKILL.md) |
| 在 pstack 里找到方向 | `/poteto-help` |

如果与本技能相邻的某个技能目录不在表中，阅读它的 frontmatter，按 description 路由。`principle-*` 目录在下文的原则部分统一说明。

容易混淆的取舍：

- `/how` 解释代码做什么。`/why` 解释背后的原因。`/teach` 运行其中之一或两者，并用平实的语言解释结果。
- `/arena` 给每个工人同一份简报，然后合并出最好的部分。`/swarm` 把工作切成切片或组织成竞速，返回一份报告。
- `/architect` 敲定设计后立刻动手实现。加上"with checkpoint"可以在它写代码之前先评审设计。
- `/interrogate` 评审 diff 本身。`/blast-radius` 寻找 diff 之外的破坏，并证明那个让改动安全成立的关键事实。
- `/recall` 跨最近的对话重建上下文。`/ketchup` 只覆盖自用户上一条消息以来的本次对话。恢复某个特定对话或分支属于 Session pickup 行动手册。
- `/figure-it-out` 设计一次严谨的运行。Orchestrate 行动手册运行一个跨越数天和多个 PR 的项目。Autonomous run 行动手册把单个任务推进到完成条件。

不在 pstack 中：

- `/deslop`、`control-cli` 和 `control-ui` 随 `cursor-team-kit` 插件提供。
- `/loop` 和 `/create-skill` 是 Cursor 内置功能。
- pstack 没有 `/orchestrate` 技能。Orchestrate 是 `/poteto-mode` 的一本行动手册。如果斜杠菜单里出现了 `/orchestrate`，那是另一个插件提供的。

## 行动手册与原则

行动手册是 `/poteto-mode` 内部的步骤清单，不是技能，所以没有斜杠命令。在 `/poteto-mode` 内部，描述任务即可让它挑选一本；而以下这些短语可以直接点名：

- "babysit this pr" 或 "check on pr 123" 会运行 Babysit。它把 PR 推进到可合并（merge-ready）就停下。除非用户要求合并（merge、land 或 ship），否则它不会合并。
- "land the stack" 运行 Shipping。
- "take over this branch" 运行 Session pickup。
- "pause safely" 运行 Pause safely。
- "full autopilot on this queue" 运行 Autopilot-full。"stack them, don't ship" 运行 Autopilot-stack。
- "run the eval playbook" 运行 Eval。

如果没有 `/poteto-mode`，像 "babysit this pr" 这样的短语可能会转而启动 Cursor 自带的同类技能。[`poteto-mode`](../poteto-mode/SKILL.md) 的 Playbooks 一节列出了所有行动手册及其适用时机。[指南第 6 页](../../docs/guide/06-verify-and-ship.md)涵盖 PR 的开启、看护与落地。

pstack 没有规划类技能，Cursor 的 Plan Mode 可以与它配合。对于跨阶段或涉及堆叠 PR 的工作，让 `/poteto-mode` 出一份计划会运行 [Multi-phase plan 行动手册](../poteto-mode/playbooks/multi-phase-plan.md)——它只写计划，不动手实现。对于设计问题，Prototype 行动手册或 `/architect` 会先在代码里把它敲定。

原则是一条规则构成的技能，`/poteto-mode` 会阅读它们并在回复中引用。用户很少直接调用某个原则，而是用名字来引导，比如说"apply prove it works. show me the real output."。输入 `/principle-<名称>` 仍可按需加载某个原则。完整列表见[指南第 8 页](../../docs/guide/08-principles.md)。

## 修复一次出错的运行

| 症状 | 修复办法 |
|---|---|
| 模式在几轮之后不再生效 | 它是用 Enter 启动的。改用自定义模式启动，或每个任务都以 `/poteto-mode` 开头。 |
| 一个问题被当成了上一个任务的下一步 | 说"new task"（新任务），或说明这一轮不需要模式。 |
| 新选的模型没有生效 | `/setup-pstack` 写入的规则对新对话生效。开一个新对话。 |
| 运行花费超出预期 | 见"完成安装设置"一节中的成本段落。 |
| 某个技能没有自动加载 | 只有 `/setup-pstack` 会从用户的话语中自动加载。其他技能在用户输入它们时加载，或由 `/poteto-mode` 运行时加载——而它并不会运行每个技能。 |
| 并行代理互相覆盖了对方的成果 | 给每个代理分配自己的 worktree，或以云端代理方式运行——云端代理各自独占一台机器。 |
| 通宵运行动了很多却没完成任何事 | `/loop` 需要一个可判定通过或失败的检查，而不是一个时长。见[指南第 7 页](../../docs/guide/07-overnight.md)。 |
| 回复凭一次绿色构建就宣称成功 | 要求给出真实的命令、流程、存储的值或画像数据。这就是"证明它有效"（prove-it-works）原则。 |

对于逐渐跑偏的运行，[`references/prompting.md`](references/prompting.md) 提供了一句话纠偏句式。[指南第 10 页](../../docs/guide/10-recipes-and-pitfalls.md)有更多陷阱和值得抄的配方。

## 把 pstack 变成我自己的

- [`/automate-me`](../automate-me/SKILL.md) 根据用户自己的历史起草一个个人模式技能，与 `/poteto-mode` 搭配使用。
- 会话结束后运行 [`/reflect`](../reflect/SKILL.md)，把经验教训变成由用户批准的技能修改。
- `/poteto-mode write a skill for <workflow>` 会运行技能编写行动手册。eval 行动手册则以盲测方式检验技能改动。
- 行为异常的技能要在它自己的 PR 里修复，不要混进出问题的那项功能工作里。

[指南第 9 页](../../docs/guide/09-make-it-yours.md)逐条覆盖这些内容。

## 回复方式

开门见山先给答案。最多给一条示例提示词（放在代码块里），合适时从 [`references/recipes.md`](references/recipes.md) 改编，然后附上该文件的链接。除非用户要完整地图，否则保持简短。
