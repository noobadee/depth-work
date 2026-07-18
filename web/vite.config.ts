import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tanstackRouter({
    target: "react",
    autoCodeSplitting: true,
    routesDirectory: "./src/app/routes",
    generatedRouteTree: "./src/app/routeTree.gen.ts"
  }), react()],
  server: {
    port: 3001,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@/app": path.resolve(__dirname, "./src/app"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/widgets": path.resolve(__dirname, "./src/widgets"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/entities": path.resolve(__dirname, "./src/entities"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
    },
  },
});
