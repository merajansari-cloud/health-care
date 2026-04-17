import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// ✅ PORT HANDLE
const port = Number(process.env.PORT) || 3000;

// ✅ BASE PATH (always safe)
const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath, // "/" रखना safest है

  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },

  // ❌ root हटाया (गलत path से 404 आता है)
build: {
  outDir: "dist/public",
  emptyOutDir: true,
}
  server: {
    port,
    host: "0.0.0.0",

    // ✅ proxy सिर्फ dev के लिए
    proxy: {
      "/api": {
        target: process.env.VITE_DEV_API_URL || "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },

  preview: {
    port,
    host: "0.0.0.0",
  },
});
