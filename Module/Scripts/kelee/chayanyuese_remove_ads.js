// Vendored from https://raw.githubusercontent.com/ifflagged/Romeo/main/Modules/JavaScript/Kelee/WexinMiniPrograms_Remove_ads/kelee_chayanyuese_remove_ads.js
// Local mirror added 2026-11-01 so the script no longer changes under us;
// upstream author attribution is kept in the file body.
let obj=JSON.parse($response.body);
delete obj.data.INDEX_SLOT_01;
delete obj.data.INDEX_SLOT_02;
obj.data?.INDEX_TOP_BANNER?.contents?.forEach(item => {
  delete item.bubble; 
  delete item.figure; 
  item.value = "https://kelee.one/Resource/Script/WexinMiniPrograms/chayanyuese/cyys1.jpg";
});
$done({body: JSON.stringify(obj)});