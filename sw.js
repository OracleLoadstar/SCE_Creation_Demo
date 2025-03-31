const CACHE_NAME = 'sce-cache-v1';
const ASSETS = [
  '.',
  'index.html',
  'styles.css',
  'script_org.js',
  'UmaSCE_V5.js',
  'lang.js',
  'fonts/font.css',
  'fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
  'image/SCE_ICON_Dynamic.gif',
  'image/SCE_ICON_Static.png',
  'image/SCE_Loading2.gif',
  'image/SCEDif1.png',
  'image/SCEPlus1.png',
  'manifest.json'
];

// 安装 service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // 分别缓存每个资源，这样单个资源失败不会影响整体
        return Promise.all(
          ASSETS.map(url => {
            return cache.add(url).catch(err => {
              console.error('Error caching ' + url + ':', err);
              // 继续处理其他资源
              return Promise.resolve();
            });
          })
        );
      })
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
      .then(response => {
        if (response) {
          return response;
        }
        // 如果缓存中没有，尝试从网络获取
        return fetch(event.request).then(response => {
          // 检查响应是否有效
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 克隆响应，因为响应流只能使用一次
          const responseToCache = response.clone();

          // 将新的响应添加到缓存中
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            })
            .catch(err => {
              console.error('Error caching new response:', err);
            });

          return response;
        }).catch(err => {
          console.error('Fetch failed:', err);
          // 如果网络请求失败，返回一个适当的错误响应
          return new Response('Network error', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// 处理更新消息
self.addEventListener('message', event => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});