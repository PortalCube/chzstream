import { PlayerEventType } from "@chzstream/message";
import {
  ChzzkChannelInfoResponse,
  ChzzkLiveInfoResponse,
} from "@chzstream/message";
import { sendPlayerEvent } from "@extension/utils/message/iframe-client.ts";

export async function initializePlayerStatus(isChat: boolean) {
  InterceptEmitter.on("live-info", (response: ChzzkLiveInfoResponse) => {
    console.log("[라이브 정보]", response);

    if (response === null) {
      sendPlayerEvent(PlayerEventType.End);
      return;
    }

    if (isChat) {
      return;
    }

    if (response.status === "CLOSE") {
      sendPlayerEvent(PlayerEventType.End);
      return;
    }

    if (response.adult && response.userAdultStatus !== "ADULT") {
      sendPlayerEvent(PlayerEventType.Adult);
      return;
    }
  });

  InterceptEmitter.on("live-status", (response: Record<string, unknown>) => {
    console.log("[라이브 상태]", response);

    if (response === null) {
      sendPlayerEvent(PlayerEventType.End);
      return;
    }

    if (isChat) {
      return;
    }

    if (response.status === "CLOSE") {
      sendPlayerEvent(PlayerEventType.End);
      removeEmbedPlayer();
      return;
    }

    if (response.adult && response.userAdultStatus !== "ADULT") {
      sendPlayerEvent(PlayerEventType.Adult);
      return;
    }
  });

  InterceptEmitter.on("channel-info", (response: ChzzkChannelInfoResponse) => {
    console.log("[채널 정보]", response);
  });

  checkPlayerError();
}

function checkPlayerError() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const element = mutation.target as HTMLElement;

      if (element.classList.contains("pzp") === false) {
        return;
      }

      if (element.classList.contains("pzp-pc--dialog-error") === true) {
        sendPlayerEvent(PlayerEventType.Error);
        location.reload();
      }
    });
  });

  observer.observe(document.body, {
    subtree: true,
    attributes: true,
  });
}
