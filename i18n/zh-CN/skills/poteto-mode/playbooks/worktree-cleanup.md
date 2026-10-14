### Worktree 与模拟器清理

1. 快照与审计。先记录 `df -h /`，然后运行 `scripts/worktree-audit.sh [-b <pr-base-ref>] [repo-path]`（principle-build-the-lever）。不带 `-b` 时，它会把 `MERGED` 对照 `origin/HEAD` 检查，因此当 PR 以其他分支为目标时，要传 `-b origin/<branch>`。它从 `git worktree list` 读取路径，绝不手工输入，因为手工输入的 `myrepo-worktrees/x` 会漏掉位于 `.cursor/worktrees/myrepo/x` 的那个（principle-encode-lessons-in-structure）。它按体积、存在时长、合并状态、未提交工作、PR 状态以及最近触碰过它的聊天对每个 worktree 分类，然后给出建议的桶。转录扫描很慢，放到后台跑。
2. 桶是建议，不是许可。置顶和活跃的聊天才是真正的产物（principle-prove-it-works）。从用户或侧栏拿到这个集合，并交叉核对每个候选。杠杆曾经把用户置顶的 worktree 标记为 `safe`，所以置顶集合说了算。
3. 删除前核实使用情况。对每一行 `verify-recent-chat`，或任何你存疑的项，扇出子代理去读转录，报告该聊天是否被置顶或仍在进行、以及它触及哪些 worktree（principle-guard-the-context-window，转录属于大体量内容）。置顶聊天会通过后台子代理在同级 worktree 中繁衍出 arena 树和复现树，即便这些名字从未出现在侧栏里，它们也在使用中。按「子代理」一节为每个子代理挑选适合该任务的推理档位和快速或标准速度。
4. 对不可逆损失要暂停。`wip:N` 表示 N 处已跟踪的未提交编辑。先展示 diff 并取得决定，因为删除干净的 worktree 还能从其分支恢复，而未提交的工作没了就没了。`scratch:N` 是未跟踪的一次性内容，删掉安全，但要报出文件名。按「自主权」，干净、已合并且未在使用的直接进行；`wip` 和在使用中的要暂停。
5. 修剪已确认的集合。逐路径执行 `git worktree remove --force <path>`。如果目录因被忽略的构建产物而残留，把它 `rm -rf` 掉，然后 `git worktree prune`。分支引用还在，所以不会丢提交。用 `df -h /` 确认并重新列出。
6. 模拟器和其他回收项。模拟器通常是第二大的收益。`xcrun simctl --set testing delete all`（XCTestDevices 克隆）、`xcrun simctl delete unavailable`，以及先 `xcrun simctl runtime list` 再对旧运行时 `runtime delete <id>`。需要时还有更多：Xcode 的 `DerivedData` 和 `iOS DeviceSupport`、`~/Library/Application Support/Cursor`（`state.vscdb.backup`，以及 `snapshots/roots/<root>`——以你曾作为工作区打开的文件夹命名的 `<root>` 会膨胀起来），还有包缓存（pnpm、uv、brew、yarn）。只清理用户没说过要保留的缓存。

这是唯一一个删除用户状态却没有代码评审来兜底差错的行动手册，所以上面这些闸口就是评审。

**回复：** 前后各一次 `df -h /` 及回收的空间、被修剪的 worktree，以及每个被保留项的一行原因（被哪个聊天占用，或有未提交工作）。
