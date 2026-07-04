# dara-front local auth bypass (dev only)

To build against and screenshot the real `dara-front` shell, an **env-gated local dev bypass** was added to the Firebase auth guard. It is **hard-gated to non-production** and lives only in gitignored `.env.local`, so it can never ship enabled.

> This documents a change made in the **`dara-front`** repo (not in prd-tests). The prototype in this branch reproduces the shell independently and does **not** depend on the bypass at runtime — the bypass was used only to capture the reference screenshots.

## What gates the app

`dara-front` has **no global middleware**; each authenticated route wraps its page in the `withAuth` HOC (`src/lib/utils/auth/withAuth.js`), which redirects unauthenticated users to `/login`.

## The change (`src/lib/utils/auth/withAuth.js`)

A compile-time-safe bypass at the top of the HOC:

```js
const DEV_AUTH_BYPASS =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true";

const MOCK_DEV_USER = {
  uid: "dev-local-user",
  email: process.env.NEXT_PUBLIC_DEV_AUTH_EMAIL || "dev@loudecho.ai",
  displayName: "Local Dev",
  photoURL: null,
  isAnonymous: false,
};

// inside the HOC, before any auth hooks:
if (DEV_AUTH_BYPASS) {
  // one-time console warning, then:
  return <Component user={MOCK_DEV_USER} {...props} />;
}
```

## Why it can't weaken production

- `process.env.NODE_ENV !== "production"` — Vercel preview and production builds run with `NODE_ENV=production`, so the branch is **dead code** in every deployed environment regardless of the flag.
- The flag lives only in **local, gitignored `.env.local`** — it is never committed or bundled into a deploy.
- Emits a one-time `console.warn` when active so it's obvious in dev.

## How to enable (local only)

Add to `dara-front/.env.local`:

```bash
NEXT_PUBLIC_DEV_AUTH_BYPASS=true
NEXT_PUBLIC_DEV_AUTH_EMAIL=dev@loudecho.ai   # optional; defaults to dev@loudecho.ai
```

Then:

```bash
npm run dev    # http://localhost:3000 — renders the authed shell with the mock user, no login redirect
```

## Verified
App loads past `/login` locally with a mock user; the real shell (sidebar, campaign detail, tabs) was captured and used as the visual source of truth for both prototypes (see `case-study/screenshots/_ref-dara-front-shell.png`).
