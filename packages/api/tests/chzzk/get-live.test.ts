import { sleep, chzzk, TEST_CHANNELS, TEST_DELAY } from "../util.ts";
import { afterEach, describe, expect, it } from "vitest";

describe("get live", () => {
  afterEach(async () => {
    // prevent 429
    await sleep(TEST_DELAY);
  });

  TEST_CHANNELS.forEach(({ id }, index) => {
    it(`common id ${index + 1}`, async () => {
      const res = await chzzk.getLive(id);

      // 최근에 방송을 킨 적이 없음
      if (res === null) {
        return;
      }

      expect(res?.channel.channelId).toBe(id);
    });
  });

  it("must return live", async () => {
    const { data } = await chzzk.getLiveList();
    const id = data[0].channel.channelId;

    await sleep(TEST_DELAY);
    const res = await chzzk.getLive(id);

    expect(res).not.toBeNull();
    expect(res?.channel.channelId).toBe(id);
    expect(res?.channel.channelName).not.toBe("");
  });

  it("blank id", async () => {
    await expect(() => chzzk.getLive("")).rejects.toThrowError("404");
  });

  it("null id", async () => {
    await expect(() => chzzk.getLive("0")).rejects.toThrowError("404");
  });
});
