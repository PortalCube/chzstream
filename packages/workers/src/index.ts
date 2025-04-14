import { defaultRoute, helloRoute } from "./api.ts";
import { createShareLayout, viewShareLayout } from "./share.ts";
import { match } from "path-to-regexp";
import { createJSONResponse, createResponse } from "./response.ts";

const routers: Route[] = [
  {
    // CORS preflight request
    method: "OPTIONS",
    path: "*path",
    handler: (request) => createResponse(request, null, 200),
  },
  {
    method: "POST",
    path: "/share",
    handler: createShareLayout,
  },
  {
    method: "GET",
    path: "/share/:id",
    handler: viewShareLayout,
  },
  {
    method: "GET",
    path: "/",
    handler: defaultRoute,
  },
  {
    method: "GET",
    path: "/:name",
    handler: helloRoute,
  },
];

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const { pathname } = new URL(request.url);

    for (const route of routers) {
      const fn = match(route.path);
      const matched = fn(pathname);

      if (matched && request.method === route.method) {
        return await route.handler(request, env, ctx, matched.params);
      }
    }

    return createJSONResponse(request, {
      status: 404,
      message: "Not Found",
      body: null,
    });
  },
} satisfies ExportedHandler<Env>;
