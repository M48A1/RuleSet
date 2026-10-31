// ==UserScript==
// @name         YouTube 首页 Shorts 与游戏屏蔽
// @namespace    https://www.youtube.com/
// @version      1.1.0
// @description  隐藏 YouTube 首页中的 Shorts、即玩游戏及标题明确标注的游戏推荐。
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/M48A1/RuleSet/main/UserScrip/YouTube.js
// @updateURL    https://raw.githubusercontent.com/M48A1/RuleSet/main/UserScrip/YouTube.js
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
      html[${HIDDEN_ATTRIBUTE}] [data-hide-home-shorts-item],
      html[${HIDDEN_ATTRIBUTE}] [data-hide-home-game] {
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


  // 只依据明确的游戏入口或标题判断，避免用整张卡片的文字误匹配频道名。
  function hideGames() {
    if (!isHomePage()) return;
    const gameTitle = /游戏|遊戲|即玩|\\b(?:gaming|gameplay|playables)\\b/i;
    const cards = 'ytd-rich-item-renderer, ytm-rich-item-renderer, ytd-video-renderer, ytm-video-with-context-renderer';
    const shelves = 'ytd-rich-shelf-renderer, ytd-shelf-renderer, ytm-rich-section-renderer, ytm-shelf-renderer';
    document.querySelectorAll('[data-hide-home-game]').forEach(el => el.removeAttribute('data-hide-home-game'));
    document.querySelectorAll(cards).forEach(card => {
      const title = card.querySelector('#video-title, #video-title-link, h3');
      const gameLink = [...card.querySelectorAll('a[href]')].some(link => {
        try {
          const url = new URL(link.getAttribute('href'), location.origin);
          return url.origin === location.origin && /^\\/(?:playables|gaming)(?:\\/|$)/.test(url.pathname);
        } catch { return false; }
      });
      card.toggleAttribute('data-hide-home-game', gameLink || gameTitle.test(title?.textContent || ''));
    });
    document.querySelectorAll(shelves).forEach(shelf => {
      const title = shelf.querySelector('#title, #title-text, h2');
      if (gameTitle.test(title?.textContent || '')) shelf.setAttribute('data-hide-home-game', '');
    });
  }

  let gameScanPending = false;
  function scheduleGameScan() {
    if (gameScanPending) return;
    gameScanPending = true;
    requestAnimationFrame(() => {
      gameScanPending = false;
      hideGames();
    });
  }

  function refresh(root = document) {
    setHomePageState();
    addStyles();
    hideFallbackShortsShelves(root);
    scheduleGameScan();
  }

  refresh();

  const observer = new MutationObserver((mutations) => {
    if (!isHomePage()) return;

    scheduleGameScan();
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) hideFallbackShortsShelves(node);
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  // YouTube 单页应用的页面切换事件。
  window.addEventListener('yt-navigate-finish', () => refresh());
  window.addEventListener('popstate', () => refresh());
})();
