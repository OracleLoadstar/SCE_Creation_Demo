// Service Worker - 移除缓存和请求逻辑

// 安装时立即跳过等待阶段
self.addEventListener('install', event => {
  console.log('Service Worker installing - skipping waiting.');
  self.skipWaiting();
});

// 激活时立即控制客户端
self.addEventListener('activate', event => {
  console.log('Service Worker activating - claiming clients.');
  event.waitUntil(self.clients.claim());
});

// 不再处理 fetch 事件 (移除缓存和 Worker 访问记录)
// 不再处理 message 事件 (移除更新相关逻辑)