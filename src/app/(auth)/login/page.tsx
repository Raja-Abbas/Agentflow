"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Rocket } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  function startDemo() {
    localStorage.setItem("af_demo_user", JSON.stringify({ name: "Demo User", email: "demo@agentflow.app" }));
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4"><Logo /></div>
          <CardTitle className="text-2xl">Welcome to AgentFlow</CardTitle>
          <CardDescription>Try the fully functional demo — no sign-up needed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button size="lg" className="w-full gap-2" onClick={startDemo}>
            <Rocket className="h-5 w-5" />
            Continue as Demo User
          </Button>

          <div className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30 p-4 text-sm">
            <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">AgentFlow Demo</p>
            <p className="text-indigo-600 dark:text-indigo-400 text-xs leading-relaxed">
              You are entering a fully functional demo. All data is stored in your browser via localStorage. 
              No server-side authentication or database required. Everything runs client-side.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
