import { YoutubeClient } from "@api/youtube/client.ts";
import { z } from "zod";

const schema = z.object({
  kind: z.string(),
  etag: z.string(),
  pageInfo: z.object({
    totalResults: z.number(),
    resultsPerPage: z.number(),
  }),
  items: z
    .array(
      z.object({
        kind: z.string(),
        etag: z.string(),
        id: z.string(),
        snippet: z.object({
          title: z.string(),
          description: z.string(),
          customUrl: z.string().optional(),
          publishedAt: z.string(),
          thumbnails: z.object({
            default: z.object({
              url: z.string(),
              width: z.number(),
              height: z.number(),
            }),
            medium: z.object({
              url: z.string(),
              width: z.number(),
              height: z.number(),
            }),
            high: z.object({
              url: z.string(),
              width: z.number(),
              height: z.number(),
            }),
          }),
          localized: z.object({
            title: z.string(),
            description: z.string(),
          }),
          country: z.string().optional(),
        }),
        contentDetails: z.object({
          relatedPlaylists: z.object({
            likes: z.string().nullable(),
            uploads: z.string(),
          }),
        }),
        statistics: z.object({
          subscriberCount: z.string(),
          hiddenSubscriberCount: z.boolean(),
          videoCount: z.string(),
        }),
      })
    )
    .optional(),
});

export type YoutubeGetChannelResponse = z.infer<typeof schema>;

export type YoutubeGetChannelOptions = {
  type: "handle" | "id";
  value: string;
};

export async function getChannel(
  this: YoutubeClient,
  options: YoutubeGetChannelOptions
): Promise<YoutubeGetChannelResponse> {
  const value = {
    url: `/channels`,
    params: {
      part: "snippet,statistics,contentDetails",
    } as Record<string, unknown>,
  };

  if (options.type === "handle") {
    value.params.forHandle = options.value;
  } else {
    value.params.id = options.value;
  }

  const response = await this.get(value);
  return schema.parse(response);
}
