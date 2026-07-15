# AgentFlow

**MVP 1** — Visual AI chatbot builder with drag-and-drop flow editor, multi-model support, and real-time conversation testing.

**Author:** [Raja Abbas Affandi](https://www.linkedin.com/in/raja-abbas-affandi)

---

## What It Does

Build, test, and deploy AI chatbots without writing code.

- **Visual Flow Editor** — Drag-and-drop nodes to design conversation flows with triggers, AI responses, conditions, and API calls
- **Multi-Model Support** — Connect to OpenAI GPT-4, Claude, and Gemini
- **Real-time Testing** — Test your chatbot flows in real-time with a built-in chat interface
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
| Flow Editor | React Flow v11 |
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
│   │   ├── dashboard/page.tsx    # Dashboard overview with charts
│   │   ├── agents/page.tsx       # Agent management
│   │   ├── flows/page.tsx        # Visual flow editor
│   │   ├── conversations/page.tsx # Chat interface
│   │   ├── analytics/page.tsx    # Analytics dashboard
│   │   └── settings/page.tsx     # Settings & API keys
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── layout/                   # Sidebar, header, dashboard layout
│   └── ui/                       # Reusable UI components
└── lib/
    ├── db.ts                     # Prisma client
    └── utils.ts                  # Utilities
```

## License

MIT License — Copyright (c) 2026 Raja Abbas Affandi
