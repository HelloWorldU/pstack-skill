---
name: show-me-your-work
description: "为长时间运行或无人值守的工作保留一条可评审的决策轨迹：一份 TSV 日志，每个决策一行（做了什么、为什么、证据、结果）。默认留在本地；当评审者需要这条轨迹才能信任结果时才提交它。适用于 /show-me-your-work、自主或多阶段运行，或人类暂时离开后再回来评审的工作。"
disable-model-invocation: true
---

# 给我看你的工作过程

只维护一份权威日志。

## 格式

一个 TSV 文件，每个决策一行。单元格保持单行。证据是一个指针，不是一段文字。

复制 `references/decision-log-template.tsv`（表头行）即可开始一份干净的日志。各列：

- **ts.** ISO8601 时间戳。
- **phase.** 阶段或工作流。
- **decision.** 选择了什么或做了什么，一行写完。
- **why.** 用大白话说明原因。如果是某条原则驱动的，就平实地说出来，不要贴一个术语标签。
- **evidence.** 能证明它的链接或路径：commit SHA、PR 编号、`file:line`，或产物、trace、截图路径。绝不写一整段话。
- **result.** 结果或谓词状态：`tests green`、`reverted`、`pixel-diff 0`、`INCONCLUSIVE`、`open`。

下面是一个例子，措辞平实，评审者一眼就能看懂。

```
ts	phase	decision	why	evidence	result
2026-05-24T09:02:00Z	frame	counted the work first, about 100 components and roughly 75 hours	wanted to know the size before starting a long run	commit 3a9f1c2	found 5 things to sort out before starting
2026-05-24T09:40:00Z	harness	took screenshots of the old version before changing anything	so we can compare old against new and catch any visual change	scripts/snapshot.sh, baseline/	saved 120 reference screenshots
2026-05-24T11:15:00Z	widget	moved the widget styles over without changing how it looks	keep the change small and the result identical	commit 7c21e0a, pixel-diff 0	looks identical, tests pass
2026-05-24T12:30:00Z	widget	threw out a helper's work because its screenshots were blank	checked the real files instead of trusting its summary	worktree reset	reverted, tightened the instructions for next time
```

## 记录一行

每一条记录都按你跟队友口述工作内容的方式来写。用大白话、具体动作，不要 AI 腔或抽象术语（**unslop** 技能同样适用于日志文本）。

使用辅助脚本 `scripts/log.sh <logfile> <phase> <decision> <why> <evidence> <result>`。它会自动打上 `ts` 时间戳，首次使用时写入表头，剔除混入的制表符和换行符，并给以 `=`、`+`、`-` 或 `@` 开头的单元格加上单引号前缀。直接用 `printf` 追加一行也行，但如果单元格内容来自生成的文本或用户输入，同样要注意这些字符。

记录决策点和检查点，而不是每个动作：选择了的分叉、带着验证结果完成的单元、带有触发原因的转向或回退、暴露出来的阻塞、修好的关卡。循环运行时，每次迭代一行。琐碎和不言自明的内容跳过。

一次运行指一个代理对话，包括它后续的轮次以及关于它的任何摘要。一次接续、一个接替的代理、或一次新对话，都开始一次新的运行。当一次运行向已有内容的日志追加时，它的第一行 phase 为 `start`；在另一次运行的 `start` 行之后写下的第一行同样如此。因此，一次在后续轮次回到某份日志的运行，要先读日志的最后几行，看看是否有别的运行在此期间写过。`start` 行要给出它之前、并非本运行所写的那些行的 `ts` 范围，其证据列要点名本次运行，比如它的代理 id。`start` 这个 phase 不作他用。

## 日志放在哪里

默认情况下日志是工作产物，不提交。把它放在工作目录下的 `decisions.tsv`，或者在多项工作并行时放在 `.audit/<task-slug>.tsv`，并让它留在 git 之外。

只有当工作足够重大、评审者需要这条轨迹才能信任结果时，才提交它。

## 规则

- 只追加。错误的决定用一行新的记录取代它。绝不编辑或删除历史。
- 优先使用已提交脚本产生的证据，而不是手工做的一次性产物（**encode-lessons-in-structure** 原则技能）。

## 对照转录稿审计日志

运行结束、交还之前，检查日志是否说了实话。阅读本次运行在当前工作区 `agent-transcripts/` 目录下的转录稿（系统提示词里给出了路径）。不要跨 `~/.cursor/projects/*/` 做 glob，那会读到无关的私人对话。把本次运行的每一行与实际发生的事情逐段对照：每一段从本次运行的某个 `start` 行开始（如果日志是本运行创建的，则从第一行开始），到另一次运行的下一个 `start` 行为止：

- 检查每一行是否对应一个真实的决策或动作。
- 检查每一行的证据是否可解析，并确实显示了该行声称的内容。
- 一个塑造了工作成果却没有被记录的分叉、转向或被放弃的方案，就是一个缺口。补上它。

修正日志，而不是修正故事。审计绝不编辑或删除任何一行，哪怕是虚构的行。当某行记录的既不是真实决策也不是真实动作，或其声称内容或证据有误时，追加一行取代它，写清实际发生了什么，并给出一个可解析的指针。本审计不检查本次运行各段之外的行。如果本次运行自己的工作显示其中某行有误，就像对待任何错误决定一样取代它。

## 用另一个模型家族评审这条轨迹

交还之前，派生一个与完成工作的模型不同家族的子代理。自我评审不能替代。子代理阅读审计轨迹和本次运行的转录稿，然后标出用户应当注意的地方。不是重做工作，而是扫描哪些做法欠佳或有风险。按照 **poteto-mode** 技能的 Subagents 一节，为每个子代理挑选适合任务的推理等级和快速或标准速度。

- 记录时证据薄弱或缺失的决策。
- 被跳过、或在转录稿中声称做了却没有证据的验证步骤。
- 事后看来有风险的选择（操之过急、范围蔓延、掩盖症状）。
- 用户随手浏览时会漏掉的缺口。

每一次产生了轨迹的运行，其回复都以一个 "Attention" 小节结尾。开头单独一行写评审者的模型（`reviewed by <model>`），然后列出每个标记并指向具体的行或时刻。"No flags" 是合法取值，模型名不是。

## 评审这条轨迹

通读全文，顺着证据指针走，抽查。GitHub 会把提交的 TSV 渲染成表格。`column -s$'\t' -t decisions.tsv` 可以在终端里渲染它。

## 组合本技能

其他技能把它们的审计轨迹路由到这里，而不是自己发明一套。按名字引用本技能，让它独占这套格式。不要复述这些列。
