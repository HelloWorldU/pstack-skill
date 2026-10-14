---
name: principle-laziness-protocol
description: "在重构、评估 diff 大小，或者想加抽象、分层、信号串联时应用。偏向删除，偏向能解决问题的最小改动。"
disable-model-invocation: true
---

# 懒汉协议

- **合并决策。** 不要在好几个地方重复同一个选择。把它放到单一事实来源后面，把结果作为一个简单的标志传出去。
- **最小化 diff。** 做能解决问题的最小改动。更少的行数胜过「优雅」的样板代码。
