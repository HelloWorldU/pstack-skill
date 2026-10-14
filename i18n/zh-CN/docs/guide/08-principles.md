# 用原则名称引导代理

pstack 附带 24 条原则，每条都是一个独立的技能。`/poteto-mode` 在每个多步骤任务开始时读取它们的索引，应用任务所触发的那些原则，并在回复中点名每一条被应用的原则，以及它改变了哪个决定。

原则不是由你直接调用的，你用它们的名称来引导。每个名称都指向一条代理已经完整读过的规则，所以一个短语对工作的纠偏，比一整段指令更精准。

## 实战中的引导

假设代理正要在现有三个适配器之上再摞一个新适配器：

```text
use subtract before you add. delete the obsolete adapters first, then design what's left.
```

假设它因为构建通过就宣称成功：

```text
apply prove it works. run the real import flow and show me the written records.
```

假设两个并行的尝试正要写入同一个分支：

```text
separate before serializing shared state. give each attempt its own worktree, no locks.
```

每个短语能命中，是因为它背后的规则足够具体。代理仍然必须在回复里说明这条规则改变了哪个决定。引用了原则却没有任何决定作支撑，就是它只是在挂名、而没有真正应用的破绽。

## 24 条原则速览

核心原则决定构建多少东西、何时重新思考设计：

- [懒惰协议（Laziness Protocol）](../../skills/principle-laziness-protocol/SKILL.md) 偏爱删除，偏爱能解决问题的最小改动。
- [基础优先思考（Foundational Thinking）](../../skills/principle-foundational-thinking/SKILL.md) 先选定核心数据结构，再写逻辑。
- [从第一性原理重新设计（Redesign from First Principles）](../../skills/principle-redesign-from-first-principles/SKILL.md) 把新需求当作从第一天起就存在那样整合进来。
- [攻击前提（Attack the Premise）](../../skills/principle-attack-the-premise/SKILL.md) 在盘点过哪些角色承载了失衡之后，质疑两个或多个失败修复所共享的那个前提。
- [先减后加（Subtract Before You Add）](../../skills/principle-subtract-before-you-add/SKILL.md) 先清掉死重，再在其上构建。
- [最小化读者负担（Minimize Reader Load）](../../skills/principle-minimize-reader-load/SKILL.md) 收拢读者必须记在脑子里的层级和隐藏状态。
- [结果导向执行（Outcome-Oriented Execution）](../../skills/principle-outcome-oriented-execution/SKILL.md) 让重写向目标设计收敛，而不是保留用完即弃的兼容状态。
- [体验优先（Experience First）](../../skills/principle-experience-first/SKILL.md) 用户的结果优先于实现的便利。
- [穷尽设计空间（Exhaust the Design Space）](../../skills/principle-exhaust-the-design-space/SKILL.md) 在没有先例时，构建两三个相互竞争的原型。
- [打造杠杆（Build the Lever）](../../skills/principle-build-the-lever/SKILL.md) 构建那个能完成或证明这项工作的脚本，让评审者可以重跑。当代理一直手工做同一件事时，让它写出它希望自己拥有的那个工具或技能。如果一个步骤能被脚本每次以同样方式完成，就用脚本，把代理留给需要判断力的决策。

架构原则决定状态、校验和兼容性住在哪里：

- [为领域建模（Model the Domain）](../../skills/principle-model-the-domain/SKILL.md) 把反复出现的规则编码进一个结构，而不是散落的条件判断。
- [边界纪律（Boundary Discipline）](../../skills/principle-boundary-discipline/SKILL.md) 在边界处校验，信任内部类型。
- [类型系统纪律（Type System Discipline）](../../skills/principle-type-system-discipline/SKILL.md) 让非法状态无法被表示。
- [让操作幂等（Make Operations Idempotent）](../../skills/principle-make-operations-idempotent/SKILL.md) 让重试收敛到同一个终态。
- [迁移调用方，然后删除旧 API（Migrate Callers Then Delete Legacy APIs）](../../skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) 迁移与删除在同一波完成。
- [先分离再序列化共享状态（Separate Before Serializing Shared State）](../../skills/principle-separate-before-serializing-shared-state/SKILL.md) 先消除共享，再谈协调。

验证原则定义什么才算证据：

- [证明它有效（Prove It Works）](../../skills/principle-prove-it-works/SKILL.md) 验证真实产物，而不是替身。
- [修复根因（Fix Root Causes）](../../skills/principle-fix-root-causes/SKILL.md) 先复现并追查到原因，再改代码。
- [把工作切分为可验证单元（Sequence Work into Verifiable Units）](../../skills/principle-sequence-verifiable-units/SKILL.md) 每个小单元都以一次检查收尾，再开始下一个。
- [测试行为而非实现（Test Behavior, Not Implementation）](../../skills/principle-test-behavior-not-implementation/SKILL.md) 以用户的方式调用代码，断言一个字面量的期望值；如果每个被导入的函数都返回 `undefined` 而测试仍会通过，就删掉这个测试。
- [解释这个数字（Explain the Number）](../../skills/principle-explain-the-number/SKILL.md) 在任何人信任或转述一个实测数字之前，先说清是什么限制了它，并排除它其实测了别的东西。[`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md) 把它变成七个用真实运行来回答的问题。

委派原则让并行工作保持可控：

- [守护上下文窗口（Guard the Context Window）](../../skills/principle-guard-the-context-window/SKILL.md) 把批量阅读路由给子代理，把结论留在主对话里。
- [永不阻塞在人类身上（Never Block on the Human）](../../skills/principle-never-block-on-the-human/SKILL.md) 可逆的工作直接推进，然后呈现结果。

还有一条元原则：

- [把教训编码进结构（Encode Lessons in Structure）](../../skills/principle-encode-lessons-in-structure/SKILL.md) 把你重复过两遍的建议变成 lint、检查或脚本。[`/correct`](../../skills/correct/SKILL.md) 把它应用到整个仓库，如[让它成为你的](./09-make-it-yours.md#fix-the-environment-with-correct)所示。

别背这张清单。现在扫一眼就好，等你抓到代理做了某件这里的名字本可以阻止的事时再回来。词汇量就是这样积累起来的。

下一篇：[让它成为你的](./09-make-it-yours.md)。
