import { checkAdmin } from "./_lib/auth.js";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const r = checkAdmin(req);
  if (!r.ok) return res.status(r.status).json({ error: r.error });
  return res.status(200).json({ ok: true });
}
