---
name: principle-attack-the-premise
description: "当两个或更多共享同一前提的修复在同一道闸口上失败时应用。在下一个修复之前，先普查哪些参与者持有这种失衡，然后质疑前提，而不是再写一个假设它成立的修复。"
disable-model-invocation: true
---

# 攻击前提（Attack the Premise）

当两个或更多共享同一前提的修复在同一道闸口上失败时，要怀疑的是前提，而不是这些修复。

**为什么：** 共享前提下的每一次失败，都是关于这个前提的证据。

**模式：**
- **把前提写下来。** 前提就是每个失败的修复都假设过的那一句话。
- **在下一个修复之前先普查。** 按参与者统计失衡。普查展示的是哪些参与者持有失衡，而不是失衡有多大。按[构建杠杆（Build the Lever）](../principle-build-the-lever/SKILL.md)，把普查写成一个可重跑的脚本。
- **读出偏斜。** 如果每次运行都是同几个参与者持有大部分失衡，说明有什么东西把这个角色分派给了它们。找出是什么在分派这个角色。按[修根因（Fix Root Causes）](../principle-fix-root-causes/SKILL.md)，这个分派就是下一个「为什么」。
- 按[懒惰协议（Laziness Protocol）](../principle-laziness-protocol/SKILL.md)，**消除不对称，而不是补偿它**。在参与者之间轮换这个角色、随机化分派、或把角色挪走，让没有参与者每次运行都持有它。回退路径、共享池、批量交接或定期再平衡都会把分派留在原地，并且每次运行都增加工作。

**停：**
- 在前提被写下来、普查做出来之前，不要开始下一个修复。
- 如果普查在各参与者之间是均匀的，前提就不是原因。去别处找原因，并把普查留作证据。

本原则不同于[从第一性原理重新设计（Redesign from First Principles）](../principle-redesign-from-first-principles/SKILL.md)——后者围绕一个新需求重建设计，本原则质疑的是当前设计所假设的一个事实。
