# Surge 分流规则

来源：[M48A1/Surge](https://github.com/M48A1/Surge)，源提交 `beb2f12dad62e30156561ebd411ae3974ad7b1d3`。

12 个规则文件，保留原分类、注释、顺序及重复项；HOST 系列规范为 DOMAIN 系列，DirectRule 和 Surfing 补上 .list 扩展名。规则快照不会自动同步源仓库。

配置位于仓库根目录 [surge.conf](../surge.conf)。需先添加 Frontier、SJC、GEN2、SGP、FRA 节点。第三方规则使用作者的 Surge 版本，保留原订阅顺序及更新周期。未重新添加仓库 Loon 配置已移除的本地 IP 规则；未迁移 Quantumult X 的重写、脚本任务及 MITM 证书。

配置已检查规则类型、策略引用及第三方订阅链接，未在 Surge 应用内实测。请使用支持 DOMAIN-WILDCARD 的 Surge 版本。
