import { sleep, chzzkClient, TEST_CHANNELS, TEST_DELAY } from "../util.ts";
import { afterEach, describe, expect, it } from "vitest";

describe("ChzzkClient", () => {
  describe("getChannel", () => {
    afterEach(async () => {
      // prevent 429
      await sleep(TEST_DELAY);
    });

    TEST_CHANNELS.forEach(({ id }, index) => {
      it(`common id ${index + 1}`, async () => {
        const res = await chzzkClient.getChannel(id);

        expect(res.code).toBe(200);
        expect(res.content.channelId).toBe(id);
      });
    });

    it("blank id", async () => {
      await expect(() => chzzkClient.getChannel("")).rejects.toThrowError(
        "404"
      );
    });

    it("null id", async () => {
      const res = await chzzkClient.getChannel("0");

      expect(res.code).toBe(200);
      expect(res.content.channelId).toBeNull();
    });
  });
});
