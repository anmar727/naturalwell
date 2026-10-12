// Turns a database row into the article shape the views use.
import { readTime, wordCount } from "./markdown.js";

export function normalizeArticle(a) {
  if (!a) return null;
  var tags = Array.isArray(a.tags) ? a.tags : String(a.tags || "").split(",").map(function (t) { return t.trim(); }).filter(Boolean);
  var img = a.custom_image || a.customImage || null;
  if (img && img.indexOf("data:") === 0 && img.length > 400000) img = null; // never ship huge inline images
  return {
    id: String(a.id),
    slug: a.slug,
    title: a.title || "",
    excerpt: a.excerpt || "",
    content: a.content == null ? undefined : a.content,
    tags: tags,
    category: a.category || null,
    readTime: a.content ? readTime(a.content) : (a.read_time || a.readTime || "5 min"),
    wordCount: a.content ? wordCount(a.content) : (a.word_count || a.wordCount || 0),
    date: a.date || "",
    updated: a.updated_at ? String(a.updated_at).slice(0, 10) : null,
    image: img,
    evidenceLevel: a.evidence_level || a.evidenceLevel || null,
    evidenceSummary: a.evidence_summary || a.evidenceSummary || "",
  };
}

// Metadata only (no body) for lists.
export function toMeta(a) {
  var m = Object.assign({}, a);
  delete m.content;
  return m;
}

var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function formatDate(iso) {
  if (!iso) return "";
  var p = String(iso).slice(0, 10).split("-");
  if (p.length !== 3) return iso;
  return Number(p[2]) + " " + MONTHS[Number(p[1]) - 1] + " " + p[0];
}

export var LEVELS = {
  strong: { label: "Strong", text: "Consistent results from good-quality trials or reviews." },
  moderate: { label: "Moderate", text: "Some good trials support it, but results vary or studies are small." },
  limited: { label: "Limited", text: "Early or small studies only. Promising at best." },
  weak: { label: "Weak", text: "Little or no reliable evidence for the popular claim." },
};
