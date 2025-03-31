const CACHE_NAME = 'sce-cache-v1';
const BASE_URL = self.location.pathname.replace('sw.js', '');
const ASSETS = [
  BASE_URL,
  `${BASE_URL}index.html`,
  `${BASE_URL}styles.css`,
  `${BASE_URL}script_org.js`,
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

// 安装 service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.allSettled(
          ASSETS.map(url => {
            return fetch(new Request(url, { cache: 'reload' }))
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
                }
                return cache.put(url, response);
              })
              .catch(err => {
                console.error('Error caching ' + url + ':', err);
                return Promise.resolve(); // 继续处理其他资源
              });
          })
        );
      })
  );
});

// 激活 service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        );
      }),
      self.clients.claim() // 立即接管页面控制权
    ])
  );
});

// 拦截请求并从缓存中响应
self.addEventListener('fetch', event => {
  // 忽略非 GET 请求
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request.clone())
          .then(response => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应用于缓存
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache)
                  .catch(err => console.error('Error caching response:', err));
              });

            return response;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            // 如果获取失败，尝试返回离线页面或错误响应
            return new Response('Network error', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// 处理更新消息
self.addEventListener('message', event => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
      .then(() => console.log('Service Worker skipped waiting'))
      .catch(err => console.error('Error skipping waiting:', err));
  }
});