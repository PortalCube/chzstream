import { initializeIframeEventCapture } from "@extension/utils/iframe-event.ts";
import { PlayerEventType } from "@chzstream/message";
import {
  isEmbedChat,
  makeEmbedChat,
} from "@extension/utils/chzzk-embed-chat.ts";
import {
  embedEvent,
  isEmbedPlayer,
  makeEmbedPlayer,
} from "@extension/utils/chzzk-embed-player.ts";
import {
  initializeClientMessage,
  sendPlayerControl,
  sendPlayerEvent,
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
    await sendPlayerControl(data);
  });

  embedEvent.on("load", async () => {
    await sendPlayerEvent(PlayerEventType.Ready);
  });
}

async function initializeEmbedChat() {
  makeEmbedChat();

  await sendPlayerEvent(PlayerEventType.Ready);
}
