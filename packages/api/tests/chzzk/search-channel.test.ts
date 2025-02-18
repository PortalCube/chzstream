import { sleep, chzzk, TEST_CHANNELS, TEST_DELAY } from "../util.ts";
import { afterEach, describe, expect, it } from "vitest";

describe("search channel", () => {
  afterEach(async () => {
    // prevent 429
    await sleep(TEST_DELAY);
  });

  TEST_CHANNELS.forEach(({ id, name }, index) => {
    it(`common query ${index + 1}`, async () => {
      const res = await chzzk.searchChannel({
        query: name,
        size: 5,
      });

      expect(res.code).toBe(200);
      expect(res.content.page).not.toBeNull();
      expect(res.content.data.length).not.toBe(0);
    });
  });

  it("empty query", async () => {
    await expect(() => chzzk.searchChannel({ query: "" })).rejects.toThrowError(
      "400"
    );
  });

  it("pagination", async () => {
    const res1 = await chzzk.searchChannel({
      query: "치지직",
      size: 5,
    });
    expect(res1.code).toBe(200);
    expect(res1.content.page).not.toBeNull();
    expect(res1.content.data.length).not.toBe(0);

    await sleep(TEST_DELAY);

    const next = res1.content.page?.next;

    const res2 = await chzzk.searchChannel({
      query: "치지직",
      size: 5,
      next,
    });
    expect(res2.code).toBe(200);
    expect(res2.content.page).not.toBeNull();
    expect(res2.content.data.length).not.toBe(0);
  });
});
