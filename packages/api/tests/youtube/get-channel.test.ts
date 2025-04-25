import { describe, expect, it } from "vitest";
import { youtubeClient } from "../util.ts";

describe("YoutubeClient", () => {
  describe("getChannel", () => {
    it("channel handle", async () => {
      const res = await youtubeClient.getChannel({
        type: "handle",
        value: "youtubekorea",
      });

      expect(res.pageInfo.totalResults).toBe(1);
      expect(res.items[0].id).toBe("UCOH52Yqq4-rdLvpt2Unsqsw");
    });

    it("channel id", async () => {
      const res = await youtubeClient.getChannel({
        type: "id",
        value: "UCOH52Yqq4-rdLvpt2Unsqsw",
      });

      expect(res.pageInfo.totalResults).toBe(1);
      expect(res.items[0].id).toBe("UCOH52Yqq4-rdLvpt2Unsqsw");
    });
  });
});
