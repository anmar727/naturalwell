module.exports = async function handler(req, res) {
  var base = "https://www.naturalwellblog.com";
  var today = new Date().toISOString().slice(0, 10);
  var pages = [
    { loc: base + "/", priority: "1.0", freq: "daily" },
    { loc: base + "/about", priority: "0.6", freq: "monthly" },
    { loc: base + "/contact", priority: "0.4", freq: "monthly" },
    { loc: base + "/privacy", priority: "0.3", freq: "yearly" },
  ];
  var xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  pages.forEach(function(p) {
    xml += "<url><loc>" + p.loc + "</loc><lastmod>" + today + "</lastmod>";
    xml += "<changefreq>" + p.freq + "</changefreq><priority>" + p.priority + "</priority></url>";
  });
  xml += "</urlset>";
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(xml);
};
