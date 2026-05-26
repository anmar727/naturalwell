module.exports = async function handler(req, res) {
  var baseUrl = "https://www.naturalwellblog.com";
  var today = new Date().toISOString().slice(0, 10);

  var staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/about", priority: "0.5", changefreq: "monthly" },
    { url: "/contact", priority: "0.5", changefreq: "monthly" },
    { url: "/privacy", priority: "0.3", changefreq: "yearly" },
  ];

  var urls = staticPages.map(function(p) {
    return "<url><loc>" + baseUrl + p.url + "</loc><lastmod>" + today + "</lastmod><changefreq>" + p.changefreq + "</changefreq><priority>" + p.priority + "</priority></url>";
  });

  var sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.join("") + "</urlset>";

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(sitemap);
};
