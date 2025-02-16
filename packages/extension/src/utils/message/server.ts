import type {
  ChzzkChannelInfoRequestMessage,
  ChzzkChannelSearchRequestMessage,
  ChzzkLiveInfoRequestMessage,
  ChzzkLiveListRequestMessage,
  ChzzkLiveSearchRequestMessage,
  ServerMessageEvent,
} from "@chzstream/message";

import {
  createChzzkChannelInfoResponseMessage,
  createChzzkChannelSearchResponseMessage,
  createChzzkLiveInfoResponseMessage,
  createChzzkLiveListResponseMessage,
  createChzzkLiveSearchResponseMessage,
  ExtensionServer,
} from "@chzstream/message";
import { getChannelInfo } from "@extension/utils/api/chzzk/channel-info.ts";
import { getLiveInfo } from "@extension/utils/api/chzzk/live-info.ts";
import { getChannelSearch } from "@extension/utils/api/chzzk/channel-search.ts";
import { getLiveSearch } from "@extension/utils/api/chzzk/live-search.ts";
import { getLiveList } from "@extension/utils/api/chzzk/live-list.ts";

const server = new ExtensionServer([
  "https://chzstream.vercel.app",
  "https://chzstream.app",
  "http://localhost:5286",
]);

// 메세지 모듈 시작
export function initializeServerMessage() {
  server.addEventListener("chzzk-channel-info", onChzzkChannelInfoRequest);
  server.addEventListener("chzzk-channel-search", onChzzkChannelSearchRequest);
  server.addEventListener("chzzk-live-info", onChzzkLiveInfoRequest);
  server.addEventListener("chzzk-live-search", onChzzkLiveSearchRequest);
  server.addEventListener("chzzk-live-list", onChzzkLiveListRequest);

  server.listen();
}

async function onChzzkChannelInfoRequest(
  event: ServerMessageEvent<ChzzkChannelInfoRequestMessage>
) {
  const { message, port } = event.detail;
  const data = await getChannelInfo(message.data.uuid);

  const responseMessage = createChzzkChannelInfoResponseMessage(
    {
      id: message.id,
      sender: 0,
      receiver: message.sender ?? -1,
    },
    data
  );

  console.log("[extension-server] ChzzkChannelInfo", responseMessage);
  port.postMessage(responseMessage);
}

async function onChzzkLiveInfoRequest(
  event: ServerMessageEvent<ChzzkLiveInfoRequestMessage>
) {
  const { message, port } = event.detail;
  const data = await getLiveInfo(message.data.uuid);

  const responseMessage = createChzzkLiveInfoResponseMessage(
    {
      id: message.id,
      sender: 0,
      receiver: message.sender ?? -1,
    },
    data
  );

  console.log("[extension-server] ChzzkLiveInfo", responseMessage);
  port.postMessage(responseMessage);
}

async function onChzzkChannelSearchRequest(
  event: ServerMessageEvent<ChzzkChannelSearchRequestMessage>
) {
  const { message, port } = event.detail;
  const { query, offset, size } = message.data;
  const data = await getChannelSearch(query, offset, size);

  const responseMessage = createChzzkChannelSearchResponseMessage(
    {
      id: message.id,
      sender: 0,
      receiver: message.sender ?? -1,
    },
    data
  );

  console.log("[extension-server] ChzzkChannelSearch", responseMessage);
  port.postMessage(responseMessage);
}

async function onChzzkLiveSearchRequest(
  event: ServerMessageEvent<ChzzkLiveSearchRequestMessage>
) {
  const { message, port } = event.detail;
  const { query, offset, size } = message.data;
  const data = await getLiveSearch(query, offset, size);

  const responseMessage = createChzzkLiveSearchResponseMessage(
    {
      id: message.id,
      sender: 0,
      receiver: message.sender ?? -1,
    },
    data
  );

  console.log("[extension-server] ChzzkLiveSearch", responseMessage);
  port.postMessage(responseMessage);
}

async function onChzzkLiveListRequest(
  event: ServerMessageEvent<ChzzkLiveListRequestMessage>
) {
  const { message, port } = event.detail;
  const { offset, size } = message.data;
  const data = await getLiveList(offset, size);

  const responseMessage = createChzzkLiveListResponseMessage(
    {
      id: message.id,
      sender: 0,
      receiver: message.sender ?? -1,
    },
    data
  );

  console.log("[extension-server] ChzzkLiveList", responseMessage);
  port.postMessage(responseMessage);
}
