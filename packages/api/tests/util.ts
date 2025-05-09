import { ChzzkClient } from "@api/chzzk/client.ts";
import { YoutubeClient } from "@api/youtube/client.ts";
import { StreamClient } from "@api/stream/client.ts";

export const TEST_CHANNELS = [
  {
    id: "c42cd75ec4855a9edf204a407c3c1dd2",
    name: "치지직",
  },
  {
    id: "75cbf189b3bb8f9f687d2aca0d0a382b",
    name: "한동숙",
  },
  {
    id: "22bd842599735ae19e454983280f611e",
    name: "ENCHANT",
  },
];

export const TEST_DELAY = 500;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const CLIENT_OPTIONS = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  },
  googleApiKey: import.meta.env.GOOGLE_API_KEY,
};

export const chzzkClient = new ChzzkClient(CLIENT_OPTIONS);
export const youtubeClient = new YoutubeClient(CLIENT_OPTIONS);
export const streamClient = new StreamClient(CLIENT_OPTIONS);
