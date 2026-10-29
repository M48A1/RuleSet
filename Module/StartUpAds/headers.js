// Surge adapter for @ddgksf2013 StartUpAds response-header rules.
// Sources: https://raw.githubusercontent.com/ddgksf2013/Scripts/master/{abchina,pinganads,hanglvzongheng}.js
// Preserves the upstream header predicates and HTTP 404 result. 2026-10-29.
(function () {
  const rules = {
    abchina: { header: "channelid", words: ["getStartParam", "getAdverInfo", "recommond_center"] },
    pinganads: { header: "_mt", words: ["adRouter.queryBoothContent", "getAdverInfo", "recommond_center"] },
    hanglvzongheng: { header: "rpid", words: ["10000012", "1000019"] }
  };
  const rule = rules[typeof $argument === "string" ? $argument : ""];
  if (!rule) { $done({}); return; }
  const headers = $request.headers || {};
  const key = Object.keys(headers).find(k => k.toLowerCase() === rule.header);
  const value = key ? String(headers[key]) : "";
  $done(rule.words.some(word => value.includes(word)) ? {status: 404} : {});
})();
