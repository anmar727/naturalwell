import { listArticles } from "./_lib/db.js";
import { CATEGORIES, PAGES, SITE } from "../shared/site.js";

export default async function handler(req, res) {
  const base = SITE.url;
  const today = new Date().toISOString().slice(0, 10);
  const urls = [{ loc: base + "/", lastmod: today, freq: "daily", priority: "1.0" }];
  CATEGORIES.forEach(function (c) { urls.push({ loc: base + "/topics/" + c.slug, lastmod: today, freq: "weekly", priority: "0.8" }); });
  Object.keys(PAGES).forEach(function (k) { urls.push({ loc: base + PAGES[k].path, lastmod: today, freq: "monthly", priority: "0.4" }); });
  urls.push({ loc: base + "/contact", lastmod: today, freq: "yearly", priority: "0.3" });
  try {
    const articles = await listArticles();
    articles.forEach(function (a) {
      urls.push({ loc: base + "/article/" + a.slug, lastmod: String(a.updated_at || a.date || today).slice(0, 10), freq: "monthly", priority: "0.9" });
    });
  } catch (e) {}

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  urls.forEach(function (u) {
    xml += "<url><loc>" + u.loc + "</loc><lastmod>" + u.lastmod + "</lastmod><changefreq>" + u.freq + "</changefreq><priority>" + u.priority + "</priority></url>\n";
  });
  xml += "</urlset>\n";
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600");
  res.status(200).send(xml);
}
