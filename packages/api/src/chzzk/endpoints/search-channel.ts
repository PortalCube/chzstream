import { createPaginationSchema } from "@api/chzzk/schema.ts";
import { ChzzkClient } from "@api/chzzk/client.ts";
import { z } from "zod";
import { def } from "@api/error.ts";

const nextSchema = z
  .object({
    offset: z.number(),
  })
  .catch(
    def({
      offset: 0,
    })
  );

const schema = createPaginationSchema(
  z.object({
    channel: z.object({
      channelId: z.string().catch(def("")),
      channelName: z.string().catch(def("알 수 없음")),
      channelImageUrl: z.string().nullable().catch(def(null)),
      verifiedMark: z.boolean().catch(def(false)),
      channelDescription: z.string().catch(def("")),
      followerCount: z.number().catch(def(0)),
      openLive: z.boolean().catch(def(false)),
      personalData: z
        .object({
          following: z.object({
            following: z.boolean(),
            notification: z.boolean(),
            followDate: z.string().nullable(),
          }),
          privateUserBlock: z.boolean(),
        })
        .optional()
        .catch(def(undefined)),
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
