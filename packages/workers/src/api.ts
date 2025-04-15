import { createJSONResponse } from "@workers/response.ts";
import { StreamClient } from "@chzstream/api";

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
  const client = new StreamClient();

  const response = await client.getLiveList({
    platform: "chzzk",
  });

  return createJSONResponse(request, {
    status: 200,
    message: "ok",
    body: response,
  });
};
