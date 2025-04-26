import { afterEach, describe, expect, it } from "vitest";
import { sleep, streamClient, TEST_DELAY } from "../util.ts";
import { StreamSearchTagResponse } from "@api/stream/endpoints/search-tag.ts";

describe("StreamClient", () => {
  describe("searchTag", () => {
    afterEach(async () => {
      // prevent 429
      await sleep(TEST_DELAY);
    });

    ["롤", "게임"].forEach((query, index) => {
      it(`common query ${index + 1}`, async () => {
        const res = (await streamClient.searchTag({
          platform: "chzzk",
          query,
          size: 5,
        })) as Extract<StreamSearchTagResponse, { platform: "chzzk" }>;

        expect(res.platform).toBe("chzzk");
        expect(res.next).not.toBeNull();
        expect(res.result.length).not.toBe(0);
      });
    });

    it("empty query", async () => {
      await expect(() =>
        streamClient.searchTag({ platform: "chzzk", query: "" })
      ).rejects.toThrowError("400");
    });

    it("pagination", async () => {
      const res1 = (await streamClient.searchTag({
        platform: "chzzk",
        query: "롤",
        size: 5,
      })) as Extract<StreamSearchTagResponse, { platform: "chzzk" }>;
      expect(res1.platform).toBe("chzzk");
      expect(res1.next).not.toBeNull();
      expect(res1.result.length).not.toBe(0);

      await sleep(TEST_DELAY);

      const next = res1.next;

      const res2 = (await streamClient.searchTag({
        platform: "chzzk",
        query: "롤",
        size: 5,
        next,
      })) as Extract<StreamSearchTagResponse, { platform: "chzzk" }>;
      expect(res2.platform).toBe("chzzk");
      expect(res2.next).not.toBeNull();
      expect(res2.result.length).not.toBe(0);
    });
  });
});
