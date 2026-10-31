// Route t.me links by User-Agent. iPad desktop mode without Mobile is indistinguishable from macOS.
(function () {
  var headers = $request.headers || {};
  var key = Object.keys(headers).find(function (k) { return k.toLowerCase() === "user-agent"; });
  var ua = key ? headers[key] : "";
  var ios = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && /Mobile\//i.test(ua));
  var mac = /Macintosh|Mac OS X/i.test(ua) && !ios;
  if (!ios && !mac) { $done({}); return; }
  var match = /^https?:\/\/t\.me\/([^?#]*)(?:\?([^#]*))?(?:#.*)?$/i.exec($request.url);
  if (!match) { $done({}); return; }
  var path = match[1].replace(/\/$/, "");
  var query = match[2] || "";
  var target = "";
  var invite = /^(?:joinchat\/|\+)([A-Za-z0-9_-]+)$/.exec(path);
  var post = /^([A-Za-z][A-Za-z0-9_]{3,})\/(\d+)$/.exec(path);
  var user = /^([A-Za-z][A-Za-z0-9_]{3,})$/.exec(path);
  var reserved = /^(?:share|proxy|socks|addstickers|addemoji|setlanguage|login|confirmphone|iv|s|c|boost|giftcode|invoice|m|nft|bg|contact)$/i;
  if (invite) target = "join?invite=" + invite[1];
  else if (post && !reserved.test(post[1])) target = "resolve?domain=" + post[1] + "&post=" + post[2];
  else if (user && !reserved.test(user[1])) target = "resolve?domain=" + user[1];
  if (!target) { $done({}); return; }
  if (query) target += "&" + query;
  $done({ response: { status: 302, headers: { Location: (ios ? "sg://" : "tg://") + target, "Cache-Control": "no-store" }, body: "" } });
})();
