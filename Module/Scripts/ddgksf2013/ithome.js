// Vendored from https://raw.githubusercontent.com/ddgksf2013/Scripts/refs/heads/master/ithome.js
// Local mirror added 2026-11-01 so the script no longer changes under us;
// upstream author attribution is kept in the file body.
/***********************************************
> 应用名称：ithome去除信息流广告
> 脚本作者：@ddgksf2013
> 微信账号：墨鱼手记
> 更新时间：2024-10-12
> 通知频道：https://t.me/ddgksf2021
> 特别提醒：如需转载请注明出处，谢谢合作！
***********************************************/

const version = 'V1.0.1';

var obj=JSON.parse($response.body);obj.data.list=Object.values(obj.data.list).filter(a=>2!=a.feedContent.flag),$done({body:JSON.stringify(obj)});
