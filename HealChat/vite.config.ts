import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
 base: "/",
 plugins: [react()],
 preview: {
  port: 3000,
  strictPort: true,
 },
 server: {
  port: 3000,
  strictPort: true,
  host: true,
  hmr: {
    port: 3000,
    host: '0.0.0.0',
  },
 },
});