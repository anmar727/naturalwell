// Supabase REST helper (server only).
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

export async function db(method, path, body, extraHeaders) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Database is not configured");
  const res = await fetch(SUPABASE_URL + "/rest/v1/" + path, {
    method,
    headers: Object.assign({
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY,
    }, method === "POST" ? { Prefer: "return=representation" } : {}, extraHeaders || {}),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : [];
  if (!res.ok) {
    const err = new Error((data && (data.message || data.hint)) || "Database error " + res.status);
    err.status = res.status;
    err.code = data && data.code;
    throw err;
  }
  return data;
}

export const ARTICLE_FIELDS = "id,slug,title,excerpt,content,tags,category,evidence_level,evidence_summary,read_time,word_count,date,updated_at,custom_image,created_at";

// Articles come from two places:
//  1. the database (written from the admin area), and
//  2. markdown files in content/ committed to the repo (the daily scheduled writer).
// If the same slug exists in both, the database version wins, so edits made in
// the admin area always take priority.
import fs from "node:fs";
import path from "node:path";

function parseFile(file) {
  const raw = fs.readFileSync(file, "utf8");
  const parts = raw.split("---");
  if (parts.length < 3) return null;
  const meta = {};
  parts[1].trim().split("\n").forEach(function (line) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  if (meta.status && meta.status !== "published") return null;
  const date = meta.date || "2026-01-01";
  return {
    id: "file-" + path.basename(file, ".md"),
    slug: path.basename(file, ".md"),
    title: meta.title || "",
    excerpt: meta.excerpt || "",
    content: parts.slice(2).join("---").trim() + "\n",
    tags: meta.tags || "",
    category: meta.category || null,
    evidence_level: meta.evidence_level || null,
    evidence_summary: meta.evidence_summary || null,
    date: date,
    updated_at: meta.updated || null,
    custom_image: meta.image || null,
    created_at: (meta.published_at || date + "T12:00:00Z"),
  };
}

let fileCache = null;
export function fileArticles() {
  if (fileCache) return fileCache;
  const dir = path.join(process.cwd(), "content");
  let list = [];
  try {
    list = fs.readdirSync(dir).filter(function (f) { return f.endsWith(".md"); })
      .map(function (f) { try { return parseFile(path.join(dir, f)); } catch (e) { return null; } })
      .filter(Boolean);
  } catch (e) { list = []; }
  fileCache = list;
  return list;
}

export async function listArticles() {
  const rows = await db("GET", "articles?select=" + ARTICLE_FIELDS + "&order=created_at.desc");
  const fromDb = Array.isArray(rows) ? rows : [];
  const have = new Set(fromDb.map(function (r) { return r.slug; }));
  const extra = fileArticles().filter(function (a) { return !have.has(a.slug); });
  return fromDb.concat(extra).sort(function (a, b) { return String(b.created_at).localeCompare(String(a.created_at)); });
}
