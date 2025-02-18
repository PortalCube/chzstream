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

export async function searchChannel(
  this: ChzzkClient,
  query: string,
  next: z.infer<typeof nextSchema> | null = null,
  size: number = 10
): Promise<ChzzkSearchChannelResponse> {
  const options = {
    url: `/service/v1/search/channels`,
    params: {
      ...next,
      keyword: query,
      size,
    },
  };

  const response = await this.get(options);
  return schema.parse(response);
}
