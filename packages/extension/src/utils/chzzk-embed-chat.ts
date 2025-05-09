import "@extension/utils/chzzk-embed-chat.scss";

const EMBED_CLASS_NAME = "chzzk-embed-chat";

const MINIFIED_CHAT_WIDTH = 280;
const MINIFIED_CHAT_HEIGHT = 360;
const MINIFIED_CHAT_NO_PINNED_HEIGHT = 480;

export function isChzzkEmbedChat() {
  const url = new URL(window.location.href);
  const hasEmbedParam = url.searchParams.has("embed", "true");
  const isChatPage = /^\/live\/([^/]+)\/chat\/?$/g.test(url.pathname);
  return hasEmbedParam && isChatPage;
}

export function makeChzzkEmbedChat() {
  // 컨테이너 최소 크기 제거
  document
    .querySelector<HTMLDivElement>("div[class^='chat_container']")
    ?.setAttribute("style", "min-width: 0px");

  // 임베드 플레이어가 적용됨을 알리는 클래스 추가
  document.body.classList.add(EMBED_CLASS_NAME);

  // 임베드 플레이어 크기가 작으면 최소화 적용
  onResize();
  window.addEventListener("resize", onResize);
}

function onResize() {
  const isWidthMinified = window.innerWidth < MINIFIED_CHAT_WIDTH;
  const isHeightMinified = window.innerHeight < MINIFIED_CHAT_HEIGHT;
  const isNoPinned = window.innerHeight < MINIFIED_CHAT_NO_PINNED_HEIGHT;

  if (isHeightMinified || isWidthMinified) {
    document.body.classList.add("minified");
  }

  document.body.classList.toggle("chat", isWidthMinified || isHeightMinified);
  document.body.classList.toggle("height", isHeightMinified);
  document.body.classList.toggle("no-pinned", isNoPinned);
}

function _isEmbedPlayerLoaded() {
  return document.body.classList.contains(EMBED_CLASS_NAME);
}
