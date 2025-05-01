import { ChzzkClient } from "@api/chzzk/client.ts";
import { createResponseSchema } from "@api/chzzk/schema.ts";
import { def } from "@api/error.ts";
import { z } from "zod";

const schema = createResponseSchema(
  z.object({
    channelId: z.string().nullable().catch(def(null)),
    channelName: z.string().catch(def("알 수 없음")),
    channelImageUrl: z.string().nullable().catch(def(null)),
    verifiedMark: z.boolean().catch(def(false)),
    channelType: z.string().catch(def("")), // enum
    channelDescription: z.string().catch(def("")),
    followerCount: z.number().catch(def(0)),
    openLive: z.boolean().catch(def(false)),
    subscriptionAvailability: z.boolean().catch(def(false)),
    subscriptionPaymentAvailability: z
      .object({
        iapAvailability: z.boolean(),
        iabAvailability: z.boolean(),
      })
      .catch(
        def({
          iapAvailability: false,
          iabAvailability: false,
        })
      ),
    adMonetizationAvailability: z.boolean().catch(def(false)),
    activatedChannelBadgeIds: z
      .string()
      .array()
      .optional()
      .catch(def(undefined)),
  })
);

export type ChzzkGetChannelResponse = z.infer<typeof schema>;

export async function getChannel(
  this: ChzzkClient,
  uuid: string
): Promise<ChzzkGetChannelResponse> {
  const params = {
    url: `/service/v1/channels/${uuid}`,
  };

  const response = await this.get(params);
  return schema.parse(response);
}
