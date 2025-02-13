import { atom, useAtom } from "jotai";
import {
  MessageClient,
  requestChzzkChannelInfo,
  requestChzzkChannelSearch,
  requestChzzkLiveList,
  requestChzzkLiveSearch,
} from "src/scripts/message.ts";
import { getChzzkUuid } from "./chzzk-util.ts";

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
    const response = await requestChzzkLiveList();
    if (response === null) {
      setRecommendResult([]);
      return;
    }

    const items = response.map((item) => ({
      uuid: item.channel.channelId,
      title: item.channel.channelName,
      description: item.liveTitle,
      profileImage: item.channel.channelImageUrl,
      countPrefix: "시청자",
      count: item.concurrentUserCount,
      verified: item.channel.verifiedMark,
    }));

    setRecommendResult(items);
  }

  async function updateChannel() {
    const response = await requestChzzkChannelSearch(query);
    if (response === null) {
      setChannelResult([]);
      return;
    }

    const items = response.map((item) => ({
      uuid: item.channel.channelId,
      title: item.channel.channelName,
      description: item.channel.channelDescription,
      profileImage: item.channel.channelImageUrl,
      countPrefix: "팔로우",
      count: item.channel.followerCount,
      verified: item.channel.verifiedMark,
    }));

    setChannelResult(items);
  }

  async function updateLive() {
    const response = await requestChzzkLiveSearch(query);
    if (response === null) {
      setLiveResult([]);
      return;
    }

    const items = response
      .sort((a, b) => b.live.concurrentUserCount - a.live.concurrentUserCount)
      .map((item) => ({
        uuid: item.channel.channelId,
        title: item.channel.channelName,
        description: item.live.liveTitle,
        profileImage: item.channel.channelImageUrl,
        countPrefix: "시청자",
        count: item.live.concurrentUserCount,
        verified: item.channel.verifiedMark,
      }));

    setLiveResult(items);
  }

  async function updateUuid(uuid: string) {
    if (MessageClient.active === false) {
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

    const response = await requestChzzkChannelInfo(uuid);
    if (response === null || response.channelId === null) {
      setChannelResult([]);
      return;
    }

    const items = [
      {
        uuid: response.channelId,
        title: response.channelName,
        description: response.channelDescription,
        profileImage: response.channelImageUrl,
        countPrefix: "팔로우",
        count: response.followerCount,
        verified: response.verifiedMark,
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
