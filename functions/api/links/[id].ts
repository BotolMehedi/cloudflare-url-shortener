/**
 * Cloudflare Pages Function: /api/links/:id
 * Handles GET (by short_code) / DELETE (by id)
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

function mapLink(row: Record<string, unknown>) {
  return {
    id: row.id,
    original_url: row.original_url,
    short_code: row.short_code,
    alias: row.alias,
    clicks: row.clicks,
    is_active: row.is_active === 1 || row.is_active === true,
    created_at: row.created_at,
    expires_at: row.expires_at,
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const shortCode = params.id as string;
  const link = await env.DB.prepare("SELECT * FROM links WHERE short_code = ?")
    .bind(shortCode)
    .first();
  if (!link) return json({ error: "Not found" }, 404);
  return json(mapLink(link));
};

export const onRequestDelete: PagesFunction<Env> = async ({ params, env }) => {
  const id = params.id as string;
  await env.DB.prepare("DELETE FROM links WHERE id = ?").bind(id).run();
  return json({ success: true });
};
