import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Web version configuration
export default defineConfig({
  root: ".",
  build: {
    outDir: "dist-web",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.web.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
  publicDir: 'public',
});
