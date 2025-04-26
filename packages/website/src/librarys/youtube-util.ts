export function getYoutubeChannelId(value: string): {
  type: "handle" | "id" | "video";
  value: string;
} | null {
  // Youtube Handle
  // @으로 시작하는 문자열만 추출
  // 한국어, 일본어, 중국어등 75개 언어에 대한 핸들을 지원하므로.. 그냥 [^/]으로 추출
  const matchedHandles = value.match(/@[^\s/]+/g);
  if (matchedHandles !== null) {
    return { type: "handle", value: matchedHandles[0] };
  }

  // Youtube Channel ID
  const matchedChannelId = value.match(/UC[a-zA-Z0-9_-]{21}[AQgw]/g);
  if (matchedChannelId !== null) {
    return { type: "id", value: matchedChannelId[0] };
  }

  // Youtube Video ID
  const matchedVideoId = value.match(/([a-zA-Z0-9_-]{11})/g);
  if (matchedVideoId !== null) {
    return { type: "video", value: matchedVideoId[0] };
  }

  return null;
}
