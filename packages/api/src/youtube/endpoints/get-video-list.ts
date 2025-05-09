import { YoutubeClient } from "@api/youtube/client.ts";
import { z } from "zod";

const schema = z.object({
  kind: z.string(),
  etag: z.string(),
  pageInfo: z.object({
    totalResults: z.number(),
    resultsPerPage: z.number(),
  }),
  items: z.array(
    z.object({
      kind: z.string(),
      etag: z.string(),
      id: z.string(),
      snippet: z.object({
        publishedAt: z.string(),
        channelId: z.string(),
        title: z.string(),
        description: z.string(),
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
          standard: z
            .object({
              url: z.string(),
              width: z.number(),
              height: z.number(),
            })
            .optional(),
          maxres: z
            .object({
              url: z.string(),
              width: z.number(),
              height: z.number(),
            })
            .optional(),
        }),
        channelTitle: z.string(),
        tags: z.array(z.string()).optional(),
        categoryId: z.string(),
        liveBroadcastContent: z.enum(["none", "upcoming", "live"]),
        defaultLanguage: z.string().optional(),
        localized: z.object({
          title: z.string(),
          description: z.string(),
        }),
        defaultAudioLanguage: z.string().optional(),
      }),
      liveStreamingDetails: z
        .object({
          actualStartTime: z.string().optional(),
          actualEndTime: z.string().optional(),
          scheduledStartTime: z.string(),
          concurrentViewers: z.string().optional(),
          activeLiveChatId: z.string().optional(),
        })
        .optional(),
    })
  ),
});

export type YoutubeGetVideosResponse = z.infer<typeof schema>;

export async function getVideos(
  this: YoutubeClient,
  id: string[]
): Promise<YoutubeGetVideosResponse> {
  const params = {
    url: `/videos`,
    params: {
      part: "snippet,liveStreamingDetails",
      id: id.join(","),
    },
  };

  const response = await this.get(params);
  return schema.parse(response);
}
