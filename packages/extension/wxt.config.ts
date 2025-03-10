import { makeUrls } from "./src/utils/make-url.js";
import {
  defineConfig,
  UserManifest,
  UserManifestFn,
  Wxt,
  WxtDirEntry,
  WxtDirFileEntry,
} from "wxt";
import tsConfigPaths from "vite-tsconfig-paths";

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
        "https://chzstream.app/*",
      ],
      mode
    ),
    web_accessible_resources: [
      {
        resources: ["chzzk-xhr.js"],
        matches: ["https://chzzk.naver.com/*"],
      },
      {
        resources: ["website-test.js"],
        matches: ["http://localhost/*", "https://chzstream.app/*"],
      },
    ],
  };

  // Chromium
  if (["chrome", "edge", "whale"].includes(browser)) {
    manifest.externally_connectable = {
      matches: makeUrls(
        ["https://chzstream.app/*", "https://chzzk.naver.com/live/*"],
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
  hooks: {
    "prepare:types": modifyTsConfig,
  },
  runner: {
    disabled: true,
  },
  dev: {
    server: {
      port: 5287,
    },
  },
  vite: () => ({
    plugins: [tsConfigPaths()],
  }),
});

function modifyTsConfig(_wxt: Wxt, entries: WxtDirEntry[]) {
  const file = entries.find(
    (entry) => "path" in entry && entry.path.endsWith("tsconfig.json")
  ) as WxtDirFileEntry | undefined;

  if (file === undefined) {
    throw new Error("tsconfig.json not found");
  }

  const tsConfig = JSON.parse(file.text);

  // extension repo의 tsconfig.app.json을 확장하도록 수정
  tsConfig.extends = "../tsconfig.app.json";

  // 강제로 정의된 path alias 제거
  delete tsConfig.compilerOptions.paths;

  // 수정된 내용 저장
  file.text = JSON.stringify(tsConfig, null, 2);
}
