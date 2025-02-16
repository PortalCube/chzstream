import { Client } from "@api/chzzk/client.ts";
import { paginationSchema } from "@api/chzzk/client.ts";
import { normalizeString } from "@api/util.ts";
import { z } from "zod";

const schema = z.array(
  z.object({
    channel: z.object({
      channelId: z.string(),
      channelName: z.string(),
      channelImageUrl: z.string().nullable(),
      verifiedMark: z.boolean(),
      channelDescription: z.string(),
      followerCount: z.number(),
      openLive: z.boolean(),
      personalData: z.object({
        following: z.object({
          following: z.boolean(),
          notification: z.boolean(),
          followDate: z.string().nullable(),
        }),
        privateUserBlock: z.boolean(),
      }),
    }),
  })
);

export type SearchChannelResponse = {
  channel: {
    channelId: string;
    channelName: string;
    channelImageUrl: string | null;
    channelDescription: string;
    followerCount: number;
    openLive: boolean;
    verifiedMark: boolean;
  };
}[];

export async function searchChannel(
  query: string,
  offset: number = 0,
  size: number = 50
): Promise<SearchChannelResponse> {
  const response = await Client.get(`/service/v1/search/channels`, {
    keyword: query,
    offset,
    size,
  });
  const pageResult = paginationSchema.parse(response.content);
  const list = schema.parse(pageResult.data);

  return list.map((item) => ({
    channel: {
      channelId: item.channel.channelId,
      channelName: item.channel.channelName,
      channelImageUrl: normalizeString(item.channel.channelImageUrl),
      channelDescription: item.channel.channelDescription,
      verifiedMark: item.channel.verifiedMark,
      followerCount: item.channel.followerCount,
      openLive: item.channel.openLive,
    },
  }));
}
