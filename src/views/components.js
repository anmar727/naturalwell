import React from "react";
import { SITE, AUTHOR, CATEGORIES, categoryBySlug } from "../../shared/site.js";
import { LEVELS, formatDate } from "../../shared/articles.js";

export var h = React.createElement;

// Internal link that navigates without a page reload.
export function Link(props) {
  var nav = React.useContext(NavContext);
  var rest = Object.assign({}, props);
  delete rest.to;
  rest.href = props.to;
  rest.onClick = function (e) {
    if (props.onClick) props.onClick(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    nav.navigate(props.to);
  };
  return h("a", rest);
}

export var NavContext = React.createContext({ path: "/", navigate: function () {} });

export function Header(props) {
  var open = React.useState(false);
  var nav = React.useContext(NavContext);
  var items = [["/", "Home"], ["/topics", "Topics"], ["/about", "About"], ["/editorial-policy", "How we check"], ["/search", "Search"]];
  function current(to) {
    if (to === "/") return nav.path === "/";
    if (to.indexOf("/topics") === 0) return nav.path.indexOf("/topics") === 0;
    return nav.path === to;
  }
  return h("header", { className: "site-header" },
    h("a", { className: "skip", href: "#main" }, "Skip to content"),
    h("div", { className: "wrap" },
      h(Link, { to: "/", className: "brand", "aria-label": SITE.name + " home" },
        h("span", { className: "brand-mark" }, "Natural", h("span", null, "Well")),
        h("span", { className: "brand-tag" }, SITE.tagline)
      ),
      h("button", { className: "nav-toggle", "aria-expanded": open[0], "aria-controls": "site-nav", onClick: function () { open[1](!open[0]); } }, open[0] ? "Close" : "Menu"),
      h("nav", { id: "site-nav", className: "nav" + (open[0] ? " open" : ""), "aria-label": "Main" },
        items.map(function (it) {
          return h(Link, { key: it[0], to: it[0], "aria-current": current(it[0]) ? "page" : undefined, onClick: function () { open[1](false); } }, it[1]);
        })
      )
    ),
    props.progress ? h("div", { className: "progress", id: "read-progress", "aria-hidden": "true" }) : null
  );
}

export function Footer() {
  return h("footer", { className: "site-footer" },
    h("div", { className: "wrap" },
      h("div", { className: "footer-grid" },
        h("div", null,
          h("p", { className: "brand-mark", style: { color: "#fff", marginBottom: 10 } }, "NaturalWell"),
          h("p", null, "Home remedies explained honestly: what the research shows, how to use them safely, and when to see a doctor instead."),
          h("p", { style: { marginTop: 12 } }, "Contact: ", h("a", { href: "mailto:" + SITE.email }, SITE.email))
        ),
        h("div", null,
          h("h2", null, "Topics"),
          h("ul", null, CATEGORIES.map(function (c) {
            return h("li", { key: c.slug }, h(Link, { to: "/topics/" + c.slug }, c.name));
          }))
        ),
        h("div", null,
          h("h2", null, "About this site"),
          h("ul", null,
            h("li", null, h(Link, { to: "/about" }, "About NaturalWell")),
            h("li", null, h(Link, { to: "/editorial-policy" }, "Editorial policy")),
            h("li", null, h(Link, { to: "/medical-disclaimer" }, "Medical disclaimer")),
            h("li", null, h(Link, { to: "/privacy" }, "Privacy policy")),
            h("li", null, h(Link, { to: "/contact" }, "Contact"))
          )
        )
      ),
      h("div", { className: "footer-note" },
        h("span", null, "© " + new Date().getFullYear() + " NaturalWell"),
        h("span", null, "General information only, not medical advice.")
      )
    )
  );
}

export function Tile(props) {
  var a = props.article;
  if (a.image) return h("img", { className: "tile", src: a.image, alt: "", loading: props.eager ? "eager" : "lazy", width: 1200, height: 675 });
  var c = categoryBySlug(a.category);
  return h("div", { className: "tile-fallback", "aria-hidden": "true" }, c ? c.emoji : "🌿");
}

export function LevelPill(props) {
  if (!props.level || !LEVELS[props.level]) return null;
  return h("span", { className: "level-pill", "data-level": props.level, title: "Strength of evidence: " + LEVELS[props.level].label },
    h("i", null, h("b"), h("b"), h("b"), h("b")),
    "Evidence: " + LEVELS[props.level].label.toLowerCase()
  );
}

export function EvidenceCheck(props) {
  var a = props.article;
  if (!a.evidenceLevel) return null;
  var keys = ["weak", "limited", "moderate", "strong"];
  return h("section", { className: "evidence" + (props.compact ? " compact" : ""), "aria-label": "Evidence check" },
    h("div", { className: "evidence-head" },
      h("p", { className: "evidence-title" }, "Evidence check"),
      props.showRemedy ? h("p", { className: "evidence-remedy" }, props.remedy || "") : null
    ),
    h("div", { className: "scale", "data-level": a.evidenceLevel, role: "img", "aria-label": "Strength of evidence: " + LEVELS[a.evidenceLevel].label + " (" + (keys.indexOf(a.evidenceLevel) + 1) + " of 4)" },
      h("span"), h("span"), h("span"), h("span")
    ),
    h("div", { className: "scale-labels", "aria-hidden": "true" },
      keys.map(function (k) { return k === a.evidenceLevel ? h("b", { key: k }, LEVELS[k].label) : h("span", { key: k }, LEVELS[k].label); })
    ),
    a.evidenceSummary ? h("p", { className: "evidence-summary" }, a.evidenceSummary) : null,
    props.link ? h(Link, { to: "/article/" + a.slug, className: "evidence-link" }, props.link) : null
  );
}

export function Meta(props) {
  var a = props.article;
  var c = categoryBySlug(a.category);
  return h("div", { className: "meta" },
    // Plain text: Meta sits inside article card links, and links can't be nested.
    props.showTopic && c ? h("span", { className: "topic-link" }, c.name) : null,
    h("span", null, a.readTime + " read"),
    h(LevelPill, { level: a.evidenceLevel })
  );
}

export function StoryList(props) {
  if (!props.articles.length) return h("p", { className: "empty" }, props.empty || "No articles yet.");
  return h("ul", { className: "story-list" }, props.articles.map(function (a) {
    return h("li", { key: a.slug },
      h(Link, { to: "/article/" + a.slug, className: "story" },
        h("div", { className: "thumb" }, h(Tile, { article: a })),
        h("div", null,
          h("h3", null, a.title),
          h("p", null, a.excerpt),
          h(Meta, { article: a, showTopic: props.showTopic })
        )
      )
    );
  }));
}

export function AuthorBox() {
  return h("aside", { className: "author-box", "aria-label": "About the author" },
    h("div", { className: "avatar", "aria-hidden": "true" }, AUTHOR.initials),
    h("div", null,
      h("h3", null, "Edited by " + AUTHOR.name),
      h("p", { className: "role" }, AUTHOR.role),
      h("p", { className: "bio" }, AUTHOR.bio, " ", h(Link, { to: "/editorial-policy" }, "How articles are written and checked."))
    )
  );
}

export function Byline(props) {
  var a = props.article;
  var dateText = a.updated && a.updated !== a.date ? "Updated " + formatDate(a.updated) : "Published " + formatDate(a.date);
  return h("div", { className: "byline" },
    h("div", { className: "avatar", "aria-hidden": "true" }, AUTHOR.initials),
    h("div", null,
      h("span", null, "Edited by ", h(Link, { to: "/about" }, AUTHOR.name)),
      h("small", null, dateText + ", " + a.readTime + " read")
    )
  );
}

export function Newsletter(props) {
  var st = React.useState({ email: "", status: "idle", msg: "" });
  var s = st[0], set = st[1];
  function submit(e) {
    e.preventDefault();
    set(Object.assign({}, s, { status: "sending", msg: "" }));
    fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: s.email, source: props.source || "" }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (r) {
        if (r.ok) set({ email: "", status: "done", msg: "You're subscribed. The next weekly email will arrive in your inbox." });
        else set(Object.assign({}, s, { status: "error", msg: r.d.error || "That didn't work. Check the address and try again." }));
      })
      .catch(function () { set(Object.assign({}, s, { status: "error", msg: "No connection. Try again in a moment." })); });
  }
  return h("section", { className: "newsletter" + (props.slim ? " slim" : ""), "aria-labelledby": "nl-title-" + (props.source || "x") },
    h("div", null,
      h("h2", { id: "nl-title-" + (props.source || "x") }, "One evidence-checked remedy a week"),
      h("p", null, "A short weekly email: one remedy, what the research says, and how to use it safely. Unsubscribe any time.")
    ),
    h("div", null,
      s.status === "done"
        ? h("p", { className: "msg", role: "status" }, s.msg)
        : h("form", { onSubmit: submit },
            h("label", { className: "visually-hidden", htmlFor: "nl-email-" + (props.source || "x") }, "Email address"),
            h("input", { id: "nl-email-" + (props.source || "x"), type: "email", required: true, placeholder: "you@example.com", value: s.email, onChange: function (e) { set(Object.assign({}, s, { email: e.target.value })); } }),
            h("button", { type: "submit", disabled: s.status === "sending" }, s.status === "sending" ? "Subscribing…" : "Subscribe")
          ),
      s.status === "error" ? h("p", { className: "msg", role: "alert" }, s.msg) : null
    )
  );
}
