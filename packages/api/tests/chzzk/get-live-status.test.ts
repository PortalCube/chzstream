import { sleep, chzzkClient, TEST_CHANNELS, TEST_DELAY } from "../util.ts";
import { afterEach, describe, expect, it } from "vitest";

describe("ChzzkClient", () => {
  describe("liveStatus", () => {
    afterEach(async () => {
      // prevent 429
      await sleep(TEST_DELAY);
    });

    TEST_CHANNELS.forEach(({ id }, index) => {
      it(`common id ${index + 1}`, async () => {
        const res = await chzzkClient.getLiveStatus(id);
        expect(res.code).toBe(200);
      });
    });

    it("must return live status", async () => {
      const listResponse = await chzzkClient.getLiveList({ size: 5 });
      const target = listResponse.content.data[0];

      await sleep(TEST_DELAY);
      const res = await chzzkClient.getLiveStatus(target.channel.channelId);

      expect(res.code).toBe(200);
      expect(res.content).not.toBeNull();
      expect(res.content!.liveTitle).toBe(target.liveTitle);
    });

    it("blank id", async () => {
      await expect(() => chzzkClient.getLiveStatus("")).rejects.toThrowError(
        "404"
      );
    });

    it("null id", async () => {
      await expect(() => chzzkClient.getLiveStatus("0")).rejects.toThrowError(
        "404"
      );
    });
  });
});
