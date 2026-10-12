// Small, safe markdown renderer shared by the app and the server renderer.
// Supports: ## / ### headings, paragraphs, - and 1. lists, > callouts,
// **bold**, *italic*, [links](https://...) and bare https:// links.

export function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function slugify(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function safeHref(url) {
  return /^(https?:\/\/|\/|mailto:)/i.test(url) ? url : "#";
}

export function inlineMd(text) {
  var out = escapeHtml(text);
  // [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, label, url) {
    var href = safeHref(url.replace(/&amp;/g, "&"));
    var external = /^https?:\/\//i.test(href);
    return '<a href="' + escapeHtml(href) + '"' + (external ? ' target="_blank" rel="noopener nofollow"' : "") + ">" + label + "</a>";
  });
  // bare links not already inside an href
  out = out.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;:])/g, function (_, pre, url) {
    return pre + '<a href="' + url + '" target="_blank" rel="noopener nofollow">' + url + "</a>";
  });
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>");
  return out;
}

// Returns { html, toc: [{ id, text }] }
export function renderMarkdown(md) {
  var html = [];
  var toc = [];
  var list = null;
  var used = {};
  function closeList() { if (list) { html.push("</" + list + ">"); list = null; } }
  function uniqueId(text) {
    var id = slugify(text) || "section";
    if (used[id]) { used[id] += 1; id = id + "-" + used[id]; } else used[id] = 1;
    return id;
  }

  String(md || "").split("\n").forEach(function (raw) {
    var t = raw.trim();
    if (!t) { closeList(); return; }
    if (t.indexOf("### ") === 0) {
      closeList();
      html.push("<h3>" + inlineMd(t.slice(4)) + "</h3>");
      return;
    }
    if (t.indexOf("## ") === 0) {
      closeList();
      var text = t.slice(3).replace(/\*\*/g, "");
      var id = uniqueId(text);
      toc.push({ id: id, text: text });
      html.push('<h2 id="' + id + '">' + inlineMd(t.slice(3)) + "</h2>");
      return;
    }
    if (t.indexOf("> ") === 0) {
      closeList();
      html.push('<div class="callout">' + inlineMd(t.slice(2)) + "</div>");
      return;
    }
    if (/^\d+\.\s/.test(t)) {
      if (list !== "ol") { closeList(); html.push("<ol>"); list = "ol"; }
      html.push("<li>" + inlineMd(t.replace(/^\d+\.\s/, "")) + "</li>");
      return;
    }
    if (/^[-*]\s/.test(t)) {
      if (list !== "ul") { closeList(); html.push("<ul>"); list = "ul"; }
      html.push("<li>" + inlineMd(t.slice(2)) + "</li>");
      return;
    }
    closeList();
    html.push("<p>" + inlineMd(t) + "</p>");
  });
  closeList();
  return { html: html.join("\n"), toc: toc };
}

export function wordCount(md) {
  return String(md || "").replace(/[#>*\-\[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
}

export function readTime(md) {
  return Math.max(1, Math.round(wordCount(md) / 220)) + " min";
}
