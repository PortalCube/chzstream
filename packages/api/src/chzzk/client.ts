import { APIClient, APIClientOptions } from "@api/client.ts";

import { getChannel } from "@api/chzzk/endpoints/get-channel.ts";
import { getLiveList } from "@api/chzzk/endpoints/get-live-list.ts";
import { getLiveStatus } from "@api/chzzk/endpoints/get-live-status.ts";
import { getLive } from "@api/chzzk/endpoints/get-live.ts";
import { searchChannel } from "@api/chzzk/endpoints/search-channel.ts";
import { searchLive } from "@api/chzzk/endpoints/search-live.ts";
import { searchTag } from "@api/chzzk/endpoints/search-tag.ts";

export type ChzzkClientOptions = Omit<APIClientOptions, "baseUrl"> | null;
export class ChzzkClient extends APIClient {
  constructor(options?: ChzzkClientOptions) {
    super({ ...options, baseUrl: "https://api.chzzk.naver.com" });
  }

  getChannel = getChannel;
  getLiveList = getLiveList;
  getLiveStatus = getLiveStatus;
  getLive = getLive;
  searchLive = searchLive;
  searchChannel = searchChannel;
  searchTag = searchTag;
}
