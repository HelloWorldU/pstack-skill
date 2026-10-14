---
name: setup-benny
description: 配置 Benny 并准备其分诊与复现自动化。在安装 Benny，或更改其 Slack、tracker、仓库、路由、控制、模型或预算设置时使用。
disable-model-invocation: true
---

# 设置 Benny

Benny 以休眠的自动化包形式随 pstack 一起发布。插件清单只暴露 pstack 的常规技能根目录；本文件和两个操作文件并不是斜杠技能。

用户通过把 Cursor 指向包里的 `FOR_AGENTS.md` 进入设置流程。引导流程会把整个包复制到目标仓库，然后直接在 `.cursor/automations/benny/skills/setup-benny/SKILL.md` 处读取本文件。

Benny 需要外部配置和两个在线的 Cursor 自动化。

在用户明确要求之前，不要创建或更新自动化。绝不把机密值写进插件文件、提示词或会提交的配置里。

## 1. 复制包并启用 pstack 共享技能

在询问 Benny 配置之前、在调用内置的 `/automate` 技能之前，先做这一步。

询问哪个仓库将运行这些自动化。源包是包含 `FOR_AGENTS.md` 的目录。目的地是 `<target-repository>/.cursor/automations/benny/`。

把整个源包合并到目的地：

1. 目的地不存在时创建它。
2. 把每个源文件复制到相同的相对路径。
3. 保留仅存在于目的地的文件。安装或刷新期间绝不删除无关文件。
4. 把用户拥有的配置、功能地图和路由地图放在目的地之外。绝不覆盖它们。
5. 当某个源管理文件与已有文件不一致时，查看 diff 并在不丢弃本地改动的前提下合并。如果归属不明确，停下来询问后再替换。
6. 验证目的地包含 `FOR_AGENTS.md`、本设置文件、两个操作文件及其引用文件和模板。

如果本文件已经是从目标目的地读取的，就把复制视为已完成，并在继续之前执行同样的验证。

把 pstack 添加到目标仓库的 `.cursor/settings.json`。如果该文件或 `.cursor` 目录不存在，创建它。

把下面这段合并进现有的 JSON 或 JSONC：

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

保留每一个无关的顶层设置和每一个其他插件条目。如果 `plugins.pstack` 已存在，只改它的 `enabled` 值。文件使用 JSONC 时，保留注释和合法的 JSONC 语法。编辑后验证文件。

重载目标项目，或以该项目为根启动一个新的代理。验证以下 pstack 共享技能能从项目作用域解析：

- `how`
- `why`
- `tdd`
- `unslop`
- `principle-separate-before-serializing-shared-state`
- `principle-minimize-reader-load`
- `principle-guard-the-context-window`
- `principle-sequence-verifiable-units`
- `principle-fix-root-causes`
- `principle-prove-it-works`

从当前会话或用户作用域插件加载的技能不算数。这项检查必须证明：目标仓库中的一个新代理会通过项目设置获得 pstack。

如果项目作用域的插件安装不可用，或任何共享依赖无法解析，停下来并解释失败原因。

Benny 文件直接从 `.cursor/automations/benny/` 读取。不要把该目录加进插件清单，也不要指望它的 `SKILL.md` 文件出现在斜杠技能列表里。

告诉用户：在启用任何一个自动化之前，必须提交 `.cursor/settings.json`、`.cursor/automations/benny/` 以及任何被引用的无机密配置。除非用户要求，否则不要替他们提交。

这项检查通过后，在线自动化提示词就可以按稳定的仓库相对路径读取已提交的操作文件。它们不得嵌入插件缓存路径，也不得复制文件内容。

## 2. 改写配置

打开这两个复制出来的示例：

- `../../templates/configuration.example.yaml`
- `../reproduce-and-fix-issues/references/feature-map.example.md`

在 `.cursor/automations/benny/` 之外创建用户拥有的副本。这些是配置文件，不是包文件。示例位置：

- 项目配置，例如 `.cursor/benny/configuration.yaml`
- 项目功能地图，例如 `.cursor/benny/feature-map.md`
- 项目路由地图，例如 `.cursor/benny/routing.md`
- 用户配置，例如 `~/.config/benny/configuration.yaml`
- 用户功能地图，例如 `~/.config/benny/feature-map.md`

为自动化可能要复现的每个面向用户的功能填写一个功能地图小节。保持用户视角。不要把实现细节或当前代码路径冻结在地图里。

不要编辑复制出来的示例。包刷新可能会在冲突评审之后更新源管理文件，但绝不能碰用户拥有的副本。

当全新的自动化检出需要读取这些文件时，优先使用目标仓库中已提交的无机密文件。否则，把所需的值转述进在线提示词。只有当内置的 `/automate` 技能确认某个文件已在自动化运行的仓库中提交之后，才能引用该仓库文件。

对已提交的包文件和配置文件使用稳定的仓库相对路径。绝不从在线自动化引用插件源目录或插件缓存路径。

## 3. 填写必选项

询问或确认：

- 来源 Slack 频道 ID
- 可选的运维或状态频道 ID
- 仓库 URL 和默认分支
- 分诊身份或 Slack 用户 ID
- 问题 tracker 类型、团队、项目、标签和接收状态
- tracker 适配技能或 MCP 操作
- 可选的路由地图路径
- 必需的控制技能名称
- 必需的面向用户的功能地图路径
- 状态 emoji 字符串
- PR URL 格式
- 轮询与工作量预算
- 用于分诊、复现、代码工作和媒体审阅的模型 slug

只使用在用户 Cursor 模型选择器或受支持模型列表中显示为可用的模型 slug。不要猜 slug，也不要沿用某个私有默认值。

来源频道、分诊身份、仓库、tracker 适配器、控制技能和功能地图必须明确。只要任何必需值仍然含糊，就让设置失败。

保存之前，用 pstack 的 `unslop` 技能过一遍最终的自动化名称、描述和提示词垫片。

## 4. 检查集成能力

分诊自动化需要：

- 对配置的来源 Slack 频道及其线程的读取权限
- 在该频道中回复线程的权限
- 当报告包含媒体时，获取附件元数据和下载文件的权限
- 通过配置的问题 tracker 适配器进行搜索、读取、创建和更新的权限

复现自动化需要：

- 对来源线程的读取权限
- 在来源频道中回复线程的权限
- 可选：在配置的运维频道中发帖和编辑的权限
- 仓库读取和历史访问权限
- 一个能打开草稿 PR 的 PR 操作
- 配置的控制适配器技能

读写优先使用配置的 Cursor Slack 操作。可选的 `BENNY_SLACK_BOT_TOKEN` 可以填补一个狭窄的缺口，例如编辑一条运维状态消息或下载一个附件。把这个值存放在机密管理器或环境中，不要写进 YAML。

不要使用未文档化的集成端点。

## 5. 准备路由地图

如果用户想要转派或负责人 ping：

1. 把 `../triage-issue-reports/references/routing.example.md` 复制到 `.cursor/automations/benny/` 之外。
2. 把每个占位符替换成公开的或组织内部的值。
3. 默认保持负责人 ping 关闭。
4. 只允许对配置的功能负责人或已确认的可能回归作者使用 ping。

如果没有配置路由地图，分诊可以对报告分类，但不得猜测目的地或负责人。

## 6. 验证控制适配器

阅读 `../reproduce-and-fix-issues/references/control-adapter.md` 和用户已完成的功能地图。

确认具名技能能够：

- 拉起目标应用
- 通过真实 UI 导航到每个已映射的功能
- 通过声明的适配器操作走遍已映射的状态
- 在不强迫结果的前提下检查状态
- 截屏
- 开始和停止录屏
- 清理其进程和临时数据

如果缺少任何能力，保持复现自动化为禁用状态。它必须按失败关闭处理，而不是宣称完成了并未真正执行的复现。

## 7. 准备在线自动化

询问这是首次创建，还是在配置已有自动化。

两条路径都把复制包里的 `../../FOR_AGENTS.md` 作为主要的用户意图来源来阅读。用它理解两个触发器、工具、指令、结果和共享规则。

### 首次创建

一次创建一个自动化。

对每个自动化：

1. 阅读对应的已复制提示词模板，作为次要的内部参考材料。
2. 把 `FOR_AGENTS.md`、填好的 Benny 配置和模板意图整合成一份完整的自然语言请求。
3. 告诉在线提示词：读取并遵循它在 `.cursor/automations/benny/` 下对应的那份已提交操作文件。
4. 使用稳定的仓库相对路径，而不是插件源路径或缓存路径。不要把操作文件内容复制进在线提示词。
5. 阅读并遵循内置的 `automate` 技能。
6. 让 `automate` 去发现 Slack 频道、仓库和已连接的集成。
7. 让 `automate` 确认已复制的包和任何被引用的配置文件都已提交到自动化将要运行的同一个仓库。
8. 让 `automate` 展示其草稿表格、获得批准、询问就绪状态，并打开 Automations 编辑器。
9. 先完成这个自动化的编辑器交接，再开始下一个。

给 `automate` 这份完整的分诊意图，内容从配置中填写：

- 名称 `benny-triage`。
- 每次运行都读取并遵循 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`。
- 由配置的来源 Slack 频道中每条新的顶层报告触发。
- 读取触发它的线程，并且只在该线程内回复。
- 使用配置的问题 tracker 集成。
- 分类、检查证据、追踪原因、去重，并且只为明确的新 bug 建单。
- 以一条仅线程内的判定收尾，带上配置的 `[benny:bug]`、`[benny:performance]` 或 `[benny:other]` 标记和可选的 tracker URL。
- 绝不在来源频道发布根消息。

分诊的编辑器交接完成后，给 `automate` 这份完整的复现与修复意图：

- 名称 `benny-reproduce`。
- 每次运行都读取并遵循 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`。
- 由配置的来源 Slack 频道中同样的新顶层报告触发。
- 使用配置的仓库和默认分支。
- 读取来源线程，并且只在该线程内回复。
- 包含 PR 创建，以及配置的 tracker、控制适配器和功能地图要求。除非 `automate` 确认同一仓库中存在符合条件的已提交文件，否则把已映射的用户路径和状态转述出来。
- 行动之前等待可信的分诊标记。
- 通过已映射的真实 UI 把确切的症状复现两次，并捕获证据。
- 验证已有修复，不在其上另写修复。
- 只有在确认复现之后才尝试可选的有边界修复，然后在证据和检查都通过时打开草稿 PR。
- 绝不在来源频道发布根消息。

不要重复 `automate` 在 Slack、仓库、集成、完整性、身份验证、草稿评审、批准、就绪确认或编辑器交接方面的工作。

### 已有自动化

内置的 `automate` 技能只负责创建。不要用它来搜索、检查或更新已有自动化。

先完成配置、路由、控制适配器和功能地图验证。然后把下面这份简洁的编辑器清单交给用户。

对已有的分诊自动化，更新：

- 名称和描述
- 直接指示其读取 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`
- 新顶层 Slack 报告触发器和来源频道
- Slack 线程读取和回复能力
- 问题 tracker 集成
- 转述后的分诊指令、仅线程内规则和 Benny 判定标记

对已有的复现自动化，更新：

- 名称和描述
- 直接指示其读取 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`
- 与之匹配的 Slack 触发器和来源频道
- 仓库和默认分支
- Slack 线程读取和回复能力
- PR 操作
- tracker、控制适配器和功能地图要求
- 转述后的标记等待、证据、验证和有边界修复指令

请用户直接在各自的 Automations 编辑器里更新每个已有自动化。不要创建替代品或重复项。

### 创建边界

绝不直接调用自动化后端服务或后端自动化工具。绝不使用携带草稿字段的浏览器 URL。绝不构建或打开 Cursor 协议深链。对新的自动化，唯一的完成路径是内置 `automate` 技能经评审的 Automations 编辑器交接。

在编辑器保存之后、线程安全测试通过之前，不要启用任何一个自动化。

## 8. 测试线程安全

使用测试频道或一条无害的测试报告。

测试之前，确认目标仓库的 `.cursor/settings.json`、`.cursor/automations/benny/` 以及每个被引用的无机密配置文件都已提交到自动化检出所用的分支上。确认两个在线提示词都指向各自确切的已提交操作文件。如果任何检查失败，停止。告诉用户该自动化还不能启用。

验证：

1. 分诊存储了根 `thread_ts`，并且恰好以一条回复发布判定。
2. 判定包含一个配置的标记。
3. 复现只接受来自配置的分诊身份的标记。
4. 复现保持同一组不可变的来源坐标。
5. 没有出现来源频道根消息。
6. 被委派的 worker 无法使用任何 Slack 写操作。
7. 坐标缺失、父消息被删除或预检失败时，不产生任何发帖和 tracker 工单。

七项检查全部通过之后，才放开正常流量。
