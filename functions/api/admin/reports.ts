import { getUserFromSession } from "./auth-utils";

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
    const user = await getUserFromSession(env.DB, request);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { results } = await env.DB.prepare("SELECT * FROM reports ORDER BY created_at DESC").all();
    return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
    });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    const user = await getUserFromSession(env.DB, request);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { id, status } = await request.json() as any;
    await env.DB.prepare("UPDATE reports SET status = ? WHERE id = ?").bind(status, id).run();

    return new Response(JSON.stringify({ success: true }));
};
