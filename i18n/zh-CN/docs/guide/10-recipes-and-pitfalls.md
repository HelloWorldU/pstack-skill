# 配方与坑

值得抄下来的提示词，然后是每个人都会犯一次的错误。把它们换成你自己的路径和完成条件。这些配方刻意写得随意——实践中人们就是这么敲的，而技能完全读得懂意图。

![她品尝一道做好的菜，机器人们照着食谱卡片盒做菜，台面上方钉着写着 /how、/tdd 和 /loop 的卡片。](./images/recipes.jpg)

## 理解一个不熟悉的子系统

```text
use /how first to understand how this initialization works. then use /why to figure out why it broke recently.
```

先机制，后历史。每个技能的报告都会告诉你它搜了哪些来源，让你知道答案基于什么。

## 动代码之前，先复述嘈杂的报告

```text
/poteto-mode read this thread. restate the underlying issue in your own words, in plain english. don't change any code yet.
```

误读会在复述中暴露，在那里纠正它只花一条消息。在代理说出它自己的判断之前，先别说出你的理论。

## 先原型，再选择

```text
/poteto-mode prototype a few options for the settings layout. put them behind a switcher and send me screenshots of each.
```

你从能跑的东西里挑，不是从描述里挑。代理一路自己回答布局和时序问题。

## 把敲定的设计变成计划

```text
/poteto-mode turn this design into a plan. small verifiable PRs, each with its own proof.
```

等设计定下来再提这个要求。计划就是交付物，它会点名负责执行的行动手册。

## 给设计找个第二意见

```text
ask /arena for a second opinion on this thread and our approach
```

你当前的设计变成几个候选之一，综合结论会告诉你评审团是找到了更好的方案，还是确认了你原有的方案。在代价高昂的承诺之前，这是便宜的保险。

## 并行检查相互独立的切片

```text
/swarm check every package under packages/ against its check.sh. one worker per package. one report.
```

每个 worker 负责一个包。父代理等待所有切片完成，返回一份 `PASS`、`ISSUES` 或 `BLOCKED` 报告，而不是 worker 的原始输出堆。

## 带着怀疑评审一个分支

```text
/interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's an actual bug or regression in behavior.
```

限定词真的在起作用。"don't change anything yet" 让它保持只读，而吹毛求疵规则预先过滤了噪音，让 `Act on` 级别的发现值得你花时间。

## 通过一个失败的测试修 bug

```text
/poteto-mode repro the duplicate write first. if there's a cheap test path, /tdd it. then fix and rerun.
```

"if there's a cheap test path" 很关键。逼着测试穿过脆弱的 mock，能证明的东西还不如直接跑真实命令，而行动手册被允许这么说。

## 复现一个报告并带证据修复

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

"if it repros on main" 让运行在 bug 已经消失时提前收工。视频让你在读 diff 之前就能检查修复。

## 发布数字之前先审一审

```text
/benchmark-checklist vet this 40% speedup before it goes in the pr description
```

你会得到四个结论之一：更快、更慢、没有可测量的差异，或无法定论——附运行次数、区间，以及是什么限制了这个数字。

## 别再纠正同一个错误

```text
/correct agents keep adding new config flags without registering them in the schema
```

修复以架构、类型、lint 或测试的形式落在仓库里，下一个代理没法再犯。

## 只问怎么做，不动手开工

```text
/poteto-help how do i get poteto-mode to stay on every turn?
```

你会得到一个答案、一条要发送的提示词，以及一个指向来源的链接。在你发出那条提示词之前，什么都不会运行。

## 你不在时让运行保持诚实

```text
im going to bed, keep going autonomously until every fixture passes. do not stop. keep a decision log i can audit in the morning.
```

完整契约在[过夜篇](./07-overnight.md)。只要任务和完成条件已经在对话里，简写就够用。

## 把跑偏的运行拉回来

引导提示词只要一行：

```text
i said the goal is to repro. i did not ask for a fix yet.
```

```text
apply prove it works. show me the real output, not the build log.
```

```text
/unslop that, no emdashes
```

你很少需要更多字。你需要的是正确的名字，而[原则篇](./08-principles.md)就是词汇表。

## 用大白话听回复

```text
/bro
```

这就是全部提示词。[`/bro`](../../skills/bro/SKILL.md) 把上一条消息复述成一个人对另一个人说话的样子：不用术语，更短。当一条回复技术上很周全、而你还是不知道它说了什么时，用它。

## 这些坑

- **在提示词里罗列技能。**"use /how then /architect then /arena"（先 /how、再 /architect、再 /arena）打乱了行动手册本来排好的步骤顺序。陈述目标和约束，只有要覆盖默认行为时才点名技能。
- **含糊的完成条件。**"make it better"（把它做得更好）让 `/loop` 没有东西可检查。给一条能判定通过或失败的命令，或一个这样的产物。
- **先抛你对原因的理论。**代理会朝你指的任何方向搜。先让它复述问题，再分享你的猜想。
- **接受第一个设计。**一次尝试就锁定了模型想到的第一个形状。要原型或用 `/architect`，凭证据挑选。
- **打磨抽象的计划。**对背后没有代码的计划做对抗性评审，会编造出永远不会发生的风险。先用原型了结悬而未决的问题，再评审构建出来的东西。
- **一个 worktree 里跑多个并行代理。**它们互相覆盖，diff 变成考古现场。用云代理跑它们，或者说 "own worktree per attempt"（每次尝试独占一个 worktree）。
- **还不信任循环就开循环。**不能验证自己工作的循环，只会让未检查的工作更快地产出。先让验证技能跑通。
- **信任没审过的数字。**热缓存或被跳过的代码路径能伪造出提速。在数字去到任何地方之前，先跑 `/benchmark-checklist`。
- **手工纠正同一个错误。**聊天里的一次纠正只帮得到一次运行。`/correct` 修好仓库，让之后的运行不再重犯。
- **拿 `/arena` 当覆盖工具用。**`/arena` 重复同一份设计或代码简报，然后选一个基座并嫁接最好的部分。`/swarm` 切分切片或声明的竞赛分支，聚合成一份报告。
- **接受每一条评审意见。**机器人和人类都会把真发现和噪音列在同一张清单里。`/interrogate` 把发现分拣为"待处理"和"已驳回"两桶并给出理由，两个方向你都可以推翻。
- **把 `auto` 当成模型 slug。**`auto` 和 `inherit-parent` 的意思是"省略 model 字段，让子代理继承父对话的模型"。角色配置见[安装篇](./01-setup.md)。
- **拿绿色构建当成功汇报。**构建只证明能编译。要求真实命令、真实流程、存储的值或性能剖析，并期待证据出现在回复里。
- **徒手撰写 `SKILL.md`。**走[撰写或修改技能行动手册](../../skills/poteto-mode/playbooks/authoring-a-skill.md)，让校验和评审真正发生。

指南到此为止。如果你是跳着看的，回到[安装篇](./01-setup.md)跑一个真实任务。习惯来自使用，而不是阅读。

回到[指南目录](./README.md)。
