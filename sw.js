/* 龙族 · 混血种档案 — Service Worker
 * 策略：
 *  - 导航请求（HTML）：network-first，失败回退缓存 → 发布后总能拿到最新版
 *  - 静态资源（css/js/img/音频）：stale-while-revalidate → 秒开 + 后台更新
 *  - 每次部署 CACHE_VERSION 变化 → activate 时自动清理旧缓存
 * deploy.mjs 会在发布时重写版本号与预缓存清单（相对路径，兼容 GitHub Pages 子路径与 Surge 根域名）。
 */
const CACHE_VERSION = '20260804-1541';
const CACHE_NAME = 'dr-site-' + CACHE_VERSION;
const PRECACHE = ["account.js?v=20260804-1541","achievements.js?v=20260804-1541","app.js?v=20260804-1541","auth.js?v=20260804-1541","characters-data.js?v=20260804-1541","data/items-data.js?v=20260804-1541","data/orgs-data.js?v=20260804-1541","data/quotes-data.js?v=20260804-1541","data/timeline-data.js?v=20260804-1541","eva-extra.css?v=20260804-1541","eva.js?v=20260804-1541","i18n.js?v=20260804-1541","img/cassell-seal-round.png","img/cassell-seal.png","img/chapters-poster.jpg","img/crest.webp","img/dragon-01.webp","img/dragon-02.webp","img/dragon-03.webp","img/dragon-04.webp","img/dragon-05.webp","img/dragon-06.webp","img/opening.jpg","img/zihang-odin.jpg","modules.css?v=20260804-1541","style.css?v=20260804-1541"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 导航请求：网络优先，失败回退缓存
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match('./index.html'))
        )
    );
    return;
  }

  // 静态资源：stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchP = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchP;
    })
  );
});
