import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// Serve /api/players in dev using the same database.ts used by the Vercel function.
function playersApi(): Plugin {
  return {
    name: "players-api",
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ""));
      server.middlewares.use("/api/players", async (_req, res) => {
        try {
          const { fetchPlayers } = await server.ssrLoadModule("/database.ts");
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(await fetchPlayers()));
        } catch (err) {
          console.error(err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Falha ao carregar jogadores" }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    playersApi(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["simble.webp", "apple-touch-icon.png", "splash/*.png"],
      manifest: {
        name: "Escale Seu Time",
        short_name: "Escale",
        description: "Monte a escalação do seu time.",
        lang: "pt-BR",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#0d2318",
        theme_color: "#173829",
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // player list: fresh when online, cached copy when offline
            urlPattern: ({ url }) => url.pathname === "/api/players",
            handler: "NetworkFirst",
            options: { cacheName: "players-api", networkTimeoutSeconds: 4 },
          },
          {
            // player photos (Vercel Blob)
            urlPattern: ({ url }) => url.hostname.endsWith(".public.blob.vercel-storage.com"),
            handler: "CacheFirst",
            options: {
              cacheName: "player-photos",
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: ({ url }) => url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts" },
          },
        ],
      },
    }),
  ],
});
