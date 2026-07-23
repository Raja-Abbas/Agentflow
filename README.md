# AgentFlow

**MVP 1** — Visual AI chatbot builder with drag-and-drop flow editor, live LLM calls (BYO key), collaborative editing, versioning, debug mode, voice input, embeddable widget, undo/redo, onboarding, resizable panels, node analytics, dark mode, and more.

**Author:** [Raja Abbas Affandi](https://www.linkedin.com/in/raja-abbas-affandi)

---

## What It Does

Build, test, and deploy AI chatbots without writing code.

### Flow Editor
- **Visual Flow Editor** — Custom SVG canvas with drag-and-drop nodes (triggers, AI responses, conditions, API calls)
- **Undo/Redo** — Ctrl+Z/Y or toolbar buttons for every action: drag, drop, delete, edit, template load, import, version restore
- **Resizable Panels** — Drag handles between palette, canvas, and properties panels (180–500px range)
- **Onboarding Walkthrough** — 5-step guided tour on first visit (dismissable, shown once)
- **Collaborative Editing** — BroadcastChannel syncs changes across open tabs in real time
- **Flow Templates** — 3 presets (Customer Support, Lead Qualification, FAQ Bot) + save your own as custom templates

### AI & LLM
- **Multi-Model Support** — Connect to OpenAI GPT-4, Anthropic Claude, and Google Gemini
- **Live LLM Calls** — BYO API key, calls go browser→AI provider directly — zero server cost
- **Live Debug Mode** — Step through each node, trace decisions, inspect AI prompt context, pick condition branches
- **Voice Input** — Web Speech API for hands-free testing in both conversations and debug mode

### Versioning & Sharing
- **Flow Versioning** — Save named snapshots, browse history, restore any previous version
- **Export/Import** — Download flows as JSON or import from file
- **Share via URL** — Encode entire flow in a shareable link

### Deploy
- **Embeddable Widget** — Drop a single `<script>` tag on any website for a floating chat button with popup
- **Dark Mode** — Full support across all pages via sidebar toggle

### Analytics & Management
- **Node Usage Analytics** — Tracks which node types you use most, displayed as color-coded breakdown
- **Agent Management** — Create, configure multiple AI agents with model, temperature, system prompt
- **Conversation History** — Track and review all conversations
- **Analytics Dashboard** — Messages, response times, satisfaction, agent performance charts
- **Settings** — AI Models tab with masked API key inputs, billing, notifications

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
