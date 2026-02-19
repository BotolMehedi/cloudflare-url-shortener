interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    try {
        const body = await request.json() as any;
        const { link_url, reporter_name, reporter_email, reason } = body;

        if (!link_url || !reason) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        // Try to find the link ID if it matches one of ours
        let link_id = null;
        try {
            const url = new URL(link_url);
            // Assuming path is like /shortCode
            const path = url.pathname.slice(1);
            if (path) {
                const link = await env.DB.prepare("SELECT id FROM links WHERE short_code = ? OR alias = ?").bind(path, path).first();
                if (link) {
                    link_id = link.id;
                }
            }
        } catch (e) {
            // Ignore URL parsing errors
        }

        const id = crypto.randomUUID();

        await env.DB.prepare(
            "INSERT INTO reports (id, link_id, reporter_name, reporter_email, link_url, reason, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).bind(
            id,
            link_id,
            reporter_name || "Anonymous",
            reporter_email || "",
            link_url,
            reason,
            Date.now()
        ).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
