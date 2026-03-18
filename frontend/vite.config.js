import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',   // Should be '/' not '/some-subfolder/'
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "https://vaami-s-creation.onrender.com",
      "/images": "https://vaami-s-creation.onrender.com",
    }
  }
});
