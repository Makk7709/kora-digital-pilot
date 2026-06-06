#!/usr/bin/env python3
"""Codemod Wave 5 — S2933 (add `readonly` to never-reassigned members)
   + S4325 (remove unnecessary `as X` casts).

Usage:
    python3 wave5-codemod.py            # dry-run
    python3 wave5-codemod.py --apply
"""
from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
ISSUES = Path(__file__).parent / "sonar-issues.jsonl"


def load_issues():
    by_rule_file: dict[str, dict[str, list[int]]] = defaultdict(lambda: defaultdict(list))
    with ISSUES.open() as fh:
        for line in fh:
            if not line.strip():
                continue
            obj = json.loads(line)
            by_rule_file[obj["rule"]][obj["file"]].append(obj["line"])
    return by_rule_file


# S2933 : « Member 'X' is never reassigned ». On ajoute `readonly` à la déclaration.
RE_FIELD = re.compile(
    r"^(?P<indent>\s*)(?P<acc>(?:public|private|protected)\s+)?(?P<static>static\s+)?"
    r"(?P<name>[A-Za-z_][\w$]*)\s*[:=]"
)


def apply_s2933(path: Path, lines_to_fix: list[int]) -> int:
    if not path.exists():
        return 0
    src = path.read_text().split("\n")
    changed = 0
    for ln in lines_to_fix:
        idx = ln - 1
        # Fuzzy match ±5 lignes
        for delta in [0, -1, 1, -2, 2, -3, 3, -4, 4, -5, 5]:
            cur = idx + delta
            if cur < 0 or cur >= len(src):
                continue
            line = src[cur]
            m = RE_FIELD.match(line)
            if not m:
                continue
            # Sauter si déjà readonly / const / let / var / function / method
            if "readonly" in line.split(m.group("name"))[0]:
                continue
            if re.match(r"^\s*(let|const|var|return|if|for|while|function|//|/\*|\*)", line):
                continue
            # On veut s'assurer que c'est une déclaration de champ de classe :
            # la ligne doit contenir un `:` ou `=` après le nom, ET la classe doit être autour.
            after = line[m.end():].lstrip()
            if not (after.startswith(":") or after.startswith("=")) and "(" in after.split("=")[0]:
                # C'est probablement une méthode, on saute.
                continue
            # On insère 'readonly ' juste avant le nom du champ.
            indent = m.group("indent")
            acc = m.group("acc") or ""
            static = m.group("static") or ""
            rest = line[m.end("name"):]
            new_line = f"{indent}{acc}{static}readonly {m.group('name')}{rest}"
            if new_line == line:
                continue
            src[cur] = new_line
            changed += 1
            break
    if changed:
        path.write_text("\n".join(src))
    return changed


# S4325 : `value as X` inutile. On retire l'assertion sur la ligne signalée.
RE_AS_CAST = re.compile(r"\s+as\s+[A-Za-z_$][\w$.<>\[\],\s|&'\"\d-]*(?=[;,)\]}\s]|$)")


def apply_s4325(path: Path, lines_to_fix: list[int]) -> int:
    if not path.exists():
        return 0
    src = path.read_text().split("\n")
    changed = 0
    for ln in lines_to_fix:
        idx = ln - 1
        for delta in [0, -1, 1, -2, 2]:
            cur = idx + delta
            if cur < 0 or cur >= len(src):
                continue
            line = src[cur]
            # On enlève toutes les assertions ` as Foo` simples sur la ligne.
            new_line = RE_AS_CAST.sub("", line)
            if new_line != line:
                src[cur] = new_line
                changed += 1
                break
    if changed:
        path.write_text("\n".join(src))
    return changed


def main() -> int:
    apply = "--apply" in sys.argv
    rules = load_issues()

    total_s2933 = 0
    s2933_files = rules.get("typescript:S2933", {})
    print(f"S2933 — {sum(len(v) for v in s2933_files.values())} issues sur {len(s2933_files)} fichiers")
    for rel, lines in s2933_files.items():
        path = REPO / rel
        if apply:
            n = apply_s2933(path, lines)
        else:
            n = len(lines)
        total_s2933 += n
        if n:
            print(f"  {rel}: {n}")

    print()
    total_s4325 = 0
    s4325_files = rules.get("typescript:S4325", {})
    print(f"S4325 — {sum(len(v) for v in s4325_files.values())} issues sur {len(s4325_files)} fichiers")
    for rel, lines in s4325_files.items():
        path = REPO / rel
        if apply:
            n = apply_s4325(path, lines)
        else:
            n = len(lines)
        total_s4325 += n
        if n:
            print(f"  {rel}: {n}")

    print(f"\nBilan : S2933={total_s2933}, S4325={total_s4325}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
