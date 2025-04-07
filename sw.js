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
  // Record visit via Cloudflare Worker for navigation requests
  if (event.request.mode === 'navigate') {
    const trackVisitViaWorker = async () => {
      try {
        // 重要：请将下面的 URL 替换为你的 Worker 的实际部署 URL
        const workerUrl = 'https://webui-d1-worker.3290293702.workers.dev';

        const response = await fetch(workerUrl, {
          method: 'POST',
          // 可以根据需要添加 headers，但对于这个简单的 Worker 可能不需要
          // headers: { 'Content-Type': 'application/json' },
          // body: JSON.stringify({ some_data: 'value' }) // 如果 Worker 需要 body 数据
        });

        if (!response.ok) {
          console.error('Failed to record visit via Worker:', response.status, await response.text());
        } else {
          console.log('Visit recorded successfully via Worker.');
        }
      } catch (error) {
        console.error('Error recording visit via Worker:', error);
      }
    };
    // 异步执行，不阻塞主请求
    // 使用 waitUntil 确保 Service Worker 在 fetch 完成前不会被终止
    event.waitUntil(trackVisitViaWorker());
  }


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
  // 移除 message 事件监听器外部的注销逻辑，将其整合到 checkVersion 中

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
        // 版本不匹配，执行更新流程
        console.log('New version detected. Starting update process...');
        // 1. 清除所有缓存
        caches.keys().then(cacheNames => {
          return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
        }).then(() => {
          console.log('Caches cleared.');
          // 2. 强制注销所有 Service Worker 注册
          return navigator.serviceWorker.getRegistrations();
        }).then(registrations => {
          return Promise.all(registrations.map(registration => registration.unregister()));
        }).then(() => {
          console.log('All Service Workers unregistered.');
          // 3. 通知所有客户端强制刷新
          return self.clients.matchAll({ type: 'window' });
        }).then(clients => {
          clients.forEach(client => {
            // 使用 navigate 方法强制重新加载页面
            // 这比 client.postMessage 更可靠，因为它不依赖客户端监听消息
            if (client.url && 'navigate' in client) {
               client.navigate(client.url);
            }
          });
          console.log('Sent refresh command to clients.');
        }).catch(error => {
          console.error('Error during update process:', error);
        });
        // 注意：调用 self.skipWaiting() 可能在这里不再必要，
        // 因为我们正在注销 SW 并强制刷新。可以保留或移除。
        // self.skipWaiting();
    }
  }

  checkVersion();
});