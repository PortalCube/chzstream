import { describe, expect, it } from "vitest";
import { youtubeClient } from "../util.ts";

describe("YoutubeClient", () => {
  describe("getPlaylistItems", () => {
    it("get playlist items", async () => {
      const res = await youtubeClient.getPlaylistItems({
        id: "UUOH52Yqq4-rdLvpt2Unsqsw",
      });

      expect(res.pageInfo.totalResults).toBeGreaterThan(0);
      expect(res.items.length).toBeGreaterThan(0);
    });
  });
});
