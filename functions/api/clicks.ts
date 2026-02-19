/**
 * Cloudflare Pages Function: /api/clicks
 * Handles POST — records a click event
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

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = (await request.json()) as {
    link_id: string;
    referrer?: string;
    user_agent?: string;
  };
  await env.DB.prepare(
    "INSERT INTO click_analytics (id, link_id, referrer, user_agent) VALUES (?, ?, ?, ?)"
  )
    .bind(crypto.randomUUID(), body.link_id, body.referrer ?? null, body.user_agent ?? null)
    .run();
  await env.DB.prepare("UPDATE links SET clicks = clicks + 1 WHERE id = ?")
    .bind(body.link_id)
    .run();
  return json({ success: true }, 201);
};
