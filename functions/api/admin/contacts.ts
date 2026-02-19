import { getUserFromSession } from "./auth-utils";

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
    const user = await getUserFromSession(env.DB, request);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { results } = await env.DB.prepare(
        "SELECT * FROM contacts ORDER BY created_at DESC"
    ).all();

    return new Response(JSON.stringify({ contacts: results }), {
        headers: { "Content-Type": "application/json" },
    });
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
    const user = await getUserFromSession(env.DB, request);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { id, status } = await request.json() as any;

    if (!id || !status) {
        return new Response(JSON.stringify({ error: "Missing ID or status" }), { status: 400 });
    }

    await env.DB.prepare("UPDATE contacts SET status = ? WHERE id = ?")
        .bind(status, id)
        .run();

    return new Response(JSON.stringify({ success: true }));
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
    const user = await getUserFromSession(env.DB, request);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });

    await env.DB.prepare("DELETE FROM contacts WHERE id = ?").bind(id).run();

    return new Response(JSON.stringify({ success: true }));
};
