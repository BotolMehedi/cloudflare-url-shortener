import { hashPassword, createSession } from "./auth-utils";

interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    try {
        const { username, password } = await request.json() as any;

        if (!username || !password) {
            return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 });
        }

        // 1. Find user
        const user = await env.DB.prepare("SELECT * FROM users WHERE username = ?").bind(username).first();

        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        // 2. Verify password
        const incomingHash = await hashPassword(password);
        if (incomingHash !== user.password_hash) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        // 3. Create session
        const sessionId = await createSession(env.DB, user.id as string);

        // 4. Set cookie
        return new Response(JSON.stringify({ success: true, user: { username: user.username, role: user.role } }), {
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": `session_id=${sessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`
            }
        });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
