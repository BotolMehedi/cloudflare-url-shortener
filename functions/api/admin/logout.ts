interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async () => {
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `session_id=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
        }
    });
};
