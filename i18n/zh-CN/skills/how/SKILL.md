---
name: how
description: "适用于 'how does X work'、改动代码前的走读，以及放置/归属/分层问题（'where should this live'、'which package owns this'、'is this the right layer'）。解释子系统架构、运行时流程、新人上手的心智模型。动机问题请用 why。"
disable-model-invocation: true
---

# How

探索代码库，回答「X 是怎么工作的？」这类问题。产出架构讲解，定位在高级工程师上手一个子系统的水平：足以建立可工作的心智模型，又不至于多到读起来像带注释的源码。

每次派生都是一个 Task 子代理，`subagent_type: generalPurpose` 且 `readonly: true`。探索者使用 `pstack-models.mdc` 规则中的 `how explorer` 一行（默认 `grok-4.7-xhigh-fast`），每个讲解者使用 `how explainer` 一行（默认 `claude-opus-5-5-xhigh`）。把 `model` 设为该行的值；规则或该行缺失时用默认值。值为 `auto` 或 `inherit-parent` 时不设置 `model`。如果 Task 工具拒绝某个 slug，使用默认值并说明情况。如果连默认值也拒绝，从报错信息里取同家族最接近的有效 slug。按 **poteto-mode** 技能的 Subagents 一节，为每个子代理挑选适合这份工作的推理等级和快速或标准速度。

## 1. 评估复杂度

如果范围含糊，说明你的解读，然后开始探索。用户可以纠正方向。

- **简单**（单个模块、一个小工具、「函数 X 是怎么工作的」这类狭窄问题）：不用探索者。派生一个讲解者，一趟完成探索和讲解，用 `references/explainer-prompt.md` 构建，去掉探索者发现那一节。转到第 4 步。
- **复杂**（横跨多个文件或服务的子系统、横切功能、完整的架构概览）：转到第 2 步。

拿不准时，走简单路线。

## 2. 探索（仅复杂情况）

把问题分解为 2 到 4 个角度，每个角度是子系统的一个独特切片。在一条消息中派生所有探索者，每个都带着 `references/explorer-prompt.md` 并填好各自的角度。

## 3. 综合（仅复杂情况）

所有探索者返回后，派生一个讲解者，用 `references/explainer-prompt.md` 并填入每位探索者的发现。

## 4. 呈现

呈现讲解者的输出。为清晰度或结合对话上下文做轻度编辑可以。不要实质改写。

## 输出格式

讲解使用 `references/explainer-prompt.md` 中定义的各节，删掉不适用的：概览、关键概念、工作原理、东西都住在哪、坑点。
