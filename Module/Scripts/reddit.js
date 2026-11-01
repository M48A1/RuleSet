/*
 * Reddit ad removal.
 *
 * Upstream : https://github.com/ddgksf2013/Scripts/blob/master/reddit.js (V1.0.9)
 * Author   : @ddgksf2013
 * Local    : deobfuscated 2026-11-01 from the jsjiami.com.v7 build currently
 *            served by the upstream link. Behaviour is unchanged except that
 *            the two client-side spoofing replacements were dropped
 *            ("isPremiumMember":true / "isEmployee":true).
 *
 * What it does:
 *   1. Any GraphQL operation whose name contains "Ads" is answered with "{}".
 *   2. Otherwise the JSON body is parsed after neutralising the obfuscation /
 *      NSFW / ad-personalisation flags, and ad nodes are filtered out of every
 *      listing (__typename "AdPost", nodes carrying adPayload, or nodes with an
 *      "AdMetadataCell").
 */
const opName = ($request && $request.headers && $request.headers['X-APOLLO-OPERATION-NAME']) || '';

if (/Ads/i.test(opName)) {
  $done({ body: '{}' });
} else {
  let body;
  try {
    body = JSON.parse(
      $response.body
        .replace(/"isObfuscated":true/g, '"isObfuscated":false')
        .replace(/"obfuscatedPath":"[^"]*"/g, '"obfuscatedPath":null')
        .replace(/"isNsfw":true/g, '"isNsfw":false')
        .replace(/"isAdPersonalizationAllowed":true/g, '"isAdPersonalizationAllowed":false')
        .replace(/"isThirdPartyInfoAdPersonalizationAllowed":true/g, '"isThirdPartyInfoAdPersonalizationAllowed":false')
        .replace(/"isNsfwMediaBlocked":true/g, '"isNsfwMediaBlocked":false')
        .replace(/"isNsfwContentShown":true/g, '"isNsfwContentShown":false')
    );

    const data = body.data || {};
    Object.keys(data).forEach((key) => {
      const edges = data[key] && data[key].elements && data[key].elements.edges;
      if (!Array.isArray(edges)) return;
      data[key].elements.edges = edges.filter(({ node }) => {
        if (!node) return true;
        if (node.__typename === 'AdPost') return false;
        if (node.adPayload) return false;
        if (Array.isArray(node.cells)) {
          return !node.cells.some((cell) => cell && cell.__typename === 'AdMetadataCell');
        }
        return true;
      });
    });

    body = JSON.stringify(body);
  } catch (err) {
    console.log('Parse error:', err);
  } finally {
    $done(body ? { body } : {});
  }
}
