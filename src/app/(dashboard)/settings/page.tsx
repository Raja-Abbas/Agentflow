"use client";

import { useState, useEffect } from "react";
import {
  User,
  Key,
  Bell,
  CreditCard,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Shield,
  Check,
  AlertTriangle,
  Brain,
  Save,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { formatNumber } from "@/lib/utils";

const apiKeys = [
  {
    id: "1",
    name: "Production Key",
    key: "af_****...****3x9k",
    status: "active" as const,
    lastUsed: "2h ago",
  },
  {
    id: "2",
    name: "Development Key",
    key: "af_****...****7m2p",
    status: "active" as const,
    lastUsed: "1d ago",
  },
  {
    id: "3",
    name: "Testing Key",
    key: "af_****...****9q4w",
    status: "inactive" as const,
    lastUsed: "Never",
  },
];

const notifications = [
  {
    id: "email",
    label: "Email notifications",
    description: "Receive email updates about your account activity",
    default: true,
  },
  {
    id: "alerts",
    label: "Agent alerts",
    description: "Get notified when agents encounter errors or need attention",
    default: true,
  },
  {
    id: "weekly",
    label: "Weekly reports",
    description: "Receive a weekly summary of your chatbot performance",
    default: true,
  },
  {
    id: "marketing",
    label: "Marketing emails",
    description: "Receive tips, product updates, and inspiration",
    default: false,
  },
];

export default function SettingsPage() {
  const [name, setName] = useState("Raja Abbas");
  const [email, setEmail] = useState("raja@agentflow.dev");
  const [keys, setKeys] = useState(apiKeys);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState("");
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    notifications.forEach((n) => {
      initial[n.id] = n.default;
    });
    return initial;
  });
  const [llmKeys, setLlmKeys] = useState<Record<string, string>>({ openai: "", anthropic: "", gemini: "" });
  const [showKeySaveSuccess, setShowKeySaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("af_llm_keys") || "{}");
      setLlmKeys({ openai: saved.openai || "", anthropic: saved.anthropic || "", gemini: saved.gemini || "" });
    } catch {}
  }, []);

  const saveLlmKeys = () => {
    localStorage.setItem("af_llm_keys", JSON.stringify(llmKeys));
    setShowKeySaveSuccess(true);
    setTimeout(() => setShowKeySaveSuccess(false), 2000);
  };

  const handleGenerateKey = () => {
    const key = `af_${Array.from({ length: 40 }, () =>
      "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
    ).join("")}`;
    setNewKeyValue(key);
    setShowNewKeyDialog(true);
  };

  const handleDeleteKey = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const toggleNotification = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="text-sm text-slate-500">
          Manage your account and preferences
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="gap-2">
            <Key className="h-4 w-4" /> API Keys
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" /> Billing
          </TabsTrigger>
          <TabsTrigger value="ai-models" className="gap-2">
            <Brain className="h-4 w-4" /> AI Models
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information and avatar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                  RA
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Upload avatar
                  </Button>
                  <p className="mt-1 text-xs text-slate-500">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for external integrations
                </CardDescription>
              </div>
              <Button size="sm" className="gap-2" onClick={handleGenerateKey}>
                <Plus className="h-4 w-4" /> Generate New Key
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                        <Shield className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">
                            {apiKey.name}
                          </span>
                          <Badge
                            variant={
                              apiKey.status === "active" ? "default" : "secondary"
                            }
                          >
                            {apiKey.status}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">
                            {apiKey.key}
                          </code>
                          <span>Last used: {apiKey.lastUsed}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteKey(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4 text-slate-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {notifications.map((notification) => (
                  <div key={notification.id}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-900">
                          {notification.label}
                        </p>
                        <p className="text-sm text-slate-500">
                          {notification.description}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleNotification(notification.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                          toggles[notification.id]
                            ? "bg-indigo-600"
                            : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                            toggles[notification.id]
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    {notification.id !== "marketing" && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50 p-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900">Pro</h3>
                      <Badge>Current plan</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      $29/month &middot; Renews on Aug 15, 2026
                    </p>
                  </div>
                  <Button variant="outline">Manage subscription</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>
                  Your current billing period usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Messages</span>
                    <span className="font-medium text-slate-900">
                      {formatNumber(8450)} / {formatNumber(10000)}
                    </span>
                  </div>
                  <Progress value={84.5} />
                  <p className="text-xs text-slate-500">
                    84.5% used &middot; {formatNumber(1550)} messages remaining
                  </p>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Chatbots</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">7 / 10</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Team members</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">3 / 5</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Storage</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">2.1 GB / 10 GB</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <AlertTriangle className="h-4 w-4" /> Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-models">
          <Card>
            <CardHeader>
              <CardTitle>AI Model API Keys</CardTitle>
              <CardDescription>
                Your API keys are stored locally in your browser and never sent to our servers. 
                They are used to make direct calls from your browser to the AI provider.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  value={llmKeys.openai}
                  onChange={(e) => setLlmKeys((prev) => ({ ...prev, openai: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                <Input
                  id="anthropic-key"
                  type="password"
                  placeholder="sk-ant-..."
                  value={llmKeys.anthropic}
                  onChange={(e) => setLlmKeys((prev) => ({ ...prev, anthropic: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gemini-key">Google Gemini API Key</Label>
                <Input
                  id="gemini-key"
                  type="password"
                  placeholder="AIza..."
                  value={llmKeys.gemini}
                  onChange={(e) => setLlmKeys((prev) => ({ ...prev, gemini: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={saveLlmKeys} className="gap-2">
                  <Save className="h-4 w-4" /> Save Keys
                </Button>
                {showKeySaveSuccess && (
                  <Badge variant="default" className="gap-1 bg-emerald-500">
                    <CheckCircle2 className="h-3 w-3" /> Keys saved
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New API Key Generated</DialogTitle>
            <DialogDescription>
              Copy your new API key now. You won&apos;t be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <code className="block w-full rounded-lg border border-slate-200 bg-slate-50 p-3 pr-20 font-mono text-sm break-all">
              {newKeyValue}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 gap-1"
              onClick={() => navigator.clipboard.writeText(newKeyValue)}
            >
              <Copy className="h-3 w-3" /> Copy
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>I&apos;ve copied the key</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
