---
name: principle-test-behavior-not-implementation
description: "在你写、改或保留一个测试时应用。像用户那样调用代码，断言他们看到的确切结果。假如每个被导入的函数都返回 undefined 这个测试还能过，就把它重写或删掉。"
disable-model-invocation: true
---

# 测行为，不测实现

测试要像代码的用户那样调用它，并断言用户看到的确切结果。任何一个「即使每个导入的函数都返回 `undefined` 或错误值也照样通过」的测试，都要重写或删掉。

以下这些形状都不达标：

- 断言松散或根本没有断言：`toBeDefined`、`toBeTruthy`、`not.toThrow`、`toBeGreaterThan(0)`。
- 只断言调用过或没调用过：`toHaveBeenCalled`、`not.toHaveBeenCalled`、`toBeUndefined`、`toEqual([])`。
- 期望值由被测代码自己算出来：`expect(f(a)).toBe(f(a))`。
- 复述常量、配置默认值、表行或提示词字符串。
- 断言只打在测试自己构造的数据上，根本没调用被测对象。

修法：在测试体里用一个具体输入调用被测对象，断言字面上的输出或效果。对 mock，断言它收到的负载。对「不存在」，再在另一个输入上断言「存在」。对常量，别复述它的值，改为用一个输入去测读取它的那个机制。

跨表行的关系检查（两张表里的同一个键、确实存在的父记录）和 `*.test-d.ts` 类型检查可以保留。
