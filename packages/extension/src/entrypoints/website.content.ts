import { makeUrls } from "@extension/utils/make-url.ts";
import { createWebsiteRelay } from "@message/index.ts";

export default defineContentScript({
  runAt: "document_start",
  matches: makeUrls(
    ["https://chzstream.app/*", "https://preview.chzstream.app/*"],
    import.meta.env.MODE
  ),
  async main(_context) {
    createWebsiteRelay();
    await injectScript("/website-test.js", {
      keepInDom: false,
    });
  },
});
