# 验证结果并开 PR

「能编译」不算证据。[Prove It Works 原则](../../skills/principle-prove-it-works/SKILL.md)要求代理在报告成功之前先检查真实产物，而你的职责是让「真实产物」变得可检查。本页涵盖：说明完成条件、审查测量数字、为你的应用生成验证技能、开 PR，以及把它推进到合并。

验证是大多数代理工作中最慢的一步，因为它通常是等待人类的那一步。让代理有能力自己做验证，你就不再是瓶颈。跳过它，你开再多代理也只会得到更多没人检查的工作等着你来审。

![一架原型飞机正在飞一条真实的测试航线，她拿着秒表计时，机器人们在一旁拍摄并对照检查清单；终端上显示 verify: pass, evidence: captured。](./images/verification.jpg)

## 把完成条件说在前面

在第一条提示词里就写清楚「做完」意味着什么，用你顺手的说法：

```text
/poteto-mode add json output to this command. text output stays byte-identical, the json parses, both run against the sample project. show me the evidence.
```

现在代理有三项可以实际运行的检查，而不是一种要去迎合的情绪。回复回来时，应该带上确切的命令和输出。如果某项检查跑不了，好的回复会说「无法确定」（inconclusive），而你应该把没有证据的自信回复当作危险信号。

让检查匹配改动：

- CLI 改动就运行真实命令。
- UI 改动就在运行中的真实应用里走一遍改动过的流程。当必须逐像素对齐参考效果时，[视觉一致性行动手册](../../skills/poteto-mode/playbooks/visual-parity.md)会对照冻结基线做截图 diff，而不是靠眼睛判断。
- 解析器或迁移就重放保存好的输入。
- 性能改动就对比前后的剖析文件。
- 存储改动就把写入的值读回来。

把证明要求成你自己能检查的产物：先是失败的测试、然后是通过的测试，前后对比视频，追踪文件，截图。如果修复已经合并，就在 main 上再要一次同样的检查。产物胜过听起来合理的解释，因为你可以质询它，而不必重放整个过程。

对一个你不完全放心的小 diff，[`/blast-radius`](../../skills/blast-radius/SKILL.md) 会找出它在别处可能波及的东西。它挑出「这个改动之所以安全」所依赖的那一个事实，然后用运行代码的方式去证明，而不是写一篇论文。

## 用 `/benchmark-checklist` 审查测量数字

前后对比数字是最容易意外搞错的证据。缓存是热的、一边是 debug 构建、计时区间内根本没跑实际工作——每一种都能制造出一个令人信服的提速假象。在你汇报或依据某个数字行动之前，敲：

```text
/benchmark-checklist vet the export speedup before it goes in the pr
```

[`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md) 会问七个问题，每个都要来自实际运行的证据：

1. 什么在限制这个数字，为什么它不是两倍快？
2. 每一方都按生产环境的方式调优过吗？
3. 结果是否突破了物理极限，比如磁盘带宽或核心数？
4. 有没有任何东西报错或返回了错误输出？
5. 交替多次运行能复现吗，有中位数和区间吗？
6. 它在端到端、在用户要等待的路径上重要吗？
7. 工作真的发生在计时区间内吗？

结论会以「更快」「更慢」「没有可测量的差异」或「无法确定」之一返回，附上运行次数、区间和瓶颈因素。当它说不出瓶颈是什么，或者有一方没调优就跑，结论就是「无法确定」。`/poteto-mode` 已经在性能问题和爬山行动手册内部跑了这份清单，所以当你在它们之外测了什么东西，或者当别人的数字好得不像真的时，你自己敲它。它是 [Explain the Number 原则](../../skills/principle-explain-the-number/SKILL.md)的可执行形态。

## 创建项目验证技能

上面 UI 那一条背后藏着一个真实要求：代理需要一种脚本化的方式来驱动你的应用。如果你的项目已经有了，很好。如果没有，运行：

```text
/create-verification-skill
```

[`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 访谈的是仓库，不是你。它会弄清楚：用户会碰什么、应用本地怎么启动、什么能驱动它（优先现有测试框架，否则用浏览器加 CDP、PTY，或者纯 HTTP）、什么证据能证明行为、以及两个实例能不能并排运行。它只问你代码回答不了的问题。

它会写出 `.cursor/skills/verify-<app>/`，一套面向代理的指令，包含精确的 Launch、Doctor、Drive、Evidence 和 Cleanup 小节，外加 `features/` 下的功能地图，索引应用能做什么、以及什么结果能证明每个功能是好的。这个技能自带一个[完整的功能地图示例](../../skills/create-verification-skill/references/feature-map-example/)，有 README 索引，每个功能一个文件，都使用四个必需的 H2 标题。交付之前，生成器会把技能端到端证明一遍：启动、doctor 检查、驱动一个功能、采集证据、清理。如果这次证明失败，就别用它的产出。

从那以后，「在应用里验证」就变成了任何代理都能执行的一步，在这个仓库里，不需要任何前置沟通。当你想要特定形式的证明时，在提示词里点名它：

```text
/poteto-mode build the bulk-archive action. use /verify-<app> to verify your changes and show me a video and screenshots as proof.
```

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

一旦验证技能能用了，[`/swarm`](../../skills/swarm/SKILL.md) 就可以按功能地图条目拆分一次全量验证并汇总结果。一群验证者还能在足够大的样本上确认一次性能收益，或者在 PR 交付前对应用做模糊测试抓回归。

把验证技能当作基础设施，而不是一次性用品。提交它，让团队里每个人、每个代理都用同一种方式驱动应用。然后[打造杠杆](../../skills/principle-build-the-lever/SKILL.md)。当代理们反复写一次性脚本去点应用时，就该要一个小型控制 CLI 让技能去调用。代理花更少的 token，每次运行也变得可重复。一个被代理用得顺手的 CLI 有这些特质：

- 少量可组合的命令，每个都做真实的工作，而不是一堆单薄的小命令。
- 任何破坏性操作都有 `--dry-run` 选项。
- 子命令逐步揭示功能，而不是一次性全摆出来。
- 错误信息会告诉你该改做什么。
- 丰富的 `--help` 文本。
- 机器可读的输出，比如 JSON。

顺手把开发环境也做成可复现的：预置种子数据、测试用户，以及一条每次都以同样方式拉起环境的命令。

## 让验证技能保持诚实

应用会变，功能地图会腐化。每天至少运行一次，最好放进定时自动化里，这样谁也不用记着：

```text
/maintain-verification-skill
```

[`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md) 会审计生成的技能：每个功能一个只读源码阅读器并行检查，然后做一次驱动每个已映射功能的实跑。它一定以三种结果之一收场。`clean` 表示全覆盖，没有要交付的东西。`changed` 表示一个 PR，里面是经过证明的修正，且严格限制在验证技能自己的目录里。`blocked` 会指出阻塞是什么。它从不改产品代码。如果实跑抓到了产品回归，它会报告这个回归，而不是在文档里粉饰过去。

## 开 PR

```text
/poteto-mode open the pr. small ordered commits, evidence in the description.
```

[开 PR 行动手册](../../skills/poteto-mode/playbooks/opening-a-pr.md)在 worktree 里工作，把工作 rebase 成小而有序的提交，清理 diff，给文字去泔水，然后返回 PR 链接。五个窄 PR 胜过一个胖 PR，叠放的跟进 PR 胜过一个不断长大的分支。

## 用 Babysit 把 PR 推进到可合并

PR 一开就会立刻开始积攒阻塞：检查挂了、评审留言了、主干前进了。把这些琐事交给 [Babysit 行动手册](../../skills/poteto-mode/playbooks/babysit.md)：

```text
/poteto-mode babysit this pr. get it green.
```

Babysit 用内置的监视器盯着 PR，按顺序处理阻塞：先冲突，再评审串，再 CI。每一批复知的修复攒成一次推送，这样检查只重启一次，而不是每个修复重启一次。对评论的分诊是怀疑论的，因为人类和机器人会把真实问题和噪音扔进同一个列表。真实发现会得到修复，噪音则会被驳回，并把反证贴到对应讨论串里。当你只想要状态时，问小一点，Babysit 会直接回答而不启动循环：

```text
/poteto-mode check on pr 123. anything outstanding?
```

Babysit 到可合并就停。它从不合并，即使一切全绿，因为合并是另一码事的决定。

## 用 Shipping 落地整个堆叠

全绿不等于安全。当你准备好落地时，说出来：

```text
/poteto-mode land the stack.
```

[Shipping 行动手册](../../skills/poteto-mode/playbooks/shipping.md)在启用任何东西之前，先独立验证每个 PR。每个 PR 由一个全新的代理在真实环境里证明行为，判断改动的代理永远不是写它的那个。然后 Shipping 只从底部落地连续且已验证的那一段，一次一个 PR，默认走 GitHub，当 Origin 的 CLI 可用时走 Origin，并报告第一个断链的 PR。一个已验证的 PR 压在未验证的上面就得等着，因为合并它会把缺口一起带进去。

下一篇：[睡觉时让工作继续跑](./07-overnight.md)。
