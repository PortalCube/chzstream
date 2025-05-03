import { RequestPayload } from "@chzstream/message";
import { createNanoEvents } from "nanoevents";
import "@extension/utils/chzzk-embed-player.scss";

const EMBED_CLASS_NAME = "chzzk-embed-player";

const MINIFIED_PLAYER_WIDTH = 360;

let lockPlayerEventDate: number | null = null;

let loaded = false;

const debouncedPlayerChange = debounce(onPlayerChange, 100);

type EmbedEvent = {
  load: () => void;
  change: (data: RequestPayload<"video-status">) => void;
};

export const chzzkEmbedEvent = createNanoEvents<EmbedEvent>();

export function isChzzkEmbedPlayer() {
  const url = new URL(window.location.href);
  const hasEmbedParam = url.searchParams.has("embed", "true");
  const isLivePage = /^\/live\/([^/]+)\/?$/g.test(url.pathname);
  return hasEmbedParam && isLivePage;
}

function getChatAreaStatus() {
  const showChatButton = getElement(
    "div[class^='live_information_player_control'] > button:nth-of-type(1)"
  );
  return showChatButton === null;
}

function setChatAreaStatus(value: boolean) {
  if (value) {
    clickElement(
      "div[class^='live_information_player_control'] > button:nth-of-type(1)"
    );
  } else {
    clickElement("button[class^='live_chatting_header_button']");
  }
}

export function makeChzzkEmbedPlayer() {
  window.addEventListener("keydown", (event) => {
    // ESC로 넓은 화면을 종료하는 것을 방지하기 위해 ESC키 이벤트 중지
    if (event.key === "Escape") {
      event.stopImmediatePropagation();
    }

    // T키로 채팅 접기/펼치기
    if (event.key === "t") {
      setChatAreaStatus(!getChatAreaStatus());
    }

    // G키로 채팅 있는 전체화면 켜기
    if (event.key === "g") {
      // 전체화면 활성화시 채팅 켜기
      if (document.fullscreenElement === null) {
        setTimeout(() => setChatAreaStatus(true), 150);
      }
      clickElement("button.pzp-fullscreen-button");
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

    const functions = [isPlayerLoaded, isLargeMode, isSmallMode];

    mutations.forEach((mutation) => {
      functions.forEach((fn) => fn(mutation.target));
    });
  });

  observer.observe(document.body, {
    subtree: true,
    attributes: true,
  });
}

function getElement(selector: string) {
  return document.querySelector<HTMLButtonElement>(selector);
}

function clickElement(selector: string) {
  const element = document.querySelector<HTMLButtonElement>(selector);

  if (element) {
    element.click();
    return true;
  }

  return false;
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

  // 볼륨 변경 이벤트 등록
  registerVolumeChangeEvent();

  // 비디오 로드 체크
  registerVideoLoadedEvent();
}

function registerVideoLoadedEvent() {
  const videoElement = document.querySelector<HTMLVideoElement>(".pzp video");
  if (videoElement === null) {
    throw new Error("Video element not found");
  }

  const emit = () => {
    chzzkEmbedEvent.emit("load");
    loaded = true;
  };

  if (videoElement.readyState >= 3) {
    emit();
  } else {
    videoElement.addEventListener("loadeddata", emit, { once: true });
  }
}

function registerVolumeChangeEvent() {
  const videoElement = document.querySelector<HTMLVideoElement>(".pzp video");
  if (videoElement === null) return;

  videoElement.addEventListener("volumechange", () => {
    if (loaded === false) {
      if (videoElement.volume !== 0) {
        videoElement.volume = 0;
      }
      return;
    }

    if (isPlayerEventLocked()) {
      return;
    }

    debouncedPlayerChange();
  });
}

function isPlayerEventLocked() {
  if (lockPlayerEventDate === null) return false;

  const now = Date.now();
  return now < lockPlayerEventDate + 100;
}

function debounce(func: () => void, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return () => {
    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = null;
      func();
    }, delay);
  };
}

function onPlayerChange() {
  if (loaded === false) return;

  const volume = getVolume();
  const muted = getMuted();

  const data: RequestPayload<"video-status"> = {};

  if (volume !== null) data.volume = volume;
  if (muted !== null) data.muted = muted;

  chzzkEmbedEvent.emit("change", data);
}

function onResize() {
  const isMinified = window.innerWidth < MINIFIED_PLAYER_WIDTH;
  document.body.classList.toggle("minified", isMinified);
}

function isEmbedPlayerLoaded() {
  return document.body.classList.contains(EMBED_CLASS_NAME);
}

function getVolume() {
  const videoElement = document.querySelector<HTMLVideoElement>(".pzp video");
  if (videoElement === null) return null;

  return Math.round(videoElement.volume * 100);
}

function setVolume(value: number) {
  const videoElement = document.querySelector<HTMLVideoElement>(".pzp video");
  if (videoElement === null) return;

  const volume = value / 100;
  videoElement.volume = volume;
}

function getMuted() {
  const videoElement = document.querySelector<HTMLVideoElement>(".pzp video");
  if (videoElement === null) return null;

  return videoElement.muted;
}

function setMuted(value: boolean) {
  const videoElement = document.querySelector<HTMLVideoElement>(".pzp video");
  if (videoElement === null) return;

  videoElement.muted = value;
}

export function setPlayerControl(data: RequestPayload<"video-status">) {
  const videoElement = document.querySelector<HTMLVideoElement>(".pzp video");
  if (videoElement === null) return;

  // if (videoElement.readyState !== 4) {
  //   await waitForPlayerControl(videoElement);
  // }

  lockPlayerEventDate = Date.now();

  if (data.volume !== undefined) {
    setVolume(data.volume);
  }

  if (data.muted !== undefined) {
    setMuted(data.muted);
  }
}

export function removeChzzkEmbedPlayer() {
  document.body.classList.remove(EMBED_CLASS_NAME);
}
