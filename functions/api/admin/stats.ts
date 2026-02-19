import { getUserFromSession } from "./auth-utils";

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
    const user = await getUserFromSession(env.DB, request);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const totalLinks = await env.DB.prepare("SELECT COUNT(*) as count FROM links").first("count");
    const totalClicks = await env.DB.prepare("SELECT SUM(clicks) as count FROM links").first("count");
    const totalReports = await env.DB.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'").first("count");
    const totalBlocked = await env.DB.prepare("SELECT COUNT(*) as count FROM blocked_domains").first("count");

    // Recent 5 links
    const recentLinks = await env.DB.prepare("SELECT * FROM links ORDER BY created_at DESC LIMIT 5").all();

    return new Response(JSON.stringify({
        stats: {
            totalLinks: totalLinks || 0,
            totalClicks: totalClicks || 0,
            pendingReports: totalReports || 0,
            blockedDomains: totalBlocked || 0
        },
        recentLinks: recentLinks.results
    }), {
        headers: { "Content-Type": "application/json" }
    });
};
