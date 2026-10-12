import { db, listArticles } from "./_lib/db.js";
import { requireAdmin } from "./_lib/auth.js";
import { wordCount, readTime } from "../shared/markdown.js";
import { normalizeArticle, toMeta } from "../shared/articles.js";

var LEVELS = ["strong", "moderate", "limited", "weak"];

function toRow(a) {
  return {
    title: String(a.title || "").slice(0, 200),
    excerpt: String(a.excerpt || "").slice(0, 300),
    content: a.content || "",
    tags: Array.isArray(a.tags) ? a.tags.join(", ") : (a.tags || ""),
    category: a.category || null,
    evidence_level: LEVELS.indexOf(a.evidenceLevel) !== -1 ? a.evidenceLevel : null,
    evidence_summary: a.evidenceSummary || null,
    read_time: readTime(a.content),
    word_count: wordCount(a.content),
    custom_image: a.customImage || null,
  };
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600");
      var q = req.query || {};
      if (q.slug) {
        var found = (await listArticles()).find(function (r) { return r.slug === q.slug; });
        if (!found) return res.status(404).json({ error: "Not found" });
        return res.status(200).json(normalizeArticle(found));
      }
      var list = (await listArticles()).map(normalizeArticle);
      return res.status(200).json(q.meta ? list.map(toMeta) : list);
    }

    if (!requireAdmin(req, res)) return;
    res.setHeader("Cache-Control", "no-store");
    var a = req.body || {};

    if (req.method === "POST") {
      var row = Object.assign(toRow(a), {
        id: a.id || String(Date.now()),
        slug: a.slug,
        date: a.date || new Date().toISOString().slice(0, 10),
      });
      if (!row.slug) return res.status(400).json({ error: "Missing slug" });
      var result = await db("POST", "articles", row);
      return res.status(200).json({ success: true, article: normalizeArticle(result[0]) });
    }

    if (req.method === "PUT") {
      if (!a.id) return res.status(400).json({ error: "Missing id" });
      if (String(a.id).indexOf("file-") === 0) {
        // First edit of a scheduled (file-based) article: save a database copy, which then takes priority.
        var src = (await listArticles()).find(function (r) { return r.id === a.id; });
        await db("POST", "articles", Object.assign(toRow(a), { id: String(Date.now()), slug: a.slug, date: (src && src.date) || new Date().toISOString().slice(0, 10), created_at: src && src.created_at, updated_at: new Date().toISOString() }));
        return res.status(200).json({ success: true });
      }
      await db("PATCH", "articles?id=eq." + encodeURIComponent(a.id), Object.assign(toRow(a), { updated_at: new Date().toISOString() }));
      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      if (!a.id) return res.status(400).json({ error: "Missing id" });
      await db("DELETE", "articles?id=eq." + encodeURIComponent(a.id));
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
