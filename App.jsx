import React, { useState, useEffect } from "react";

const SITE = {
  name: "NaturalWell",
  tagline: "Home Remedies & Natural Health",
  email: "hello@naturalwell.com",
  accent: "#2d6a4f",
  accentLight: "#e8f5ee",
  font: "'Merriweather', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
};

const AD = ({ slot, h = 90 }) => (
  <div style={{ background: "repeating-linear-gradient(45deg,#f0f0f0,#f0f0f0 2px,#fafafa 2px,#fafafa 12px)", border: "1px dashed #ccc", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#bbb", fontSize: 11, height: h, margin: "16px 0" }}>
    <span>Google AdSense — {slot}</span>
    <span style={{ fontSize: 10, marginTop: 2 }}>Replace with your AdSense code</span>
  </div>
);

const SAMPLE = [
  { id: "1", slug: "natural-headache-remedies", title: "12 Natural Remedies for Headaches That Actually Work", excerpt: "Discover effective, science-backed home remedies to relieve headache pain without medication.", content: "## Why Natural Remedies Work\n\nHeadaches affect billions worldwide. Natural approaches address root causes rather than masking symptoms.\n\n## 1. Stay Hydrated\nDehydration is the most common cause. Drink a full glass of water immediately when a headache starts.\n\n## 2. Ginger Tea\nGinger contains powerful anti-inflammatory compounds as effective as sumatriptan for migraines in some studies.\n\n## 3. Peppermint Oil\nApply diluted peppermint oil to your temples. Menthol relaxes muscles and increases blood flow.\n\n## 4. Magnesium\nMagnesium deficiency is common in headache sufferers. 400-500mg daily can reduce frequency by up to 41%.\n\n## Conclusion\nKeep a headache diary to track your personal triggers and identify which remedies work best for you.\n\n*Disclaimer: This is for informational purposes only. Consult a healthcare professional for medical advice.*", tags: ["headache", "natural remedies"], readTime: "6 min", date: "2025-05-20", wordCount: 820 },
  { id: "2", slug: "gut-health-herbs", title: "7 Best Herbs for Gut Health and Better Digestion", excerpt: "Support your digestive system with these evidence-backed herbs that soothe inflammation.", content: "## The Gut Health Connection\n\nYour gut hosts trillions of bacteria affecting immunity, mood, and energy.\n\n## 1. Ginger Root\nAccelerates gastric emptying and reduces nausea, bloating, and indigestion effectively.\n\n## 2. Peppermint\nRelaxes intestinal smooth muscles. Particularly effective for IBS, cramping, and bloating.\n\n## 3. Turmeric\nCurcumin powerfully reduces gut inflammation. Combine with black pepper for better absorption.\n\n## Conclusion\nStart with herbal teas steeped 10-15 minutes. Notice improvements within 2-4 weeks.\n\n*Disclaimer: Consult a healthcare provider before starting herbal supplements.*", tags: ["gut health", "digestion"], readTime: "5 min", date: "2025-05-18", wordCount: 640 },
];

const callAPI = async (payload) => {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!text || !text.trim()) throw new Error("Empty response — check ANTHROPIC_API_KEY in Vercel");
  try { return JSON.parse(text); }
  catch { throw new Error("Server error: " + text.slice(0, 200)); }
};

export default function Blog() {
  const [view, setView] = useState("blog");
  const [articles, setArticles] = useState([]);
  const [current, setCurrent] = useState(null);
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genLog, setGenLog] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [adminPw, setAdminPw] = useState("");
  const [search, setSearch] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", msg: "" });
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nw_articles");
      const parsed = stored ? JSON.parse(stored) : [];
      setArticles(parsed.length ? parsed : SAMPLE);
    } catch { setArticles(SAMPLE); }
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  const persist = (list) => {
    try { localStorage.setItem("nw_articles", JSON.stringify(list)); } catch {}
  };

  const generate = async () => {
    if (!topic.trim() || generating) return;
    setGenerating(true);
    setGenLog("Searching the web for research...");
    try {
      const resData = await callAPI({
        model: "claude-sonnet-4-6", max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: `Research key facts and tips about: "${topic}" for a natural health blog.` }],
      });
      if (resData.error) throw new Error(JSON.stringify(resData.error));
      const research = (resData.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
      setGenLog("Writing full article...");
      const writeData = await callAPI({
        model: "claude-sonnet-4-6", max_tokens: 1000,
        system: `You are an expert SEO health blogger. Return ONLY a raw JSON object, no markdown fences. Fields: {"title":"under 60 chars","excerpt":"under 150 chars","content":"700-900 word markdown article with ## headings, end with *Disclaimer: paragraph","tags":["tag1","tag2","tag3"],"readTime":"X min","wordCount":number}`,
        messages: [{ role: "user", content: `Topic: "${topic}"\nResearch:\n${research}` }],
      });
      if (writeData.error) throw new Error(JSON.stringify(writeData.error));
      const raw = (writeData.content || []).find(b => b.type === "text")?.text || "{}";
      const post = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const article = { ...post, id: Date.now().toString(), slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60), date: new Date().toISOString().slice(0, 10) };
      const updated = [article, ...articles];
      setArticles(updated); persist(updated);
      setGenLog("Published: " + post.title);
      setTopic("");
      setTimeout(() => { setGenLog(""); setView("admin"); }, 2000);
    } catch (e) { setGenLog("Error: " + e.message); }
    setGenerating(false);
  };

  const deleteArticle = (id) => {
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated); persist(updated);
  };

  const filtered = articles.filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.tags?.some(t => t.includes(search.toLowerCase())));

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700&family=DM+Sans:wght@400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:${SITE.sans};background:#fafaf8;color:#1a1a1a}
    .btn{cursor:pointer;border:none;font-family:${SITE.sans}}
    .prose h2{font-family:${SITE.font};font-size:21px;margin:28px 0 10px;color:#111}
    .prose h3{font-size:16px;font-weight:600;margin:20px 0 8px}
    .prose p{margin-bottom:14px;font-size:15px;line-height:1.9;color:#333}
    .prose ul,.prose ol{padding-left:22px;margin-bottom:14px}
    .prose li{font-size:15px;line-height:1.85;margin-bottom:4px;color:#333}
    .prose em{color:#888;font-style:italic;font-size:13px}
    .inp{width:100%;padding:10px 14px;border:1px solid #e0e0e0;border-radius:8px;font-size:14px;font-family:${SITE.sans};outline:none;background:#fff}
    .inp:focus{border-color:${SITE.accent}}
    textarea.inp{resize:vertical;min-height:100px}
    .tag{display:inline-block;font-size:11px;padding:2px 9px;border-radius:20px;background:${SITE.accentLight};color:${SITE.accent};font-weight:500}
    .card{background:#fff;border:1px solid #eee;border-radius:12px;overflow:hidden}
    @media(max-width:640px){.g2{grid-template-columns:1fr!important}}
  `;

  const Nav = () => (
    <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 20px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
      <div onClick={() => setView("blog")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>🌿</span>
        <span style={{ fontFamily: SITE.font, fontSize: 17, fontWeight: 700, color: SITE.accent }}>{SITE.name}</span>
      </div>
      <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {[["blog","Blog"],["about","About"],["contact","Contact"],["privacy","Privacy"]].map(([v,l]) => (
          <button key={v} className="btn" onClick={() => setView(v)} style={{ padding: "5px 11px", borderRadius: 20, fontSize: 13, fontWeight: 500, background: view===v ? SITE.accentLight : "transparent", color: view===v ? SITE.accent : "#666" }}>{l}</button>
        ))}
        <button className="btn" onClick={() => setView("admin")} style={{ padding: "5px 11px", borderRadius: 20, fontSize: 13, background: "transparent", color: "#aaa" }}>⚙</button>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer style={{ background: "#1a1a1a", color: "#aaa", padding: "28px 20px", marginTop: 48 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontFamily: SITE.font, fontSize: 15, color: "#fff", marginBottom: 5 }}>🌿 {SITE.name}</p>
          <p style={{ fontSize: 12, maxWidth: 240 }}>Natural health info for educational purposes. Always consult a healthcare professional.</p>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[["blog","Blog"],["about","About"],["contact","Contact"],["privacy","Privacy"]].map(([v,l]) => (
            <p key={v} onClick={() => setView(v)} style={{ fontSize: 13, cursor: "pointer" }}>{l}</p>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: "16px auto 0", borderTop: "1px solid #333", paddingTop: 14, fontSize: 11, color: "#555" }}>
        © {new Date().getFullYear()} {SITE.name}. For informational purposes only. Not medical advice.
      </div>
    </footer>
  );

  const renderMd = (md = "") => md.split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={i}>{line.slice(4)}</h3>;
    if (line.match(/^\d+\. /)) return <li key={i} style={{ listStyleType: "decimal" }}>{line.replace(/^\d+\. /, "")}</li>;
    if (line.startsWith("- ")) return <li key={i}>{line.slice(2)}</li>;
    if (line.startsWith("*")) return <p key={i}><em>{line.replace(/\*/g, "")}</em></p>;
    if (line.trim()) return <p key={i}>{line}</p>;
    return null;
  });

  if (view === "blog") return (
    <div><style>{css}</style><Nav />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
        <AD slot="Leaderboard 728x90" h={90} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0 16px", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: SITE.font, fontSize: 22 }}>Latest Articles</h1>
          <input className="inp" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ width: 180, padding: "7px 14px", borderRadius: 20 }} />
        </div>
        {filtered.length === 0 && <p style={{ color: "#aaa", textAlign: "center", padding: 40 }}>No articles found.</p>}
        <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {filtered.map((a, i) => (
            <div key={a.id} style={{ gridColumn: i === 0 ? "1 / -1" : undefined }}>
              {i === 2 && <AD slot="In-feed 300x250" h={100} />}
              <div className="card" onClick={() => { setCurrent(a); setView("article"); }} style={{ cursor: "pointer", display: "flex", flexDirection: i === 0 ? "row" : "column" }}>
                <div style={{ background: `linear-gradient(135deg,${SITE.accent}20,${SITE.accent}40)`, minHeight: i===0?190:120, flex: i===0?"0 0 270px":undefined, display:"flex", alignItems:"center", justifyContent:"center", fontSize: 44 }}>🌿</div>
                <div style={{ padding: 16 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 7, flexWrap: "wrap" }}>{a.tags?.slice(0,2).map(t=><span key={t} className="tag">{t}</span>)}</div>
                  <h2 style={{ fontFamily: SITE.font, fontSize: i===0?19:15, color: "#111", marginBottom: 7, lineHeight: 1.35 }}>{a.title}</h2>
                  <p style={{ fontSize: 13, color: "#777", lineHeight: 1.65, marginBottom: 8 }}>{a.excerpt}</p>
                  <span style={{ fontSize: 11, color: "#bbb" }}>{a.date} · {a.readTime} read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <AD slot="Footer Banner 728x90" h={90} />
      </div>
      <Footer />
    </div>
  );

  if (view === "article" && current) return (
    <div><style>{css}</style><Nav />
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "24px 16px 48px" }}>
        <span onClick={() => setView("blog")} style={{ fontSize: 13, color: SITE.accent, cursor: "pointer" }}>← All articles</span>
        <div style={{ display: "flex", gap: 5, margin: "12px 0 10px", flexWrap: "wrap" }}>{current.tags?.map(t=><span key={t} className="tag">{t}</span>)}</div>
        <h1 style={{ fontFamily: SITE.font, fontSize: 27, color: "#111", lineHeight: 1.3, marginBottom: 10 }}>{current.title}</h1>
        <p style={{ fontSize: 12, color: "#bbb", marginBottom: 20 }}>{current.date} · {current.readTime} read · {current.wordCount} words</p>
        <AD slot="Article Top 728x90" h={90} />
        <div className="prose">{renderMd(current.content)}</div>
        <AD slot="Article Bottom 300x250" h={200} />
      </div>
      <Footer />
    </div>
  );

  if (view === "about") return (
    <div><style>{css}</style><Nav />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 16px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🌿</div>
          <h1 style={{ fontFamily: SITE.font, fontSize: 26, color: "#111", marginBottom: 10 }}>About {SITE.name}</h1>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>We believe in the power of nature to support health. Our mission is to share accessible, research-informed natural health information.</p>
        </div>
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "24px 22px" }}>
          <h2 style={{ fontFamily: SITE.font, fontSize: 17, marginBottom: 10 }}>Our Approach</h2>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8 }}>Every article is researched using current scientific literature. We never recommend replacing professional medical care — our content is educational only. Always consult a qualified healthcare professional.</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (view === "contact") return (
    <div><style>{css}</style><Nav />
      <div style={{ maxWidth: 540, margin: "40px auto", padding: "0 16px 60px" }}>
        <h1 style={{ fontFamily: SITE.font, fontSize: 24, marginBottom: 6 }}>Contact Us</h1>
        <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Have a question? We'd love to hear from you.</p>
        {contactSent ? (
          <div style={{ background: SITE.accentLight, border: `1px solid ${SITE.accent}44`, borderRadius: 12, padding: "28px 22px", textAlign: "center" }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>✅</div>
            <p style={{ fontFamily: SITE.font, fontSize: 17, color: SITE.accent, marginBottom: 6 }}>Message received!</p>
            <p style={{ fontSize: 13, color: "#666" }}>We typically respond within 1–2 business days.</p>
          </div>
        ) : (
          <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "26px 22px" }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 5 }}>Your name</label>
            <input className="inp" value={contact.name} onChange={e=>setContact(c=>({...c,name:e.target.value}))} placeholder="Jane Smith" style={{ marginBottom: 12 }} />
            <label style={{ fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 5 }}>Email</label>
            <input className="inp" type="email" value={contact.email} onChange={e=>setContact(c=>({...c,email:e.target.value}))} placeholder="jane@example.com" style={{ marginBottom: 12 }} />
            <label style={{ fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 5 }}>Message</label>
            <textarea className="inp" value={contact.msg} onChange={e=>setContact(c=>({...c,msg:e.target.value}))} placeholder="Your question or feedback…" style={{ marginBottom: 16 }} />
            <button className="btn" onClick={()=>{if(contact.name&&contact.email&&contact.msg)setContactSent(true)}} style={{ width:"100%", padding:11, background:SITE.accent, color:"#fff", borderRadius:8, fontSize:14, fontWeight:600 }}>Send message</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );

  if (view === "privacy") return (
    <div><style>{css}</style><Nav />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 16px 60px" }}>
        <h1 style={{ fontFamily: SITE.font, fontSize: 24, marginBottom: 6 }}>Privacy Policy</h1>
        <p style={{ fontSize: 12, color: "#aaa", marginBottom: 24 }}>Last updated: {new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</p>
        {[
          ["1. Information We Collect","We collect info you provide via contact form (name, email) and automated data via Google Analytics and AdSense including IP addresses and pages visited."],
          ["2. How We Use It","To respond to inquiries, improve content, and serve ads via Google AdSense. We never sell your data."],
          ["3. Google AdSense & Cookies","We use Google AdSense which uses cookies for personalized ads. Opt out at google.com/settings/ads."],
          ["4. Medical Disclaimer","All content is informational only — not medical advice. Always consult a qualified healthcare professional."],
          ["5. Contact",`Questions? Email: ${SITE.email}`],
        ].map(([h,b])=>(
          <div key={h} style={{ marginBottom: 22 }}>
            <h2 style={{ fontFamily: SITE.font, fontSize: 16, color: "#111", marginBottom: 7 }}>{h}</h2>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.85 }}>{b}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );

  if (view === "admin" && !unlocked) return (
    <div><style>{css}</style><Nav />
      <div style={{ maxWidth: 360, margin: "80px auto", padding: "0 16px" }}>
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "34px 26px", textAlign: "center" }}>
          <div style={{ fontSize: 34, marginBottom: 10 }}>🔐</div>
          <h2 style={{ fontFamily: SITE.font, fontSize: 19, marginBottom: 18 }}>Admin Panel</h2>
          <input className="inp" type="password" placeholder="Enter password" value={adminPw} onChange={e=>setAdminPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setUnlocked(true)} style={{ marginBottom: 10 }} />
          <button className="btn" onClick={()=>setUnlocked(true)} style={{ width:"100%", padding:10, background:SITE.accent, color:"#fff", borderRadius:8, fontSize:14, fontWeight:600 }}>Enter</button>
          <p style={{ fontSize: 11, color: "#ccc", marginTop: 10 }}>Any password works in demo</p>
        </div>
      </div>
    </div>
  );

  if (view === "admin" && unlocked) return (
    <div><style>{css}</style><Nav />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "22px 16px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontFamily: SITE.font, fontSize: 21 }}>Admin Dashboard</h1>
            <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{articles.length} articles published</p>
          </div>
          <button className="btn" onClick={()=>setView("generate")} style={{ padding:"8px 18px", background:SITE.accent, color:"#fff", borderRadius:8, fontWeight:600, fontSize:14 }}>+ Generate Article</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
          {[["📄","Total",articles.length],["📅","This Month",articles.filter(a=>a.date?.startsWith(new Date().toISOString().slice(0,7))).length],["🏷","Tags",[...new Set(articles.flatMap(a=>a.tags||[]))].length]].map(([icon,label,val])=>(
            <div key={label} style={{ background:"#fff", border:"1px solid #eee", borderRadius:10, padding:"14px 16px" }}>
              <p style={{ fontSize:20 }}>{icon}</p>
              <p style={{ fontSize:22, fontWeight:600, margin:"3px 0 1px" }}>{val}</p>
              <p style={{ fontSize:11, color:"#aaa" }}>{label}</p>
            </div>
          ))}
        </div>
        <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:10, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 90px 80px 100px", padding:"9px 14px", borderBottom:"1px solid #f0f0f0", fontSize:11, color:"#aaa", fontWeight:600, textTransform:"uppercase", letterSpacing:".06em" }}>
            <span>Title</span><span>Date</span><span>Words</span><span>Actions</span>
          </div>
          {articles.map(a=>(
            <div key={a.id} style={{ display:"grid", gridTemplateColumns:"1fr 90px 80px 100px", padding:"11px 14px", borderBottom:"1px solid #f7f7f7", alignItems:"center" }}>
              <div>
                <p style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>{a.title}</p>
                <div style={{ display:"flex", gap:3 }}>{a.tags?.slice(0,2).map(t=><span key={t} className="tag" style={{ fontSize:10 }}>{t}</span>)}</div>
              </div>
              <span style={{ fontSize:12, color:"#aaa" }}>{a.date}</span>
              <span style={{ fontSize:12, color:"#aaa" }}>{a.wordCount||"~800"}</span>
              <div style={{ display:"flex", gap:4 }}>
                <button className="btn" onClick={()=>{setCurrent(a);setView("article")}} style={{ padding:"4px 8px", background:SITE.accentLight, color:SITE.accent, borderRadius:5, fontSize:11 }}>View</button>
                <button className="btn" onClick={()=>deleteArticle(a.id)} style={{ padding:"4px 8px", background:"#fff0f0", color:"#e53e3e", borderRadius:5, fontSize:11 }}>Del</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:16, padding:"12px 14px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:9 }}>
          <p style={{ fontSize:13, color:"#92400e", fontWeight:500, marginBottom:3 }}>💰 AdSense Setup</p>
          <p style={{ fontSize:12, color:"#a16207", lineHeight:1.7 }}>1. Publish 20+ articles first.<br/>2. Apply at adsense.google.com.<br/>3. Once approved, replace the dashed AD boxes in App.jsx with your real AdSense script tags.</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (view === "generate") return (
    <div><style>{css}</style><Nav />
      <div style={{ maxWidth: 580, margin: "36px auto", padding: "0 16px 60px" }}>
        <span onClick={()=>setView("admin")} style={{ fontSize:13, color:SITE.accent, cursor:"pointer" }}>← Admin</span>
        <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:14, padding:"28px 24px", marginTop:14 }}>
          <h2 style={{ fontFamily:SITE.font, fontSize:21, marginBottom:5 }}>Generate & Publish Article</h2>
          <p style={{ fontSize:13, color:"#999", marginBottom:20 }}>AI searches the web → writes 800+ words → publishes instantly.</p>
          <label style={{ fontSize:12, fontWeight:600, color:"#666", textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:5 }}>Topic</label>
          <input className="inp" value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&generate()} placeholder="e.g. Natural remedies for better sleep" style={{ marginBottom:9 }} />
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:16 }}>
            {["Better sleep naturally","Boost immunity","Anxiety relief","Apple cider vinegar","Anti-inflammatory foods"].map(t=>(
              <button key={t} className="btn" onClick={()=>setTopic(t)} style={{ padding:"4px 10px", borderRadius:20, background:SITE.accentLight, color:SITE.accent, fontSize:12 }}>{t}</button>
            ))}
          </div>
          {genLog && (
            <div style={{ background:"#f8f8f8", borderRadius:7, padding:"9px 12px", marginBottom:12, fontSize:13, fontFamily:"monospace", color: genLog.startsWith("Published") ? SITE.accent : genLog.startsWith("Error") ? "#e53e3e" : "#555" }}>
              {genLog.startsWith("Published") ? "✅ " : genLog.startsWith("Error") ? "❌ " : "⏳ "}{genLog}
            </div>
          )}
          <button className="btn" onClick={generate} disabled={generating||!topic.trim()} style={{ width:"100%", padding:11, background:generating?"#ccc":SITE.accent, color:"#fff", borderRadius:8, fontSize:14, fontWeight:600 }}>
            {generating ? "Generating & publishing…" : "🚀 Generate & Publish Now"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );

  return null;
}
