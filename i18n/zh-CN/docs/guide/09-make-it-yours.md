# 让它成为你的

poteto-mode 是一个人的风格。底下的机制——行动手册、路由、模型角色——套上你的风格一样好用。本篇涵盖：生成个人模式、从一次会话中沉淀教训、修好仓库让代理不再重复犯错、撰写一个聚焦的技能，以及在信任一次技能改动之前先做测试。

起步要比你以为的更小。第一天你不需要很多技能，甚至不需要整个插件。平实地写提示词，观察代理在哪里翻车，等同一个失败出现第二次时再添一个技能或检查。

## 用 `/automate-me` 生成你自己的模式

```text
/automate-me
```

你不用描述自己的风格，因为 [`/automate-me`](../../skills/automate-me/SKILL.md) 会从你的历史里把它读出来。它在当前工作区挖掘你最近的转录记录，寻找反复出现的偏好——关于你喜欢怎样的回复、委派、验证、代码、行文和流程——然后问你哪些模式真的是你。它通过 Cursor 内置的 `create-skill` 流程起草 `.cursor/skills/<你的名字>-mode/SKILL.md`，把草稿过一遍 [`/unslop`](../../skills/unslop/SKILL.md)，再从一个 worktree 开一个 PR，让你像评审任何其他改动一样评审它。

习惯漂移了，就再跑一次：

```text
/automate-me update my mode skill with everything since its last edit
```

更新模式只挖掘技能上次改动之后的历史。它保留你没有推翻过的规则，修订有新证据的规则，并且只为真正新的模式增加章节。

## 用 `/reflect` 沉淀一次会话的教训

刚做完一个让你学到东西的任务，马上运行：

```text
/reflect that took way too long. capture what we learned so the next run doesn't repeat it.
```

[`/reflect`](../../skills/reflect/SKILL.md) 把转录记录发给三个并行的评审者，然后由一个综合者把提案分拣为 `Accepted`、`Rejected` 和 `Backlog`，并在任何技能改动发生之前等你批准。只有当一个提案会改变未来的某个决定时才批准它。一次奇怪的会话只是轶事，不是规则。

## 用 `/correct` 修好环境

当你为同一个错误一次又一次纠正代理时，修复应该落在仓库里，而不是你的下一条提示词里。按牢固程度给选项排序：

1. 用架构或更好的数据结构让这个错误不可能发生。
2. 用类型挡住它，或者用一个错误信息里点名修法的 lint 或 CI 检查挡住它。
3. 用测试抓住它。
4. 把它写成文档或代理规则。代理跳过规则时什么都不会失败，所以这条排在最后。

人工评审不在清单上。一个必须在每个 PR 上抓同一个错误的评审者，正是这里要修掉的问题。[`/correct`](../../skills/correct/SKILL.md) 负责做这件事：

```text
/correct agents keep calling the database client directly instead of going through the repository layer
```

它读取最近的提交、回退、评审意见和解释变通办法的注释，然后把错误聚成类别。一类错误发生过两次才算数。它对最高发的几个类别逐个修复、每次一个提交，落在能生效的最高层级，并证明每个新检查都会在一个真实的历史错误上失败。它还在代理指令文件里维护一张表，把每条规则和执行它的机制配对，这样没有任何东西执行的规则就会以再犯的形式现形。回复会列出每个类别及其证据、选定的层级，以及为什么更高的层级行不通。

不带参数运行，它会自己从历史里找出这些类别。`/reflect` 和 `/correct` 分工明确：`/reflect` 从一次会话改进技能，`/correct` 改变仓库让一类错误无法再来。当修复是一条新边界时，搭配 `/architect` 使用。[并行运行多个项目](./07-overnight.md#run-many-projects-in-parallel)里有一条提示词，能在整个仓库上同时做这两件事。

## 撰写一个聚焦的技能

当你已经知道要固化哪个工作流程时：

```text
/poteto-mode write a skill for verifying database migrations in this repo
```

写技能遵循[撰写或修改技能行动手册](../../skills/poteto-mode/playbooks/authoring-a-skill.md)：它经由 Cursor 内置的 `create-skill` 路由，校验 frontmatter 和链接，并通过开 PR 行动手册交付结果。面向代理的行文标准比面向人的更高，因为一句没用的话会变成某个未来代理遵守的指令。让行动手册守住这个标准，而不是徒手去写 `SKILL.md`。

有一个特例有自己的生成器。必须驱动你的应用并证明行为的技能是验证技能，改用 [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 和 [`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md)。[验证与交付](./06-verify-and-ship.md#create-a-project-verification-skill)对两者都有介绍。

## 用 `/technical-writing` 把文档写到标准

技能不是你要交付的唯一文字。文档、RFC、readme、PR 描述和提交信息都算：

```text
/technical-writing review the readme changes
```

[`/technical-writing`](../../skills/technical-writing/SKILL.md) 应用一套分层的标准，目标只有一个：疲惫的工程师第一遍就能读懂的行文。它先判定文档的模式（教程、操作指南、参考或解释），然后逐句打磨：谁做什么，一句一个意思，没有任何能读出两种意思的地方。用它评审你或代理刚写的东西，或者在要一份文档时提前点名它。

## 盲测一次技能改动

一次技能编辑会影响之后的每一次会话，所以要像对待实验一样测它。采用别人的技能也一样：先确认它让你的代理在你的工作上变得更好，再留下它。

```text
/poteto-mode run the eval playbook on this skill change. same task for both variants, candidates stay blind.
```

当一个技能屡屡失手、而你清楚它该做什么时，在一个任务里改完就测：

```text
/poteto-mode update the review skill so it flags missing migrations, and eval the change.
```

提前要求评估能让编辑保持诚实。凭一次糟糕的会话写出的修复往往对那次会话过拟合，编辑得多了，技能就会漂移。评估在漂移发布之前抓住它。

[评估行动手册](../../skills/poteto-mode/playbooks/eval.md)围绕一种失败模式构建：观察者效应。知道自己在被评估的代理，表现会不一样。所以候选代理拿到的是看起来平平无奇的任务，运行在净化过的目录里，永远看不到 "eval" 或 "candidate" 这些词，也不知道彼此的存在。一个评委在中性标签下给所有输出打分，而链路跟踪的评分依据是每个候选实际读了哪些文件，而不是它声称读了什么。

接受结论之前，亲自读每一份输出。如果你不同意评委，先怀疑评分标准，再怀疑自己的判断。

## 用 `/make-bot-ui` 构建机器人界面

有一个情境技能面向 Grok Bot 用户。[`/make-bot-ui`](../../skills/make-bot-ui/SKILL.md) 构建一个小页面，页面上的按钮通过一个 webhook 例程唤醒机器人。比如你可以滑动浏览一个评审队列，每次滑动让机器人处理那一条。你机器上的服务器持有 webhook 的发送方密钥，所以密钥永远不会到达浏览器或聊天。该技能还涵盖通过 Tailscale 暴露这个页面。

**坑：**不要因为技能在任务中途表现不好就顺手改它。在它自己的 PR 里修，让手头的任务继续走。缠在功能开发里一起发布的技能编辑，对评审不可见，也无法评估。

下一篇：[配方与坑](./10-recipes-and-pitfalls.md)。
