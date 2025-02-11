import {
  createHandshakeIframeMessage,
  createIframePointerMoveMessage,
  createPlayerControlMessage,
  createPlayerEventMessage,
  IframeClient,
  PlayerControlMessage,
  PlayerControlMessageData,
  PlayerEventType,
} from "@chzstream/message";
import { getNumberParam } from "../url.ts";

const client = new IframeClient();

const parentId: number | null = getNumberParam("_csp");
const iframeId: number | null = getNumberParam("_csi");

function isNumber(value: number | null): value is number {
  return value !== null;
}

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

  // 이벤트 리스너 등록
  client.addEventListener("player-control", onPlayerControlMessage);

  await client.connect();

  const handshakeMessage = createHandshakeIframeMessage(
    {
      sender: client.id,
      receiver: parentId,
    },
    {
      iframeId,
    }
  );

  console.log("[iframe-client] initialize", handshakeMessage);

  await client.send(handshakeMessage);
}

export async function sendPlayerEvent(event: PlayerEventType) {
  if (client.active === false) {
    return;
  }

  if (isNumber(parentId) === false) {
    return;
  }

  if (isNumber(iframeId) === false) {
    return;
  }

  const message = createPlayerEventMessage(
    {
      sender: client.id,
      receiver: parentId,
    },
    {
      event,
    }
  );

  await client.send(message);
}

export async function sendPointerMove(clientX: number, clientY: number) {
  if (client.active === false) {
    return;
  }

  if (isNumber(parentId) === false) {
    return;
  }

  if (isNumber(iframeId) === false) {
    return;
  }

  const message = createIframePointerMoveMessage(
    {
      sender: client.id,
      receiver: parentId,
    },
    {
      clientX,
      clientY,
    }
  );

  await client.send(message);
}

export async function sendPlayerControl(data: PlayerControlMessageData) {
  if (client.active === false) {
    return;
  }

  if (isNumber(parentId) === false) {
    return;
  }

  if (isNumber(iframeId) === false) {
    return;
  }

  const message = createPlayerControlMessage(
    {
      sender: client.id,
      receiver: parentId,
    },
    data
  );

  await client.send(message);
}

function onPlayerControlMessage(message: PlayerControlMessage) {
  setPlayerControl(message.data);
}
