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
// 激活 service worker - 加入版本检查和强制更新逻辑
self.addEventListener('activate', event => {
  console.log('Service Worker activating.');

  // 立即控制客户端
  event.waitUntil(self.clients.claim());

  // 版本检查函数
  async function checkVersionAndClean() {
    console.log('Checking version in activate event...');
    try {
      // 同时获取远程版本和本地缓存版本
      const [versionResponse, cachedVersionResponse] = await Promise.all([
        fetch('/version.txt?t=' + Date.now()), // 添加时间戳防止缓存
        caches.match('/version.txt').then(res => res || fetch('/version.txt?t=' + Date.now())) // 优先从缓存读，失败则fetch
      ]);

      if (!versionResponse.ok) {
        console.error('Failed to fetch latest version.txt:', versionResponse.status);
        return; // 获取版本失败，不继续
      }
       if (!cachedVersionResponse.ok) {
        console.warn('Failed to get cached version.txt. Assuming update is needed or first install.');
        // 即使本地版本获取失败，也可能需要清理旧缓存并通知客户端
      }


      const latestVersion = (await versionResponse.text()).trim();
      const cachedVersion = cachedVersionResponse.ok ? (await cachedVersionResponse.text()).trim() : null;

      console.log('Latest version:', latestVersion);
      console.log('Cached version:', cachedVersion);

      // 清理旧缓存（无论版本是否匹配，总是在激活时清理非当前版本的缓存）
      const cacheCleanPromise = caches.keys().then(keys => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log('Deleting old cache:', key);
              return caches.delete(key);
            })
        );
      });

      // 如果版本不匹配，执行强制更新流程
      if (cachedVersion === null || latestVersion !== cachedVersion) {
        console.log('Version mismatch or first install. Triggering update process.');

        // 1. 等待旧缓存清理完成
        await cacheCleanPromise;
        console.log('Old caches cleared.');

        // 2. 清理当前版本的缓存 (因为版本已更新，需要重新缓存)
        console.log('Deleting current cache:', CACHE_NAME);
        await caches.delete(CACHE_NAME);
        console.log('Current cache deleted.');


        // 3. 通知所有客户端 Service Worker 已更新，需要刷新和清理
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        clients.forEach(client => {
          console.log('Sending SW_UPDATED message to client:', client.id);
          client.postMessage({ type: 'SW_UPDATED' });
        });

        // 4. 尝试注销自身 (注销后，下次页面加载会重新注册)
        // 注意：注销后，当前SW可能仍然会处理完当前事件，但之后会失效
        console.log('Unregistering Service Worker...');
        await self.registration.unregister();
        console.log('Service Worker unregistered.');

      } else {
        console.log('Version is up to date.');
        // 版本匹配，只需确保旧缓存被清理
        await cacheCleanPromise;
        console.log('Old caches cleared (version matched).');
      }

    } catch (error) {
      console.error('Error during version check and clean:', error);
    }
  }

  // 执行版本检查和清理
  event.waitUntil(checkVersionAndClean());
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
// 处理来自页面的消息（例如，用于手动触发更新检查或跳过等待）
self.addEventListener('message', event => {
  if (event.data.type === 'SKIP_WAITING') {
    console.log('Received SKIP_WAITING message. Skipping waiting...');
    self.skipWaiting();
  }
  // 可以添加其他消息处理逻辑
});