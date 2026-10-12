// Serves every page with its real content already in the HTML, so Google and
// AdSense reviewers can read articles without running JavaScript. The React
// app then loads on top and takes over as before.

var SUPABASE_URL = process.env.SUPABASE_URL;
var SUPABASE_KEY = process.env.SUPABASE_KEY;
var BASE = "https://www.naturalwellblog.com";

var AUTHOR = {
  name: "Anmar Arab",
  role: "Dentist · Postgraduate training in orthodontics",
  bio: "Anmar is a dental professional based in Muscat, Oman, with postgraduate training in orthodontics. He writes NaturalWell to share clear, practical information about everyday home remedies, what the research says about them, and when it is time to see a doctor instead.",
};

// The page shell (same as index.html, pointing at the built app bundle).
var VERSION = process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_DEPLOYMENT_ID || "1";
var SHELL = '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
  '<meta charset="UTF-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
  '<meta name="robots" content="index, follow" />\n<meta name="twitter:card" content="summary_large_image" />\n' +
  '<link rel="icon" href="data:image/svg+xml,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27><text y=%27.9em%27 font-size=%2790%27>🌿</text></svg>" />\n' +
  '<link rel="preconnect" href="https://fonts.googleapis.com" />\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n' +
  '<script type="module" crossorigin src="/assets/app.js?v=' + VERSION + '"></script>\n' +
  '</head>\n<body>\n<div id="root"></div>\n</body>\n</html>\n';

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function inline(s) {
  return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
}

function mdToHtml(md) {
  var out = [];
  var list = null;
  function closeList() { if (list) { out.push("</" + list + ">"); list = null; } }
  (md || "").split("\n").forEach(function(line) {
    var t = line.trim();
    if (!t) { closeList(); return; }
    if (t.startsWith("### ")) { closeList(); out.push("<h3>" + inline(t.slice(4)) + "</h3>"); return; }
    if (t.startsWith("## ")) { closeList(); out.push("<h2>" + inline(t.slice(3)) + "</h2>"); return; }
    if (/^\d+\. /.test(t)) {
      if (list !== "ol") { closeList(); out.push("<ol>"); list = "ol"; }
      out.push("<li>" + inline(t.replace(/^\d+\. /, "")) + "</li>"); return;
    }
    if (t.startsWith("- ")) {
      if (list !== "ul") { closeList(); out.push("<ul>"); list = "ul"; }
      out.push("<li>" + inline(t.slice(2)) + "</li>"); return;
    }
    closeList();
    out.push("<p>" + inline(t) + "</p>");
  });
  closeList();
  return out.join("\n");
}

async function getArticles() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  var r = await fetch(SUPABASE_URL + "/rest/v1/articles?select=id,slug,title,excerpt,content,tags,date,read_time,custom_image&order=created_at.desc", {
    headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
  });
  var data = await r.json();
  return Array.isArray(data) ? data : [];
}

function imageFor(a) {
  var img = a.custom_image || "";
  if (img.startsWith("data:")) return null; // never inline huge base64 images
  if (img.startsWith("/")) return BASE + img;
  return img || null;
}

function authorHtml() {
  return '<aside class="ssr-author"><p class="ssr-k">Written by</p><p><strong>' + esc(AUTHOR.name) + "</strong></p><p>" + esc(AUTHOR.role) + "</p><p>" + esc(AUTHOR.bio) + "</p></aside>";
}

var STYLE = "<style>.ssr{max-width:760px;margin:0 auto;padding:32px 20px;font-family:Georgia,serif;color:#222;line-height:1.8}.ssr h1{font-size:30px;line-height:1.3}.ssr h2{margin-top:28px}.ssr a{color:#2d6a4f}.ssr-author{border:1px solid #ece9e0;border-radius:12px;padding:16px;margin-top:28px}.ssr-k{font-size:12px;text-transform:uppercase;color:#888}.ssr li{margin-bottom:6px}</style>";

function page(shell, opts) {
  var head = "<title>" + esc(opts.title) + "</title>" +
    '\n<meta name="description" content="' + esc(opts.description) + '" />' +
    '\n<link rel="canonical" href="' + esc(opts.url) + '" />' +
    '\n<meta property="og:title" content="' + esc(opts.title) + '" />' +
    '\n<meta property="og:description" content="' + esc(opts.description) + '" />' +
    '\n<meta property="og:url" content="' + esc(opts.url) + '" />' +
    '\n<meta property="og:type" content="' + (opts.type || "website") + '" />' +
    (opts.image ? '\n<meta property="og:image" content="' + esc(opts.image) + '" />\n<meta name="twitter:image" content="' + esc(opts.image) + '" />' : "") +
    (opts.jsonLd ? '\n<script type="application/ld+json">' + JSON.stringify(opts.jsonLd).replace(/</g, "\\u003c") + "</script>" : "") +
    "\n" + STYLE;

  var html = shell
    // drop the shell's generic tags that we replace per page
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/i, "")
    .replace(/<meta\s+property="og:(title|description|url|type|image)"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:image"[^>]*>/i, "")
    .replace("</head>", head + "\n</head>")
    .replace('<div id="root"></div>', '<div id="root"><main class="ssr">' + opts.body + "</main></div>");
  return html;
}

function homeBody(articles) {
  var items = articles.map(function(a) {
    return '<li><h2><a href="/article/' + esc(a.slug) + '">' + esc(a.title) + "</a></h2><p>" + esc(a.excerpt) + "</p><p><small>" + esc(a.date) + " · " + esc(a.read_time || "5 min") + " read</small></p></li>";
  }).join("\n");
  return "<h1>Home Remedies That Actually Work</h1><p>Science-backed natural health tips to help you feel better every day, written by " + esc(AUTHOR.name) + ".</p><ul>" + items + "</ul>" +
    '<nav><a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/privacy">Privacy Policy</a></nav>';
}

function articleBody(a, articles) {
  var tags = (a.tags || "").split(",").map(function(t) { return t.trim(); }).filter(Boolean);
  var related = articles.filter(function(x) { return x.slug !== a.slug; }).slice(0, 3);
  return '<nav><a href="/">Blog</a> › ' + esc(tags[0] || "Article") + "</nav>" +
    "<h1>" + esc(a.title) + "</h1>" +
    "<p><small>By " + esc(AUTHOR.name) + " · " + esc(a.date) + " · " + esc(a.read_time || "5 min") + " read</small></p>" +
    "<article>" + mdToHtml(a.content) + "</article>" +
    authorHtml() +
    (related.length ? "<h2>Related articles</h2><ul>" + related.map(function(r) { return '<li><a href="/article/' + esc(r.slug) + '">' + esc(r.title) + "</a></li>"; }).join("") + "</ul>" : "");
}

var STATIC = {
  "/about": { title: "About NaturalWell", description: "Who writes NaturalWell and how we approach natural health information.", body: "<h1>About NaturalWell</h1><p>NaturalWell shares practical, research-informed information about everyday home remedies, including their limits and when to see a doctor.</p>" + authorHtml() },
  "/contact": { title: "Contact NaturalWell", description: "Get in touch with NaturalWell.", body: "<h1>Contact Us</h1><p>Email: <a href=\"mailto:anmar727@gmail.com\">anmar727@gmail.com</a></p>" },
  "/privacy": { title: "Privacy Policy — NaturalWell", description: "NaturalWell privacy policy.", body: "<h1>Privacy Policy</h1><p>We collect information you send us by email and automated data via Google Analytics and advertising partners. We never sell your data. All content is informational only; always consult a healthcare professional.</p>" },
};

module.exports = async function handler(req, res) {
  var path = (req.query && req.query.path ? "/" + req.query.path : "/").replace(/\/+$/, "") || "/";

  var shell = SHELL;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");

  try {
    if (path === "/") {
      var all = await getArticles();
      return res.status(200).send(page(shell, {
        title: "NaturalWell — Home Remedies & Natural Health",
        description: "Science-backed home remedies and natural health tips to help you live better every day.",
        url: BASE + "/",
        body: homeBody(all),
      }));
    }

    if (path.startsWith("/article/")) {
      var slug = decodeURIComponent(path.slice("/article/".length));
      var list = await getArticles();
      var a = list.find(function(x) { return x.slug === slug; });
      if (!a) return res.status(404).send(page(shell, { title: "Article not found — NaturalWell", description: "This article could not be found.", url: BASE + path, body: '<h1>Article not found</h1><p><a href="/">Back to all articles</a></p>' }));
      var url = BASE + "/article/" + a.slug;
      var image = imageFor(a);
      return res.status(200).send(page(shell, {
        title: a.title + " — NaturalWell",
        description: a.excerpt,
        url: url,
        type: "article",
        image: image,
        body: articleBody(a, list),
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.excerpt,
          datePublished: a.date,
          image: image || undefined,
          mainEntityOfPage: url,
          author: { "@type": "Person", name: AUTHOR.name, description: AUTHOR.role },
          publisher: { "@type": "Organization", name: "NaturalWell", url: BASE },
        },
      }));
    }

    if (STATIC[path]) {
      var p = STATIC[path];
      return res.status(200).send(page(shell, { title: p.title, description: p.description, url: BASE + path, body: p.body }));
    }
  } catch (e) {
    // Database trouble: fall back to the plain app shell so the site still works.
    return res.status(200).send(shell);
  }

  // Admin and any other app screens: plain shell, not indexed.
  return res.status(200).send(shell.replace("</head>", '<meta name="robots" content="noindex" />\n</head>'));
};
