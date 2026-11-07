// ==UserScript==
// @name         YouTube 首页屏蔽与 HD 画质
// @namespace    https://www.youtube.com/
// @version      1.3.0
// @description  屏蔽首页 Shorts、游戏和会员推广，自动选择 HD 画质，支持剧院模式及播放器尺寸调整。
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/M48A1/RuleSet/main/UserScrip/YouTube.user.js
// @updateURL    https://raw.githubusercontent.com/M48A1/RuleSet/main/UserScrip/YouTube.user.js
// ==/UserScript==

(() => {
  'use strict';

  // HD 功能参考 adisib 的 Youtube HD（2025.04.13），此处独立实现：
  // https://greasyfork.org/en/scripts/23661-youtube-hd
  // 直接修改这里即可生效，无需清除脚本管理器中保存的设置。
  const HD_SETTINGS = {
    changeResolution: true,
    targetRes: 'hd2160', // highres / hd2880 / hd2160 / hd1440 / hd1080 / hd720 / large / medium / small / tiny
    highFramerateTargetRes: null, // 60fps 视频的单独画质；null 表示沿用 targetRes
    autoTheater: false,
    changePlayerSize: false, // 仅调整桌面端剧院模式的播放器
    useCustomSize: false,
    customHeight: 600,
    removeBlackBars: false,
  };
  const HD_QUALITIES = ['highres', 'hd2880', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
  const HD_HEIGHTS = [4320, 2880, 2160, 1440, 1080, 720, 480, 360, 240, 144];
  let hdTimer;
  let hdGeneration = 0;
  let hdApplied = null;

  function resizeHDPlayer(player) {
    if (!HD_SETTINGS.changePlayerSize) return;
    const watch = document.querySelector('ytd-watch-flexy');
    if (!watch) return;
    const index = Math.max(0, HD_QUALITIES.indexOf(HD_SETTINGS.targetRes));
    const masthead = document.getElementById('masthead');
    let height = HD_SETTINGS.useCustomSize
      ? Math.max(270, Number(HD_SETTINGS.customHeight) || 600)
      : Math.max(270, Math.min(HD_HEIGHTS[index], window.innerHeight - (masthead?.getBoundingClientRect().height || 56) - 32));
    const video = player?.querySelector('video');
    if (HD_SETTINGS.removeBlackBars && video?.videoWidth && video.videoHeight) {
      height = Math.min(height, window.innerWidth * video.videoHeight / video.videoWidth);
    }
    let style = document.getElementById('youtube-hd-player-size');
    if (!style) {
      style = document.createElement('style');
      style.id = 'youtube-hd-player-size';
      (document.head || document.documentElement).appendChild(style);
    }
    const css = `ytd-watch-flexy[theater]:not([fullscreen]) :is(#player-theater-container, #player-wide-container, #full-bleed-container) {
      height: ${height}px !important; min-height: ${height}px !important; max-height: none !important;
    }`;
    if (style.textContent !== css) style.textContent = css;
  }

  function applyHD() {
    const player = document.querySelector('#movie_player, .html5-video-player');
    if (!player) return false;
    const watch = document.querySelector('ytd-watch-flexy');
    if (HD_SETTINGS.autoTheater && location.pathname === '/watch' && watch && !watch.hasAttribute('theater')) {
      const button = player.querySelector('.ytp-size-button');
      if (button) button.click();
    }
    resizeHDPlayer(player);
    if (!HD_SETTINGS.changeResolution) return true;
    if (player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting')) return false;
    if (typeof player.getAvailableQualityLevels !== 'function') return false;
    try {
      const videoId = player.getVideoData?.().video_id;
      if (!videoId) return false;
      // 路由已切换但播放器还在播放上一条时，等待新视频加载。
      const pageId = new URLSearchParams(location.search).get('v');
      if (location.pathname === '/watch' && pageId && pageId !== videoId) return false;
      if (hdApplied?.player === player && hdApplied.videoId === videoId) return true;
      const available = player.getAvailableQualityLevels();
      if (!available?.length) return false;
      const features = player.getVideoData?.().video_quality_features || [];
      const requested = HD_SETTINGS.highFramerateTargetRes && features.includes('hfr')
        ? HD_SETTINGS.highFramerateTargetRes : HD_SETTINGS.targetRes;
      const start = Math.max(0, HD_QUALITIES.indexOf(requested));
      const quality = HD_QUALITIES.slice(start).find(q => available.includes(q))
        || [...HD_QUALITIES].reverse().find(q => available.includes(q));
      if (!quality) return false;
      if (typeof player.setPlaybackQualityRange !== 'function' && typeof player.setPlaybackQuality !== 'function') return false;
      player.setPlaybackQualityRange?.(quality, quality);
      player.setPlaybackQuality?.(quality);
      hdApplied = { player, videoId };
      try {
        const now = Date.now();
        localStorage.setItem('yt-player-quality', JSON.stringify({ data: quality, creation: now, expiration: now + 2592000000 }));
      } catch { /* 隐私模式可能禁止本地存储，不影响播放器 API。 */ }
      return true;
    } catch {
      // 播放器在 SPA 切换期间可能暂时不可用，交给有限次数的重试处理。
      return false;
    }
  }

  function scheduleHD(reset = false) {
    clearTimeout(hdTimer);
    const generation = ++hdGeneration;
    if (reset) hdApplied = null;
    let attempts = 0;
    const attempt = () => {
      if (generation !== hdGeneration) return;
      if (!applyHD() && ++attempts < 30) hdTimer = setTimeout(attempt, 500);
    };
    hdTimer = setTimeout(attempt, 0);
  }

  // 事件驱动并限制就绪重试次数，不持续轮询，也不重新加载视频以清空缓冲。
  window.addEventListener('yt-navigate-start', () => {
    clearTimeout(hdTimer);
    hdGeneration += 1;
    hdApplied = null;
  });
  window.addEventListener('yt-navigate-finish', () => scheduleHD(true));
  window.addEventListener('popstate', () => scheduleHD(true));
  window.addEventListener('loadstart', event => {
    if (event.target instanceof HTMLVideoElement) scheduleHD(true);
  }, true);
  window.addEventListener('loadeddata', event => {
    if (event.target instanceof HTMLVideoElement) scheduleHD();
  }, true);
  window.addEventListener('resize', () => resizeHDPlayer(document.querySelector('#movie_player, .html5-video-player')));
  scheduleHD();

  const STYLE_ID = 'hide-youtube-home-shorts-style';
  const HIDDEN_ATTRIBUTE = 'data-hide-home-shorts';

  // 会员推广会出现在首页推荐组、频道页横幅和播放页付费墙，所以单独用一个属性标记。
  const MEMBERSHIP_ATTRIBUTE = 'data-hide-membership-promo';
  // 文案本身可能带标点或“立即加入”之类的后缀，但不能匹配以它开头的长标题。
  const MEMBERSHIP_TEXT = /^(?:解锁更多会员专属福利|解鎖更多會員專屬福利)[\s\S]{0,8}$/;

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
      html[${HIDDEN_ATTRIBUTE}] [data-hide-home-game],
      [data-hide-game-hub],
      [${MEMBERSHIP_ATTRIBUTE}] {
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
  // 隐藏侧栏、导航及推荐区中的“游戏大本营”入口。
  function hideGameHub() {
    const labelPattern = /游戏大本营|遊戲大本營/;
    document.querySelectorAll('a, yt-formatted-string, .yt-core-attributed-string').forEach(el => {
      const label = el.getAttribute('aria-label') || el.textContent || '';
      if (label.length > 80 || !labelPattern.test(label)) return;
      const target = el.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer, ytm-pivot-bar-item-renderer, ytd-rich-section-renderer, ytd-rich-item-renderer, ytm-rich-item-renderer, ytd-rich-shelf-renderer, ytd-shelf-renderer, ytm-rich-section-renderer, ytm-shelf-renderer') || el.closest('a') || el;
      target.setAttribute('data-hide-game-hub', '');
    });
  }

  function hideGames() {
    if (!isHomePage()) return;
    const gameTitle = /游戏|遊戲|即玩|\b(?:gaming|gameplay|playables)\b/i;
    const cards = 'ytd-rich-item-renderer, ytm-rich-item-renderer, ytd-video-renderer, ytm-video-with-context-renderer';
    const shelves = 'ytd-rich-shelf-renderer, ytd-shelf-renderer, ytm-rich-section-renderer, ytm-shelf-renderer';
    document.querySelectorAll('[data-hide-home-game]').forEach(el => el.removeAttribute('data-hide-home-game'));
    document.querySelectorAll(cards).forEach(card => {
      const title = card.querySelector('#video-title, #video-title-link, h3');
      const gameLink = [...card.querySelectorAll('a[href]')].some(link => {
        try {
          const url = new URL(link.getAttribute('href'), location.origin);
          return url.origin === location.origin && /^\/(?:playables|gaming)(?:\/|$)/.test(url.pathname);
        } catch { return false; }
      });
      card.toggleAttribute('data-hide-home-game', gameLink || gameTitle.test(title?.textContent || ''));
    });
    document.querySelectorAll(shelves).forEach(shelf => {
      const title = shelf.querySelector('#title, #title-text, h2');
      if (gameTitle.test(title?.textContent || '')) shelf.setAttribute('data-hide-home-game', '');
    });
  }

  // 屏蔽“解锁更多会员专属福利”这类会员推广。它不是首页专属内容，所以不做首页判断。
  const MEMBERSHIP_LABELS = 'a, yt-formatted-string, .yt-core-attributed-string, h2, h3, button';
  const MEMBERSHIP_BLOCKS = [
    'ytd-rich-section-renderer',
    'ytd-rich-shelf-renderer',
    'ytd-shelf-renderer',
    'ytd-rich-item-renderer',
    'ytm-rich-section-renderer',
    'ytm-shelf-renderer',
    'ytm-rich-item-renderer',
    'ytd-statement-banner-renderer',
    'ytd-banner-promo-renderer',
    'ytd-promo-renderer',
    'ytd-guide-entry-renderer',
    'ytd-mini-guide-entry-renderer',
  ].join(', ');
  // 播放器里的付费墙只隐藏提示块，不要把 <video> 容器一起藏掉。
  const PLAYER_SELECTOR = '#movie_player, .html5-video-player, ytd-player, ytd-player-container';

  // 组件名变化时兜底：向上找第一个“文字仍然很少”的祖先，避免把整个页面藏掉。
  function closestSmallBlock(el) {
    let block = el;
    for (let depth = 0; depth < 8; depth += 1) {
      const parent = block.parentElement;
      if (!parent || parent.matches(PLAYER_SELECTOR)) break;
      if ((parent.textContent || '').trim().length > 200) break;
      block = parent;
    }
    return block;
  }

  function hideMembershipPromos() {
    // 推荐组会复用节点，先清掉上一轮的标记再重新判断。
    document.querySelectorAll(`[${MEMBERSHIP_ATTRIBUTE}]`)
      .forEach(el => el.removeAttribute(MEMBERSHIP_ATTRIBUTE));

    document.querySelectorAll(MEMBERSHIP_LABELS).forEach(el => {
      // 只匹配本身就写着这句推广文案的节点，避免整块容器里的长文本误判。
      const label = (el.getAttribute('aria-label') || el.textContent || '').trim();
      if (!label || label.length > 60 || !MEMBERSHIP_TEXT.test(label)) return;
      const block = el.closest(MEMBERSHIP_BLOCKS) || closestSmallBlock(el);
      block.setAttribute(MEMBERSHIP_ATTRIBUTE, '');
    });
  }

  let scanPending = false;
  function scheduleContentScan() {
    if (scanPending) return;
    scanPending = true;
    requestAnimationFrame(() => {
      scanPending = false;
      hideGameHub();
      hideGames();
      hideMembershipPromos();
    });
  }

  function refresh(root = document) {
    setHomePageState();
    addStyles();
    hideFallbackShortsShelves(root);
    scheduleContentScan();
  }

  refresh();

  const observer = new MutationObserver((mutations) => {
    scheduleContentScan();
    if (!isHomePage()) return;
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
