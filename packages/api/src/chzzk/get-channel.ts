import { normalizeString } from "@api/util.ts";
import { z } from "zod";
import { Client } from "@api/chzzk/client.ts";

const schema = z.object({
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
});

export type GetChannelResponse = {
  id: string;
  name: string;
  imageUrl: string | null;
  description: string;
  verifiedMark: boolean;
  followerCount: number;
  openLive: boolean;
} | null;

export async function getChannelInfo(
  uuid: string
): Promise<GetChannelResponse> {
  const response = await Client.get(`/service/v1/channels/${uuid}`);
  const body = schema.parse(response.content);

  if (body.channelId === null) {
    return null;
  }

  return {
    id: body.channelId,
    name: body.channelName,
    imageUrl: normalizeString(body.channelImageUrl),
    description: body.channelDescription,
    verifiedMark: body.verifiedMark,
    followerCount: body.followerCount,
    openLive: body.openLive,
  };
}
