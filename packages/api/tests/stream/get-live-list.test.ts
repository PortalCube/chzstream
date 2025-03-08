import { afterEach, describe, expect, it } from "vitest";
import { sleep, streamClient, TEST_DELAY } from "../util.ts";

describe("StreamClient", () => {
  describe("getLiveList", () => {
    afterEach(async () => {
      // prevent 429
      await sleep(TEST_DELAY);
    });

    it("chzzk must return live list", async () => {
      const res = await streamClient.getLiveList({
        platform: "chzzk",
        size: 5,
      });

      expect(res.next).not.toBeNull();
      expect(res.result.length).not.toBe(0);
    });

    it("chzzk pagination", async () => {
      const res1 = await streamClient.getLiveList({
        platform: "chzzk",
        size: 5,
      });
      expect(res1.next).not.toBeNull();
      expect(res1.result.length).not.toBe(0);

      await sleep(TEST_DELAY);

      const next = res1.next;

      const res2 = await streamClient.getLiveList({
        platform: "chzzk",
        next,
        size: 5,
      });
      expect(res2.next).not.toBeNull();
      expect(res2.result.length).not.toBe(0);
    });
  });
});
