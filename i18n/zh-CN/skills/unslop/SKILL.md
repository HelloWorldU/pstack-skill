---
name: unslop
description: 去除任何文字中的 AI 腔痕迹。
disable-model-invocation: true
---

# Unslop（去泔水）

编辑文本以去除 AI 模式。扫描下列模式，然后改写。保留原意，贴合预期语气。

## 要检测和修复的模式

规则编号是稳定的 id，供其他技能引用。删除一条规则会留下空号。

### 内容

3. **肤浅的 -ing 短语。** "highlighting..."、"ensuring..."、"reflecting..."、"showcasing..."、"fostering..."。删掉，或用真实来源扩写。
5. **含糊的归因。** "Experts believe"、"Industry reports suggest"、"Some critics argue"。点名来源，否则删掉。

### 语言

7. **AI 词汇。** Additionally、crucial、delve、enduring、enhance、fostering、garner、interplay、intricate、landscape（抽象义）、pivotal、showcase、tapestry（抽象义）、testament、underscore、vibrant。换成朴实的词。
8. **花哨的「是」。** "serves as"、"stands as"、"boasts"、"features"。直接说「是」或「有」。
9. **"Not just X, but Y."** 直接陈述观点。
10. **硬凑三条。** 不要把观点强行凑成三条。用自然的数量。
11. **同义词轮换。** 一段话里 protagonist、main character、central figure、hero 轮番出现。选一个，一用到底。
12. **虚假范围。** "from X to Y"，而 X 和 Y 并不在一条有意义的尺度上。直接列出主题。

### 风格

13. **破折号滥用。** 完全避免 em dash。只用句号或逗号（不用括号，不用 en dash，也不用连字符冒充破折号）。如果一层想法需要隔开，结束句子或用逗号。
14. **冒号滥用。** 列表或例子之前可以用冒号，但不要拿它当句中连接件。"If you're coming from traditional automation: instead of registering event handlers, you describe conditions" 里的冒号没有增加任何信息。改写，让观点自己站住，不要靠对比的框架。"Describing when the scheduler should fire works best as plain English." 同样的意思，不靠拐杖标点。
15. **加粗滥用。** 不要给每个专有名词或缩写都加粗。
16. **行内标题式列表。** 信号是一个加粗标签加冒号，后面复述同一句话："**Performance:** Performance improved..."。把它们改成散文。以句号结尾、点明条目、并且后面跟着真正新细节的加粗引子（"**Schema in TypeScript.** Tables live in one file."）没问题，不算信号。
17. **标题式大写（title case）。** 用句式大小写（sentence case）。
18. **装饰性 emoji。** 从标题和列表项中移除。
19. **弯引号。** 用直引号。

### 沟通残留

20. **聊天机器人套话。** "I hope this helps!"、"Let me know if..."、"Of course!"、"Certainly!"、"Found the smoking gun!" 删掉。
22. **谄媚语气。** "Great question! You're absolutely right!" 直接回应。

### 废话

23. **填充短语。** "In order to" 改成 "To"。"Due to the fact that" 改成 "Because"。删掉 "It is important to note that"。
24. **过度对冲。** "could potentially possibly be argued that it might" 改成 "may"。
25. **空泛的结尾。** "The future looks bright." 写出具体的计划或事实。

### 行话

26. **抽象隐喻名词。** Substrate（底座）、wedge、wedge in（加进去）、vector（方式、方法）、locus、vantage、nexus、primitive 作名词、harness 作隐喻、"API surface" 里的 surface、bedrock、scaffolding 作隐喻、modality、paradigm、gold-plating（超出工作所需）、ratchet 作隐喻（用该机制的真名，或「只会收紧的限制」）、evacuate 表示移动代码（移出去）、endgame（最后阶段）、north star、flywheel。这些词读起来很技术，但通常都有一个更朴实的具体词。选那个具体的词。

### 平实表达

27. **说它做什么，不说它给人什么感觉。** "the database stays close at hand"、"SQL you can read"、"types that follow your schema" 说的是一种感觉。改法是指名机制或数字："`.toSQL()` returns the exact string sent to the database"、"a column rename fails the build"。先问这句话要让读者做什么或知道什么，然后把它写出来。如果无法改写成具体的指令、事实或数字，就删掉。再查一遍：如果这句话原封不动也能出现在另一个项目的文档里，那它对这一个项目什么也没说。删掉。
28. **把过密的句子改短或拆开。** 如果读者要回读才能解析一个句子，把它拆成两句或删掉从句。一句话一个意思。
29. **主动语态。** 优先使用。抓住 "is/are/was/were + 过去分词" 并点出施动者："queries are validated" 改成 "the compiler validates queries"，"the file is parsed by the loader" 改成 "the loader parses the file"。只有当施动者未知或确实无关紧要时，被动才合适。
30. **删副词，或换更强的动词。** "runs quickly" 改成 "is fast" 或给出数字，"significantly improves" 改成实测的差值。副词给弱动词撑腰，说明动词选错了。
31. **用朴实的词。** "utilize" 和 "leverage" 改成 "use"，"facilitate" 改成 "help"，"numerous" 改成 "many"，"in the event that" 改成 "if"。更花哨的同义词很少更清楚。
32. **做作的文风。** 有字面说法可用时偏用隐喻或修辞：格言式短句（"wire it or delete it"）、为效果而用的残缺句、拟人化的代码（"the plan holds it"）、比喻动词（"rides along"、"stands on"）、套路化的框架句。"A dial worth turning" 改成 "a parameter worth varying"。想说什么就直说。隐喻名词见规则 26。
33. **过度压缩。** 丢冠词、无谓语动词、符号化表达，以及让读者解码而不是阅读的缩写。"Parser rejects bad date → exit 2, no write" 改成 "The parser rejects a bad date, exits with code 2, and writes nothing."。写完整的句子，带上冠词和动词，把箭头和缩写都拼出来。
