import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import {
  fetchStreamLiveListAtom,
  searchStreamChannelAtom,
  searchStreamLiveAtom,
  searchStreamTagAtom,
} from "@web/librarys/api-client.ts";
import { BlockPlatform } from "@web/librarys/block.ts";
import { getChzzkUuid } from "@web/librarys/chzzk-util.ts";
import { closeModalAtom, modalAtom } from "@web/librarys/modal.ts";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

export type SearchCategory = "summary" | "channel" | "live" | "recommend";

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
  set(searchLoadingAtom, true);

  const query = get(searchQueryAtom);
  const uuid = getChzzkUuid(query);

  if (query === "") {
    // 인기 라이브 목록 가져오기
    set(searchCategoryAtom, "recommend");
    await set(searchRecommendLiveAtom);
  } else {
    // 전체 검색
    set(searchCategoryAtom, "summary");
    await set(searchItemAtom);
  }

  // uuid 검색
  if (uuid !== null) {
    await set(searchUuidAtom, uuid);
  }

  set(searchLoadingAtom, false);
});

// 라이브 목록을 시청자 내림차순으로 가져와 searchResultAtom에 저장합니다.
export const searchRecommendLiveAtom = atom(null, async (get, set) => {
  const platform = get(searchPlatformAtom);
  const response = await set(fetchStreamLiveListAtom, {
    platform,
    size: 50,
  });

  const data = response.result;
  if (data === null) {
    set(searchResultAtom, []);
    return;
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

  set(searchResultAtom, items);
});

// 주어진 query로 채널, 라이브, 태그 검색 결과를 가져와 searchResultAtom에 저장합니다.
export const searchItemAtom = atom(null, async (get, set) => {
  const platform = get(searchPlatformAtom);
  const query = get(searchQueryAtom);

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

  set(searchResultAtom, [...channelResults, ...liveResults]);
});

// 주어진 uuid를 가진 채널을 검색하여 searchResultAtom에 추가합니다.
export const searchUuidAtom = atom(null, async (get, set, uuid: string) => {
  const messageClient = get(messageClientAtom);

  if (messageClient === null) {
    const unknownItem: SearchItemResult = {
      platform: "chzzk",
      channelId: uuid,
      liveId: null,
      title: `치지직 UUID ${uuid}`,
      description: `제한 모드에서는 채널의 정보를 가져올 수 없습니다.`,
      channelImageUrl: null,
      liveThumbnailUrl: null,
      countPrefix: "팔로우",
      count: 0,
      liveStatus: false,
      verified: false,
      type: "channel",
      selected: false,
    };
    set(searchResultAtom, (prev) => {
      prev.unshift(unknownItem);
    });
    return;
  }

  const response = await messageClient.request("stream-get-channel", {
    platform: "chzzk",
    id: uuid,
  });

  // 해당 uuid가 존재하지 않음
  if (response.data === null) {
    return;
  }

  const data = response.data;

  const item: SearchItemResult = {
    platform: data.platform,
    channelId: data.channelId,
    liveId: data.liveId,
    title: data.channelName,
    description: data.channelDescription,
    channelImageUrl: data.channelImageUrl,
    liveThumbnailUrl: data.liveThumbnailUrl,
    countPrefix: "팔로우",
    count: data.channelFollower,
    liveStatus: data.liveStatus,
    verified: data.channelVerified,
    type: "channel",
    selected: false,
  };

  set(searchResultAtom, (prev) => {
    prev.unshift(item);
  });
});

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
