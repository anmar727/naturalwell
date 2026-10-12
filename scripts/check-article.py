#!/usr/bin/env python3
"""Quality gate for NaturalWell articles. An article must pass before it is published.

Usage: python3 scripts/check-article.py content/<slug>.md [more files...]
Exit code 0 = all passed. Prints every problem found, plus the reference URLs
that must be opened and verified by hand (or with a web fetch) before publishing.
"""
import re
import sys
from pathlib import Path

CATEGORIES = {"sleep-and-stress", "digestive-health", "immunity-and-colds", "heart-and-metabolism", "everyday-wellness"}
LEVELS = {"strong", "moderate", "limited", "weak"}
REQUIRED_SECTIONS = [
    r"quick answer",
    r"what the research says",
    r"(how to use|how people use|how to take|how to do|practical steps)",
    r"(side effects|safety)",
    r"who should (avoid|be careful)",
    r"when to see a doctor",
    r"frequently asked questions",
    r"references",
]
TRUSTED = ("nih.gov", "nhs.uk", "who.int", "cdc.gov", "nice.org.uk", "medlineplus.gov", "cochrane", "efsa.europa.eu",
           "fda.gov", "aad.org", "acog.org", "mayoclinic.org", "nutritionsource.hsph.harvard.edu", "usda.gov", "ema.europa.eu")
NEGATION = re.compile(r"\b(not|no|never|isn't|doesn't|does not|won't|cannot|can't|myth|claim|claims|marketed|promoted|without evidence|unproven)\b", re.I)
# Flagged only when the sentence does NOT also contain a negation (e.g. "does not cure" is fine).
SENTENCE_RULES = [
    (r"\bcures?\b", "claims a cure"),
    (r"(?<![\"\u201c])\bdetox(es|ify|ifies)?\b(?![\"\u201d])", "detox claim"),
    (r"\b(burns?|melts?) (belly )?fat\b", "fat-burning claim"),
]
BANNED = [
    (r"\bmiracle\b", "hype word 'miracle'"),
    (r"\bguaranteed?\b", "guarantee"),
    (r"\b(in my (practice|experience|clinic)|I have seen|I recommend|my patients|as a dentist,? I)\b", "invented first-person experience"),
]


def check(path):
    problems = []
    raw = Path(path).read_text(encoding="utf-8")
    if not raw.startswith("---"):
        return ["missing front matter"], []
    _, fm, body = raw.split("---", 2)
    meta = {}
    for line in fm.strip().splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()

    slug = Path(path).stem
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", slug) or len(slug) > 70:
        problems.append("file name must be a short lowercase-hyphenated slug")
    for field in ["title", "excerpt", "category", "evidence_level", "evidence_summary", "tags", "date", "published_at", "status"]:
        if not meta.get(field):
            problems.append(f"front matter missing '{field}'")
    if len(meta.get("title", "")) > 70:
        problems.append("title longer than 70 characters")
    if not (60 <= len(meta.get("excerpt", "")) <= 200):
        problems.append("excerpt should be 60-200 characters")
    if meta.get("category") not in CATEGORIES:
        problems.append("category must be one of " + ", ".join(sorted(CATEGORIES)))
    if meta.get("evidence_level") not in LEVELS:
        problems.append("evidence_level must be strong, moderate, limited or weak")
    if len([t for t in meta.get("tags", "").split(",") if t.strip()]) < 3:
        problems.append("needs at least 3 tags")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", meta.get("date", "")):
        problems.append("date must be YYYY-MM-DD")
    if meta.get("status") not in ("published", "draft"):
        problems.append("status must be published or draft")

    words = len(re.findall(r"\w+", body))
    if words < 1000:
        problems.append(f"too short: {words} words (minimum 1,000)")
    if words > 1900:
        problems.append(f"too long: {words} words (maximum 1,900)")

    h2 = [h.strip().lower() for h in re.findall(r"^## (.+)$", body, re.M)]
    for pattern in REQUIRED_SECTIONS:
        if not any(re.search(pattern, h) for h in h2):
            problems.append(f"missing a '## {pattern}' section")
    faq = body.lower().split("## frequently asked questions", 1)
    if len(faq) == 2 and len(re.findall(r"^### ", faq[1], re.M)) < 3:
        problems.append("FAQ needs at least 3 '###' questions")
    if not re.search(r"^> ", body, re.M):
        problems.append("needs one '> ' safety note")

    refs_part = re.split(r"^## references\s*$", body, flags=re.M | re.I)
    refs = re.findall(r"^- (.+)$", refs_part[1], re.M) if len(refs_part) == 2 else []
    if len(refs) < 3:
        problems.append("needs at least 3 references")
    urls = re.findall(r"https?://[^\s)]+", "\n".join(refs))
    if refs and not any(any(t in u for t in TRUSTED) for u in urls):
        problems.append("at least one reference must link to a health authority (NIH, NHS, WHO, CDC, NICE, Cochrane...)")

    text_only = re.sub(r"^## references[\s\S]*", "", body, flags=re.M | re.I)
    for pattern, why in BANNED:
        m = re.search(pattern, text_only, re.I | re.M)
        if m:
            problems.append(f"{why}: '{m.group(0).strip()}'")
    for sentence in re.split(r"(?<=[.!?])\s+|\n+", text_only):
        if sentence.startswith("#"):
            continue
        for pattern, why in SENTENCE_RULES:
            if re.search(pattern, sentence, re.I) and not NEGATION.search(sentence):
                problems.append(f"{why}: '{sentence.strip()[:90]}'")

    return problems, urls


def main():
    files = sys.argv[1:]
    existing = {p.stem for p in Path("content").glob("*.md")}
    ok = True
    for f in files:
        problems, urls = check(f)
        print(f"\n== {f}")
        if problems:
            ok = False
            for p in problems:
                print("  FAIL:", p)
        else:
            print("  PASS: structure and content rules")
        if urls:
            print("  VERIFY these reference links open and support the claims:")
            for u in urls:
                print("   ", u)
    print("\nRESULT:", "PASS" if ok else "FAIL")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
