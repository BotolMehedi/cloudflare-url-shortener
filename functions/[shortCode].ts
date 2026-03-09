/**
 * Cloudflare Pages Function: /:shortCode
 * Serves OG meta tags to social media crawlers, redirects normal users.
 */

interface Env {
  DB: D1Database;
}

const CRAWLER_UA_REGEX = /bot|crawl|spider|slurp|facebook|facebot|twitter|whatsapp|linkedin|telegram|discord|slack|pinterest|tumblr|reddit|skype|viber|snap|embedly|quora|outbrain|vkshare|W3C_Validator|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Discordbot|Slackbot|PinterestBot|redditbot|Googlebot|bingbot|yandex/i;

const EXCLUDED_PATHS = [
  "api", "admin", "history", "privacy", "terms", "disclaimer",
  "contact", "report", "favicon.png", "og-image.png", "robots.txt",
  "assets", "placeholder.svg", "_routes.json"
];

function isExcluded(shortCode: string): boolean {
  return EXCLUDED_PATHS.includes(shortCode) || shortCode.startsWith("_") || shortCode.includes(".");
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Default site meta
const DEFAULT_OG_TITLE = "URL Shortener, Branded Short Links & Analytics | AHCX";
const DEFAULT_OG_DESCRIPTION = "Shorten URLs instantly with AHCX. Free custom aliases, QR codes, link expiration, and real-time click analytics.";
const DEFAULT_OG_IMAGE = "/og-image.png";

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, params, env, next } = context;
  const shortCode = params.shortCode as string;

  // Skip non-shortcode paths
  if (!shortCode || isExcluded(shortCode)) {
    return next();
  }

  const ua = request.headers.get("user-agent") || "";
  const isCrawler = CRAWLER_UA_REGEX.test(ua);

  // Look up the link
  const link = await env.DB.prepare(
    "SELECT * FROM links WHERE short_code = ? AND is_active = 1"
  ).bind(shortCode).first<Record<string, unknown>>();

  if (!link) {
    return next(); // Let SPA handle 404
  }

  // Check expiry
  if (link.expires_at && typeof link.expires_at === "number" && Date.now() > link.expires_at) {
    return next();
  }

  const originalUrl = link.original_url as string;

  // For crawlers: serve HTML with OG meta tags
  if (isCrawler) {
    const ogTitle = escapeHtml((link.og_title as string) || DEFAULT_OG_TITLE);
    const ogDesc = escapeHtml((link.og_description as string) || DEFAULT_OG_DESCRIPTION);
    const ogImage = (link.og_image as string) || DEFAULT_OG_IMAGE;
    const siteUrl = new URL(request.url);
    const fullOgImage = ogImage.startsWith("http") ? ogImage : `${siteUrl.origin}${ogImage}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${ogTitle}</title>
  <meta name="description" content="${ogDesc}" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${ogDesc}" />
  <meta property="og:image" content="${escapeHtml(fullOgImage)}" />
  <meta property="og:url" content="${escapeHtml(siteUrl.href)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="AHCX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${ogDesc}" />
  <meta name="twitter:image" content="${escapeHtml(fullOgImage)}" />
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(originalUrl)}">${escapeHtml(originalUrl)}</a></p>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  }

  // For normal users: record click and redirect
  try {
    const clickId = crypto.randomUUID();
    const referrer = request.headers.get("referer") || null;
    await env.DB.prepare(
      "INSERT INTO click_analytics (id, link_id, referrer, user_agent, clicked_at) VALUES (?, ?, ?, ?, ?)"
    ).bind(clickId, link.id as string, referrer, ua, Date.now()).run();
    await env.DB.prepare(
      "UPDATE links SET clicks = clicks + 1 WHERE id = ?"
    ).bind(link.id as string).run();
  } catch {
    // Don't block redirect on analytics failure
  }

  return Response.redirect(originalUrl, 302);
};
