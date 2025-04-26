import { StreamGetChannelOptions } from "@api/index.ts";
import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import {
  fetchStreamChannelAtom,
  fetchStreamLiveListAtom,
  searchStreamChannelAtom,
  searchStreamLiveAtom,
  searchStreamTagAtom,
} from "@web/librarys/api-client.ts";
import { BlockPlatform } from "@web/librarys/block.ts";
import { getChzzkChannelId } from "@web/librarys/chzzk-util.ts";
import { closeModalAtom, modalAtom } from "@web/librarys/modal.ts";
import { getYoutubeChannelId } from "@web/librarys/youtube-util.ts";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

export type SearchCategory =
  | "summary"
  | "channel"
  | "live"
  | "recommend"
  | "youtube-notice";

export type SearchItemType = {
  platform: BlockPlatform;
  channelId: string;
  liveId: string | null;
  title: string;
  description: string;
  channelImageUrl: string | null;
  liveThumbnailUrl: string | null;
  countPrefix: string;
  count: number;
  liveStatus: boolean;
  verified: boolean;
};

export type SearchItemResult = SearchItemType & {
  type: "channel" | "live";
  selected: boolean;
};

// 검색 플랫폼
export const searchPlatformAtom = atom<BlockPlatform>("chzzk");

// 검색 query
export const searchQueryAtom = atom<string>("");

// 검색 카테고리
export const searchCategoryAtom = atom<SearchCategory>("recommend");

// TODO: 언젠가 로딩 UI 추가
export const searchLoadingAtom = atom<boolean>(false);

// 검색 결과 목록
const searchResultAtom = atomWithImmer<SearchItemResult[]>([]);

// 다중 선택 여부
export const isMultiSelectAtom = atom<boolean>(false);

// 다중 선택이 허용되는지 여부
export const isMultiSelectEnabledAtom = atom<boolean>((get) => {
  const modal = get(modalAtom);
  if (modal.type !== "search") return false;
  return modal.argument.allowMultiSelect;
});

// 선택된 채널 목록
export const selectedItemsAtom = atomWithImmer<SearchItemType[]>([]);

// 라이브 검색 결과를 가져옵니다.
export const liveResultAtom = atom<SearchItemResult[]>((get) => {
  const selectedItems = get(selectedItemsAtom);
  return get(searchResultAtom)
    .filter((item) => item.type === "live")
    .map((item) => ({
      ...item,
      selected: selectedItems.some((i) => i.channelId === item.channelId),
    }));
});

// 채널 검색 결과를 가져옵니다.
export const channelResultAtom = atom<SearchItemResult[]>((get) => {
  const selectedItems = get(selectedItemsAtom);
  return get(searchResultAtom)
    .filter((item) => item.type === "channel")
    .map((item) => ({
      ...item,
      selected: selectedItems.some((i) => i.channelId === item.channelId),
    }));
});

// 채널 다중 선택 여부를 지정합니다.
export const setMultiSelectAtom = atom(
  null,
  (_get, set, isMultiSelect: boolean) => {
    set(isMultiSelectAtom, isMultiSelect);

    if (isMultiSelect === false) {
      set(selectedItemsAtom, []);
    }
  }
);

// 입력한 query와 category로 검색을 진행합니다다.
export const submitSearchAtom = atom(null, async (get, set) => {
  if (get(searchLoadingAtom) === true) return;

  set(searchResultAtom, []); // 검색 결과 초기화

  const query = get(searchQueryAtom);
  const platform = get(searchPlatformAtom);

  const result: SearchItemResult[] = [];

  if (platform === "youtube") {
    set(searchLoadingAtom, true);
    if (query === "") {
      // 안내 메세지 표시
      set(searchCategoryAtom, "youtube-notice");
    } else {
      // 채널 조회
      set(searchCategoryAtom, "summary");
    }
  } else {
    if (query === "") {
      // 인기 라이브 목록 가져오기
      set(searchCategoryAtom, "recommend");
      set(searchLoadingAtom, true);

      const recommendResult = await set(searchRecommendLiveAtom);
      result.push(...recommendResult);
    } else {
      // 전체 검색
      set(searchCategoryAtom, "summary");
      set(searchLoadingAtom, true);

      const totalResult = await set(searchItemAtom);
      result.push(...totalResult);
    }
  }

  // uuid 검색
  if (platform === "chzzk") {
    const chzzkChannelId = getChzzkChannelId(query);

    if (chzzkChannelId !== null) {
      const item = await set(searchChannelIdAtom, {
        platform: "chzzk",
        id: chzzkChannelId,
      });

      if (item !== null) {
        result.unshift(item);
      }
    }
  } else if (platform === "youtube") {
    const youtubeChannelId = getYoutubeChannelId(query);

    if (youtubeChannelId !== null) {
      const item = await set(searchChannelIdAtom, {
        ...youtubeChannelId,
        platform: "youtube",
      });

      if (item !== null) {
        result.unshift(item);
      }
    }
  }

  set(searchResultAtom, result);
  set(searchLoadingAtom, false);
});

// 라이브 목록을 시청자 내림차순으로 가져와 searchResultAtom에 저장합니다.
export const searchRecommendLiveAtom = atom(null, async (get, set) => {
  const platform = get(searchPlatformAtom);

  // Youtube 일부 기능 미지원
  if (platform === "youtube") {
    return [];
  }

  const response = await set(fetchStreamLiveListAtom, {
    platform,
    size: 50,
  });

  const data = response.result;
  if (data === null) {
    return [];
  }

  const items = data.map<SearchItemResult>((item) => ({
    platform: item.platform,
    channelId: item.channelId,
    liveId: null,
    title: item.channelName,
    description: item.liveTitle ?? "",
    channelImageUrl: item.channelImageUrl,
    liveThumbnailUrl: item.liveThumbnailUrl,
    countPrefix: "시청자",
    count: item.liveViewer,
    liveStatus: true,
    verified: item.channelVerified,
    type: "live",
    selected: false,
  }));

  return items;
});

// 주어진 query로 채널, 라이브, 태그 검색 결과를 가져와 searchResultAtom에 저장합니다.
export const searchItemAtom = atom(null, async (get, set) => {
  const platform = get(searchPlatformAtom);
  const query = get(searchQueryAtom);

  // Youtube 일부 기능 미지원
  if (platform === "youtube") {
    return [];
  }

  const channelResponse = await set(searchStreamChannelAtom, {
    platform,
    query,
    size: 50,
  });

  const channelResults = channelResponse.result.map<SearchItemResult>(
    (item) => ({
      platform: item.platform,
      channelId: item.channelId,
      liveId: null,
      title: item.channelName,
      description: item.channelDescription,
      channelImageUrl: item.channelImageUrl,
      liveThumbnailUrl: null,
      countPrefix: "팔로우",
      count: item.channelFollower,
      liveStatus: item.liveStatus,
      verified: item.channelVerified,
      type: "channel",
      selected: false,
    })
  );

  const liveResponse = await set(searchStreamLiveAtom, {
    platform,
    query,
    size: 50,
  });

  const tagResponse = await set(searchStreamTagAtom, {
    platform: "chzzk",
    query,
    size: 50,
  });

  const liveResults = [...liveResponse.result, ...tagResponse.result]
    .filter(
      (item, index, array) =>
        array.findIndex((el) => el.channelId === item.channelId) === index &&
        index < 50
    )
    .sort((a, b) => b.liveViewer - a.liveViewer)
    .map<SearchItemResult>((item) => ({
      platform: item.platform,
      channelId: item.channelId,
      liveId: null,
      title: item.channelName,
      description: item.liveTitle ?? "",
      channelImageUrl: item.channelImageUrl,
      liveThumbnailUrl: item.liveThumbnailUrl,
      countPrefix: "시청자",
      count: item.liveViewer,
      liveStatus: true,
      verified: item.channelVerified,
      type: "live",
      selected: false,
    }));

  return [...channelResults, ...liveResults];
});

// 주어진 id를 가진 채널을 검색하여 searchResultAtom에 추가합니다.
export const searchChannelIdAtom = atom(
  null,
  async (_get, set, options: StreamGetChannelOptions) => {
    const response = await set(fetchStreamChannelAtom, options);

    // 해당 채널이 존재하지 않음
    if (response === null) {
      return null;
    }

    const item: SearchItemResult = {
      platform: response.platform,
      channelId: response.channelId,
      liveId: response.liveId,
      title: response.channelName,
      description: response.channelDescription,
      channelImageUrl: response.channelImageUrl,
      liveThumbnailUrl: response.liveThumbnailUrl,
      countPrefix: "팔로우",
      count: response.channelFollower,
      liveStatus: response.liveStatus,
      verified: response.channelVerified,
      type: "channel",
      selected: false,
    };

    if (options.platform === "youtube") {
      if (options.type === "video") {
        item.type = "live";
        item.description = response.liveTitle ?? "";
        item.count = response.liveViewer;
        item.countPrefix = "시청자";
      } else {
        item.countPrefix = "구독자";
      }
    }

    return item;
  }
);

// 사용자가 선택한 채널을 선택된 채널 목록에 추가합니다. 다중 선택이 비활성화 되어있는 경우 그대로 modal을 종료합니다.
export const selectItemAtom = atom(null, (get, set, item: SearchItemType) => {
  const isMultiSelect = get(isMultiSelectAtom);

  set(selectedItemsAtom, (draft) => {
    const index = draft.findIndex((i) => i.channelId === item.channelId);
    if (index === -1) {
      draft.push(item);
    } else {
      draft.splice(index, 1);
    }
  });

  if (isMultiSelect === false) {
    set(submitSelectedItemAtom);
  }
});

// 선택된 채널들을 제출하고 modal을 닫습니다다.
export const submitSelectedItemAtom = atom(null, (get, set) => {
  const modal = get(modalAtom);
  const selectedItems = get(selectedItemsAtom);
  modal.callback?.(selectedItems);
  set(closeModalAtom);
});

// 선택된 채널을 선택된 채널 목록에서 제거합니다.
export const removeSelectedItemAtom = atom(
  null,
  (_get, set, item: SearchItemType) => {
    set(selectedItemsAtom, (draft) => {
      const index = draft.findIndex((i) => i.channelId === item.channelId);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    });
  }
);
