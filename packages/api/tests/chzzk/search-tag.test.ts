import { afterEach, describe, expect, it } from "vitest";
import { chzzkClient, sleep, TEST_DELAY } from "../util.ts";

describe("ChzzkClient", () => {
  describe("searchTag", () => {
    afterEach(async () => {
      // prevent 429
      await sleep(TEST_DELAY);
    });

    ["롤", "게임"].forEach((query, index) => {
      it(`common query ${index + 1}`, async () => {
        const res = await chzzkClient.searchTag({
          query,
          size: 5,
        });

        expect(res.code).toBe(200);
        expect(res.content.page).not.toBeNull();
        expect(res.content.data.length).not.toBe(0);
      });
    });

    it("empty query", async () => {
      await expect(() =>
        chzzkClient.searchTag({ query: "" })
      ).rejects.toThrowError("400");
    });

    it("pagination", async () => {
      const res1 = await chzzkClient.searchTag({
        query: "롤",
        size: 5,
      });
      expect(res1.code).toBe(200);
      expect(res1.content.page).not.toBeNull();
      expect(res1.content.data.length).not.toBe(0);

      await sleep(TEST_DELAY);

      const next = res1.content.page?.next;

      const res2 = await chzzkClient.searchTag({
        query: "롤",
        size: 5,
        next,
      });
      expect(res2.code).toBe(200);
      expect(res2.content.page).not.toBeNull();
      expect(res2.content.data.length).not.toBe(0);
    });
  });
});
