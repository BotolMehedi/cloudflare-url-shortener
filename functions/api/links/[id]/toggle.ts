/**
 * Cloudflare Pages Function: /api/links/:id/toggle
 * Handles PUT — toggles is_active
 */

interface Env {
  DB: D1Database;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequestPut: PagesFunction<Env> = async ({ params, env }) => {
  const id = params.id as string;
  await env.DB.prepare(
    "UPDATE links SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE id = ?"
  )
    .bind(id)
    .run();
  return json({ success: true });
};
