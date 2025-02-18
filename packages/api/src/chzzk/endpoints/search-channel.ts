import { createPaginationSchema } from "@api/chzzk/schema.ts";
import { ChzzkClient } from "@api/chzzk/client.ts";
import { z } from "zod";

const nextSchema = z.object({
  offset: z.number(),
});

const schema = createPaginationSchema(
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
  }),
  nextSchema
);

export type ChzzkSearchChannelResponse = z.infer<typeof schema>;

export type ChzzkSearchChannelOptions = {
  query: string;
  next?: z.infer<typeof nextSchema> | null;
  size?: number;
};

export async function searchChannel(
  this: ChzzkClient,
  options: ChzzkSearchChannelOptions
): Promise<ChzzkSearchChannelResponse> {
  const { query, next, size = 10 } = options;

  const params = {
    url: `/service/v1/search/channels`,
    params: {
      ...next,
      keyword: query,
      size: size,
    },
  };

  const response = await this.get(params);
  return schema.parse(response);
}
