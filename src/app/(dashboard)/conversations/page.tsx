"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Bot,
  User,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";

const conversations = [
  {
    id: "1",
    title: "Customer support inquiry",
    agent: "Customer Support Bot",
    lastMessage: "I need help with my order",
    time: "2m ago",
    unread: 3,
    active: true,
  },
  {
    id: "2",
    title: "Pricing question",
    agent: "Sales Qualifier",
    lastMessage: "What plans do you offer?",
    time: "15m ago",
    unread: 0,
    active: false,
  },
  {
    id: "3",
    title: "Technical issue",
    agent: "FAQ Assistant",
    lastMessage: "The API is returning 500 errors",
    time: "1h ago",
    unread: 1,
    active: false,
  },
  {
    id: "4",
    title: "Demo request",
    agent: "Lead Generator",
    lastMessage: "I'd like to see a demo",
    time: "3h ago",
    unread: 0,
    active: false,
  },
  {
    id: "5",
    title: "Setup help",
    agent: "Onboarding Helper",
    lastMessage: "How do I connect my database?",
    time: "1d ago",
    unread: 0,
    active: false,
  },
  {
    id: "6",
    title: "Feature request",
    agent: "Customer Support Bot",
    lastMessage: "Can you add dark mode?",
    time: "2d ago",
    unread: 0,
    active: false,
  },
];

const messages = [
  {
    id: "1",
    role: "user" as const,
    content: "Hi, I need help with my order #12345",
    time: "2:30 PM",
  },
  {
    id: "2",
    role: "bot" as const,
    content:
      "Hello! I'd be happy to help you with order #12345. Let me look that up for you. Could you please confirm the email address used for the order?",
    time: "2:30 PM",
  },
  {
    id: "3",
    role: "user" as const,
    content: "It's john@example.com",
    time: "2:31 PM",
  },
  {
    id: "4",
    role: "bot" as const,
    content:
      "Thank you! I found your order. It was placed on January 10th and is currently being shipped. The expected delivery date is January 15th. Would you like me to send you the tracking link?",
    time: "2:31 PM",
  },
  {
    id: "5",
    role: "user" as const,
    content: "Yes please",
    time: "2:32 PM",
  },
  {
    id: "6",
    role: "bot" as const,
    content:
      "I've sent the tracking link to john@example.com. You should receive it within a few minutes. Is there anything else I can help you with?",
    time: "2:32 PM",
  },
];

export default function ConversationsPage() {
  const [activeConversation, setActiveConversation] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const filteredConversations = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConv = conversations.find((c) => c.id === activeConversation);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Panel - Conversation List */}
      <Card className="w-80 shrink-0 rounded-none border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Conversations
          </h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full text-left p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${
                activeConversation === conv.id
                  ? "bg-indigo-50 dark:bg-indigo-950/30 border-l-2 border-l-indigo-500"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate pr-2">
                  {conv.title}
                </h3>
                <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                  {conv.time}
                </span>
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">
                {conv.agent}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate pr-2">
                  {conv.lastMessage}
                </p>
                {conv.unread > 0 && (
                  <Badge className="h-5 min-w-[20px] px-1.5 text-[10px] shrink-0">
                    {conv.unread}
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Right Panel - Chat View */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-950">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {activeConv?.agent}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Online
                </span>
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                  GPT-4
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end gap-2 max-w-[70%] ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user"
                      ? "bg-indigo-100 dark:bg-indigo-900/40"
                      : "bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  )}
                </div>
                <div>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-md"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span
                    className={`text-[10px] text-slate-400 mt-1 block ${
                      msg.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <Paperclip className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="pr-10"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    setMessageInput("");
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            <Button size="icon" className="h-9 w-9 shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
