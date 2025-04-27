import {
  isChzzkEmbedChat,
  makeChzzkEmbedChat,
} from "@extension/utils/chzzk-embed-chat.ts";
import {
  chzzkEmbedEvent,
  isChzzkEmbedPlayer,
  makeChzzkEmbedPlayer,
} from "@extension/utils/chzzk-embed-player.ts";
import { initializeIframeEventCapture } from "@extension/utils/iframe-event.ts";
import {
  initializeClientMessage,
  send,
} from "@extension/utils/message/content-client.ts";

export default defineContentScript({
  runAt: "document_start",
  matches: ["https://chzzk.naver.com/live/*"],
  allFrames: true,
  async main(_context) {
    if (isEmbed() === false) {
      return;
    }

    await initializeInterceptor();
    await initializeClientMessage();
    initializeIframeEventCapture();

    if (isChzzkEmbedPlayer()) {
      initializePlayerStatus();
      await initializeEmbedPlayer();
    } else if (isChzzkEmbedChat()) {
      await initializeEmbedChat();
    }
  },
});

function isEmbed() {
  const url = new URL(window.location.href);
  return url.searchParams.has("embed", "true");
}

async function initializeEmbedPlayer() {
  makeChzzkEmbedPlayer();

  chzzkEmbedEvent.on("change", async (data) => {
    send("video-status", data);
  });

  chzzkEmbedEvent.on("load", async () => {
    send("player-status", {
      type: "ready",
    });
  });
}

async function initializeEmbedChat() {
  makeChzzkEmbedChat();

  send("player-status", {
    type: "ready",
  });
}
