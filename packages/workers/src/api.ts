import {
  createBadRequestResponse,
  createJSONResponse,
  createNotFoundResponse,
} from "@workers/response.ts";
import {
  StreamClient,
  StreamGetLiveListOptions,
  StreamSearchChannelOptions,
  StreamSearchLiveOptions,
  StreamSearchTagOptions,
} from "@chzstream/api";

function isValidPlatform(platform: unknown): platform is "chzzk" {
  if (typeof platform !== "string") return false;
  return ["chzzk"].includes(platform);
}

function toNumber(value: unknown): number | null {
  const regexp = /^\d+$/;

  if (typeof value !== "string") return null;
  if (regexp.test(value) === false) return null;

  return Number(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export const getChannelRoute: Endpoint = async (
  request,
  env,
  ctx,
  params
): Promise<Response> => {
  const { platform, channelId } = params;

  // Check if the platform is valid
  if (!isValidPlatform(platform)) {
    return createNotFoundResponse(request);
  }

  const client = new StreamClient();

  if (typeof channelId !== "string") {
    return createBadRequestResponse(request, "channelId");
  }

  const response = await client.getChannel({
    platform,
    id: channelId,
  });

  return createJSONResponse(request, {
    status: 200,
    message: "ok",
    body: response,
  });
};

export const getLiveListRoute: Endpoint = async (
  request,
  env,
  ctx,
  params
): Promise<Response> => {
  const { searchParams } = new URL(request.url);
  const { platform } = params;

  // Check if the platform is valid
  if (!isValidPlatform(platform)) {
    return createNotFoundResponse(request);
  }

  const client = new StreamClient();

  const options: StreamGetLiveListOptions = {
    platform,
  };

  const size = toNumber(searchParams.get("size"));

  if (size !== null) {
    options.size = clamp(size, 1, 50);
  }

  const response = await client.getLiveList(options);

  return createJSONResponse(request, {
    status: 200,
    message: "ok",
    body: response,
  });
};

export const searchChannelRoute: Endpoint = async (
  request,
  env,
  ctx,
  params
): Promise<Response> => {
  const { searchParams } = new URL(request.url);
  const { platform } = params;

  // Check if the platform is valid
  if (!isValidPlatform(platform)) {
    return createNotFoundResponse(request);
  }

  const client = new StreamClient();

  const query = searchParams.get("query");

  if (query === null) {
    return createBadRequestResponse(request, "query");
  }

  const options: StreamSearchChannelOptions = {
    platform,
    query,
  };

  const size = toNumber(searchParams.get("size"));

  if (size !== null) {
    options.size = clamp(size, 1, 50);
  }

  const response = await client.searchChannel(options);

  return createJSONResponse(request, {
    status: 200,
    message: "ok",
    body: response,
  });
};

export const searchLiveRoute: Endpoint = async (
  request,
  env,
  ctx,
  params
): Promise<Response> => {
  const { searchParams } = new URL(request.url);
  const { platform } = params;

  // Check if the platform is valid
  if (!isValidPlatform(platform)) {
    return createNotFoundResponse(request);
  }

  const client = new StreamClient();

  const query = searchParams.get("query");

  if (query === null) {
    return createBadRequestResponse(request, "query");
  }

  const options: StreamSearchLiveOptions = {
    platform,
    query,
  };

  const size = toNumber(searchParams.get("size"));

  if (size !== null) {
    options.size = clamp(size, 1, 50);
  }

  const response = await client.searchLive(options);

  return createJSONResponse(request, {
    status: 200,
    message: "ok",
    body: response,
  });
};

export const searchTagRoute: Endpoint = async (
  request,
  env,
  ctx,
  params
): Promise<Response> => {
  const { searchParams } = new URL(request.url);
  const { platform } = params;

  // Check if the platform is valid
  if (!isValidPlatform(platform)) {
    return createNotFoundResponse(request);
  }

  const client = new StreamClient();

  const query = searchParams.get("query");

  if (query === null) {
    return createBadRequestResponse(request, "query");
  }

  const options: StreamSearchTagOptions = {
    platform,
    query,
  };

  const size = toNumber(searchParams.get("size"));

  if (size !== null) {
    options.size = clamp(size, 1, 50);
  }

  const response = await client.searchTag(options);

  return createJSONResponse(request, {
    status: 200,
    message: "ok",
    body: response,
  });
};
