// Vendored from https://raw.githubusercontent.com/ddgksf2013/Scripts/refs/heads/master/fly.js
// Local mirror added 2026-11-01 so the script no longer changes under us;
// upstream author attribution is kept in the file body.
/*

Author：@ddgksf2013

通知频道：https://t.me/ddgksf2021

*/
var body = $response.body;
var ddgksf2013 = JSON.parse(body);

if (ddgksf2013.Variables.data.threaddetail) 
{
ddgksf2013.Variables.data.threaddetail.tagadv = "";
	ddgksf2013.Variables.data.threaddetail.threadapp_ad_video = [];
	ddgksf2013.Variables.data.threaddetail.pingyouadv = "";
	ddgksf2013.Variables.data.threaddetail.middleadv = "";
	ddgksf2013.Variables.data.threaddetail.bottomadv = "";
	ddgksf2013.Variables.data.threaddetail.appdetailadv = [];
}
//delete ddgksf2013.Variables.data.threaddetail.threadapp_ad_video;
//delete ddgksf2013.Variables.data.threaddetail.tagadv;
//delete ddgksf2013.Variables.data.threaddetail.middleadv;
//delete ddgksf2013.Variables.data.threaddetail.pingyouadv;
//delete ddgksf2013.Variables.data.threaddetail.bottomadv;
//delete ddgksf2013.Variables.data.threaddetail.appdetailadv;
	
$done({body: JSON.stringify(ddgksf2013)});