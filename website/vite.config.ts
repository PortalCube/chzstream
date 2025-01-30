import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      "@chzstream/url": path.resolve(__dirname, "../packages/url/src/index.ts"),
      "@chzstream/message": path.resolve(
        __dirname,
        "../packages/message/src/index.ts"
      ),
    },
  },
  server: {
    port: 5286,
  },
});
