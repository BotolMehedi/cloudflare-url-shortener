interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    try {
        const { name, email, subject, message } = await request.json() as any;

        if (!name || !email || !message) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const id = crypto.randomUUID();
        const createdAt = Date.now();

        await env.DB.prepare(
            "INSERT INTO contacts (id, name, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?, ?)"
        )
            .bind(id, name, email, subject || null, message, createdAt)
            .run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: "Server error", details: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
