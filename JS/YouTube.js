// ==UserScript==
// @name         YouTube 首页 Shorts 屏蔽
// @namespace    https://www.youtube.com/
// @version      1.0.0
// @description  隐藏 YouTube 首页中的 Shorts 推荐，不影响其他页面和直接观看 Shorts。
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/592918/YouTube%20%E9%A6%96%E9%A1%B5%20Shorts%20%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/592918/YouTube%20%E9%A6%96%E9%A1%B5%20Shorts%20%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const STYLE_ID = 'hide-youtube-home-shorts-style';
  const HIDDEN_ATTRIBUTE = 'data-hide-home-shorts';

  // YouTube 会在不刷新页面的情况下切换路由，所以不能只在脚本启动时判断一次。
  function isHomePage() {
    return location.pathname === '/' && !location.search;
  }

  function setHomePageState() {
    document.documentElement.toggleAttribute(HIDDEN_ATTRIBUTE, isHomePage());
  }

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      html[${HIDDEN_ATTRIBUTE}] ytd-rich-shelf-renderer[is-shorts],
      html[${HIDDEN_ATTRIBUTE}] ytd-reel-shelf-renderer,
      html[${HIDDEN_ATTRIBUTE}] ytm-reel-shelf-renderer,
      html[${HIDDEN_ATTRIBUTE}] [data-hide-home-shorts-shelf],
      html[${HIDDEN_ATTRIBUTE}] [data-hide-home-shorts-item] {
        display: none !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function hideFallbackShortsShelves(root = document) {
    if (!isHomePage()) return;

    // 兜底处理：当 YouTube 改变组件属性时，通过 /shorts/ 链接找到整组 Shorts 推荐。
    const links = [];
    if (root.matches?.('a[href^="/shorts/"]')) links.push(root);
    links.push(...(root.querySelectorAll?.('a[href^="/shorts/"]') || []));

    links.forEach((link) => {
      const shelf = link.closest(
        'ytd-rich-shelf-renderer, ytd-reel-shelf-renderer, ytm-reel-shelf-renderer'
      );
      if (shelf) {
        shelf.setAttribute('data-hide-home-shorts-shelf', '');
        return;
      }

      // 有时 Shorts 会作为普通首页卡片混排，此时只隐藏该卡片。
      const item = link.closest('ytd-rich-item-renderer, ytm-rich-item-renderer');
      if (item) item.setAttribute('data-hide-home-shorts-item', '');
    });
  }

  function refresh(root = document) {
    setHomePageState();
    addStyles();
    hideFallbackShortsShelves(root);
  }

  refresh();

  const observer = new MutationObserver((mutations) => {
    if (!isHomePage()) return;

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) hideFallbackShortsShelves(node);
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  // YouTube 单页应用的页面切换事件。
  window.addEventListener('yt-navigate-finish', () => refresh());
  window.addEventListener('popstate', () => refresh());
})();
