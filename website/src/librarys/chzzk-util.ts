import { CHZZK_EMPTY_PROFILE_IMAGE } from "src/scripts/constants.ts";

export function getProfileImageUrl(imageUrl?: unknown): string {
  if (typeof imageUrl !== "string" || imageUrl === "") {
    imageUrl = CHZZK_EMPTY_PROFILE_IMAGE;
  }

  return imageUrl + "?type=f120_120_na";
}

export function getChzzkUuid(url: string) {
  const regexp = /([0-9a-fA-F]{32,32})/g;
  const result = url.match(regexp);
  if (result === null) {
    return null;
  }

  return result[0];
}
