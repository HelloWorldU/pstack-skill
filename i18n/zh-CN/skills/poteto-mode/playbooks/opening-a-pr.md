### 开 PR

在每个其他行动手册的末尾调用。

**Worktree。** 在从 main 拉出的 git worktree 里工作。子代理继承它。同一分支上的多个 `Task` 调用各自使用自己的 worktree，或者在两次调用之间执行 `git fetch && git reset --hard origin/<branch>`。分支被无关工作弄脏：先打出 patch，新建干净 worktree，再应用。worktree 缠成一团：从 main 重置，最小化重做。

**提交。** 勤提交。开 PR 前变基成小而有序的提交。每个提交都是未来的 PR：可落地，顺序要能讲清来龙去脉。修复属于刚做的提交时用 amend。可分离时就新开提交。提交正文不复述主题行。

**PR。** 提交前对 diff 跑 `cursor-team-kit` 的 `/deslop`，评审前跑 `/no-comments`。每个 PR 标题、描述和提交正文都用 `/technical-writing` 来写（除 Diátaxis 外的每一层都应用，并套用 STE 词汇规则：一个动作一个词，保留冠词，能用普通动词就不用 `-ing` 形式），然后应用 `/unslop`。

**标题。** 采用 Conventional Commits 的 `type(scope): subject` 格式，结尾不加句号。type 如 `feat`、`fix`、`docs`、`refactor`、`test`、`chore` 或 `perf`。scope 是领域，如 `pstack` 或 `poteto-mode`。subject 要短、用祈使句，当有真实符号承载这次改动时点名它，例如 `fix(pstack): retarget opening-a-pr babysit trigger`。

**描述。** PR 正文是写给拿着 diff 的评审者的一分钟简报，不是实验记录本。它说明改动为何存在、刻意没做什么、可能破坏什么，以及你如何证明它有效。句子要短而简单，少放标识符，不要文字墙。正文会成为 squash 提交的正文，所以那个提交要控制在 40 行以内。用 `##` 标题而不是加粗引语，按以下顺序，无话可说的节直接删掉：

- `## Why`：问题和做法，1–3 个短句。不要 SHA、变基家谱或“基于 main”的开场白。
- `## What changed`：1–3 个短要点。只有当真实符号或路径承载改动时才点名。重命名或重定向要点名两侧。
- `## Scope`：每篇都要。1–3 个短项，说明覆盖什么、刻意不做什么（后续跟进、已知缺口）。不要符号、路径或逐文件的长篇大论。
- `## Tradeoffs`：只写评审者不问就会起疑的被否方案。没有真正的取舍时跳过。
- `## Blast Radius`：1–2 句，说明波及谁或什么，以及为什么安全或有风险。如果 main 是红的，说明让它继续红着的代价。
- `## Verification`：1–3 个要点，每条是一次真实的运行路径及其结果。性能：一个带单位的主数字，`before → after`，其余细节链接到 arena 或 swarm 目录。不要样本量方法论、swarm 流水账或指标表格。

各节之后，能佐证论断时附上视频或截图。完整 SHA、swarm 或 arena 各通道的流水账、杠杆纠正的长文、逐文件清单和“CLEAN”裁决，都放进链接的附件，而不是正文。

**Forge。** 在第一个 PR 操作之前确定用哪个 forge（代码托管平台），并在创建、编辑、查看、监视和合并中保持一致。GitHub CLI（`gh`）是默认。如果 `command -v origin` 成功且 Origin 能解析仓库，优先用 `origin pr ...`。如果 Origin 不存在或无法解析仓库，留在 `gh` 并记录这次回退。不要强求 Graphite（`gt`）。

**内置 PR 工具。** 当运行环境提供内置 PR 工具时，创建、编辑、改目标分支、标记就绪都通过它，绝不通过 forge CLI。CLI 创建的 PR 会丢掉该工具跟踪的信息。工具不覆盖的事情用已确定的 forge；运行环境没有这种工具时，所有 PR 操作都用 forge。

**大小与栈。** 五个窄 PR 胜过大而全的一个。栈是一条基分支链。根 PR 指向 trunk。每个子分支变基到其父分支的精确尖端，其 PR 指向父分支。父分支合并后，按 `playbooks/shipping.md` 第 4 步把子分支挪到 trunk 上。没有内置 PR 工具时，按已确定的 forge：用 `origin pr create --status open --base <parent-branch>` 或 `gh pr create --base <parent-branch>` 创建子 PR，用 `origin pr edit <pr> --base <parent-branch>` 或 `gh pr edit <pr> --base <parent-branch>` 改目标分支。只有相互独立的工作才从 trunk 拉分支。做较重的栈上工作之前先变基到 trunk。

**就绪状态。** 每个 PR 都以就绪状态打开，绝不用草稿。内置 PR 工具可能默认草稿，所以通过它创建时每次都要设 `draft: false`。用 Origin 时传 `--status open`。用 `gh` 时不要带 `--draft`。如果 PR 仍开成草稿，通过 PR 工具标记就绪，或按已确定的 forge 运行 `origin pr ready <number>` 或 `gh pr ready <number>`。在谈论 PR 状态之前，先运行 `origin pr view <number>` 或 `gh pr view <number>`。

**Babysit。** 开 PR 不会启动 babysit。贴出 URL 然后继续构建。先完成当前阶段或整个栈。只有当整个栈已存在且用户要求时，才单独跑一轮 babysit。每开一个 PR 就 babysit 会拖慢构建，还会把检查浪费在后续波次要重做的提交上。反馈偏离意图时要顶回去。

开 PR 的子代理要运行 `interrogate`、`/deslop` 和 `/no-comments`，并贴出 URL。然后不做 babysit 就返回父代理，除非它是 Autopilot-full 或 Autopilot-stack 的负责人。那种负责人的任务书会指派 babysit 循环，这正是 `playbooks/babysit.md` 所等待的请求。负责人在代码就绪报告之后启动该循环，按其行动手册报告 merge-ready 或 STACK-READY，并且不受本节和 `playbooks/babysit.md` 中“等整个栈构建完再 babysit”规则的约束。
