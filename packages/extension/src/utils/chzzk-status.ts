import { contentClient } from "@extension/utils/message/iframe-client.ts";

export async function initializePlayerStatus(isChat: boolean) {
  InterceptEmitter.on("live-info", (response) => {
    console.log("[라이브 정보]", response);

    if (response === null) {
      contentClient.send("player-status", {
        type: "end",
      });
      return;
    }

    if (isChat) {
      return;
    }

    if (response.status === "CLOSE") {
      contentClient.send("player-status", {
        type: "end",
      });
      return;
    }

    if (response.adult && response.userAdultStatus !== "ADULT") {
      contentClient.send("player-status", {
        type: "adult",
      });
      return;
    }
  });

  InterceptEmitter.on("live-status", (response) => {
    console.log("[라이브 상태]", response);

    if (response === null) {
      contentClient.send("player-status", {
        type: "end",
      });
      return;
    }

    if (isChat) {
      return;
    }

    if (response.status === "CLOSE") {
      contentClient.send("player-status", {
        type: "end",
      });
      removeEmbedPlayer();
      return;
    }

    if (response.adult && response.userAdultStatus !== "ADULT") {
      contentClient.send("player-status", {
        type: "adult",
      });
      return;
    }
  });

  InterceptEmitter.on("channel-info", (response) => {
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
        contentClient.send("player-status", {
          type: "error",
          message: "플레이어에서 에러가 발생했습니다.",
        });
        location.reload();
      }
    });
  });

  observer.observe(document.body, {
    subtree: true,
    attributes: true,
  });
}
