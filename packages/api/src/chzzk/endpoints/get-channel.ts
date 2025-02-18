import { ChzzkClient } from "@api/chzzk/client.ts";
import { createResponseSchema } from "@api/chzzk/schema.ts";
import { z } from "zod";

const schema = createResponseSchema(
  z.object({
    channelId: z.string().nullable(),
    channelName: z.string(),
    channelImageUrl: z.string().nullable(),
    verifiedMark: z.boolean(),
    channelType: z.string(), // enum
    channelDescription: z.string(),
    followerCount: z.number(),
    openLive: z.boolean(),
    subscriptionAvailability: z.boolean(),
    subscriptionPaymentAvailability: z.object({
      iapAvailability: z.boolean(),
      iabAvailability: z.boolean(),
    }),
    adMonetizationAvailability: z.boolean(),
    activatedChannelBadgeIds: z.string().array().optional(),
  })
);

export type ChzzkGetChannelResponse = z.infer<typeof schema>;

export async function getChannel(
  this: ChzzkClient,
  uuid: string
): Promise<ChzzkGetChannelResponse> {
  const options = {
    url: `/service/v1/channels/${uuid}`,
  };

  const response = await this.get(options);
  return schema.parse(response);
}
