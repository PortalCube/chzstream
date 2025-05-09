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
      contentDetails: z.object({
        videoId: z.string(),
        videoPublishedAt: z.string(),
      }),
    })
  ),
});

export type YoutubeGetPlaylistItemsResponse = z.infer<typeof schema>;

export type YoutubeGetPlaylistItemsOptions = {
  id: string;
  size?: number;
};

export async function getPlaylistItems(
  this: YoutubeClient,
  options: YoutubeGetPlaylistItemsOptions
): Promise<YoutubeGetPlaylistItemsResponse> {
  const { size = 50 } = options;

  const params = {
    url: `/playlistItems`,
    params: {
      part: "contentDetails",
      playlistId: options.id,
      maxResults: size,
    },
  };

  const response = await this.get(params);
  return schema.parse(response);
}
