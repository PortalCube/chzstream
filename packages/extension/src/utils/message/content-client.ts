import {
  ContentClient,
  createContentClient,
  RequestMessage,
} from "@chzstream/message";

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
}

function onPlayerControlMessage(message: RequestMessage<"video-status">) {
  setPlayerControl(message.data);
}
