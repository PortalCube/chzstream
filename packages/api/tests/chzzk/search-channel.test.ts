import { sleep, chzzk, TEST_CHANNELS, TEST_DELAY } from "../util.ts";
import { afterEach, describe, expect, it } from "vitest";

describe("search channel", () => {
  afterEach(async () => {
    // prevent 429
    await sleep(TEST_DELAY);
  });

  TEST_CHANNELS.forEach(({ id, name }, index) => {
    it(`common query ${index + 1}`, async () => {
      const res = await chzzk.searchChannel(name);

      expect(res.data.length).not.toBe(0);
      expect(res.data[0].channel.channelId).toBe(id);
      expect(res.data[0].channel.channelName).toBe(name);
    });
  });

  it("empty query", async () => {
    await expect(() => chzzk.searchChannel("")).rejects.toThrowError("400");
  });

  it("pagination", async () => {
    const { next } = await chzzk.searchChannel("치지직", null, 5);
    await sleep(TEST_DELAY);

    const res = await chzzk.searchChannel("치지직", next);
    expect(res.next).not.toBeNull();
    expect(res.data.length).not.toBe(0);
  });
});
