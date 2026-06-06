"""Final bbox parser using column ranges (not anchors)."""

import json
import re
from collections import Counter
from pathlib import Path
from xml.etree import ElementTree as ET

src = Path("/tmp/kora-sonar.html")
data = re.sub(r"\sxmlns=\"[^\"]+\"", "", src.read_text(encoding="utf-8"), count=1)
root = ET.fromstring(data)
pages = root.findall(".//page")

# Column x-ranges (left edges visible in the bbox file):
#   rule: 54
#   title: 152
#   severity: 250
#   file: 348 + continuation at ~411 (line number wraps right)
#   message: 446
def which_col(xmin):
    if xmin < 130:
        return "rule"
    if xmin < 240:
        return "title"
    if xmin < 340:
        return "sev"
    if xmin < 440:
        return "file"
    return "msg"

rule_re = re.compile(r"^typescript:S\d+$")
sev_re = re.compile(r"^(BLOCKER|CRITICAL|MAJOR|MINOR|INFO)$")

issues = []
for pg_idx, pg in enumerate(pages):
    words = []
    for w in pg.findall("word"):
        try:
            xmin = float(w.get("xMin"))
            ymin = float(w.get("yMin"))
        except (TypeError, ValueError):
            continue
        col = which_col(xmin)
        words.append((ymin, xmin, col, (w.text or "").strip()))
    words.sort()

    anchors = [(i, w) for i, w in enumerate(words) if w[2] == "rule" and rule_re.match(w[3])]
    for ai, (idx, anc) in enumerate(anchors):
        y_start = anc[0]
        y_end = anchors[ai + 1][1][0] if ai + 1 < len(anchors) else float("inf")
        block = {"rule": [], "title": [], "sev": [], "file": [], "msg": []}
        for w in words:
            if w[0] < y_start or w[0] >= y_end:
                continue
            block[w[2]].append((w[0], w[1], w[3]))

        rule_text = " ".join(t for _, _, t in sorted(block["rule"]))
        rm = re.search(r"typescript:S\d+", rule_text)
        if not rm:
            continue
        rule = rm.group(0)

        # File column - concatenate words sorted by y then x, no separators
        file_text = "".join(t for _, _, t in sorted(block["file"]))
        fm = re.search(r"pilot:([A-Za-z0-9_./\-]+)\(line\s*(\d+)\s*\)", file_text)
        if not fm:
            continue
        filepath = fm.group(1)
        line_no = int(fm.group(2))

        title = " ".join(t for _, _, t in sorted(block["title"])).strip()
        sev_words = [t for _, _, t in sorted(block["sev"])]
        severity = next((t for t in sev_words if sev_re.match(t)), "UNKNOWN")
        message = " ".join(t for _, _, t in sorted(block["msg"])).strip()

        issues.append({
            "rule": rule,
            "title": title,
            "severity": severity,
            "file": filepath,
            "line": line_no,
            "message": message,
        })

dst = Path("/tmp/kora-sonar-issues.jsonl")
dst.write_text("\n".join(json.dumps(o, ensure_ascii=False) for o in issues), encoding="utf-8")
print(f"Parsed {len(issues)} issues -> {dst}")

sev = Counter(o["severity"] for o in issues)
print("\nSeverity:")
for s, c in sev.most_common():
    print(f"  {c:4d}  {s}")

files = Counter(o["file"] for o in issues)
rules = Counter(o["rule"] for o in issues)
print(f"\nUnique files: {len(files)}    Unique rules: {len(rules)}")
print("\nTop 25 files:")
for f, c in files.most_common(25):
    print(f"  {c:4d}  {f}")
print("\nAll rules:")
title_by_rule = {}
for o in issues:
    title_by_rule.setdefault(o["rule"], o["title"])
for r, c in rules.most_common():
    print(f"  {c:4d}  {r}  {title_by_rule.get(r,'')[:70]}")
