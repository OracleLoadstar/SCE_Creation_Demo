const CACHE_NAME = 'sce-cache-v1';
const BASE_URL = self.location.pathname.replace('sw.js', '');
const ASSETS = [
  BASE_URL,
  `${BASE_URL}index.html`,
  `${BASE_URL}styles.css`,
  `${BASE_URL}script.js`,
  `${BASE_URL}UmaSCE_V5.js`,
  `${BASE_URL}lang.js`,
  `${BASE_URL}fonts/font.css`,
  `${BASE_URL}fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2`,
  `${BASE_URL}image/SCE_ICON_Dynamic.gif`,
  `${BASE_URL}image/SCE_ICON_Static.png`,
  `${BASE_URL}image/SCE_Loading2.gif`,
  `${BASE_URL}image/SCEDif1.png`,
  `${BASE_URL}image/SCEPlus1.png`,
  `${BASE_URL}manifest.json`
];

// 静默预缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // 静默缓存所有资源
        return Promise.allSettled(
          ASSETS.map(url => 
            fetch(new Request(url, { cache: 'reload' }))
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
                throw new Error(`Failed to fetch ${url}`);
              })
              .catch(err => {
                console.warn(`Caching failed for ${url}:`, err);
                return Promise.resolve(); // 继续处理其他资源
              })
          )
        );
      })
      .then(() => self.skipWaiting()) // 立即激活新版本
  );
});

// 接管页面控制权
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      caches.keys()
        .then(keys => Promise.all(
          keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )),
      // 立即接管页面
      self.clients.claim()
    ])
  );
});

// 网络优先的缓存策略
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 检查响应是否有效
        if (!response || response.status !== 200) {
          throw new Error('Network response was not ok');
        }

        // 克隆响应用于缓存
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, responseToCache))
          .catch(err => console.warn('Cache update failed:', err));

        return response;
      })
      .catch(() => 
        // 网络请求失败时使用缓存
        caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // 如果缓存中也没有，返回离线页面或错误响应
            return new Response('Network error', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          })
      )
  );
});

// 处理更新消息
self.addEventListener('message', event => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
      .then(() => console.log('Service Worker activated'))
      .catch(err => console.error('Error activating Service Worker:', err));
  }
});