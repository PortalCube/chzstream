import { afterEach, describe, expect, it } from "vitest";
import { sleep, streamClient, TEST_CHANNELS, TEST_DELAY } from "../util.ts";

describe("StreamClient", () => {
  describe("getChannel", () => {
    afterEach(async () => {
      // prevent 429
      await sleep(TEST_DELAY);
    });

    TEST_CHANNELS.forEach(({ id }, index) => {
      it(`chzzk common id ${index + 1}`, async () => {
        const res = await streamClient.getChannel({
          platform: "chzzk",
          id,
        });

        expect(res).not.toBeNull();
        expect(res?.channelId).toBe(id);
      });
    });

    it("chzzk blank id", async () => {
      await expect(() =>
        streamClient.getChannel({
          platform: "chzzk",
          id: "",
        })
      ).rejects.toThrowError("404");
    });

    it("chzzk null id", async () => {
      const res = await streamClient.getChannel({
        platform: "chzzk",
        id: "0",
      });

      expect(res).toBeNull();
    });

    it("youtube channel handle", async () => {
      const res = await streamClient.getChannel({
        platform: "youtube",
        type: "handle",
        value: "LofiGirl",
      });

      expect(res).not.toBeNull();
      expect(res!.channelName).toBe("Lofi Girl");

      // 24/7 live stream
      expect(res!.liveStatus).toBe(true);
    });

    it("youtube channel id", async () => {
      const res = await streamClient.getChannel({
        platform: "youtube",
        type: "id",
        value: "UCdvjEK7vkqjt4PjcClDHm6g",
      });

      expect(res).not.toBeNull();
      expect(res!.channelName).toBe("sake L");

      // 여기 방송하면 세상 멸망함
      expect(res!.liveStatus).toBe(false);
      expect(res!.liveTitle).toBeNull();
    });

    it("youtube video id", async () => {
      const res = await streamClient.getChannel({
        platform: "youtube",
        type: "video",
        value: "NsWPXB5Wqzs",
      });

      expect(res).not.toBeNull();
      expect(res!.channelName).toBe("LCK");
      expect(res!.liveId).toBe("NsWPXB5Wqzs");
      expect(res!.liveTitle).toBe("T1 vs BLG | 결승전 | 2024 월드 챔피언십");
    });

    it("youtube null id", async () => {
      const res = await streamClient.getChannel({
        platform: "youtube",
        type: "id",
        value: "",
      });

      expect(res).toBeNull();
    });

    it("youtube null video", async () => {
      const res = await streamClient.getChannel({
        platform: "youtube",
        type: "video",
        value: "",
      });

      expect(res).toBeNull();
    });
  });
});
