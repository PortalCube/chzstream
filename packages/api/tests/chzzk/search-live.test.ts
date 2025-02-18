import { afterEach, describe, expect, it } from "vitest";
import { chzzk, sleep, TEST_DELAY } from "../util.ts";

describe("search live", () => {
  afterEach(async () => {
    // prevent 429
    await sleep(TEST_DELAY);
  });

  ["talk", "리그 오브 레전드"].forEach((query, index) => {
    it(`common query ${index + 1}`, async () => {
      const res = await chzzk.searchLive(query, null, 5);

      expect(res.code).toBe(200);
      expect(res.content.page).not.toBeNull();
      expect(res.content.data.length).not.toBe(0);
    });
  });

  it("empty query", async () => {
    await expect(() => chzzk.searchLive("")).rejects.toThrowError("400");
  });

  it("pagination", async () => {
    const res1 = await chzzk.searchLive("talk", null, 5);
    expect(res1.code).toBe(200);
    expect(res1.content.page).not.toBeNull();
    expect(res1.content.data.length).not.toBe(0);

    await sleep(TEST_DELAY);

    const next = res1.content.page?.next;

    const res2 = await chzzk.searchLive("talk", next, 5);
    expect(res2.code).toBe(200);
    expect(res2.content.page).not.toBeNull();
    expect(res2.content.data.length).not.toBe(0);
  });
});
