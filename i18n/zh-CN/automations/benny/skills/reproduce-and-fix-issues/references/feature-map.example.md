# 功能地图示例

把 Benny 可能要复现的每一个面向用户的功能都建图。在驱动应用之前阅读相关小节。让这份地图保持用户视角。内部实现和当前代码路径留到运行时去发现，不要冻结在这里。

把本文件复制到 `.cursor/automations/benny/` 之外，例如 `.cursor/benny/feature-map.md`，并把 `control.feature_map_path` 指向那份副本。包的刷新不得覆盖它。

## 单功能模板

### `<feature name>`

`<one-line user-visible purpose>`

#### 用户如何到达那里

- 点击路径：`<screen> -> <menu, tab, or panel> -> <control>`
- 键盘快捷键：`<shortcut or none>`

#### 控制适配器如何驱动它

- `<adapter action>` 配合 `<inputs>` 应当产生 `<visible result>`。
- 重置：`<how the adapter returns to a fresh state>`。

#### 稳定选择器

- `<role and accessible name>`
- `<ARIA relationship>`
- `<data-component or purpose-named data attribute>`

绝不使用生成的 CSS 或 StyleX 类名、动态哈希、子元素索引或脆弱的 DOM 位置。

#### 要演练的状态

- 默认、悬停、聚焦可见、激活、禁用
- 加载中、空、错误
- 选中、打开、已展开
- `<relevant feature-specific variants>`

标注不适用的状态。

#### 前置条件和准备

- 认证：`<account state>`
- 数据：`<fixture>`
- 权限：`<role>`
- 开关：`<flag or none>`
- 服务：`<required availability>`

#### 证据和交叉核对

- 截图：`<app identity, feature, and discriminating state>`
- 视频：`<entry path, interaction, and final state>`
- 交叉核对：`<read-only state or value that confirms the UI>`

#### 坑

- `<known dead end or wrong surface>`
- `<safe environment translation>`

## 虚构示例

这些功能属于一个虚构的任务应用。它们只是示例，不是 Benny 的必备功能。

### 登录

让用户进入任务应用。

#### 用户如何到达那里

- 打开应用并选择 `Sign in`。没有快捷键。

#### 控制适配器如何驱动它

- `open_app`、`click Sign in`、`fill credentials` 和 `click Continue` 应当打开条目列表。
- 通过退出登录并清除一次性会话来重置。

#### 稳定选择器

- 按钮 `Sign in`，文本框 `Email` 和 `Password`，`data-component="sign-in-form"`

#### 要演练的状态

- 默认、聚焦可见、提交中、禁用、加载中、错误

#### 前置条件和准备

- 一次性账号和可用的认证服务

#### 证据和交叉核对

- 录制从落地页到条目列表的过程。检查只读的会话状态。

#### 坑

- 营销页面是错误的界面。认证服务缺失属于阻塞。

### 条目列表和详情

让用户浏览条目并打开其中一个。

#### 用户如何到达那里

- 打开 `Items` 标签页，然后选择一行。

#### 控制适配器如何驱动它

- `select_tab Items` 和 `click <fixture item>` 应当打开它的详情。
- 通过关闭详情并清除选择来重置。

#### 稳定选择器

- 名为 `Items` 的标签页和列表、以夹具命名的行、`data-component="item-detail"`

#### 要演练的状态

- 加载中、空、错误、选中、打开、已展开

#### 前置条件和准备

- 命名的夹具条目、读取权限、可用的条目服务

#### 证据和交叉核对

- 展示选择过程和与之匹配的详情标题。检查选中条目的 ID。

#### 坑

- 搜索结果可能看起来相似，但走的是不同的路径。

### 条目编辑器

让用户创建或编辑一个条目。

#### 用户如何到达那里

- 从详情选择 `Edit`，或从列表选择 `New item`。

#### 控制适配器如何驱动它

- `click Edit`、`fill <field>` 和 `click Save` 应当更新详情。
- 通过还原夹具来重置。

#### 稳定选择器

- 按钮 `Edit`、`New item`、`Save`，表单 `Item editor`，与标签关联的字段

#### 要演练的状态

- 默认、聚焦可见、脏、校验中、禁用、保存中、错误、成功

#### 前置条件和准备

- 可编辑的夹具、写入权限、可用的保存服务

#### 证据和交叉核对

- 展示字段从改动到详情更新的过程。以只读方式检查存储的条目值。

#### 坑

- 不要注入表单状态。只读的详情字段不是编辑器。

### 设置

让用户修改个人偏好。

#### 用户如何到达那里

- 打开个人资料菜单，然后选择 `Settings`。

#### 控制适配器如何驱动它

- `open_menu Profile`、`click Settings` 和 `toggle <preference>` 应当更新该控件。
- 通过还原起始偏好来重置。

#### 稳定选择器

- 按钮 `Profile`、菜单项 `Settings`、区域 `Settings`、以用途命名的偏好属性

#### 要演练的状态

- 关闭、打开、选中、聚焦可见、禁用、加载中、错误

#### 前置条件和准备

- 已登录的测试账号、已知的偏好、可用的偏好服务

#### 证据和交叉核对

- 展示菜单路径和最终控件状态。以只读方式检查偏好值。

#### 坑

- 操作系统设置是另一个界面。

## 完整性检查清单

- 每个可复现的面向用户的功能都有一个小节。
- 每个小节都指名用户路径、适配器动作和重置方式。
- 选择器使用角色、名称、ARIA、稳定的组件标记或以用途命名的属性。
- 没有任何选择器使用生成的类名或 DOM 位置。
- 覆盖相关的交互、加载中、空、错误、选中和已展开状态。
- 认证、夹具、权限、开关和服务都已写明。
- 截图、视频和底层交叉核对的要求都已写明。
- 列出了错误的界面、死胡同和安全的环境转译。
- 实现细节保持为运行时的发现。
