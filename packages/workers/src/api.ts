export const defaultRoute: Route = async (
  request,
  env,
  ctx
): Promise<Response> => {
  return Response.json({
    message: "Hello, world!",
  });
};

export const helloRoute: Route = async (
  request,
  env,
  ctx,
  params
): Promise<Response> => {
  return Response.json({
    message: `Hello, ${params.name}!`,
  });
};
