import React from "react";
import { CATEGORIES } from "../../shared/site.js";
import { renderMarkdown, slugify, wordCount } from "../../shared/markdown.js";
import { LEVELS } from "../../shared/articles.js";

var h = React.createElement;
var KEY = "nw_admin_pw";

function getPw() { try { return sessionStorage.getItem(KEY) || ""; } catch (e) { return ""; } }
function setPw(v) { try { if (v) sessionStorage.setItem(KEY, v); else sessionStorage.removeItem(KEY); } catch (e) {} }

function api(method, url, body) {
  return fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json", "x-admin-password": getPw() },
    body: body ? JSON.stringify(body) : undefined,
  }).then(function (r) {
    return r.text().then(function (t) {
      var d = {};
      try { d = t ? JSON.parse(t) : {}; } catch (e) { d = { error: t }; }
      if (!r.ok) { var err = new Error((d && d.error && (d.error.message || d.error)) || "Request failed (" + r.status + ")"); err.status = r.status; throw err; }
      return d;
    });
  });
}

var EMPTY = { id: "", slug: "", title: "", excerpt: "", content: "", tags: "", category: "", evidenceLevel: "", evidenceSummary: "", customImage: null };

function shrinkImage(file, cb) {
  var reader = new FileReader();
  reader.onload = function (ev) {
    var img = new Image();
    img.onload = function () {
      var scale = Math.min(1, 1200 / img.width);
      var canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      cb(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function Login(props) {
  var st = React.useState({ pw: "", error: "", busy: false });
  var s = st[0], set = st[1];
  function submit(e) {
    e.preventDefault();
    set({ pw: s.pw, error: "", busy: true });
    setPw(s.pw);
    api("POST", "/api/auth").then(function () { props.onIn(); }).catch(function (err) {
      setPw("");
      set({ pw: "", error: err.message, busy: false });
    });
  }
  return h("div", { className: "wrap admin", style: { maxWidth: 440 } },
    h("h1", null, "Admin sign in"),
    h("p", { style: { color: "var(--muted)", marginBottom: 20 } }, "Sign in to write, edit and publish articles."),
    s.error ? h("p", { className: "notice error", role: "alert" }, s.error) : null,
    h("form", { className: "form", onSubmit: submit },
      h("label", null, "Admin password", h("input", { type: "password", autoComplete: "current-password", required: true, value: s.pw, onChange: function (e) { set(Object.assign({}, s, { pw: e.target.value })); } })),
      h("div", null, h("button", { className: "btn", disabled: s.busy }, s.busy ? "Signing in…" : "Sign in"))
    )
  );
}

function Editor(props) {
  var st = React.useState(props.initial);
  var a = st[0], set = st[1];
  var busy = React.useState(false);
  var err = React.useState("");
  function field(name) {
    return function (e) { var v = e.target.value; set(function (x) { var y = Object.assign({}, x); y[name] = v; return y; }); };
  }
  var words = wordCount(a.content);
  function save() {
    if (!a.title.trim() || !a.content.trim()) { err[1]("Add a title and some content before publishing."); return; }
    busy[1](true); err[1]("");
    var payload = Object.assign({}, a, {
      slug: a.slug || slugify(a.title),
      tags: String(a.tags || "").split(",").map(function (t) { return t.trim(); }).filter(Boolean),
      evidenceLevel: a.evidenceLevel || null,
    });
    api(a.id ? "PUT" : "POST", "/api/articles", payload).then(function () { props.onSaved(); }).catch(function (e) { err[1](e.message); busy[1](false); });
  }
  return h("div", null,
    h("p", { style: { marginBottom: 12 } }, h("button", { className: "btn secondary", onClick: props.onCancel }, "Back to articles")),
    h("h2", { style: { fontSize: 26, marginBottom: 12 } }, a.id ? "Edit article" : "New article"),
    props.note ? h("p", { className: "notice" }, props.note) : null,
    err[0] ? h("p", { className: "notice error", role: "alert" }, err[0]) : null,
    h("div", { className: "form", style: { maxWidth: "none", marginBottom: 16 } },
      h("label", null, "Title", h("input", { value: a.title, onChange: field("title") })),
      h("label", null, "Summary (shown under the title and in search results, about 150 characters)", h("input", { value: a.excerpt, onChange: field("excerpt"), maxLength: 220 })),
      h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 } },
        h("label", null, "Topic", h("select", { value: a.category || "", onChange: field("category") },
          h("option", { value: "" }, "Choose a topic"),
          CATEGORIES.map(function (c) { return h("option", { key: c.slug, value: c.slug }, c.name); })
        )),
        h("label", null, "Evidence rating", h("select", { value: a.evidenceLevel || "", onChange: field("evidenceLevel") },
          h("option", { value: "" }, "Not rated"),
          Object.keys(LEVELS).map(function (k) { return h("option", { key: k, value: k }, LEVELS[k].label + ": " + LEVELS[k].text); })
        )),
        h("label", null, "Tags (comma separated)", h("input", { value: a.tags, onChange: field("tags") }))
      ),
      h("label", null, "Evidence summary (one or two sentences)", h("input", { value: a.evidenceSummary || "", onChange: field("evidenceSummary") })),
      h("label", null, "Photo (optional, landscape works best)",
        h("input", { type: "file", accept: "image/*", onChange: function (e) { var f = e.target.files[0]; if (f) shrinkImage(f, function (d) { set(function (x) { return Object.assign({}, x, { customImage: d }); }); }); } })
      ),
      a.customImage ? h("div", { style: { display: "flex", gap: 12, alignItems: "center" } },
        h("img", { src: a.customImage, alt: "", style: { width: 160, borderRadius: 6 } }),
        h("button", { className: "btn secondary", onClick: function () { set(Object.assign({}, a, { customImage: null })); } }, "Remove photo")
      ) : null
    ),
    h("div", { className: "editor-grid" },
      h("label", { className: "form", style: { maxWidth: "none" } }, "Article text (markdown: ## heading, - bullet, **bold**, > note, [link](https://…))",
        h("textarea", { value: a.content, onChange: field("content") })
      ),
      h("div", null,
        h("p", { style: { fontWeight: 600, marginBottom: 6 } }, "Preview, " + words + " words" + (words < 900 ? " (aim for 1,000 or more)" : "")),
        h("div", { className: "editor-preview" }, h("div", { className: "prose", dangerouslySetInnerHTML: { __html: renderMarkdown(a.content).html } }))
      )
    ),
    h("p", { style: { marginTop: 16, display: "flex", gap: 10 } },
      h("button", { className: "btn", disabled: busy[0], onClick: save }, busy[0] ? "Publishing…" : a.id ? "Save changes" : "Publish article"),
      h("button", { className: "btn secondary", onClick: props.onCancel }, "Cancel")
    )
  );
}

var WRITER_PROMPT = [
  "You write for NaturalWell, a careful, evidence-based home-remedies website reviewed by a dentist.",
  "Write one article in markdown, 1,100 to 1,400 words, in plain British-neutral English for general readers.",
  "Structure with ## headings in this order: Quick answer; What the research says; How people use it; Possible side effects and interactions; Who should avoid it; When to see a doctor; Frequently asked questions (use ### for each question); References.",
  "Be honest about weak or mixed evidence. Never claim a remedy cures disease or replaces prescribed treatment. Use > for one short safety note.",
  "References: 3 to 6 items from health authorities (NIH ODS, NCCIH, NHS, WHO, MedlinePlus) or named systematic reviews. Only cite sources you are confident exist; the editor will verify them.",
  "Return ONLY a JSON object with keys: title (under 65 chars), excerpt (under 160 chars), category (one of: sleep-and-stress, digestive-health, immunity-and-colds, heart-and-metabolism, everyday-wellness), evidenceLevel (strong, moderate, limited or weak), evidenceSummary (one sentence), tags (array of 3), content (the markdown).",
].join("\n");

function Generate(props) {
  var topic = React.useState("");
  var busy = React.useState(false);
  var err = React.useState("");
  function run(e) {
    e.preventDefault();
    if (!topic[0].trim()) return;
    busy[1](true); err[1]("");
    api("POST", "/api/generate", {
      model: "claude-sonnet-5-5",
      max_tokens: 6000,
      system: WRITER_PROMPT,
      messages: [{ role: "user", content: "Topic: " + topic[0].trim() }],
    }).then(function (d) {
      var text = (d.content || []).filter(function (b) { return b.type === "text"; }).map(function (b) { return b.text; }).join("");
      var s = text.indexOf("{"), t = text.lastIndexOf("}");
      if (s === -1 || t === -1) throw new Error("The writer returned an unexpected format. Try again.");
      var p = JSON.parse(text.slice(s, t + 1));
      props.onDraft(Object.assign({}, EMPTY, {
        title: p.title || "", excerpt: p.excerpt || "", content: p.content || "",
        category: p.category || "", evidenceLevel: p.evidenceLevel || "", evidenceSummary: p.evidenceSummary || "",
        tags: (p.tags || []).join(", "),
      }));
    }).catch(function (e) { err[1](e.message); busy[1](false); });
  }
  return h("div", { style: { maxWidth: 640 } },
    h("h2", { style: { fontSize: 26, marginBottom: 8 } }, "Draft an article with AI"),
    h("p", { style: { color: "var(--muted)", marginBottom: 16 } }, "The draft opens in the editor. Check every fact and reference before you publish: the article goes out under your name."),
    err[0] ? h("p", { className: "notice error", role: "alert" }, err[0]) : null,
    h("form", { className: "form", onSubmit: run },
      h("label", null, "Remedy or question", h("input", { value: topic[0], onChange: function (e) { topic[1](e.target.value); }, placeholder: "e.g. Fennel tea for bloating" })),
      h("div", null, h("button", { className: "btn", disabled: busy[0] }, busy[0] ? "Writing draft, about a minute…" : "Write draft"))
    )
  );
}

function Subscribers() {
  var st = React.useState({ rows: null, error: "" });
  React.useEffect(function () {
    api("GET", "/api/subscribe").then(function (rows) { st[1]({ rows: rows, error: "" }); }).catch(function (e) { st[1]({ rows: [], error: e.message }); });
  }, []);
  var rows = st[0].rows;
  function csv() {
    var text = "email,source,signed_up\n" + rows.map(function (r) { return [r.email, r.source || "", r.created_at].join(","); }).join("\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
    a.download = "naturalwell-subscribers.csv";
    a.click();
  }
  if (!rows) return h("p", null, "Loading subscribers…");
  return h("div", null,
    st[0].error ? h("p", { className: "notice error" }, st[0].error) : null,
    h("p", { style: { marginBottom: 12, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" } },
      h("strong", null, rows.length + (rows.length === 1 ? " subscriber" : " subscribers")),
      rows.length ? h("button", { className: "btn secondary", onClick: csv }, "Download CSV") : null
    ),
    rows.length
      ? h("table", { className: "admin-table" },
          h("thead", null, h("tr", null, h("th", null, "Email"), h("th", null, "Signed up from"), h("th", null, "Date"))),
          h("tbody", null, rows.map(function (r) { return h("tr", { key: r.email }, h("td", null, r.email), h("td", null, r.source || ""), h("td", null, String(r.created_at).slice(0, 10))); }))
        )
      : h("p", { className: "empty" }, "No subscribers yet. The sign-up box appears on the home page, topic pages and every article.")
  );
}

export function Admin(props) {
  var mounted = React.useState(false);
  var signedIn = React.useState(false);
  var tab = React.useState("articles");
  var list = React.useState(null);
  var editing = React.useState(null);
  var note = React.useState("");
  var err = React.useState("");

  React.useEffect(function () {
    mounted[1](true);
    if (getPw()) api("POST", "/api/auth").then(function () { signedIn[1](true); }).catch(function () { setPw(""); });
  }, []);

  function load() {
    fetch("/api/articles?meta=1").then(function (r) { return r.json(); }).then(function (rows) { list[1](rows); if (props.onArticlesChanged) props.onArticlesChanged(rows); });
  }
  React.useEffect(function () { if (signedIn[0]) load(); }, [signedIn[0]]);

  if (!mounted[0]) return h("div", { className: "wrap admin" }, h("p", null, "Loading admin…"));
  if (!signedIn[0]) return h(Login, { onIn: function () { signedIn[1](true); } });

  function edit(a) {
    err[1]("");
    fetch("/api/articles?slug=" + encodeURIComponent(a.slug)).then(function (r) { return r.json(); }).then(function (full) {
      editing[1](Object.assign({}, EMPTY, full, { tags: (full.tags || []).join(", "), customImage: full.image || null, evidenceLevel: full.evidenceLevel || "", evidenceSummary: full.evidenceSummary || "" }));
      note[1]("");
    });
  }
  function remove(a) {
    if (!window.confirm("Delete “" + a.title + "”? This can't be undone.")) return;
    api("DELETE", "/api/articles", { id: a.id }).then(load).catch(function (e) { err[1](e.message); });
  }

  var body;
  if (editing[0]) {
    body = h(Editor, { initial: editing[0], note: note[0], onCancel: function () { editing[1](null); }, onSaved: function () { editing[1](null); load(); } });
  } else if (tab[0] === "generate") {
    body = h(Generate, { onDraft: function (d) { note[1]("This is an AI draft. Check the facts and references, add your own experience, then publish."); editing[1](d); } });
  } else if (tab[0] === "subscribers") {
    body = h(Subscribers);
  } else {
    var rows = list[0];
    body = !rows ? h("p", null, "Loading articles…") : h("div", null,
      h("table", { className: "admin-table" },
        h("thead", null, h("tr", null, h("th", null, "Article"), h("th", null, "Topic"), h("th", null, "Evidence"), h("th", null, "Words"), h("th", null, ""))),
        h("tbody", null, rows.map(function (a) {
          var c = CATEGORIES.find(function (x) { return x.slug === a.category; });
          return h("tr", { key: a.id },
            h("td", null, h("a", { href: "/article/" + a.slug, target: "_blank", rel: "noopener" }, a.title)),
            h("td", null, c ? c.name : h("span", { style: { color: "var(--alert)" } }, "None")),
            h("td", null, a.evidenceLevel ? LEVELS[a.evidenceLevel].label : "Not rated"),
            h("td", { style: { color: a.wordCount < 900 ? "var(--alert)" : undefined } }, a.wordCount),
            h("td", null, h("div", { className: "admin-row-actions" },
              h("button", { onClick: function () { edit(a); } }, "Edit"),
              h("button", { onClick: function () { remove(a); } }, "Delete")
            ))
          );
        }))
      )
    );
  }

  return h("div", { className: "wrap admin" },
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 } },
      h("h1", null, "NaturalWell admin"),
      h("button", { className: "btn secondary", onClick: function () { setPw(""); signedIn[1](false); } }, "Sign out")
    ),
    err[0] ? h("p", { className: "notice error" }, err[0]) : null,
    editing[0] ? null : h("div", { className: "admin-tabs", role: "group", "aria-label": "Admin sections" },
      [["articles", "Articles"], ["new", "Write new"], ["generate", "Draft with AI"], ["subscribers", "Subscribers"]].map(function (t) {
        return h("button", { key: t[0], "aria-pressed": tab[0] === t[0], onClick: function () {
          if (t[0] === "new") { note[1](""); editing[1](Object.assign({}, EMPTY)); return; }
          tab[1](t[0]);
        } }, t[1]);
      })
    ),
    body
  );
}
