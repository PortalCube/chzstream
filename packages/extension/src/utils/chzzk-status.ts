import { send } from "@extension/utils/message/content-client.ts";

const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
};

export async function initializePlayerStatus() {
  InterceptEmitter.on("live-info", (response) => {
    if (response.content === null) {
      // 방송을 오랫동안 키지 않음
      send("player-status", {
        type: "end",
      });
      removeChzzkEmbedPlayer();
      return;
    }

    if (isObject(response.content) === false) return;

    const content = response.content;

    if (content.status === "CLOSE") {
      // 방송이 오프라인임
      send("player-status", {
        type: "end",
      });
      removeChzzkEmbedPlayer();
      return;
    }

    if (content.adult && content.userAdultStatus !== "ADULT") {
      // 성인 방송인데 현재 사용자가 성인 인증되지 않음
      send("player-status", {
        type: "adult",
      });
      return;
    }
  });

  InterceptEmitter.on("live-status", (response) => {
    if (response.content === null) {
      // 방송을 오랫동안 키지 않음
      send("player-status", {
        type: "end",
      });
      removeChzzkEmbedPlayer();
      return;
    }

    if (isObject(response.content) === false) return;

    const content = response.content;

    if (content.status === "CLOSE") {
      // 방송이 오프라인임
      send("player-status", {
        type: "end",
      });
      removeChzzkEmbedPlayer();
      return;
    }

    if (content.adult && content.userAdultStatus !== "ADULT") {
      // 성인 방송인데 현재 사용자가 성인 인증되지 않음
      send("player-status", {
        type: "adult",
      });
      return;
    }
  });

  // InterceptEmitter.on("channel-info", (response) => {
  //   console.log("[채널 정보]", response);
  // });

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
        // 플레이어가 에러 UI를 표시함
        send("player-status", {
          type: "error",
          message: "플레이어에서 에러가 발생했습니다.",
        });

        // 즉시 새로고침
        location.reload();
      }
    });
  });

  observer.observe(document.body, {
    subtree: true,
    attributes: true,
  });
}
