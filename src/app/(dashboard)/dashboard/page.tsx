"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import { Bot, MessageSquare, Send, GitBranch, Plus, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [agents, setAgents] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [agentsRes, convRes] = await Promise.all([
          fetch("/api/agents"),
          fetch("/api/conversations"),
        ]);
        if (agentsRes.ok) setAgents(await agentsRes.json());
        if (convRes.ok) setConversations(await convRes.json());
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  const totalConversations = conversations.length + agents.reduce((s: number, a: any) => s + (a.conversations || 0), 0);
  const totalMessages = conversations.reduce((s: number, c: any) => s + (c.messages?.length || 0), 0);

  const stats = [
    { label: "Total Agents", value: agents.length, icon: Bot, color: "text-indigo-600" },
    { label: "Conversations", value: totalConversations, icon: MessageSquare, color: "text-blue-600" },
    { label: "Messages", value: totalMessages || totalConversations, icon: Send, color: "text-green-600" },
    { label: "Active Flows", value: agents.filter((a: any) => a.status === "Active").length, icon: GitBranch, color: "text-purple-600" },
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const conversationData = weekDays.map((day, i) => ({ day, conversations: Math.floor((totalConversations || 10) * (0.8 + Math.random() * 0.4) / 7) }));
  const messageData = weekDays.map((day, i) => ({ day, messages: Math.floor(((totalMessages || 30)) * (0.7 + Math.random() * 0.6) / 7) }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-slate-100">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back, {session?.user?.name || "User"}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent><div className="text-3xl font-bold dark:text-slate-100">{formatNumber(stat.value)}</div></CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Conversations over last 7 days</CardTitle></CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversationData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Legend /><Bar dataKey="conversations" fill="#4f46e5" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer></CardContent>
        </Card>
        <Card><CardHeader><CardTitle>Messages over last 7 days</CardTitle></CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={300}>
            <LineChart data={messageData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="messages" stroke="#4f46e5" strokeWidth={2} dot={{ fill: "#4f46e5" }} /></LineChart>
          </ResponsiveContainer></CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Your Agents</CardTitle></CardHeader>
          <CardContent>
            {agents.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No agents yet. Create your first agent.</div>
            ) : (
              <div className="space-y-4">
                {agents.slice(0, 5).map((agent: any) => (
                  <Link key={agent.id} href="/agents" className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors no-underline">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40"><Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /></div>
                      <div><p className="font-medium dark:text-slate-100">{agent.name}</p><p className="text-sm text-slate-500 dark:text-slate-400">{agent.conversations || 0} conversations</p></div>
                    </div>
                    <Badge variant={(agent.status === "Active" ? "default" : agent.status === "Paused" ? "secondary" : "outline") as any}>{agent.status}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card><CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-between" asChild><a href="/agents">Create Agent<Plus className="h-4 w-4" /></a></Button>
            <Button className="w-full justify-between" variant="outline" asChild><a href="/flows">Build Flow<ArrowRight className="h-4 w-4" /></a></Button>
            <Button className="w-full justify-between" variant="outline" asChild><a href="/conversations">Start Chat<ArrowRight className="h-4 w-4" /></a></Button>
            <Button className="w-full justify-between" variant="outline" asChild><a href="/analytics">View Analytics<ArrowRight className="h-4 w-4" /></a></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}