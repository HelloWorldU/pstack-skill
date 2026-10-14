# 搜索便签

搜索让用户可以按标题或正文查找便签、查看匹配的便签，并区分「没有匹配」和「搜索不可用」。

## 子功能

- `search-open` 从浏览器的每个受支持入口打开搜索。
- `search-match` 返回标题和正文匹配，不改变便签数据。
- `search-open-result` 在便签编辑器中打开一条结果。
- `search-empty` 为没有匹配的查询展示完整的空状态。
- `search-clear` 清除查询并恢复最近便签视图。
- `search-cli` 从终端返回相同的匹配便签。

## 如何到达（用户视角）

- 点击浏览器工具栏中的 `Search` 按钮。
- 在浏览器中、焦点不在任何可编辑字段时按 `/`。
- 在终端运行 `notes search <query>`。

## 用 control-notes 驱动

前置条件：

- Notes 在 `http://127.0.0.1:4173` 健康运行。
- 一次性数据目录中包含正文为 `Draft budget` 的 `Quarterly plan`。
- `control-notes doctor` 报告了预期的 URL 和数据目录。

- **工具栏入口。** 点击 `Search` 按钮。运行 `control-notes browser click --role button --name "Search"`。出现一个名为 `Search notes` 的对话框，焦点位于其搜索框。
- **键盘入口。** 关闭对话框，让页面获得焦点，然后按 `/`。运行 `control-notes browser press --key "/"`。出现同一个对话框，且页面没有插入斜杠。
- **标题匹配。** 输入 `quarterly`。运行 `control-notes browser fill --role searchbox --name "Search notes" --value "quarterly"`。`Search results` 列表包含 `Quarterly plan`，且不包含 `Grocery list`。
- **正文匹配。** 把查询换成 `budget`。运行 `control-notes browser fill --role searchbox --name "Search notes" --value "budget"`。结果 `Quarterly plan` 保持可见，并带有正文匹配的摘录。
- **打开结果。** 点击 `Quarterly plan`。运行 `control-notes browser click --role link --name "Quarterly plan"`。对话框关闭，编辑器标题显示为 `Quarterly plan`。
- **空状态。** 重新打开搜索并输入 `volcano`。运行 `control-notes browser fill --role searchbox --name "Search notes" --value "volcano"`。搜索完成后出现名为 `No matching notes` 的状态。
- **清除查询。** 点击 `Clear search`。运行 `control-notes browser click --role button --name "Clear search"`。搜索框被清空，`Recent notes` 区域替换结果列表。
- **CLI 匹配。** 从终端搜索。运行 `control-notes cli -- notes search "quarterly" --format json`。退出码为 `0`，且 stdout 包含一个标题为 `Quarterly plan` 的对象。
- **CLI 未命中。** 搜索一个不存在的值。运行 `control-notes cli -- notes search "volcano" --format json`。退出码为 `0`，且 stdout 为 `[]`。
- **取证。** 捕获填充好结果的搜索状态。运行 `control-notes browser snapshot --aria --path artifacts/search/results.aria.txt` 和 `control-notes browser screenshot --path artifacts/search/results.png`。两份产物都能辨认出 Notes、查询词和 `Quarterly plan`。

## 坑

- 当编辑器或搜索框持有焦点时按 `/` 会输入字符，而不是打开搜索。
- 结果在短暂防抖后更新。等待结果列表或空状态出现，不要用固定时长的 sleep。
- 除非用户启用 `Include archived`，否则归档便签会被排除。
- CLI 默认输出人类可读格式。用 `--format json` 获得稳定的断言。
- 打开一条结果会改变浏览器状态。验证另一个查询之前要重新打开搜索。
