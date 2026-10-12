// Renders every public page on the server with the same React views the
// browser uses, so search engines and AdSense reviewers see full content
// without running JavaScript. The browser then "hydrates" the page.
import React from "react";
import ReactDOMServer from "react-dom/server";
import { App, route, titleFor } from "../src/views/App.js";
import { SITE, AUTHOR, PAGES, categoryBySlug } from "../shared/site.js";
import { normalizeArticle, toMeta } from "../shared/articles.js";
import { escapeHtml } from "../shared/markdown.js";
import { listArticles } from "./_lib/db.js";

var VERSION = process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_DEPLOYMENT_ID || "1";
var FONTS = "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&family=Public+Sans:wght@400;600;700&display=swap";

function description(r, data) {
  if (r.name === "article" && data.article) return data.article.excerpt;
  if (r.name === "topic") { var c = categoryBySlug(r.slug); if (c) return c.intro.slice(0, 155).replace(/\s+\S*$/, "") + "…"; }
  if (r.name === "page") return PAGES[r.page].description;
  if (r.name === "topics") return "Browse NaturalWell's evidence-checked home remedy guides by topic: sleep, digestion, colds, heart health and everyday wellness.";
  if (r.name === "contact") return "Contact NaturalWell with questions, corrections or topic suggestions.";
  return "Evidence-checked guides to home remedies: what the research shows, how to use them safely, and when to see a doctor instead.";
}

function canonicalPath(r, url) {
  if (r.name === "home") return "/";
  if (r.name === "search") return "/search";
  return url.split("?")[0].replace(/\/+$/, "") || "/";
}

function jsonLd(r, data, canonical) {
  var items = [];
  if (r.name === "home") {
    items.push({ "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url + "/", potentialAction: { "@type": "SearchAction", target: SITE.url + "/search?q={search_term_string}", "query-input": "required name=search_term_string" } });
  }
  if (r.name === "article" && data.article) {
    var a = data.article;
    var c = categoryBySlug(a.category);
    items.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.excerpt,
      datePublished: a.date,
      dateModified: a.updated || a.date,
      image: a.image && a.image.indexOf("/") === 0 ? SITE.url + a.image : undefined,
      mainEntityOfPage: canonical,
      author: { "@type": "Person", name: AUTHOR.name, url: SITE.url + "/about", jobTitle: "Dentist" },
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    });
    items.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
        c ? { "@type": "ListItem", position: 2, name: c.name, item: SITE.url + "/topics/" + c.slug } : null,
        { "@type": "ListItem", position: c ? 3 : 2, name: a.title, item: canonical },
      ].filter(Boolean),
    });
  }
  return items.map(function (x) { return '<script type="application/ld+json">' + JSON.stringify(x).replace(/</g, "\\u003c") + "</script>"; }).join("\n");
}

function documentHtml(opts) {
  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
    '<meta charset="UTF-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
    "<title>" + escapeHtml(opts.title) + "</title>\n" +
    '<meta name="description" content="' + escapeHtml(opts.description) + '" />\n' +
    (opts.noindex ? '<meta name="robots" content="noindex" />\n' : '<meta name="robots" content="index, follow, max-image-preview:large" />\n') +
    '<link rel="canonical" href="' + escapeHtml(opts.canonical) + '" />\n' +
    '<meta property="og:site_name" content="' + SITE.name + '" />\n' +
    '<meta property="og:title" content="' + escapeHtml(opts.title) + '" />\n' +
    '<meta property="og:description" content="' + escapeHtml(opts.description) + '" />\n' +
    '<meta property="og:url" content="' + escapeHtml(opts.canonical) + '" />\n' +
    '<meta property="og:type" content="' + (opts.isArticle ? "article" : "website") + '" />\n' +
    (opts.image ? '<meta property="og:image" content="' + escapeHtml(opts.image) + '" />\n' : "") +
    '<meta name="twitter:card" content="' + (opts.image ? "summary_large_image" : "summary") + '" />\n' +
    '<meta name="theme-color" content="#214d39" />\n' +
    "<link rel=\"icon\" href=\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>\" />\n" +
    '<link rel="preconnect" href="https://fonts.googleapis.com" />\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n' +
    '<link rel="stylesheet" href="' + FONTS + '" />\n' +
    '<link rel="stylesheet" href="/assets/index.css?v=' + VERSION + '" />\n' +
    (opts.jsonLd || "") + "\n" +
    '<script type="module" crossorigin src="/assets/app.js?v=' + VERSION + '"></script>\n' +
    "</head>\n<body>\n" +
    '<div id="root">' + (opts.body || "") + "</div>\n" +
    (opts.data ? '<script id="nw-data" type="application/json">' + JSON.stringify(opts.data).replace(/</g, "\\u003c") + "</script>\n" : "") +
    "</body>\n</html>\n";
}

export default async function handler(req, res) {
  var q = req.query || {};
  var path = "/" + String(q.path || "").replace(/^\/+/, "");
  var search = "";
  Object.keys(q).forEach(function (k) {
    if (k === "path") return;
    search += (search ? "&" : "?") + encodeURIComponent(k) + "=" + encodeURIComponent(q[k]);
  });
  var url = (path.length > 1 ? path.replace(/\/+$/, "") : path) + search;
  var r = route(url);

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  if (r.name === "admin") {
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(documentHtml({ title: "Admin | NaturalWell", description: "", canonical: SITE.url + "/admin", noindex: true }));
  }

  var all = [];
  try { all = (await listArticles()).map(normalizeArticle); } catch (e) { all = []; }
  var data = { articles: all.map(toMeta), article: null };
  var status = 200;

  if (r.name === "article") {
    data.article = all.find(function (a) { return a.slug === r.slug; }) || null;
    if (!data.article) { status = 404; data.article = { missing: r.slug }; }
  }
  if (r.name === "topic" && !categoryBySlug(r.slug)) status = 404;
  if (r.name === "notfound") status = 404;

  var body = "";
  try {
    body = ReactDOMServer.renderToString(React.createElement(App, { url: url, data: data }));
  } catch (e) {
    console.error("render failed", e);
    body = "";
  }
  var canonical = SITE.url + canonicalPath(r, url);
  var art = r.name === "article" && data.article && !data.article.missing ? data.article : null;
  var html = documentHtml({
    title: titleFor(r, { article: art }),
    description: description(r, { article: art }),
    canonical: canonical,
    noindex: status !== 200 || r.name === "search",
    isArticle: !!art,
    image: art && art.image && art.image.indexOf("/") === 0 ? SITE.url + art.image : null,
    jsonLd: jsonLd(r, { article: art }, canonical),
    body: body,
    data: body ? data : null,
  });

  res.setHeader("Cache-Control", status === 200 ? "public, s-maxage=300, stale-while-revalidate=86400" : "public, s-maxage=60");
  return res.status(status).send(html);
}
