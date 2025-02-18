import { APIClient, APIClientOptions } from "@api/client.ts";

import { getChannel } from "@api/chzzk/endpoints/get-channel";
import { getLiveList } from "@api/chzzk/endpoints/get-live-list";
import { getLiveStatus } from "@api/chzzk/endpoints/get-live-status";
import { getLive } from "@api/chzzk/endpoints/get-live";
import { searchChannel } from "@api/chzzk/endpoints/search-channel";
import { searchLive } from "@api/chzzk/endpoints/search-live";

export type ChzzkClientOptions = Omit<APIClientOptions, "baseUrl"> | null;
export class ChzzkClient extends APIClient {
  constructor(options?: ChzzkClientOptions) {
    super({ ...options, baseUrl: "https://api.chzzk.naver.com" });
  }

  getLive = getLive;
  getLiveList = getLiveList;
  getLiveStatus = getLiveStatus;
  getChannel = getChannel;
  searchLive = searchLive;
  searchChannel = searchChannel;
}
