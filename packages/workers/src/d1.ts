export const createShareLayout: Route = async (
  request,
  env,
  ctx
): Promise<Response> => {
  const uuid = crypto.randomUUID();

  // test layout
  const layout = {
    id: uuid,
    layout: {
      name: "test",
      type: "test",
      data: {
        id: uuid,
        name: "test",
        type: "test",
        data: {},
      },
    },
  };

  const layoutString = JSON.stringify(layout);

  const result = await env.DB.prepare(
    `INSERT INTO shared_layout(id, layout) VALUES(?1, ?2)`
  )
    .bind(uuid, layoutString)
    .run();

  if (result.error) {
    return Response.json({
      code: 500,
      message: "create failed",
      error: result.error,
    });
  }

  return Response.json({
    code: 200,
    message: "create success",
    id: uuid,
  });
};

export const viewShareLayout: Route = async (
  request,
  env,
  ctx,
  params
): Promise<Response> => {
  console.log(params.id);
  const results = await env.DB.prepare(
    "SELECT * FROM shared_layout WHERE id = ?1"
  )
    .bind(params.id)
    .first();

  return Response.json(results);
};

export const listShareLayout: Route = async (
  request,
  env,
  ctx
): Promise<Response> => {
  const { results } = await env.DB.prepare("SELECT * FROM shared_layout").all();
  return Response.json(results);
};
