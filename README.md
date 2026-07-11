# Thikana

**Thikana** is a platform for verified rental homes and trusted local services in Bangladesh. This repository is a monorepo with separate frontend and backend packages.

> **README maintenance:** Keep this file and each package README updated as the project grows. When you add features, routes, or integrations, update the relevant docs and changelog sections.

---

## Repository structure

```
thikana/
├── thikana-frontend/    # Next.js marketing website (active development)
├── thikana-backend/     # Backend API (placeholder — not started)
└── README.md            # This file
```

---

## Current status

| Package | Status | Description |
|---------|--------|-------------|
| **thikana-frontend** | In progress | Homepage UI from Figma, static mock data, responsive layout |
| **thikana-backend** | Not started | Empty scaffold (`package.json` only) |

---

## Quick start (frontend)

```bash
cd thikana-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For full setup, architecture, implemented features, and changelog, see **[thikana-frontend/README.md](./thikana-frontend/README.md)**.

---

## What's built so far (frontend)

- **Homepage (`/`)** — hero, verified homes, services, marquee, verification flow, reviews
- **Layout** — sticky responsive navbar, footer, entry popup on first visit
- **Design** — Figma-aligned UI, Tailwind v4 tokens, mock data
- **Not yet** — backend, auth, inner pages, search submission, tests

---

## Changelog

### 2026-07-11

- Initial frontend homepage and layout from Figma
- Project READMEs added (root + frontend)

---

## License

Private project. All rights reserved.
