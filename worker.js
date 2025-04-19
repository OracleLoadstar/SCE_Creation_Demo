// Cloudflare Worker to proxy requests to Dify API
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      // Handle CORS preflight
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    if (request.method === 'POST') {
      try {
        // Forward request to Dify API
        const difyUrl = 'https://api.dify.ai/v1/chat-messages';
        const apiKey = 'app-YIGATmbsExzhAEf4hSBYMFhV';
        
        const requestData = await request.json();
        
        // 准备Dify API请求参数
        const difyParams = {
          query: `请评价这张支援卡: ${requestData.card_name}`,
          inputs: {
            ...requestData,
            defcard: requestData.defcard || null,
            lang: requestData.lang || 'zh'
          },
          response_mode: "streaming",
          user: "SCE_User_" + Date.now()
        };

        const response = await fetch(difyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(difyParams)
        });

        // 处理流式响应
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        
        const reader = response.body.getReader();
        const encoder = new TextEncoder();
        
        // 异步处理流
        (async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              // 解析SSE事件
              const text = new TextDecoder().decode(value);
              const events = text.split('\n\n').filter(Boolean);
              
              for (const event of events) {
                if (event.startsWith('data:')) {
                  const data = JSON.parse(event.substring(5).trim());
                  if (data.event === 'message') {
                    await writer.write(encoder.encode(data.answer));
                  }
                }
              }
            }
          } catch (error) {
            console.error('Stream error:', error);
          } finally {
            await writer.close();
          }
        })();

        return new Response(readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
          }
        });
        
        return new Response(JSON.stringify(result), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
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

    return new Response('Method not allowed', { status: 405 });
  }
}