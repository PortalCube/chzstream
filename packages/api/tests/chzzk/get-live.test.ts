import { sleep, chzzkClient, TEST_CHANNELS, TEST_DELAY } from "../util.ts";
import { afterEach, describe, expect, it } from "vitest";

describe("ChzzkClient", () => {
  describe("getLive", () => {
    afterEach(async () => {
      // prevent 429
      await sleep(TEST_DELAY);
    });

    TEST_CHANNELS.forEach(({ id }, index) => {
      it(`common id ${index + 1}`, async () => {
        const res = await chzzkClient.getLive(id);
        expect(res.code).toBe(200);
      });
    });

    it("must return live", async () => {
      const listResponse = await chzzkClient.getLiveList({ size: 5 });
      const target = listResponse.content.data[0];

      await sleep(TEST_DELAY);
      const res = await chzzkClient.getLive(target.channel.channelId);

      expect(res.code).toBe(200);
      expect(res.content).not.toBeNull();
      expect(res.content!.liveTitle).toBe(target.liveTitle);
    });

    it("blank id", async () => {
      await expect(() => chzzkClient.getLive("")).rejects.toThrowError("404");
    });

    it("null id", async () => {
      await expect(() => chzzkClient.getLive("0")).rejects.toThrowError("404");
    });
  });
});
