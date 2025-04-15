import {
  getChannelRoute,
  getLiveListRoute,
  searchChannelRoute,
  searchLiveRoute,
  searchTagRoute,
} from "@workers/api.ts";
import { createNotFoundResponse, createResponse } from "@workers/response.ts";
import { createShareLayout, viewShareLayout } from "@workers/share.ts";
import { match } from "path-to-regexp";

const routers: Route[] = [
  // CORS preflight request
  {
    method: "OPTIONS",
    path: "*path",
    handler: (request) => createResponse(request, null, 200),
    ttl: 60,
  },

  // URL Share endpoints
  {
    method: "POST",
    path: "/share",
    handler: createShareLayout,
    ttl: null,
  },
  {
    method: "GET",
    path: "/share/:id",
    handler: viewShareLayout,
    ttl: 60,
  },

  // API proxy
  {
    method: "GET",
    path: "/:platform/channel/:channelId",
    handler: getChannelRoute,
    ttl: 10,
  },
  {
    method: "GET",
    path: "/:platform/live",
    handler: getLiveListRoute,
    ttl: 10,
  },
  {
    method: "GET",
    path: "/:platform/search/channel",
    handler: searchChannelRoute,
    ttl: 10,
  },
  {
    method: "GET",
    path: "/:platform/search/live",
    handler: searchLiveRoute,
    ttl: 10,
  },
  {
    method: "GET",
    path: "/:platform/search/tag",
    handler: searchTagRoute,
    ttl: 10,
  },
];

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const { pathname } = new URL(request.url);

    for (const route of routers) {
      const fn = match(route.path);
      const matched = fn(pathname);

      if (request.method !== route.method) continue;
      if (matched === false) continue;

      // Check cache
      const cacheKey = new Request(request.url, request);
      const cacheResponse = await caches.default.match(cacheKey);
      if (cacheResponse !== undefined) {
        return cacheResponse;
      }

      // Create new response and write to cache
      const response = await route.handler(request, env, ctx, matched.params);

      if (response.status === 200) {
        response.headers.append("Cache-Control", "s-maxage=" + route.ttl);
        ctx.waitUntil(caches.default.put(cacheKey, response.clone()));
      }

      return response;
    }

    return createNotFoundResponse(request);
  },
} satisfies ExportedHandler<Env>;
