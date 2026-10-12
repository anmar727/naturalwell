import { requireAdmin } from "./_lib/auth.js";

// Proxies article-writing requests to the Anthropic API. Admin only, so
// strangers cannot spend the site's API credit.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req, res)) return;
  try {
    const body = Object.assign({}, req.body, { max_tokens: Math.min(Number(req.body && req.body.max_tokens) || 4000, 8000) });
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    if (!text || !text.trim()) return res.status(500).json({ error: "Empty response" });
    res.status(response.ok ? 200 : response.status).json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
