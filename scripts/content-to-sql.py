"""Turn content/*.md into SQL UPDATE statements for the articles table.
Usage: python3 scripts/content-to-sql.py content/*.md > out.sql"""
import re, sys

def parse(path):
    raw = open(path, encoding="utf-8").read()
    _, fm, body = raw.split("---", 2)
    meta = {}
    for line in fm.strip().splitlines():
        k, v = line.split(":", 1)
        meta[k.strip()] = v.strip()
    meta["slug"] = path.rsplit("/", 1)[-1][:-3]
    meta["content"] = body.strip() + "\n"
    return meta

def q(s):
    tag = "$nw$"
    assert tag not in s
    return tag + s + tag

for p in sys.argv[1:]:
    m = parse(p)
    words = len(re.findall(r"\w+", m["content"]))
    print(
        "update articles set "
        f"title={q(m['title'])}, excerpt={q(m['excerpt'])}, content={q(m['content'])}, "
        f"tags={q(m['tags'])}, category={q(m['category'])}, evidence_level={q(m['evidence_level'])}, "
        f"evidence_summary={q(m['evidence_summary'])}, word_count={words}, read_time='{max(1, round(words/220))} min', "
        f"updated_at=now() where slug={q(m['slug'])};"
    )
