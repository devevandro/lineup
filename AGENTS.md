# AGENTS.md

## Stack
React 19 + Vite + Tailwind CSS v4 (`@theme` tokens in `src/index.css`), TypeScript, `vite-plugin-pwa`, Neon serverless Postgres.

## Layout
- `database.ts`, `types.ts` – DB access and `PlayerRow` type (root, shared by Vite dev middleware and `api/players.ts`).
- `src/App.tsx` – view switching (squad → lineup → bench) and lineup actions.
- `src/components/` – `SquadPage`, `Field`, `PlayerPicker`, `BenchPage`, `ResultModal`, `Header`, `PlayerAvatar`.
- `src/lib/` – `formations` (slot coordinates, GOL inside own area), `state` (localStorage `escale-seu-time:v3`), `players`, `buildImage` (canvas export), `symbol`.
- `escale-seu-time.html` – original static prototype (reference only).

## Conventions
- Mobile only; UI text in Portuguese.
- In `api/*.ts`, import local modules with a `.js` extension (`../database.js`); extensionless ESM imports crash on Vercel.
- Never expose `DATABASE_URL` to the client; use `/api/players`.
- Main color `#DB4108` (`--color-amber` token), white text on it.
- Player photos are transparent PNG cutouts: no circle behind them on the pitch or in the exported image.
- Export footer lists only the bench (no starters); load photos with `fetch` + `createImageBitmap`; saving uses a button (Web Share / download), not long-press.
- Canvas export must stay visually consistent with `Field`; slot `y` is a percentage of field height.
- Changing the team symbol: replace `public/simble.webp` and regenerate PWA icons/splash.
