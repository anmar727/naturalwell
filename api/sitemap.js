module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    var articles = req.body && req.body.articles ? req.body.articles : [];
    var baseUrl = "https://www.naturalwellblog.com";

    var staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/about", priority: "0.5", changefreq: "monthly" },
      { url: "/contact", priority: "0.5", changefreq: "monthly" },
      { url: "/privacy", priority: "0.3", changefreq: "yearly" },
    ];

    var today = new Date().toISOString().slice(0, 10);

    var urls = staticPages.map(function(p) {
      return [
        "  <url>",
        "    <loc>" + baseUrl + p.url + "</loc>",
        "    <lastmod>" + today + "</lastmod>",
        "    <changefreq>" + p.changefreq + "</changefreq>",
        "    <priority>" + p.priority + "</priority>",
        "  </url>"
      ].join("\n");
    });

    articles.forEach(function(a) {
      if (a.slug) {
        urls.push([
          "  <url>",
          "    <loc>" + baseUrl + "/article/" + a.slug + "</loc>",
          "    <lastmod>" + (a.date || today) + "</lastmod>",
          "    <changefreq>monthly</changefreq>",
          "    <priority>0.8</priority>",
          "  </url>"
        ].join("\n"));
      }
    });

    var sitemap = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls.join("\n"),
      "</urlset>"
    ].join("\n");

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(sitemap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
