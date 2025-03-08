import { afterEach, describe, expect, it } from "vitest";
import { sleep, streamClient, TEST_CHANNELS, TEST_DELAY } from "../util.ts";

describe("StreamClient", () => {
  describe("getChannel", () => {
    afterEach(async () => {
      // prevent 429
      await sleep(TEST_DELAY);
    });

    TEST_CHANNELS.forEach(({ id }, index) => {
      it(`chzzk common id ${index + 1}`, async () => {
        const res = await streamClient.getChannel({
          platform: "chzzk",
          id,
        });

        expect(res).not.toBeNull();
        expect(res?.channelId).toBe(id);
      });
    });

    it("chzzk blank id", async () => {
      await expect(() =>
        streamClient.getChannel({
          platform: "chzzk",
          id: "",
        })
      ).rejects.toThrowError("404");
    });

    it("chzzk null id", async () => {
      const res = await streamClient.getChannel({
        platform: "chzzk",
        id: "0",
      });

      expect(res).toBeNull();
    });
  });
});
