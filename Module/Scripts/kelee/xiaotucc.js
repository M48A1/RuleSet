// Vendored from https://raw.githubusercontent.com/ifflagged/Romeo/main/Modules/JavaScript/Kelee/WexinMiniPrograms_Remove_ads/kelee_xiaotucc.js
// Local mirror added 2026-11-01 so the script no longer changes under us;
// upstream author attribution is kept in the file body.
if(-1!=$request.url.indexOf("main_page/index/getActivity")){
    let obj=JSON.parse($response.body);
    delete obj.data.p3;
    $done({body: JSON.stringify(obj)});
   }
   else if(-1!=$request.url.indexOf("mall/main")){
    let obj=JSON.parse($response.body);
    delete obj.data;
    $done({body: JSON.stringify(obj)});
   }
   else $done($response);
   