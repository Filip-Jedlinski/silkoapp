import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  // Vercel hostuje z root URL
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "mask-icon.svg",
        "ikonasilka.png",
      ],
      manifest: {
        name: "Siłka - Prywatna Aplikacja Treningowa",
        short_name: "Siłka",
        description:
          "Prywatna aplikacja treningowa PWA do planowania i śledzenia postępu",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "ikonasilka.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "ikonasilka.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "ikonasilka.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "ikonasilka.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "screenshot1.png",
            sizes: "540x720",
            type: "image/png",
            form_factor: "narrow",
          },
          {
            src: "screenshot2.png",
            sizes: "540x720",
            type: "image/png",
            form_factor: "narrow",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.youtube\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "youtube-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
        ],
      },
    }),
  ],
});
