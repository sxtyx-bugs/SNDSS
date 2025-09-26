import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  // >>> BEST SOLUTION FOR STATIC HOSTING DEPLOYMENT (White Screen Fix)
  // Forces all asset paths (JS, CSS) to be relative, allowing them to load correctly
  base: './', 
  
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  
  // NOTE: You are currently pointing the root to 'client'. 
  // This is used as the base for all relative path resolution.
  root: path.resolve(import.meta.dirname, "client"), 
  
  build: {
    // >>> FIX FOR "No Output Directory named 'dist' found" ERROR 
    // This setting tells Vite to put the final files in a 'dist' folder
    // that is RELATIVE to the 'client' folder (the Netlify/Vercel Base Directory).
    outDir: path.resolve(import.meta.dirname, "client/dist"),
    emptyOutDir: true,
  },
  
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});