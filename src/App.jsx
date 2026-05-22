import React, { useState, useEffect } from "react";

const SITE = {
  name: "NaturalWell",
  tagline: "Home Remedies & Natural Health",
  email: "anmar727@gmail.com",
  url: "https://naturalwell-p7e8.vercel.app",
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
  { id: "1", slug: "natural-headache-remedies", title: "12 Natural Remedies for Headaches That Actually Work", excerpt: "Discover effective, science-backed home remedies to relieve headache pain without medication — from ginger tea to acupressure.", content: "## Why Natural Remedies Work for Headaches\n\nHeadaches affect billions of people worldwide. While medications provide fast relief, natural approaches can address the root cause and reduce frequency over time.\n\n## 1. Stay Hydrated\nDehydration is one of the most overlooked causes of headaches. Drink a full glass of water immediately when a headache starts and aim for 8-10 glasses daily.\n\n## 2. Ginger Tea\nGinger contains powerful anti-inflammatory compounds. Brew fresh ginger slices in hot water for 10 minutes. Research suggests it can be as effective as sumatriptan for migraines.\n\n## 3. Peppermint Oil\nApply diluted peppermint essential oil to your temples. The menthol relaxes muscles and improves blood flow, making it particularly effective for tension headaches.\n\n## 4. Cold or Warm Compress\nFor tension headaches, apply a warm compress to the neck. For migraines, a cold pack on the forehead helps constrict dilated blood vessels.\n\n## 5. Magnesium\nStudies show magnesium deficiency is common in migraine sufferers. Taking 400-500mg daily may reduce headache frequency by up to 41%.\n\n## 6. Lavender Oil\nInhaling lavender oil for 15 minutes has been shown in clinical studies to significantly reduce migraine pain and associated nausea.\n\n## 7. Acupressure\nPress the LI-4 pressure point firmly for 5 minutes. This traditional technique has solid evidence for tension headache relief.\n\n## 8. Rest in a Dark Room\nLight and sound sensitivity are common during headaches. Rest in a cool, dark, quiet room and allow your nervous system to reset.\n\n## 9. Consistent Sleep\nIrregular sleep patterns are a major headache trigger. Aim for 7-9 hours at consistent times each night.\n\n## 10. Feverfew Herb\nThis herb has been used for centuries for migraines. Clinical trials support taking 50-100mg of dried feverfew leaf daily as prevention.\n\n## 11. Manage Stress\nChronic stress is the leading cause of tension headaches. Even 10 minutes of deep breathing daily can dramatically reduce frequency.\n\n## 12. Caffeine in Moderation\nSmall amounts of caffeine can enhance pain relief. However, overuse causes rebound headaches, so limit to one cup.\n\n## Conclusion\n\nThese remedies work best as part of a consistent healthy lifestyle. Keep a headache diary to identify your personal triggers.\n\n*Disclaimer: This article is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional for persistent or severe headaches.*", tags: ["headache", "natural remedies", "wellness"], readTime: "6 min", date: "2025-05-20", wordCount: 820 },
  { id: "2", slug: "gut-health-herbs", title: "7 Best Herbs for Gut Health and Better Digestion", excerpt: "Support your digestive system naturally with these powerful, evidence-backed herbs that soothe inflammation and restore gut balance.", content: "## The Gut-Health Connection\n\nYour gut is home to trillions of bacteria that influence everything from immunity to mood. The right herbs can dramatically improve digestion.\n\n## 1. Ginger Root\nGinger accelerates gastric emptying and reduces nausea, bloating, and indigestion. Drink as tea after meals or add fresh ginger to cooking daily.\n\n## 2. Peppermint\nPeppermint oil relaxes the smooth muscles of the intestinal tract. It is particularly effective for IBS symptoms, reducing cramping, diarrhea, and bloating.\n\n## 3. Slippery Elm\nThis herb creates a protective, soothing layer on the gut lining. Excellent for leaky gut syndrome, acid reflux, and inflammatory bowel conditions.\n\n## 4. Chamomile\nChamomile reduces intestinal inflammation and calms the nervous system through the gut-brain axis.\n\n## 5. Fennel Seeds\nChewing fennel seeds after meals reduces gas production and relaxes intestinal muscles.\n\n## 6. Licorice Root (DGL)\nSoothes the stomach lining and increases production of protective mucus, excellent for gastritis prevention.\n\n## 7. Turmeric\nCurcumin is one of the most powerful gut anti-inflammatories. Always combine with black pepper to increase absorption by 2000%.\n\n## How to Get Started\n\nBegin with one or two herbs in tea form. Steep 1-2 teaspoons in hot water for 10-15 minutes after meals. Give any herb at least 2-4 weeks before evaluating results.\n\n*Disclaimer: Consult a healthcare provider before starting herbal supplements, especially if you take medications or have existing health conditions.*", tags: ["gut health", "digestion", "herbs"], readTime: "5 min", date: "2025-05-18", wordCount: 640 },
  { id: "3", slug: "boost-immunity-naturally", title: "10 Proven Ways to Boost Your Immune System Naturally", excerpt: "Strengthen your body's natural defenses with these science-backed lifestyle changes and natural remedies.", content: "## Understanding Immunity\n\nYour immune system is your body's defense network. The goal is to support its optimal function through consistent healthy habits.\n\n## 1. Prioritize Quality Sleep\nDuring sleep, your body produces cytokines that fight infection. Adults need 7-9 hours. Even one night of poor sleep reduces immune cell activity by up to 70%.\n\n## 2. Vitamin C Rich Foods\nVitamin C supports white blood cell production. Focus on bell peppers, citrus fruits, strawberries, and broccoli.\n\n## 3. Zinc Rich Foods\nZinc is essential for immune cell development. Pumpkin seeds, chickpeas, cashews, and lean meats are excellent sources.\n\n## 4. Regular Moderate Exercise\nExercise improves circulation of immune cells. Aim for 150 minutes of moderate activity weekly.\n\n## 5. Manage Chronic Stress\nCortisol from chronic stress suppresses immune function. Practice daily stress reduction: meditation, deep breathing, or yoga.\n\n## 6. Elderberry\nElderberry has strong antiviral properties and may reduce cold and flu duration by up to 4 days.\n\n## 7. Probiotics and Gut Health\n70% of your immune system lives in your gut. Eat fermented foods daily: yogurt, kefir, sauerkraut, or kimchi.\n\n## 8. Vitamin D\nVitamin D deficiency is associated with increased infection risk. Get 15-20 minutes of sunlight daily or supplement with 1000-2000 IU.\n\n## 9. Stay Hydrated\nWater helps produce lymph, which carries white blood cells through your immune system.\n\n## 10. Limit Sugar\nHigh sugar intake suppresses white blood cell activity for several hours after consumption.\n\n*Disclaimer: These suggestions support general wellness and do not prevent or treat any specific disease. Consult your healthcare provider for personalized advice.*", tags: ["immunity", "wellness", "natural health"], readTime: "7 min", date: "2025-05-15", wordCount: 760 },
];

const callAPI = async function(payload) {
  var res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  var text = await res.text();
  if (!text || !text.trim()) throw new Error("Empty response from server. Check ANTHROPIC_API_KEY in Vercel settings.");
  var data = JSON.parse(text);
  if (data.error) throw new Error(typeof data.error === "string" ? data.error : (data.error.message || JSON.stringify(data.error)));
  return data;
};

const ADBlock = function(props) {
  return React.createElement("div", {
    style: { display: "block", margin: "20px 0", textAlign: "center", minHeight: props.h || 90 }
  },
    React.createElement("ins", {
      className: "adsbygoogle",
      style: { display: "block" },
      "data-ad-client": "ca-pub-6071901244409132",
      "data-ad-slot": props.slot,
      "data-ad-format": "auto",
      "data-full-width-responsive": "true"
    }),
    React.createElement("script", {
      dangerouslySetInnerHTML: {
        __html: "(adsbygoogle = window.adsbygoogle || []).push({});"
      }
    })
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

  useEffect(function() {
    try {
      var stored = localStorage.getItem("nw_v2_articles");
      var parsed = stored ? JSON.parse(stored) : [];
      if (parsed.length) setArticles(parsed);
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
      document.title = "About — NaturalWell";
    } else if (view === "contact") {
      window.history.pushState({}, "", "/contact");
      document.title = "Contact — NaturalWell";
    } else if (view === "privacy") {
      window.history.pushState({}, "", "/privacy");
      document.title = "Privacy Policy — NaturalWell";
    }
  }, [view, current]);
  useEffect(function() {
    var path = window.location.pathname;
    if (path.startsWith("/article/")) {
      var slug = path.replace("/article/", "");
      var found = articles.find(function(a) { return a.slug === slug; });
      if (found) { setCurrent(found); setView("article"); }
    } else if (path === "/about") {
      setView("about");
    } else if (path === "/contact") {
      setView("contact");
    } else if (path === "/privacy") {
      setView("privacy");
    }
  }, [articles]);
  useEffect(function() {
    if (view === "generate") fetchFreshTopics();
  }, [view]);

  function persist(list) {
    try { localStorage.setItem("nw_v2_articles", JSON.stringify(list)); } catch(e) {}
  }

  function tryUnlock() {
    if (adminPw === SITE.adminPassword) {
      setUnlocked(true); setPwError("");
    } else {
      setPwError("Incorrect password. Please try again."); setAdminPw("");
    }
  }

  async function fetchFreshTopics() {
    setTopicsLoading(true);
    try {
      var data = await callAPI({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: "Search for the latest trending natural health, home remedies, and wellness topics in the news right now in 2025. Return ONLY a raw JSON array of exactly 10 short blog topic strings under 8 words each. No explanations, no markdown, no extra text. Example: [\"Topic one\",\"Topic two\"]" }],
      });
      var textBlock = (data.content || []).find(function(b) { return b.type === "text"; });
      if (textBlock) {
        var clean = textBlock.text.replace(/```json|```/g, "").trim();
        var start = clean.indexOf("[");
        var end = clean.lastIndexOf("]");
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
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        messages: [{ role: "user", content: "Find the most important facts, statistics, and practical tips about: " + topic + " for a natural health blog. Be specific and include any recent research." }],
      });
      var research = (resData.content || []).filter(function(b) { return b.type === "text"; }).map(function(b) { return b.text; }).join("\n");
      setGenLog("Writing your article...");
      var sysPrompt = "You are an expert natural health blogger and SEO writer. Write a complete, engaging blog post. Return ONLY a raw JSON object with no markdown fences and no text before or after it. Required fields: title (compelling SEO title under 60 chars), excerpt (engaging summary under 155 chars), content (800-1000 word markdown article with ## H2 subheadings, numbered lists where appropriate, and a final paragraph starting with *Disclaimer:), tags (array of exactly 3 relevant strings), readTime (e.g. 6 min), wordCount (number). Make the content genuinely helpful and specific.";
      var writeData = await callAPI({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4000,
        system: sysPrompt,
        messages: [{ role: "user", content: "Write a complete blog post about: " + topic + "\n\nResearch to incorporate:\n" + research }],
      });
      var rawBlock = (writeData.content || []).find(function(b) { return b.type === "text"; });
      if (!rawBlock) throw new Error("No content returned. Please try again.");
      var clean = rawBlock.text.replace(/```json/g, "").replace(/```/g, "").trim();
      var startIdx = clean.indexOf("{");
      var endIdx = clean.lastIndexOf("}");
      if (startIdx === -1 || endIdx === -1) throw new Error("Invalid response format. Please try again.");
      var post = JSON.parse(clean.slice(startIdx, endIdx + 1));
      var article = {
        id: Date.now().toString(),
        slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60),
        title: post.title, excerpt: post.excerpt, content: post.content,
        tags: post.tags || [], readTime: post.readTime || "5 min",
        wordCount: post.wordCount || 800, date: new Date().toISOString().slice(0, 10),
      };
      var updated = [article].concat(articles);
      setArticles(updated); persist(updated);
      setUsedTopics(function(prev) { return prev.concat([topic]); });
      setSuggestedTopics(function(prev) { return prev.filter(function(t) { return t !== topic; }); });
      setGenLog("SUCCESS:" + post.title);
      setTopic("");
    } catch(e) { setGenLog("ERROR:" + e.message); }
    setGenerating(false);
  }

  function deleteArticle(id) {
    var updated = articles.filter(function(a) { return a.id !== id; });
    setArticles(updated); persist(updated);
  }

  var filtered = (articles || []).filter(function(a) {
    if (!search) return true;
    var q = search.toLowerCase();
    return a.title.toLowerCase().includes(q) || (a.tags || []).some(function(t) { return t.toLowerCase().includes(q); });
  });

  var A = SITE.accent; var AL = SITE.accentLight; var AD = SITE.accentDark;
  var F = SITE.font; var S = SITE.sans;

  var css = "@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap');" +
    "*{box-sizing:border-box;margin:0;padding:0}" +
    "body{font-family:" + S + ";background:#f8f7f4;color:#1a1a1a;-webkit-font-smoothing:antialiased}" +
    ".btn{cursor:pointer;border:none;font-family:" + S + ";transition:all .15s}.btn:hover{opacity:.88}" +
    ".inp{width:100%;padding:11px 14px;border:1.5px solid #e5e5e5;border-radius:9px;font-size:14px;font-family:" + S + ";outline:none;background:#fff;transition:border .2s}" +
    ".inp:focus{border-color:" + A + ";box-shadow:0 0 0 3px " + AL + "}" +
    "textarea.inp{resize:vertical;min-height:110px}" +
    ".tag{display:inline-block;font-size:11px;padding:3px 10px;border-radius:20px;background:" + AL + ";color:" + A + ";font-weight:600;letter-spacing:.02em}" +
    ".card{background:#fff;border:1px solid #ece9e0;border-radius:14px;overflow:hidden;transition:box-shadow .2s,transform .2s}" +
    ".card:hover{box-shadow:0 8px 24px rgba(0,0,0,.08);transform:translateY(-2px)}" +
    ".prose h2{font-family:" + F + ";font-size:22px;margin:32px 0 12px;color:#111;line-height:1.3}" +
    ".prose h3{font-size:17px;font-weight:600;margin:22px 0 8px;color:#222}" +
    ".prose p{margin-bottom:16px;font-size:16px;line-height:1.9;color:#333}" +
    ".prose ul,.prose ol{padding-left:24px;margin-bottom:16px}" +
    ".prose li{font-size:16px;line-height:1.85;margin-bottom:6px;color:#333}" +
    ".prose em{color:#888;font-style:italic;font-size:14px}" +
    ".divider{height:1px;background:linear-gradient(90deg,transparent," + A + "44,transparent);margin:32px 0}" +
    "@media(max-width:700px){.g2{grid-template-columns:1fr!important}.hide-m{display:none!important}.nav-links{gap:2px!important}}" +
    "@keyframes spin{to{transform:rotate(360deg)}}" +
    ".spinner{width:18px;height:18px;border:2px solid #fff4;border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;vertical-align:middle;margin-right:8px}" +
    "@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}" +
    ".pulse{animation:pulse 1.5s ease-in-out infinite}";

  function Nav() {
    return React.createElement("nav", { style: { background: "rgba(255,255,255,.97)", backdropFilter: "blur(10px)", borderBottom: "1px solid #ece9e0", padding: "0 24px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,.04)" } },
      React.createElement("div", { onClick: function() { setView("blog"); }, style: { cursor: "pointer", display: "flex", alignItems: "center", gap: 9 } },
        React.createElement("span", { style: { fontSize: 24 } }, "🌿"),
        React.createElement("div", null,
          React.createElement("div", { style: { fontFamily: F, fontSize: 18, fontWeight: 700, color: A, lineHeight: 1 } }, SITE.name),
          React.createElement("div", { className: "hide-m", style: { fontSize: 11, color: "#aaa", marginTop: 1 } }, SITE.tagline)
        )
      ),
      React.createElement("div", { style: { display: "flex", gap: 4 }, className: "nav-links" },
        [["blog","Blog"],["about","About"],["contact","Contact"],["privacy","Privacy"]].map(function(item) {
          return React.createElement("button", { key: item[0], className: "btn", onClick: function() { setView(item[0]); }, style: { padding: "6px 13px", borderRadius: 22, fontSize: 13, fontWeight: 500, background: view === item[0] ? AL : "transparent", color: view === item[0] ? A : "#666", border: view === item[0] ? "1px solid " + A + "33" : "1px solid transparent" } }, item[1]);
        }),
        React.createElement("button", { className: "btn", onClick: function() { setView("admin"); }, style: { padding: "6px 13px", borderRadius: 22, fontSize: 13, background: "transparent", color: "#bbb", border: "1px solid transparent" } }, "⚙")
      )
    );
  }

  function Newsletter() {
    return React.createElement("div", { style: { background: "linear-gradient(135deg," + A + "," + AD + ")", borderRadius: 16, padding: "32px 28px", margin: "40px 0", color: "#fff", textAlign: "center" } },
      React.createElement("div", { style: { fontSize: 32, marginBottom: 10 } }, "💌"),
      React.createElement("h3", { style: { fontFamily: F, fontSize: 20, marginBottom: 8 } }, "Get Weekly Health Tips"),
      React.createElement("p", { style: { fontSize: 14, opacity: .85, marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" } }, "Join readers getting natural health tips delivered every week."),
      newsletterDone
        ? React.createElement("div", { style: { background: "rgba(255,255,255,.2)", borderRadius: 10, padding: "12px 20px", fontSize: 14 } }, "✅ You are subscribed! Welcome to NaturalWell.")
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
            React.createElement("p", { style: { fontSize: 13, lineHeight: 1.8, maxWidth: 280 } }, "Science-backed natural health information to help you live better. For educational purposes only."),
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

  if (view === "blog") return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { background: "linear-gradient(135deg," + A + "08," + A + "14)", borderBottom: "1px solid " + A + "22", padding: "48px 20px", textAlign: "center" } },
      React.createElement("p", { style: { fontSize: 12, color: A, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 } }, "Natural Health & Wellness"),
      React.createElement("h1", { style: { fontFamily: F, fontSize: 34, color: "#111", marginBottom: 14, lineHeight: 1.25 } }, "Home Remedies That Actually Work"),
      React.createElement("p", { style: { fontSize: 16, color: "#666", maxWidth: 500, margin: "0 auto 24px" } }, "Science-backed natural health tips to help you feel better every day."),
      React.createElement("input", { className: "inp", value: search, onChange: function(e) { setSearch(e.target.value); }, placeholder: "Search articles...", style: { maxWidth: 380, margin: "0 auto", display: "block", borderRadius: 30, padding: "12px 20px", boxShadow: "0 2px 12px rgba(0,0,0,.08)" } })
    ),
    React.createElement("div", { style: { maxWidth: 900, margin: "0 auto", padding: "0 16px 60px" } },
      React.createElement(ADBlock, { slot: "Leaderboard 728x90", h: 90 }),
      filtered.length === 0
        ? React.createElement("p", { style: { color: "#aaa", textAlign: "center", padding: 60, fontSize: 15 } }, "No articles found for \"" + search + "\"")
        : React.createElement("div", { className: "g2", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 8 } },
            filtered.map(function(a, i) {
              return React.createElement("div", { key: a.id, style: { gridColumn: i === 0 ? "1 / -1" : undefined } },
                i === 2 && React.createElement(ADBlock, { slot: "In-feed 300x250", h: 100 }),
                React.createElement("div", { className: "card", onClick: function() { setCurrent(a); setView("article"); }, style: { cursor: "pointer", display: "flex", flexDirection: i === 0 ? "row" : "column" } },
                  React.createElement("div", { style: { background: "linear-gradient(135deg," + A + "18," + A + "38)", minHeight: i === 0 ? 210 : 130, flex: i === 0 ? "0 0 290px" : undefined, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 } }, "🌿"),
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

  if (view === "article" && current) {
    var related = articles.filter(function(a) { return a.id !== current.id; }).slice(0, 2);
    return React.createElement("div", null,
      React.createElement("style", null, css), React.createElement(Nav, null),
      React.createElement("div", { style: { maxWidth: 760, margin: "0 auto", padding: "32px 20px 60px" } },
        React.createElement("nav", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#aaa", marginBottom: 24 } },
          React.createElement("span", { onClick: function() { setView("blog"); }, style: { color: A, cursor: "pointer" } }, "Blog"),
          React.createElement("span", null, " › "),
          React.createElement("span", { style: { color: "#999" } }, (current.tags || [])[0] || "Article")
        ),
        React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" } }, (current.tags || []).map(function(t) { return React.createElement("span", { key: t, className: "tag" }, t); })),
        React.createElement("h1", { style: { fontFamily: F, fontSize: 30, color: "#111", lineHeight: 1.28, marginBottom: 14 } }, current.title),
        React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 10 } },
          React.createElement("p", { style: { fontSize: 13, color: "#bbb" } }, current.date + " · " + current.readTime + " read · " + current.wordCount + " words"),
          React.createElement("button", { className: "btn", onClick: function() { shareArticle(current); }, style: { fontSize: 13, color: A, background: AL, border: "1px solid " + A + "33", padding: "6px 14px", borderRadius: 20, fontWeight: 500 } }, "Share 🔗")
        ),
        React.createElement(ADBlock, { slot: "Article Top 728x90", h: 90 }),
        React.createElement("div", { className: "prose" }, renderMd(current.content)),
        React.createElement("div", { className: "divider" }),
        React.createElement(ADBlock, { slot: "Article Bottom 300x250", h: 250 }),
        related.length > 0 && React.createElement("div", { style: { marginTop: 40 } },
          React.createElement("h3", { style: { fontFamily: F, fontSize: 18, marginBottom: 16, color: "#111" } }, "Related Articles"),
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

  if (view === "about") return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px" } },
      React.createElement("div", { style: { textAlign: "center", marginBottom: 48 } },
        React.createElement("div", { style: { fontSize: 56, marginBottom: 16 } }, "🌿"),
        React.createElement("h1", { style: { fontFamily: F, fontSize: 30, color: "#111", marginBottom: 14 } }, "About " + SITE.name),
        React.createElement("p", { style: { fontSize: 16, color: "#666", lineHeight: 1.8, maxWidth: 520, margin: "0 auto" } }, "We believe nature holds powerful solutions for everyday health challenges. Our mission is to make evidence-informed natural health knowledge accessible to everyone.")
      ),
      [["🔬","Science-Backed","Every remedy and tip we share is researched against current scientific literature. We clearly distinguish between strong evidence, traditional use, and emerging research."],["❤️","Genuinely Helpful","We write for real people with real health questions. Our goal is information you can actually use in your daily life."],["⚕️","Medically Responsible","Natural health is complementary to professional medical care, never a replacement. Every article includes appropriate disclaimers."]].map(function(item) {
        return React.createElement("div", { key: item[0], style: { background: "#fff", border: "1px solid #ece9e0", borderRadius: 14, padding: "24px 22px", marginBottom: 16, display: "flex", gap: 18, alignItems: "flex-start" } },
          React.createElement("div", { style: { fontSize: 28, flexShrink: 0 } }, item[0]),
          React.createElement("div", null,
            React.createElement("h3", { style: { fontFamily: F, fontSize: 17, marginBottom: 8, color: "#111" } }, item[1]),
            React.createElement("p", { style: { fontSize: 14, color: "#666", lineHeight: 1.8 } }, item[2])
          )
        );
      }),
      React.createElement("div", { style: { background: AL, border: "1px solid " + A + "33", borderRadius: 14, padding: "20px 22px", marginTop: 24 } },
        React.createElement("p", { style: { fontSize: 14, color: A, fontWeight: 500 } }, "📧 Questions? Reach us at: " + SITE.email)
      )
    ),
    React.createElement(Footer, null)
  );

  if (view === "contact") return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 560, margin: "48px auto", padding: "0 20px 80px" } },
      React.createElement("h1", { style: { fontFamily: F, fontSize: 28, marginBottom: 8 } }, "Contact Us"),
      React.createElement("p", { style: { fontSize: 14, color: "#888", marginBottom: 32, lineHeight: 1.7 } }, "Have a question, suggestion, or topic request? We read every message and typically reply within 1-2 business days."),
      contactSent
        ? React.createElement("div", { style: { background: AL, border: "1px solid " + A + "44", borderRadius: 14, padding: "36px 24px", textAlign: "center" } },
            React.createElement("div", { style: { fontSize: 40, marginBottom: 14 } }, "✅"),
            React.createElement("h2", { style: { fontFamily: F, fontSize: 20, color: A, marginBottom: 8 } }, "Message Sent!"),
            React.createElement("p", { style: { fontSize: 14, color: "#666", marginBottom: 20 } }, "Thank you for reaching out. We will get back to you within 1-2 business days."),
            React.createElement("button", { className: "btn", onClick: function() { setContactSent(false); setContact({ name: "", email: "", msg: "" }); }, style: { padding: "9px 20px", background: A, color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: 13 } }, "Send another message")
          )
        : React.createElement("div", { style: { background: "#fff", border: "1px solid #ece9e0", borderRadius: 16, padding: "28px 24px" } },
            React.createElement("label", { style: { fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 6 } }, "Full name"),
            React.createElement("input", { className: "inp", value: contact.name, onChange: function(e) { setContact(function(c) { return Object.assign({}, c, { name: e.target.value }); }); }, placeholder: "Your name", style: { marginBottom: 16 } }),
            React.createElement("label", { style: { fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 6 } }, "Email address"),
            React.createElement("input", { className: "inp", type: "email", value: contact.email, onChange: function(e) { setContact(function(c) { return Object.assign({}, c, { email: e.target.value }); }); }, placeholder: "you@example.com", style: { marginBottom: 16 } }),
            React.createElement("label", { style: { fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 6 } }, "Message"),
            React.createElement("textarea", { className: "inp", value: contact.msg, onChange: function(e) { setContact(function(c) { return Object.assign({}, c, { msg: e.target.value }); }); }, placeholder: "Your question or suggestion...", style: { marginBottom: 20 } }),
            React.createElement("button", { className: "btn", onClick: function() { if (contact.name && contact.email && contact.msg) setContactSent(true); }, style: { width: "100%", padding: 12, background: contact.name && contact.email && contact.msg ? A : "#ccc", color: "#fff", borderRadius: 9, fontSize: 14, fontWeight: 600 } }, "Send Message →")
          )
    ),
    React.createElement(Footer, null)
  );

  if (view === "privacy") return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 740, margin: "0 auto", padding: "48px 20px 80px" } },
      React.createElement("h1", { style: { fontFamily: F, fontSize: 28, marginBottom: 8 } }, "Privacy Policy"),
      React.createElement("p", { style: { fontSize: 12, color: "#aaa", marginBottom: 36 } }, "Last updated: " + new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })),
      [["1. Information We Collect","We collect information you provide when contacting us (name, email). We also collect visit data through Google Analytics and Google AdSense including browser type and pages visited."],["2. How We Use It","We use contact info to respond to inquiries. Analytics data helps improve our content. Google AdSense uses data to serve relevant ads. We never sell your personal data."],["3. Google AdSense & Cookies","This site uses Google AdSense. Google uses cookies to serve ads based on your prior visits. Opt out at google.com/settings/ads."],["4. Medical Disclaimer","All content on " + SITE.name + " is for informational purposes only. It does not constitute medical advice. Always consult a qualified healthcare professional."],["5. Your Rights","You may request access to or deletion of your data by contacting us at " + SITE.email + "."],["6. Contact","For privacy questions: " + SITE.email]].map(function(item) {
        return React.createElement("div", { key: item[0], style: { marginBottom: 28 } },
          React.createElement("h2", { style: { fontFamily: F, fontSize: 17, color: "#111", marginBottom: 10 } }, item[0]),
          React.createElement("p", { style: { fontSize: 14, color: "#555", lineHeight: 1.9 } }, item[1])
        );
      })
    ),
    React.createElement(Footer, null)
  );

  if (view === "admin" && !unlocked) return React.createElement("div", null,
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

  if (view === "admin" && unlocked) return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 920, margin: "0 auto", padding: "28px 20px 80px" } },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 } },
        React.createElement("div", null,
          React.createElement("h1", { style: { fontFamily: F, fontSize: 24 } }, "Admin Dashboard"),
          React.createElement("p", { style: { fontSize: 13, color: "#999", marginTop: 3 } }, articles.length + " articles published")
        ),
        React.createElement("div", { style: { display: "flex", gap: 8 } },
          React.createElement("button", { className: "btn", onClick: function() { setUnlocked(false); }, style: { padding: "8px 16px", background: "#f5f5f5", color: "#666", borderRadius: 8, fontSize: 13 } }, "Sign out"),
          React.createElement("button", { className: "btn", onClick: function() { setView("generate"); }, style: { padding: "8px 18px", background: A, color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: 14 } }, "+ Generate Article")
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
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 100px 80px 110px", padding: "11px 18px", borderBottom: "1px solid #f5f5f5", fontSize: 11, color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" } },
          React.createElement("span", null, "Article"), React.createElement("span", null, "Published"), React.createElement("span", null, "Words"), React.createElement("span", null, "Actions")
        ),
        articles.map(function(a) {
          return React.createElement("div", { key: a.id, style: { display: "grid", gridTemplateColumns: "1fr 100px 80px 110px", padding: "13px 18px", borderBottom: "1px solid #fafafa", alignItems: "center" } },
            React.createElement("div", null,
              React.createElement("p", { style: { fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#111" } }, a.title),
              React.createElement("div", { style: { display: "flex", gap: 4 } }, (a.tags || []).slice(0,2).map(function(t) { return React.createElement("span", { key: t, className: "tag", style: { fontSize: 10 } }, t); }))
            ),
            React.createElement("span", { style: { fontSize: 12, color: "#aaa" } }, a.date),
            React.createElement("span", { style: { fontSize: 12, color: "#aaa" } }, a.wordCount || "~800"),
            React.createElement("div", { style: { display: "flex", gap: 5 } },
              React.createElement("button", { className: "btn", onClick: function() { setCurrent(a); setView("article"); }, style: { padding: "5px 10px", background: AL, color: A, borderRadius: 6, fontSize: 11, fontWeight: 600 } }, "View"),
              React.createElement("button", { className: "btn", onClick: function() { if (window.confirm("Delete this article?")) deleteArticle(a.id); }, style: { padding: "5px 10px", background: "#fff0f0", color: "#e53e3e", borderRadius: 6, fontSize: 11, fontWeight: 600 } }, "Delete")
            )
          );
        })
      ),
      React.createElement("div", { style: { padding: "18px 20px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12 } },
        React.createElement("p", { style: { fontSize: 14, color: "#92400e", fontWeight: 600, marginBottom: 6 } }, "💰 Google AdSense Setup"),
        React.createElement("p", { style: { fontSize: 13, color: "#a16207", lineHeight: 1.8 } }, "1. Publish 20+ articles (you have " + articles.length + " so far).\n2. Buy a custom domain at namecheap.com (~$10/year).\n3. Apply at adsense.google.com.\n4. Replace the AD placeholder boxes in App.jsx with your real AdSense tags.")
      )
    )
  );

  if (view === "generate") return React.createElement("div", null,
    React.createElement("style", null, css), React.createElement(Nav, null),
    React.createElement("div", { style: { maxWidth: 620, margin: "40px auto", padding: "0 20px 80px" } },
      React.createElement("span", { onClick: function() { setView("admin"); }, style: { fontSize: 13, color: A, cursor: "pointer", display: "inline-block", marginBottom: 20 } }, "← Back to Dashboard"),
      React.createElement("div", { style: { background: "#fff", border: "1px solid #ece9e0", borderRadius: 18, padding: "32px 28px", boxShadow: "0 4px 20px rgba(0,0,0,.04)" } },
        React.createElement("h2", { style: { fontFamily: F, fontSize: 24, marginBottom: 6 } }, "Generate & Publish Article"),
        React.createElement("p", { style: { fontSize: 14, color: "#999", marginBottom: 28, lineHeight: 1.6 } }, "AI researches the latest news and writes a complete SEO-optimized article for your blog."),
        React.createElement("label", { style: { fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 8 } }, "Article Topic"),
        React.createElement("input", { className: "inp", value: topic, onChange: function(e) { setTopic(e.target.value); }, onKeyDown: function(e) { if (e.key === "Enter" && !generating) generate(); }, placeholder: "e.g. Natural remedies for better sleep", style: { marginBottom: 14, fontSize: 15 } }),
        React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 } },
          React.createElement("p", { style: { fontSize: 12, color: "#aaa" } }, topicsLoading ? "Fetching trending topics from the news..." : "Trending topics right now:"),
          React.createElement("button", { className: "btn", onClick: fetchFreshTopics, disabled: topicsLoading, style: { fontSize: 11, color: A, background: AL, padding: "3px 10px", borderRadius: 20, fontWeight: 500 } }, topicsLoading ? "..." : "🔄 Refresh")
        ),
        topicsLoading
          ? React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 } },
              [1,2,3,4,5,6].map(function(i) {
                return React.createElement("div", { key: i, className: "pulse", style: { height: 30, width: 120 + (i % 3) * 30, background: "#f0f0f0", borderRadius: 20 } });
              })
            )
          : React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 } },
              suggestedTopics.filter(function(t) { return !usedTopics.includes(t) && t !== topic; }).map(function(t) {
                return React.createElement("button", { key: t, className: "btn", onClick: function() { setTopic(t); }, style: { padding: "5px 12px", borderRadius: 20, background: AL, color: A, fontSize: 12, fontWeight: 500 } }, t);
              })
            ),
        genLog && React.createElement("div", {
          style: { background: genLog.startsWith("SUCCESS") ? AL : genLog.startsWith("ERROR") ? "#fff0f0" : "#f8f8f8", border: "1px solid " + (genLog.startsWith("SUCCESS") ? A + "44" : genLog.startsWith("ERROR") ? "#fca5a5" : "#eee"), borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, fontFamily: "monospace", color: genLog.startsWith("SUCCESS") ? A : genLog.startsWith("ERROR") ? "#e53e3e" : "#555" }
        }, genLog.startsWith("SUCCESS") ? "✅ Published: " + genLog.slice(8) : genLog.startsWith("ERROR") ? "❌ " + genLog.slice(6) : "⏳ " + genLog),
        React.createElement("button", { className: "btn", onClick: generate, disabled: generating || !topic.trim(), style: { width: "100%", padding: 13, background: generating || !topic.trim() ? "#ccc" : A, color: "#fff", borderRadius: 10, fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" } },
          generating && React.createElement("span", { className: "spinner" }),
          generating ? "Generating your article..." : "🚀 Generate & Publish Now"
        ),
        React.createElement("p", { style: { fontSize: 11, color: "#ccc", textAlign: "center", marginTop: 12 } }, "Generation takes 20-40 seconds. Do not refresh the page.")
      )
    )
  );

  return null;
}
