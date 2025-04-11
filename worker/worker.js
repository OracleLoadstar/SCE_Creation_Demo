// worker.js
// addEventListener('fetch', event => { // Removed for ES Module format
//   event.respondWith(handleRequest(event.request, env)); // env needs to be passed
// });

export async function handleRequest(request, env) { // Added env parameter
  if (request.method === 'POST' && request.url.includes('/getUmaSceData')) {
    try {
      // 获取 D1 数据库
      const d1 = env.sce_db; // 替换为你的 D1 数据库名称

      // 从 UmaSCE_Data 表中获取所有数据
      const { results } = await d1.prepare("SELECT * FROM UmaSCE_Data").all();

      // 将数据格式化为 JSON 响应
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      // 错误处理
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // 其他请求处理
  return new Response('Hello worker!', { status: 200 });
}

export default {
  fetch: handleRequest,
};