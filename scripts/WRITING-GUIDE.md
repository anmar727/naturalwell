# NaturalWell article writing guide

This is the standard every new article must meet before it is published. It exists to keep
NaturalWell clear of Google's "low-value content" and "scaled content abuse" problems: each
article must be genuinely useful, accurate, original and safe.

## 1. Pick the topic

- One specific remedy or question per article ("Fennel tea for bloating", not "10 herbs for everything").
- Not already covered: check every file in `content/` and the live sitemap
  (https://www.naturalwellblog.com/sitemap.xml). No near-duplicates (e.g. "ginger tea for nausea"
  when "ginger for nausea" exists). A genuinely different angle is fine.
- Real search interest: something people actually ask about (use web search to confirm).
- Balance the topics: favour whichever category in `shared/site.js` currently has the fewest articles.
- Avoid topics where home treatment could be dangerous to recommend at all (chest pain, cancer
  treatment, stopping prescribed medicines, children's fevers under 3 months, eating disorders,
  mental health crises). Stick to everyday, low-risk remedies.

## 2. Research before writing

- Read at least 3 real sources with web search/fetch, starting with health authorities:
  NIH Office of Dietary Supplements (ods.od.nih.gov), NCCIH (nccih.nih.gov), MedlinePlus, NHS,
  NICE, WHO, CDC, Cochrane reviews, professional bodies (AAD, ACOG...).
- Every factual claim (doses, effect sizes, study findings, safety warnings) must come from
  something you actually read in this session. Never cite from memory.
- Decide the evidence rating honestly:
  - strong: consistent good-quality trials or reviews
  - moderate: some good trials, mixed or modest results
  - limited: small or early studies only
  - weak: little or no reliable evidence for the popular claim

## 3. Write

File: `content/<slug>.md`, slug lowercase-hyphenated, under 70 characters.

Front matter (all required):

```
---
title: Under 70 characters, plain and specific
excerpt: 60-200 characters, says what the reader learns
category: one of sleep-and-stress, digestive-health, immunity-and-colds, heart-and-metabolism, everyday-wellness
evidence_level: strong | moderate | limited | weak
evidence_summary: One sentence explaining the rating
tags: three, lowercase, tags
date: YYYY-MM-DD (today, Muscat time)
published_at: full ISO timestamp, e.g. 2026-10-13T07:00:00Z
status: published
---
```

Body, 1,100 to 1,500 words, plain international English, in this order of `##` sections:

1. Quick answer
2. What the research says (name the actual studies/reviews and what they found)
3. How to use it (or How people use it / How to take it): practical, specific, with amounts only
   where a source gives them
4. Possible side effects and interactions
5. Who should avoid it (or Who should be careful)
6. When to see a doctor: specific red-flag symptoms
7. Frequently asked questions: at least 3 `###` questions real people ask
8. References: 3 to 6 `- ` items, at least one linking to a health authority, all verified

Include exactly one `> ` safety note. A dental angle (teeth, enamel, mouth) is welcome where it
is genuinely relevant, written in the third person ("dentists recommend...").

## 4. Never

- Claim a remedy cures, treats or prevents a disease unless a health authority says so.
- Suggest stopping or replacing prescribed medicine.
- Invent personal experience, patient stories, quotes or statistics. No "I", "my patients", "as a dentist".
- Cite a source you did not open, or invent authors, journals, years or URLs.
- Copy sentences from sources. Paraphrase, and quote no more than a few words.
- Use hype: "miracle", "guaranteed", "detox", "burns fat", clickbait titles.

## 5. Check before publishing

1. Run `python3 scripts/check-article.py content/<slug>.md`; it must print `RESULT: PASS`.
2. Open every reference URL the checker lists and confirm it loads and supports the claim.
3. Re-read the article once as an editor: is every number and claim backed by a source you read?
   Is the evidence rating honest? Is anything unsafe? Fix or cut anything doubtful.
4. If an article cannot pass, do not publish it. Publishing one good article is better than two weak ones.
