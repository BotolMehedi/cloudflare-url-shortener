import { getUserFromSession } from "./auth-utils";

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
    const user = await getUserFromSession(env.DB, request);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { results } = await env.DB.prepare("SELECT * FROM blocked_domains ORDER BY created_at DESC").all();
    return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
    });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    const user = await getUserFromSession(env.DB, request);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { domain, reason } = await request.json() as any;
    if (!domain) return new Response(JSON.stringify({ error: "Missing domain" }), { status: 400 });

    try {
        const id = crypto.randomUUID();
        await env.DB.prepare("INSERT INTO blocked_domains (id, domain, reason, created_at) VALUES (?, ?, ?, ?)")
            .bind(id, domain, reason, Date.now())
            .run();
        return new Response(JSON.stringify({ success: true, id }), { status: 201 });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Domain likely already blocked" }), { status: 400 });
    }
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
    const user = await getUserFromSession(env.DB, request);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    await env.DB.prepare("DELETE FROM blocked_domains WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }));
};
