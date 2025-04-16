// Cloudflare Worker 代码
export default {
  async fetch(request) {
    // 处理CORS预检请求
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    // 只处理POST请求
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // 获取请求数据
      const formData = await request.json();
      
      // 调用Dify API
      const difyResponse = await fetch('https://api.dify.ai/v1/completion-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer app-hlgPlVFq8vsGw2A0DPUOyIHJ'
        },
        body: JSON.stringify({
          inputs: {
            form_data: formData
          },
          response_mode: "blocking",
          user: "anonymous"
        })
      });

      if (!difyResponse.ok) {
        throw new Error(`Dify API error: ${difyResponse.status}`);
      }

      const difyData = await difyResponse.json();
      
      // 返回响应
      return new Response(JSON.stringify(difyData), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};

// 处理CORS预检请求
function handleOptions(request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}