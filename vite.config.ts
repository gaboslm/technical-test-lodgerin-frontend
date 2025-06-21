import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)), // Alias for src folder
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // Recommended for sass-embedded
      },
    },
  },
});
