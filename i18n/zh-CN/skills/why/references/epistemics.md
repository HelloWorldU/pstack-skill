# 认识论

当证据是历史性的、碎片化的、有时还互相矛盾时，该如何推理置信度，以及如何告知用户而不把它压平成虚假的确定。代码展示的是它做什么，而不是*它为什么存在*。「为什么」藏在提交、PR、工单、文档和对话里，而这些全都不完整、带偏见、有时还缺失。假装不是这样，就会产出听起来自信、实则误导用户的猜测。

## 置信度分级

输出中的每个论断都必须落在某一级。级别决定它所在的章节和措辞。

### 1. 直接证据

一条明确的、文字性的引证回答了问题：是作者真正*写下*的、说明原因的东西，而不是「代码做了 X，所以作者一定是想要 X」。例如，PR 描述写着 "this fixes the bug where users with >1000 items couldn't paginate"，工单写着 "we're adding this because customer Acme requested it in their security review"，代码注释 "// clamp to 100 because the upstream API rejects larger values"，设计文档 "we chose option A over option B because we need persistence across restarts"，或作者的聊天记录 "switching to this approach since the old one was flaky in tests"。

措辞：自信、现在时、带引用。"This exists because X."

### 2. 有据支持

多条间接证据汇聚到同一个结论。没有任何单一来源明说，但跨来源的模式让它很可能成立。例如，PR 标题写着 "improve performance"，工单打着 "perf" 标签，而周围的提交都在改同一条热路径。或者随改动一起加的几个测试都在跑非常大的输入。或者作者同一周的其他 PR 都提到同一次事故。

措辞：自信但明显是推导出来的，逐条引用。"The evidence points strongly to X: [the specific pieces]."

### 3. 推断

对上下文的合理读法，但没有任何东西明确支持它。这是*你的解读*，不是记录里的事实。例如，PR 没说为什么，但生产环境当时正在报错（根据事故频道的时间线），修复又很仓促（当天就合并了），所以它很可能是个热修复。或者函数名暗示是重试逻辑，而它的重试次数 3 与代码库其他地方团队的 3 次重试约定一致。

措辞：带对冲，推理链写明白。"Given A and B, C seems likely because D."

### 4. 推测

证据单薄之下的一个合理假设，其他解释同样说得通。值得摆出来，因为用户也许知道哪个对，但要标明这是猜测。例如 "This might be a workaround for a browser bug that's since been fixed, but we found no contemporary evidence of that"，或 "It's possible this threshold was chosen to match an SLA commitment, but no SLA doc references it."

措辞："One possibility is X, but we have no direct evidence." 通常放在「竞争假设」一节，和其他可能性并列。

### 5. 未知

你找过了，但没找到。这是一个有效且重要的结果。记录下来。

措辞："We searched X, Y, and Z and found no evidence of why." 要具体说明你搜了*什么*。"We couldn't find out" 不如 "We searched the ticket tracker with keywords A and B, scanned the 6 PRs that touched this file since 2023, and grep'd the repo for string literals matching the threshold. None surfaced a rationale." 有用。

## 措辞指南

**表置信词**意味着有直接或有据支持的证据，引用必须紧随其后。绝不要用于推断："because"、"the reason is"、"was designed to"（声称作者意图）、"fixes" / "addresses" / "solves"（声称改动达成了目标）、"the team decided"（声称发生过集体决策）。

**对冲词**表示解读，而非报告。在「我们可以合理推断」一节里放开用："appears to"、"seems to"、"likely"、"suggests"、"is consistent with"、"one reading is"、"plausibly"、"may have been"、"the evidence points toward"。

**要避免的词：**

- "obviously"。真那么显然，用户就不会问了
- "clearly"。几乎总是出现在一个并不清楚的论断前面
- "of course"。同上
- "just"（如 "it's just X for performance"）。语气轻慢，而且往往掩盖了不确定
- "I think" / "I believe"。你是在综合证据，不是在发表个人意见。改用 "the evidence suggests"。

## 避免合理化

今天「说得通」的代码，当初写它的理由可能早已失效，或者当时就错了。不要给混乱的历史事后套上一个干净的解释。不要假设作者做了「正确」的事再倒推着找理由。不要假设一致的模式是有意为之，它可能只是复制粘贴。不要把没有证据当成没有此事的证据（「没人提到安全问题，所以当时肯定不是顾虑」）。

## 谄媚陷阱

用户的问题里常内嵌一个假设：「我们为什么这样做，我猜是为了性能？」不要直接确认它。这个猜测是调查的引子，不是要验证的结论。把它当作候选之一，独立地核对证据。如果证据支持它，就带着引用说明支持。如果不支持，也明说，并摆出证据*确实*支持的结论。

## 证据互相矛盾时

把两个来源都摆进输出，都带引用。不要挑那个让故事更整齐的。例如，工单说 "we need this for customer X's compliance requirement"，而 PR 说 "cleaning up tech debt in this area"。两者可能都成立（工单是工作的动机，PR 是作者的表述），也可能有一个是错的。让用户来判断。

## 证据缺失时

诚实的「我们不知道」是最有价值的输出之一。用户由此得知：答案不在那些显而易见的地方；他们得去问人（原作者、产品负责人、团队主管）；或者他们可以判断这个问题不值得再追。没有标出缺口、反而用自信的猜测填上，是对用户实际的伤害，因为他们会按猜测行动。具体地点名每个缺口：问题是什么、搜了哪些来源、每个来源里搜了什么、找到了什么（一无所获，或只有擦边的材料）。

## 定稿之前

综合者交付输出之前，要检查「我们发现了什么」和「我们可以合理推断」里的每一条论断。每条论断要么有引用，要么移到「推断」或「假设」区。措辞与其级别匹配。不把代码当成其自身意图的证据（如果有，删掉或重新归类）。输出里有一节「我们不知道什么」。如果一个缺口都没提，那很可疑。要么证据罕见地完整，要么有东西被扫到了地毯底下。
