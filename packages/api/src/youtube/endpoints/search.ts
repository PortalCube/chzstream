import { YoutubeClient } from "@api/youtube/client.ts";
import { z } from "zod";

const schema = z.object({
  kind: z.string(),
  etag: z.string(),
  nextPageToken: z.string().optional(),
  regionCode: z.string(),
  pageInfo: z.object({
    totalResults: z.number(),
    resultsPerPage: z.number(),
  }),
  items: z.array(
    z.object({
      kind: z.string(),
      etag: z.string(),
      id: z.object({
        kind: z.string(),
        channelId: z.string().optional(),
        videoId: z.string().optional(),
      }),
      snippet: z.object({
        publishedAt: z.string(),
        channelId: z.string(),
        title: z.string(),
        description: z.string(),
        thumbnails: z.object({
          default: z.object({
            url: z.string(),
            width: z.number().optional(),
            height: z.number().optional(),
          }),
          medium: z.object({
            url: z.string(),
            width: z.number().optional(),
            height: z.number().optional(),
          }),
          high: z.object({
            url: z.string(),
            width: z.number().optional(),
            height: z.number().optional(),
          }),
        }),
        channelTitle: z.string(),
        liveBroadcastContent: z.enum(["none", "upcoming", "live"]),
        publishTime: z.string(),
      }),
    })
  ),
});

export type YoutubeSearchResponse = z.infer<typeof schema>;

export type YoutubeSearchOptions = {
  query: string;
  size?: number;
  order?:
    | "date"
    | "rating"
    | "relevance"
    | "title"
    | "videoCount"
    | "viewCount";
  type?: "video" | "channel" | "playlist";
  eventType?: "completed" | "live" | "upcoming";
  channelId?: string;
};

export async function search(
  this: YoutubeClient,
  options: YoutubeSearchOptions
): Promise<YoutubeSearchResponse> {
  const { size = 50 } = options;

  const value = {
    url: `/search`,
    params: {
      part: "snippet",
      q: options.query,
      maxRequests: size,
    } as Record<string, unknown>,
  };

  if (options.order) {
    value.params.order = options.order;
  }

  if (options.type) {
    value.params.type = options.type;
  }

  if (options.eventType) {
    value.params.eventType = options.eventType;
  }

  if (options.channelId) {
    value.params.channelId = options.channelId;
  }

  const response = await this.get(value);
  return schema.parse(response);
}
