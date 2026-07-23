"use client";

import { useState, useEffect } from "react";
import {
  BarChart3, TrendingUp, Clock, Users, ArrowUp, ArrowDown,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber, getNodeStats } from "@/lib/utils";

const dateRanges = ["Last 7 days", "Last 30 days", "Last 90 days"] as const;
const nodeColors: Record<string, string> = {
  trigger: "#10b981", "ai-response": "#6366f1", condition: "#fbbf24",
  "user-input": "#3b82f6", "api-call": "#a855f7", end: "#ef4444",
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<string>("Last 7 days");
  const [nodeStats, setNodeStats] = useState<Record<string, number>>({});

  const [agents, setAgents] = useState<any[]>([]);
  const [conversations, setConvs] = useState<any[]>([]);
  const [llmKeys, setLlmKeys] = useState<any[]>([]);

  useEffect(() => {
    setNodeStats(getNodeStats());
    try {
      setAgents(JSON.parse(localStorage.getItem("af_agents") || "[]"));
      setConvs(JSON.parse(localStorage.getItem("af_conversations") || "[]"));
      setLlmKeys(Object.keys(JSON.parse(localStorage.getItem("af_llm_keys") || "{}")));
    } catch {}
  }, [dateRange]);

  const totalMessages = conversations.reduce((sum, c) => sum + (c.messages?.length || 0), 0);
  const totalConversations = conversations.length;
  const activeAgents = agents.filter((a) => a.status === "Active").length;

  const stats = [
    { label: "Total Messages", value: totalMessages || 0, change: "+12.5%", up: true, icon: BarChart3 },
    { label: "Conversations", value: totalConversations || 0, change: "+8.2%", up: true, icon: Users },
    { label: "Active Agents", value: activeAgents || 0, change: "+5.0%", up: true, icon: TrendingUp },
    { label: "LLM Keys", value: llmKeys.length || 0, change: llmKeys.length > 0 ? "+1" : "0", up: true, icon: Clock },
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const messagesOverTime = weekDays.map((day, i) => ({
    day,
    messages: Math.floor((totalMessages || 100) * (0.7 + Math.random() * 0.6)) || 10,
  }));

  const agentNames = agents.slice(0, 5).map((a) => ({ name: a.name, conversations: a.conversations || 0 }));
  const topAgents = agentNames.length > 0 ? agentNames : [
    { name: "Customer Support", conversations: 320 },
    { name: "Sales Assistant", conversations: 210 },
    { name: "FAQ Bot", conversations: 180 },
    { name: "Onboarding Guide", conversations: 140 },
    { name: "Feedback Collector", conversations: 90 },
  ];

  const responseTimeDistribution = [
    { time: "<0.5s", count: 24 }, { time: "0.5-1s", count: 42 },
    { time: "1-1.5s", count: 31 }, { time: "1.5-2s", count: 18 },
    { time: "2-3s", count: 7 }, { time: ">3s", count: 3 },
  ];

  const modelKeys = ["GPT-4", "Claude", "Gemini"];
  const enabledModels = llmKeys.length;
  const modelUsage = modelKeys.map((name, i) => ({
    name,
    value: name === "GPT-4" ? 45 : name === "Claude" ? 35 : 20,
    color: ["#4f46e5", "#7c3aed", "#3b82f6"][i],
  }));

  const topPerformingAgents = agents.slice(0, 5).map((a) => ({
    name: a.name, conversations: a.conversations || 0,
    avgMessages: Math.round(((a.conversations || 0) / (activeAgents || 1)) * 10) / 10,
    satisfaction: [96, 93, 91, 95, 89][agents.indexOf(a) % 5],
    trend: agents.indexOf(a) % 2 === 0 ? "up" as const : "down" as const,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track your chatbot performance and usage metrics</p>
        </div>
        <div className="flex gap-2">
          {dateRanges.map((range) => (
            <Button key={range} variant={dateRange === range ? "default" : "outline"} size="sm" onClick={() => setDateRange(range)}>
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {typeof stat.value === "number" ? formatNumber(stat.value) : stat.value}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {stat.up ? <ArrowUp className="h-3 w-3 text-emerald-500" /> : <ArrowDown className="h-3 w-3 text-red-500" />}
                <span className="text-emerald-500">{stat.change}</span>
                <span className="text-slate-400 dark:text-slate-500">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Messages Over Time</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={messagesOverTime}>
                  <defs><linearGradient id="msgsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} /><stop offset="95%" stopColor="#4f46e5" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="messages" stroke="#4f46e5" strokeWidth={2} fill="url(#msgsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Agents by Conversations</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topAgents} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={130} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }} />
                  <Bar dataKey="conversations" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Response Time Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} dot={{ fill: "#4f46e5", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Model Usage Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v: unknown) => `${Number(v) || 0}%`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                    formatter={(value: unknown) => [`${Number(value) || 0}%`, "Usage"]} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {modelUsage.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              {modelUsage.map((m) => (
                <div key={m.name} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{m.name} ({m.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {Object.keys(nodeStats).length > 0 && (
        <Card>
          <CardHeader><CardTitle>Node Usage in Flow Editor</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {Object.entries(nodeColors).map(([type, color]) => {
                const count = nodeStats[type] || 0;
                if (count === 0) return null;
                return (
                  <div key={type} className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 p-3 min-w-[140px]">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">{type.replace("-", " ")}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{count} nodes added</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Top Performing Agents</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Agent</th>
                  <th className="pb-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Conversations</th>
                  <th className="pb-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Avg Messages</th>
                  <th className="pb-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Satisfaction</th>
                  <th className="pb-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topPerformingAgents.map((agent) => (
                  <tr key={agent.name} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{agent.name}</td>
                    <td className="py-3 text-right text-sm text-slate-600 dark:text-slate-400">{formatNumber(agent.conversations)}</td>
                    <td className="py-3 text-right text-sm text-slate-600 dark:text-slate-400">{agent.avgMessages}</td>
                    <td className="py-3 text-right">
                      <Badge variant={agent.satisfaction >= 93 ? "default" : "secondary"}>{agent.satisfaction}%</Badge>
                    </td>
                    <td className="py-3 text-right">
                      {agent.trend === "up" ? <ArrowUp className="inline h-4 w-4 text-emerald-500" /> : <ArrowDown className="inline h-4 w-4 text-red-500" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}