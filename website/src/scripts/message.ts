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
  isChzzkChannelInfoResponseMessage,
  isChzzkChannelSearchResponseMessage,
  isChzzkLiveInfoResponseMessage,
  isChzzkLiveListResponseMessage,
  isChzzkLiveSearchResponseMessage,
  PlayerEventMessage,
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

  await MessageClient.connect();

  if (MessageClient.active === false) {
    alert("확장프로그램을 인식하지 못했습니다!");
    return;
  }

  MessageClient.addEventListener("iframe-handshake", ({ detail: message }) => {
    const clientId = message.sender;
    const iframeId = message.data.iframeId;

    if (clientId === null) {
      console.error("[message] iframe-handshake: sender is null", message);
      return;
    }

    console.log("[message] got iframe handshake", iframeId, clientId, message);

    iframeClientMap.set(iframeId, clientId);
  });
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
