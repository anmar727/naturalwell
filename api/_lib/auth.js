import crypto from "node:crypto";

// The admin password lives only on the server, in the ADMIN_PASSWORD
// environment variable in Vercel. Until it is set, admin actions are refused.
export function checkAdmin(req) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return { ok: false, status: 503, error: "Admin password is not set up yet. Add ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then redeploy." };
  const given = String(req.headers["x-admin-password"] || "");
  const a = crypto.createHash("sha256").update(given).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  if (!given || !crypto.timingSafeEqual(a, b)) return { ok: false, status: 401, error: "Wrong admin password." };
  return { ok: true };
}

export function requireAdmin(req, res) {
  const r = checkAdmin(req);
  if (!r.ok) { res.status(r.status).json({ error: r.error }); return false; }
  return true;
}
