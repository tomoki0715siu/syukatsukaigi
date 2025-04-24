"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages: Message[] = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content || "返答がありませんでした。";

      setMessages([...newMessages, { role: "assistant" as const, content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: "assistant" as const, content: "エラーが発生しました。" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧠 OpenRouter ChatBot</h1>

      <div className="border rounded p-4 h-[400px] overflow-y-auto bg-gray-50 mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span className={msg.role === "user" ? "bg-blue-100" : "bg-green-100"} style={{ padding: '6px', borderRadius: '6px', display: 'inline-block' }}>
              <strong>{msg.role === "user" ? "🧑 あなた" : "🤖 Bot"}:</strong> {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border px-3 py-2 rounded"
          placeholder="企業名を入力してください"
        />
        <button onClick={sendMessage} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? "送信中..." : "送信"}
        </button>
      </div>
    </main>
  );
}



