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
        const difyUrl = 'https://api.dify.ai/v1/completion-messages';
        const apiKey = 'app-hlgPlVFq8vsGw2A0DPUOyIHJ';
        
        const requestData = await request.json();
        
        // 将支援卡数据转换为JSON字符串作为input
        const inputText = JSON.stringify({
          card_name: requestData.card_name,
          type: requestData.type_static,
          friendship_award: requestData.friendship_award,
          enthusiasm_award: requestData.enthusiasm_award,
          training_award: requestData.training_award,
          strike_point: requestData.strike_point,
          friendship_point: requestData.friendship_point,
          speed_bonus: requestData.speed_bonus,
          stamina_bonus: requestData.stamina_bonus,
          power_bonus: requestData.power_bonus,
          willpower_bonus: requestData.willpower_bonus,
          wit_bonus: requestData.wit_bonus,
          sp_bonus: requestData.sp_bonus,
          enum_values: requestData.enable_enum ? {
            enum_friendship_award: requestData.enum_friendship_award,
            enum_enthusiasm_award: requestData.enum_enthusiasm_award,
            enum_training_award: requestData.enum_training_award,
            enum_friendship_point: requestData.enum_friendship_point,
            enum_strike_point: requestData.enum_strike_point,
            enum_speed_bonus: requestData.enum_speed_bonus,
            enum_stamina_bonus: requestData.enum_stamina_bonus,
            enum_power_bonus: requestData.enum_power_bonus,
            enum_willpower_bonus: requestData.enum_willpower_bonus,
            enum_wit_bonus: requestData.enum_wit_bonus,
            enum_sp_bonus: requestData.enum_sp_bonus
          } : null
        }, null, 2);

        const response = await fetch(difyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            inputs: {
              input: inputText
            },
            response_mode: "blocking",
            user: "support_card_evaluator"
          })
        });

        const result = await response.json();
        
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