import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        contact: resolve(import.meta.dirname, "contactpage.html")
      },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) {
            return "vendor-three";
          }
          if (id.includes("node_modules/vgpu")) {
            return "vendor-vgpu";
          }
          if (id.includes("node_modules/ogl")) {
            return "vendor-ogl";
          }
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
        }
      }
    }
  }
});
