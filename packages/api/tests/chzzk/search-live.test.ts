import { afterEach, describe, expect, it } from "vitest";
import { chzzk, sleep, TEST_DELAY } from "../util.ts";

describe("search live", () => {
  afterEach(async () => {
    // prevent 429
    await sleep(TEST_DELAY);
  });

  it(`common query 1`, async () => {
    const res = await chzzk.searchLive("talk");
    expect(res.data.length).not.toBe(0);
  });

  it(`common query 2`, async () => {
    const res = await chzzk.searchLive("리그 오브 레전드");
    expect(res.data.length).not.toBe(0);
  });

  it("empty query", async () => {
    await expect(() => chzzk.searchLive("")).rejects.toThrowError("400");
  });

  it("pagination", async () => {
    const { next } = await chzzk.searchLive("치지직", null, 5);
    await sleep(TEST_DELAY);

    const res = await chzzk.searchLive("치지직", next);
    expect(res.data.length).not.toBe(0);
  });
});
