const CACHE_NAME = 'sce-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/UmaSCE_V5.js',
  '/lang.js',
  '/fonts/font.css',
  '/fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
  '/image/SCE_ICON_Dynamic.gif',
  '/image/SCE_ICON_Static.png',
  '/image/SCE_Loading2.gif',
  '/version.txt'
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
console.log('Fetching:', event.request.url);
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
  
if (!userAgreedToTerms) {
        // 显示协议警告，用户同意后设置标志
        showGnuv3Dialog();
        return;
    }

navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
        if (registration.active.scriptURL.includes('sw.js')) {
            registration.unregister();
        }
    }
});

navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
        registration.unregister();
    }
});

  async function checkVersion() {
    const userAgreedToTerms = localStorage.getItem('userAgreedToTerms');
    if (!userAgreedToTerms) {
        // 显示协议警告，用户同意后设置标志
        // 这里可以显示协议相关的逻辑
        return;
    }
    const response = await fetch('https://sce.off.sd/version_info/last_version.txt');
    const latestVersion = await response.text();
    const cachedVersion = await (await fetch('version.txt')).text();

    if (latestVersion.trim() !== cachedVersion.trim()) {
        // 清除缓存并重新缓存网站
        caches.keys().then(function(cacheNames) {
            cacheNames.forEach(function(cacheName) {
                caches.delete(cacheName);
            });
            // 强制更新服务工作者
            self.skipWaiting();
        });
    }
  }

  checkVersion();
});