import { createNanoEvents } from "nanoevents";
import "./chzzk-embed-player.scss";

const EMBED_CLASS_NAME = "chzzk-embed-player";

const MINIFIED_PLAYER_WIDTH = 360;

type EmbedEvent = {
  load: () => void;
};

export const embedEvent = createNanoEvents<EmbedEvent>();

export function isEmbedPlayer() {
  const url = new URL(window.location.href);
  const hasEmbedParam = url.searchParams.has("embed", "true");
  const isLivePage = /^\/live\/([^/]+)\/?$/g.test(url.pathname);
  return hasEmbedParam && isLivePage;
}

export function makeEmbedPlayer() {
  // ESC로 넓은 화면을 종료하는 것을 방지하기 위해 ESC키 이벤트 중지
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.stopImmediatePropagation();
    }
  });

  // 임베드 플레이어 크기가 작으면 최소화 적용
  onResize();
  window.addEventListener("resize", onResize);

  const observer = new MutationObserver((mutations) => {
    const isPlayerLoaded = (player: Node) => {
      if (isEmbedPlayerLoaded()) return;
      if (player instanceof HTMLDivElement === false) return;
      if (player.classList.contains("pzp") === false) return;
      if (player.classList.contains("pzp-pc--playing") === false) return;

      onPlayerLoaded();
    };

    const isLargeMode = (layout: Node) => {
      if (isEmbedPlayerLoaded()) return;
      if (layout instanceof HTMLDivElement === false) return;
      if (layout.id !== "live_player_layout") return;
      if (layout.classList.contains("is_large") === false) return;

      onLargeModeActivated();
    };

    const isSmallMode = (layout: Node) => {
      if (isEmbedPlayerLoaded() === false) return;
      if (layout instanceof HTMLDivElement === false) return;
      if (layout.id !== "live_player_layout") return;

      if (layout.classList.contains("is_large") === true) return;

      // large 모드가 풀림 => large 모드 활성화
      clickElement("button.pzp-viewmode-button");
    };

    mutations.forEach((mutation) => {
      isPlayerLoaded(mutation.target);
      isLargeMode(mutation.target);
      isSmallMode(mutation.target);
    });
  });

  observer.observe(document.body, {
    subtree: true,
    attributes: true,
  });

  setTimeout(() => {
    observer.disconnect();
  }, 15000);
}

function clickElement(selector: string) {
  document.querySelector<HTMLButtonElement>(selector)?.click();
}

function onPlayerLoaded() {
  // 넓은 화면 활성화
  clickElement("button.pzp-viewmode-button");

  // 채팅 접기
  clickElement("button[class^='live_chatting_header_button']");
}

function onLargeModeActivated() {
  // 임베드 플레이어가 적용됨을 알리는 클래스 추가
  document.body.classList.add(EMBED_CLASS_NAME);

  // load 이벤트 emit
  embedEvent.emit("load");
}

function onResize() {
  const isMinified = window.innerWidth < MINIFIED_PLAYER_WIDTH;
  document.body.classList.toggle("minified", isMinified);
}

function isEmbedPlayerLoaded() {
  return document.body.classList.contains(EMBED_CLASS_NAME);
}

export function removeEmbedPlayer() {
  document.body.classList.remove(EMBED_CLASS_NAME);
}
