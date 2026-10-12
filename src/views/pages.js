import React from "react";
import { SITE, CATEGORIES, PAGES, categoryBySlug } from "../../shared/site.js";
import { renderMarkdown } from "../../shared/markdown.js";
import { formatDate, LEVELS } from "../../shared/articles.js";
import { h, Link, NavContext, StoryList, Tile, Meta, EvidenceCheck, AuthorBox, Byline, Newsletter, LevelPill } from "./components.js";

function Prose(props) {
  return h("div", { className: "prose", dangerouslySetInnerHTML: { __html: renderMarkdown(props.md).html } });
}

// ---------------------------------------------------------------- Home
export function Home(props) {
  var articles = props.articles;
  var nav = React.useContext(NavContext);
  var q = React.useState("");
  // The hero shows a real evidence verdict from the article with the strongest evidence.
  var order = { strong: 4, moderate: 3, limited: 2, weak: 1 };
  var showcase = articles.filter(function (a) { return a.evidenceLevel; }).sort(function (a, b) { return (order[b.evidenceLevel] || 0) - (order[a.evidenceLevel] || 0); })[0];
  var lead = articles.filter(function (a) { return a.image; })[0] || articles[0];
  var rest = articles.filter(function (a) { return a !== lead; }).slice(0, 8);
  function counts(slug) { return articles.filter(function (a) { return a.category === slug; }).length; }

  return h(React.Fragment, null,
    h("section", { className: "hero" },
      h("div", { className: "wrap" },
        h("div", null,
          h("h1", null, "Home remedies, checked against the evidence"),
          h("p", { className: "hero-lede" }, "Before you try honey for a cough or magnesium for sleep, see what the research actually shows, how to use it safely, and when a remedy isn't enough."),
          h("form", { className: "hero-search", role: "search", onSubmit: function (e) { e.preventDefault(); nav.navigate("/search?q=" + encodeURIComponent(q[0])); } },
            h("label", { htmlFor: "hero-q", className: "visually-hidden" }, "Search remedies"),
            h("input", { id: "hero-q", type: "search", placeholder: "Search a remedy or symptom", value: q[0], onChange: function (e) { q[1](e.target.value); } }),
            h("button", { type: "submit" }, "Search")
          ),
          h("p", { className: "hero-note" }, articles.length + " remedies reviewed so far, each with an evidence rating.")
        ),
        showcase ? h(EvidenceCheck, { article: showcase, showRemedy: true, remedy: showcase.title.split(":")[0], link: "Read the full review" }) : null
      )
    ),
    h("section", { className: "section" },
      h("div", { className: "wrap" },
        h("div", { className: "section-head" }, h("h2", null, "Browse by topic"), h(Link, { to: "/topics" }, "All topics")),
        h("ul", { className: "topics" }, CATEGORIES.map(function (c) {
          return h("li", { key: c.slug },
            h(Link, { to: "/topics/" + c.slug },
              h("span", { className: "topic-emoji", "aria-hidden": "true" }, c.emoji),
              h("span", null, h("span", { className: "topic-name" }, c.name), h("p", { className: "topic-short" }, c.short)),
              h("span", { className: "topic-count" }, counts(c.slug) + (counts(c.slug) === 1 ? " article" : " articles"))
            )
          );
        }))
      )
    ),
    h("section", { className: "section" },
      h("div", { className: "wrap" },
        h("div", { className: "section-head" }, h("h2", null, "Latest reviews")),
        lead ? h(Link, { to: "/article/" + lead.slug, className: "lead-story" },
          h("div", { className: "thumb" }, h(Tile, { article: lead, eager: true })),
          h("div", null,
            h("h3", null, lead.title),
            h("p", { className: "dek" }, lead.excerpt),
            h(Meta, { article: lead, showTopic: true })
          )
        ) : null,
        h(StoryList, { articles: rest, showTopic: true, empty: props.loading ? "Loading articles…" : "No articles yet." })
      )
    ),
    h("section", { className: "section" },
      h("div", { className: "wrap" },
        h("div", { className: "section-head" }, h("h2", null, "How every article is checked")),
        h("div", { className: "trust" },
          h("div", null, h("h3", null, "Health-authority sources"), h("p", null, "We start from NIH, NHS and WHO guidance and systematic reviews, and list our references at the end of each article.")),
          h("div", null, h("h3", null, "An honest evidence rating"), h("p", null, "Every remedy is rated from weak to strong, so you can see at a glance whether it's well supported or mostly hype.")),
          h("div", null, h("h3", null, "Safety first"), h("p", null, "Side effects, medicine interactions and clear signs that you should see a doctor are in every article. ", h(Link, { to: "/editorial-policy" }, "Read our editorial policy.")))
        )
      )
    ),
    h("section", { className: "section" }, h("div", { className: "wrap" }, h(Newsletter, { source: "home" })))
  );
}

// ---------------------------------------------------------------- Topics
export function TopicsIndex(props) {
  return h("div", { className: "wrap page" },
    h("h1", null, "Topics"),
    h("p", { className: "dek", style: { marginBottom: 28 } }, "Every remedy we review belongs to one of these topics."),
    h("ul", { className: "topics" }, CATEGORIES.map(function (c) {
      var n = props.articles.filter(function (a) { return a.category === c.slug; }).length;
      return h("li", { key: c.slug },
        h(Link, { to: "/topics/" + c.slug },
          h("span", { className: "topic-emoji", "aria-hidden": "true" }, c.emoji),
          h("span", null, h("span", { className: "topic-name" }, c.name), h("p", { className: "topic-short" }, c.short)),
          h("span", { className: "topic-count" }, n + (n === 1 ? " article" : " articles"))
        )
      );
    }))
  );
}

export function Topic(props) {
  var c = categoryBySlug(props.slug);
  if (!c) return h(NotFound);
  var list = props.articles.filter(function (a) { return a.category === c.slug; });
  return h(React.Fragment, null,
    h("section", { className: "topic-hero" },
      h("div", { className: "wrap" },
        h("p", { className: "crumbs" }, h(Link, { to: "/topics" }, "Topics")),
        h("h1", null, h("span", { "aria-hidden": "true" }, c.emoji), c.name),
        h("p", { className: "dek" }, c.intro)
      )
    ),
    h("section", { className: "section" },
      h("div", { className: "wrap" },
        h(StoryList, { articles: list, empty: props.loading ? "Loading articles…" : "No articles in this topic yet." })
      )
    ),
    h("section", { className: "section" }, h("div", { className: "wrap" }, h(Newsletter, { source: "topic-" + c.slug })))
  );
}

// ---------------------------------------------------------------- Article
export function Article(props) {
  if (!props.article) return props.loading ? h("div", { className: "wrap page" }, h("p", { className: "empty" }, "Loading article…")) : h(NotFound);
  return h(ArticleBody, { key: props.article.slug, article: props.article, articles: props.articles });
}

function ArticleBody(props) {
  var a = props.article;
  var c = categoryBySlug(a.category);
  var md = renderMarkdown(a.content || "");
  var url = SITE.url + "/article/" + a.slug;
  var related = props.articles.filter(function (x) { return x.slug !== a.slug && x.category === a.category; })
    .concat(props.articles.filter(function (x) { return x.slug !== a.slug && x.category !== a.category; }))
    .slice(0, 4);
  var copied = React.useState(false);

  // Highlight the section being read and drive the progress bar.
  React.useEffect(function () {
    var bar = document.getElementById("read-progress");
    var links = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
    function onScroll() {
      var body = document.getElementById("article-body");
      if (!body) return;
      var rect = body.getBoundingClientRect();
      var total = rect.height - window.innerHeight * 0.6;
      var done = Math.min(1, Math.max(0, -rect.top / (total || 1)));
      if (bar) bar.style.transform = "scaleX(" + done + ")";
      var current = null;
      md.toc.forEach(function (t) {
        var el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < 140) current = t.id;
      });
      links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + current); });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return function () { window.removeEventListener("scroll", onScroll); };
  }, [a.slug]);

  var tocItems = md.toc.filter(function (t) { return !/^references$/i.test(t.text); });

  return h("article", null,
    h("header", { className: "article-top" },
      h("div", { className: "wrap" },
        h("p", { className: "crumbs" }, h(Link, { to: "/" }, "Home"), " / ", c ? h(Link, { to: "/topics/" + c.slug }, c.name) : "Articles"),
        h("h1", null, a.title),
        a.excerpt ? h("p", { className: "dek" }, a.excerpt) : null,
        h(Byline, { article: a })
      )
    ),
    h("div", { className: "wrap article-grid" },
      h("nav", { className: "toc", "aria-label": "On this page" },
        h("p", null, "On this page"),
        h("ol", null, tocItems.map(function (t) { return h("li", { key: t.id }, h("a", { href: "#" + t.id }, t.text)); }))
      ),
      h("div", { id: "article-body" },
        h("details", { className: "toc-mobile" },
          h("summary", null, "On this page"),
          h("ol", null, tocItems.map(function (t) { return h("li", { key: t.id }, h("a", { href: "#" + t.id }, t.text)); }))
        ),
        a.image ? h("div", { className: "hero-image" }, h(Tile, { article: a, eager: true })) : null,
        h("div", { className: "prose", dangerouslySetInnerHTML: { __html: md.html } }),
        h("div", { className: "share", "aria-label": "Share this article" },
          h("a", { href: "https://wa.me/?text=" + encodeURIComponent(a.title + " " + url), target: "_blank", rel: "noopener" }, "Share on WhatsApp"),
          h("a", { href: "https://pinterest.com/pin/create/button/?url=" + encodeURIComponent(url) + "&description=" + encodeURIComponent(a.title), target: "_blank", rel: "noopener" }, "Save to Pinterest"),
          h("a", { href: "https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(a.title), target: "_blank", rel: "noopener" }, "Share on Telegram"),
          h("button", { type: "button", onClick: function () { navigator.clipboard && navigator.clipboard.writeText(url).then(function () { copied[1](true); setTimeout(function () { copied[1](false); }, 2000); }); } }, copied[0] ? "Link copied" : "Copy link")
        ),
        h(AuthorBox)
      ),
      h("aside", { className: "article-aside" },
        h(EvidenceCheck, { article: a, compact: true }),
        h("p", { className: "disclaimer" }, "This article is general information, not medical advice. Check with a doctor or pharmacist before trying a remedy if you are pregnant, take regular medicines or are treating a child. ", h(Link, { to: "/medical-disclaimer" }, "Medical disclaimer")),
        h(Newsletter, { slim: true, source: "article" })
      )
    ),
    related.length ? h("section", { className: "section" },
      h("div", { className: "wrap" },
        h("div", { className: "section-head" }, h("h2", null, c ? "More on " + c.name.toLowerCase() : "Keep reading")),
        h(StoryList, { articles: related, showTopic: true })
      )
    ) : null
  );
}

// ---------------------------------------------------------------- Static pages
export function StaticPage(props) {
  var p = PAGES[props.page];
  return h("div", { className: "wrap page" },
    h("h1", null, p.title),
    h(Prose, { md: p.body }),
    props.page === "about" ? h(AuthorBox) : null
  );
}

export function Contact() {
  var st = React.useState({ name: "", email: "", msg: "", opened: false });
  var s = st[0], set = st[1];
  function submit(e) {
    e.preventDefault();
    window.location.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent("NaturalWell: message from " + s.name) + "&body=" + encodeURIComponent(s.msg + "\n\nReply to: " + s.email);
    set(Object.assign({}, s, { opened: true }));
  }
  return h("div", { className: "wrap page" },
    h("h1", null, "Contact"),
    h("p", { className: "dek", style: { marginBottom: 28 } }, "Spotted an error, have a question about an article or want to suggest a remedy for us to review? We usually reply within two working days."),
    h("p", { style: { marginBottom: 24 } }, "Email us directly at ", h("a", { href: "mailto:" + SITE.email }, SITE.email), ", or use the form, which opens a pre-filled email in your email app."),
    s.opened ? h("p", { className: "notice", role: "status" }, "Your email app should now be open with your message. Press send there to reach us.") : null,
    h("form", { className: "form", onSubmit: submit },
      h("label", null, "Your name", h("input", { required: true, value: s.name, onChange: function (e) { set(Object.assign({}, s, { name: e.target.value })); } })),
      h("label", null, "Your email", h("input", { type: "email", required: true, value: s.email, onChange: function (e) { set(Object.assign({}, s, { email: e.target.value })); } })),
      h("label", null, "Message", h("textarea", { required: true, rows: 6, value: s.msg, onChange: function (e) { set(Object.assign({}, s, { msg: e.target.value })); } })),
      h("div", null, h("button", { className: "btn", type: "submit" }, "Write email"))
    ),
    h("p", { style: { marginTop: 28, fontSize: 15, color: "var(--muted)" } }, "We can't give personal medical advice by email. If you're unwell, contact your doctor or pharmacist.")
  );
}

export function Search(props) {
  var nav = React.useContext(NavContext);
  var initial = props.query || "";
  var q = React.useState(initial);
  React.useEffect(function () { q[1](props.query || ""); }, [props.query]);
  var term = q[0].trim().toLowerCase();
  var results = term ? props.articles.filter(function (a) {
    var c = categoryBySlug(a.category);
    return (a.title + " " + a.excerpt + " " + a.tags.join(" ") + " " + (c ? c.name : "")).toLowerCase().indexOf(term) !== -1;
  }) : [];
  return h("div", { className: "wrap page" },
    h("h1", null, "Search"),
    h("form", { className: "hero-search", role: "search", style: { marginTop: 0, marginBottom: 28 }, onSubmit: function (e) { e.preventDefault(); nav.navigate("/search?q=" + encodeURIComponent(q[0]), { replace: true }); } },
      h("label", { htmlFor: "search-q", className: "visually-hidden" }, "Search remedies"),
      h("input", { id: "search-q", type: "search", autoFocus: true, placeholder: "Try sleep, cough, ginger…", value: q[0], onChange: function (e) { q[1](e.target.value); } }),
      h("button", { type: "submit" }, "Search")
    ),
    term
      ? h(React.Fragment, null,
          h("p", { style: { marginBottom: 12, color: "var(--muted)" } }, results.length + (results.length === 1 ? " result" : " results") + " for “" + q[0].trim() + "”"),
          h(StoryList, { articles: results, showTopic: true, empty: "Nothing matches that yet. Try a broader word, or browse the topics below." }),
          results.length ? null : h(TopicsIndex, { articles: props.articles })
        )
      : h(TopicsIndex, { articles: props.articles })
  );
}

export function NotFound() {
  return h("div", { className: "wrap page" },
    h("h1", null, "Page not found"),
    h("p", { className: "dek" }, "This page may have moved. Search for a remedy or go back to the home page."),
    h("p", { style: { marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" } },
      h(Link, { to: "/", className: "btn" }, "Go to home page"),
      h(Link, { to: "/search", className: "btn secondary" }, "Search remedies")
    )
  );
}
