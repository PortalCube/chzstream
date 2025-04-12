import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import { getChzzkUuid } from "@web/librarys/chzzk-util.ts";
import { atom, useAtom, useAtomValue } from "jotai";

export type SearchCategory = "summary" | "channel" | "live" | "recommend";

export type SearchItemType = {
  uuid: string;
  title: string;
  description: string;
  channelImage: string | null;
  thumbnailImage: string | null;
  countPrefix: string;
  count: number;
  liveStatus: boolean;
  verified: boolean;
};

const queryAtom = atom<string>("");
const categoryAtom = atom<SearchCategory>("recommend");
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
  const messageClient = useAtomValue(messageClientAtom);

  async function showRecommend() {
    setQuery("");
    setCategory("recommend");
    setLoading(true);
    await updateRecommendLive();
    setLoading(false);
  }

  async function showSummary() {
    setCategory("summary");
    setLoading(true);
    await updateChannel();
    await updateLive();
    setLoading(false);
  }

  async function showUuid(uuid: string) {
    setCategory("summary");
    setLoading(true);
    setLiveResult([]);
    await updateUuid(uuid);
    setLoading(false);
  }

  async function showChannel() {
    setCategory("channel");
    setLoading(true);
    await updateChannel();
    setLoading(false);
  }

  async function showLive() {
    setCategory("live");
    setLoading(true);
    await updateLive();
    setLoading(false);
  }

  async function updateRecommendLive() {
    if (messageClient === null) {
      setRecommendResult([]);
      return;
    }

    const response = await messageClient.request("stream-get-live-list", {
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
      channelImage: item.channelImageUrl,
      thumbnailImage: item.liveThumbnailUrl,
      countPrefix: "시청자",
      count: item.liveViewer,
      liveStatus: true,
      verified: item.channelVerified,
    }));

    setRecommendResult(items);
  }

  async function updateChannel() {
    if (messageClient === null) {
      setChannelResult([]);
      return;
    }

    const response = await messageClient.request("stream-search-channel", {
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
      channelImage: item.channelImageUrl,
      thumbnailImage: null,
      countPrefix: "팔로우",
      count: item.channelFollower,
      liveStatus: item.liveStatus,
      verified: item.channelVerified,
    }));

    setChannelResult(items);
  }

  async function updateLive() {
    if (messageClient === null) {
      setLiveResult([]);
      return;
    }

    const liveResponse = await messageClient.request("stream-search-live", {
      platform: "chzzk",
      query,
      size: 50,
    });

    const tagResponse = await messageClient.request("stream-search-tag", {
      platform: "chzzk",
      query,
      size: 50,
    });

    const data = [...liveResponse.data.result, ...tagResponse.data.result];

    console.log(liveResponse.data);
    console.log(tagResponse.data);

    const items = data
      // 중복 제거 & 50개 제한
      .filter(
        (item, index, array) =>
          array.findIndex((el) => el.channelId === item.channelId) === index &&
          index < 50
      )
      .sort((a, b) => b.liveViewer - a.liveViewer)
      .map((item) => ({
        uuid: item.channelId,
        title: item.channelName,
        description: item.liveTitle ?? "",
        channelImage: item.channelImageUrl,
        thumbnailImage: item.liveThumbnailUrl,
        countPrefix: "시청자",
        count: item.liveViewer,
        liveStatus: true,
        verified: item.channelVerified,
      }));

    setLiveResult(items);
  }

  async function updateUuid(uuid: string) {
    if (messageClient === null) {
      setChannelResult([
        {
          uuid: uuid,
          title: `치지직 UUID ${uuid}`,
          description: `제한 모드에서는 채널의 정보를 가져올 수 없습니다.`,
          channelImage: null,
          thumbnailImage: null,
          countPrefix: "팔로우",
          count: 0,
          liveStatus: false,
          verified: false,
        },
      ]);
      return;
    }

    const response = await messageClient.request("stream-get-channel", {
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
        channelImage: data.channelImageUrl,
        thumbnailImage: data.liveThumbnailUrl,
        countPrefix: "팔로우",
        count: data.channelFollower,
        liveStatus: data.liveStatus,
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
