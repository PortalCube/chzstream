import { makeUrls } from "./src/utils/make-url.ts";
import { defineConfig, UserManifest, UserManifestFn } from "wxt";
import { resolve } from "path";

const makeManifest: UserManifestFn = ({ browser, mode }) => {
  const manifest: UserManifest = {
    name: "치즈스트림",
    description: "치지직의 방송들을 한 화면으로 편하게 시청하세요.",
    permissions: ["cookies", "notifications"],
    host_permissions: makeUrls(
      [
        "https://naver.com/",
        "https://chzzk.naver.com/*",
        "https://api.chzzk.naver.com/*",
        "https://chzstream.vercel.app/*",
        "https://chzstream.app/*",
      ],
      mode
    ),
    web_accessible_resources: [
      {
        resources: ["chzzk-xhr.js"],
        matches: ["https://chzzk.naver.com/*"],
      },
    ],
  };

  // Chromium
  if (["chrome", "edge", "whale"].includes(browser)) {
    manifest.externally_connectable = {
      matches: makeUrls(
        [
          "https://chzstream.vercel.app/*",
          "https://chzstream.app/*",
          "https://chzzk.naver.com/live/*",
        ],
        mode
      ),
    };
  }

  // Firefox
  if (browser === "firefox") {
    manifest.browser_specific_settings = {
      gecko: {
        id: "{c0a25716-f499-47e7-8ebc-f0c688bba0c0}",
      },
    };
  }

  return manifest;
};

export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  manifest: makeManifest,
  alias: {
    "@extension": resolve(__dirname, "./src"),
    "@message": resolve(__dirname, "../packages/message/src"),
    "@chzstream/message": resolve(
      __dirname,
      "../packages/message/src/index.ts"
    ),
  },
  runner: {
    disabled: true,
  },
  dev: {
    server: {
      port: 5287,
    },
  },
});
