import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',   // Should be '/' not '/some-subfolder/'
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
      "/images": "http://localhost:5000",
    }
  }
});
