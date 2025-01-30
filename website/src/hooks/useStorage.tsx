import { useAtom } from "jotai";
import { useEffect } from "react";
import { favoriteChannelsAtom } from "src/librarys/app";
import {
  getStorageFavoriteChannels,
  setStorageFavoriteChannels,
} from "src/scripts/storage.ts";

export function useStorage() {
  const [favoriteChannels, setFavoriteChannels] =
    useAtom<string[]>(favoriteChannelsAtom);

  useEffect(() => {
    loadFavoriteChannels();
  }, []);

  async function loadFavoriteChannels() {
    const data = await getStorageFavoriteChannels();
    setFavoriteChannels(data);
  }

  useEffect(() => {
    setStorageFavoriteChannels(favoriteChannels);
  }, [favoriteChannels]);
}
