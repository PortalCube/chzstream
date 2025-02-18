import { Platform } from "@api/stream/client.ts";
import { afterEach, describe, expect, it } from "vitest";
import { sleep, streamClient, TEST_DELAY } from "../util.ts";

describe("StreamClient", () => {
  describe("searchLive", () => {
    afterEach(async () => {
      // prevent 429
      await sleep(TEST_DELAY);
    });

    ["talk", "리그 오브 레전드"].forEach((query, index) => {
      it(`common query ${index + 1}`, async () => {
        const res = await streamClient.searchLive({
          platform: Platform.Chzzk,
          query,
          size: 5,
        });

        expect(res.next).not.toBeNull();
        expect(res.result.length).not.toBe(0);
      });
    });

    it("empty query", async () => {
      await expect(() =>
        streamClient.searchLive({ platform: Platform.Chzzk, query: "" })
      ).rejects.toThrowError("400");
    });

    it("pagination", async () => {
      const res1 = await streamClient.searchLive({
        platform: Platform.Chzzk,
        query: "talk",
        size: 5,
      });
      expect(res1.next).not.toBeNull();
      expect(res1.result.length).not.toBe(0);

      await sleep(TEST_DELAY);

      const next = res1.next;

      const res2 = await streamClient.searchLive({
        platform: Platform.Chzzk,
        query: "talk",
        size: 5,
        next,
      });
      expect(res2.next).not.toBeNull();
      expect(res2.result.length).not.toBe(0);
    });
  });
});
