/**
 * Cloudflare Pages Function: /api/links/:id
 * Handles GET (by short_code) / DELETE (by id)
 *
 * GET behavior:
 *  - If the request Accept header looks like a browser/social crawler → serve an
 *    HTML page with full OG / Twitter meta tags that immediately JS-redirects to
 *    the original URL.  Social crawlers (Slack, Twitter, Facebook, iMessage, etc.)
 *    don't execute JS so they read the meta tags and render the card.
 *  - If the request looks like a plain API call (Accept: application/json or no
 *    text/html in Accept) → return the JSON link object as before.
 *
 * This file lives at:  functions/api/links/[id].ts
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
    og_image: row.og_image ?? null,
    og_title: row.og_title ?? null,
    og_description: row.og_description ?? null,
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildOgHtml(link: ReturnType<typeof mapLink>): string {
  const title = escapeHtml(link.og_title as string || "Shared Link");
  const description = escapeHtml(link.og_description as string || "Click to open this link.");
  const image = link.og_image ? escapeHtml(link.og_image as string) : "";
  const destination = escapeHtml(link.original_url as string);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Primary Meta -->
  <title>${title}</title>
  <meta name="description" content="${description}" />

  <!-- Open Graph (Facebook, Slack, Discord, iMessage, etc.) -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${destination}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  ${image ? `<meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />` : ""}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  ${image ? `<meta name="twitter:image" content="${image}" />` : ""}

  <!-- Instant redirect for real browsers -->
  <meta http-equiv="refresh" content="0;url=${destination}" />
</head>
<body>
  <p>Redirecting… <a href="${destination}">Click here if not redirected</a></p>
  <script>window.location.replace("${destination.replace(/"/g, '\\"')}");</script>
</body>
</html>`;
}

export const onRequestGet: PagesFunction<Env> = async ({ params, request, env }) => {
  const shortCode = params.id as string;

  const link = await env.DB.prepare("SELECT * FROM links WHERE short_code = ?")
    .bind(shortCode)
    .first();

  if (!link) return json({ error: "Not found" }, 404);

  const mapped = mapLink(link);

  // If this link has social card data AND the requester accepts HTML
  // (i.e. a browser or social crawler), serve the OG meta page.
  const accept = request.headers.get("Accept") ?? "";
  const hasSocialData = mapped.og_title || mapped.og_description || mapped.og_image;

  if (hasSocialData && accept.includes("text/html")) {
    return new Response(buildOgHtml(mapped), {
      status: 200,
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        // Allow crawlers to cache the preview for 1 hour
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Default: return JSON (used by the frontend API client)
  return json(mapped);
};

export const onRequestDelete: PagesFunction<Env> = async ({ params, env }) => {
  const id = params.id as string;
  await env.DB.prepare("DELETE FROM links WHERE id = ?").bind(id).run();
  return json({ success: true });
};