import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  server: {
    port: 5173,
    proxy: {
      "/ws": {
        target: "http://localhost:8090",
        ws: true,
      },
      "/api": {
        // 추가
        target: "http://localhost:8090", // API 프록시
      },
    },
  },
});
