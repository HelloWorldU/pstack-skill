# benny

benny 给你两个用于 slack 问题报告的 cursor 自动化。一个负责分诊每份报告，另一个负责复现已确认的 bug，并可能准备一个小型的修复草稿。

这个目录里的文件是休眠状态的设置与自动化源文件。它们不会作为斜杠技能出现。

## 设置方法

1. 把 cursor 指向 [`FOR_AGENTS.md`](./FOR_AGENTS.md) 并报出目标仓库名。
2. 让设置流程把这整个目录合并到目标位置的 `.cursor/automations/benny/`。它必须保留仅存在于目标位置的文件，并审查冲突而不是覆盖本地修改。
3. 让设置流程在目标仓库的 `.cursor/settings.json` 中为共享依赖启用 pstack：

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

4. 把用户自有的配置放在复制包之外，例如 `.cursor/benny/`。改写 [`configuration.example.yaml`](./templates/configuration.example.yaml) 和 [`feature-map.example.md`](./skills/reproduce-and-fix-issues/references/feature-map.example.md)。
5. 在启用任何一个自动化之前，提交 `.cursor/settings.json`、`.cursor/automations/benny/` 以及任何无密钥的配置。
6. 审查每个新的自动化草稿，或在各自的编辑器中更新已有自动化。然后发送一份无害的测试报告，验证每一条发到源频道的消息都留在原始帖子里。
