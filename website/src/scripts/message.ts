import {
  ChzzkChannelInfoResponse,
  ChzzkChannelSearchResponse,
  ChzzkLiveInfoResponse,
  ChzzkLiveListResponse,
  ChzzkLiveSearchResponse,
  ClientMessageEvent,
  createChzzkChannelInfoRequestMessage,
  createChzzkChannelSearchRequestMessage,
  createChzzkLiveInfoRequestMessage,
  createChzzkLiveListRequestMessage,
  createChzzkLiveSearchRequestMessage,
  createPlayerControlMessage,
  HandshakeIframeMessage,
  isChzzkChannelInfoResponseMessage,
  isChzzkChannelSearchResponseMessage,
  isChzzkLiveInfoResponseMessage,
  isChzzkLiveListResponseMessage,
  isChzzkLiveSearchResponseMessage,
  PlayerControlMessageData,
  PlayerEventMessage,
  PlayerEventType,
  ReceiverType,
  WebsiteClient,
  WindowClient,
} from "@chzstream/message";

const iframeClientMap = new Map<number, number>();

export const MessageClient = WebsiteClient.isAvailable()
  ? new WebsiteClient()
  : new WindowClient();

export async function initializeClientMessage() {
  console.log("[website-client] initialize");

  MessageClient.addEventListener("iframe-handshake", onIframeHandshake);

  await MessageClient.connect();

  if (MessageClient.active === false) {
    alert("확장프로그램을 인식하지 못했습니다!");
    return;
  }
}

export function getIframeId(clientId: number): number | null {
  if (iframeClientMap.has(clientId) === false) {
    return null;
  }

  return iframeClientMap.get(clientId)!;
}

export function getClientId(iframeId: number): number | null {
  for (const [clientId, id] of iframeClientMap) {
    if (id === iframeId) {
      return clientId;
    }
  }

  return null;
}

export type PlayerEvent = ClientMessageEvent<PlayerEventMessage>;

export async function requestChzzkChannelInfo(
  uuid: string
): Promise<ChzzkChannelInfoResponse | null> {
  if (MessageClient.active === false) {
    return null;
  }

  const requestMessage = createChzzkChannelInfoRequestMessage(
    {
      sender: MessageClient.id,
      receiver: ReceiverType.Extension,
    },
    { uuid }
  );

  const response = await MessageClient.request(
    requestMessage,
    isChzzkChannelInfoResponseMessage
  );

  return response.data.body;
}

export async function requestChzzkChannelSearch(
  query: string,
  offset?: number,
  size?: number
): Promise<ChzzkChannelSearchResponse | null> {
  if (MessageClient.active === false) {
    return null;
  }

  const requestMessage = createChzzkChannelSearchRequestMessage(
    {
      sender: MessageClient.id,
      receiver: ReceiverType.Extension,
    },
    { query, offset, size }
  );

  const response = await MessageClient.request(
    requestMessage,
    isChzzkChannelSearchResponseMessage
  );

  return response.data.body;
}

export async function requestChzzkLiveInfo(
  uuid: string
): Promise<ChzzkLiveInfoResponse | null> {
  if (MessageClient.active === false) {
    return null;
  }

  const requestMessage = createChzzkLiveInfoRequestMessage(
    {
      sender: MessageClient.id,
      receiver: ReceiverType.Extension,
    },
    { uuid }
  );

  const response = await MessageClient.request(
    requestMessage,
    isChzzkLiveInfoResponseMessage
  );

  return response.data.body;
}

export async function requestChzzkLiveSearch(
  query: string,
  offset?: number,
  size?: number
): Promise<ChzzkLiveSearchResponse | null> {
  if (MessageClient.active === false) {
    return null;
  }

  const requestMessage = createChzzkLiveSearchRequestMessage(
    {
      sender: MessageClient.id,
      receiver: ReceiverType.Extension,
    },
    { query, offset, size }
  );

  const response = await MessageClient.request(
    requestMessage,
    isChzzkLiveSearchResponseMessage
  );

  return response.data.body;
}

export async function requestChzzkLiveList(
  offset?: {
    id: number;
    count: number;
  },
  size?: number
): Promise<ChzzkLiveListResponse | null> {
  if (MessageClient.active === false) {
    return null;
  }

  const requestMessage = createChzzkLiveListRequestMessage(
    {
      sender: MessageClient.id,
      receiver: ReceiverType.Extension,
    },
    { offset, size }
  );

  const response = await MessageClient.request(
    requestMessage,
    isChzzkLiveListResponseMessage
  );

  return response.data.body;
}

export async function sendPlayerControl(
  blockId: number,
  data: PlayerControlMessageData
) {
  if (MessageClient.active === false) {
    return;
  }

  const id = getClientId(blockId);
  if (id === null) {
    throw new Error(`blockId not found: ${blockId}`);
  }

  const message = createPlayerControlMessage(
    {
      sender: MessageClient.id,
      receiver: id,
    },
    data
  );

  MessageClient.send(message);
}

function onIframeHandshake({
  detail: message,
}: ClientMessageEvent<HandshakeIframeMessage>) {
  const clientId = message.sender;
  const iframeId = message.data.iframeId;

  if (clientId === null) {
    console.error("[message] iframe-handshake: sender is null", message);
    return;
  }

  console.log("[message] got iframe handshake", iframeId, clientId, message);

  iframeClientMap.set(clientId, iframeId);
}
