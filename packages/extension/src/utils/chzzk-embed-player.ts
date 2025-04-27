import { RequestPayload } from "@chzstream/message";
import { createNanoEvents } from "nanoevents";
import "@extension/utils/chzzk-embed-player.scss";

const EMBED_CLASS_NAME = "chzzk-embed-player";

const MINIFIED_PLAYER_WIDTH = 360;

const QUALITY_ARRAY = [360, 480, 720, 1080];

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

    const isQualityChanged = (item: Node) => {
      if (item instanceof HTMLLIElement === false) return;
      if (
        item.classList.contains("pzp-ui-setting-pane-item--checked") === false
      )
        return;
      if (item.classList.contains("pzp-ui-setting-quality-item") === false)
        return;

      if (loaded === false) {
        return;
      }

      if (isPlayerEventLocked()) {
        return;
      }

      debouncedPlayerChange();
    };

    const isSmallMode = (layout: Node) => {
      if (isEmbedPlayerLoaded() === false) return;
      if (layout instanceof HTMLDivElement === false) return;
      if (layout.id !== "live_player_layout") return;
      if (layout.classList.contains("is_large") === true) return;

      // large 모드가 풀림 => large 모드 활성화
      clickElement("button.pzp-viewmode-button");
    };

    const functions = [
      isPlayerLoaded,
      isLargeMode,
      isSmallMode,
      isQualityChanged,
    ];

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

  const quality = getQuality();
  const volume = getVolume();
  const muted = getMuted();

  const data: RequestPayload<"video-status"> = {};

  if (volume !== null) data.volume = volume;
  if (muted !== null) data.muted = muted;
  if (quality !== null) data.quality = quality;

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

function getQuality() {
  const qualityElement = document.querySelector<HTMLLIElement>(
    ".pzp-ui-setting-quality-item.pzp-ui-setting-pane-item--checked"
  );
  if (qualityElement === null) return null;

  return extractQualityValue(qualityElement);
}

function setQuality(value: number) {
  const quality = QUALITY_ARRAY[value];
  if (quality === undefined) {
    throw new Error(`Invalid quality: ${value}`);
  }

  // quality보다 작은 해상도 중 가장 높은 해상도를 선택
  const qualityElements = Array.from(
    document.querySelectorAll<HTMLLIElement>(".pzp-ui-setting-quality-item")
  );

  let selectedQuality: number | null = null;
  let selectedElement: HTMLLIElement | null = null;

  for (const element of qualityElements) {
    const quality = extractQualityValue(element);
    if (quality === null) continue;

    if (quality > value) continue;

    if (selectedQuality === null || selectedQuality < quality) {
      selectedQuality = quality;
      selectedElement = element;
    }
  }

  if (selectedElement === null) return;
  selectedElement.dispatchEvent(new Event("focus"));
  selectedElement.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function waitForPlayerControl(
  videoElement: HTMLVideoElement
): Promise<void> {
  return new Promise((resolve, reject) => {
    const time = setTimeout(() => {
      reject(new Error("Failed to wait for player control"));
    }, 5000);

    videoElement.addEventListener("loadeddata", async () => {
      // 화질이 너무 빨리 변경되면 플레이어가 일시 정지되는 문제가 있음
      await sleep(100);
      resolve();
      clearTimeout(time);
    });
  });
}

export function setPlayerControl(data: RequestPayload<"video-status">) {
  const videoElement = document.querySelector<HTMLVideoElement>(".pzp video");
  if (videoElement === null) return;

  // if (videoElement.readyState !== 4) {
  //   await waitForPlayerControl(videoElement);
  // }

  lockPlayerEventDate = Date.now();

  if (data.quality !== undefined) {
    setQuality(data.quality);
  }

  if (data.volume !== undefined) {
    setVolume(data.volume);
  }

  if (data.muted !== undefined) {
    setMuted(data.muted);
  }
}

export function setVideoStyle(data: RequestPayload<"video-style">) {
  const videoElement = document.querySelector<HTMLVideoElement>(".pzp video");
  if (videoElement === null) return;

  videoElement.style.objectFit = data.objectFit;
  videoElement.style.objectPosition = `${data.objectPosition.horizontal} ${data.objectPosition.vertical}`;
}

function extractQualityValue(element: HTMLLIElement) {
  const qualityTextElement = element.querySelector<HTMLSpanElement>(
    ".pzp-ui-setting-quality-item__prefix"
  );
  if (qualityTextElement === null) return null;

  const qualityText = qualityTextElement.textContent;
  if (qualityText === null) return null;

  const qualityValue = Number(qualityText.trim().replaceAll(/\D/g, ""));

  const quality = QUALITY_ARRAY.findIndex((value) => value === qualityValue);
  if (quality === -1) return null;

  return quality;
}

export function removeChzzkEmbedPlayer() {
  document.body.classList.remove(EMBED_CLASS_NAME);
}
