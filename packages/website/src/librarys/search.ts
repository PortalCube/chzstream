import { getChzzkUuid } from "@web/librarys/chzzk-util.ts";
import { MessageClient } from "@web/scripts/message.ts";
import { atom, useAtom } from "jotai";

export enum SearchCategory {
  Summary = "summary",
  Channel = "channel",
  Live = "live",
  Recommend = "recommend",
}

export type SearchItemType = {
  uuid: string;
  title: string;
  description: string;
  profileImage: string | null;
  countPrefix: string;
  count: number;
  verified: boolean;
};

const queryAtom = atom<string>("");
const categoryAtom = atom<SearchCategory>(SearchCategory.Recommend);
const loadingAtom = atom<boolean>(false);
const recommendResultAtom = atom<SearchItemType[]>([]);
const liveResultAtom = atom<SearchItemType[]>([]);
const channelResultAtom = atom<SearchItemType[]>([]);

export function useSearchModal() {
  const [query, setQuery] = useAtom(queryAtom);
  const [category, setCategory] = useAtom(categoryAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [recommendResult, setRecommendResult] = useAtom(recommendResultAtom);
  const [liveResult, setLiveResult] = useAtom(liveResultAtom);
  const [channelResult, setChannelResult] = useAtom(channelResultAtom);

  async function showRecommend() {
    setQuery("");
    setCategory(SearchCategory.Recommend);
    setLoading(true);
    await updateRecommendLive();
    setLoading(false);
  }

  async function showSummary() {
    setCategory(SearchCategory.Summary);
    setLoading(true);
    await updateChannel();
    await updateLive();
    setLoading(false);
  }

  async function showUuid(uuid: string) {
    setCategory(SearchCategory.Summary);
    setLoading(true);
    setLiveResult([]);
    await updateUuid(uuid);
    setLoading(false);
  }

  async function showChannel() {
    setCategory(SearchCategory.Channel);
    setLoading(true);
    await updateChannel();
    setLoading(false);
  }

  async function showLive() {
    setCategory(SearchCategory.Live);
    setLoading(true);
    await updateLive();
    setLoading(false);
  }

  async function updateRecommendLive() {
    if (MessageClient === null) {
      setRecommendResult([]);
      return;
    }

    const response = await MessageClient.request("stream-get-live-list", {
      platform: "chzzk",
      size: 50,
    });

    const data = response.data.result;
    if (data === null) {
      setRecommendResult([]);
      return;
    }

    const items = data.map((item) => ({
      uuid: item.channelId,
      title: item.channelName,
      description: item.liveTitle ?? "",
      profileImage: item.channelImageUrl ?? "",
      countPrefix: "시청자",
      count: item.liveViewer,
      verified: item.channelVerified,
    }));

    setRecommendResult(items);
  }

  async function updateChannel() {
    if (MessageClient === null) {
      setChannelResult([]);
      return;
    }

    const response = await MessageClient.request("stream-search-channel", {
      platform: "chzzk",
      query,
      size: 50,
    });
    const data = response.data.result;

    if (data === null) {
      setChannelResult([]);
      return;
    }

    const items = data.map((item) => ({
      uuid: item.channelId,
      title: item.channelName,
      description: item.channelDescription,
      profileImage: item.channelImageUrl,
      countPrefix: "팔로우",
      count: item.channelFollower,
      verified: item.channelVerified,
    }));

    setChannelResult(items);
  }

  async function updateLive() {
    if (MessageClient === null) {
      setLiveResult([]);
      return;
    }

    const response = await MessageClient.request("stream-search-live", {
      platform: "chzzk",
      query,
      size: 50,
    });

    const data = response.data.result;
    if (data === null) {
      setLiveResult([]);
      return;
    }

    const items = data
      .sort((a, b) => b.liveViewer - a.liveViewer)
      .map((item) => ({
        uuid: item.channelId,
        title: item.channelName,
        description: item.liveTitle ?? "",
        profileImage: item.channelImageUrl ?? "",
        countPrefix: "시청자",
        count: item.liveViewer,
        verified: item.channelVerified,
      }));

    setLiveResult(items);
  }

  async function updateUuid(uuid: string) {
    if (MessageClient === null) {
      setChannelResult([
        {
          uuid: uuid,
          title: "알 수 없는 채널",
          description: `아이디: ${uuid}`,
          profileImage: null,
          countPrefix: "팔로우",
          count: 0,
          verified: false,
        },
      ]);
      return;
    }

    const response = await MessageClient.request("stream-get-channel", {
      platform: "chzzk",
      id: uuid,
    });
    const data = response.data;
    if (data === null || data.channelId === null) {
      setChannelResult([]);
      return;
    }

    const items = [
      {
        uuid: data.channelId,
        title: data.channelName,
        description: data.channelDescription,
        profileImage: data.channelImageUrl,
        countPrefix: "팔로우",
        count: data.channelFollower,
        verified: data.channelVerified,
      },
    ];

    setChannelResult(items);
  }

  function search() {
    if (query === "") {
      showRecommend();
      return;
    }

    const uuid = getChzzkUuid(query);

    if (uuid !== null) {
      showUuid(uuid);
      return;
    }

    showSummary();
  }

  return {
    query,
    category,
    loading,
    recommendResult,
    liveResult,
    channelResult,
    setQuery,
    setCategory,
    search,
    showRecommend,
    showSummary,
    showChannel,
    showLive,
  };
}
