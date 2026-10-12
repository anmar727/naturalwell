import { db } from "./_lib/db.js";
import { requireAdmin } from "./_lib/auth.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const email = String((req.body && req.body.email) || "").trim().toLowerCase();
      const source = String((req.body && req.body.source) || "").slice(0, 120);
      if (!EMAIL.test(email) || email.length > 200) return res.status(400).json({ error: "Please enter a valid email address." });
      try {
        await db("POST", "subscribers", { email, source }, { Prefer: "return=minimal" });
      } catch (e) {
        if (e.code !== "23505") throw e; // already subscribed is fine
      }
      return res.status(200).json({ ok: true });
    }
    if (req.method === "GET") {
      if (!requireAdmin(req, res)) return;
      const rows = await db("GET", "subscribers?select=email,source,created_at&order=created_at.desc");
      return res.status(200).json(rows);
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: "Could not save your email. Please try again." });
  }
}
