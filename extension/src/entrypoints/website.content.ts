import { makeUrls } from "@/utils/make-url.ts";
import { initializeRelayMessage } from "@/utils/message/website-relay.ts";
import { browser } from "wxt/browser/chrome";

export default defineContentScript({
  runAt: "document_start",
  matches: makeUrls(
    ["https://chzstream.vercel.app/*", "https://chzstream.app/*"],
    import.meta.env.MODE
  ),
  async main(context) {
    initializeRelayMessage();
  },
});
