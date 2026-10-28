# Loon 分流规则

来源：[M48A1/Surge](https://github.com/M48A1/Surge)，源提交 `beb2f12dad62e30156561ebd411ae3974ad7b1d3`。

这是一次转换快照，不会自动同步源仓库。保留源文件的分类、注释、顺序及重复规则；将 HOST / HOST-SUFFIX / HOST-KEYWORD / HOST-WILDCARD 规范为 DOMAIN / DOMAIN-SUFFIX / DOMAIN-KEYWORD / DOMAIN-WILDCARD。IP-CIDR 和 USER-AGENT 保持原有匹配语义。

## 使用

在 Loon 的远程规则订阅中添加对应的 raw 链接并选择策略；也可把以下内容合并到现有配置的 `[Remote Rule]` 下。`PROXY` 请替换成你现有的策略组名。DirectRule 使用 DIRECT，RejectRule 使用 REJECT，其余示例使用 PROXY；可按需调整。

Ai.list 含 DOMAIN-WILDCARD，需要 Loon Build 1008 或更新版本。Apple.list 的 USER-AGENT 属于 HTTP 规则。video.list 应在 Google.list 之前；AppleProxy.list 应在 Apple.list 之前；Ai.list 应在 Google、Meta 等较宽泛的规则之前。

```ini
[Remote Rule]
https://raw.githubusercontent.com/M48A1/RuleSet/main/loon/RejectRule.list,REJECT
https://raw.githubusercontent.com/M48A1/RuleSet/main/loon/DirectRule.list,DIRECT
https://raw.githubusercontent.com/M48A1/RuleSet/main/loon/Ai.list,PROXY
https://raw.githubusercontent.com/M48A1/RuleSet/main/loon/AppleProxy.list,PROXY
https://raw.githubusercontent.com/M48A1/RuleSet/main/loon/Apple.list,PROXY
https://raw.githubusercontent.com/M48A1/RuleSet/main/loon/YouTube.list,PROXY
https://raw.githubusercontent.com/M48A1/RuleSet/main/loon/video.list,PROXY
https://raw.githubusercontent.com/M48A1/RuleSet/main/loon/Google.list,PROXY
https://raw.githubusercontent.com/M48A1/RuleSet/main/loon/Meta.list,PROXY
https://raw.githubusercontent.com/M48A1/RuleSet/main/loon/USHome.list,PROXY
https://raw.githubusercontent.com/M48A1/RuleSet/main/loon/UltraMobile.list,PROXY
https://raw.githubusercontent.com/M48A1/RuleSet/main/loon/Surfing.list,PROXY
```

## 规则数量

| 文件 | 规则数（含源文件重复项） |
| --- | ---: |
| Ai.list | 73 |
| Apple.list | 101 |
| AppleProxy.list | 35 |
| DirectRule.list | 15 |
| Google.list | 22 |
| Meta.list | 24 |
| RejectRule.list | 1 |
| Surfing.list | 26 |
| USHome.list | 5 |
| UltraMobile.list | 2 |
| YouTube.list | 7 |
| video.list | 10 |

语法依据：[域名规则](https://nsloon.app/en/docs/Rule/domain_rule/)、[HTTP 规则](https://nsloon.app/en/docs/Rule/http_rule/)、[规则订阅](https://nsloon.app/en/docs/Rule/sub_rule/)。
