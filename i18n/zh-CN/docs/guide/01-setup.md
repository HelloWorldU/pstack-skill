# 安装 pstack

在本页中，你将安装插件、选择 pstack 使用哪些模型，并运行你的第一个任务。安装只需一条命令加一次简短的对话。

## 安装插件

在 Cursor 聊天中运行：

```text
/add-plugin pstack
```

Cursor 会确认插件已安装。

## 选择模型

运行：

```text
/setup-pstack
```

[`/setup-pstack`](../../skills/setup-pstack/SKILL.md) 会检测你有权访问的模型，询问推理预算，向你展示每个角色（代码代理、判断、评审小组），并询问你的选择。回答问题即可。它会写入 `~/.cursor/rules/pstack-models.mdc`——一个小规则文件，每个 pstack 技能都会读取它。

默认以 `xhigh` 推理强度运行，与 `large` 预算相同。`unlimited` 把每个模型提升到其最高档，最高到 `max`。Opus 会到 `max`。Grok 最高只到 `xhigh`，所以保持在那里。`medium` 和 `small` 会降低推理强度，花费更少 token。

你只覆盖自己在意的部分。规则中没有对应行的角色保持技能默认值。要恢复默认值，删除该角色的那一行。重新运行 `/setup-pstack` 会保留所有模型与默认值不同的角色。当默认值变化时，变化之前写下的规则仍然钉住旧默认值，所以删除那些角色行，或者删除该文件，然后再次运行 `/setup-pstack`。

你可能想知道用 Auto 会怎样。把某个角色设为 `inherit-parent` 或 `auto`，pstack 就会省略子代理的 `model` 字段，于是子代理继承你父聊天的模型。两个值含义相同，也都不是模型标识符（slug）。对于小组（panel）角色，值是一个列表，每个条目运行一个子代理，所以列表长度决定了小组规模。设置还会配置 `swarm workers`，即每个 `/swarm` 工作者的默认模型，除非某场竞赛为每一方指定了模型。

## 接受验证技能的提议，或不接受

在设置结束时，`/setup-pstack` 会寻找一种在你的项目中证明应用行为的方式——要么是一个 `verify-*` 技能，要么是已有的验证工具。如果两者都没有，它会提议一次：用 [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 生成一个。

答应的话，它会写入 `.cursor/skills/verify-<app>/`，一个项目本地技能，教代理像用户一样操作你的应用。它会在交付之前亲自证明该技能有效一次。拒绝的话，设置继续往下走。你随时可以自己运行 `/create-verification-skill`。[验证并交付](./06-verify-and-ship.md#create-a-project-verification-skill) 对此有深入介绍。

如果你是 pstack 新手，建议答应。能自查工作的代理会一直推进，直到检查通过；不能自查的代理会把每个结果交回给你手工检查。在本指南的所有内容中，验证技能的回报最大。

设置完成后，开一个新聊天。模型规则对新会话生效。

## 控制成本

pstack 会在子代理和评审小组上花费额外 token。这是严谨性的代价。想少花一点：

- 重新运行 `/setup-pstack`，选择更小的推理预算或更便宜的模型。主聊天用强模型、代码角色用更便宜更快的模型，是个不错的搭配。
- 把某个角色设为 `auto` 或 `inherit-parent`，让它运行在聊天自身的模型上。
- 缩短小组列表。每个条目运行一个子代理。
- 把 `/poteto-mode` 留给需要严谨性的工作。小而明显的修改不需要它。

## 运行你的第一个任务

挑一件真实但小的事，用你向同事描述它的方式来描述：

```text
/poteto-mode add a --json flag to this command. text output stays byte-identical. verify both.
```

观察待办列表。它的前几项是从匹配到的行动手册复制进来的步骤——对这个提示词来说是 Feature 行动手册。如果 `/poteto-mode` 跳过某一步，该步骤会带着 `skip: <reason>` 留在列表里，你能看到它选择不做什么。

从这里开始，你可以正常输入后续指令。要让 `/poteto-mode` 在整个聊天中保持开启，在 `/` 菜单中选中它后用 Option+Enter（Mac）或 Alt+Enter（Windows），而不是 Enter。这会把它变成一个 [Custom Mode](https://cursor.com/docs/skills)（自定义模式），在你退出之前每一轮都保持在上下文中。Custom Mode 在 Agents 窗口和 CLI 中可用。普通 Enter 只把该技能附加到一条消息上，随着聊天推进它会淡出。

下一篇：[通过 `/poteto-mode` 分派工作](./02-poteto-mode.md)。
