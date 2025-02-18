import { Platform } from "@api/stream/client.ts";
import { afterEach, describe, expect, it } from "vitest";
import { sleep, streamClient, TEST_CHANNELS, TEST_DELAY } from "../util.ts";

describe("StreamClient", () => {
  describe("searchChannel", () => {
    afterEach(async () => {
      // prevent 429
      await sleep(TEST_DELAY);
    });

    TEST_CHANNELS.forEach(({ id, name }, index) => {
      it(`chzzk common query ${index + 1}`, async () => {
        const res = await streamClient.searchChannel({
          platform: Platform.Chzzk,
          query: name,
          size: 5,
        });

        expect(res.next).not.toBeNull();
        expect(res.result.length).not.toBe(0);
        expect(res.result[0].channelId).toBe(id);
      });
    });

    it("chzzk empty query", async () => {
      await expect(() =>
        streamClient.searchChannel({ platform: Platform.Chzzk, query: "" })
      ).rejects.toThrowError("400");
    });

    it("chzzk pagination", async () => {
      const res1 = await streamClient.searchChannel({
        platform: Platform.Chzzk,
        query: "치지직",
        size: 5,
      });
      expect(res1.next).not.toBeNull();
      expect(res1.result.length).not.toBe(0);

      await sleep(TEST_DELAY);

      const next = res1.next;

      const res2 = await streamClient.searchChannel({
        platform: Platform.Chzzk,
        query: "치지직",
        size: 5,
        next,
      });
      expect(res2.next).not.toBeNull();
      expect(res2.result.length).not.toBe(0);
    });
  });
});
