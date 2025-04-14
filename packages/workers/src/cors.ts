const CORS_ALLOW_URLS = [
  /^([^.]*\.)?chzstream\.pages\.dev$/,
  /^([^.]*\.)?chzstream\.app$/,
];

function isAllowedOrigin(url: string): boolean {
  const { hostname } = new URL(url);

  for (const regex of CORS_ALLOW_URLS) {
    if (regex.test(hostname)) {
      return true;
    }
  }

  return false;
}

export function cors(request: Request<unknown, unknown>): HeadersInit {
  const origin = request.headers.get("Origin");

  if (origin !== null && isAllowedOrigin(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
    };
  }

  return {};
}
