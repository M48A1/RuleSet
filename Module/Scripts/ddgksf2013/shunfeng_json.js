// Vendored from https://raw.githubusercontent.com/ddgksf2013/Scripts/refs/heads/master/shunfeng_json.js
// Local mirror added 2026-11-01 so the script no longer changes under us;
// upstream author attribution is kept in the file body.
/*
version     v0.0.1
updatetime  2022-11-17
tgchannel   https://t.me/ddgksf2021
function    顺丰
author      ddgksf2013


[rewrite_local]
https://ccsp-egmas.sf-express.com/cx-app-base/base/app/ad/queryInfoFlow url script-response-body https://github.com/ddgksf2013/Scripts/raw/master/shunfeng_json.js

[mitm]
hostname = ccsp-egmas.sf-express.com

*/

if ($request.url.indexOf("app/ad/queryInfoFlow") != -1) {
    var ddgksf2013 = JSON.parse($response.body);
    ddgksf2013.obj = Object.values(ddgksf2013.obj).filter((item) => item.adverId==2833);
    $done({
        body: JSON.stringify(ddgksf2013),
    });
}
