import { sleep, chzzk, TEST_CHANNELS, TEST_DELAY } from "../util.ts";
import { afterEach, describe, expect, it } from "vitest";

describe("get live status", () => {
  afterEach(async () => {
    // prevent 429
    await sleep(TEST_DELAY);
  });

  TEST_CHANNELS.forEach(({ id }, index) => {
    it(`common id ${index + 1}`, async () => {
      const res = await chzzk.getLiveStatus(id);
      expect(res.code).toBe(200);
    });
  });

  it("must return live status", async () => {
    const listResponse = await chzzk.getLiveList();
    const target = listResponse.content.data[0];

    await sleep(TEST_DELAY);
    const res = await chzzk.getLiveStatus(target.channel.channelId);

    expect(res.code).toBe(200);
    expect(res.content.liveTitle).toBe(target.liveTitle);
  });

  it("blank id", async () => {
    await expect(() => chzzk.getLiveStatus("")).rejects.toThrowError("404");
  });

  it("null id", async () => {
    await expect(() => chzzk.getLiveStatus("0")).rejects.toThrowError("404");
  });
});
