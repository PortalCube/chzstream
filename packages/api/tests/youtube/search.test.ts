import { describe, expect, it } from "vitest";
import { youtubeClient } from "../util.ts";

describe("YoutubeClient", () => {
  describe("search", () => {
    it("search youtube channel", async () => {
      const res = await youtubeClient.search({
        query: "@Youtube",
        type: "channel",
      });

      expect(res.pageInfo.totalResults).toBeGreaterThan(0);
      expect(res.items[0].snippet.title).toBe("YouTube");
    });

    it("search youtube video", async () => {
      const res = await youtubeClient.search({
        query: "Me at the zoo",
        type: "video",
      });

      expect(res.pageInfo.totalResults).toBeGreaterThan(0);
      expect(res.items[0].snippet.title).toBe("Me at the zoo");
    });
  });
});
