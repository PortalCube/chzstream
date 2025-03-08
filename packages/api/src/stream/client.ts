import { ChzzkClient } from "@api/chzzk/client.ts";
import { AxiosRequestConfig } from "axios";

import { getChannel } from "@api/stream/endpoints/get-channel.ts";
import { getLiveList } from "@api/stream/endpoints/get-live-list.ts";
import { searchChannel } from "@api/stream/endpoints/search-channel.ts";
import { searchLive } from "@api/stream/endpoints/search-live.ts";

export type StreamClientOptions = Partial<{
  headers: AxiosRequestConfig["headers"];
}> | null;

export class StreamClient {
  readonly chzzkClient: ChzzkClient;

  constructor(options?: StreamClientOptions) {
    this.chzzkClient = new ChzzkClient(options);
  }

  getChannel = getChannel;
  getLiveList = getLiveList;
  searchChannel = searchChannel;
  searchLive = searchLive;
}

export type Platform = "chzzk"; // | "soop" | "youtube" | "twitch";
