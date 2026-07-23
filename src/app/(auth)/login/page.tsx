"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Rocket, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent, demo?: boolean) {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    const creds = demo ? { email: "demo@agentflow.app", password: "demo123456" } : { email, password };
    const result = await signIn("credentials", { ...creds, redirect: false });
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4"><Logo /></div>
          <CardTitle className="text-2xl">Welcome to AgentFlow</CardTitle>
          <CardDescription>Build AI chatbots visually, no code required</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={() => handleSubmit(undefined as any, true)}
            disabled={loading}
          >
            <Rocket className="h-5 w-5" />
            {loading ? "Signing in..." : "Continue as Demo User"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-700" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-950 px-2 text-slate-400">or sign in manually</span></div>
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
            {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>Sign In</Button>
          </form>

          <div className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30 p-4 text-sm">
            <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">Demo Credentials</p>
            <p className="text-indigo-600 dark:text-indigo-400">Email: <code className="bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 rounded">demo@agentflow.app</code></p>
            <p className="text-indigo-600 dark:text-indigo-400">Password: <code className="bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 rounded">demo123456</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
