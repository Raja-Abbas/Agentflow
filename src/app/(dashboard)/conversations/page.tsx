"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Bot, User, MoreVertical, Mic, MicOff, Plus, Trash2 } from "lucide-react";
import { callLLM } from "@/lib/llm";

interface Message { id: string; role: "user" | "bot"; content: string; time: string; }
interface Conversation { id: string; title: string; agent: string; lastMessage: string; time: string; unread: number; messages: Message[]; }

export default function ConversationsPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [sending, setSending] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function loadData() {
    try {
      const [convRes, agentRes] = await Promise.all([fetch("/api/conversations"), fetch("/api/agents")]);
      if (convRes.ok) {
        const data = await convRes.json();
        setConversations(data.map((c: any) => ({
          id: c.id, title: c.title || "Conversation", agent: c.agent?.name || "Agent",
          lastMessage: c.messages?.length > 0 ? c.messages[c.messages.length - 1].content : "",
          time: new Date(c.createdAt).toLocaleDateString(), unread: 0,
          messages: (c.messages || []).map((m: any) => ({ id: m.id, role: m.role, content: m.content, time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })),
        })));
      }
      if (agentRes.ok) setAgents(await agentRes.json());
    } catch {}
  }

  useEffect(() => { loadData(); }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conversations, activeConv]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false; recognition.interimResults = false; recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => setMessageInput((prev) => prev + event.results[0][0].transcript);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => { if (recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); } };

  async function newConversation() {
    const agentName = agents.length > 0 ? agents[0].name : "Assistant";
    const agentId = agents.length > 0 ? agents[0].id : null;
    if (!agentId) return;
    try {
      const res = await fetch("/api/conversations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: `Chat with ${agentName}`, agentId }) });
      if (res.ok) { loadData(); const data = await res.json(); setActiveConv(data.id); }
    } catch {}
  }

  async function deleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Delete this conversation?")) return;
    try {
      await fetch("/api/conversations", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      setConversations((prev) => { const next = prev.filter((c) => c.id !== id); if (activeConv === id) setActiveConv(next.length > 0 ? next[next.length - 1].id : null); return next; });
    } catch {}
  }

  const sendMessage = async () => {
    if (!messageInput.trim() || !activeConv || sending) return;
    setSending(true);
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: String(Date.now()), role: "user", content: messageInput.trim(), time };
    setMessageInput("");

    setConversations((prev) => prev.map((c) => c.id === activeConv ? { ...c, messages: [...c.messages, userMsg], lastMessage: userMsg.content, time } : c));

    try {
      const currentConv = conversations.find((c) => c.id === activeConv);
      const model = agents.find((a) => a.name === currentConv?.agent)?.model || "GPT-4";
      const allMessages = [...(currentConv?.messages || []), userMsg];
      const reply = await callLLM(model, "You are a helpful AI assistant.", allMessages.map((m) => ({ role: m.role, content: m.content })));
      const botMsg: Message = { id: String(Date.now() + 1), role: "bot", content: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };

      await fetch(`/api/conversations/${activeConv}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: messageInput.trim(), role: "user" }) });
      await fetch(`/api/conversations/${activeConv}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: reply, role: "bot" }) });

      setConversations((prev) => prev.map((c) => c.id === activeConv ? { ...c, messages: [...c.messages, botMsg], lastMessage: botMsg.content } : c));
    } catch (err: any) {
      const errMsg: Message = { id: String(Date.now() + 1), role: "bot", content: `⚠️ ${err.message || "Check your API keys in Settings > AI Models."}`, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setConversations((prev) => prev.map((c) => c.id === activeConv ? { ...c, messages: [...c.messages, errMsg] } : c));
    }
    setSending(false);
  };

  const filteredConvs = conversations.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.agent.toLowerCase().includes(searchQuery.toLowerCase()));
  const currentConv = conversations.find((c) => c.id === activeConv);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <Card className="w-80 shrink-0 rounded-none border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Conversations</h2>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={newConversation} title="New conversation"><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8" /></div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConvs.length === 0 ? <div className="p-4 text-center text-sm text-slate-400">No conversations yet</div> : (
            filteredConvs.map((conv) => (
              <button key={conv.id} onClick={() => setActiveConv(conv.id)}
                className={`w-full text-left p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors relative ${activeConv === conv.id ? "bg-indigo-50 dark:bg-indigo-950/30 border-l-2 border-l-indigo-500" : ""}`}>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate pr-2">{conv.title}</h3>
                  <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">{conv.time}</span>
                </div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">{conv.agent}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate pr-6">{conv.lastMessage || "New conversation"}</p>
                <button onClick={(e) => deleteConversation(conv.id, e)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
              </button>
            ))
          )}
        </div>
      </Card>

      <div className="flex-1 flex flex-col bg-white dark:bg-slate-950">
        {!currentConv ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center"><Bot className="h-16 w-16 mx-auto mb-4 text-slate-200 dark:text-slate-700" /><p className="text-lg">Select a conversation or start a new one</p></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center"><Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
                <div><h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{currentConv.agent}</h3><span className="text-xs text-slate-500 dark:text-slate-400">{currentConv.messages.length} messages</span></div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => deleteConversation(currentConv.id, e)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {currentConv.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-end gap-2 max-w-[70%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-indigo-100 dark:bg-indigo-900/40" : "bg-slate-100 dark:bg-slate-800"}`}>
                      {msg.role === "user" ? <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> : <Bot className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />}
                    </div>
                    <div>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-indigo-600 text-white rounded-br-md" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md"}`}>{msg.content}</div>
                      <span className={`text-[10px] text-slate-400 mt-1 block ${msg.role === "user" ? "text-right" : "text-left"}`}>{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className={`h-9 w-9 shrink-0 ${isListening ? "bg-red-100 text-red-500" : ""}`} onClick={isListening ? stopListening : startListening} title={isListening ? "Stop listening" : "Voice input"}>
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <div className="flex-1 relative">
                  <Input placeholder={sending ? "AI is thinking..." : "Type a message..."} value={messageInput} onChange={(e) => setMessageInput(e.target.value)} disabled={sending} className="pr-10"
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
                </div>
                <Button size="icon" className="h-9 w-9 shrink-0" onClick={sendMessage} disabled={sending || !messageInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}