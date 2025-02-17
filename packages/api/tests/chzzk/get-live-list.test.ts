import { sleep, chzzk, TEST_DELAY } from "../util.ts";
import { afterEach, describe, expect, it } from "vitest";

describe("get live list", () => {
  afterEach(async () => {
    // prevent 429
    await sleep(TEST_DELAY);
  });

  it("must return live list", async () => {
    const res = await chzzk.getLiveList();
    expect(res.next).not.toBeNull();
    expect(res.data.length).not.toBe(0);
  });

  it("pagination", async () => {
    const { next } = await chzzk.getLiveList();
    await sleep(TEST_DELAY);

    const res = await chzzk.getLiveList(next);
    expect(res.next).not.toBeNull();
    expect(res.data.length).not.toBe(0);
  });
});
