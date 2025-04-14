type RawEndpoint = ExportedHandlerFetchHandler<Env, unknown>;

type Endpoint = RawEndpoint extends (...a: any[]) => infer R
  ? (
      ...a: [
        ...U: Parameters<RawEndpoint>,
        params: Partial<Record<string, string | string[]>>,
      ]
    ) => R
  : never;

type Route = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS";
  path: string;
  handler: Endpoint;
};

type Result = {
  status: number;
  message: string;
  body: unknown;
};
