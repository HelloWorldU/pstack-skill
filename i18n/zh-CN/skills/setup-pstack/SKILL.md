---
name: setup-pstack
description: "配置 pstack 每个角色使用哪个模型、以及用多大的推理预算。检测你可用的模型，并写入一条始终生效的规则来覆盖技能默认值。适用于 /setup-pstack、「配置 pstack 模型」、「pstack 预算」，或想更改 pstack 的模型选择时。"
---

# Setup pstack

写入 `~/.cursor/rules/pstack-models.mdc`，一条始终生效的规则，用来设定 pstack 每个角色的模型。

## 步骤

### 1. 检测可用模型

枚举本次会话中可以传给 `Task` 子代理的模型 slug。这是可靠的来源。如果 Cursor 还提供能列出用户有权使用模型的 models API 或 CLI，优先用它以求完整。如果一个都检测不到，请用户粘贴他们可用的 slug。绝不写入你未确认可用的真实 slug。别名 `inherit-parent` 和 `auto` 始终有效，尽管它们不是检测到的 slug。

### 2. 加载当前状态

默认的角色-模型映射就是下面第 5 步展示的规则形态。如果 `~/.cursor/rules/pstack-models.mdc` 已存在，读它，把它的 `# budget` 行和各角色值当作当前选择。否则从这些默认值开始。角色不在第 5 步里的行（比如 `how critics`）来自已退役的角色，删掉它。

### 3. 预算、映射、确认

**(a) 询问预算。** 优先用 AskQuestion，而不是自由文本。提供以下四个选项，标签一字不差；当规则里已记录预算时，指出当前预算。没有规则时，说明 `large` 与技能默认值一致。

- `unlimited — max reasoning`
- `large — xhigh reasoning`
- `medium — high reasoning`
- `small — medium reasoning`

**(b) 应用预算。** 从技能默认值构建工作表；重复运行时，保留你此前按系列、列表或别名（`inherit-parent`、`auto`）改过的任何角色。`unlimited`、`large`、`medium`、`small` 把每个真实 slug（面板条目也包括在内）的 effort 词元分别设为 `max`、`xhigh`、`high` 或 `medium`。effort 词元是最后一个词元，或末尾带 `fast` 时的倒数第二个词元，阶梯为 `max` > `xhigh` > `high` > `medium` > `low`。如果结果不是检测到的 slug，用同系列中 effort 不超过目标的最高检测 slug；否则把该角色标记为需要选择。`inherit-parent` 和 `auto` 不变。所以 `unlimited` 会把 `claude-opus-5-5-xhigh` 变成 `claude-opus-5-5-max`。Grok slug 最高只到 `xhigh`，所以在 `unlimited` 下，回退把 Grok 放到 `xhigh`，而 `grok-4.7-xhigh-fast` 保持原样。`large` 让两个默认值都保持原样。`small` 把它们变成 `claude-opus-5-5-medium` 和 `grok-4.7-medium-fast`。

**(c) 展示角色并确认。** 展示每个角色及其模型，把任何不在检测集合里的真实 slug 标记为需要选择。同时列出第 2 步删掉的每一行。询问是原样接受还是修改特定角色，选项提供检测到的模型加上 `inherit-parent` 和 `auto`（两者都表示：该角色跑在父聊天模型上，这正是 Auto 用户保持在 Auto 上的方式）。优先用 AskQuestion，而不是自由文本。对面板角色（arena runners、architect runners、interrogate reviewers），值是一个列表，每个条目各跑一个子代理，别名条目也算，所以列表长度决定数量。`arena cross-judge pool` 也是列表，但 Arena 会从中选一个值，其模型系列尽可能与父代理不同。`swarm workers` 是每个 worker 的默认模型，除非某次竞赛或对比为某个臂分配了别的模型。

### 4. 校验

写入的每个真实 slug 必须在检测集合里。`inherit-parent` 和 `auto` 永远通过。如果选中的真实 slug 不可用，停下来重新问。

### 5. 写入规则

写入 `~/.cursor/rules/pstack-models.mdc`，带 `alwaysApply: true`、一行 `# budget`（写明所选标签及其目标 effort），以及每个角色一行，使用与 poteto-mode 相同的标签。整体覆盖写入，让重复运行保持幂等。形态如下：

```
---
description: pstack per-role model choices (overrides skill defaults)
alwaysApply: true
---
# pstack model configuration. One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` or `auto` as a value: the role runs on the parent chat model (omit Task `model`). Alias entries in a panel list still count toward its fan-out.
# budget: large (xhigh)
feature, refactoring: grok-4.7-xhigh-fast
bug-fix: grok-4.7-xhigh-fast
perf-issue: grok-4.7-xhigh-fast
hillclimb: grok-4.7-xhigh-fast
judgment and prose: claude-opus-5-5-xhigh
hardest tasks: claude-opus-5-5-xhigh
how explorer: grok-4.7-xhigh-fast
how explainer: claude-opus-5-5-xhigh
why investigators: grok-4.7-xhigh-fast
why synthesizer: claude-opus-5-5-xhigh
reflect tooling: grok-4.7-xhigh-fast
reflect judgment, divergent, synthesizer: claude-opus-5-5-xhigh
arena runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
arena cross-judge pool: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
swarm workers: grok-4.7-xhigh-fast
architect runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
interrogate reviewers: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
```

### 6. 确认

告诉用户规则已写入，对新会话生效。重跑本技能即可更新它。

### 7. 提供一个验证技能（可选）

检查项目里有没有办法驱动真实应用来取证（某个 `verify-*` 技能，或现成的测试装置）。如果没有，问一次：「要不要一个项目本地的验证技能？这样代理就能像用户一样驱动应用、证明改动有效。我可以用 /create-verification-skill 生成一个。」答「要」就调用 `/create-verification-skill`（无论 pstack 装在哪都能解析：工作区、用户级或插件）。答「不」就继续，不再劝。
