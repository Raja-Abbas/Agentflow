# AgentFlow

**MVP 1** — Visual AI chatbot builder with drag-and-drop flow editor, undo/redo, onboarding walkthrough, resizable panels, multi-model support, live debug mode, versioning, voice input, live LLM calls (BYO API key), embeddable widget, node usage analytics, and dark mode.

**Author:** [Raja Abbas Affandi](https://www.linkedin.com/in/raja-abbas-affandi)

---

## What It Does

Build, test, and deploy AI chatbots without writing code.

- **Visual Flow Editor** — Drag-and-drop nodes to design conversation flows with triggers, AI responses, conditions, and API calls
- **Multi-Model Support** — Connect to OpenAI GPT-4, Claude, and Gemini
- **Flow Versioning** — Save snapshots of your flows, browse history, and restore any previous version
- **Live Debug Mode** — Step through each node in real time to trace decisions, see condition evaluations, and inspect AI response prompts
- **Voice Input** — Use speech-to-text to test flows hands-free with the built-in microphone button
- **Live LLM Calls** — Bring your own API key (OpenAI, Anthropic, Google). Calls go directly from your browser to the AI provider — zero cost to AgentFlow
- **Embeddable Widget** — Deploy your chatbot on any website with a single `<script>` tag. Floating chat button with popup
- **Flow Templates** — Start from pre-built flows (Customer Support, Lead Qualification, FAQ Bot)
- **Export/Import & Sharing** — Export flows as JSON, import from file, or share via encoded URL
- **Undo/Redo** — Full undo/redo support with Ctrl+Z/Y and toolbar buttons. Every action tracked: drag, drop, delete, edit, template load, import, version restore
- **Onboarding Walkthrough** — First-time visitors see a guided 5-step tour on first visit (dismissable, shown once)
- **Resizable Panels** — Drag handles between palette, canvas, and properties panels with adjustable widths
- **Node Usage Analytics** — Tracks which node types you use most, displayed as a color-coded breakdown in the Analytics page
- **Mobile Responsiveness** — Scrollable tables and fluid layout across all dashboard pages
- **Dark Mode** — Toggle in sidebar, full support across all pages
- **Agent Management** — Create, configure, and manage multiple AI agents
- **Conversation History** — Track and review all conversations across agents
- **Analytics Dashboard** — Monitor messages, response times, satisfaction rates, and agent performance
- **API Key Management** — Generate and manage API keys for integrations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| ORM | Prisma 7 + `@prisma/adapter-libsql` |
| Database | SQLite via `@libsql/client` |
| Flow Editor | Custom SVG with drag-and-drop |
| Charts | Recharts |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Design | Indigo/blue theme |
| Deployment | Netlify |

## Getting Started

```bash
git clone https://github.com/Raja-Abbas/agentflow.git
cd agentflow
npm install
npx prisma db push
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx     # Dashboard overview with charts
│   │   ├── agents/page.tsx        # Agent management
│   │   ├── flows/page.tsx         # Visual flow editor + debug + versioning
│   │   ├── conversations/page.tsx # Chat interface with live LLM calls
│   │   ├── analytics/page.tsx     # Analytics dashboard
│   │   └── settings/page.tsx      # Settings, API keys, AI model keys
│   ├── embed/page.tsx             # Embeddable chat widget page
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
├── components/
│   ├── layout/                    # Sidebar, header, dashboard layout
│   ├── ui/                        # Reusable UI components
│   └── theme-provider.tsx         # Dark mode provider
├── lib/
│   ├── db.ts                      # Prisma client
│   ├── llm.ts                    # LLM API service (OpenAI, Claude, Gemini)
│   └── utils.ts                   # Utilities
└── public/
    └── widget.js                  # Standalone embed script
```

## License

MIT License — Copyright (c) 2026 Raja Abbas Affandi
