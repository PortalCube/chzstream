type RawRoute = ExportedHandlerFetchHandler<Env, unknown>;

type Route = RawRoute extends (...a: any[]) => infer R
  ? (
      ...a: [
        ...U: Parameters<RawRoute>,
        params: Partial<Record<string, string | string[]>>,
      ]
    ) => R
  : never;
