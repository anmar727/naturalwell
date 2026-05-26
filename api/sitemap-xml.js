var SUPABASE_URL = process.env.SUPABASE_URL;
var SUPABASE_KEY = process.env.SUPABASE_KEY;

module.exports = async function handler(req, res) {
  var base = "https://www.naturalwellblog.com";
  var today = new Date().toISOString().slice(0, 10);

  var staticPages = [
    { loc: base + "/", priority: "1.0", freq: "daily" },
    { loc: base + "/about", priority: "0.6", freq: "monthly" },
    { loc: base + "/contact", priority: "0.5", freq: "monthly" },
    { loc: base + "/privacy", priority: "0.3", freq: "yearly" },
  ];

  var articlePages = [];
  try {
    var r = await fetch(SUPABASE_URL + "/rest/v1/articles?select=slug,date&order=created_at.desc", {
      headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY }
    });
    var articles = await r.json();
    if (Array.isArray(articles)) {
      articlePages = articles.map(function(a) {
        return { loc: base + "/article/" + a.slug, priority: "0.8", freq: "monthly", date: a.date || today };
      });
    }
  } catch(e) {}

  var xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  staticPages.forEach(function(p) {
    xml += "<url><loc>" + p.loc + "</loc><lastmod>" + today + "</lastmod><changefreq>" + p.freq + "</changefreq><priority>" + p.priority + "</priority></url>";
  });

  articlePages.forEach(function(p) {
    xml += "<url><loc>" + p.loc + "</loc><lastmod>" + (p.date || today) + "</lastmod><changefreq>" + p.freq + "</changefreq><priority>" + p.priority + "</priority></url>";
  });

  xml += "</urlset>";

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(xml);
};
