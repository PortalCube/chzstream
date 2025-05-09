import { nanoid } from "nanoid";
import {
  createJSONResponse,
  createNotFoundResponse,
} from "@workers/response.ts";

/**
 * 새로운 ID를 생성하고 반환합니다.
 * @param env Env
 * @returns {string | null} 생성된 ID. 생성 실패시 null
 */
async function generateId(env: Env): Promise<string | null> {
  for (let i = 0; i < 10; i++) {
    const id = nanoid(7);

    const result = await env.DB.prepare(
      "SELECT EXISTS(SELECT 1 FROM shared_layout WHERE id = ?1) AS count;"
    )
      .bind(id)
      .first();

    if (result?.count === 0) {
      return id;
    }
  }

  return null;
}

/**
 * body로 전달된 레이아웃 JSON을 DB에 저장합니다.
 */
export const createShareLayout: Endpoint = async (
  request,
  env,
  ctx
): Promise<Response> => {
  const id = await generateId(env);

  if (id === null) {
    return createJSONResponse(request, {
      status: 500,
      message: "Server could not generate an ID.",
      body: null,
    });
  }

  // TODO: body zod validation
  const body = await request.json();
  await env.DB.prepare(`INSERT INTO shared_layout(id, layout) VALUES(?1, ?2)`)
    .bind(id, JSON.stringify(body))
    .run();

  return createJSONResponse(request, {
    status: 200,
    message: "ok",
    body: id,
  });
};

/**
 * 전달 받은 ID와 일치하는 레이아웃 JSON을 DB에서 조회하고 반환합니다.
 */
export const viewShareLayout: Endpoint = async (
  request,
  env,
  ctx,
  params
): Promise<Response> => {
  const row = await env.DB.prepare("SELECT * FROM shared_layout WHERE id = ?1")
    .bind(params.id)
    .first();

  if (row === null) {
    return createNotFoundResponse(request);
  }

  return createJSONResponse(request, {
    status: 200,
    message: "ok",
    body: row,
  });
};
