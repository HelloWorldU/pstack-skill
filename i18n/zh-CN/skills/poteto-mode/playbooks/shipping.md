### 交付

**你拥有落地的东西。独立验证每个 PR，只从根部落盘连续的已验证段，然后把手从 stack 上拿开。**

1. **先解析 forge，再在每个 PR 落地前独立验证它。** GitHub CLI（`gh`）是默认。如果 `command -v origin` 成功且 Origin 能解析该仓库，对每个 PR 操作用 `origin pr`。否则留在 `gh` 上并记录这次回退。绝不要求 Graphite（`gt`）。每个 PR 一个验证者，各为一个 Cursor 云代理，用匹配的控制技能（如 `cursor-team-kit` 的 `control-ui` 或 `control-cli`）以用户的方式运行改动，parent 对 head，并在该 PR 上发布 `PASS`、`PASS+NOTES` 或 `FAIL`。只有来自没写过该代码的代理的结论才算数，因为作者检查的是它本来想构建的东西。绿色 CI 和机器人批准评审不是结论，因为两者都不会像用户那样运行改动。
2. **只落盘以底部为根的连续已验证段。** 从最低的未合并 PR 往上走，在第一个没有 `PASS` 或 `PASS+NOTES` 的地方停下。它下面的 PR 就是这段，最上面那个是天花板。已验证 PR 压在未验证 PR 之上时要等待，因为没有下面的代码它无法落盘。一个分支既不持有也不需要那段代码的 PR，可以移到 trunk 上自行落盘。它需要一个新的结论，因为旧结论运行时下面垫着那段代码，而 trunk 没有。
3. **复查结论仍描述当前代码。** 结论覆盖的是一个 patch，而链式 rebase 会把它上面的每个 PR 移到新 SHA 而不让任何检查失败。在信任旧结论之前，比较结论 SHA 处的 `git patch-id` 与当前 head。当 patch 只在测试、文档或 lint 配置上有差异时，如果它运行的东西在两个 SHA 上除噪声外构建结果相同，该 lane 的结果成立。噪声是同一结论 SHA 两次构建之间也会出现的差异，或内嵌的提交 SHA。报告每类噪声及其文件，让读者能核对这个判断。改动本身仍要得到新检查和评审，因为旧结论没见过它。没有构建产物的 lane（如开发服务器）无法展示这一点，所以重跑它，并重新验证任何漂移的东西。
4. **自底向上落盘，一次一个 PR。** 总是合并该段中最低的未合并 PR，用 `origin pr merge <pr>` 或 `gh pr merge <pr> --squash`。在 Origin 上，裸命令还会合并你点名 PR 之下的每个 PR；在 GitHub 上，base 仍是其父分支的 PR 会合进那个分支而不是 trunk。把 PR 读回来确认结果（`origin pr view <pr>` 或 `gh pr view <pr> --json state,mergedAt,baseRefName`），因为合并命令在合并队列只排了队时也可能报告成功，而请求了自动合并不等于已合并。已落盘的 PR 读作 merged 且 base 为 trunk，而不是其父分支。只在结论覆盖其当前 head 的 PR 上布防 `--auto`（Origin merge-when-ready 或 GitHub auto-merge），因为它会落盘任何就绪的 head。合并落地后，把 base 是被合并分支的 PR 改目标到 trunk（`origin pr edit <pr> --base <trunk>` 或 `gh pr edit <pr> --base <trunk>`），把它的 patch 移到合并结果上，用 `--force-with-lease` 推送。结论覆盖的是 patch 而不是其提交，所以由第 3 步的 patch-id 规则决定结论是否存活。检查通过且结论存活后合并它。
5. **落盘期间别碰 stack。** 第 4 步对下一个 PR 的移动是对分支或 base 的唯一改动，因为合并会落盘其分支与 base 此刻持有的任何东西，不管有没有结论。在 GitHub 上，用 `playbooks/babysit.md` 的排队监视器（`scripts/watch-pr/watch-pr --queued-stack --stack-prs <bottom-to-top>`）在 `/loop` 下盯着这段，直到它在天花板处报告 `COMPLETE`。在 Origin 上，每次 `origin pr checks <pr> --watch` 返回后用 `origin pr view <pr> --checks` 重读当前 PR，直到天花板读作 merged。base 在其父合并时移到 trunk 是预期行为，不是要修复的损伤。如果合并停滞，先弄清原因再动任何东西。
6. **在天花板处停下。** 扩展这段需要新结论，所以它是第 1 步的新一轮。

**回复：** 已验证段及其天花板、每个 PR 的结论及产出者、落盘了什么及你如何确认、下一个缺口需要什么。
