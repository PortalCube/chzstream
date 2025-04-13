import {
  ContentClient,
  createContentClient,
  PayloadType,
  RequestMessage,
  RequestPayload,
  ResponsePayload,
} from "@chzstream/message";
import { setVideoStyle } from "@extension/utils/chzzk-embed-player.ts";

export let contentClient: ContentClient;

// 메세지 모듈 시작
export async function initializeClientMessage() {
  if (parentId === null) {
    console.error("Website ID가 제대로 지정되지 않았습니다.");
    return;
  }

  if (iframeId === null) {
    console.error("Iframe ID가 제대로 지정되지 않았습니다.");
    return;
  }

  contentClient = await createContentClient(parentId, iframeId);

  // 이벤트 리스너 등록
  contentClient.on("video-status", onPlayerControlMessage);
  contentClient.on("video-style", onVideoStyleMessage);
}

export function send<T extends PayloadType>(type: T, data: RequestPayload<T>) {
  if (parentId === null) {
    throw new Error("parentId is null");
  }

  contentClient.send(type, data, {
    type: "website",
    id: parentId,
  });
}

export function reply<T extends PayloadType>(
  id: string,
  type: T,
  data: ResponsePayload<T>
) {
  if (parentId === null) {
    throw new Error("parentId is null");
  }

  contentClient.reply(id, type, data, {
    type: "website",
    id: parentId,
  });
}

function onPlayerControlMessage(message: RequestMessage<"video-status">) {
  setPlayerControl(message.data);
}

function onVideoStyleMessage(message: RequestMessage<"video-style">) {
  setVideoStyle(message.data);
}
