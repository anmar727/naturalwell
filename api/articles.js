var SUPABASE_URL = process.env.SUPABASE_URL;
var SUPABASE_KEY = process.env.SUPABASE_KEY;

async function supabase(method, path, body) {
  var res = await fetch(SUPABASE_URL + "/rest/v1/" + path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
      "Prefer": method === "POST" ? "return=representation" : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  var text = await res.text();
  return text ? JSON.parse(text) : [];
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // GET all articles
    if (req.method === "GET") {
      var articles = await supabase("GET", "articles?select=*&order=created_at.desc");
      return res.status(200).json(articles.map(function(a) {
        return Object.assign({}, a, { tags: a.tags ? a.tags.split(",").map(function(t) { return t.trim(); }) : [] });
      }));
    }

    // POST - save new article
    if (req.method === "POST") {
      var article = req.body;
      var row = {
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt || "",
        content: article.content || "",
        tags: Array.isArray(article.tags) ? article.tags.join(", ") : (article.tags || ""),
        read_time: article.readTime || "5 min",
        word_count: article.wordCount || 800,
        date: article.date || new Date().toISOString().slice(0, 10),
        custom_image: article.customImage || null,
      };
      var result = await supabase("POST", "articles", row);
      return res.status(200).json({ success: true, article: result[0] });
    }

    // PUT - update existing article
    if (req.method === "PUT") {
      var article = req.body;
      var row = {
        title: article.title,
        excerpt: article.excerpt || "",
        content: article.content || "",
        tags: Array.isArray(article.tags) ? article.tags.join(", ") : (article.tags || ""),
        read_time: article.readTime || "5 min",
        word_count: article.wordCount || 800,
        custom_image: article.customImage || null,
      };
      await supabase("PATCH", "articles?id=eq." + article.id, row);
      return res.status(200).json({ success: true });
    }

    // DELETE - remove article
    if (req.method === "DELETE") {
      var id = req.body.id;
      await supabase("DELETE", "articles?id=eq." + id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
