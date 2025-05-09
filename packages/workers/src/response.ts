import { cors } from "@workers/cors.ts";

export function createJSONResponse(
  request: Request<unknown, unknown>,
  response: Result
) {
  return Response.json(response, {
    status: response.status,
    headers: cors(request),
  });
}

export function createResponse(
  request: Request<unknown, unknown>,
  response: string | null,
  status: number = 200
) {
  return new Response(response, { status, headers: cors(request) });
}

export function createInternalErrorResponse(
  request: Request<unknown, unknown>
) {
  return createJSONResponse(request, {
    status: 500,
    message: "Internal Server Error",
    body: null,
  });
}

export function createNotFoundResponse(request: Request<unknown, unknown>) {
  return createJSONResponse(request, {
    status: 404,
    message: "Resource not found.",
    body: null,
  });
}

export function createBadRequestResponse(
  request: Request<unknown, unknown>,
  target: string,
  type?: string[] | object
) {
  if (Array.isArray(type)) {
    return createJSONResponse(request, {
      status: 400,
      message: `Bad request. "${target}" must be one of [${type.join(", ")}].`,
      body: null,
    });
  }

  if (typeof type === "object") {
    const typeName = "name" in type ? type["name"] : "unknown";
    return createJSONResponse(request, {
      status: 400,
      message: `Bad request. "${target}" must be of type "${typeName}".`,
      body: null,
    });
  }

  return createJSONResponse(request, {
    status: 400,
    message: `Bad request. "${target}" is not valid.`,
    body: null,
  });
}
