---
name: typescript-best-practices
description: TypeScript 最佳实践。阅读或编辑任何 .ts 或 .tsx 文件时使用。
paths: ["**/*.ts", "**/*.tsx"]
disable-model-invocation: true
---

# TypeScript 最佳实践

先应用 **type-system-discipline** 原则技能。

| 规则 | 摘要 |
|------|---------|
| 可判别联合 | 用 `kind` 字面量判别字段为变体建模，使不可能的状态无法表示。不要可选字段大杂烩。 |
| 品牌类型 | 用 `& { readonly __brand: "X" }` 给原始类型打品牌，防止混用。在边界处验证一次。 |
| 构造式建模 | 构建让非法值无法构造的形状。非空用 `[T, ...T[]]`，偶数长度用 `[T, T][]`，范围用 `start` 加 `duration`。不靠运行时守卫，也不是对精炼类型的一厢情愿。 |
| 最简单的全函数类型 | 只要每个操作都是全函数就保留 `T[]`。只有当宽松类型逼出 `!`、断言或「永远不该发生」的 throw 时，才加强为 `NonEmpty<T>`。 |
| 用 `unknown` 而非 `any` | 外部数据是 `unknown`。 |
| 模式先于守卫 | 在手写逐属性类型守卫之前，用仓库的运行时模式库并从模式推导类型，如 `z.infer`。 |
| 禁止 `as` 断言 | 每个 `as` 都是等待爆发的运行时崩溃。只在验证之后断言。 |
| 收窄等级 | 判别字段 switch > `in` 运算符 > `typeof`/`instanceof` > 用户自定义类型守卫 > `as`。 |
| 类型守卫 | 必须验证其声明。说谎的守卫比 `as` 更糟，因为 bug 躲在一个号称安全的名字后面。命名为 `isX` 或 `hasX`。 |
| 穷尽性 | 在 default 分支内联 `const _exhaustive: never = x;`，新增变体时编译器就会报错。 |
| 用 `satisfies` 而非 `as` | 校验值而不加宽字面量类型。 |
| 边界验证 | 在数据跨入处解析成命名的领域类型。`Record<string, unknown>`（无论怎么拼写）止步于这次解析。内部信任类型。参见 **boundary-discipline** 原则技能。 |
| 模式派生类型 | 先想到 `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof`，再声明新接口。 |
| 对象参数 | 传对象而非位置参数，让参数顺序自解释。热路径上可跳过（逐帧渲染、分词器、解析器）。 |
| 真实测试 | 能跑的就别 mock。优先用框架真实的测试原语并做泄漏/资源释放检查，在真实运行的构建里验证 UI。只 mock 本地跑不起来的东西。 |
| 结构化遥测 | 优先用带足够上下文的结构化日志诊断，凭一个 id 就能排查。交付代码里不许有 `console.log`。 |

示例：`references/patterns.md`。
