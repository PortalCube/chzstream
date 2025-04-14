import { cors } from "./cors.ts";

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
