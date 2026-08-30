# Ascend

**A discipline and execution engine that transforms long-horizon goals and recurring habits into timezone-aware daily tasks — compounding consistency into measurable streaks, XP progression, and visual history.**

*Note on Naming:* The user-facing application is branded **Ascend**, while the repository, packages, and database schema are identified as **Day Mark**. Both refer to the same unified system.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?logo=postgresql&logoColor=white)](https://www.prisma.io/)
[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/repo)
[![BullMQ](https://img.shields.io/badge/BullMQ-queues-black?logo=redis&logoColor=white)](https://docs.bullmq.io/)
[![Redis](https://img.shields.io/badge/Upstash_Redis-cache-DC382D?logo=redis&logoColor=white)](https://upstash.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11.7-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Status](https://img.shields.io/badge/status-local_dev-yellow)](#getting-started)

> **Status:** Fully functioning on a local machine. Not deployed. Production URLs, CI badges, and live walkthroughs belong in the placeholders below.

---

## Video walkthroughs

| 🔐 Auth Flow & Task Creation | 🔄 Habit Creation & Tracking |
| :---: | :---: |
| [![Auth Flow & Task Creation](https://img.youtube.com/vi/G5S9tzSJgGQ/hqdefault.jpg)](https://youtu.be/G5S9tzSJgGQ)<br/>[▶ **Watch Walkthrough**](https://youtu.be/G5S9tzSJgGQ) | [![Habit Creation & Tracking](https://img.youtube.com/vi/oadoJzAzx1E/hqdefault.jpg)](https://youtu.be/oadoJzAzx1E)<br/>[▶ **Watch Walkthrough**](https://youtu.be/oadoJzAzx1E) |

| 🎯 Goal / Objective Tracking | ⚙️ Settings & Notification Flow |
| :---: | :---: |
| [![Goal & Objective Tracking](https://img.youtube.com/vi/5VnbFcuxeYA/hqdefault.jpg)](https://youtu.be/5VnbFcuxeYA)<br/>[▶ **Watch Walkthrough**](https://youtu.be/5VnbFcuxeYA) | [![Settings & Notification Flow](https://img.youtube.com/vi/5F05dFvYh7E/hqdefault.jpg)](https://youtu.be/5F05dFvYh7E)<br/>[▶ **Watch Walkthrough**](https://youtu.be/5F05dFvYh7E) |

---

## The problem and the solution

**Problem.** It is easy to set big goals (like *"get fit"*, *"read 20 books"*, or *"master a new skill"*), but hard to stick with them every single day. Most people lose momentum because:

1. **Big goals feel too distant:** A 6-month target doesn't give you a clear, executable plan for today.
2. **Generic to-do apps don't build discipline:** Checking off a grocery item gets treated the same as studying every morning for 90 days.
3. **Skipped days are easily forgotten:** When a habit is missed in a normal to-do list, it simply vanishes without an honest record of consistency or lost momentum.

**Solution.** Day Mark (Ascend) is a **system of record for daily execution**, designed to bridge the gap between high-level ambition and daily action:

1. **Goals become daily tasks:** Long-horizon targets (`WEEKLY` / `MONTHLY`) automatically spawn linked daily tasks with real-time velocity and progress tracking.
2. **Habits run on autopilot:** Define which weekdays a habit fires and at what time. Background workers automatically schedule and materialize tasks right on cue.
3. **Timezone-aware day schedules:** Execution respects your personal `dayStartTime` and IANA timezone — so a 2:00 AM session still belongs to your active day if your morning starts at 5:00 AM.
4. **Compounding progress:** Completed tasks earn XP, unlock ranks, and update an immutable daily ledger (audit log) so consistency is visually celebrated and proven over time.

If you remember one architectural rule: **Postgres owns identity and current state; DynamoDB owns immutable daily audit logs; MongoDB owns the disposable notification inbox.**

---

## Architecture and technical decisions

### C4 Level 2 — Ascend system (containers)

```mermaid
flowchart TD
    User["User<br/>Web Browser"]

    subgraph Ascend["Ascend System"]
        Web["Web Application<br/>Next.js 16 · apps/web"]
        API["API Application<br/>NestJS 11 · apps/backend"]
    end

    subgraph Data["Data Stores"]
        PG[("PostgreSQL<br/>Prisma · @day-mark/db")]
        DDB[("Amazon DynamoDB<br/>Day-Mark-Logs")]
        Mongo[("MongoDB<br/>Notification inbox")]
        Cache[("Upstash Redis<br/>Cache · JWT refresh · Redlock")]
        QRedis[("Queue Redis<br/>BullMQ · Socket.IO adapter")]
    end

    User -- "HTTPS (App Router UI)" --> Web
    User -- "WebSocket (Socket.IO)" --> API
    Web -- "HTTP/REST (HttpOnly cookies, SWR)" --> API
    API -- "TCP (Prisma)" --> PG
    API -- "HTTPS (AWS SDK Put/Query)" --> DDB
    API -- "TCP (Mongoose)" --> Mongo
    API -- "Redis/TLS (cache, refresh tokens, Redlock)" --> Cache
    API -- "Redis protocol (BullMQ jobs + WS pub/sub)" --> QRedis

    classDef person fill:#08427B,stroke:#052E56,color:#fff
    classDef app fill:#1168BD,stroke:#0B4884,color:#fff
    classDef store fill:#438DD5,stroke:#2E6295,color:#fff
    classDef boundary fill:#FFFFFF,stroke:#666,color:#333

    class User person
    class Web,API app
    class PG,DDB,Mongo,Cache,QRedis store
```

> 📖 **Deep Dive Architecture:** For an in-depth component-level architecture breakdown (C4 Level 3), service interactions, BullMQ worker flows, and multi-database persistence semantics of the NestJS backend, refer to the [Backend Component Architecture Guide](docs/ARCHITECTURE.md).

---

### Why a Turborepo monorepo

The frontend and API must share **one source of truth for env validation and the Prisma client**. Putting those in `packages/` means Nest never re-declares `DATABASE_URL`, and Next never silently ships a different `NEXT_PUBLIC_API_URL`. Turborepo’s task graph (`dependsOn: ["^build"]`, `globalEnv: ["DATABASE_URL"]`) is the right primitive: `pnpm dev` starts both apps; Prisma generate/migrate is a first-class workspace task, not a folklore script in a wiki.

Workspaces are `apps/*`, `packages/*`, and `packages/core/db` (explicit because the DB package is nested).

### Why NestJS instead of Next.js Route Handlers

The backend is not a BFF for forms. It runs:

- **Passport** strategies (credentials, Google, GitHub) with cookie-based JWT issuance
- **Global `ValidationPipe`** (`whitelist` + `forbidNonWhitelisted`) on every DTO
- **`@nestjs/schedule` crons** (hourly reminder enqueue, DB keep-alive)
- **BullMQ processors** that must outlive a serverless function timeout
- **Socket.IO** with a **Redis adapter** so WebSocket fan-out stays correct if you ever run more than one API replica
- **Redlock** around cache-backed XP writes

Next.js is the right place for RSC, middleware cookie gates, and the HUD. It is the wrong place for a multi-minute habit materialization job or a Redis-backed pub/sub adapter. Splitting also keeps CORS explicit (`origin: http://localhost:3001`, `credentials: true`) instead of pretending the browser and the worker share a process.

### Why PostgreSQL + Prisma for the core graph

Users, accounts, habits, goals, and tasks are a **relational DAG** with cascading deletes and composite uniqueness (`habitId + scheduledDate` so a habit cannot double-spawn a task for the same local day). Prisma lives in `@day-mark/db` with the **pg driver adapter** (`PrismaPg`), not a hidden generated-client copy per app.

### Why two Redis roles

| Client | Env | Job |
| --- | --- | --- |
| **Upstash** | `UPSTASH_REDIS_URL` | Hot cache: notification prefs (`user:{id}:notification_prefs`), gamification hashes, refresh-token store, Redlock |
| **Queue Redis** | `QUEUE_REDIS_URL` | BullMQ (`maxRetriesPerRequest: null` is mandatory), Socket.IO Redis adapter |

Mixing those on one Upstash instance is a common footgun: BullMQ’s blocking commands and Upstash’s serverless semantics fight each other. The code already separates them.

Habit jobs retry **3 times with exponential backoff** (2s base) and prune completed/failed jobs so the Redis stream does not grow without bound.

### Why MongoDB for notifications and DynamoDB for logs

In-app notifications are **write-heavy, ACK-deleted, and useless after delivery**. Mongoose documents are swept on `ACK_NOTIFICATION`. That workload should not bloat Postgres WAL or fight with goal FK constraints.

Habit logs and daily reflections are **append-only, keyed by `USER#id` / `SK` prefixes** (single-table style: `LOG#HABIT#…`, `REFLECTION#YYYY-MM-DD`). DynamoDB is the store that matches that access pattern; Postgres still holds the *current* streak/stability integers used by the HUD.

### Why the frontend is Next.js 16 + SWR + Zustand

The app is a authenticated product (dashboard, habits, objectives, calendar, settings, achievements) plus a marketing landing page. Next handles routing and the **proxy/middleware cookie gate** (`access_token` / `refresh_token`, silent refresh). SWR owns server state; Zustand owns ephemeral UI (modals). Forms use **Zod + react-hook-form**. That split keeps Nest as the authority and the browser as a cache of that authority.

---

## Folder structure

The API app is **`apps/backend`**, not `apps/api`. Shared code is **`packages/`**, not a fictional `packages/ui` from the Turborepo starter.

```text
day-mark/
├── apps/
│   ├── web/                          # Next.js 16 UI (port 3001)
│   │   ├── app/                      # App Router: landing, (auth), (home), onboarding
│   │   ├── components/               # UI primitives + product sections
│   │   ├── core/                     # HTTP client, hooks, domain services, stores
│   │   ├── proxy.ts                  # Cookie auth gate + silent refresh
│   │   └── utils/auth.ts             # Logout hits Nest to clear HttpOnly cookies
│   └── backend/                      # NestJS API (port 3000)
│       └── src/
│           ├── main.ts               # CORS, cookies, ValidationPipe, Redis IO adapter
│           ├── common/               # Prisma, Redis cache, queues, Dynamo, Mongo, guards
│           └── modules/              # auth, user, tasks, habits, goals, health, notification
├── docs/
│   └── ARCHITECTURE.md               # C4 Level 3 Component Architecture Guide
├── packages/
│   ├── config/                       # Zod-parsed env (server + NEXT_PUBLIC client)
│   ├── core/db/                      # Prisma schema, migrations, shared PrismaClient
│   ├── eslint-config/                # Shared ESLint presets
│   └── typescript-config/            # Shared tsconfig bases
├── turbo.json
├── pnpm-workspace.yaml
├── .env.example                      # Copy to .env at repo root
└── README.md
```

| Path | Responsibility |
| --- | --- |
| `apps/web` | Product UI, landing, onboarding, dashboard overlays, Web Push subscription, Socket.IO client |
| `apps/backend` | Auth, domain services, crons, queues, WebSocket gateway, polyglot persistence |
| `docs/ARCHITECTURE.md` | In-depth C4 Level 3 Component architecture guide for the NestJS backend |
| `packages/config` | Fail-fast env schema (`envSchema.parse`) so misconfig never boots half-working |
| `packages/core/db` | Canonical Prisma schema + `prisma` singleton used by Nest |
| `packages/eslint-config` | Lint rules shared across workspaces |
| `packages/typescript-config` | Compiler options shared across workspaces |

**Backend modules (mental model):**

| Module | Owns |
| --- | --- |
| `auth` | Credentials + OAuth registration, JWT cookies, Redis-backed refresh rotation |
| `user` | Profile, onboarding, password, timezone/`dayStartTime`, activity, self-reflection |
| `habits` | CRUD, cache repo, BullMQ `habits-queue` processor, monthly history encoding |
| `goals` | Horizons, status, goal-logs, linked tasks |
| `tasks` | Daily work items (`Standard` / `HabitTask` / `GoalTask`), cache, task-logs |
| `notification` | Provider registry (in-app + web-push), cron → `notification-queue`, gateway |
| `health` | Liveness plus a `*/4 * * * *` cron that pokes Postgres (cold-start / pause-safe) |
| `gamification` | XP progression, rank themes, Redis hash + Redlock |

---

## Challenges and trade-offs

Fill the bracketed notes with your own war stories if a reviewer asks “what was hard?” The technical facts below are already in the code.

### 1. Timezone-correct habit materialization without scanning every user every minute

**Hurdle.** A habit due at `09:00` in `Asia/Kolkata` is not the same instant as `09:00` in `America/Los_Angeles`. A naive hourly cron that `findMany`s all users does not scale and still gets DST wrong.

**Approach in-repo.** Jobs on `habits-queue` named `initialize-timezone-tasks` carry `{ timeZone, windowStartMinutes, windowEndMinutes, localDateString }`. The worker calls `HabitsService.generateHabitTasksForScheduleGroup(...)`. BullMQ owns retries; the API process is not blocked on fan-out.

**Trade-off.** [Insert: how you group users into windows, what happens if Redis is down during midnight, and whether you accepted at-least-once delivery vs exactly-once given `@@unique([habitId, scheduledDate])`.]

### 2. Three databases on purpose, not by accident

**Hurdle.** Streaks need fast relational reads. Reflections need “one document per logical day” with conflict if you submit twice. Notifications need delete-on-ACK without vacuuming Postgres.

**Approach in-repo.** Prisma for the graph; DynamoDB `Day-Mark-Logs` with `PK`/`SK`; Mongo `AppNotification` for the inbox. Habit *display* history is a **fixed-width 31-char string** on `HabitMonthlyLogs` (index `yearMonth`) so heatmaps do not query 31 rows.

**Trade-off.** [Insert: operational cost of local Dynamo vs AWS, and how you keep Postgres streak integers consistent with Dynamo audit logs after a failed write.]

### 3. Auth cookies, two JWTs, and Next as a dumb gate

**Hurdle.** SPAs that stash access tokens in `localStorage` leak to XSS. Refresh tokens that live only in memory vanish on reload.

**Approach in-repo.** Nest sets **HttpOnly, `sameSite: 'lax'`** cookies. Access tokens are verified by `AuthGaurd` from `access_token`. Refresh tokens are stored in Redis (`refresh:{userId}`, 7-day TTL) and rotated via `POST /auth/refresh`. Next `proxy.ts` redirects unauthenticated users and attempts silent rotation when the access cookie is missing but refresh exists. Passwords are `bcrypt(password + BCRYPT_SECRET_PEPPER)`.

**Trade-off.** [Insert: CSRF posture for cookie auth, and whether you will lock CORS to a real origin before deploy.]

### 4. (Optional third) Live notifications vs Web Push

**Hurdle.** A Socket.IO room is useless if the tab is closed; Web Push is useless if VAPID keys or service workers are missing.

**Approach in-repo.** `NotificationService` registers **channel providers**. Prefs are cached 24h in Redis after Prisma upsert. The gateway joins `user:{userId}` and deletes Mongo rows on ACK. Hourly cron computes mid-day / end-of-day delays from `dayStartTime` and bulk-enqueues BullMQ jobs.

**Trade-off.** [Insert: current `take: 100` on the reminder cron — pagination is required before any real user count.]

---

## Security and scalability

### Security (what is actually implemented)

| Control | Mechanism |
| --- | --- |
| Authn | JWT access + refresh; refresh compared to Redis (stolen JWT that is not the cached one fails) |
| Authz | Guards attach `{ userId }` from the access token; notification ACK deletes are scoped by `userId` |
| Secrets | Root `.env` loaded by `@day-mark/config`; **Zod parse at boot** — missing keys crash the process |
| Input | Nest `ValidationPipe` + class-validator DTOs; web forms via Zod |
| Cookies | HttpOnly; not readable by JS; logout clears both cookies from Nest |
| Password | bcrypt cost 10 + server-side pepper |
| OAuth | Google / GitHub Passport strategies; accounts linked in a Prisma transaction with the user profile |
| Push | VAPID keys; subscriptions unique on `endpoint` |
| Env split | `packages/config/client.ts` only exposes `NEXT_PUBLIC_*` |

**Known gaps to be honest about (reviewers notice these):** Socket.IO CORS is currently `origin: '*'`; the gateway trusts `handshake.query.userId` rather than a signed cookie on the socket. [Insert: your plan to authenticate the WebSocket handshake with the access JWT.] Cron reminder query is unbounded except `take: 100`. Do not treat this README as a claim of production hardening.

### Scalability (how the seams are drawn)

- **Stateless API + Redis IO adapter** — multiple Nest replicas can emit to the same user room.
- **Queues** — habit generation and notification dispatch are workers, not request threads. Job retention is capped (`removeOnComplete` / `removeOnFail`).
- **Cache-aside XP** — Redis hash with DB fallback; Redlock for concurrent awards.
- **Indexes** — `Task(userId, scheduledDate)`, `Habit(userId)`, `Goal(userId)`, unique habit-day tasks.
- **Compact habit month** — O(1) row per habit per month instead of a row per day.
- **Decoupled web** — Next can scale on a different machine than Nest; only cookies + `NEXT_PUBLIC_API_URL` couple them.

Horizontal scale still requires: paginated crons, authenticated sockets, connection pooling, and a real deploy of Postgres/Redis/Mongo/Dynamo — none of which is live yet.

---

## Future scope

1. **Deploy the split stack** — Nest on a long-running host (Fly/Railway/ECS) because of workers and WebSockets; Next on Vercel or the same cluster; managed Postgres; keep Upstash for cache and a persistent Redis for BullMQ. Add health checks that do not depend on the `*/4` wake-up hack.
2. **Authenticate Socket.IO and lock CORS** — verify JWT on connect; replace `origin: '*'` and `localhost:3001` with the real web origin.
3. **Notification scheduler at scale** — replace `take: 100` with timezone buckets and idempotent job IDs per `(userId, logicalDate, reminderKind)`.
4. **Goal → habit decomposition** — the marketing site describes an “AI breakdown” of summits into micro-habits. The domain model already separates Goal and Habit; the missing piece is a constrained planner (not a free-form chatbot) that writes Prisma rows the existing workers already know how to schedule.
5. **[Insert one personal roadmap item]** — e.g. calendar ICS, offline PWA, or promoting backend Jest coverage into CI.

---

## Getting started

These steps assume **Windows, macOS, or Linux**. All env files are read from the **repository root** (`.env`), not from `apps/backend/.env`.

### Prerequisites

| Tool | Version / notes |
| --- | --- |
| Node.js | `>= 18` (repo `engines`) |
| pnpm | `11.7.0` (see `packageManager` in root `package.json`) |
| PostgreSQL | 14+ recommended |
| Redis | Local instance for `QUEUE_REDIS_URL` (Docker is fine) |
| Upstash Redis | Account + TLS URL for `UPSTASH_REDIS_URL`, or another Redis **only if** you accept TLS settings in `RedisCacheService` |
| MongoDB | Local or Atlas for the notification inbox |
| AWS | IAM user that can read/write table `Day-Mark-Logs`, or [Insert: DynamoDB Local instructions] |
| Optional | Google/GitHub OAuth apps, Resend API key, VAPID keypair for Web Push |

**Docker (optional) for Postgres, Redis, and Mongo:**

```bash
docker run -d --name daymark-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=daymark -p 5432:5432 postgres:16
docker run -d --name daymark-redis -p 6379:6379 redis:7
docker run -d --name daymark-mongo -p 27017:27017 mongo:7
```

Then set `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/daymark?schema=public` and `QUEUE_REDIS_URL=redis://127.0.0.1:6379`.

### 1. Clone and install

```bash
git clone [Insert Git Clone URL]
cd day-mark
pnpm install
```

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env`. Every key in `packages/config/index.ts` is **required**. Empty strings will fail Zod parse. For OAuth/email/AWS you are not using yet, put a non-empty placeholder and do not click those features.

Generate VAPID keys when you want push:

```bash
npx web-push generate-vapid-keys
```

Put the public key in both `VAPID_PUBLIC_KEY` and `NEXT_PUBLIC_VAPID_PUBLIC_KEY`.

### 3. Prisma (Postgres)

From the repo root:

```bash
pnpm --filter @day-mark/db db:generate
pnpm --filter @day-mark/db db:migrate
```

`db:migrate` runs `prisma migrate dev` (interactive name on first run). For a throwaway database you can use `prisma db push` via a one-off:

```bash
pnpm --filter @day-mark/db exec prisma db push
```

Apply migrations, do not “invent” SQL by hand; the initial migration lives in `packages/core/db/prisma/migrations/`.

### 4. DynamoDB table

The code expects a table named **`Day-Mark-Logs`** with partition key `PK` and sort key `SK`.

```bash
pnpm --filter backend db:dynamo:setup
```

[Insert: confirm this script matches your AWS account / local Dynamo endpoint.]

### 5. Start both apps

From the repository root:

```bash
pnpm dev
```

Turborepo runs `turbo run dev`: Nest (`start:dev`, typically **http://localhost:3000**) and Next (`next dev -p 3001` → **http://localhost:3001**).

| App | URL |
| --- | --- |
| Web | http://localhost:3001 |
| API | http://localhost:3000 |

Sign up at `/signup`, complete `/onboarding`, then use `/dashboard`.

Filter a single workspace if needed:

```bash
pnpm exec turbo dev --filter=web
pnpm exec turbo dev --filter=backend
```

### 6. Tests

Backend unit tests are Jest (`*.spec.ts` colocated under `apps/backend/src`). There is no root `test` script yet.

```bash
pnpm --filter backend test
pnpm --filter backend test:cov
pnpm --filter backend test:e2e
```

Frontend: `pnpm --filter web lint` (no Jest suite in `apps/web` at the time of writing).

Repo-wide:

```bash
pnpm lint
pnpm check-types
```

---

## License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Author
**Akshat Krishan** · [GitHub](https://github.com/Desktoo) · [LinkedIn](https://www.linkedin.com/in/your-profile)

Built as a full-stack systems project (monorepo, queues, polyglot persistence, cookie JWT). Intended for reviewers who care more about boundaries and failure modes than about another CRUD todo list.
