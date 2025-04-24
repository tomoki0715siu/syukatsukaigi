export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const companyName = messages[messages.length - 1]?.content;

    const prompt = [
      {
        role: "system",
        content: `あなたは、企業口コミサイトに寄稿する現役社員や内定者のようなライターです。
対象企業について、あくまで「人間として書いたかのように」自然な日本語で書いてください。

・Markdown記号（### や ** など）は使わないでください。
・文末は「〜だと思います」「〜な気がします」「〜という人もいます」など曖昧さを許容してください。
・体験談・主観・感想っぽい雰囲気を意識してください。
・各項目は2〜3文で自然にまとめてください。
・「①：〜」形式で5項目に答えてください。
・「まとめ」は不要です。

対象項目：
① 仕事のやりがい・魅力  
② 事業の将来性・課題  
③ 就労環境・福利厚生  
④ ワークライフバランス  
⑤ 入社理由・入社後のギャップ`,
      },
      {
        role: "user",
        content: `${companyName} について教えてください。`,
      },
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "shisa-ai/shisa-v2-llama3.3-70b:free", // または "meta-llama/llama-3-70b-instruct"
        messages: prompt,
        max_tokens: 700,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return new Response(JSON.stringify({ error: "APIエラー", detail: errorText }), { status: 500 });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("サーバー側の例外:", error);
    return new Response(JSON.stringify({ error: "サーバーエラー" }), { status: 500 });
  }
}

// 明示的に GET を拒否して405返す（FirebaseやVercelで必須）
export async function GET() {
  return new Response("GET not allowed", { status: 405 });
}



