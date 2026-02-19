/**
 * Cloudflare Pages Function: /api/links/:id/check
 * Handles GET — checks if a short_code is already taken
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

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const shortCode = params.id as string;
  const link = await env.DB.prepare("SELECT id FROM links WHERE short_code = ?")
    .bind(shortCode)
    .first();
  return json({ taken: !!link });
};
