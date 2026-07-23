"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Hexagon,
  Bot,
  GitBranch,
  MessageSquare,
  BarChart3,
  Rocket,
  Zap,
  Brain,
  TestTube,
  Clock,
  Globe,
  ArrowRight,
  Check,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";

const features = [
  {
    icon: GitBranch,
    title: "Visual Flow Editor",
    description:
      "Design conversation flows with an intuitive drag-and-drop interface. Connect nodes, set conditions, and build complex logic visually.",
  },
  {
    icon: Brain,
    title: "Multi-Model Support",
    description:
      "Connect to OpenAI, Gemini, and Claude. Switch between models per node or route conversations based on complexity.",
  },
  {
    icon: TestTube,
    title: "Real-time Testing",
    description:
      "Test your chatbot in real-time as you build. Debug conversations node by node and see exactly how your flow executes.",
  },
  {
    icon: MessageSquare,
    title: "Conversation History",
    description:
      "Access full conversation logs with user details, timestamps, and flow execution paths. Filter and search through history.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track conversations, response times, token usage, and user satisfaction with built-in analytics and exportable reports.",
  },
  {
    icon: Rocket,
    title: "Easy Deployment",
    description:
      "Deploy your chatbot with one click. Get an embeddable widget, shareable link, or API endpoint instantly.",
  },
];

const steps = [
  {
    step: "01",
    title: "Design your flow",
    description:
      "Use the visual editor to map out conversation paths. Add triggers, AI responses, conditions, and actions.",
    icon: GitBranch,
  },
  {
    step: "02",
    title: "Connect your AI model",
    description:
      "Plug in your OpenAI, Gemini, or Claude API key. Configure model parameters, system prompts, and temperature.",
    icon: Brain,
  },
  {
    step: "03",
    title: "Deploy and share",
    description:
      "Hit deploy and get a shareable link, embed code, or API endpoint. Your chatbot is live in seconds.",
    icon: Rocket,
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out AgentFlow",
    features: [
      "1 chatbot",
      "100 messages/month",
      "Visual flow editor",
      "Community support",
      "Basic analytics",
    ],
    cta: "Get started free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professionals building real chatbots",
    features: [
      "10 chatbots",
      "5,000 messages/month",
      "All AI models (OpenAI, Gemini, Claude)",
      "Advanced analytics",
      "Custom branding",
      "Priority support",
      "API access",
    ],
    cta: "Start Pro trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For teams and organizations",
    features: [
      "Unlimited chatbots",
      "50,000 messages/month",
      "All AI models",
      "Advanced analytics & reports",
      "Custom branding & domains",
      "SSO & team management",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    popular: false,
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "AgentFlow",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            description:
              "Build, test, and deploy AI chatbots with a visual drag-and-drop flow editor. Connect to OpenAI, Gemini, and Claude. No coding required.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started Free</Button>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 dark:border-slate-800 px-4 pb-4 md:hidden">
            <nav className="flex flex-col gap-2 pt-4">
              <a href="#features" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                Features
              </a>
              <a href="#how-it-works" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                How It Works
              </a>
              <a href="#pricing" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                Pricing
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 dark:from-slate-900 via-white dark:via-slate-950 to-blue-50 dark:to-indigo-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-100/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              <Zap className="mr-1 inline h-3 w-3" /> No code required
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
              Build AI chatbots{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                without writing code
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
              Design, test, and deploy intelligent chatbots with a visual drag-and-drop flow
              editor. Connect to OpenAI, Gemini, and Claude in minutes.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Start building <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Watch demo
              </Button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <a href="https://github.com/Raja-Abbas/Agentflow" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                Star on GitHub
              </a>
              <a href="https://www.producthunt.com/posts/agentflow" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor"><path d="M10.858 1.558L9.727 2.687a.5.5 0 0 0 0 .708l1.13 1.13a.5.5 0 0 0 .707 0l1.13-1.13a.5.5 0 0 0 0-.708l-1.13-1.13a.5.5 0 0 0-.707 0zm-5.656 5.656l-1.13 1.13a.5.5 0 0 0 0 .708l1.13 1.13a.5.5 0 0 0 .708 0l1.13-1.13a.5.5 0 0 0 0-.708l-1.13-1.13a.5.5 0 0 0-.708 0zm11.313 0l-1.13 1.13a.5.5 0 0 0 0 .708l1.13 1.13a.5.5 0 0 0 .708 0l1.13-1.13a.5.5 0 0 0 0-.708l-1.13-1.13a.5.5 0 0 0-.708 0zM10 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>
                #1 Product of the Day
              </a>
            </div>

            {/* Floating UI preview */}
            <div className="mx-auto mt-16 max-w-2xl">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-2xl shadow-indigo-500/10">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">AgentFlow Editor</span>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-center">
                    <Bot className="mx-auto h-6 w-6 text-indigo-600" />
                    <p className="mt-1 text-xs font-medium text-indigo-700">Greeting</p>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
                    <Brain className="mx-auto h-6 w-6 text-blue-600" />
                    <p className="mt-1 text-xs font-medium text-blue-700">AI Response</p>
                  </div>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center">
                    <MessageSquare className="mx-auto h-6 w-6 text-emerald-600" />
                    <p className="mt-1 text-xs font-medium text-emerald-700">Reply</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-center">
                  <div className="h-px w-3/4 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Everything you need to build smart chatbots
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              A complete toolkit for designing, testing, and deploying AI-powered conversations.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="group border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:border-slate-700 transition-shadow hover:shadow-lg hover:shadow-indigo-500/5">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                    <feature.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-slate-50 dark:bg-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Up and running in 3 steps
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Go from idea to deployed chatbot in minutes, not days.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-12 lg:grid-cols-3">
            {steps.map((item, i) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <item.icon className="h-8 w-8" />
                </div>
                <div className="absolute -top-4 right-0 text-right text-sm font-bold text-indigo-200 sm:right-4">
                  Step {item.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.description}</p>
                {i < steps.length - 1 && (
                  <div className="absolute top-8 hidden h-px w-full bg-slate-200 dark:bg-slate-700 lg:block" style={{ left: "60%" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${
                  plan.popular
                    ? "border-2 border-indigo-600 shadow-xl shadow-indigo-500/10"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most popular</Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">{plan.price}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <ul className="flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/dashboard" className="mt-8 block">
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-8 py-16 text-center sm:px-16">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-40" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Start building for free
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
                Join thousands of teams building AI chatbots with AgentFlow. No credit card required.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-700 hover:bg-indigo-50"
                  >
                    Get started free <ArrowRight className="ml-2 inline h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                  Talk to sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Logo />
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                Features
              </a>
              <a href="#pricing" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                Pricing
              </a>
              <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                Docs
              </a>
              <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                Blog
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-slate-400 dark:text-slate-500">
            © 2026 Raja Abbas Affandi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
