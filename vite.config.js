import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "HisabKitab",
        short_name: "HisabKitab",
        theme_color: "#3498db",
        icons: [
          {
            src: "icons/calculator512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/calculator120.png",
            sizes: "120x120",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
