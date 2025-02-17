import {
  ChzzkClient,
  paginationSchema,
  responseSchema,
} from "@api/chzzk/client.ts";
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
      personalData: z
        .object({
          following: z.object({
            following: z.boolean(),
            notification: z.boolean(),
            followDate: z.string().nullable(),
          }),
          privateUserBlock: z.boolean(),
        })
        .optional(),
    }),
  })
);

export type SearchChannelResponse = {
  next: number | null;
  data: {
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
};

export async function searchChannel(
  this: ChzzkClient,
  query: string,
  offset: number | null = 0,
  size: number = 50
): Promise<SearchChannelResponse> {
  const response = await this.get({
    url: `/service/v1/search/channels`,
    params: {
      keyword: query,
      offset,
      size,
    },
  });

  const { content } = responseSchema.parse(response);
  const { data, page } = paginationSchema.parse(content);
  const list = schema.parse(data);

  return {
    next: page?.next.offset ?? null,
    data: list.map((item) => ({
      channel: {
        channelId: item.channel.channelId,
        channelName: item.channel.channelName,
        channelImageUrl: normalizeString(item.channel.channelImageUrl),
        channelDescription: item.channel.channelDescription,
        verifiedMark: item.channel.verifiedMark,
        followerCount: item.channel.followerCount,
        openLive: item.channel.openLive,
      },
    })),
  };
}
