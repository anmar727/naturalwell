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

export async function listArticles() {
  const rows = await db("GET", "articles?select=" + ARTICLE_FIELDS + "&order=created_at.desc");
  return Array.isArray(rows) ? rows : [];
}
