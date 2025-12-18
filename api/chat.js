// api/chat.js

export const config = {
  runtime: 'edge', // 使用 Edge Runtime 以获得最佳流式传输性能
};

export default async function handler(req) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // 从前端获取消息历史
    const { messages } = await req.json();

    // 从环境变量获取 API Key (在 Vercel 后台设置)
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return new Response('Server Configuration Error: Missing API Key', { status: 500 });
    }

    // 向 DeepSeek 发起请求
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
        stream: true, // 强制开启流式传输
        temperature: 0.5
      })
    });

    // 直接将 DeepSeek 的流返回给前端
    return response;

  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
