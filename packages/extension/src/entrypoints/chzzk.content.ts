import {
  isEmbedChat,
  makeEmbedChat,
} from "@extension/utils/chzzk-embed-chat.ts";
import {
  embedEvent,
  isEmbedPlayer,
  makeEmbedPlayer,
} from "@extension/utils/chzzk-embed-player.ts";
import { initializeIframeEventCapture } from "@extension/utils/iframe-event.ts";
import {
  initializeClientMessage,
  send,
} from "@extension/utils/message/content-client.ts";

export default defineContentScript({
  // runAt: "document_idle",
  matches: ["https://chzzk.naver.com/live/*"],
  allFrames: true,
  async main(_context) {
    if (isEmbed() === false) {
      return;
    }

    await initializeInterceptor();
    await initializeClientMessage();
    initializeIframeEventCapture();

    if (isEmbedPlayer()) {
      initializePlayerStatus();
      await initializeEmbedPlayer();
    } else if (isEmbedChat()) {
      await initializeEmbedChat();
    }
  },
});

function isEmbed() {
  const url = new URL(window.location.href);
  return url.searchParams.has("embed", "true");
}

async function initializeEmbedPlayer() {
  makeEmbedPlayer();

  embedEvent.on("change", async (data) => {
    send("video-status", data);
  });

  embedEvent.on("load", async () => {
    send("player-status", {
      type: "ready",
    });
  });
}

async function initializeEmbedChat() {
  makeEmbedChat();

  send("player-status", {
    type: "ready",
  });
}
