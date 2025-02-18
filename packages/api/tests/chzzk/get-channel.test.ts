import { sleep, chzzk, TEST_CHANNELS, TEST_DELAY } from "../util.ts";
import { afterEach, describe, expect, it } from "vitest";

describe("get channel", () => {
  afterEach(async () => {
    // prevent 429
    await sleep(TEST_DELAY);
  });

  TEST_CHANNELS.forEach(({ id }, index) => {
    it(`common id ${index + 1}`, async () => {
      const res = await chzzk.getChannel(id);

      expect(res.code).toBe(200);
      expect(res.content.channelId).toBe(id);
    });
  });

  it("blank id", async () => {
    await expect(() => chzzk.getChannel("")).rejects.toThrowError("404");
  });

  it("null id", async () => {
    const res = await chzzk.getChannel("0");

    expect(res.code).toBe(200);
    expect(res.content.channelId).toBeNull();
  });
});
