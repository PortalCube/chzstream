import { clear, get, set } from "idb-keyval";

const STORAGE_VERSION = 1;

export async function initializeStorage() {
  const version = await get("storage_version");
  if (version === STORAGE_VERSION) {
    return;
  }

  await clearStorage();
}

export async function clearStorage() {
  await clear();
  await set("storage_version", STORAGE_VERSION);
}

// favorite_channels
const FAVORITE_CHANNELS_KEY = "favorite_channels";

export const FAVOTIRE_CHANNELS_INITIAL_DATA = [
  "f722959d1b8e651bd56209b343932c01",
  "45e71a76e949e16a34764deb962f9d9f",
  "b044e3a3b9259246bc92e863e7d3f3b8",
  "4515b179f86b67b4981e16190817c580",
  "4325b1d5bbc321fad3042306646e2e50",
  "a6c4ddb09cdb160478996007bff35296",
  "64d76089fba26b180d9c9e48a32600d9",
  "516937b5f85cbf2249ce31b0ad046b0f",
  "4d812b586ff63f8a2946e64fa860bbf5",
  "8fd39bb8de623317de90654718638b10",
];

export async function getStorageFavoriteChannels(): Promise<string[]> {
  const response = await get<string[]>(FAVORITE_CHANNELS_KEY);

  if (response === undefined) {
    await setStorageFavoriteChannels(FAVOTIRE_CHANNELS_INITIAL_DATA);
    return FAVOTIRE_CHANNELS_INITIAL_DATA;
  }

  return response;
}

export async function setStorageFavoriteChannels(value: string[]) {
  await set(FAVORITE_CHANNELS_KEY, value);
}

// player_default_volume
const PLAYER_VOLUME_KEY = "player_volume";

export const PLAYER_VOLUME_INITIAL_DATA = 30;

export async function getStoragePlayerVolume(): Promise<number> {
  const response = await get<number>(PLAYER_VOLUME_KEY);

  if (response === undefined) {
    await setStoragePlayerVolume(PLAYER_VOLUME_INITIAL_DATA);
    return PLAYER_VOLUME_INITIAL_DATA;
  }

  return response;
}

export async function setStoragePlayerVolume(value: number) {
  await set(PLAYER_VOLUME_KEY, value);
}

// player_default_muted
const PLAYER_MUTED_KEY = "player_muted";

export const PLAYER_MUTED_INITIAL_DATA = true;

export async function getStoragePlayerMuted(): Promise<boolean> {
  const response = await get<boolean>(PLAYER_MUTED_KEY);

  if (response === undefined) {
    await setStoragePlayerMuted(PLAYER_MUTED_INITIAL_DATA);
    return PLAYER_MUTED_INITIAL_DATA;
  }

  return response;
}

export async function setStoragePlayerMuted(value: boolean) {
  await set(PLAYER_MUTED_KEY, value);
}

// player_default_quality
const PLAYER_QUALITY_KEY = "player_quality";

export const PLAYER_QUALITY_INITIAL_DATA = 0;

export async function getStoragePlayerQuality(): Promise<number> {
  const response = await get<number>(PLAYER_QUALITY_KEY);

  if (response === undefined) {
    await setStoragePlayerQuality(PLAYER_QUALITY_INITIAL_DATA);
    return PLAYER_QUALITY_INITIAL_DATA;
  }

  return response;
}

export async function setStoragePlayerQuality(value: number) {
  await set(PLAYER_QUALITY_KEY, value);
}
