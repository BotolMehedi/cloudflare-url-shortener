import { hashPassword, getUserFromSession } from "./auth-utils";

interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    try {
        const user = await getUserFromSession(env.DB, request);
        if (!user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const { oldPassword, newPassword } = await request.json() as any;

        if (!oldPassword || !newPassword) {
            return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
        }

        // Verify old password
        const oldHash = await hashPassword(oldPassword);
        if (oldHash !== user.password_hash) {
            return new Response(JSON.stringify({ error: "Incorrect old password" }), { status: 400 });
        }

        // Update password
        const newHash = await hashPassword(newPassword);
        await env.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?")
            .bind(newHash, user.id)
            .run();

        return new Response(JSON.stringify({ success: true }));

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
