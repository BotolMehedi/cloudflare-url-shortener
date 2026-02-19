import { getUserFromSession } from "./auth-utils";

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
    const user = await getUserFromSession(env.DB, request);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const search = url.searchParams.get("search") || "";
    const limit = 20;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM links";
    const params: any[] = [];

    if (search) {
        query += " WHERE original_url LIKE ? OR short_code LIKE ? OR alias LIKE ?";
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const { results } = await env.DB.prepare(query).bind(...params).all();

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM links";
    const countParams: any[] = [];
    if (search) {
        countQuery += " WHERE original_url LIKE ? OR short_code LIKE ? OR alias LIKE ?";
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const total = await env.DB.prepare(countQuery).bind(...countParams).first("total");

    return new Response(JSON.stringify({
        links: results,
        pagination: { page, limit, total: total || 0, pages: Math.ceil((total as number || 0) / limit) }
    }), {
        headers: { "Content-Type": "application/json" }
    });
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
    const user = await getUserFromSession(env.DB, request);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { id, alias, is_active } = await request.json() as any;

    if (alias) {
        // Check if alias exists
        const existing = await env.DB.prepare("SELECT * FROM links WHERE (alias = ? OR short_code = ?) AND id != ?")
            .bind(alias, alias, id).first();
        if (existing) {
            return new Response(JSON.stringify({ error: "Alias already taken" }), { status: 400 });
        }
    }

    await env.DB.prepare("UPDATE links SET alias = ?, is_active = ? WHERE id = ?")
        .bind(alias || null, is_active ? 1 : 0, id)
        .run();

    return new Response(JSON.stringify({ success: true }));
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
    const user = await getUserFromSession(env.DB, request);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });

    await env.DB.prepare("DELETE FROM links WHERE id = ?").bind(id).run();

    return new Response(JSON.stringify({ success: true }));
};
