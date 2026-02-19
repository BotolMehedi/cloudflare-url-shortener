/**
 * Cloudflare Worker API for AHCX
 * Deploy separately: cd cloudflare && wrangler deploy
 * Or use Cloudflare Pages Functions by moving to functions/api/
 */

export interface Env {
  DB: D1Database;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function cors() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") return cors();

    try {
      // GET /api/links - List all links
      if (path === "/api/links" && request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT * FROM links ORDER BY created_at DESC"
        ).all();
        return json(results?.map(mapLink) ?? []);
      }

      // POST /api/links - Create a link
      if (path === "/api/links" && request.method === "POST") {
        const body = (await request.json()) as {
          original_url: string;
          short_code: string;
          alias?: string;
          expires_at?: string;
        };
        const id = crypto.randomUUID();
        await env.DB.prepare(
          "INSERT INTO links (id, original_url, short_code, alias, expires_at) VALUES (?, ?, ?, ?, ?)"
        )
          .bind(id, body.original_url, body.short_code, body.alias ?? null, body.expires_at ?? null)
          .run();
        const link = await env.DB.prepare("SELECT * FROM links WHERE id = ?").bind(id).first();
        return json(mapLink(link!), 201);
      }

      // GET /api/links/:shortCode - Get link by short code
      const linkMatch = path.match(/^\/api\/links\/([^/]+)$/);
      if (linkMatch && request.method === "GET") {
        const shortCode = linkMatch[1];
        const link = await env.DB.prepare("SELECT * FROM links WHERE short_code = ?")
          .bind(shortCode)
          .first();
        if (!link) return json({ error: "Not found" }, 404);
        return json(mapLink(link));
      }

      // DELETE /api/links/:id
      if (linkMatch && request.method === "DELETE") {
        const id = linkMatch[1];
        await env.DB.prepare("DELETE FROM links WHERE id = ?").bind(id).run();
        return json({ success: true });
      }

      // PUT /api/links/:id/toggle - Toggle active status
      const toggleMatch = path.match(/^\/api\/links\/([^/]+)\/toggle$/);
      if (toggleMatch && request.method === "PUT") {
        const id = toggleMatch[1];
        await env.DB.prepare(
          "UPDATE links SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE id = ?"
        )
          .bind(id)
          .run();
        return json({ success: true });
      }

      // DELETE /api/links - Delete all links
      if (path === "/api/links" && request.method === "DELETE") {
        await env.DB.prepare("DELETE FROM links").run();
        return json({ success: true });
      }

      // POST /api/clicks - Record a click
      if (path === "/api/clicks" && request.method === "POST") {
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
        // Increment click count
        await env.DB.prepare("UPDATE links SET clicks = clicks + 1 WHERE id = ?")
          .bind(body.link_id)
          .run();
        return json({ success: true }, 201);
      }

      // GET /api/links/:shortCode/check - Check if short code exists
      const checkMatch = path.match(/^\/api\/links\/([^/]+)\/check$/);
      if (checkMatch && request.method === "GET") {
        const shortCode = checkMatch[1];
        const link = await env.DB.prepare("SELECT id FROM links WHERE short_code = ?")
          .bind(shortCode)
          .first();
        return json({ taken: !!link });
      }

      return json({ error: "Not found" }, 404);
    } catch (err: any) {
      return json({ error: err.message }, 500);
    }
  },
};

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
