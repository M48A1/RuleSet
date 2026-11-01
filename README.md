- [DiDi Ad Block](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/DiDi_remove_ads.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/DiDi_remove_ads.sgmodule
  ```

- [JD Ad Block](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/JD_remove_ads.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/JD_remove_ads.sgmodule
  ```

- [RedNote Ad Block](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/Rednote.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/Rednote.sgmodule
  ```

- [Moyu Startup Ad Block 2.0](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/StartUpAds.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/StartUpAds.sgmodule
  ```

- [Taobao Ad Block](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/Taobao_remove_ads.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/Taobao_remove_ads.sgmodule
  ```

- [Umetrip Ad Block](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/UmetripAds.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/UmetripAds.sgmodule
  ```

- [WeChat Mini Program Ad Block](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/WeChatmini.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/WeChatmini.sgmodule
  ```

- [YouTube (Music) Enhance](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/YouTube.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/YouTube.sgmodule
  ```

- [Goofish Ad Block](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/goodish.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/goodish.sgmodule
  ```

- [Zhihu Ad Block](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/zhihu.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/zhihu.sgmodule
  ```

- [Reddit Ad Block](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/RedditAds.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/RedditAds.sgmodule
  ```

- [Redirect2Swift — TG 外链接跳转 Swiftgram](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/Redirect2Swift.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/Redirect2Swift.sgmodule
  ```

- [YouTube 首页 Shorts 与游戏屏蔽（Tampermonkey）](https://raw.githubusercontent.com/M48A1/RuleSet/main/UserScrip/YouTube.js)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/UserScrip/YouTube.js
  ```

- [Quantumlt 规则文件列表](Quantumlt/README.md)

- [Redirect2Ng — TG 外链接跳转 Nagram](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/Redirect2Ng.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/Redirect2Ng.sgmodule
  ```

- [Redirect2TelegramLite — macOS TG 外链接跳转](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/Redirect2TelegramLite.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/Redirect2TelegramLite.sgmodule
  ```

  需将 Telegram Lite 设为 `tg://` 的默认打开应用；多个客户端共用该协议，模块无法强制选择 Lite。与其他 t.me 重定向模块择一启用。支持用户名、公开消息和邀请链接，其他路径保留网页打开。

- [Telegram Platform Redirect — macOS / iOS 自动分流](https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/TelegramPlatformRedirect.sgmodule)

  ```text
  https://raw.githubusercontent.com/M48A1/RuleSet/main/Module/TelegramPlatformRedirect.sgmodule
  ```

  Surge 请求脚本模块，依赖仓库内的 Module/Scripts/TelegramPlatformRedirect.js。按 User-Agent 推断：macOS → tg://（需默认关联 Telegram Lite）；iOS/iPadOS → sg://（Swiftgram）。iPad 桌面模式若不包含 Mobile 标识，可能被识别为 Mac。支持用户名、公开消息和邀请链接；与其他 t.me 重定向模块择一启用。

## 脚本镜像与安全说明

- 模块引用的 JavaScript 全部放在 `Module/Scripts/`（按上游作者分目录），`script-path` 指向本仓库的
  `raw.githubusercontent.com/M48A1/RuleSet/main/Module/Scripts/...`，不再实时拉取第三方 `main` / `master`，
  避免上游内容变化带来的供应链风险。更新脚本时请整体替换文件，并保留文件头部的来源注释。
- 仍保持上游混淆版本的脚本：`Scripts/ddgksf2013/coolapk.js`、`quark.js`、`redbook.ads.js`、`zhihu.ads.js`
  （上游即混淆发布，未改写；`Scripts/reddit.js` 已反混淆并去掉会员 / 员工身份伪造）。
- 2026-11-01 安全调整：`StartUpAds`、`WeChatmini`、`DiDi` 移除银行 / 券商 / 微信安全 / 京东金融等高风险
  MITM 主机及对应失效规则，并删除与任意主机匹配的通用 Map Local 规则；`Rednote` 不再拦截青少年模式状态接口；
  `DiDi` 不再关闭代驾 TCP 加密。

