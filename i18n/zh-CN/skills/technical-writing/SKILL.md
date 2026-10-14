---
name: technical-writing
description: "分层的技术写作标准：Diátaxis 结构、Google 开发者风格句子、STE 指令规则、Global English 句法。适用于 /technical-writing，或撰写、评审文档、RFC、readme、PR 描述或提交信息时。"
disable-model-invocation: true
---

# 技术写作

写到让一个疲惫的工程师第一遍就能读懂。四个层次全部应用。

有三条规则凌驾于各层之上：

- **砍掉每一个不干活的词。** 句子缺了某个词还能成立，这个词就走人。「In order to」就是「to」。「It is important to note that」什么都不是。
- **用简短的日常用词。** 用「use」，不用「utilize」。用「help」，不用「facilitate」。用「do」，不用「perform」。长词必须用精确性买回它的长度。
- **当一条规则让句子变糟时，换种方式修句子，或者干脆不动它。** 一个遵守了所有规则、读起来却像机器写的句子，已经失败了。

代码库就是词表。写真实的符号、文件、标志或命令名，不要写同义词或对它的描述。

不要自造行话。用开发者会脱口而出的词：「move」「delete」「a budget that only decreases」，而不是「evacuate」「ratchet」「endgame」。命名的模式可以用，只要文档第一次出现时说明它的含义。发现新的违规词及其替换词时，把它作为对 `unslop` 抽象比喻规则的增补，连同 diff 一起写进你的回复。不要改那个技能。

## 变化节奏

一篇文档可以遵守每一层规则，读起来却仍然像机器写的：每句话都截得一样短，处处没有观点，没有具体内容。

- 有意混合句长。短句砸实一个论点。长句承载一个事实连同它的条件或后果。
- 一句一个想法不等于一句一个长度。承载两个想法的句子要拆开。只承载一个想法的长句保留。
- 在模式允许的地方要有观点。解释型文章要权衡取舍，所以说出你的看法，而不是罗列优缺点。参考型文章保持冷静客观。
- 具体胜于空洞。不写「schema changes can cause issues」（schema 改动可能引发问题），而写「a column rename fails the build」（改个列名就会让构建失败）。

## 先选模式（Diátaxis）

一篇文档，一种模式。两个问题选出模式：内容是指引行动（动手做）还是指引理解（动脑想），它服务于学习还是工作？

- 行动 + 学习：**教程（tutorial）**。
- 行动 + 工作：**操作指南（how-to）**。
- 理解 + 工作：**参考（reference）**。
- 理解 + 学习：**解释（explanation）**。

这个罗盘可以套在整篇文档上，也可以套在一句话上。

**教程：在做中学。** 学习者的成功是你的责任，不是他们的。开头说学习者将做出什么，而不是他们将「学到」什么。每一步都产出可见结果，尽早、频繁。告诉他们应该看到什么：预期输出、提示词变化、日志行。解释压缩到一个从句加一个链接。保持具体。用「我们」来写，指令用命令式：「First, do x. Now, do y.」

**操作指南：通往目标的步骤。** 解决一个人遇到的问题，而不是机器能执行的一个操作。假定对方有能力，跳过教学。只有行动：不跑题、不讲背景、不为完整而完整。把这些做成链接。允许分叉和判断：「If you want x, do y.」按任务给指南命名：「How to calibrate the radar array」，而不是「Radar array calibration」。

**参考：供查阅的事实。** 只描述。不指导、不劝说、不发表意见。冷静、完整、确定。陈述事实、选项、限制和错误，不含糊其辞。镜像被描述对象的结构，让代码和文档可以对照着导航。把材料放在读者期望的地方。尽可能从代码生成。

**解释：理解与为什么。** 一个有边界的主题，离开产品也能读。每个标题都应该能在前面默加一个「关于……」。锚定在一个真实的「为什么」问题上。给出上下文：设计决策、历史、约束、替代方案。观点只允许出现在这里，别处都不行。

不要混用模式：教程里不放参考表格，参考里不做教程式手把手，操作指南里不争论。拆开并互相链接。

## 句子写给读者（Google 开发者风格）

- 用「you」称呼读者，用现在时。「will」只留给确实以后才发生的事。
- 说清谁做什么：「the compiler checks」，而不是「is checked」。只有当动作发出者未知或无关紧要时才用被动。
- 指令写成命令：「Click Submit.」事实平铺直叙。永远不要「should be done」。
- 条件放在指令前：「To delete the document, click Delete.」
- 常见情况放前面。例外放后面。
- 听起来像一个懂行的朋友。不要 buzzword、不要比喻说法、指令里不要「please」，步骤里永远不用「simply」「easy」「quickly」。真那么简单，读者就不会来这里了。
- 不要预告（「we will soon support...」），不要让连续的句子以相同短语开头。
- 链接文字要说明去向：页面标题或一句简短描述。永远不要「click here」。宁可在本页多写一句上下文，也不要把读者甩出页面。
- 标题承载论点，不只是话题（「Pick the mode first」，而不是「Modes」）。句式大小写。任务标题是裸动词短语（「Create an instance」）。概念标题是名词短语。每页一个 h1，不跳级。
- 序列用编号列表，其余用无序列表。用一个完整句子引出列表。条目保持平行结构。
- 代码用代码字体。UI 元素加粗。使用 serial comma（牛津逗号）。去掉「etc.」，如果列表不全就提前说明。

## 让陈述一次只加载一个（STE 规则）

- 指令一句一条。其他地方一句一个想法。
- 超过约 20 个词的指令、超过约 25 个词的其他句子，拆开。
- 警告或条件放在它所守护的步骤之前：「If hot oil touches your skin, injuries can occur.」
- 保留「the」和「a」：「Remove backup file」有两种读法，「Remove the backup file」只有一种。
- 给每个词一个含义、一个职责，然后用到底。如果「check」表示检查，就别再拿它表示约束。
- 每个动作选定一个词并坚持：用「start」，不要这里「start」那里「initiate」。
- 步骤写成直接命令，绝不写成叙述，绝不用被动：「Install the component」，而不是「the component must be installed」。
- 尽可能避免「-ing」词。

## 不让任何一句话有两种读法（Global English）

- 让「only」「not」这类词贴着它们修饰的词：「only fails on growth」和「fails only on growth」说的是两回事。
- 拆开长名词串：「the proto import budget check script」变成「the script that checks the proto-import budget」。
- 让每个「it」「they」「this」都指向一个明显的东西。拿不准就重复名词。永远不要用「this」或「which」指代整个从句。
- 不要丢动词：「Phase 1 moves the converters and Phase 2 the runtime」让 Phase 2 没有了动词。给它补一个。
- 保留体现结构的小词，比如「Ensure that the switch is off」里的「that」。绝不用清晰度换字数。
- 系列中重复冠词能避免误读时就重复：指两个东西写「the client and the host」，不写「the client and host」。
- 当一句话有两种分组方式时，说清「and」「or」连接的是哪几部分。「Both...and」「either...or」「if...then」是免费的消歧器。
- 用句号，不用分号。把破折号换成新句子。
- 括号里的文字要么是完整语法单位，要么自成一句。绝不用「(s)」构成复数。
- 不用斜杠：写「a, b, or both」，不写「a/b」或「and/or」。
- 每个东西只有一个名字，处处一致。一篇文档对同一个东西说「the gate」「the ratchet」「the budget check」，等于教了三样东西。没变化的东西不要换说法。
- 跳过习语、口语、拉丁缩写和比喻。

## 语气与仓库细则

- 对本技能触碰的每一篇文档应用 **unslop** 技能。那个技能拥有劣质文本模式目录：AI 词汇、废话、含糊、格式马脚。
- PR 描述和提交信息也是写作。除 Diátaxis 外，每一层都适用。PR 正文是一份评审者一分钟内能读完的简报。不要粘贴 swarm 日志、SHA 列表或指标表格。链接过去。
- 产品 UI 文案不是文档。那些用你们产品的文案规范。
- 代码片段用制表符缩进。写真实路径。让每个计数或目录树声明在落地它的那个提交上为真，并附上能重新生成它的命令。

## 示范

改前：

> proto 导入棘轮预算脚本的参数配置通过 budget.json 进行。请注意，务必记住：带 --write 运行（它会更新已提交的预算以反映当前计数）只应在降低预算时进行。如果超出，CI 将失败。

改后：

> `budget.mjs` 从 `budget.json` 读取已提交的预算，并统计导入 proto 的文件数。如果计数超过预算，CI 就会失败。只有在要降低预算时才运行 `budget.mjs --write`。
