import { sleep, chzzk, TEST_CHANNELS, TEST_DELAY } from "../util.ts";
import { afterEach, describe, expect, it } from "vitest";

describe("get live status", () => {
  afterEach(async () => {
    // prevent 429
    await sleep(TEST_DELAY);
  });

  TEST_CHANNELS.forEach(({ id }, index) => {
    it(`common id ${index + 1}`, async () => {
      // expect no error
      await chzzk.getLiveStatus(id);
    });
  });

  it("must return live status", async () => {
    const { data } = await chzzk.getLiveList();
    const res = await chzzk.getLiveStatus(data[0].channel.channelId);
    expect(res).not.toBeNull();
  });

  it("blank id", async () => {
    await expect(() => chzzk.getLiveStatus("")).rejects.toThrowError("404");
  });

  it("null id", async () => {
    await expect(() => chzzk.getLiveStatus("0")).rejects.toThrowError("404");
  });
});
