"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumber } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { Bot, MessageSquare, Pencil, Trash2, Plus, Search } from "lucide-react";

interface Agent {
  id: string; name: string; description: string; model: string; status: string; conversations: number; lastActive: string;
}

const filters = ["All", "Active", "Paused", "Draft"];

function statusVariant(status: string) {
  switch (status) { case "Active": return "default"; case "Paused": return "secondary"; case "Draft": return "outline"; default: return "default"; }
}

function modelColor(model: string) {
  switch (model) { case "GPT-4": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"; case "Claude": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"; case "Gemini": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"; default: return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"; }
}

export default function AgentsPage() {
  const { data: session } = useSession();
  const [agentList, setAgentList] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [form, setForm] = useState({ name: "", description: "", model: "GPT-4", status: "Active" });

  async function loadAgents() {
    try {
      const res = await fetch("/api/agents");
      if (res.ok) {
        const data = await res.json();
        setAgentList(data.map((a: any) => ({ ...a, conversations: 0, lastActive: "Now" })));
      }
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { loadAgents(); }, []);

  function openCreate() { setEditingAgent(null); setForm({ name: "", description: "", model: "GPT-4", status: "Active" }); setDialogOpen(true); }
  function openEdit(agent: Agent) { setEditingAgent(agent); setForm({ name: agent.name, description: agent.description, model: agent.model, status: agent.status }); setDialogOpen(true); }

  async function saveAgent() {
    if (!form.name.trim()) return;
    try {
      if (editingAgent) {
        const res = await fetch("/api/agents", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingAgent.id, ...form }) });
        if (res.ok) loadAgents();
      } else {
        const res = await fetch("/api/agents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (res.ok) loadAgents();
      }
    } catch {}
    setDialogOpen(false);
  }

  async function deleteAgent(id: string) {
    if (!confirm("Delete this agent?")) return;
    try {
      await fetch("/api/agents", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      loadAgents();
    } catch {}
  }

  const filteredAgents = agentList.filter((agent) => {
    const matchesFilter = activeFilter === "All" || agent.status === activeFilter;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterCounts = filters.map((f) => ({
    label: f, count: f === "All" ? agentList.length : agentList.filter((a) => a.status === f).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-slate-100">Agents</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your AI agents</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Create Agent</Button>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search agents..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {filterCounts.map((f) => (
            <Button key={f.label} variant={activeFilter === f.label ? "default" : "outline"} size="sm" onClick={() => setActiveFilter(f.label)}>
              {f.label} ({f.count})
            </Button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : filteredAgents.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-12">
          <Bot className="h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="mt-4 text-lg font-medium">No agents found</h3>
          <p className="text-sm text-slate-500">Create your first agent to get started.</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="transition-shadow hover:shadow-md dark:hover:shadow-slate-800/50">
              <CardHeader className="pb-3"><div className="flex items-start justify-between"><div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
                  <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div><CardTitle className="text-base">{agent.name}</CardTitle><p className="text-sm text-slate-500 dark:text-slate-400">{agent.description}</p></div>
              </div></div></CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant={statusVariant(agent.status) as any}>{agent.status}</Badge>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${modelColor(agent.model)}`}>{agent.model}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4 dark:text-slate-400">
                  <span>{formatNumber(agent.conversations || 0)} conversations</span>
                  <span>Last active: {agent.lastActive}</span>
                </div>
                <div className="flex items-center gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
                  <Button variant="ghost" size="icon" title="Edit" onClick={() => openEdit(agent)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="Chat" onClick={() => window.location.href = `/conversations?agent=${encodeURIComponent(agent.name)}`}><MessageSquare className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="Delete" className="text-red-500 hover:text-red-600" onClick={() => deleteAgent(agent.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingAgent ? "Edit Agent" : "Create Agent"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="My Agent" /></div>
            <div className="space-y-2"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does this agent do?" /></div>
            <div className="space-y-2"><Label>Model</Label>
              <Select label="" options={[{ value: "GPT-4", label: "GPT-4" }, { value: "Claude", label: "Claude" }, { value: "Gemini", label: "Gemini" }]} value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
            </div>
            <div className="space-y-2"><Label>Status</Label>
              <Select label="" options={[{ value: "Active", label: "Active" }, { value: "Paused", label: "Paused" }, { value: "Draft", label: "Draft" }]} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
            </div>
          </div>
          <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={saveAgent}>{editingAgent ? "Save" : "Create"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}