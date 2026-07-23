"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import {
  Bot,
  MessageSquare,
  Send,
  GitBranch,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

const stats = [
  { label: "Total Agents", value: 12, icon: Bot, color: "text-indigo-600" },
  {
    label: "Total Conversations",
    value: 1847,
    icon: MessageSquare,
    color: "text-blue-600",
  },
  {
    label: "Messages Today",
    value: 342,
    icon: Send,
    color: "text-green-600",
  },
  {
    label: "Active Flows",
    value: 8,
    icon: GitBranch,
    color: "text-purple-600",
  },
];

const conversationData = [
  { day: "Mon", conversations: 180 },
  { day: "Tue", conversations: 220 },
  { day: "Wed", conversations: 195 },
  { day: "Thu", conversations: 260 },
  { day: "Fri", conversations: 230 },
  { day: "Sat", conversations: 150 },
  { day: "Sun", conversations: 112 },
];

const messageData = [
  { day: "Mon", messages: 420 },
  { day: "Tue", messages: 530 },
  { day: "Wed", messages: 480 },
  { day: "Thu", messages: 610 },
  { day: "Fri", messages: 550 },
  { day: "Sat", messages: 320 },
  { day: "Sun", messages: 280 },
];

const recentConversations = [
  { name: "Customer Support Bot", messages: 156, status: "Active" },
  { name: "Sales Qualifier", messages: 89, status: "Active" },
  { name: "FAQ Assistant", messages: 234, status: "Paused" },
  { name: "Lead Generator", messages: 67, status: "Active" },
  { name: "Onboarding Helper", messages: 45, status: "Draft" },
];

function statusVariant(status: string) {
  switch (status) {
    case "Active":
      return "default";
    case "Paused":
      return "secondary";
    case "Draft":
      return "outline";
    default:
      return "default";
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-slate-100">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Overview of your AI agents</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-slate-100">
                {formatNumber(stat.value)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversations over last 7 days</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="conversations"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages over last 7 days</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="messages"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ fill: "#4f46e5" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConversations.map((conversation) => (
                <div
                  key={conversation.name}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
                      <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-slate-100">{conversation.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {conversation.messages} messages
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusVariant(conversation.status) as "default" | "secondary" | "destructive" | "outline"}>
                    {conversation.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-between" asChild>
              <a href="/agents">
                Create Agent
                <Plus className="h-4 w-4" />
              </a>
            </Button>
            <Button
              className="w-full justify-between"
              variant="outline"
              asChild
            >
              <a href="/flows">
                Build Flow
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              className="w-full justify-between"
              variant="outline"
              asChild
            >
              <a href="/analytics">
                View Analytics
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
