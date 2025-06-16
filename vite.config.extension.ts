import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Chrome extension configuration
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist-extension',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/main.tsx'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        format: 'es'
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
});
