# RuleSet

将 [M48A1/Surge](https://github.com/M48A1/Surge) 的规则转换为 Clash/Mihomo classical YAML 规则集，存放于 `clash/`。

源版本：`20aa6ce846b6b481780e3330a986bf0695ca3855`。这是一次性复制，不会自动同步。

## 使用

```yaml
rule-providers:
  Ai:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/M48A1/RuleSet/main/clash/Ai.yaml
    path: ./ruleset/Ai.yaml
    interval: 86400
rules:
  - RULE-SET,Ai,PROXY
```

将 `PROXY` 替换为配置中已有的策略组名称。其他分类同样使用 `clash/分类名.yaml`。

## 转换说明

- HOST、HOST-SUFFIX、HOST-KEYWORD 分别转换为 DOMAIN、DOMAIN-SUFFIX、DOMAIN-KEYWORD。
- Ai 中的 HOST-WILDCARD 转换为 DOMAIN-WILDCARD，需要支持该类型的 Mihomo 内核。
- Apple 中的 `USER-AGENT,Music*` 无法直接转换，作为注释保留；其余 Apple 域名规则保留。
- 保留源规则顺序和重复项，不改变原有分类。
- `video` 的 RULE-SET 应放在 `Google` 前面，使 Google Drive 的规则先匹配。
- `AppleProxy` 应放在 `Apple` 前面，使其优先于 Apple 通用域名规则。
- DirectRule、RejectRule 的策略分别按需设置为 DIRECT、REJECT。

格式参考：[Mihomo 规则集文档](https://wiki.metacubex.one/config/rule-providers/content/)。
