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
  contentClient,
  initializeClientMessage,
} from "@extension/utils/message/iframe-client.ts";

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
    initializePlayerStatus(isEmbedChat());
    initializeIframeEventCapture();

    if (isEmbedPlayer()) {
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
    contentClient.send("video-status", data);
  });

  embedEvent.on("load", async () => {
    contentClient.send("player-status", {
      type: "ready",
    });
  });
}

async function initializeEmbedChat() {
  makeEmbedChat();

  contentClient.send("player-status", {
    type: "ready",
  });
}
