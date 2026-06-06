"""Applique les fixes mécaniques de Wave 1 (S7773 + S7764 + S7748 + S7772 + S7781 + S7759).

Pour chaque issue, on ouvre le fichier, on cible la LIGNE indiquée par Sonar
et on applique la transformation. Les remplacements globaux sont volontairement
évités pour ne pas modifier du code hors périmètre.
"""

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

REPO = Path("/Users/aminemohamed/Desktop/APP/kora")
ISSUES = REPO / "docs/audit/sonar/sonar-issues.jsonl"

WAVE1_RULES = {
    "typescript:S7773",
    "typescript:S7764",
    "typescript:S7748",
    "typescript:S7772",
    "typescript:S7781",
    "typescript:S7759",
}

issues = [
    json.loads(l) for l in ISSUES.read_text().splitlines() if l
]
wave1 = [i for i in issues if i["rule"] in WAVE1_RULES]

# Group by file
by_file = defaultdict(list)
for i in wave1:
    by_file[i["file"]].append(i)


def fix_S7773(line: str) -> tuple[str, bool]:
    """Prefer Number.X over global parseInt / parseFloat / isNaN / isFinite / NaN."""
    total = 0
    line, n = re.subn(r"(?<![.\w])parseInt\(", "Number.parseInt(", line)
    total += n
    line, n = re.subn(r"(?<![.\w])parseFloat\(", "Number.parseFloat(", line)
    total += n
    line, n = re.subn(r"(?<![.\w])isNaN\(", "Number.isNaN(", line)
    total += n
    line, n = re.subn(r"(?<![.\w])isFinite\(", "Number.isFinite(", line)
    total += n
    # NaN and Infinity used as identifiers
    line, n = re.subn(r"(?<![.\w])NaN(?!\w)", "Number.NaN", line)
    total += n
    line, n = re.subn(r"(?<![.\w-])Infinity(?!\w)", "Number.POSITIVE_INFINITY", line)
    total += n
    return line, total > 0


def fix_S7764(line: str) -> tuple[str, bool]:
    """window / self / global -> globalThis (browser/test contexts).

    Remplace `window` (standalone) ou `(window as ...)`. Conserve les imports
    d'objets nommés `window`. On évite aussi `windowName` ou `myWindow`.
    """
    total = 0
    line, n = re.subn(r"(?<![.\w])window(?!\w)", "globalThis", line)
    total += n
    # `global.X` (Node/test env) -> `globalThis.X`
    line, n = re.subn(r"(?<![.\w])global(?=\.\w)", "globalThis", line)
    total += n
    # standalone `global =` or `global,` -> `globalThis`
    line, n = re.subn(r"(?<![.\w])global(?![.\w])", "globalThis", line)
    total += n
    return line, total > 0


def fix_S7748(line: str) -> tuple[str, bool]:
    """Remove unnecessary trailing zeros / decimal points (e.g. 1.0 -> 1)."""
    # Conservative: replace `\b\d+\.0+\b` with `\d+`
    new_line, n = re.subn(r"(?<![\d.])(\d+)\.0+(?![\d.])", r"\1", line)
    # Also handle `0.50` → `0.5` (trailing zero in decimal)
    new_line, n2 = re.subn(r"(?<![\d.])(\d+\.\d*?)0+(?![\d.])", r"\1", new_line)
    # Strip a possible trailing decimal point left over
    new_line = re.sub(r"(?<![\d.])(\d+)\.(?![\d.])", r"\1", new_line)
    return new_line, (n + n2) > 0


def fix_S7772(line: str) -> tuple[str, bool]:
    """import ... from 'fs' -> 'node:fs', 'path' -> 'node:path', etc."""
    NODE_BUILTINS = {
        "fs", "path", "http", "https", "url", "crypto", "stream", "util",
        "events", "buffer", "os", "querystring", "child_process", "zlib",
        "net", "tls", "dns", "module", "process",
    }
    pattern = r"""from ['"]([a-zA-Z_]+)['"]"""
    def replace(m):
        mod = m.group(1)
        if mod in NODE_BUILTINS:
            return f"from 'node:{mod}'"
        return m.group(0)
    new_line, n = re.subn(pattern, replace, line)
    if new_line == line:
        # Also handle: require('fs')
        new_line, n = re.subn(r"""require\(['"]([a-zA-Z_]+)['"]\)""",
                              lambda m: f"require('node:{m.group(1)}')" if m.group(1) in NODE_BUILTINS else m.group(0),
                              line)
    return new_line, n > 0


def fix_S7781(line: str) -> tuple[str, bool]:
    """str.replace(/g/, x) -> str.replaceAll('', x) when regex is plain string with /g."""
    # Very narrow: only safe when regex is a literal plain string with /g flag
    # e.g. `s.replace(/foo/g, 'bar')` -> `s.replaceAll('foo', 'bar')`
    # Skip if regex has special chars to avoid changing semantics
    def replace(m):
        regex = m.group(1)
        # only plain alphanumeric/underscore/space contents
        if re.fullmatch(r"[\w\s]+", regex):
            return f".replaceAll('{regex}', "
        return m.group(0)
    new_line, n = re.subn(r"\.replace\(/([^/\\]+)/g,\s*", replace, line)
    return new_line, n > 0


def fix_S7759(line: str) -> tuple[str, bool]:
    """new Date().getTime() -> Date.now()."""
    new_line, n = re.subn(r"new\s+Date\(\)\.getTime\(\)", "Date.now()", line)
    return new_line, n > 0


FIXERS = {
    "typescript:S7773": fix_S7773,
    "typescript:S7764": fix_S7764,
    "typescript:S7748": fix_S7748,
    "typescript:S7772": fix_S7772,
    "typescript:S7781": fix_S7781,
    "typescript:S7759": fix_S7759,
}

dry_run = "--apply" not in sys.argv

total_applied = 0
total_skipped = 0
per_rule_applied = defaultdict(int)
per_rule_skipped = defaultdict(int)

for filepath, file_issues in sorted(by_file.items()):
    full = REPO / filepath
    if not full.exists():
        print(f"  ! MISSING {filepath}")
        for i in file_issues:
            per_rule_skipped[i["rule"]] += 1
            total_skipped += 1
        continue

    text = full.read_text(encoding="utf-8")
    lines = text.split("\n")
    changes = []
    for issue in file_issues:
        # Lines are 1-indexed
        idx = issue["line"] - 1
        if not (0 <= idx < len(lines)):
            per_rule_skipped[issue["rule"]] += 1
            total_skipped += 1
            continue
        fixer = FIXERS[issue["rule"]]
        original = lines[idx]
        new, ok = fixer(original)
        # Also try a wider window since Wave 0 may have shifted lines.
        if not ok:
            for off in range(1, 30):
                for sign in (-1, 1):
                    cand_idx = idx + sign * off
                    if 0 <= cand_idx < len(lines):
                        cand_new, cand_ok = fixer(lines[cand_idx])
                        if cand_ok:
                            idx = cand_idx
                            original = lines[idx]
                            new = cand_new
                            ok = True
                            break
                if ok:
                    break
        if ok:
            lines[idx] = new
            changes.append((idx + 1, original, new, issue["rule"]))
            per_rule_applied[issue["rule"]] += 1
            total_applied += 1
        else:
            per_rule_skipped[issue["rule"]] += 1
            total_skipped += 1
            if len(file_issues) <= 5:  # debug small files
                print(f"    SKIP {filepath}:{issue['line']} [{issue['rule']}] : {original[:90]}")

    if changes and not dry_run:
        full.write_text("\n".join(lines), encoding="utf-8")
    if changes:
        print(f"  {len(changes):3d}/{len(file_issues):3d}  {filepath}")

print(f"\n=== TOTAL: applied {total_applied} / skipped {total_skipped} ===")
print("Applied per rule:")
for r, c in sorted(per_rule_applied.items()):
    print(f"  {c:4d}  {r}")
print("Skipped per rule:")
for r, c in sorted(per_rule_skipped.items()):
    print(f"  {c:4d}  {r}")

if dry_run:
    print("\n(dry-run; relancer avec --apply pour écrire)")
