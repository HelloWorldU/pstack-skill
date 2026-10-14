# 路由地图示例

把本文件复制到 `.cursor/automations/benny/` 之外，例如 `.cursor/benny/routing.md`，并替换每个占位符。把 `routing.map_path` 指向该副本。包刷新不得覆盖它。

分诊技能把这份文件当作数据对待。一条路由需要来自报告或原因追踪的证据。仅有关键词匹配是不够的。

```yaml
routes:
  - name: "billing-example"
    match:
      product_areas:
        - "billing-area-placeholder"
      code_paths:
        - "billing-code-path-placeholder"
      error_signatures:
        - "billing-error-placeholder"
    destination:
      slack_channel: "billing-channel-placeholder"
      tracker_team: "billing-team-placeholder"
    owners:
      - "billing-owner-placeholder"
    allow_feature_owner_ping: false

  - name: "desktop-example"
    match:
      product_areas:
        - "desktop-area-placeholder"
      code_paths:
        - "desktop-code-path-placeholder"
      error_signatures:
        - "desktop-error-placeholder"
    destination:
      slack_channel: "desktop-channel-placeholder"
      tracker_team: "desktop-team-placeholder"
    owners:
      - "desktop-owner-placeholder"
    allow_feature_owner_ping: false

fallback:
  destination: ""
  owners: []
  allow_feature_owner_ping: false

ping_policy:
  default: "off"
  allow:
    - "configured-feature-owner"
    - "confirmed-regression-author"
  deny:
    - "broad-on-call-group"
    - "unverified-owner"
```

## 规则

- 除非有一个团队接收所有未匹配的报告，否则让 `fallback.destination` 保持为空。
- 使用稳定的产品领域、代码路径和错误特征。
- 不要在公开的副本中包含私有数据。
- 不要把原始的用户或频道 ID 粘贴进将被发布的示例。
- 在目标团队同意之前，保持功能负责人 ping 关闭。
- 转派是告诉报告者该去哪里。自动化绝不跨频道转发。
