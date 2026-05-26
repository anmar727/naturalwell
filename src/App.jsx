import React, { useState, useEffect } from "react";

const SITE = {
  name: "NaturalWell",
  tagline: "Home Remedies & Natural Health",
  email: "anmar727@gmail.com",
  url: "https://naturalwellblog.com",
  accent: "#2d6a4f",
  accentLight: "#e8f5ee",
  accentDark: "#1a4a35",
  font: "'Merriweather', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
  adminPassword: "NaturalWell2025!",
};

const FALLBACK_TOPICS = [
  "Better sleep naturally","Boost immunity naturally","Natural anxiety relief",
  "Apple cider vinegar benefits","Anti-inflammatory foods","Natural remedies for bloating",
  "Herbal teas for health","Natural skin care remedies","Gut health improvement",
  "Home remedies for sore throat","Turmeric health benefits","Natural remedies for back pain",
  "Foods that reduce inflammation","Natural energy boosters","Home remedies for cold and flu",
  "Benefits of magnesium","Natural pain relief methods","Foods for better brain health",
  "Home remedies for acid reflux","Natural ways to lower blood pressure",
];

const SAMPLE = [
  { id: "1", slug: "natural-headache-remedies", title: "12 Natural Remedies for Headaches That Actually Work", excerpt: "Discover effective, science-backed home remedies to relieve headache pain without medication.", content: "## Why Natural Remedies Work for Headaches\n\nHeadaches affect billions of people worldwide. Natural approaches can address root causes and reduce frequency over time.\n\n## 1. Stay Hydrated\nDehydration is one of the most overlooked causes of headaches. Drink a full glass of water immediately when a headache starts.\n\n## 2. Ginger Tea\nGinger contains powerful anti-inflammatory compounds. Research suggests it can be as effective as sumatriptan for migraines.\n\n## 3. Peppermint Oil\nApply diluted peppermint essential oil to your temples. Menthol relaxes muscles and improves blood flow.\n\n## 4. Magnesium\nStudies show magnesium deficiency is common in migraine sufferers. 400-500mg daily may reduce headache frequency by up to 41%.\n\n## Conclusion\nKeep a headache diary to identify your personal triggers and track which remedies work best.\n\n*Disclaimer: This article is for informational purposes only. Always consult a qualified healthcare professional.*", tags: ["headache", "natural remedies", "wellness"], readTime: "6 min", date: "2025-05-20", wordCount: 820 },
  { id: "2", slug: "gut-health-herbs", title: "7 Best Herbs for Gut Health and Better Digestion", excerpt: "Support your digestive system with these powerful, evidence-backed herbs.", content: "## The Gut-Health Connection\n\nYour gut is home to trillions of bacteria that influence immunity, mood, and energy.\n\n## 1. Ginger Root\nGinger accelerates gastric emptying and reduces nausea, bloating, and indigestion.\n\n## 2. Peppermint\nRelaxes intestinal smooth muscles. Particularly effective for IBS symptoms.\n\n## 3. Turmeric\nCurcumin is one of the most powerful gut anti-inflammatories. Combine with black pepper for 2000% better absorption.\n\n## Conclusion\nBegin with herbal teas steeped 10-15 minutes after meals. Give any herb 2-4 weeks before evaluating.\n\n*Disclaimer: Consult a healthcare provider before starting herbal supplements.*", tags: ["gut health", "digestion", "herbs"], readTime: "5 min", date: "2025-05-18", wordCount: 640 },
  { id: "3", slug: "boost-immunity-naturally", title: "10 Proven Ways to Boost Your Immune System Naturally", excerpt: "Strengthen your body's natural defenses with these science-backed lifestyle changes.", content: "## Understanding Immunity\n\nYour immune system is your body's defense network. Support its optimal function through consistent healthy habits.\n\n## 1. Prioritize Quality Sleep\nEven one night of poor sleep reduces immune cell activity by up to 70%.\n\n## 2. Vitamin C Rich Foods\nFocus on bell peppers, citrus fruits, strawberries, and broccoli.\n\n## 3. Elderberry\nElderberry has strong antiviral properties and may reduce cold and flu duration by up to 4 days.\n\n## 4. Vitamin D\nGet 15-20 minutes of sunlight daily or supplement with 1000-2000 IU.\n\n## Conclusion\nSmall consistent habits build a strong immune system over time.\n\n*Disclaimer: These suggestions support general wellness. Consult your healthcare provider for personalized advice.*", tags: ["immunity", "wellness", "natural health"], readTime: "7 min", date: "2025-05-15", wordCount: 760 },
];

const TOPIC_KEYWORDS = {
  "headache": "herbs+medicine+natural",
  "migraine": "herbs+medicine+natural",
  "gut health": "vegetables+healthy+food",
  "digestion": "vegetables+healthy+food",
  "immunity": "citrus+fruit+vitamin",
  "immune": "citrus+fruit+vitamin",
  "sleep": "calm+night+bedroom",
  "anxiety": "meditation+calm+nature",
  "stress": "meditation+calm+nature",
  "skin": "skincare+natural+glow",
  "herbs": "herbs+plants+green",
  "turmeric": "turmeric+spice+yellow",
  "inflammation": "ginger+herbs+spice",
  "energy": "sunrise+morning+health",
  "detox": "green+smoothie+healthy",
  "weight": "healthy+food+salad",
  "heart": "berries+heart+healthy",
  "diabetes": "vegetables+healthy+food",
  "pain": "massage+therapy+natural",
  "cold": "ginger+lemon+honey",
  "flu": "ginger+lemon+honey",
  "remedies": "natural+medicine+herbs",
};

function getImageUrl(article) {
  if (article.customImage) return article.customImage;
  var keyword = "natural+health+herbs";
  var tags = (article.tags || []).map(function(t) { return t.toLowerCase(); });
  var title = (article.title || "").toLowerCase();
  for (var k in TOPIC_KEYWORDS) {
    if (tags.some(function(t) { return t.includes(k); }) || title.includes(k)) {
      keyword = TOPIC_KEYWORDS[k];
      break;
    }
  }
  return "https://source.unsplash.com/featured/800x500/?" + keyword + "&sig=" + (article.id || "1");
}


function ImageUploader(props) {
  var onImage = props.onImage;
  var current = props.current;
  var inputRef = React.useRef(null);

  function handleFile(e) {
    var file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert("Image must be under 3MB"); return; }
    var reader = new FileReader();
    reader.onload = function(ev) { onImage(ev.target.result); };
    reader.readAsDataURL(file);
  }

  return React.createElement("div", { style: { marginBottom: 14 } },
    React.createElement("label", { style: { fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 6 } }, "Article Image (optional)"),
    current
      ? React.createElement("div", { style: { position: "relative", marginBottom: 8 } },
          React.createElement("img", { src: current, alt: "preview", style: { width: "100%", height: 180, objectFit: "cover", borderRadius: 10, display: "block" } }),
          React.createElement("button", {
            className: "btn",
            onClick: function() { onImage(null); },
            style: { position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.6)", color: "#fff", borderRadius: 20, padding: "4px 10px", fontSize: 12 }
          }, "✕ Remove")
        )
      : null,
    React.createElement("div", {
      onClick: function() { inputRef.current && inputRef.current.click(); },
      style: { border: "2px dashed #ddd", borderRadius: 10, padding: "20px", textAlign: "center", cursor: "pointer", background: "#fafafa" }
    },
      React.createElement("div", { style: { fontSize: 28, marginBottom: 6 } }, "🖼️"),
      React.createElement("p", { style: { fontSize: 13, color: "#999" } }, current ? "Click to change image" : "Click to upload image"),
      React.createElement("p", { style: { fontSize: 11, color: "#ccc", marginTop: 4 } }, "JPG, PNG, WebP — max 3MB")
    ),
    React.createElement("input", {
      ref: inputRef,
      type: "file",
      accept: "image/*",
      onChange: handleFile,
      style: { display: "none" }
    })
  );
}

const callAPI = async function(payload) {
  var res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  var text = await res.text();
  if (!text || !text.trim()) throw new Error("Empty response. Check ANTHROPIC_API_KEY in Vercel.");
  var data = JSON.parse(text);
  if (data.error) throw new Error(typeof data.error === "string" ? data.error : (data.error.message || JSON.stringify(data.error)));
  return data;
};

const ADBlock = function(props) {
  return React.createElement("div", {
    style: { background: "repeating-linear-gradient(45deg,#f5f5f5,#f5f5f5 2px,#fafafa 2px,#fafafa 12px)", border: "1px dashed #ddd", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#ccc", fontSize: 11, height: props.h || 90, margin: "20px 0", fontFamily: "system-ui" }
  },
    React.createElement("span", null, "Advertisement — " + props.slot),
    React.createElement("span", { style: { fontSize: 10, marginTop: 2, color: "#ddd" } }, "Replace with Google AdSense code")
  );
};

export default function Blog() {
  var s1 = useState("blog"); var view = s1[0]; var setView = s1[1];
  var s2 = useState(SAMPLE); var articles = s2[0]; var setArticles = s2[1];
  var s3 = useState(null); var current = s3[0]; var setCurrent = s3[1];
  var s4 = useState(""); var topic = s4[0]; var setTopic = s4[1];
  var s5 = useState(false); var generating = s5[0]; var setGenerating = s5[1];
  var s6 = useState(""); var genLog = s6[0]; var setGenLog = s6[1];
  var s7 = useState(false); var unlocked = s7[0]; var setUnlocked = s7[1];
  var s8 = useState(""); var adminPw = s8[0]; var setAdminPw = s8[1];
  var s9 = useState(""); var search = s9[0]; var setSearch = s9[1];
  var s10 = useState({ name: "", email: "", msg: "" }); var contact = s10[0]; var setContact = s10[1];
  var s11 = useState(false); var contactSent = s11[0]; var setContactSent = s11[1];
  var s12 = useState(""); var newsletterEmail = s12[0]; var setNewsletterEmail = s12[1];
  var s13 = useState(false); var newsletterDone = s13[0]; var setNewsletterDone = s13[1];
  var s14 = useState(""); var pwError = s14[0]; var setPwError = s14[1];
  var s15 = useState([]); var usedTopics = s15[0]; var setUsedTopics = s15[1];
  var s16 = useState(FALLBACK_TOPICS.slice(0, 6)); var suggestedTopics = s16[0]; var setSuggestedTopics = s16[1];
  var s17 = useState(false); var topicsLoading = s17[0]; var setTopicsLoading = s17[1];

  // Draft review state (Feature 1)
  var s18 = useState(null); var draftArticle = s18[0]; var setDraftArticle = s18[1];

  // Edit published article state (Feature 2)
  var s19 = useState(null); var editingArticle = s19[0]; var setEditingArticle = s19[1];

  // Manual post state (Feature 3)
  var s20 = useState({ title: "", excerpt: "", content: "", tags: "", readTime: "5 min" });
  var manualPost = s20[0]; var setManualPost = s20[1];

  var s21 = useState("generate"); var adminTab = s21[0]; var setAdminTab = s21[1];
  var s22 = useState("All"); var activeCategory = s22[0]; var setActiveCategory = s22[1];
  var s23 = useState(""); var searchQuery = s23[0]; var setSearchQuery = s23[1];
  var s24 = useState(false); var copied = s24[0]; var setCopied = s24[1];

  useEffect(function() {
    try {
      var stored = localStorage.getItem("nw_v2_articles");
      var parsed = stored ? JSON.parse(stored) : [];
      var cleaned = parsed.map(function(a) {
        var t = a.tags;
        if (typeof t === "string") t = t.split(",").map(function(x) { return x.trim(); }).filter(Boolean);
        return Object.assign({}, a, { tags: t || [] });
      });
      if (cleaned.length) setArticles(cleaned);
    } catch(e) {}
  }, []);

  useEffect(function() { window.scrollTo(0, 0); }, [view]);

  useEffect(function() {
    if (view === "article" && current) {
      window.history.pushState({}, "", "/article/" + current.slug);
      document.title = current.title + " — NaturalWell";
    } else if (view === "blog") {
      window.history.pushState({}, "", "/");
      document.title = "NaturalWell — Home Remedies & Natural Health";
    } else if (view === "about") {
      window.history.pushState({}, "", "/about");
    } else if (view === "contact") {
      window.history.pushState({}, "", "/contact");
    } else if (view === "privacy") {
      window.history.pushState({}, "", "/privacy");
    }
  }, [view, current]);

  useEffect(function() {
    var path = window.location.pathname;
    if (path.startsWith("/article/")) {
      var slug = path.replace("/article/", "");
      var found = articles.find(function(a) { return a.slug === slug; });
      if (found) { setCurrent(found); setView("article"); }
    } else if (path === "/about") { setView("about"); }
    else if (path === "/contact") { setView("contact"); }
    else if (path === "/privacy") { setView("privacy"); }
  }, [articles]);

  useEffect(function() {
    if (view === "adminGenerate") fetchFreshTopics();
  }, [view]);

  function persist(list) {
    try {
      var fixed = list.map(function(a) {
        var t = a.tags;
        if (typeof t === "string") {
          t = t.split(",").map(function(x) { return x.trim(); }).filter(Boolean);
        }
        return Object.assign({}, a, { tags: t || [] });
      });
      localStorage.setItem("nw_v2_articles", JSON.stringify(fixed));
    } catch(e) {}
  }

  async function generateSitemap() {
    try {
      var res = await fetch("/api/sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: articles }),
      });
      var xml = await res.text();
      var blob = new Blob([xml], { type: "application/xml" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = "sitemap.xml"; a.click();
      URL.revokeObjectURL(url);
      alert("sitemap.xml downloaded! Upload it to your GitHub repo root folder, then submit it to Google Search Console.");
    } catch(e) {
      alert("Error generating sitemap: " + e.message);
    }
  }

  function tryUnlock() {
    if (adminPw === SITE.adminPassword) { setUnlocked(true); setPwError(""); }
    else { setPwError("Incorrect password. Please try again."); setAdminPw(""); }
  }

  async function fetchFreshTopics() {
    setTopicsLoading(true);
    try {
      var data = await callAPI({
        model: "claude-haiku-4-5-20251001", max_tokens: 500,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: "Search for the latest trending natural health, home remedies, and wellness topics in the news right now in 2025. Return ONLY a raw JSON array of exactly 10 short blog topic strings under 8 words each. No explanations, no markdown." }],
      });
      var textBlock = (data.content || []).find(function(b) { return b.type === "text"; });
      if (textBlock) {
        var clean = textBlock.text.replace(/```json|```/g, "").trim();
        var start = clean.indexOf("["); var end = clean.lastIndexOf("]");
        if (start !== -1 && end !== -1) {
          var topics = JSON.parse(clean.slice(start, end + 1));
          var fresh = topics.filter(function(t) { return !usedTopics.includes(t); }).slice(0, 6);
          if (fresh.length >= 3) { setSuggestedTopics(fresh); setTopicsLoading(false); return; }
        }
      }
    } catch(e) {}
    setSuggestedTopics(FALLBACK_TOPICS.filter(function(t) { return !usedTopics.includes(t); }).slice(0, 6));
    setTopicsLoading(false);
  }

  async function generate() {
    if (!topic.trim() || generating) return;
    setGenerating(true);
    setGenLog("Searching the web for latest research...");
    try {
      var resData = await callAPI({
        model: "claude-haiku-4-5-20251001", max_tokens: 800,
        messages: [{ role: "user", content: "Find key facts and practical tips about: " + topic + " for a natural health blog." }],
      });
      var research = (resData.content || []).filter(function(b) { return b.type === "text"; }).map(function(b) { return b.text; }).join("\n");
      setGenLog("Writing your article...");
      var sysPrompt = "You are an expert natural health blogger. Return ONLY a raw JSON object with no markdown fences. Fields: title (under 60 chars), excerpt (under 155 chars), content (800-1000 word markdown with ## H2 headings, ending with *Disclaimer: paragraph), tags (array of 3 strings), readTime (e.g. 6 min), wordCount (number).";
      var writeData = await callAPI({
        model: "claude-haiku-4-5-20251001", max_tokens: 4000,
        system: sysPrompt,
        messages: [{ role: "user", content: "Topic: " + topic + "\nResearch:\n" + research }],
      });
      var rawBlock = (writeData.content || []).find(function(b) { return b.type === "text"; });
      if (!rawBlock) throw new Error("No content returned.");
      var clean = rawBlock.text.replace(/```json/g, "").replace(/```/g, "").trim();
      var si = clean.indexOf("{"); var ei = clean.lastIndexOf("}");
      if (si === -1 || ei === -1) throw new Error("Invalid format.");
      var post = JSON.parse(clean.slice(si, ei + 1));
      var draft = {
        id: Date.now().toString(),
        slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60),
        title: post.title, excerpt: post.excerpt, content: post.content,
        tags: post.tags || [], readTime: post.readTime || "5 min",
        wordCount: post.wordCount || 800, date: new Date().toISOString().slice(0, 10),
      };
      setUsedTopics(function(prev) { return prev.concat([topic]); });
      setSuggestedTopics(function(prev) { return prev.filter(function(t) { return t !== topic; }); });
      setTopic("");
      setGenLog("");
      setDraftArticle(draft);
      setView("reviewDraft");
    } catch(e) { setGenLog("ERROR:" + e.message); }
    setGenerating(false);
  }

  function publishDraft() {
    var updated = [draftArticle].concat(articles);
    setArticles(updated); persist(updated);
    setDraftArticle(null); setView("admin");
  }

  function saveEdit() {
    var updated = articles.map(function(a) { return a.id === editingArticle.id ? editingArticle : a; });
    setArticles(updated); persist(updated);
    setEditingArticle(null); setView("admin");
  }

  function publishManual() {
    if (!manualPost.title.trim() || !manualPost.content.trim()) return;
    var article = {
      id: Date.now().toString(),
      slug: manualPost.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60),
      title: manualPost.title, excerpt: manualPost.excerpt,
      content: manualPost.content,
      tags: manualPost.tags.split(",").map(function(t) { return t.trim(); }).filter(Boolean),
      readTime: manualPost.readTime, wordCount: manualPost.content.split(" ").length,
      date: new Date().toISOString().slice(0, 10),
    };
    var updated = [article].concat(articles);
    setArticles(updated); persist(updated);
    setManualPost({ title: "", excerpt: "", content: "", tags: "", readTime: "5 min" });
    setView("admin");
  }

  function deleteArticle(id) {
    var updated = articles.filter(function(a) { return a.id !== id; });
    setArticles(updated); persist(updated);
  }

  var allTags = ["All"].concat([...new Set((articles || []).flatMap(function(a) { return a.tags || []; }))].sort());

  var filtered = (articles || []).filter(function(a) {
    var matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || (a.tags || []).some(function(t) { return t.toLowerCase().includes(search.toLowerCase()); });
    var matchesCategory = activeCategory === "All" || (a.tags || []).some(function(t) { return t.toLowerCase() === activeCategory.toLowerCase(); });
    return matchesSearch && matchesCategory;
  });

  var A = SITE.accent; var AL = SITE.accentLight; var AD = SITE.accentDark;
  var F = SITE.font; var S = SITE.sans;

  var css = "@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap');" +
    "*{box-sizing:border-box;margin:0;padding:0}" +
    "body{font-family:" + S + ";background:#f8f7f4;color:#1a1a1a;-webkit-font-smoothing:antialiased}" +
    ".btn{cursor:pointer;border:none;font-family:" + S + ";transition:all .15s}.btn:hover{opacity:.88}" +
    ".inp{width:100%;padding:11px 14px;border:1.5px solid #e5e5e5;border-radius:9px;font-size:14px;font-family:" + S + ";outline:none;background:#fff;transition:border .2s}" +
    ".inp:focus{border-color:" + A + ";box-shadow:0 0 0 3px " + AL + "}" +
    "textarea.inp{resize:vertical;min-height:160px;font-family:monospace;font-size:13px;line-height:1.7}" +
    ".tag{display:inline-block;font-size:11px;padding:3px 10px;border-radius:20px;background:" + AL + ";color:" + A + ";font-weight:600}" +
    ".card{background:#fff;border:1px solid #ece9e0;border-radius:14px;overflow:hidden;transition:box-shadow .2s,transform .2s}" +
    ".card:hover{box-shadow:0 8px 24px rgba(0,0,0,.08);transform:translateY(-2px)}" +
    ".prose h2{font-family:" + F + ";font-size:22px;margin:32px 0 12px;color:#111;line-height:1.3}" +
    ".prose h3{font-size:17px;font-weight:600;margin:22px 0 8px}" +
    ".prose p{margin-bottom:16px;font-size:16px;line-height:1.9;color:#333}" +
    ".prose ul,.prose ol{padding-left:24px;margin-bottom:16px}" +
    ".prose li{font-size:16px;line-height:1.85;margin-bottom:6px;color:#333}" +
    ".prose em{color:#888;font-style:italic;font-size:14px}" +
    ".divider{height:1px;background:linear-gradient(90deg,transparent," + A + "44,transparent);margin:32px 0}" +
    ".atab{padding:10px 18px;border-radius:10px 10px 0 0;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:" + S + ";transition:all .15s}" +
    "@media(max-width:700px){.g2{grid-template-columns:1fr!important}.hide-m{display:none!important}}" +
    "@keyframes spin{to{transform:rotate(360deg)}}" +
    ".spinner{width:18px;height:18px;border:2px solid #fff4;border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;vertical-align:middle;margin-right:8px}" +
    "@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}.pulse{animation:pulse 1.5s ease-in-out infinite}";

  function Nav() {
    return React.createElement("nav", { style: { background: "rgba(255,255,255,.97)", backdropFilter: "blur(10px)", borderBottom: "1px solid #ece9e0", padding: "0 24px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,.04)" } },
      React.createElement("div", { onClick: function() { setView("blog"); }, style: { cursor: "pointer", display: "flex", alignItems: "center", gap: 9 } },
        React.createElement("span", { style: { fontSize: 24 } }, "🌿"),
        React.createElement("div", null,
          React.createElement("div", { style: { fontFamily: F, fontSize: 18, fontWeight: 700, color: A, lineHeight: 1 } }, SITE.name),
          React.createElement("div", { className: "hide-m", style: { fontSize: 11, color: "#aaa", marginTop: 1 } }, SITE.tagline)
        )
      ),
      React.createElement("div", { style: { display: "flex", gap: 4 } },
        [["blog","Blog"],["about","About"],["contact","Contact"],["privacy","Privacy"]].map(function(item) {
          return React.createElement("button", { key: item[0], className: "btn", onClick: function() { setView(item[0]); }, style: { padding: "6px 13px", borderRadius: 22, fontSize: 13, fontWeight: 500, background: view === item[0] ? AL : "transparent", color: view === item[0] ? A : "#666", border: view === item[0] ? "1px solid " + A + "33" : "1px solid transparent" } }, item[1]);
        }),
        React.createElement("button", { className: "btn", onClick: function() { setSearchQuery(""); setView("search"); }, style: { padding: "6px 13px", borderRadius: 22, fontSize: 13, background: view === "search" ? AL : "transparent", color: view === "search" ? A : "#666", border: view === "search" ? "1px solid " + A + "33" : "1px solid transparent" } }, "🔍"),
        React.createElement("button", { className: "btn", onClick: function() { setView("admin"); }, style: { padding: "6px 13px", borderRadius: 22, fontSize: 13, background: "transparent", color: "#bbb", border: "1px solid transparent" } }, "⚙")
      )
    );
  }

  function Newsletter() {
    return React.createElement("div", { style: { background: "linear-gradient(135deg," + A + "," + AD + ")", borderRadius: 16, padding: "32px 28px", margin: "40px 0", color: "#fff", textAlign: "center" } },
      React.createElement("div", { style: { fontSize: 32, marginBottom: 10 } }, "💌"),
      React.createElement("h3", { style: { fontFamily: F, fontSize: 20, marginBottom: 8 } }, "Get Weekly Health Tips"),
      React.createElement("p", { style: { fontSize: 14, opacity: .85, marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" } }, "Join readers getting natural health tips every week."),
      newsletterDone
        ? React.createElement("div", { style: { background: "rgba(255,255,255,.2)", borderRadius: 10, padding: "12px 20px", fontSize: 14 } }, "✅ You are subscribed!")
        : React.createElement("div", { style: { display: "flex", gap: 8, maxWidth: 420, margin: "0 auto", flexWrap: "wrap" } },
            React.createElement("input", { className: "inp", type: "email", placeholder: "Your email address", value: newsletterEmail, onChange: function(e) { setNewsletterEmail(e.target.value); }, style: { flex: 1, minWidth: 200, background: "rgba(255,255,255,.95)" } }),
            React.createElement("button", { className: "btn", onClick: function() { if (newsletterEmail.includes("@")) setNewsletterDone(true); }, style: { padding: "11px 20px", background: "#fff", color: A, borderRadius: 9, fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" } }, "Subscribe →")
          )
    );
  }

  function Footer() {
    return React.createElement("footer", { style: { background: "#111", color: "#888", padding: "48px 24px 28px" } },
      React.createElement("div", { style: { maxWidth: 900, margin: "0 auto" } },
        React.createElement("div", { className: "g2", style: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 32, marginBottom: 40 } },
          React.createElement("div", null,
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 } },
              React.createElement("span", { style: { fontSize: 24 } }, "🌿"),
              React.createElement("span", { style: { fontFamily: F, fontSize: 17, color: "#fff", fontWeight: 700 } }, SITE.name)
            ),
            React.createElement("p", { style: { fontSize: 13, lineHeight: 1.8, maxWidth: 280 } }, "Science-backed natural health information. For educational purposes only."),
            React.createElement("p", { style: { fontSize: 12, marginTop: 12, color: "#555" } }, "📧 " + SITE.email)
          ),
          React.createElement("div", null,
            React.createElement("p", { style: { fontSize: 11, color: "#444", marginBottom: 12, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 } }, "Pages"),
            [["blog","Blog"],["about","About Us"],["contact","Contact"],["privacy","Privacy Policy"]].map(function(item) {
              return React.createElement("p", { key: item[0], onClick: function() { setView(item[0]); }, style: { fontSize: 13, color: "#777", marginBottom: 8, cursor: "pointer" } }, item[1]);
            })
          ),
          React.createElement("div", null,
            React.createElement("p", { style: { fontSize: 11, color: "#444", marginBottom: 12, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 } }, "Topics"),
            ["Natural Remedies","Gut Health","Immunity","Sleep","Mental Wellness"].map(function(t) {
              return React.createElement("p", { key: t, style: { fontSize: 13, color: "#777", marginBottom: 8 } }, t);
            })
          )
        ),
        React.createElement("div", { style: { borderTop: "1px solid #222", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 } },
          React.createElement("p", { style: { fontSize: 12, color: "#444" } }, "© " + new Date().getFullYear() + " " + SITE.name + ". All rights reserved."),
          React.createElement("p", { style: { fontSize: 12, color: "#444" } }, "For informational purposes only — not medical advice.")
        )
      )
    );
  }

  function renderMd(md) {
    if (!md) return null;
    return md.split("\n").map(function(line, i) {
      if (line.startsWith("## ")) return React.createElement("h2", { key: i }, line.slice(3));
      if (line.startsWith("### ")) return React.createElement("h3", { key: i }, line.slice(4));
      if (line.match(/^\d+\. /)) return React.createElement("li", { key: i, style: { listStyleType: "decimal" } }, line.replace(/^\d+\. /, ""));
      if (line.startsWith("- ")) return React.createElement("li", { key: i }, line.slice(2));
      if (line.startsWith("*")) return React.createElement("p", { key: i }, React.createElement("em", null, line.replace(/\*/g, "")));
      if (line.trim()) return React.createElement("p", { key: i }, line);
      return null;
    });
  }

  function shareArticle(a) {
    if (navigator.share) { navigator.share({ title: a.title, text: a.excerpt, url: window.location.href }); }
    else { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }
  }

  function EditorForm(props) {
    var data = props.data;
    var setData = props.setData;
    var onSave = props.onSave;
    var onCancel = props.onCancel;
    var saveLabel = props.saveLabel || "Save";
    var showPreview = props.showPreview !== false;

    var sp = useState(false); var preview = sp[0]; var setPreview = sp[1];

    return React.createElement("div", { style: { background: "#fff", border: "1px solid #ece9e0", borderRadius: 16, overflow: "hidden" } },
      React.createElement("div", { style: { display: "flex", gap: 0, borderBottom: "1px solid #ece9e0" } },
        React.createElement("button", { className: "atab", onClick: function() { setPreview(false); }, style: { background: !preview ? AL : "#f8f7f4", color: !preview ? A : "#888" } }, "✏️ Edit"),
        showPreview && React.createElement("button", { className: "atab", onClick: function() { setPreview(true); }, style: { background: preview ? AL : "#f8f7f4", color: preview ? A : "#888" } }, "👁 Preview")
      ),
      preview
        ? React.createElement("div", { style: { padding: "28px 24px", maxHeight: 500, overflowY: "auto" } },
            React.createElement("h1", { style: { fontFamily: F, fontSize: 24, color: "#111", marginBottom: 10 } }, data.title || "No title"),
            React.createElement("p", { style: { fontSize: 13, color: "#aaa", marginBottom: 20 } }, data.excerpt),
            React.createElement("div", { className: "prose" }, renderMd(data.content))
          )
        : React.createElement("div", { style: { padding: "24px" } },
            React.createElement("label", { style: { fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 6 } }, "Title"),
            React.createElement("input", { className: "inp", value: data.title, onChange: function(e) { setData(function(d) { return Object.assign({}, d, { title: e.target.value }); }); }, placeholder: "Article title", style: { marginBottom: 14 } }),
            React.createElement("label", { style: { fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 6 } }, "Excerpt / Summary"),
            React.createElement("input", { className: "inp", value: data.excerpt, onChange: function(e) { setData(function(d) { return Object.assign({}, d, { excerpt: e.target.value }); }); }, placeholder: "Short description shown on the blog list", style: { marginBottom: 14 } }),
            React.createElement("label", { style: { fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 6 } }, "Content (Markdown)"),
            React.createElement("p", { style: { fontSize: 11, color: "#aaa", marginBottom: 6 } }, "Use ## for headings, - for bullet points, *text* for italic"),
            React.createElement("textarea", { className: "inp", value: data.content, onChange: function(e) { setData(function(d) { return Object.assign({}, d, { content: e.target.value }); }); }, placeholder: "Write your article here using markdown...", style: { marginBottom: 14, minHeight: 300 } }),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 } },
              React.createElement("div", null,
                React.createElement("label", { style: { fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 6 } }, "Tags (comma separated)"),
                React.createElement("input", { className: "inp", value: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags, onChange: function(e) { setData(function(d) { return Object.assign({}, d, { tags: e.target.value }); }); }, placeholder: "gut health, digestion, herbs" })
              ),
              React.createElement("div", null,
                React.createElement("label", { style: { fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 6 } }, "Read time"),
                React.createElement("input", { className: "inp", value: data.readTime, onChange: function(e) { setData(function(d) { return Object.assign({}, d, { readTime: e.target.value }); }); }, placeholder: "5 min" })
              )
            ),
            React.createElement(ImageUploader, {
              current: data.customImage || null,
              onImage: function(img) { setData(function(d) { return Object.assign({}, d, { customImage: img }); }); }
            })
          ),
      React.createElement("div", { style: { padding: "16px 24px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 10, justifyContent: "flex-end" } },
        React.createElement("button", { className: "btn", onClick: onCancel, style: { padding: "9px 18px", background: "#f5f5f5", color: "#666", borderRadius: 8, fontSize: 13 } }, "Cancel"),
        React.createElement("button", { className: "btn", onClick: onSave, style: { padding: "9px 20px", background: A, color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: 14 } }, saveLabel)
      )
    );
  }

  // ── BLOG ──
  if (view === "blog") return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { background: "linear-gradient(135deg," + A + "08," + A + "14)", borderBottom: "1px solid " + A + "22", padding: "48px 20px", textAlign: "center" } },
      React.createElement("p", { style: { fontSize: 12, color: A, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 } }, "Natural Health & Wellness"),
      React.createElement("h1", { style: { fontFamily: F, fontSize: 34, color: "#111", marginBottom: 14, lineHeight: 1.25 } }, "Home Remedies That Actually Work"),
      React.createElement("p", { style: { fontSize: 16, color: "#666", maxWidth: 500, margin: "0 auto 24px" } }, "Science-backed natural health tips to help you feel better every day."),
      React.createElement("input", { className: "inp", value: search, onChange: function(e) { setSearch(e.target.value); }, placeholder: "Search articles...", style: { maxWidth: 380, margin: "0 auto", display: "block", borderRadius: 30, padding: "12px 20px", boxShadow: "0 2px 12px rgba(0,0,0,.08)" } })
    ),
    React.createElement("div", { style: { background: "#fff", borderBottom: "1px solid #ece9e0", padding: "12px 20px" } },
      React.createElement("div", { style: { maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 } },
        React.createElement("span", { style: { fontSize: 13, color: "#666", fontWeight: 600, whiteSpace: "nowrap" } }, "Browse by topic:"),
        React.createElement("div", { style: { position: "relative", flex: 1, maxWidth: 280 } },
          React.createElement("select", {
            value: activeCategory,
            onChange: function(e) { setActiveCategory(e.target.value); },
            style: { width: "100%", padding: "9px 36px 9px 14px", borderRadius: 9, border: "1.5px solid " + A + "55", background: "#fff", color: "#1a1a1a", fontSize: 13, fontWeight: 500, fontFamily: S, outline: "none", cursor: "pointer", appearance: "none", WebkitAppearance: "none" }
          },
            allTags.map(function(tag) {
              return React.createElement("option", { key: tag, value: tag }, tag === "All" ? "🌿 All Categories" : tag);
            })
          ),
          React.createElement("div", { style: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: A, fontSize: 12 } }, "▼")
        ),
        activeCategory !== "All" && React.createElement("button", {
          className: "btn",
          onClick: function() { setActiveCategory("All"); },
          style: { fontSize: 12, color: "#999", background: "#f5f5f5", padding: "7px 12px", borderRadius: 8 }
        }, "✕ Clear")
      )
    ),
    React.createElement("div", { style: { maxWidth: 900, margin: "0 auto", padding: "0 16px 60px" } },
      React.createElement(ADBlock, { slot: "Leaderboard 728x90", h: 90 }),
      filtered.length === 0
        ? React.createElement("p", { style: { color: "#aaa", textAlign: "center", padding: 60 } }, activeCategory !== "All" ? "No articles in this category." : "No articles found.")
        : React.createElement("div", { className: "g2", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 8 } },
            filtered.map(function(a, i) {
              return React.createElement("div", { key: a.id, style: { gridColumn: i === 0 ? "1 / -1" : undefined } },
                i === 2 && React.createElement(ADBlock, { slot: "In-feed 300x250", h: 100 }),
                React.createElement("div", { className: "card", onClick: function() { setCurrent(a); setView("article"); }, style: { cursor: "pointer", display: "flex", flexDirection: i === 0 ? "row" : "column" } },
                  React.createElement("div", { style: { minHeight: i === 0 ? 210 : 150, flex: i === 0 ? "0 0 290px" : undefined, overflow: "hidden", position: "relative" } },
                    React.createElement("img", {
                      src: getImageUrl(a),
                      alt: a.title,
                      style: { width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: i === 0 ? 210 : 150 },
                      onError: function(e) { e.target.style.display = "none"; e.target.parentNode.style.background = "linear-gradient(135deg," + A + "18," + A + "38)"; }
                    })
                  ),
                  React.createElement("div", { style: { padding: 20 } },
                    React.createElement("div", { style: { display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" } }, (a.tags || []).slice(0,2).map(function(t) { return React.createElement("span", { key: t, className: "tag" }, t); })),
                    React.createElement("h2", { style: { fontFamily: F, fontSize: i === 0 ? 22 : 16, color: "#111", marginBottom: 10, lineHeight: 1.32 } }, a.title),
                    React.createElement("p", { style: { fontSize: 14, color: "#777", lineHeight: 1.7, marginBottom: 12 } }, a.excerpt),
                    React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
                      React.createElement("span", { style: { fontSize: 12, color: "#bbb" } }, a.date + " · " + a.readTime + " read"),
                      React.createElement("span", { style: { fontSize: 12, color: A, fontWeight: 500 } }, "Read more →")
                    )
                  )
                )
              );
            })
          ),
      React.createElement(Newsletter, null),
      React.createElement(ADBlock, { slot: "Footer Banner 728x90", h: 90 })
    ),
    React.createElement(Footer, null)
  );

  // ── ARTICLE ──
  if (view === "article" && current) {
    var related = articles.filter(function(a) { return a.id !== current.id; }).slice(0, 2);
    return React.createElement("div", null,
      React.createElement("style", null, css), React.createElement(Nav, null),
      React.createElement("div", { style: { maxWidth: 760, margin: "0 auto", padding: "32px 20px 60px" } },
        React.createElement("nav", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#aaa", marginBottom: 24 } },
          React.createElement("span", { onClick: function() { setView("blog"); }, style: { color: A, cursor: "pointer" } }, "Blog"),
          React.createElement("span", null, " › "),
          React.createElement("span", null, (current.tags || [])[0] || "Article")
        ),
        React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" } }, (current.tags || []).map(function(t) { return React.createElement("span", { key: t, className: "tag" }, t); })),
        React.createElement("h1", { style: { fontFamily: F, fontSize: 30, color: "#111", lineHeight: 1.28, marginBottom: 14 } }, current.title),
        React.createElement("div", { style: { marginBottom: 24 } },
          React.createElement("p", { style: { fontSize: 13, color: "#bbb", marginBottom: 14 } }, current.date + " · " + current.readTime + " read · " + current.wordCount + " words"),
          React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
            React.createElement("button", {
              className: "btn",
              onClick: function() {
                var url = window.location.href;
                navigator.clipboard.writeText(url).then(function() {
                  setCopied(true);
                  setTimeout(function() { setCopied(false); }, 2500);
                });
              },
              style: { fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 22, background: copied ? A : AL, color: copied ? "#fff" : A, border: "1.5px solid " + A + "44", display: "flex", alignItems: "center", gap: 6, transition: "all .2s" }
            }, copied ? "✅ Link Copied!" : "🔗 Copy Link"),
            React.createElement("button", {
              className: "btn",
              onClick: function() {
                var url = SITE.url + "/article/" + current.slug;
                var text = current.title + " " + url;
                window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
              },
              style: { fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 22, background: "#25D36622", color: "#25D366", border: "1.5px solid #25D36644", display: "flex", alignItems: "center", gap: 6 }
            }, "💬 WhatsApp"),
            React.createElement("button", {
              className: "btn",
              onClick: function() {
                var url = SITE.url + "/article/" + current.slug;
                window.open("https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(current.title), "_blank");
              },
              style: { fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 22, background: "#229ED922", color: "#229ED9", border: "1.5px solid #229ED944", display: "flex", alignItems: "center", gap: 6 }
            }, "✈️ Telegram"),
            React.createElement("button", {
              className: "btn",
              onClick: function() {
                var url = SITE.url + "/article/" + current.slug;
                window.open("https://pinterest.com/pin/create/button/?url=" + encodeURIComponent(url) + "&description=" + encodeURIComponent(current.title), "_blank");
              },
              style: { fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 22, background: "#E6001922", color: "#E60019", border: "1.5px solid #E6001944", display: "flex", alignItems: "center", gap: 6 }
            }, "📌 Pinterest")
          )
        ),
        React.createElement("div", { style: { borderRadius: 14, overflow: "hidden", marginBottom: 28, maxHeight: 380 } },
          React.createElement("img", {
            src: getImageUrl(current),
            alt: current.title,
            style: { width: "100%", height: 340, objectFit: "cover", display: "block" },
            onError: function(e) { e.target.parentNode.style.display = "none"; }
          })
        ),
        React.createElement(ADBlock, { slot: "Article Top 728x90", h: 90 }),
        React.createElement("div", { className: "prose" }, renderMd(current.content)),
        React.createElement("div", { className: "divider" }),
        React.createElement(ADBlock, { slot: "Article Bottom 300x250", h: 250 }),
        related.length > 0 && React.createElement("div", { style: { marginTop: 40 } },
          React.createElement("h3", { style: { fontFamily: F, fontSize: 18, marginBottom: 16 } }, "Related Articles"),
          React.createElement("div", { className: "g2", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 } },
            related.map(function(a) {
              return React.createElement("div", { key: a.id, className: "card", onClick: function() { setCurrent(a); window.scrollTo(0,0); }, style: { cursor: "pointer", padding: 16 } },
                React.createElement("div", { style: { display: "flex", gap: 5, marginBottom: 8 } }, (a.tags || []).slice(0,1).map(function(t) { return React.createElement("span", { key: t, className: "tag" }, t); })),
                React.createElement("p", { style: { fontFamily: F, fontSize: 14, fontWeight: 700, color: "#111", lineHeight: 1.35 } }, a.title)
              );
            })
          )
        ),
        React.createElement(Newsletter, null)
      ),
      React.createElement(Footer, null)
    );
  }

  // ── REVIEW DRAFT (Feature 1) ──
  if (view === "reviewDraft" && draftArticle) return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 860, margin: "0 auto", padding: "28px 20px 80px" } },
      React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 } },
        React.createElement("div", null,
          React.createElement("h1", { style: { fontFamily: F, fontSize: 22 } }, "Review & Edit Draft"),
          React.createElement("p", { style: { fontSize: 13, color: "#999", marginTop: 4 } }, "Edit your AI-generated article before publishing. All changes are saved when you click Publish.")
        )
      ),
      React.createElement("div", { style: { background: AL, border: "1px solid " + A + "33", borderRadius: 10, padding: "12px 16px", marginBottom: 20 } },
        React.createElement("p", { style: { fontSize: 13, color: A } }, "✨ AI has written this article. Review, edit anything you like, then publish.")
      ),
      React.createElement(EditorForm, {
        data: draftArticle,
        setData: setDraftArticle,
        onSave: publishDraft,
        onCancel: function() { setDraftArticle(null); setView("adminGenerate"); },
        saveLabel: "✅ Publish Article",
        showPreview: true,
      })
    )
  );

  // ── EDIT PUBLISHED ARTICLE (Feature 2) ──
  if (view === "editArticle" && editingArticle) return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 860, margin: "0 auto", padding: "28px 20px 80px" } },
      React.createElement("div", { style: { marginBottom: 24 } },
        React.createElement("h1", { style: { fontFamily: F, fontSize: 22 } }, "Edit Published Article"),
        React.createElement("p", { style: { fontSize: 13, color: "#999", marginTop: 4 } }, "Changes will go live immediately after saving.")
      ),
      React.createElement(EditorForm, {
        data: editingArticle,
        setData: setEditingArticle,
        onSave: saveEdit,
        onCancel: function() { setEditingArticle(null); setView("admin"); },
        saveLabel: "💾 Save Changes",
        showPreview: true,
      })
    )
  );

  // ── ABOUT ──
  if (view === "about") return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px" } },
      React.createElement("div", { style: { textAlign: "center", marginBottom: 48 } },
        React.createElement("div", { style: { fontSize: 56, marginBottom: 16 } }, "🌿"),
        React.createElement("h1", { style: { fontFamily: F, fontSize: 30, color: "#111", marginBottom: 14 } }, "About " + SITE.name),
        React.createElement("p", { style: { fontSize: 16, color: "#666", lineHeight: 1.8, maxWidth: 520, margin: "0 auto" } }, "We believe nature holds powerful solutions for everyday health challenges.")
      ),
      [["🔬","Science-Backed","Every remedy is researched against current scientific literature."],["❤️","Genuinely Helpful","We write for real people with real health questions."],["⚕️","Medically Responsible","Natural health complements professional care. Every article includes appropriate disclaimers."]].map(function(item) {
        return React.createElement("div", { key: item[0], style: { background: "#fff", border: "1px solid #ece9e0", borderRadius: 14, padding: "24px 22px", marginBottom: 16, display: "flex", gap: 18, alignItems: "flex-start" } },
          React.createElement("div", { style: { fontSize: 28, flexShrink: 0 } }, item[0]),
          React.createElement("div", null,
            React.createElement("h3", { style: { fontFamily: F, fontSize: 17, marginBottom: 8 } }, item[1]),
            React.createElement("p", { style: { fontSize: 14, color: "#666", lineHeight: 1.8 } }, item[2])
          )
        );
      }),
      React.createElement("div", { style: { background: AL, border: "1px solid " + A + "33", borderRadius: 14, padding: "20px 22px", marginTop: 24 } },
        React.createElement("p", { style: { fontSize: 14, color: A, fontWeight: 500 } }, "📧 Reach us at: " + SITE.email)
      )
    ),
    React.createElement(Footer, null)
  );

  // ── CONTACT ──
  if (view === "contact") return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 560, margin: "48px auto", padding: "0 20px 80px" } },
      React.createElement("h1", { style: { fontFamily: F, fontSize: 28, marginBottom: 8 } }, "Contact Us"),
      React.createElement("p", { style: { fontSize: 14, color: "#888", marginBottom: 32 } }, "Have a question or suggestion? We reply within 1-2 business days."),
      contactSent
        ? React.createElement("div", { style: { background: AL, border: "1px solid " + A + "44", borderRadius: 14, padding: "36px 24px", textAlign: "center" } },
            React.createElement("div", { style: { fontSize: 40, marginBottom: 14 } }, "✅"),
            React.createElement("h2", { style: { fontFamily: F, fontSize: 20, color: A, marginBottom: 8 } }, "Message Sent!"),
            React.createElement("p", { style: { fontSize: 14, color: "#666" } }, "We will get back to you within 1-2 business days.")
          )
        : React.createElement("div", { style: { background: "#fff", border: "1px solid #ece9e0", borderRadius: 16, padding: "28px 24px" } },
            React.createElement("label", { style: { fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 6 } }, "Full name"),
            React.createElement("input", { className: "inp", value: contact.name, onChange: function(e) { setContact(function(c) { return Object.assign({}, c, { name: e.target.value }); }); }, placeholder: "Your name", style: { marginBottom: 14 } }),
            React.createElement("label", { style: { fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 6 } }, "Email"),
            React.createElement("input", { className: "inp", type: "email", value: contact.email, onChange: function(e) { setContact(function(c) { return Object.assign({}, c, { email: e.target.value }); }); }, placeholder: "you@example.com", style: { marginBottom: 14 } }),
            React.createElement("label", { style: { fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 6 } }, "Message"),
            React.createElement("textarea", { className: "inp", value: contact.msg, onChange: function(e) { setContact(function(c) { return Object.assign({}, c, { msg: e.target.value }); }); }, placeholder: "Your question...", style: { marginBottom: 20, minHeight: 110 } }),
            React.createElement("button", { className: "btn", onClick: function() { if (contact.name && contact.email && contact.msg) setContactSent(true); }, style: { width: "100%", padding: 12, background: A, color: "#fff", borderRadius: 9, fontSize: 14, fontWeight: 600 } }, "Send Message →")
          )
    ),
    React.createElement(Footer, null)
  );

  // ── PRIVACY ──
  if (view === "privacy") return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 740, margin: "0 auto", padding: "48px 20px 80px" } },
      React.createElement("h1", { style: { fontFamily: F, fontSize: 28, marginBottom: 8 } }, "Privacy Policy"),
      React.createElement("p", { style: { fontSize: 12, color: "#aaa", marginBottom: 36 } }, "Last updated: " + new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })),
      [["1. Information We Collect","We collect info via contact form and automated data via Google Analytics and AdSense."],["2. How We Use It","To respond to inquiries and serve relevant ads. We never sell your data."],["3. Cookies","We use Google AdSense cookies. Opt out at google.com/settings/ads."],["4. Medical Disclaimer","All content is informational only. Always consult a healthcare professional."],["5. Contact","Questions? Email: " + SITE.email]].map(function(item) {
        return React.createElement("div", { key: item[0], style: { marginBottom: 28 } },
          React.createElement("h2", { style: { fontFamily: F, fontSize: 17, color: "#111", marginBottom: 10 } }, item[0]),
          React.createElement("p", { style: { fontSize: 14, color: "#555", lineHeight: 1.9 } }, item[1])
        );
      })
    ),
    React.createElement(Footer, null)
  );

  // ── ADMIN LOGIN ──
  if ((view === "admin" || view === "adminGenerate" || view === "adminManual") && !unlocked) return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 380, margin: "80px auto", padding: "0 20px" } },
      React.createElement("div", { style: { background: "#fff", border: "1px solid #ece9e0", borderRadius: 18, padding: "40px 32px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,.06)" } },
        React.createElement("div", { style: { fontSize: 40, marginBottom: 14 } }, "🔐"),
        React.createElement("h2", { style: { fontFamily: F, fontSize: 22, marginBottom: 6 } }, "Admin Access"),
        React.createElement("p", { style: { fontSize: 13, color: "#aaa", marginBottom: 24 } }, "Enter your admin password to continue."),
        React.createElement("input", { className: "inp", type: "password", placeholder: "Password", value: adminPw, onChange: function(e) { setAdminPw(e.target.value); setPwError(""); }, onKeyDown: function(e) { if (e.key === "Enter") tryUnlock(); }, style: { marginBottom: 10, textAlign: "center", letterSpacing: ".1em" } }),
        pwError && React.createElement("p", { style: { fontSize: 12, color: "#e53e3e", marginBottom: 12 } }, pwError),
        React.createElement("button", { className: "btn", onClick: tryUnlock, style: { width: "100%", padding: 12, background: A, color: "#fff", borderRadius: 9, fontSize: 14, fontWeight: 600 } }, "Sign In")
      )
    )
  );

  // ── ADMIN DASHBOARD ──
  if (view === "admin" && unlocked) return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 920, margin: "0 auto", padding: "28px 20px 80px" } },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 } },
        React.createElement("div", null,
          React.createElement("h1", { style: { fontFamily: F, fontSize: 24 } }, "Admin Dashboard"),
          React.createElement("p", { style: { fontSize: 13, color: "#999", marginTop: 3 } }, articles.length + " articles published")
        ),
        React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
          React.createElement("button", { className: "btn", onClick: function() { setUnlocked(false); }, style: { padding: "8px 16px", background: "#f5f5f5", color: "#666", borderRadius: 8, fontSize: 13 } }, "Sign out"),
          React.createElement("button", { className: "btn", onClick: generateSitemap, style: { padding: "8px 16px", background: "#f0fff4", color: "#2d6a4f", borderRadius: 8, fontWeight: 600, fontSize: 13, border: "1px solid #2d6a4f44" } }, "🗺️ Sitemap"),
          React.createElement("button", { className: "btn", onClick: function() { setView("adminManual"); }, style: { padding: "8px 16px", background: "#f0f4ff", color: "#3b5bdb", borderRadius: 8, fontWeight: 600, fontSize: 13 } }, "✍️ Write Manually"),
          React.createElement("button", { className: "btn", onClick: function() { setView("adminGenerate"); }, style: { padding: "8px 18px", background: A, color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: 14 } }, "🤖 Generate Article")
        )
      ),
      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 } },
        [["📄","Total Articles",articles.length],["📅","This Month",articles.filter(function(a) { return a.date && a.date.startsWith(new Date().toISOString().slice(0,7)); }).length],["🏷","Unique Tags",[...new Set(articles.flatMap(function(a) { return a.tags || []; }))].length]].map(function(item) {
          return React.createElement("div", { key: item[1], style: { background: "#fff", border: "1px solid #ece9e0", borderRadius: 12, padding: "18px 20px" } },
            React.createElement("p", { style: { fontSize: 24 } }, item[0]),
            React.createElement("p", { style: { fontSize: 26, fontWeight: 700, margin: "4px 0 2px", color: A } }, item[2]),
            React.createElement("p", { style: { fontSize: 12, color: "#aaa" } }, item[1])
          );
        })
      ),
      React.createElement("div", { style: { background: "#fff", border: "1px solid #ece9e0", borderRadius: 14, overflow: "hidden", marginBottom: 20 } },
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 100px 80px 130px", padding: "11px 18px", borderBottom: "1px solid #f5f5f5", fontSize: 11, color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" } },
          React.createElement("span", null, "Article"), React.createElement("span", null, "Published"), React.createElement("span", null, "Words"), React.createElement("span", null, "Actions")
        ),
        articles.map(function(a) {
          return React.createElement("div", { key: a.id, style: { display: "grid", gridTemplateColumns: "1fr 100px 80px 130px", padding: "13px 18px", borderBottom: "1px solid #fafafa", alignItems: "center" } },
            React.createElement("div", null,
              React.createElement("p", { style: { fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#111" } }, a.title),
              React.createElement("div", { style: { display: "flex", gap: 4 } }, (a.tags || []).slice(0,2).map(function(t) { return React.createElement("span", { key: t, className: "tag", style: { fontSize: 10 } }, t); }))
            ),
            React.createElement("span", { style: { fontSize: 12, color: "#aaa" } }, a.date),
            React.createElement("span", { style: { fontSize: 12, color: "#aaa" } }, a.wordCount || "~800"),
            React.createElement("div", { style: { display: "flex", gap: 4 } },
              React.createElement("button", { className: "btn", onClick: function() { setCurrent(a); setView("article"); }, style: { padding: "4px 8px", background: AL, color: A, borderRadius: 5, fontSize: 11, fontWeight: 600 } }, "View"),
              React.createElement("button", { className: "btn", onClick: function() {
                var editCopy = Object.assign({}, a, { tags: Array.isArray(a.tags) ? a.tags.join(", ") : a.tags });
                setEditingArticle(editCopy); setView("editArticle");
              }, style: { padding: "4px 8px", background: "#f0f4ff", color: "#3b5bdb", borderRadius: 5, fontSize: 11, fontWeight: 600 } }, "Edit"),
              React.createElement("button", { className: "btn", onClick: function() { if (window.confirm("Delete this article?")) deleteArticle(a.id); }, style: { padding: "4px 8px", background: "#fff0f0", color: "#e53e3e", borderRadius: 5, fontSize: 11, fontWeight: 600 } }, "Del")
            )
          );
        })
      ),
      React.createElement("div", { style: { padding: "18px 20px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12 } },
        React.createElement("p", { style: { fontSize: 14, color: "#92400e", fontWeight: 600, marginBottom: 6 } }, "💰 Google AdSense Setup"),
        React.createElement("p", { style: { fontSize: 13, color: "#a16207", lineHeight: 1.8 } }, "1. Publish 20+ articles (you have " + articles.length + " so far).\n2. Click the 🗺️ Sitemap button → upload sitemap.xml to GitHub root → submit to search.google.com/search-console.\n3. Apply to adsense.google.com.\n4. Replace AD placeholder boxes with your real AdSense tags.")
      )
    )
  );

  // ── AI GENERATE ──
  if (view === "adminGenerate" && unlocked) return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 620, margin: "40px auto", padding: "0 20px 80px" } },
      React.createElement("span", { onClick: function() { setView("admin"); }, style: { fontSize: 13, color: A, cursor: "pointer", display: "inline-block", marginBottom: 20 } }, "← Back to Dashboard"),
      React.createElement("div", { style: { background: "#fff", border: "1px solid #ece9e0", borderRadius: 18, padding: "32px 28px" } },
        React.createElement("h2", { style: { fontFamily: F, fontSize: 24, marginBottom: 6 } }, "🤖 Generate Article"),
        React.createElement("p", { style: { fontSize: 14, color: "#999", marginBottom: 28 } }, "AI researches and writes a complete article. You can edit it before publishing."),
        React.createElement("label", { style: { fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 8 } }, "Topic"),
        React.createElement("input", { className: "inp", value: topic, onChange: function(e) { setTopic(e.target.value); }, onKeyDown: function(e) { if (e.key === "Enter" && !generating) generate(); }, placeholder: "e.g. Natural remedies for better sleep", style: { marginBottom: 14, fontSize: 15 } }),
        React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 } },
          React.createElement("p", { style: { fontSize: 12, color: "#aaa" } }, topicsLoading ? "Fetching trending topics..." : "Trending topics:"),
          React.createElement("button", { className: "btn", onClick: fetchFreshTopics, disabled: topicsLoading, style: { fontSize: 11, color: A, background: AL, padding: "3px 10px", borderRadius: 20, fontWeight: 500 } }, topicsLoading ? "..." : "🔄 Refresh")
        ),
        topicsLoading
          ? React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 } }, [1,2,3,4,5,6].map(function(i) { return React.createElement("div", { key: i, className: "pulse", style: { height: 30, width: 100 + (i % 3) * 30, background: "#f0f0f0", borderRadius: 20 } }); }))
          : React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 } },
              suggestedTopics.filter(function(t) { return !usedTopics.includes(t) && t !== topic; }).map(function(t) {
                return React.createElement("button", { key: t, className: "btn", onClick: function() { setTopic(t); }, style: { padding: "5px 12px", borderRadius: 20, background: AL, color: A, fontSize: 12, fontWeight: 500 } }, t);
              })
            ),
        genLog && React.createElement("div", { style: { background: genLog.startsWith("ERROR") ? "#fff0f0" : "#f8f8f8", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, fontFamily: "monospace", color: genLog.startsWith("ERROR") ? "#e53e3e" : "#555" } },
          genLog.startsWith("ERROR") ? "❌ " + genLog.slice(6) : "⏳ " + genLog
        ),
        React.createElement("button", { className: "btn", onClick: generate, disabled: generating || !topic.trim(), style: { width: "100%", padding: 13, background: generating || !topic.trim() ? "#ccc" : A, color: "#fff", borderRadius: 10, fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" } },
          generating && React.createElement("span", { className: "spinner" }),
          generating ? "Generating your article..." : "🚀 Generate & Review"
        ),
        React.createElement("p", { style: { fontSize: 11, color: "#ccc", textAlign: "center", marginTop: 12 } }, "You will be able to edit the article before it goes live.")
      )
    )
  );

  // ── MANUAL POST (Feature 3) ──
  if (view === "adminManual" && unlocked) return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 860, margin: "40px auto", padding: "0 20px 80px" } },
      React.createElement("span", { onClick: function() { setView("admin"); }, style: { fontSize: 13, color: A, cursor: "pointer", display: "inline-block", marginBottom: 20 } }, "← Back to Dashboard"),
      React.createElement("div", { style: { marginBottom: 20 } },
        React.createElement("h2", { style: { fontFamily: F, fontSize: 24, marginBottom: 4 } }, "✍️ Write Your Own Article"),
        React.createElement("p", { style: { fontSize: 14, color: "#999" } }, "Write and publish your own article from scratch without AI generation.")
      ),
      !manualPost.title && !manualPost.content && React.createElement("div", { style: { background: "#f0f4ff", border: "1px solid #c5d0ff", borderRadius: 10, padding: "12px 16px", marginBottom: 20 } },
        React.createElement("p", { style: { fontSize: 13, color: "#3b5bdb" } }, "💡 Tip: Use ## for headings, - for bullets, *text* for italic in the content field.")
      ),
      React.createElement(EditorForm, {
        data: manualPost,
        setData: setManualPost,
        onSave: publishManual,
        onCancel: function() { setView("admin"); },
        saveLabel: "🚀 Publish Article",
        showPreview: true,
      })
    )
  );

  // ── SEARCH PAGE ──
  if (view === "search") return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 860, margin: "0 auto", padding: "40px 20px 80px" } },
      React.createElement("div", { style: { marginBottom: 28 } },
        React.createElement("h1", { style: { fontFamily: F, fontSize: 26, color: "#111", marginBottom: 8 } }, "Search Articles"),
        React.createElement("p", { style: { fontSize: 14, color: "#999" } }, articles.length + " articles available")
      ),
      React.createElement("div", { style: { position: "relative", marginBottom: 28 } },
        React.createElement("input", {
          className: "inp",
          value: searchQuery,
          onChange: function(e) { setSearchQuery(e.target.value); },
          placeholder: "Search by title, topic, or keyword...",
          autoFocus: true,
          style: { padding: "14px 48px 14px 20px", fontSize: 16, borderRadius: 14, boxShadow: "0 2px 16px rgba(0,0,0,.08)" }
        }),
        React.createElement("span", { style: { position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#ccc", pointerEvents: "none" } }, "🔍")
      ),
      searchQuery.trim() === ""
        ? React.createElement("div", null,
            React.createElement("p", { style: { fontSize: 13, color: "#aaa", marginBottom: 20 } }, "Popular topics:"),
            React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 } },
              [...new Set((articles || []).flatMap(function(a) { return a.tags || []; }))].slice(0, 12).map(function(tag) {
                return React.createElement("button", {
                  key: tag, className: "btn",
                  onClick: function() { setSearchQuery(tag); },
                  style: { padding: "6px 14px", borderRadius: 20, background: AL, color: A, fontSize: 13, fontWeight: 500 }
                }, tag);
              })
            ),
            React.createElement("p", { style: { fontSize: 14, color: "#bbb", textAlign: "center", padding: "40px 0" } }, "Start typing to search articles...")
          )
        : React.createElement("div", null,
            React.createElement("p", { style: { fontSize: 13, color: "#999", marginBottom: 16 } }, filtered.length + " results"),
            (articles || []).filter(function(a) {
              var q = searchQuery.toLowerCase();
              return a.title.toLowerCase().includes(q) || (a.tags || []).some(function(t) { return t.toLowerCase().includes(q); }) || (a.excerpt || "").toLowerCase().includes(q);
            }).length === 0
              ? React.createElement("div", { style: { textAlign: "center", padding: "60px 0" } },
                  React.createElement("div", { style: { fontSize: 48, marginBottom: 16 } }, "🔍"),
                  React.createElement("p", { style: { fontSize: 16, color: "#999", marginBottom: 8 } }, "No articles found for: " + searchQuery),
                  React.createElement("p", { style: { fontSize: 13, color: "#ccc" } }, "Try a different keyword or browse all articles")
                )
              : React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
                  (articles || []).filter(function(a) {
                    var q = searchQuery.toLowerCase();
                    return a.title.toLowerCase().includes(q) || (a.tags || []).some(function(t) { return t.toLowerCase().includes(q); }) || (a.excerpt || "").toLowerCase().includes(q);
                  }).map(function(a) {
                    return React.createElement("div", {
                      key: a.id,
                      className: "card",
                      onClick: function() { setCurrent(a); setView("article"); },
                      style: { cursor: "pointer", display: "flex", gap: 0, overflow: "hidden" }
                    },
                      React.createElement("div", { style: { width: 120, minHeight: 110, flexShrink: 0, overflow: "hidden" } },
                        React.createElement("img", {
                          src: getImageUrl(a),
                          alt: a.title,
                          style: { width: "100%", height: "100%", objectFit: "cover" },
                          onError: function(e) { e.target.parentNode.style.background = "linear-gradient(135deg," + A + "18," + A + "38)"; e.target.style.display = "none"; }
                        })
                      ),
                      React.createElement("div", { style: { padding: "14px 16px", flex: 1 } },
                        React.createElement("div", { style: { display: "flex", gap: 5, marginBottom: 6, flexWrap: "wrap" } },
                          (a.tags || []).slice(0,2).map(function(t) { return React.createElement("span", { key: t, className: "tag" }, t); })
                        ),
                        React.createElement("h3", { style: { fontFamily: F, fontSize: 15, color: "#111", marginBottom: 6, lineHeight: 1.35 } }, a.title),
                        React.createElement("p", { style: { fontSize: 13, color: "#888", lineHeight: 1.6, marginBottom: 8 } }, a.excerpt),
                        React.createElement("span", { style: { fontSize: 11, color: "#bbb" } }, a.date + " · " + a.readTime + " read")
                      )
                    );
                  })
                )
            )
    ),
    React.createElement(Footer, null)
  );

  return null;
}
