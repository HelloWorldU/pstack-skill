# benny 自动化意图

## 我想自动化什么

我想要两个在同一个 slack 问题频道里协同工作的 cursor 自动化。

### 自动化 1：分诊问题报告

- 触发：当有人在我配置的源 slack 频道发布新的顶层报告时，我希望这个自动化从该报告启动，并保留其原始的帖子坐标。
- 行为：我希望它阅读帖子和附件，把报告分类为 bug 或性能问题、功能请求、提问或反馈、或者转派，并在路由之前追踪可能的归属层。
- 跟踪器：我希望它在我配置的跟踪器里搜索重复项，更新有把握的重复项，并且只为明确是全新 bug 的报告创建工单。
- 工具：我希望它拥有 slack 帖子的读取和回复权限、我配置的跟踪器集成，以及我可选的路由表。
- 结果：我希望在源帖子里有且只有一条回复，包含简短的结论和 `[benny:bug]`、`[benny:performance]` 或 `[benny:other]`。bug 或性能标记可以附带跟踪器 URL。
- 边界：我绝不允许这个自动化在源频道发布根消息。

### 自动化 2：复现并修复已确认的 bug

- 触发：我希望这个自动化从同一个新的顶层报告启动，或使用设置期间选择的其他受支持的触发方式，然后在原始帖子里等待可信的分诊标记。
- 闸门：当有人明确认领修复时，我希望它停下来。如果某个已有的 PR 或已合并的提交可能修复该报告，我希望它做验证，而不是提出与之竞争的改动。
- 行为：我希望它使用我配置的控制适配器和功能地图，通过真实 UI 把确切的症状复现两次，并截取截图、视频和只读状态交叉核对。
- 修复：我希望它验证已有的 PR，而不是在其之上另写代码。确认复现之后，它可以尝试一次有边界的根因修复，在测试成本低廉时使用 TDD，对爆炸半径做冒烟测试，并且只有在前后对照证据通过时才开一个 PR 草稿。
- 工具：我希望它拥有 slack 帖子读取和回复权限、仓库和历史记录访问权限、PR 草稿创建、我配置的跟踪器，以及我的控制适配器。
- 结果：我希望在源帖子或可选的运营帖子里得到证据和经过验证的结果，外加一个可选的 PR 草稿。更新应当简洁。
- 边界：我绝不允许这个自动化在源频道发布根消息。

### 共享规则

- 我希望源频道和根帖坐标在整个运行期间保持不可变。
- 我把工具型和调试型 bot 当作证据，而不是委派对象或修复归属者。
- 我允许子代理帮忙，但它们不能向 slack 发消息，也不能拿到 slack 凭据。
- 我希望这整个包被提交到目标仓库的 `.cursor/automations/benny/`。它的 `SKILL.md` 文件是给自动化直接使用的指令，不是已注册的插件技能。
- 我希望 pstack 只通过目标仓库已提交的 `.cursor/settings.json` 启用，且仅用于 `how`、`why`、`tdd`、`unslop` 和必需的原则技能这类共享依赖。
- 我希望每个在线自动化提示词直接阅读其已提交的运行文件。我不要插件缓存路径、复制的摘录或斜杠技能发现。
- 我把用户自有配置、功能地图、路由表和密钥放在 `.cursor/automations/benny/` 之外，这样包的刷新就无法覆盖它们。
- 当频道坐标、跟踪器访问、控制适配器或功能地图缺失或不确定时，我希望两个自动化都关闭即失败（fail closed）。
- 我只要 PR 草稿。不要合并或部署。

### 我的配置

- 源 slack 频道：`<channel>`
- 可选运营频道：`<channel or none>`
- 仓库和默认分支：`<repo>`、`<branch>`
- 跟踪器：`<type, team, project, labels, intake status>`
- 路由表：`<path or none>`
- 分诊身份：`<slack identity>`
- 控制技能：`<configured skill or adapter>`
- 功能地图：`<committed same-repo path outside the copied pack, or behavior to paraphrase>`
- 模型：`<triage, reproduce, code, media review>`
- 状态表情字符串：`<seen, reproducing, reproduced, blocked, fixing, failed, pull request opened>`
- 预算：`<polling, verdict wait, follow-up, repro, rejection, fix>`
- 可选 bot token 能力：`<none, file download, or editable operations status>`

从 [`configuration.example.yaml`](./templates/configuration.example.yaml) 和 [`feature-map.example.md`](./skills/reproduce-and-fix-issues/references/feature-map.example.md) 开始。把它们复制到本包之外再填写，例如 `.cursor/benny/` 下。把秘密值保存在密钥管理器或环境变量中。

## 给代理的说明

人类通过把 cursor 指向这个文件来进入设置流程。不要寻找或调用被发现出来的 benny 斜杠技能。

1. 询问哪个仓库将运行这些自动化。
2. 把包含本 `FOR_AGENTS.md` 的目录当作源包。
3. 把整个源包合并进 `<target-repository>/.cursor/automations/benny/`。
4. 保留每一个仅存在于目标位置的文件。绝不删除无关文件，也不覆盖用户自有的配置、功能地图或路由表。
5. 当源管理路径上已存在的目标文件与源不同时，审查 diff 并在不丢弃本地修改的前提下合并。如果归属不明确，先停下来问，再替换。
6. 验证复制后的 `FOR_AGENTS.md` 和 `skills/setup-benny/SKILL.md` 在目标仓库中存在。
7. 直接从目标仓库阅读并遵循 `.cursor/automations/benny/skills/setup-benny/SKILL.md`。

我希望你把下面这段配置合并进目标仓库的 `.cursor/settings.json`：

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

保留每一个无关的设置和插件。当现有文件使用 jsonc 时，保留注释和合法的 jsonc 语法。

我希望由一个以目标仓库为根的全新代理来做验证。确认 pstack 的 `how`、`why`、`tdd`、`unslop` 以及 benny 用到的原则技能在项目作用域内可解析。不要把从当前会话或用户作用域安装加载的技能算进去。

如果项目作用域插件不可用，或任何共享依赖无法解析，停下来并解释失败原因。不要把 `.cursor/automations/benny/skills/` 加进插件清单，也不要指望它的文件出现在斜杠技能列表里。

告诉我：`.cursor/settings.json`、`.cursor/automations/benny/` 以及任何被引用的无密钥配置必须在启用任何一个自动化之前提交。在我明确要求之前，不要创建或更新任何自动化。

首次创建时，用内置的 `/automate` 为分诊跑一次、为复现修复跑一次。在开始第二个之前，完成第一个自动化的草稿审查、批准、就绪检查和 Automations 编辑器交接。

把这份意图和完成的配置转述进每一份草稿。分诊提示词必须阅读并遵循 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`。复现提示词必须阅读并遵循 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`。只有在 `/automate` 确认这些路径已提交到自动化将要运行的仓库之后，才使用这些仓库相对路径。

对于已有的自动化，不要用 `/automate` 去检查或更新它们。先验证配置，然后使用复制后的设置文件里的简洁字段清单，让我能在各自的编辑器里直接编辑每个自动化。不要创建重复的自动化。
