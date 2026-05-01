# Pannly — frontend

Next.js 16 (App Router) UI. Runs on its own — no shared root tooling, no monorepo. Pair with the `backend/` API in a separate terminal.

## Stack

- Next.js 16.2 LTS, React 19, TypeScript
- Tailwind CSS v4 (CSS-first `@theme` config)
- shadcn/ui (added phase by phase)
- React Hook Form + Zod for forms
- [`pnpm`](https://pnpm.io/) as the package manager

## Prerequisites

| What | How |
|---|---|
| Node.js 22 LTS | <https://nodejs.org/> |
| pnpm | `npm install -g pnpm` (or `winget install pnpm.pnpm`) |
| The backend running | See `../backend/README.md`. The frontend talks to the backend at `NEXT_PUBLIC_API_BASE_URL`. |

## Bring up the frontend

```bash
cd frontend

# 1. copy the env template
cp .env.example .env.local
# Defaults work for local dev. Edit only if your backend isn't on http://localhost:8000.

# 2. install deps
pnpm install

# 3. run in dev mode
pnpm dev
```

Open <http://localhost:3000>. You should see the Phase 0 placeholder landing.

## Common commands

```bash
pnpm dev          # Next.js dev server (HMR)
pnpm build        # production build (creates .next/standalone)
pnpm start        # serve the production build
pnpm lint         # ESLint (next/core-web-vitals + next/typescript)
pnpm format       # Prettier on every .ts / .tsx / .css / .md
pnpm typecheck    # tsc --noEmit
```

## How the frontend talks to the backend

- All API calls go through `lib/api-client.ts`, which sends `credentials: "include"` so the session cookie set by the backend is carried automatically.
- Every mutating request includes the `X-Requested-With: pannly-web` header for lightweight CSRF protection (paired with the backend's `SameSite=Lax` session cookie).
- The frontend has **zero direct database access** and **no auth SDK**. All auth flows (OTP send, OTP verify, Google OAuth, logout, current user) are REST calls against the backend.

## Project layout

```
frontend/
├── package.json
├── next.config.mjs            # output: 'standalone' for the Coolify Dockerfile
├── tsconfig.json
├── postcss.config.mjs         # @tailwindcss/postcss
├── eslint.config.mjs
├── .prettierrc.json
├── app/
│   ├── layout.tsx             # global shell + Plausible + fonts
│   ├── globals.css            # @import 'tailwindcss'; @theme tokens
│   ├── not-found.tsx
│   ├── (marketing)/
│   ├── (auth)/
│   └── (app)/
├── components/
│   └── placeholder-page.tsx
├── lib/
│   ├── env.ts                 # typed access to NEXT_PUBLIC_* vars
│   ├── api-client.ts          # typed fetch wrapper
│   └── format.ts              # money / date / "Day N of 60" helpers
└── public/
```

## Production (Coolify)

`frontend/Dockerfile` builds a standalone Next.js image (port 3000). Coolify deploys on push to `main`.
