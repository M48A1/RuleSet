// Vendored from https://raw.githubusercontent.com/ifflagged/Romeo/main/Modules/JavaScript/Kelee/WexinMiniPrograms_Remove_ads/kelee_ming.js
// Local mirror added 2026-11-01 so the script no longer changes under us;
// upstream author attribution is kept in the file body.
let obj=JSON.parse($response.body);
obj.data=[];
$done({body: JSON.stringify(obj)});