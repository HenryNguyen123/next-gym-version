# Pulse Social Platform — Next.js Client + Admin Starter

A responsive social network frontend prototype built with **Next.js App Router**, **TypeScript**, **Tailwind CSS v4**, Lucide icons, and `next-themes`. It includes a client-facing social experience and a separately styled admin console.

> **Important:** This is a frontend starter with local mock data, not a production-ready social network by itself. There is no backend/API contract attached to the source brief. Authentication, messaging transport, media storage, reporting persistence, analytics, and privileged actions must be connected to and authorized by a trusted backend before deployment.

## Requirements

- Node.js 20.9 or newer (Node 22 recommended)
- npm

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

On Windows PowerShell, create `.env.local` by copying `.env.example` in File Explorer or run:

```powershell
Copy-Item .env.example .env.local
```

### Demo authentication

In development, mock mode is enabled unless `NEXT_PUBLIC_ENABLE_MOCKS=false` is set. The login form accepts any valid email address and a non-empty password. The admin login uses the same development-only behavior to allow the admin console to be previewed.

The `pulse-session` / `pulse-role` marker cookies are **forgeable demo markers**, not real authentication or authorization. Mock auth is disabled when `NODE_ENV=production`. Do not deploy this mock auth flow or treat its route redirects as a security boundary.

## Useful commands

```bash
npm run dev        # Local development server
npm run typecheck  # TypeScript validation
npm test           # Permission-policy unit tests
npm run lint       # ESLint
npm run build      # Production build
npm start          # Serve a production build
```

## Implemented route map

### Client application

- `/` — feed, story viewer, local post composer, reactions, comment composer, save/share, suggestions, trending topics
- `/explore`, `/search` — sample post discovery, query filtering, content filters and topic chips
- `/reels` — native HTML video controls using a public sample clip; engagement is local only
- `/messages` — sample conversation list and local message composer
- `/notifications` — read/unread interaction and mark-all-as-read
- `/saved` — local example collection with remove action
- `/groups` — community cards with local join/leave state
- `/u/[username]`, `/post/[postId]` — profile and post detail routes
- `/settings/profile`, `/settings/account`, `/settings/privacy`, `/settings/appearance` — settings UI and local controls

### Authentication

- `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`
- `/admin/login`

### Admin console

- `/admin` — overview dashboard, sample KPIs/charts/activity, export sample CSV
- `/admin/users`, `/admin/users/[id]`
- `/admin/content/posts`, `/admin/content/reels`, `/admin/content/comments`
- `/admin/reports`, `/admin/categories`, `/admin/tags`, `/admin/media`, `/admin/analytics`
- `/admin/roles`, `/admin/permissions`, `/admin/notifications`, `/admin/audit-logs`
- `/admin/settings/general`, `/admin/settings/security`

Admin tables provide local search, filtering, pagination, record details and illustrative status changes. Export actions generate CSV files from the displayed mock data.

## Architecture overview

```text
src/
  app/
    (client)/                 Client-facing pages and layout
    (auth)/                   Client authentication pages
    admin/                    Admin login + optional catch-all workspace
    forbidden/                Access-denied page
    globals.css               Design tokens + responsive component styling
    layout.tsx                Theme and toast providers
  components/
    admin/                    Admin shell, dashboard and management workspaces
    auth/                     Shared validated authentication flows
    providers/                Theme provider and toast notifications
    social/                   Client shell, feed, post card, workspace pages
    ui/                       Buttons, avatars and theme toggle
  lib/
    api/                      Typed request client and API errors
    config/                   Navigation definitions
    mocks/                    Explicitly illustrative local data
    services/                 Auth adapter (mock / backend integration boundary)
    types/                    Shared TypeScript contracts
  proxy.ts                    Optimistic early redirects only; not authorization
```

## Theme system

The theme switch cycles through **light → dark → system**. The CSS variables centralize colors, surfaces, text, borders, radii, and shadows. Reduced-motion preferences are respected for animations.

## Backend integration checklist

Before production use:

1. Confirm actual backend routes and DTOs, then update `src/lib/services/auth.service.ts` and `src/lib/api/client.ts` to match the backend contract. The `/auth/*` paths in the adapter are conventional placeholders and are not verified against a real service.
2. Have the backend issue and verify secure `HttpOnly`, `Secure`, appropriately scoped `SameSite` session cookies; implement CSRF protection where cookie authentication is used.
3. Enforce authorization in every trusted server/API boundary, including ownership checks, role changes, destructive operations, private messages, saved content and moderation decisions. `src/proxy.ts` is an early navigation gate only.
4. Replace mock arrays with typed services for feed, comments, reactions, profiles, groups, messages, notifications, reports, media, analytics, roles and settings. Clearly distinguish server-persisted mutations from optimistic UI state.
5. Connect signed or otherwise trusted file uploads. The media page only validates selected file metadata; it does not upload files.
6. Add backend-driven pagination, sorting, rate limits, data validation, moderation audit logs, automated tests, CSRF/session-expiry handling and production error monitoring.
7. Add test coverage (unit/component and end-to-end), review accessible keyboard behavior and contrast, and run lint, type-check, tests and a production build in the real project environment.

## Data and demo boundaries

All dashboard analytics and sample user/content records are illustrative. Most in-client state resets after refresh. The sample reel uses a third-party public example video. Share actions use browser capabilities where available. No real-time WebSocket connection, persisted backend mutation, or actual email service is configured.

## License and assets

This project starter is provided for adaptation. Replace sample avatars/content/media with approved assets and update the license and legal pages before publication.
# next-gym-version
