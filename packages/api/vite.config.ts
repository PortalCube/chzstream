import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
  },
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.app.json",
      outDir: resolve(__dirname, "dist"),
    }),
    tsconfigPaths(),
  ],
});
