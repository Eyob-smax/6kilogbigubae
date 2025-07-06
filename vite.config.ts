import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    port: 7374,
    proxy: {
      "/api": {
        target: "http://localhost:5500",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
