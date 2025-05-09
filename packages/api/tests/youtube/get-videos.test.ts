import { describe, expect, it } from "vitest";
import { youtubeClient } from "../util.ts";

describe("YoutubeClient", () => {
  describe("getVideos", () => {
    it("get one video", async () => {
      const res = await youtubeClient.getVideos(["jNQXAC9IVRw"]);

      expect(res.pageInfo.totalResults).toBe(1);
      expect(res.items[0].snippet.title).toBe("Me at the zoo");
    });

    it("get multiple videos", async () => {
      const res = await youtubeClient.getVideos([
        "dQw4w9WgXcQ",
        "9bZkp7q19f0",
        "hT_nvWreIhg",
      ]);

      expect(res.pageInfo.totalResults).toBe(3);
      expect(res.items[0].id).toBe("dQw4w9WgXcQ");
      expect(res.items[1].id).toBe("9bZkp7q19f0");
      expect(res.items[2].id).toBe("hT_nvWreIhg");
    });
  });
});
