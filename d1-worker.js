export default {
  async fetch(request, env, ctx) {
    // 定义允许的源
    const allowedOrigin = 'https://sce.off.sd';
    const origin = request.headers.get('Origin');

    // 预检请求处理 (OPTIONS)
    if (request.method === 'OPTIONS') {
      // 确保请求来自允许的源
      if (origin === allowedOrigin) {
        return new Response(null, {
          status: 204, // No Content
          headers: {
            'Access-Control-Allow-Origin': allowedOrigin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS', // 允许的方法
            'Access-Control-Allow-Headers': 'Content-Type', // 允许的请求头 (如果 sw.js 发送了 Content-Type)
            'Access-Control-Max-Age': '86400', // 预检结果缓存时间 (秒)
          },
        });
      } else {
        // 如果源不允许，返回错误
        return new Response('OPTIONS request from disallowed origin', { status: 403 });
      }
    }

    // 处理实际的 POST 请求
    if (request.method === 'POST') {
      // 再次检查源是否允许 (虽然浏览器通常会先发 OPTIONS)
      if (origin !== allowedOrigin) {
         return new Response('POST request from disallowed origin', { status: 403 });
      }

      try {
        const { success } = await env.DB.prepare(
          'INSERT INTO visits DEFAULT VALUES;'
        ).run();

        const headers = {
          'Access-Control-Allow-Origin': allowedOrigin, // 添加 CORS 头
          'Content-Type': 'text/plain', // 可以根据需要设置响应类型
        };

        if (success) {
          console.log('Visit recorded successfully via Worker.');
          return new Response('Visit recorded', { status: 200, headers });
        } else {
          console.error('Worker failed to record visit to D1.');
          return new Response('Failed to record visit', { status: 500, headers });
        }
      } catch (e) {
        console.error('Error in Worker while recording visit:', e);
        return new Response(`Worker Error: ${e.message}`, { status: 500, headers: { 'Access-Control-Allow-Origin': allowedOrigin } }); // 错误响应也加 CORS 头
      }
    }

    // 对于其他方法，返回 Method Not Allowed
    return new Response('Method Not Allowed', { status: 405, headers: { 'Access-Control-Allow-Origin': allowedOrigin } }); // 其他响应也加 CORS 头
  },
};