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
