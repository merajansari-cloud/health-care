import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin";

// ✅ SAFE ENV HANDLING (no crash)
const rawPort = process.env.PORT;
let port = 3000;

if (!rawPort) {
  console.warn("⚠️ PORT not provided, using default 3000");
} else {
  const parsed = Number(rawPort);
  if (Number.isNaN(parsed) || parsed <= 0) {
    console.warn(`⚠️ Invalid PORT "${rawPort}", using default 3000`);
  } else {
    port = parsed;
  }
}

const basePath = process.env.BASE_PATH || "/";
if (!process.env.BASE_PATH) {
  console.warn("⚠️ BASE_PATH not provided, using '/'");
}

export default defineConfig(async () => ({
  base: basePath,

  plugins: [
    mockupPreviewPlugin(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),

    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          (await import("@replit/vite-plugin-cartographer")).cartographer({
            root: path.resolve(import.meta.dirname, ".."),
          }),
        ]
      : []),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },

  root: path.resolve(import.meta.dirname),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },

  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },

  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
}));
