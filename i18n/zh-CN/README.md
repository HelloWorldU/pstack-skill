# pstack

我是 [poteto](https://x.com/poteto)。我既不是总裁也不是 CEO，但我在 Meta、Netflix 和 Cursor 经手过数百万行代码。我也是 React 核心团队的成员，参与构建和维护 React Compiler。

越来越多的人觉得 AI 写出来的泔水代码太多了。我同意。我不想像一个二十人的泔水艺术家团队那样交付。没有质量的吞吐量不是我向往的目标。想走得快，先往深里钻。

**pstack 就是我的答案。**这些就是我在 Cursor 每天用来交付高质量代码的同一套技能。它把 Cursor 变成一支真正的工程团队。目标不是最大化代码行数，事实上恰恰相反。pstack 帮你写得更少，但写得更好。

**pstack 给你无所畏惧的并行。**当你能让一个代理深入一件事、并信任它写出良好且可验证的代码时，你才能真正放心地并行。用 `poteto-mode` 同时启动多个代理，放心它们会把严谨的工程原则应用到自己的工作中。

**Cursor 让你兼得各家之长。**每个前沿模型都有自己的强项和弱项。pstack 可以搭配任何模型使用。事实上，我的很多技能都使用多模型工作流，以发挥每个模型的独特强项。

fork 它，改进它，把它变成你自己的。欢迎 PR！

## 安装

```bash
/add-plugin pstack
```

## 快速上手

两步：

1. 运行 [`/setup-pstack`](./skills/setup-pstack/SKILL.md)，选一个推理预算，并选择你想用的模型。
2. 每当要做需要严谨对待的事情时，使用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)。

刚来？[pstack 指南](./docs/guide/README.md) 会带你完成第一个真实任务，从安装配置、写提示词，到验证和过夜运行。卡住了，或者不确定哪个技能合适？问 [`/poteto-help`](./skills/poteto-help/SKILL.md)。

就这些。其他技能是场景性的；模式技能会在需要时替你调用它们。开箱即用时，模式按模型强项拆分工作：代码委托（feature、refactoring、bug fix、perf、hillclimb）交给 grok，最难的改动、行文和判断交给 opus 5.5。默认评审小组是 opus 5.5 / grok。[`/setup-pstack`](./skills/setup-pstack/SKILL.md) 可以改动其中任何一项。

## 用法

在任务开始时使用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)。它读取你的请求，从一组行动手册中挑出合适的，并在各步骤需要时运行其他技能。

输入任务之前，先从 `/` 菜单中选择 `/poteto-mode`，这样 Cursor 会把这个技能附加到这条消息上。

### 只用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md) 就够了

这个技能是主力捷径。只要我需要代理做严谨的工程工作，我就用它。它自带二十三本行动手册：

```
/poteto-mode this pr has a subtle bug where the scroll drifts every 750ms even when idle. repro
first, then fix and verify.
```

```
/poteto-mode i'm going to bed. land the stack even if ci flakes. i want everything merged by
morning.
```

<details>
<summary>二十三本行动手册</summary>

| 行动手册 | 用途 |
|---|---|
| [调查](./skills/poteto-mode/playbooks/investigation.md) | 一个只读的问题。x 是怎么工作的、y 为什么这样构建、我们确定吗。 |
| [bug 修复](./skills/poteto-mode/playbooks/bug-fix.md) | 复现一个缺陷、定位根因，并带着运行时证据修复。 |
| [perf](./skills/poteto-mode/playbooks/perf-issue.md) | 追踪一处实测的变慢，并相对基线做出改进。 |
| [hillclimb](./skills/poteto-mode/playbooks/hillclimb.md) | 围绕一个目标对单项指标做持续的、科学化的改进：循环提出假设，前后对比测量，每接受一个收益提交一次。 |
| [运行时取证](./skills/poteto-mode/playbooks/runtime-forensics.md) | 通过插桩诊断一个活着的症状（泄漏、CPU 空转、偶发异常）。 |
| [trace 取证](./skills/poteto-mode/playbooks/trace-forensics.md) | 诊断一份已捕获的性能分析产物（cpuprofile、trace、spindump、堆快照）。 |
| [feature](./skills/poteto-mode/playbooks/feature.md) | 新增或变更的行为，从一个命名的数据形态开始构建。 |
| [重构](./skills/poteto-mode/playbooks/refactoring.md) | 一次保持行为不变的结构或形态调整。 |
| [原型](./skills/poteto-mode/playbooks/prototype.md) | 一张用完即弃的草图，用来低成本地做设计或行为决策，或通过实际观察来裁决一个经验性的分岔。 |
| [视觉对齐](./skills/poteto-mode/playbooks/visual-parity.md) | 两个实现之间像素级精确的 UI 一致性。 |
| [编写技能](./skills/poteto-mode/playbooks/authoring-a-skill.md) | 编写或修改一个 SKILL.md。 |
| [eval](./skills/poteto-mode/playbooks/eval.md) | 以盲测方式检验一次技能或提示词改动对代理行为的影响。 |
| [babysit](./skills/poteto-mode/playbooks/babysit.md) | 把一个 PR 或一叠 PR 推进到可合并状态：冲突、评审讨论串、CI。 |
| [shipping](./skills/poteto-mode/playbooks/shipping.md) | 独立验证一个全绿的堆叠，然后自底向上把连续已验证的一段落地合并：默认走 GitHub，可用 origin 时走 origin。 |
| [自治运行](./skills/poteto-mode/playbooks/autonomous-run.md) | 不停顿地把一个长任务推进到完成。 |
| [编排](./skills/poteto-mode/playbooks/orchestrate.md) | 一个交给单个协调者聊天的长期项目：跨多天、许多堆叠 PR、成群的子代理。 |
| [autopilot-full](./skills/poteto-mode/playbooks/autopilot-full.md) | 从代码就绪的栈头开始，把相互独立的 PR 一路推进到合并：每个 PR 一个负责代理，每一轮由 root swarm 给出裁决。 |
| [autopilot-stack](./skills/poteto-mode/playbooks/autopilot-stack.md) | 构建并验证一条基于基底分支的线性堆叠，交给操作者评审和落地。 |
| [会话接续](./skills/poteto-mode/playbooks/session-pickup.md) | 恢复或接管前一个代理正在进行中的工作。 |
| [安全暂停](./skills/poteto-mode/playbooks/pause-safely.md) | 干净地挂起进行中的工作，以便之后恢复。 |
| [多阶段计划](./skills/poteto-mode/playbooks/multi-phase-plan.md) | 跨阶段或跨堆叠 PR 的工作。 |
| [worktree 清理](./skills/poteto-mode/playbooks/worktree-cleanup.md) | 在安全门控下修剪已合并或已废弃的 worktree 以及过期的 iOS 模拟器，回收磁盘空间。 |
| [开 PR](./skills/poteto-mode/playbooks/opening-a-pr.md) | 用一组小而有序的提交开一个就绪的 PR：标题遵循 Conventional Commits，正文采用简报风格。在其他每本行动手册的结尾被调用。 |

</details>



被调用时它会：

1. 把你的任务匹配到一本[行动手册](./skills/poteto-mode/playbooks/)，并打开一个待办清单，清单的第一批条目就是该行动手册的步骤，逐字复制进来。
2. 随着步骤触发，路由到其他技能。
3. 撰写了泔水的回复，措辞同时面向使用者和维护者。

完整规则和行动手册在 [`skills/poteto-mode/SKILL.md`](./skills/poteto-mode/SKILL.md) 中。

要让 [`/poteto-mode`](./skills/poteto-mode/SKILL.md) 跨轮次保持开启，从 `/` 菜单中选中它，然后按 option+enter（mac）或 alt+enter（windows），而不是直接按 enter。这会把它变成一个[自定义模式](https://cursor.com/docs/skills)，Cursor 会在 agents 窗口和 CLI 中提供它。它每一轮都留在上下文里，当有行动手册匹配或任务需要严谨时自动套用，其余时候不碍事。直接按 enter 只会把它附加到一条消息上。想退出就说一声，或者退出该模式即可关闭。

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 和 Cursor 的 `/loop` 命令配合得极好。你可以让 Cursor 连续工作好几个小时，而不牺牲严谨性。

## 技能

当某个步骤需要时，[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 会替你运行其中大多数技能（`how`、`why`、`architect`、`arena`、`swarm`、`interrogate`、`unslop`、`no-comments`、`technical-writing`、`tdd` 以及各原则）。下面这张表是给你想直接点名某个技能时用的：

```
/how do we cancel runs? do we have an n+1 when we look up every run to cancel?
```

```
/interrogate review this pr.
```

<details>
<summary>全部技能</summary>

| 技能 | 什么时候用 |
|---|---|
| [`/poteto-mode`](./skills/poteto-mode/SKILL.md) | 任何非平凡任务的默认入口。 |
| [`/poteto-help`](./skills/poteto-help/SKILL.md) | 你刚接触 pstack，或者不确定哪个技能、行动手册或原则合适。它会弄清你想做什么、回答那一部分，并递给你一条可以直接输入的提示词。只在你输入 `/poteto-help` 时运行。 |
| [`/in-your-own-words`](./skills/in-your-own-words/SKILL.md) | 你想让代理在动手之前先复述你的目标和问题。只在你输入 `/in-your-own-words` 时运行。 |
| [`/sharpen`](./skills/sharpen/SKILL.md) | 你想让任务以顶级专家的方式被处理，瞄准你真正想要的东西，同时不过度规约任务、也不替你做选择。 |
| [`/how`](./skills/how/SKILL.md) | 你想要一份某个子系统如何工作的走读讲解。 |
| [`/why`](./skills/why/SKILL.md) | 你想知道某个东西为什么被这样构建。运行时自动发现可用的 MCP，并并行查询每一类证据来源（源代码管理、问题追踪、长篇文档、实时聊天、基础设施可观测性、错误追踪、分析数仓）。 |
| [`/recall`](./skills/recall/SKILL.md) | 你正要开始或恢复工作，希望根据你自己的聊天记录和共享记录重建某个主题的近期上下文，并拿回一份紧凑的现状简报。 |
| [`/ketchup`](./skills/ketchup/SKILL.md) | 你想知道自从你上一条消息以来这个聊天里发生了什么变化：几句大白话加小图示，每个待办事项附上刚好够你做决定的上下文。 |
| [`/blast-radius`](./skills/blast-radius/SKILL.md) | 你有一个看起来很小的改动，想知道它还可能炸掉什么；那条"它之所以安全"所依赖的关键事实必须通过运行代码来证明，而不是空口断言。 |
| [`/architect`](./skills/architect/SKILL.md) | 你正要写跨越函数边界的代码，想先把调用方的用法、类型和模块形态定下来。 |
| [`/arena`](./skills/arena/SKILL.md) | 你想对同一件事做 N 次并行尝试，然后摘取每一次里最好的部分。 |
| [`/swarm`](./skills/swarm/SKILL.md) | 你想要 N 个并行工作者分片或竞速地工作，然后拿到一份汇总报告。 |
| [`/interrogate`](./skills/interrogate/SKILL.md) | 你有一个 diff，想让不同的模型设法攻破它，包括一副严格的代码质量透镜。 |
| [`/automate-me`](./skills/automate-me/SKILL.md) | 你想要一个属于你自己的 `-mode` 技能，根据你实际的工作方式起草。 |
| [`/make-bot-ui`](./skills/make-bot-ui/SKILL.md) | 你想要一个页面或仪表盘，上面的按钮能通过 webhook 唤醒一个 Grok Bot，包括 sender-key 交接和 Tailscale。 |
| [`/setup-pstack`](./skills/setup-pstack/SKILL.md) | 你想挑选 pstack 里每个角色使用哪个模型。它会检测你的模型并写入一条配置规则。 |
| [`/reflect`](./skills/reflect/SKILL.md) | 一个长任务落地了，你想把这次的做法沉淀为一次技能修改。 |
| [`/correct`](./skills/correct/SKILL.md) | 你总在为同样的错误纠正代理。它会从历史中挖掘错误类别，在能生效的最高层级逐一修复（先是架构，然后是类型、lint 和 CI，再是测试，文档排在最后），并维护一张把每条规则和它的执行手段配对的表。 |
| [`/teach`](./skills/teach/SKILL.md) | 你想真正理解一个改动或子系统，而不只是拿到一份摘要。它会运行 how + why，把两者织成一段平实的讲解，一张图一张图地搭起来。 |
| [`/tdd`](./skills/tdd/SKILL.md) | 你在修 bug，而且有一条低成本的本地测试路径。先写失败的测试，再写修复。 |
| [`/benchmark-checklist`](./skills/benchmark-checklist/SKILL.md) | 你跑了一个 benchmark，或者测出了一个加速或回退。在你汇报或据此行动之前，先审查这个数字（瓶颈限制、调参、错误、重复运行、端到端相关性）。 |
| [`/no-comments`](./skills/no-comments/SKILL.md) | 评审前剥离注释；派出 Comment Sicko，修复被接受的发现，并为声称存在的约束给出编码方案。 |
| [`/typescript-best-practices`](./skills/typescript-best-practices/SKILL.md) | 你在阅读或编辑 TypeScript。把 type-system-discipline 原则落到语法上。 |
| [`/figure-it-out`](./skills/figure-it-out/SKILL.md) | 没有内置行动手册适用。为任务设计一份严谨、可审计的行动手册。 |
| [`/show-me-your-work`](./skills/show-me-your-work/SKILL.md) | 你想要一条可评审的决策轨迹。把决策记录到一个可以提交的 TSV 里。 |
| [`/create-verification-skill`](./skills/create-verification-skill/SKILL.md) | 你的项目没有脚本化的方式来证明应用行为。为任意语言或平台生成一个项目本地的 verify 技能，附带功能地图。 |
| [`/maintain-verification-skill`](./skills/maintain-verification-skill/SKILL.md) | 你的 verify 技能的功能地图已经与应用脱节。一轮源码扫描加一次实机走查，最多产出一个全是已验证修正的 PR。 |
| [`/unslop`](./skills/unslop/SKILL.md) | 你在清理文字。去除 AI 痕迹。 |
| [`/bro`](./skills/bro/SKILL.md) | 你想把上一条消息用大白话重述一遍，不要黑话。 |
| [`/technical-writing`](./skills/technical-writing/SKILL.md) | 分层文档标准（Diátaxis + Google 开发者风格 + STE + Global English），适用于文档、RFC、readme、PR 描述和提交信息。 |

</details>



### 示例

大多数时候我在任务开始时输入 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)，让它路由到一本行动手册。其他技能随步骤需要自动触发。有几个我会直接点名使用。


<details>
<summary>全部示例</summary>

```
bug fix:           /poteto-mode this pr has a subtle bug where the scroll drifts every 750ms even
                   when idle. repro first, then fix and verify.
perf:              /poteto-mode a big list takes a second or two to load even though we virtualize.
                   run a cpu trace and tell me why.
feature:           /poteto-mode build a small feature behind a feature flag. verify it really works.
prototype:         /poteto-mode build two prototypes of the markdown renderer so we can compare.
                   spawn an agent for each.
multi-phase:       /poteto-mode open source these skills as a plugin. nothing internal leaks, work
                   in a temp dir, show me the dependency graph first.
overnight run:     /poteto-mode i'm going to bed. land the stack even if ci flakes. i want
                   everything merged by morning.
babysit:           /poteto-mode check on pr 123. anything outstanding?
visual parity:     /poteto-mode the row spacing is too tall when this flag is on. the second image
                   is correct. repro and fix until it matches.
figure it out:     /poteto-mode i'm stepping away. migrate every caller from the synchronous store
                   to the new async one, keeping behavior identical. i want to trust it was done
                   right when i'm back.
how:               /how do we cancel runs? do we have an n+1 when we look up every run to cancel?
why:               /why is this feature flag not on yet?
architect:         design this instrumentation to be high signal with no false positives. /architect
                   this first.
arena:             /arena take my prompt to the arena verbatim. i want to compare their proposals
                   with yours.
swarm:             /swarm check every package under packages/ against its check.sh. one worker per
                   package. one report.
interrogate:       /interrogate review this pr.
tdd:               /tdd implement
unslop:            can we unslop and tighten the new changes?
reflect:           /reflect that took too long. capture what we learned so the next run doesn't
                   repeat it.
correct:           /correct
show-me-your-work: /show-me-your-work keep a decision trail i can review when i'm back.
automate-me:       /automate-me
help:              /poteto-help which skill should i use to review this branch?
```

</details>

## `poteto-agent` 与 Comment Sicko 子代理

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 在接收它的那个聊天中运行。那个聊天拥有行动手册、待办清单以及每一次子代理派出。

pstack 还附带 [`subagent_type: "poteto-agent"`](./agents/poteto-agent.md)，作为一次运行中所派出的委托代理的包装器。它在动手之前会完整通读 `poteto-mode`，包括其中内联的原则索引。换成 `generalPurpose` 会跳过这次通读并产生漂移。不要派 `poteto-agent` 去运行行动手册本身。

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 和 [`subagent_type: "poteto-agent"`](./agents/poteto-agent.md) 经由同一个包装器路由。

pstack 还附带 [Comment Sicko](./agents/comment-sicko.md)，一个只读的注释评审员，以 `subagent_type: "comment-sicko"` 的形式提供。通常通过 [`/no-comments`](./skills/no-comments/SKILL.md) 调用它，而不是直接调用。

## 原则

二十四个短技能，每条原则一个。`poteto-mode` 把它们内联成索引，并在任务开始时读取该索引。独立文件的存在，是为了让其他技能可以按名字引用某条原则，也是为了让索引能指向每条的完整规则。

<details>
<summary>全部二十四条原则</summary>

| 原则 | 分组 | 规则 |
|---|---|---|
| [laziness-protocol](./skills/principle-laziness-protocol/SKILL.md) | 核心 | 倾向于删除，以及能解决问题的最小改动。 |
| [foundational-thinking](./skills/principle-foundational-thinking/SKILL.md) | 核心 | 在写逻辑之前应用：选择核心类型和数据结构、安排脚手架与功能工作的先后、追问并发参与者之间共享什么。把数据结构搞对，下游代码就会变得显而易见。 |
| [redesign-from-first-principles](./skills/principle-redesign-from-first-principles/SKILL.md) | 核心 | 把这个需求当作从第一天起就存在的基础假设来重新设计，而不是事后螺栓式外挂。 |
| [attack-the-premise](./skills/principle-attack-the-premise/SKILL.md) | 核心 | 当两个或更多共享同一前提的修复都倒在同一道关卡上时应用。在下一次修复之前，先普查哪些参与者持有这种失衡，然后质疑前提本身，而不是再写一个同样假设它的修复。 |
| [subtract-before-you-add](./skills/principle-subtract-before-you-add/SKILL.md) | 核心 | 先移除死重、冗余的校验器和桩引用，再在更简单的基础上构建。 |
| [minimize-reader-load](./skills/principle-minimize-reader-load/SKILL.md) | 核心 | 数一数问题与答案之间隔了几层、读者脑子里装着多少隐藏状态；折叠只有一个调用方的包装器，缩小可变状态的作用域。 |
| [outcome-oriented-execution](./skills/principle-outcome-oriented-execution/SKILL.md) | 核心 | 在有明确阶段边界的计划性重写和迁移中应用。向目标架构收敛；不要用一次性的兼容代码去维持平滑的中间状态。 |
| [experience-first](./skills/principle-experience-first/SKILL.md) | 核心 | 把用户愉悦置于实现便利之上；宁可交付更少但打磨过的功能，也不要更多粗糙的。 |
| [exhaust-the-design-space](./skills/principle-exhaust-the-design-space/SKILL.md) | 核心 | 定案之前先构建 2-3 个相互竞争的原型并并排比较。 |
| [build-the-lever](./skills/principle-build-the-lever/SKILL.md) | 核心 | 适用于任何非平凡的工作，不只是批量工作：编辑、迁移、分析、检查。构建那个能完成或证明这项工作的工具（codemod、脚本、生成器，或一个给你的子代理遵循的技能），而不是手工去做。这个工具就是评审者可以重跑的产物。 |
| [model-the-domain](./skills/principle-model-the-domain/SKILL.md) | 架构 | 用一个结构来编码领域，而不是散落各处的条件分支。 |
| [boundary-discipline](./skills/principle-boundary-discipline/SKILL.md) | 架构 | 把防御集中在系统边界（CLI、配置、网络、外部 API）；信任内部类型，把业务逻辑保持为纯函数。 |
| [type-system-discipline](./skills/principle-type-system-discipline/SKILL.md) | 架构 | 让非法状态无法被表示，给语义原语打品牌，在边界解析外部数据，拒绝对编译器撒谎，穷尽变体，从权威 schema 派生。 |
| [make-operations-idempotent](./skills/principle-make-operations-idempotent/SKILL.md) | 架构 | 无论之前有过怎样的部分执行，都收敛到同一个终态。 |
| [migrate-callers-then-delete-legacy-apis](./skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) | 架构 | 迁移调用方并在同一波中删除旧 API，而不是保留兼容层。 |
| [separate-before-serializing-shared-state](./skills/principle-separate-before-serializing-shared-state/SKILL.md) | 架构 | 先消除共享；只有当单一共享写入者是真正的不变量时，才做结构上的串行化。 |
| [prove-it-works](./skills/principle-prove-it-works/SKILL.md) | 验证 | 在完成任务之后、宣布完成之前应用。对着真实产物验证（运行功能、读取真实值、检查 diff），而不是代理物、自我汇报或"能编译"。 |
| [fix-root-causes](./skills/principle-fix-root-causes/SKILL.md) | 验证 | 把每个症状追到根因并在那里修复；先复现，不停追问为什么直到抵达根因，抵制那些只会让崩溃静音的 nil 检查护栏。 |
| [sequence-verifiable-units](./skills/principle-sequence-verifiable-units/SKILL.md) | 验证 | 适用于多步骤工作（扫荡、迁移、一连串相似编辑），也适用于你如何堆叠提交和 PR。把工作拆成每个都以可验证状态收尾的小单元，验完一个再做下一个，并安排交付顺序，让整个序列能向评审者自证。 |
| [test-behavior-not-implementation](./skills/principle-test-behavior-not-implementation/SKILL.md) | 验证 | 在你编写、修改或保留一个测试时应用。以用户调用代码的方式去调用它，并对着字面期望值断言他们观察到的结果。如果当每个导入的函数都返回 undefined 时测试仍能通过，就重写断言或删掉这个测试。 |
| [explain-the-number](./skills/principle-explain-the-number/SKILL.md) | 验证 | 在你信任、汇报或依据一个测得的数字——加速、回退、吞吐量、延迟或 eval 结果——行动之前应用。找出是什么限制了它，并排除它测到的其实不是你以为的那项工作的可能性。 |
| [guard-the-context-window](./skills/principle-guard-the-context-window/SKILL.md) | 委托 | 把批量内容路由给子代理；主线程里只留摘要，不留原始载荷。 |
| [never-block-on-the-human](./skills/principle-never-block-on-the-human/SKILL.md) | 委托 | 继续推进、呈现结果、让人类事后纠偏；确认只留给不可逆的操作。 |
| [encode-lessons-in-structure](./skills/principle-encode-lessons-in-structure/SKILL.md) | 元 | 把规则编码成 lint、元数据开关、运行时检查或脚本，而不是更多的文字。 |

</details>

## 这里未附带

`poteto-mode` 引用了几样东西，但并没有打包进来：

- `/deslop` 和 `deslop` 技能随 `cursor-team-kit` 插件发布。
- `control-cli`（用于 CLI 和 TUI）和 `control-ui`（用于浏览器、Electron、Web）也随 `cursor-team-kit` 发布。
- `/create-skill` 是 Cursor 内置的。Cursor 还内置了一个 `/babysit`；在 `poteto-mode` 内部，处理 PR 状态类请求时以 [babysit 行动手册](./skills/poteto-mode/playbooks/babysit.md) 为准。

想要完整的一套，就把 `cursor-team-kit` 和 pstack 一起装上。

## 为什么没有规划技能？

Cursor 已经有很好的 plan 模式，和 pstack 配合得很好。但我个人不相信规划。最好的规格说明就是代码。如果你确实想做计划，[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 也覆盖了，但它不是默认项。

## 把它变成你自己的

`poteto-mode` 是我的风格。你要的可能不完全是这个。

输入 [`/automate-me`](./skills/automate-me/SKILL.md)。它会挖掘你最近的对话记录，按你实际的工作方式起草一个 `<your-name>-mode` 技能，并在底层经由 pstack 路由。你保留 pstack 作为基座，最终得到一个与 `poteto-mode` 并排的、属于你自己的路由技能。

模型也是可配置的。输入 [`/setup-pstack`](./skills/setup-pstack/SKILL.md)。它会检测你有权访问的模型，并写入一条小的始终生效规则，把每个角色（代码、判断、各评审小组）映射到一个模型。每个技能都会读它，规则缺失时回落到合理的默认值，所以你只需覆盖你想改的部分。

当默认值变化时，在变化之前写入的规则仍然会钉住旧的默认值。删掉那些角色行，或者删掉整个文件，然后重新运行 `/setup-pstack`。重跑会保留所有模型与默认值不同的角色。

## 自动化

pstack 还附带一个处于休眠状态的 [benny 自动化包](./automations/benny/)。benny 分诊 Slack 上的问题报告，然后用真实的 UI 证据复现并修复确认的 bug。它的文件不会被注册为斜杠技能。

要启用它，把 Cursor 指向 [`FOR_AGENTS.md`](./automations/benny/FOR_AGENTS.md)。安装过程会把这个包复制到目标仓库的 `.cursor/automations/benny/`，在那里启用 pstack 以共享技能，并把用户配置保留在被复制的包之外。

## 许可证

MIT
