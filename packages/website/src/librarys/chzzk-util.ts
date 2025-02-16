import { CHZZK_EMPTY_PROFILE_IMAGE } from "@web/scripts/constants.ts";

export function getProfileImageUrl(imageUrl?: unknown): string {
  if (typeof imageUrl !== "string") {
    imageUrl = CHZZK_EMPTY_PROFILE_IMAGE;
  }

  if (imageUrl === "") {
    imageUrl = CHZZK_EMPTY_PROFILE_IMAGE;
  }

  return imageUrl + "?type=f120_120_na";
}

export function getChzzkUuid(url: string) {
  const matchedStrings = url.match(/([0-9a-fA-F]{32,32})/g);

  if (matchedStrings === null) {
    return null;
  }

  return matchedStrings[0];
}
