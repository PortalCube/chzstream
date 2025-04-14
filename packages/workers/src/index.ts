import { defaultRoute, helloRoute } from "./api.ts";
import { createShareLayout, listShareLayout, viewShareLayout } from "./d1.ts";
import { match } from "path-to-regexp";

const routers: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  handler: Route;
}[] = [
  {
    method: "GET",
    path: "/d1/create",
    handler: createShareLayout,
  },
  {
    method: "GET",
    path: "/d1/list",
    handler: listShareLayout,
  },
  {
    method: "GET",
    path: "/d1/:id",
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

    return Response.json(
      { code: 404, message: "Sorry, we couldn’t find that resource." },
      { status: 404 }
    );
  },
} satisfies ExportedHandler<Env>;
