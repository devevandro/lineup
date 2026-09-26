# Escale Seu Time.

Mobile-first PWA (React + Vite + Tailwind v4) to build a football lineup: pick the squad, place 11 players on the pitch, manage the bench, make substitutions and export the lineup as an image.

## Flow
1. **Squad** – set the team name and select players (photo + nickname + checkbox), then "Fechar time".
2. **Lineup** – choose a formation, tap a jersey to pick a player, "Fechar escalação" once 11 are placed; the rest go to the bench.
3. **Bench** – "Ver reservas" lists reserves; "Substituir" swaps a reserve with a starter.
4. **Export** – "Gerar imagem" renders a PNG (team symbol, formation, player cutouts, starters/reserves names).

## Data
Players come from Neon Postgres through `database.ts` (`fetchPlayers`), exposed as `GET /api/players`
(Vite dev middleware in `vite.config.ts`; Vercel function in `api/players.ts`).
Copy `.env.example` to `.env` and set `DATABASE_URL`.

## Scripts
- `npm run dev` – dev server
- `npm run build` – type-check + production build (generates the service worker)
- `npm run preview` – serve the build (PWA install works only over HTTPS/production)

## PWA / iOS
`vite-plugin-pwa` generates the manifest and service worker (players API network-first, photos and fonts cached).
Icons and iOS splash screens live in `public/` (`pwa-*.png`, `apple-touch-icon.png`, `splash/`).
On iPhone: Safari → Share → Add to Home Screen.
