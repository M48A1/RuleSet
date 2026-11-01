// Vendored from https://raw.githubusercontent.com/ifflagged/Romeo/main/Modules/JavaScript/Kelee/WexinMiniPrograms_Remove_ads/kelee_M_Stand.js
// Local mirror added 2026-11-01 so the script no longer changes under us;
// upstream author attribution is kept in the file body.
let obj=JSON.parse($response.body);
delete obj.data.homeNewsAdv.jumpValue ;
delete obj.data.homeDineInAdv ;
delete obj.data.homePickupAdv ;
delete obj.data.nearbyShopInfo ;
delete obj.data.homeEventThemesAdv ;
delete obj.data.eventThemes ;
delete obj.data.homeRootAdv ;
delete obj.data.homeTopAdv ;
delete obj.data.homeDialogAdv ;
delete obj.data.homeBannerAdv ;
delete obj.data.homeCouponAdv ;
delete obj.data.homeCompanyAdv ;
delete obj.data.homeDeliveryAdv ;
$done({body: JSON.stringify(obj)});
