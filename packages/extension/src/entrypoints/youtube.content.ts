import { initializeIframeEventCapture } from "@extension/utils/iframe-event.ts";
import { initializeClientMessage } from "@extension/utils/message/content-client.ts";

export default defineContentScript({
  runAt: "document_start",
  matches: [
    "https://www.youtube.com/embed/*",
    "https://www.youtube.com/live_chat*",
  ],
  allFrames: true,
  async main(_context) {
    if (isEmbed() === false) {
      return;
    }

    await initializeClientMessage();
    initializeIframeEventCapture();
  },
});

function isEmbed() {
  const url = new URL(window.location.href);
  return url.searchParams.has("_csp");
}
