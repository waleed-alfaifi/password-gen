import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      modules: path.resolve(__dirname, "./modules"),
    },
  },
});
