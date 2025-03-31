const CACHE_NAME = 'sce-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script_org.js',
  '/UmaSCE_V5.js',
  '/lang.js',
  '/fonts/font.css',
  '/fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
  '/image/SCE_ICON_Dynamic.gif',
  '/image/SCE_ICON_Static.png',
  '/image/SCE_Loading2.gif'
];

// 安装 service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

// 激活 service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

// 拦截请求并从缓存中响应
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// 处理更新消息
self.addEventListener('message', event => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});