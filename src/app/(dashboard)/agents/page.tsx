"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/utils";
import {
  Bot,
  MessageSquare,
  Pencil,
  Trash2,
  Plus,
  Search,
} from "lucide-react";

const agents = [
  {
    id: 1,
    name: "Customer Support Bot",
    description: "Handles customer inquiries 24/7",
    model: "GPT-4",
    status: "Active",
    conversations: 156,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Sales Qualifier",
    description: "Qualifies leads and books meetings",
    model: "Claude",
    status: "Active",
    conversations: 89,
    lastActive: "5 minutes ago",
  },
  {
    id: 3,
    name: "FAQ Assistant",
    description: "Answers frequently asked questions",
    model: "GPT-4",
    status: "Paused",
    conversations: 234,
    lastActive: "1 day ago",
  },
  {
    id: 4,
    name: "Lead Generator",
    description: "Captures and qualifies new leads",
    model: "Gemini",
    status: "Active",
    conversations: 67,
    lastActive: "30 minutes ago",
  },
  {
    id: 5,
    name: "Onboarding Helper",
    description: "Guides new users through setup",
    model: "GPT-4",
    status: "Active",
    conversations: 45,
    lastActive: "3 hours ago",
  },
  {
    id: 6,
    name: "Code Reviewer",
    description: "Reviews code PRs and suggests improvements",
    model: "Claude",
    status: "Active",
    conversations: 23,
    lastActive: "1 hour ago",
  },
  {
    id: 7,
    name: "Data Analyst",
    description: "Answers questions about your data",
    model: "GPT-4",
    status: "Draft",
    conversations: 0,
    lastActive: "Never",
  },
  {
    id: 8,
    name: "Content Writer",
    description: "Generates blog posts and social content",
    model: "Gemini",
    status: "Active",
    conversations: 12,
    lastActive: "5 hours ago",
  },
];

const filters = [
  { label: "All", count: 12 },
  { label: "Active", count: 8 },
  { label: "Paused", count: 2 },
  { label: "Draft", count: 2 },
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

function modelColor(model: string) {
  switch (model) {
    case "GPT-4":
      return "bg-green-100 text-green-700";
    case "Claude":
      return "bg-orange-100 text-orange-700";
    case "Gemini":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
  }
}

export default function AgentsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = agents.filter((agent) => {
    const matchesFilter =
      activeFilter === "All" || agent.status === activeFilter;
    const matchesSearch = agent.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-slate-100">Agents</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your AI agents</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search agents..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.label}
              variant={activeFilter === filter.label ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.label)}
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-4 text-lg font-medium">No agents found</h3>
            <p className="text-sm text-slate-500">
              Try adjusting your search or filter to find what you&apos;re
              looking for.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="transition-shadow hover:shadow-md dark:hover:shadow-slate-800/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
                      <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{agent.name}</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant={statusVariant(agent.status) as "default" | "secondary" | "destructive" | "outline"}>
                    {agent.status}
                  </Badge>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${modelColor(agent.model)}`}
                  >
                    {agent.model}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 mb-4 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    <span>{formatNumber(agent.conversations)} conversations</span>
                  </div>
                  <span>Last active: {agent.lastActive}</span>
                </div>

                <div className="flex items-center gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
                  <Button variant="ghost" size="icon" title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Chat">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
