import { sleep, chzzkClient, TEST_DELAY } from "../util.ts";
import { afterEach, describe, expect, it } from "vitest";

describe("ChzzkClient", () => {
  describe("getLiveList", () => {
    afterEach(async () => {
      // prevent 429
      await sleep(TEST_DELAY);
    });

    it("must return live list", async () => {
      const res = await chzzkClient.getLiveList({ size: 5 });

      expect(res.code).toBe(200);
      expect(res.content.page).not.toBeNull();
      expect(res.content.data.length).not.toBe(0);
    });

    it("pagination", async () => {
      const res1 = await chzzkClient.getLiveList({ size: 5 });
      expect(res1.code).toBe(200);
      expect(res1.content.page).not.toBeNull();
      expect(res1.content.data.length).not.toBe(0);

      await sleep(TEST_DELAY);

      const next = res1.content.page?.next;

      const res2 = await chzzkClient.getLiveList({ next, size: 5 });
      expect(res2.code).toBe(200);
      expect(res2.content.page).not.toBeNull();
      expect(res2.content.data.length).not.toBe(0);
    });
  });
});
