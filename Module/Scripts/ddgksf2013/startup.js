// Vendored from https://raw.githubusercontent.com/ddgksf2013/Scripts/refs/heads/master/startup.js
// Local mirror added 2026-11-01 so the script no longer changes under us;
// upstream author attribution is kept in the file body.




let obj=JSON.parse($response.body);
/*京喜APP*/
if (/^https?:\/\/api\.m\.jd\.com\/api\?functionId=delivery_show/.test($request.url)) { 
    obj.data.materialList.startTime=3667476800000;
    obj.data.materialList.endTime  =3667908800000;
}
$done({body:JSON.stringify(obj)});
