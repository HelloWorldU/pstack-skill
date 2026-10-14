# 构建改动并清理 diff

各个构建行动手册共享同一条纪律：说出你观察到的现象，让行动手册去索要证据。本页展示每类常见构建任务的提示词该写什么，然后是让 diff 始终可评审的清理习惯。

## 把你所知道的写进各构建行动手册的提示词

修 bug 的提示词说明症状，并先要求复现：

```text
/poteto-mode this command emits two records after a retry. repro first, then fix and verify.
```

加功能的提示词说明行为，以及什么不许变：

```text
/poteto-mode add a --json flag. text output stays byte-identical. verify both forms.
```

重构的提示词在结构变动之前钉死行为：

```text
/poteto-mode move parsing into one module, zero behavior change. record the current output first and prove it's unchanged after.
```

性能问题的提示词说明测量结果，而不是一种感觉：

```text
/poteto-mode startup takes 1.8s on this fixture. trace it, fix the measured cause, show me before and after.
```

以上每一种都会路由到各自的行动手册（[修 Bug](../../skills/poteto-mode/playbooks/bug-fix.md)、[加功能](../../skills/poteto-mode/playbooks/feature.md)、[重构](../../skills/poteto-mode/playbooks/refactoring.md)、[性能问题](../../skills/poteto-mode/playbooks/perf-issue.md)），行动手册会补上你没敲进去的步骤：先复现再修，先命名数据形状再实现，先钉死行为再重构，先剖析再优化。

如果你想持续改善某一个数字，有[爬山行动手册](../../skills/poteto-mode/playbooks/hillclimb.md)。给它指标、目标和尝试次数下限，它就会用冻结的测量工具一次只验证一个假设，循环往复。有收益就保留，其余全部回滚。

两个性能行动手册都会对自己的数字跑 [`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md)。性能问题手册会审查基线和之后的每一个数字，爬山手册会在冻结工具之前先审查它。[验证并交付](./06-verify-and-ship.md#vet-a-measured-number-with-benchmark-checklist)说明了什么时候该你自己敲这个技能。

有时你想在任何修复之前先知道原因。对于正在发生的症状——比如内存泄漏、CPU 空转或视觉故障——[运行时取证行动手册](../../skills/poteto-mode/playbooks/runtime-forensics.md)会给运行中的进程插上探针。对于你已经抓取好的剖析文件，[追踪取证行动手册](../../skills/poteto-mode/playbooks/trace-forensics.md)会读取产物，把热点帧映射回源码。两者返回的都是诊断，不是修复：

```text
/poteto-mode here's a cpuprofile from the slow startup. tell me where the time goes and which source lines own it. no fix yet.
```

## 用 `/tdd` 先写失败的测试

当一个 bug 有一条便宜的本地测试路径时，整个提示词可以只有两个词：

```text
/tdd implement
```

在上下文中，这就够了。[`/tdd`](../../skills/tdd/SKILL.md) 先写最小的、能以预期方式失败的测试，再写修复，然后重跑测试。如果写测试需要搭建庞大的测试框架或脆弱的 mock，技能会明说，并改用最接近的可执行检查。不要在真实命令更有说服力的地方硬塞测试。

## 按名字加载 TypeScript 规则

[`typescript-best-practices`](../../skills/typescript-best-practices/SKILL.md) 把类型系统原则变成具体规则：可辨识联合、边界处用 `unknown`、穷尽式变体检查、从 schema 推导类型。它不会自动加载，所以当任务涉及 `.ts` 或 `.tsx` 文件时，敲 `/typescript-best-practices`。

## 提交之前先清理

[开 PR 行动手册](../../skills/poteto-mode/playbooks/opening-a-pr.md)会在每次提交前对 diff 跑 `/deslop`，并对 PR 描述和提交正文应用 [`/unslop`](../../skills/unslop/SKILL.md)。`/deslop` 随 `cursor-team-kit` 插件发布，不在 pstack 里。如果你没有它，就用大白话要求同样的结果：删掉叙事性注释、没有依据的防御性判断、死去的兼容路径和无关的改动。

对文字内容，`/unslop` 接受一个目标和你额外的规则：

```text
/unslop the readme changes, no emdashes
```

你会慢慢形成自己的速记。这个技能从 `unslop that, tighten it` 这样简短的提示里也能很好地读懂意图。

## 用 `/no-comments` 剥离注释

注释需要单独过一遍，而且不能交给写它们的那个代理。作者捍卫自己的注释，就像你捍卫你的一样。所以在评审之前，把它们交给一双新眼睛：

```text
/no-comments the diff
```

[`/no-comments`](../../skills/no-comments/SKILL.md) 会生成 [Comment Sicko](../../agents/comment-sicko.md)，一个只读评审，保留清单很短：许可证头、公共 API 的文档注释、解释代码无法表达之事的链接、由你无法改造的外部依赖强加的行为。其他一律删除。你自己代码里的意外写法也得不到豁免。注释会作为重构标记回来，`/no-comments` 会在根因处修掉它接受的标记。当某条注释声称存在约束——「不要删除」——技能会提议把这一声称编码为类型、测试或 lint 规则。无论哪种方式，注释都得走。

分工值得记清楚：`/deslop` 清理代码里的泔水，`/unslop` 清理文字里的泔水，`/no-comments` 则把注释交给一个没写过它们的评审。

**陷阱：**清理不是可选的打磨。一个带着叙事性注释和防御性死重代码的 diff，在评审眼里读起来就是没做完，而多出来的代码正是下一个 bug 的藏身之处。如果 diff 感觉掺了水，在提交前说 `deslop it`，别等评审指出来。

下一篇：[验证并交付](./06-verify-and-ship.md)。
