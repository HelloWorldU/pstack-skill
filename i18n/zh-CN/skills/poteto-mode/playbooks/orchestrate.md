### 编排

**你拥有的是整个项目计划，而不是代码。撰写简报、清空队列、保持 frontier 常绿、做决策。** 适用于把整个项目交给一个常驻协调者会话的场景：跨越多天、叠放许多 PR、几十到几百个子代理，人类每天查看两次而不是每五分钟一次。把单个任务推进到某个判定条件，那是 Autonomous run。一次需要定制工作流的雄心运行，那是 figure-it-out。当工作的寿命超过任何单个代理时，路由到这里。一个代理能在会话预算内完成的工作不算一个项目计划。

仪式感必须随项目规模伸缩。对于廉价且几乎相同的单元，按各节的指示折叠仪式。

其余一切都由三条规则承载。

- 完成是队列事件，不是中断。
- 每次 spawn 和每次 resume 都逐字携带常驻指令。
- 简报就是产品。含糊的简报会悄无声息地失败，因为 worker 无法向你提问。

#### 角色与位置

- **协调者（本会话）。** 本地。负责框定、撰写简报、清空收件箱、拥有人类报告、做判断调用。它从不撰写或编辑代码。冲突合并、链式 rebase 和代码改动永远是任务。在本地 git 开销低的仓库上，机械化地落盘一个已验证的单元（对 worker 的提交做快进或干净的 cherry-pick，然后 push）属于协调者可以亲自做的簿记。把已完成的工作排在一个空闲的 stacker 后面，等于让截止日期颗粒无收。整个循环端到端都是代理化的。代理只通过 Task 工具被 spawn、resume 和 drain。按 Subagents 一节为每个子代理选择适合任务的推理等级和 fast 或 standard 速度。状态的读写经由 `scripts/orch/orch.ts` 在 drain 点进行，进一条命令、出一行结果。CLI 从不 spawn、等待或唤醒任何东西。
- **子协调者。** 始终为本地、持久、每条轨道一个，且仅当项目超过一个协调者的 drain 能力时才设。协调者自己能 drain 的轨道不需要中间层。每嵌套一层都要重新支付一次完整的定向前导开销，而阻塞式子协调者会在父级空转时遮住它的子代理。拥有其轨道的单元与看板，为其 worker 撰写简报，spawn 自己的 worker 和验证者（嵌套可工作到深度 3，嵌套 spawn 拥有完整的 Task schema，包括 `environment`）。在波次边界上汇总聚合结果。从不原样转发子级报告。把在途子代理数量限制在一次 drain 能处理的范围，大约十个，作为滚动窗口。绝不用阻塞式批次，那会为每个批次付出最慢子代理的代价。
- **Worker / 验证者。** 始终 `environment: "cloud"`，除非任务需要这台机器：来自 `cursor-team-kit` 的 `control-ui` 或 `control-cli` 运行时验证。读取 `agent-transcripts/` 下的本地 transcript。模拟器与本地 IDE 状态。只存在于本机的认证。云端代理无法读取本地存储，所以它们的简报要么内联所需内容，要么指向仓库路径。倾向更少、更宽的 worker。每个 worktree 或分支只设一个写入者（principle-separate-before-serializing-shared-state）。让一个单元的验证者运行在与该单元 worker 不同的模型家族上。

层级保持在协调者、轨道、worker 三层。按项目撰写轨道分解（构建、落盘与验证是常见的切法，不是必需的形状）。硬编码的蜂群树试过，因为太僵化而搁置了。

#### 存储布局

在当前代理的存储中创建 `orchestrate/<project-slug>/`（路径在系统提示词里）。每个文件恰好有一个写入者。属主发布事实，读者在读取时聚合。簿记用 `bun scripts/orch/orch.ts`，下文写作 `orch`；它输出的规范纯文本 TSV 与 JSON 在没有 CLI 时也可读。

- `preferences.md` 是常驻指令登记册：编号的行，每行一条约束（模型策略、stack 形状与数量、验证门槛、禁止路径、升级策略）。逐字粘贴进每次 spawn 和每次 resume。指令会跨 resume 衰减，每掉一条都要花掉人类一个回合。当你发现自己在重申某条指令时，先追加一行再行动（principle-encode-lessons-in-structure）。
- `overview.md` 是持久的 PR 与 issue 数据库。追加写。绝不要每次事件都整体重写。
- `units.tsv` 每个单元一行：id、track、state、branch、PR、head SHA、brief 路径。就地更新行。
- `frontier.json` 是计算出的合并 frontier，见 Stack 安全一节。
- `ledger.tsv` 是验证台账，见验证一节。
- `inbox/` 存放完成指针。`gates.md` 停放人类闸门（问题、选项、无答复时的默认动作）。
- `decisions.tsv` 是经由 show-me-your-work 技能留下的轨迹。
- `status.md` 在每次 drain 时由 `units.tsv` 和 `ledger.tsv` 派生，绝不手工维护。从表格重新生成它，而不是把事件叙述进去。

#### 简报

你给代理的提示词是你唯一的产品，一份潦草的简报会在整棵树上复利成泔水代码。每次 spawn 都带上全部内容。你填不出的字段，就是你还没界定好的单元。

```
GOAL         one sentence, the outcome, executable by a stranger with no chat access
SCOPE        paths this unit may write; paths it may not; its exclusive worktree or branch
CONTEXT      pointers to files and PRs; upstream reports pasted in full when this unit
             depends on them, because workers cannot see siblings
ACCEPTANCE   checkable criteria, one per line
VERIFY       exact commands or the control-skill path, plus known gotchas
TIMEBOX      rough cap on runtime; on expiry, return partial findings and stop rather than run on
FORBIDDEN    no PR retargets or merges, no rebase, no force-push, no fixes outside scope,
             plus unit-specific bans
REPORT       status, branch, head SHA, PRs, verdict, what you actually ran, deviations,
             suggested follow-ups
STANDING     <preferences.md pasted verbatim>
```

简报大小随单元定。一条命令的单元，把模板折叠成一个段落，但仍要点名目标、范围、verify 命令和报告形状。给一个两行改动套上 4KB 的脚手架，写它和遵守它的成本都超过改动本身。本地 spawn 可以按存储路径引用常驻指令文件。逐字粘贴是给云端 spawn 和每次 resume 用的。

子协调者的简报要加上它的轨道边界与单元清单、spawn 预算（云端为默认、本地例外清单）、drain 协议，以及汇总格式（每个子级：名称、状态、PR、head SHA、结论、一行说明，外加轨道状态与 frontier 增量）。

依赖是上下文接力，不只是排序。未声明的上游上下文会让 worker 瞎猜。缺字段是拒绝 spawn 的条件。每个子协调者每波次抽审一份 worker 简报，与被抽样的波次并发进行，绝不要作为挡在它前面的闸门。一份失败的简报会停掉该轨道并修正子协调者的指令，而不只是修正 worker，因为简报质量在运行后期会衰减。绝不要对简报做 resume 链。用整合后的范围重新 spawn。

#### 步骤

1. **框定。** 把完成判定条件陈述为可计数的东西（"全部 126 个单元已合并，每个都在台账里验证为 `unit-test-verified` 或更好"）。量化范围：单元数、粗略工作量、预期的 stack 数、wall-clock 预算。如果一个代理能在该预算内完成，到此为止，改用 Autonomous run。折叠不得依赖另一份文档的存在。它的含义是：直接在本会话中干活，在有帮助的地方用普通 worker，验证内联，边做边落盘，下面这些存储、登记册或试点机制一概不用。对照预算安排落盘节奏。到预算大约 70% 时，停止 spawn，落盘已验证的东西。按项目命名各轨道。有争议的分解或单向门，要在试点之前先过 arena 技能。框定只呈现一次。可逆的准备工作继续推进，不用等。
2. **安装运行时。** 运行 `orch init`。经由 show-me-your-work 技能开启轨迹，在任何 spawn 之前写好常驻指令，并用 `orch frontier set --repo <repo-dir>` 从现有 PR 播种 `frontier.json`，当 forge 是 Origin 时加 `--forge origin`。
3. **试点。** 让一个单元走完整条路径：简报、worker、验证、stack 条目、台账行、合并。试点的存在是为了证伪简报模板、verify 配方和单元大小——此时代价是一个代理而不是五十个。在任何扇出之前，根据试点证据修正契约。试点规模随单元定。对于几乎相同的廉价单元组成的项目，第一个单元就是试点，作为普通单元运行、verify 命令内联，它一落盘就开始扇出。专用的试点管线（独立的验证者代理、审计闸门）是给昂贵或新颖的单元形状用的，对克隆单元无意义——串行试点对它们没有可证伪的东西。
4. **扩量。** spawn 一个不超过在途上限的 worker 滚动窗口，随子代理完成而补充。阻塞式批次会为每个批次付出最慢子代理的代价。只有越过角色一节的一次-drain 阈值时，才 spawn 轨道子协调者。每次 drain 后重算就绪工作。把上游报告接力进下游简报。兄弟通信只能向上。抽样简报审计与被抽样波次并行运行，失败时停掉下一次补充，而不是当前这次。
5. **Drain。** 在每个 drain 点运行下面的队列纪律。
6. **落盘。** 落盘是持续的，绝不是一个收尾阶段。集成从第一个已验证单元开始，与剩余波次并行运行。在重型仓库上，stacker 从第一波起就是常驻角色，随单元验证边做集成。在本地 git 开销低的仓库上，协调者按角色一节亲自落盘已验证单元。在做上层 stack 工作之前保持 frontier 常绿。由 Stack 安全一节管辖。只在合并或收到新 head SHA 报告时推进 `frontier.json`。
7. **收尾。** 清空最终收件箱，把每个 spawn 过的代理对账到一个终态行（done、abandoned、zombie-reconciled），在真实工件上确认判定条件，确认每个已落盘 PR 对其当前 head SHA 有结论，按 show-me-your-work（包括其跨模型评审）审计轨迹，把反复出现的纠正编码进 `preferences.md` 或简报模板。保持存储原样。它就是事后复盘材料。

#### 队列与 drain

- 收到完成通知时，运行 `orch inbox push <agent> <unit> <status> [--report PATH]`，然后回到你手头的事。绝不内联深审。需要评审的完成会变成一个验证者单元。绝不在 drain 内审 diff。
- 在四个点批量 drain：关键区段结束、轨道汇总、frontier 监视器唤醒（通过 loop 技能布防，带长心跳兜底）、人类报告之前。每批以 `orch inbox drain` 开始。drain 期间到达的等下一批。
- 你要先完成的关键区段：撰写简报、stack 操作、冲突决策、写闸门、更新台账或 frontier。
- 每次 drain 给每个指针分类（landed、needs-verify、failed、zombie、noise），通过 `orch unit add`、`orch unit set` 和 `orch ledger record` 写入结果行，运行 `orch status`，然后在一条消息里 spawn 下一波。
- 在其轨道的汇总点上为每个 spawn 过的子代理对账：已到达、已重 spawn、或其范围已被明确吸收。悄悄重做一个失踪子代理的工作，会同时掩盖浪费的花费和它的结果本该填补的覆盖缺口。
- 一个 drain 回合以 `orch status` 的三行结束：各状态计数、变化内容、打开的闸门。细节在 `status.md` 里。完整回复契约适用于检查点和收尾。

#### Stack 安全

- frontier 是计算出来的对象，绝不是叙述。每次合并和 stack 变更后重算 `frontier.json`：有序 PR 列表、分支名、head SHA、一个世代号、最低的未合并 PR。该命令沿 checkout 当前分支走 PR base 链，所以链顺序与 PR 状态来自 forge。默认使用 `gh`。当项目把 forge 解析为 Origin 时传 `--forge origin`。head SHA 来自本地分支引用，所以从 stacker 的克隆上解析它。没有 PR 的分支会报错而不是瞎猜。
- 每个 stack 恰好一个 stacker 可以改变拓扑（链式 rebase、force-push、base 改目标、合并），在其 stack 内串行。在常驻指令里记录持有者。链式 rebase 在云端运行。这个规模下的本地 rebase 会把笔记本拖垮。
- Worker 从不 rebase，也从不改目标或合并 PR。保姆遵循 `playbooks/babysit.md`，每个 stack 一个，限定在一个不可变的 frontier 世代内。它们把冲突报告给 stacker，而不是自己 rebase。
- PR 关闭与改目标只经由 stacker。关掉一个 base PR 会把它上面的整条链变成孤儿。合并与 stack 手术是带简报的任务，和别的单元一样。
- 一个回溯监视器跟踪已合并 PR 的 revert、合并后 CI 破坏和孤儿后续。

#### 验证

验证随单元伸缩。当 VERIFY 是一条廉价命令时，worker 运行它并报告输出，协调者抽查回执。专用验证者代理（与 worker 不同模型家族）用于验证昂贵、依赖判断或高爆炸半径的单元。一个全部产出只是重跑一条命令的验证者代理是仪式，不是验证。

用 `orch ledger record` 写台账行。用 `orch ledger check` 检查当前 PR 和 head SHA。`ledger.tsv` 每个结论一行，以 PR 号加 head SHA 为键：`live-ui-verified | unit-test-verified | type-check-only | verifier-blocked | verifier-failed`。CI 绿是结论的输入，不是结论。行为性工作需要比 `type-check-only` 更好。`verifier-blocked` 不是通过。等环境恢复后重 spawn。`verifier-failed` 得到一个修复单元，而不是重新验证。Worker 可以自我报告。验证者在同一键上覆盖它。新 head SHA 使该行作废，所以 restack 后要重新验证。台账回答的是"这个验证过吗"，不靠记忆，也不靠 transcript。

一个单元在它的产出落地瞬间被外化之前不算完成，绝不攒到运行末尾。Worker 推送它的分支，验证者写它的台账行，回执落到存储里。只存在于某台 VM 上的工作，在 VM 死掉时等于从未做过。

#### 活性与失败

- 绝不为了查看一个代理而 resume 它。resume 会重启一个空闲代理。只读探测：台账、`units.tsv`、`gh`、已推送的分支、Cursor 仪表盘里云代理的状态。transcript 的 mtime 不是活性。
- 无声死亡会在收件箱得到一条合成事后行（单元、失败模式、最后证据、选项）。证据到达时据此重新规划。绝不等到完全静止。
- 按模式重试：cap-hit 或 oom，以更小范围重 spawn。network-drop，原样重试。tool-error，换一个模型重试。未知，重试一次。重试两次，然后放弃该单元并绕过它重新规划。
- 迟来数小时回来的僵尸，在接受任何东西之前先对照当前 frontier 和台账对账。通过一个全新单元抢救独有发现，绝不盲合并。
- 当继续 spawn 会让整棵树产出垃圾（上游输出坏了、验收标准坏了、基础设施死了）时，在常驻指令顶部写一行停止线，让在途工作完成，修复原因，清除它。
- 给你自己的基础设施重试设界，就像给子代理设界一样。连续几次工具中止后，停止重试。把终态交接写入持久状态（完成了什么、在哪里、恢复用的确切命令），然后结束运行。
- Cursor 重启之后：本地代理死了，云端工作没有。重读常驻指令和 `units.tsv`，重算 frontier，按 PR 和分支（而不是代理 id）重新接管云端工作，根据存储的简报加当前状态为每条轨道重 spawn 一个子协调者，drain，恢复。死会话的存储锁会在下次写入时自行清除。`orch` 会替换持有者 pid 已消失的锁。

#### 升级

到达人类的事，批量进状态页而不是逐条：不可逆动作（对共享分支 force-push、部署、删除、关闭别人的 PR）、实验无法裁决的真正产品或偏好决策、与观察到的现实矛盾的常驻指令、挺过一次重新规划的项目级死胡同。问之前先把每条停为 `gates.md` 条目，并让工作绕过它。

绝不到达人类的事：frontier 微调、rebase 机制、重试、CI 抖动分诊、评审线程分诊、格式修复、简报已禁止的范围（拒绝并继续）、以及"我要不要继续"。拿不准时，行动并记录。

运行中期的发现只修复阻塞 frontier 的东西。其余一切停进后续跟进。在这种扇出规模下，一点点范围泄漏会成倍变成没人要的 PR。

**回复：** 在检查点和收尾时：来自 `units.tsv` 和 `ledger.tsv` 的判定条件及其计数、各轨道及各自落盘内容、frontier（PR 列表加 SHA）、结论摘要、放弃了什么及原因、等待人类的闸门（唯一的请求项）、存储路径、轨迹路径。数字来自表格，不是叙述。附上 PR 链接。
