# Sentry 错误历史

## 如何搜索

使用 Sentry MCP。

1. **摸清情况。** 如果你不知道 project slug 和组织：

   ```
   find_organizations
   find_projects
   ```

2. **搜索与目标相关的 issue。**

   ```
   search_issues (natural language, e.g., "errors in PaymentService timeout", "unhandled exceptions in uploadFile")
   ```

   用这些素材构造查询：目标处理的异常类名、它的函数或类名、它检查的错误消息字符串、它的文件路径。

3. **按 release 和时间窗口收窄。**

   ```
   search_issue_events (filter by release, time, environment, trace ID, tags)
   get_issue_tag_values (for an issue, see distribution across versions, users, environments)
   ```

   对于可疑的 issue，检查 **first seen** 和 **last seen**（停止的时间是否与目标的发布日期吻合？）、**受影响的 release**（哪些版本出现过，哪个是修复版？），以及**频率轨迹**（是否先飙升然后被解决？）。

4. **拉取完整事件获取上下文。**

   ```
   get_sentry_resource (pass a Sentry URL or type+ID)
   ```

   堆栈轨迹是否经过目标代码？tag 和 breadcrumb 是否与目标防范的条件吻合？

5. **检查在目标前后落地的 release。**

   ```
   find_releases (around the commit date of the target)
   ```

   将 release 版本与 PR 的合并日期交叉核对。

6. **谨慎使用 Seer。**

   ```
   analyze_issue_with_seer
   ```

   Seer 的 AI 根因分析是假设生成器。把它们当作推测，而非权威结论。实际的事件和堆栈轨迹才是第一手证据。

## 应该返回什么

对每个相关 issue：
- Issue ID 和标题
- 项目和组织
- First seen / last seen 时间戳
- 事件计数（以及采样率，如已知）
- 受影响的 release
- 能体现与目标相关性的代表性堆栈轨迹片段（逐字摘录，不是转述）
- First/last-seen 与目标发布日期的相关性
- Issue 链接
- 任何作者评论或解决备注
