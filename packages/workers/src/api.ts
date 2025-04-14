import { createJSONResponse } from "./response.ts";

export const defaultRoute: Endpoint = async (
  request,
  env,
  ctx
): Promise<Response> => {
  return createJSONResponse(request, {
    status: 200,
    message: "ok",
    body: "Hello, World!",
  });
};

export const helloRoute: Endpoint = async (
  request,
  env,
  ctx,
  params
): Promise<Response> => {
  return createJSONResponse(request, {
    status: 200,
    message: "ok",
    body: `Hello, ${params.name}!`,
  });
};
