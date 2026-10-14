# pstack 中文文档站工具说明

本目录（`tools/` + 根目录的 `启动网站.bat` / `更新网站.bat` / `i18n/` / `site/`）是在上游
[cursor/plugins · pstack](https://github.com/cursor/plugins/tree/main/pstack) 内容之上加的一层
「中文文档站」流水线，用于自动同步上游、维护中文翻译、构建并本地部署静态网站。

## 快速开始

| 需求 | 操作 |
|---|---|
| 本地浏览网站 | 双击 `启动网站.bat`（首次自动构建，随后打开浏览器） |
| 拉取上游更新并重建 | 双击 `更新网站.bat` |
| 只做同步 | `node tools/sync.mjs` |
| 查看待翻译文件 | `node tools/translate.mjs` |
| 机器翻译补齐 | 配置 `TRANSLATE_API_URL` 后 `node tools/translate.mjs --apply` |
| 只重建网站 | `node tools/build.mjs` |
| 只启动服务 | `node tools/serve.mjs --port 4370` |

要求：Node.js 18+（纯标准库，零 npm 依赖）、git（仅同步时需要）。

## 目录约定

- `i18n/zh-CN/<与源文件相同的相对路径>.md` —— 中文译文。构建时优先采用；缺失则回退英文原文并在页面顶部标注。
- `site/` —— 构建产物（已加入 `.gitignore`，可随时删除重建）。
- `.upstream-cache/` —— 上游仓库的稀疏检出缓存（已忽略）。
- `tools/upstream-manifest.json` —— 同步清单，记录上游文件列表与提交哈希，用于精确识别上游新增/修改/删除。

## 翻译规范

- 保留 markdown 结构：frontmatter 的键名与 `name` 值不译，`description` 译成中文；
- 代码块、命令、文件路径、URL、链接地址原样保留，只译自然语言正文；
- 表格结构、缩进、HTML 块（如 `<details>`）保持不变。

## 同步的安全边界

`sync.mjs` 只镜像上游 `pstack/` 目录的内容；`tools/`、`i18n/`、`site/`、`*.bat` 等自有文件
永远不会被上游覆盖。上游删除文件时，只会删除 manifest 中登记过的对应文件。
