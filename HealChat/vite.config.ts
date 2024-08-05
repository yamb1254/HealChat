import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
    server: {
      proxy: {
        '/api': {
          target: 'https://healchat.onrender.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
});
