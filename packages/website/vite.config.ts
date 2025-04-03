import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { execSync } from "child_process";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5286,
  },
  define: {
    "import.meta.env.VITE_BUILD_VERSION": JSON.stringify(
      process.env.npm_package_version
    ),
    "import.meta.env.VITE_BUILD_COMMIT_SHA": JSON.stringify(
      execSync("git rev-parse --short HEAD").toString().trim()
    ),
    "import.meta.env.VITE_BUILD_TIMESTAMP": JSON.stringify(
      new Date().toISOString()
    ),
  },
});
