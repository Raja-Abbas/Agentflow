"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, User, Send, Mic, MicOff } from "lucide-react";

export default function EmbedPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [flowName, setFlowName] = useState("AgentFlow Chat");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name") || "AgentFlow Chat";
    setFlowName(name);
    const flowParam = params.get("flow");
    if (flowParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(flowParam)));
        if (decoded.nodes) {
          const triggerNode = decoded.nodes.find((n: any) => n.type === "trigger");
          const greetingNode = decoded.nodes.find((n: any) => n.type === "ai-response");
          if (greetingNode) {
            setMessages([{ role: "bot", content: greetingNode.prompt || `Hello! I'm ${name}. How can I help you?` }]);
          } else {
            setMessages([{ role: "bot", content: `Hello! I'm ${name}. How can I help you?` }]);
          }
        }
      } catch {}
    } else {
      setMessages([{ role: "bot", content: `Hello! I'm ${name}. How can I help you?` }]);
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      setInput((prev) => prev + event.results[0][0].transcript);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setMessages((prev) => [...prev, { role: "bot", content: "Thanks for your message! I'll process this shortly." }]);
    try {
      const keys = JSON.parse(localStorage.getItem("af_llm_keys") || "{}");
      if (keys.openai) {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${keys.openai}` },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "system", content: `You are ${flowName}, a helpful chatbot.` }, ...messages.map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.content })), { role: "user", content: input }],
            temperature: 0.7,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setMessages((prev) => [...prev.slice(0, -1), { role: "bot", content: data.choices[0].message.content }]);
        }
      }
    } catch {}
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "system-ui, -apple-system, sans-serif", background: "#f8fafc" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bot size={18} color="white" />
        </div>
        <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{flowName}</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "80%", display: "flex", alignItems: "flex-end", gap: 6, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: msg.role === "user" ? "#eef2ff" : "#f1f5f9", flexShrink: 0 }}>
                {msg.role === "user" ? <User size={12} color="#4f46e5" /> : <Bot size={12} color="#64748b" />}
              </div>
              <div style={{ padding: "8px 14px", borderRadius: 16, fontSize: 13, lineHeight: 1.5, background: msg.role === "user" ? "#4f46e5" : "white", color: msg.role === "user" ? "white" : "#0f172a", border: msg.role === "user" ? "none" : "1px solid #e2e8f0", borderBottomRightRadius: msg.role === "user" ? 4 : 16, borderBottomLeftRadius: msg.role === "user" ? 16 : 4 }}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid #e2e8f0", background: "white", display: "flex", gap: 8 }}>
        <button onClick={isListening ? stopListening : startListening} style={{ border: "none", background: "none", cursor: "pointer", padding: 4, color: isListening ? "#ef4444" : "#94a3b8" }}>
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          placeholder="Type a message..."
          style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none" }}
        />
        <button onClick={sendMessage} style={{ border: "none", background: "#4f46e5", color: "white", borderRadius: 8, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
