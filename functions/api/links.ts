/**
 * Cloudflare Pages Function: /api/links
 * Handles GET (list all - public? maybe should be restricted or just for recent) / POST (create)
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

// Public list of links filtered by Client ID
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const clientId = request.headers.get("X-Client-ID");

  const { results } = await env.DB.prepare(
    "SELECT * FROM links WHERE is_active = 1 AND client_id = ? ORDER BY created_at DESC LIMIT 50"
  ).bind(clientId || "").all();

  return json(results?.map(mapLink) ?? []);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const clientId = request.headers.get("X-Client-ID");
    const body = await request.json() as {
      original_url: string;
      short_code: string;
      alias?: string;
      expires_at?: string;
    };

    if (!body.original_url || !body.short_code) {
      return json({ error: "Missing required fields" }, 400);
    }

    // Check for blocked domains
    try {
      const url = new URL(body.original_url);
      const hostname = url.hostname;
      const blocked = await env.DB.prepare("SELECT * FROM blocked_domains WHERE domain = ?").bind(hostname).first();

      if (blocked) {
        return json({ error: "This domain is blocked and cannot be shortened." }, 400);
      }
    } catch (e) {
      return json({ error: "Invalid URL" }, 400);
    }

    const id = crypto.randomUUID();

    await env.DB.prepare(
      "INSERT INTO links (id, original_url, short_code, alias, expires_at, created_at, client_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        id,
        body.original_url,
        body.short_code,
        body.alias ?? null,
        body.expires_at ?? null,
        Date.now(),
        clientId || null
      )
      .run();

    const link = await env.DB.prepare(
      "SELECT * FROM links WHERE id = ?"
    ).bind(id).first();

    return json(mapLink(link!), 201);

  } catch (err) {
    return json({ error: "Server error", details: String(err) }, 500);
  }
};
