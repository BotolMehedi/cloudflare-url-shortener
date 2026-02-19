export async function hashPassword(password: string): Promise<string> {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function createSession(db: D1Database, userId: string): Promise<string> {
    const sessionId = crypto.randomUUID();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await db.prepare(
        "INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)"
    ).bind(sessionId, userId, expiresAt, Date.now()).run();

    return sessionId;
}

export async function getUserFromSession(db: D1Database, request: Request): Promise<any | null> {
    const cookie = request.headers.get("Cookie");
    if (!cookie) return null;

    const match = cookie.match(/session_id=([^;]+)/);
    if (!match) return null;

    const sessionId = match[1];

    const session = await db.prepare(
        "SELECT * FROM sessions WHERE id = ? AND expires_at > ?"
    ).bind(sessionId, Date.now()).first() as any;

    if (!session) return null;

    return await db.prepare("SELECT * FROM users WHERE id = ?").bind(session.user_id).first();
}
