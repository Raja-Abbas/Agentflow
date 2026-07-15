"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";

const dateRanges = ["Last 7 days", "Last 30 days", "Last 90 days"] as const;

const stats = [
  {
    label: "Total Messages",
    value: 12450,
    change: "+12.5%",
    up: true,
    icon: BarChart3,
  },
  {
    label: "Avg Response Time",
    value: "1.2s",
    change: "-8.3%",
    up: false,
    icon: Clock,
  },
  {
    label: "Satisfaction Rate",
    value: "94%",
    change: "+2.1%",
    up: true,
    icon: TrendingUp,
  },
  {
    label: "Active Users",
    value: 847,
    change: "+18.7%",
    up: true,
    icon: Users,
  },
];

const messagesOverTime = [
  { day: "Mon", messages: 1420 },
  { day: "Tue", messages: 1680 },
  { day: "Wed", messages: 1950 },
  { day: "Thu", messages: 1740 },
  { day: "Fri", messages: 2100 },
  { day: "Sat", messages: 1320 },
  { day: "Sun", messages: 1240 },
];

const topAgents = [
  { name: "Customer Support", conversations: 3240 },
  { name: "Sales Assistant", conversations: 2180 },
  { name: "FAQ Bot", conversations: 1850 },
  { name: "Onboarding Guide", conversations: 1420 },
  { name: "Feedback Collector", conversations: 980 },
];

const responseTimeDistribution = [
  { time: "<0.5s", count: 2400 },
  { time: "0.5-1s", count: 4200 },
  { time: "1-1.5s", count: 3100 },
  { time: "1.5-2s", count: 1800 },
  { time: "2-3s", count: 700 },
  { time: ">3s", count: 250 },
];

const modelUsage = [
  { name: "GPT-4", value: 45, color: "#4f46e5" },
  { name: "Claude", value: 35, color: "#7c3aed" },
  { name: "Gemini", value: 20, color: "#3b82f6" },
];

const topPerformingAgents = [
  {
    name: "Customer Support",
    conversations: 3240,
    avgMessages: 8.2,
    satisfaction: 96,
    trend: "up",
  },
  {
    name: "Sales Assistant",
    conversations: 2180,
    avgMessages: 12.4,
    satisfaction: 93,
    trend: "up",
  },
  {
    name: "FAQ Bot",
    conversations: 1850,
    avgMessages: 3.1,
    satisfaction: 91,
    trend: "down",
  },
  {
    name: "Onboarding Guide",
    conversations: 1420,
    avgMessages: 6.7,
    satisfaction: 95,
    trend: "up",
  },
  {
    name: "Feedback Collector",
    conversations: 980,
    avgMessages: 4.5,
    satisfaction: 89,
    trend: "up",
  },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<string>("Last 7 days");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Track your chatbot performance and usage metrics
          </p>
        </div>
        <div className="flex gap-2">
          {dateRanges.map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {typeof stat.value === "number"
                  ? formatNumber(stat.value)
                  : stat.value}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {stat.up ? (
                  <ArrowUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-emerald-500" />
                )}
                <span className="text-emerald-500">{stat.change}</span>
                <span className="text-slate-400">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Messages Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={messagesOverTime}>
                  <defs>
                    <linearGradient id="messagesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fill="url(#messagesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Agents by Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topAgents} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    width={130}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="conversations" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ fill: "#4f46e5", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Usage Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number) => [`${value}%`, "Usage"]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {modelUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              {modelUsage.map((model) => (
                <div key={model.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: model.color }}
                  />
                  <span className="text-slate-600">
                    {model.name} ({model.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-left text-sm font-medium text-slate-500">
                    Agent
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-slate-500">
                    Conversations
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-slate-500">
                    Avg Messages
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-slate-500">
                    Satisfaction
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-slate-500">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {topPerformingAgents.map((agent) => (
                  <tr
                    key={agent.name}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-3 text-sm font-medium text-slate-900">
                      {agent.name}
                    </td>
                    <td className="py-3 text-right text-sm text-slate-600">
                      {formatNumber(agent.conversations)}
                    </td>
                    <td className="py-3 text-right text-sm text-slate-600">
                      {agent.avgMessages}
                    </td>
                    <td className="py-3 text-right">
                      <Badge
                        variant={agent.satisfaction >= 93 ? "default" : "secondary"}
                      >
                        {agent.satisfaction}%
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      {agent.trend === "up" ? (
                        <ArrowUp className="inline h-4 w-4 text-emerald-500" />
                      ) : (
                        <ArrowDown className="inline h-4 w-4 text-red-500" />
                      )}
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
