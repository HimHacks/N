# Global Virtual Hackathon: Project Blueprint & Token-Efficient Protocol

## Permanent Master Prompt & Core Directive
> **Standard:** Meticulously crafted, production-grade engineering—zero "vibe-coded" shortcuts, zero bloated files, and zero generic AI UI templates. Every file has one clear responsibility, strict TypeScript types (zero `any`), zero-trust database security with Row-Level Security (RLS), and a handcrafted, bespoke visual direction.

---

## Plugin Coordination & Token Efficiency Architecture

| Plugin / Tool | Designated Role | Token-Efficiency Guardrail |
| :--- | :--- | :--- |
| **Context7** | Framework & Library Docs | Query only target symbols & exact version API signatures; prevent hallucinating deprecated APIs. |
| **Google Developer Knowledge** | Gemini API / Google Cloud specs | Targeted keyword queries for exact parameters, SDK types, and structured outputs. |
| **Superpowers** | Architecture, Planning & Review | Enforce strict phase gates (Brainstorm -> Plan -> TDD -> Review); prevent uncontrolled iteration loops. |
| **Supabase (MCP / CLI)** | Schema & Zero-Trust Security | Fetch live schema metadata; design normalized schemas with indexing & RLS policies for judge safety. |
| **Chrome DevTools** | Performance, A11y, Layout Audits | Run targeted audits post-build to ensure smooth 60fps animations and accessible design. |
| **CodeRabbit** | Static Review & Linting | Catch anti-patterns and performance bottlenecks before any commit to `main`. |
| **Vercel CLI** | Build & Deployment | Edge caching, fast previews, and zero-downtime production deployment. |

---

## Phase 1 Blueprint: Architecture, Security & Design

### 1. Workspace & Docs Audit
- **Repository:** `Global-Virtual-Hackathon-repo` (Git branch: `main`, clean tree).
- **Environment:** Node.js `v24.19.0`, npm `11.17.0`, Windows OS.
- **Framework Target:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + Lucide Icons + Supabase SSR (`@supabase/ssr`).
- **Google GenAI Target:** `@google/genai` (official modern SDK).

### 2. Modular Engineering Architecture (`/src` or root)
```text
src/
├── app/                  # Next.js App Router (pages, layout, route handlers)
│   ├── (auth)/           # Authenticated & judge preview routes
│   ├── api/              # Secure backend Route Handlers with validation
│   ├── layout.tsx        # Root layout with fonts, metadata, providers
│   └── page.tsx          # High-impact landing page & interactive demo
├── components/           # UI Components
│   ├── ui/               # Atomic design primitives (buttons, inputs, cards)
│   ├── layout/           # Navigation, footer, hero banners
│   └── features/         # Domain-specific interactive widgets
├── lib/                  # Infrastructure & Shared Utilities
│   ├── supabase/         # Typed SSR client & server helpers
│   ├── gemini/           # Gemini API client & prompt orchestration
│   └── utils/            # Styling (cn), formatters, constants
├── hooks/                # Custom React hooks (isolated business logic)
├── types/                # Strict TypeScript interfaces & database types (Zero `any`)
└── schemas/              # Zod validation schemas for forms & API payloads
```

### 3. Database & Zero-Trust Security (Supabase PostgreSQL)
- **RLS Everywhere:** `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;` on every single table.
- **Judge / Anonymous Sandbox Isolation:** Public judges get test accounts or scoped session IDs that can interact with the app without overwriting or viewing other judges' submissions.
- **Foreign Keys & Cascades:** Explicit referential integrity on all relational tables.
- **Indexes:** B-tree indexes on foreign keys, `user_id`, `created_at`, and query filters.

### 4. Bespoke Visual Design System
- **Theme:** *"Unveiling Technology"* — Tech-forward, atmospheric dark/light mode with deep slate accents, precision borders, glow accents, and monospace code typography.
- **Typography:** `Inter` / `Geist Sans` for UI prose, `JetBrains Mono` / `Geist Mono` for technical data and code.
- **Micro-Interactions:** Fluid CSS transitions, hover elevations, and responsive loading skeletons for zero layout shift.


---

## Phase 2: Parallel Execution, Review & Live Launch

> **Execution Protocol:** Coordinate parallel workers via `@mentions` and do not mark the task complete until the Verifier passes every check.

1. **@db-architect (`Supabase` + `Context7`):**
   - Apply the SQL migrations, indexes, and strict Row-Level Security (RLS) policies in Supabase.
   - Generate accurate TypeScript database types and build a clean, isolated data-access layer with full error handling and input validation.

2. **@ui-craftsman (`Context7` + `Gemini API` if needed):**
   - Build the frontend components strictly following our Phase 1 design tokens and modular file structure.
   - Implement skeleton loading states, graceful error boundaries, keyboard accessibility, and responsive layouts across desktop and mobile. Keep components small, pure, and readable.

3. **@staff-reviewer (`CodeRabbit` + `Superpowers`):**
   - Run a `CodeRabbit` audit across all newly written code.
   - Flag and refactor any security vulnerabilities, exposed secrets, N+1 queries, race conditions, dead code, or messy logic until the diff is spotless.

4. **@qa-verifier (`Chrome DevTools`):**
   - Start the local dev server and open the live app using `Chrome DevTools`.
   - Test the full user journey end-to-end, inspect the Console and Network tabs to confirm zero runtime errors or failed Supabase requests, and verify visual alignment.

5. **@release-lead (`Vercel`):**
   - Write a crisp, judge-ready `README.md` featuring the problem statement, system architecture overview, tech stack, and local setup steps.
   - Verify environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc. — never hardcoded), deploy the build to `Vercel`, and confirm the live public `.vercel.app` URL responds cleanly.
