import { StreamClient } from "@chzstream/api";
import { BackgroundClient, createBackgroundClient } from "@message/index.ts";

export let backgroundClient: BackgroundClient;

// 메세지 모듈 시작
export function initializeBackgroundClient() {
  backgroundClient = createBackgroundClient();

  const streamClient = new StreamClient();

  backgroundClient.on("stream-get-channel", async (message) => {
    const response = await streamClient.getChannel(message.data);
    backgroundClient.reply(
      message.id,
      "stream-get-channel",
      response,
      message.sender
    );
  });

  backgroundClient.on("stream-get-live-list", async (message) => {
    const response = await streamClient.getLiveList(message.data);
    backgroundClient.reply(
      message.id,
      "stream-get-live-list",
      response,
      message.sender
    );
  });

  backgroundClient.on("stream-search-channel", async (message) => {
    const response = await streamClient.searchChannel(message.data);
    backgroundClient.reply(
      message.id,
      "stream-search-channel",
      response,
      message.sender
    );
  });

  backgroundClient.on("stream-search-live", async (message) => {
    const response = await streamClient.searchLive(message.data);
    backgroundClient.reply(
      message.id,
      "stream-search-live",
      response,
      message.sender
    );
  });
}
