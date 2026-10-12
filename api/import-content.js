// Temporary one-time importer. Removed after use.
import crypto from "node:crypto";
import { db } from "./_lib/db.js";
import { wordCount, readTime } from "../shared/markdown.js";
import items from "./_lib/content-data.js";

const HASH = "e4c04bc1f36430507b14dbc07898e0f27c942bc58c8f27804883c89c68ef1a3d";

export default async function handler(req, res) {
  const t = String((req.query && req.query.token) || "");
  if (crypto.createHash("sha256").update(t).digest("hex") !== HASH) return res.status(404).send("Not found");
  const done = [];
  for (const m of items) {
    await db("PATCH", "articles?slug=eq." + encodeURIComponent(m.slug), {
      title: m.title, excerpt: m.excerpt, content: m.content, tags: m.tags,
      category: m.category, evidence_level: m.evidence_level, evidence_summary: m.evidence_summary,
      word_count: wordCount(m.content), read_time: readTime(m.content), updated_at: new Date().toISOString(),
    });
    done.push(m.slug);
  }
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ updated: done.length });
}
