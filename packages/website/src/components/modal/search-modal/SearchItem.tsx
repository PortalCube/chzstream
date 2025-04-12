import SearchChannelItem from "@web/components/modal/search-modal/SearchChannelItem.tsx";
import SearchLiveItem from "@web/components/modal/search-modal/SearchLiveItem.tsx";
import { SearchItemType } from "@web/librarys/search.ts";
import { useMemo } from "react";

function SearchItem({ item, type }: SearchItemProps) {
  return useMemo(() => {
    if (type === "channel") {
      return <SearchChannelItem item={item} />;
    } else if (type === "live") {
      return <SearchLiveItem item={item} />;
    } else {
      return null;
    }
  }, [item, type]);
}

export type SearchItemProps = {
  item: SearchItemType;
  type: "channel" | "live";
};

export default SearchItem;
