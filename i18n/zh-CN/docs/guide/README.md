# pstack 指南

pstack 在你停止对代理微管理时效果最好。你描述想要什么、凭什么判断它完成了。`/poteto-mode` 挑选行动手册，在步骤需要时运行其他技能，并把证据摆给你看。这份指南用真实的提示词教你养成这个习惯。

你将学到：

1. [安装 pstack](./01-setup.md)。安装插件并选好模型。
2. [用 `/poteto-mode` 路由工作](./02-poteto-mode.md)。给它一个目标，看它挑选行动手册。
3. [理解代码](./03-understand.md)。一次只读调查，然后在改动任何东西之前用 `/how`、`/why`、`/teach` 和 `/recall`。
4. [设计改动](./04-design.md)。`/architect`、`/arena`、`/swarm`、`/interrogate`、原型和计划，赶在代码锁定形状之前。
5. [构建并清理改动](./05-build-and-clean.md)。构建行动手册、`/tdd`、`/unslop` 和 `/no-comments`。
6. [验证与交付](./06-verify-and-ship.md)。在真实应用上证明行为，用 `/benchmark-checklist` 审查数字，然后开一个聚焦的 PR 并一路推进到合并。
7. [睡觉时让工作继续跑](./07-overnight.md)。循环之前先建立信任、一份过夜契约、一份可审计的决定日志，以及能扩展到单个代理之外的 Projects 和自动化。
8. [用原则名称引导](./08-principles.md)。能在任务中途扭转代理方向的 24 个名字。
9. [让它成为你的](./09-make-it-yours.md)。你自己的模式、对付重复犯错的 `/correct`，以及如何测试技能改动。
10. [配方与坑](./10-recipes-and-pitfalls.md)。可抄的提示词和要避开的错误。

第一遍按顺序读。之后每一篇都可以独立查阅。

卡住了，或者拿不准哪个技能合适时，带上你的问题输入 [`/poteto-help`](../../skills/poteto-help/SKILL.md)：

```text
/poteto-help which skill should i use to review this branch?
```

它会回答，递给你一条要发送的提示词，并链接答案来源的技能或指南页面。它不会替你开工，因为 pstack 的一次运行要花真实的 token——准备好了就由你发出提示词。它只在你输入时才运行。

## 如果你只记住一件事

用你自己的话，给代理一个目标和一种检验方式：

```text
/poteto-mode the export writes duplicate rows when a retry lands mid-run. repro first, then fix and verify.
```

你不需要点名行动手册或罗列技能。"repro first" 和一个可检验的结果，就是 `/poteto-mode` 所需的全部路由信号。它匹配到 Bug 修复行动手册，把步骤抄进待办清单，并在每一步触发时调用正确的技能。

下一篇：[安装 pstack](./01-setup.md)。
