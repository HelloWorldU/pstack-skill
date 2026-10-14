# 创建便签

创建便签让用户可以从浏览器或 CLI 保存一条带标题的便签，可以取消未完成的草稿，并能从第二个面向用户的视图确认已保存的便签。

## 子功能

- `create-open` 从浏览器的每个入口打开一个空白编辑器。
- `create-save` 持久化标题和正文。
- `create-cancel` 丢弃未完成的浏览器草稿。
- `create-cli` 从终端创建同样形状的便签。

## 如何到达（用户视角）

- 点击浏览器工具栏中的 `New note` 按钮。
- 在浏览器中、焦点不在任何可编辑字段时按 `n`。
- 在终端运行 `notes create --title <title> --body <body>`。

## 用 control-notes 驱动

前置条件：

- Notes 在 `http://127.0.0.1:4173` 健康运行。
- 没有标题为 `Release checklist` 的便签。
- `control-notes doctor` 报告了预期的 URL 和一次性数据目录。

- **打开编辑器。** 点击 `New note`。运行 `control-notes browser click --role button --name "New note"`。出现一个名为 `Note editor` 的表单，焦点位于 `Title` 文本框。
- **输入内容。** 输入标题和正文。运行 `control-notes browser fill --role textbox --name "Title" --value "Release checklist"` 和 `control-notes browser fill --role textbox --name "Body" --value "Tag and publish"`。`Save note` 按钮变为可用。
- **保存便签。** 点击 `Save note`。运行 `control-notes browser click --role button --name "Save note"`。出现名为 `Note saved` 的状态提示，标题显示为 `Release checklist`。
- **确认持久化。** 返回便签列表并重新打开该便签。运行 `control-notes browser click --role link --name "All notes"` 和 `control-notes browser click --role link --name "Release checklist"`。编辑器中显示出两个已保存的值。
- **取消草稿。** 打开一条新便签，输入 `Discard me`，然后点击 `Cancel`。运行 `control-notes browser click --role button --name "New note"`、`control-notes browser fill --role textbox --name "Title" --value "Discard me"` 和 `control-notes browser click --role button --name "Cancel"`。界面返回便签列表，且没有 `Discard me` 链接。
- **CLI 入口。** 创建第二条便签。运行 `control-notes cli -- notes create --title "CLI note" --body "Created from terminal" --format json`。退出码为 `0`，且 stdout 包含新便签的 ID 和标题。
- **取证。** 从 `All notes` 重新打开两条已保存的便签。运行 `control-notes browser snapshot --aria --path artifacts/create-note/list.aria.txt` 和 `control-notes browser screenshot --path artifacts/create-note/list.png`。产物中显示 `Release checklist` 和 `CLI note`。

## 坑

- 当文本框持有焦点时按 `n` 会输入字符，而不是打开新编辑器。
- 标题在保存时会被去除首尾空白。断言渲染后的标题，而不是草稿输入值。
- 仅凭保存状态提示不足以作为证据。要从列表重新打开便签。
- 清理测试数据时删除 `Release checklist` 和 `CLI note`，但保留它们的证据产物。
