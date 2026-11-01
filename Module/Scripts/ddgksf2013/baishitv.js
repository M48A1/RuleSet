// Vendored from https://raw.githubusercontent.com/ddgksf2013/Scripts/refs/heads/master/baishitv.js
// Local mirror added 2026-11-01 so the script no longer changes under us;
// upstream author attribution is kept in the file body.
var obj=JSON.parse($response.body);obj.dt.data=Object.values(obj.dt.data).filter(a=>-1===a.jumpTypeString.indexOf("广告")),$done({body:JSON.stringify(obj)});
