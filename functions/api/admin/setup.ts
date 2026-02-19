interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ env }) => {
  try {
    // 1. Users Table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        password_hash TEXT,
        role TEXT DEFAULT 'admin',
        created_at INTEGER
      )
    `).run();

    // 2. Sessions Table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        expires_at INTEGER,
        created_at INTEGER
      )
    `).run();

    // 3. Reports Table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        link_id TEXT,
        reporter_name TEXT,
        reporter_email TEXT,
        link_url TEXT,
        reason TEXT,
        status TEXT DEFAULT 'pending',
        created_at INTEGER
      )
    `).run();

    // 4. Blocked Domains Table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS blocked_domains (
        id TEXT PRIMARY KEY,
        domain TEXT UNIQUE,
        reason TEXT,
        created_at INTEGER
      )
    `).run();

    // 5. Contacts Table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'unread',
        created_at INTEGER
      )
    `).run();

    // Check if admin exists
    const admin = await env.DB.prepare("SELECT * FROM users WHERE username = 'admin'").first();

    let message = "Tables created/verified.";

    if (!admin) {

      const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("admin"));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

      await env.DB.prepare(
        "INSERT INTO users (id, username, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)"
      ).bind(crypto.randomUUID(), "admin", hashHex, "admin", Date.now()).run();

      message += " Default admin user created.";
    }

    // 6. Links Table (Ensuring it has client_id)
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS links (
        id TEXT PRIMARY KEY,
        original_url TEXT NOT NULL,
        short_code TEXT NOT NULL UNIQUE,
        alias TEXT,
        clicks INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER,
        expires_at INTEGER,
        client_id TEXT
      )
    `).run();

    await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_links_client_id ON links(client_id)`).run();

    return new Response(JSON.stringify({ success: true, message }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
