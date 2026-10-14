# TypeScript 模式

`SKILL.md` 中每条规则的代码示例。其底层原则与语言无关，参见 **type-system-discipline** 和 **boundary-discipline** 原则技能。

## 品牌类型（Branded types）

给原始类型打上品牌，防止混用。在边界处验证一次，下游代码直接信任该类型。

```ts
type AgentId = string & { readonly __brand: "AgentId" };

function parseAgentId(input: string): AgentId {
  if (!isUUID(input)) throw new Error(`Invalid agent id: ${input}`);
  return input as AgentId;
}

function focusAgent(id: AgentId): void {
  /* input is trusted */
}
```

保持 `readonly __brand: 'X'` 这个形状，不要另造新约定。

## 可判别联合（Discriminated unions）

用字面量判别字段为变体建模。每个变体共享同一个字段名，且每个变体的值唯一，因此不可能的组合根本无法表示。

```ts
// Don't. Boolean + optionals lets contradictory states exist.
type DiffState = { loading: boolean; diff?: GitDiff; error?: string };

// Do. Only valid states exist.
type DiffState =
  | { kind: "loading" }
  | { kind: "ready"; diff: GitDiff }
  | { kind: "error"; error: string };
```

选定一个判别字段名（`kind`、`type`、`tag`）并一以贯之。

## 构造式建模（Constructive modeling）

用全部合法的部件构建类型，而不是用运行时检查去约束一个宽松类型。

非空，用可变元组：

```ts
type NonEmpty<T> = [T, ...T[]];

// Don't: T[] plus a length check every caller must repeat
function pickWinner(entries: string[]): string {
  if (entries.length === 0) throw new Error("no entries");
  return entries[Math.floor(Math.random() * entries.length)];
}

// Do: an empty value of the type can't exist
function pickWinner(entries: NonEmpty<string>): string {
  return entries[Math.floor(Math.random() * entries.length)];
}
```

当收到一个普通的 `T[]` 时，用一个守卫收窄一次。此后这个事实就随类型一路传递：

```ts
const isNonEmpty = <T>(arr: T[]): arr is NonEmpty<T> => arr.length > 0;
```

偶数长度，用成对元组：

```ts
type Pairs<T> = [T, T][];
```

时间范围，用起点加时长：

```ts
// Don't: a comment holds the invariant
type TimeRange = { start: Date; end: Date }; // start <= end

// Do: a negative range can't be written; derive end when needed
type TimeRange = { start: Date; durationMs: number };
```

让 `durationMs` 保持普通数字。只有当裸数字可能被误传到期望时长的位置时，才给它打品牌（见品牌类型一节），不要条件反射式地打。选择让坏状态无法构造的表示方式，然后在其上暴露你需要的读法（`pairs.flat()`、`rangeEnd()` 辅助函数）。

## 最简单的全函数类型（Simplest total type）

不要什么都加强。当对 `T[]` 的每个操作都是全函数时，保留 `T[]`：

```ts
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0); // [] is 0, fine
```

当宽松类型迫使你在使用点撒谎时才加强。信号是 `!`、`arr[0] as T`，以及一个「永远不该发生」的 throw：

```ts
// Don't: partiality smuggled past the compiler
function newestSession(sessions: Session[]): Session {
  return sessions.at(0)!;
}

// Do: strengthen the input; the assertion disappears
function newestSession(sessions: NonEmpty<Session>): Session {
  return sessions[0];
}
```

把结果放宽为 `Session | undefined` 是另一种全函数签名。

## 用 `unknown` 而非 `any`

外部数据永远是 `unknown`。使用前收窄。

```ts
// Don't
function handle(input: any) {
  return input.foo.bar;
}

// Do
function handle(input: unknown) {
  if (typeof input === "object" && input !== null && "foo" in input) {
    // narrowed; compiler verifies access
  }
}
```

外部来源包括 RPC 载荷、`JSON.parse`、`postMessage`、IPC、文件内容、环境变量、数据库结果。

## 模式库先于手写守卫

在为外部数据手写逐属性类型守卫之前，先找仓库的运行时模式库和已有模式。让一个模式（schema）独占校验，并从它派生 TypeScript 类型。不要同时维护一个模式、一个重复接口和一个可能渐渐偏离的守卫。

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["admin", "member"]),
});

type User = z.infer<typeof UserSchema>;

function parseUser(input: unknown): User {
  return UserSchema.parse(input);
}
```

当失败是预期分支时用 `safeParse`。仓库使用其他模式库时，用等价的类型推导辅助函数。不要为了一个守卫新增模式库依赖。这条规则优先采用代码库已经信任的那套模式体系。

## 禁止 `as` 断言

每个 `as` 都是潜在的运行时崩溃。只有在类型系统验证了该断言之后才能断言。

```ts
import { z } from "zod";

// Don't
const user = data as User;

// Don't
function isUser(data: unknown): data is User {
  return typeof data === "object" && data !== null && "id" in data;
}

// Do
const userSchema = z.object({ id: z.string(), name: z.string() });
type User = z.infer<typeof userSchema>;

function parseUser(data: unknown): User {
  return userSchema.parse(data);
}
```

当类型先存在时，用它所证明的类型标注校验器。这样编译器会拒绝证明内容少于该类型的校验器。把下面对象里的 `name` 删掉，赋值就无法通过编译。

```ts
type User = { id: string; name: string };

const userSchema: z.ZodType<User> = z.object({ id: z.string(), name: z.string() });
```

在把既有代码中的 `as` 重构掉时，先弄清 TypeScript 为什么推不出来：

- 缺判别字段：加一个，改用可判别联合。
- 源类型过宽（如 `Record<string, unknown>`）：收窄它。
- 边界无类型：用拥有该形状的模式来解析。只在没有模式的地方新增模式。
- 确实无法表达：用品牌类型或 `satisfies`。

## 收窄的等级次序

从最优到兜底：

1. **可判别联合的 switch / if。** 编译器自动收窄。
2. **`in` 运算符。** `"key" in obj` 收窄到包含该键的变体。
3. **`typeof` / `instanceof`。** 用于原始类型和类实例。
4. **用户自定义类型守卫。** 以上都不够时。
5. **`as` 断言。** 仅在验证之后。

```ts
function area(s: Shape): number {
  if ("radius" in s) return Math.PI * s.radius ** 2; // narrowed to circle
  return s.width * s.height; // narrowed to rect
}
```

## 类型守卫

守卫必须真正验证其声明。说谎的守卫比 `as` 更糟糕。

```ts
function isCircle(s: Shape): s is Shape & { kind: "circle" } {
  return s.kind === "circle";
}
```

能用判别字段收窄就优先用。

## 穷尽性检查

在 default 分支里，把判别值赋给一个 `never` 类型的局部变量。

```ts
// Value-returning switch
function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.radius ** 2;
    case "rect":
      return s.width * s.height;
    default: {
      const _exhaustive: never = s;
      return _exhaustive;
    }
  }
}

// Void switch
function handle(s: Shape): void {
  switch (s.kind) {
    case "circle":
      drawCircle(s);
      break;
    case "rect":
      drawRect(s);
      break;
    default: {
      const _exhaustive: never = s;
      void _exhaustive;
    }
  }
}
```

返回值的 switch 用 return 风格，语句式 switch 用 void 风格。

## 用 `satisfies` 而非 `as`

`satisfies` 只做校验，不会加宽字面量类型。

```ts
// Don't. Widens, loses literal types.
const config = { theme: "dark", cols: 3 } as Config;

// Do. Validates AND preserves literal types.
const config = { theme: "dark", cols: 3 } satisfies Config;
// config.theme is "dark" (literal), not string
```

## 边界验证

在数据跨入的地方验证一次，内部信任类型。参见 **boundary-discipline** 原则技能。

- **线上格式**（proto、JSON-RPC）：用 `ignoreUnknownFields` 解析，这样前向兼容的变更不会弄坏旧客户端。
- **持久化的 JSON：** 带版本的 blob，解析处包一层 try/catch。
- **不要**在调用链深处**重复验证**。

## 由模式派生的类型

当 `.proto`、OpenAPI 规范、GraphQL 模式或数据库迁移已经定义了形状时，从生成的类型派生，而不是重复定义。

```ts
// Don't. Duplicate shape, drifts when the schema changes.
type CheckSummary = {
  totalCount: number;
  checks: { name: string; status: string }[];
};
function renderChecks(s: CheckSummary) {
  /* ... */
}

// Do. Derive from the generated schema type.
import type { ChecksMessage } from "<generated module>";
function renderChecks(s: Pick<ChecksMessage, "totalCount" | "checks">) {
  /* ... */
}
```

先想到 `Pick`、`Omit`、`Parameters`、`ReturnType`、`Awaited`、`typeof`，再考虑写新接口。

## 对象参数

```ts
// Don't. Swap two args, still compiles.
openFile(uri, {
  startLineNumber: 10,
  startColumn: 1,
  endLineNumber: 10,
  endColumn: 1,
});

// Do. Order-independent, self-documenting.
openFile({
  uri,
  selection: {
    startLineNumber: 10,
    startColumn: 1,
    endLineNumber: 10,
    endColumn: 1,
  },
});
```

热路径上可跳过：逐帧渲染、分词器、解析器，以及任何分配成本敏感的紧循环。
