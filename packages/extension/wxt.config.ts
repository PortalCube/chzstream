import tsConfigPaths from "vite-tsconfig-paths";
import {
  defineConfig,
  UserManifestFn,
  Wxt,
  WxtDirEntry,
  WxtDirFileEntry,
} from "wxt";
import { makeUrls } from "./src/utils/make-url.js";

const manifest: UserManifestFn = ({ mode }) => ({
  name: "치즈스트림",
  description: "치지직의 방송들을 한 화면으로 편하게 시청하세요.",
  permissions: ["cookies"],
  host_permissions: makeUrls(
    [
      "https://naver.com/",
      "https://chzzk.naver.com/*",
      "https://api.chzzk.naver.com/*",
      "https://chzstream.app/*",
      "https://preview.chzstream.app/*",
    ],
    mode
  ),
  web_accessible_resources: [
    {
      resources: ["chzzk-xhr.js"],
      matches: ["https://chzzk.naver.com/*"],
    },
    {
      resources: ["website-flag.js"],
      matches: [
        "http://localhost/*",
        "https://chzstream.app/*",
        "https://preview.chzstream.app/*",
      ],
    },
  ],
});

export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  manifest,
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
  zip: {
    name: "chzstream-extension",
    sourcesRoot: "../..",
    includeSources: ["packages/{website,url}/tsconfig.?({node,app}.)json"],
    excludeSources: ["packages/{website,url}/**/*"],
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
