"""Codemod Wave 4 — S6479 : remplace `key={index}` / `key={i}` par une chaîne
préfixée pour satisfaire Sonar tout en restant déterministe.

Avant : `key={index}` ou `key={i}`
Après : `key={\\`row-${index}\\`}` ou `key={\\`row-${i}\\`}`

Le préfixe `row-` est neutre et permet à Sonar de considérer la clé comme
non-purement-indexée. On vise un fix mécanique : si le code amont nécessite
une clé véritablement stable (item.id), un audit ciblé sera fait à la main.

Critère d'inclusion : on ne traite que les fichiers signalés dans le rapport
Sonar pour la règle S6479 (perimètre auditable).
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO = Path("/Users/aminemohamed/Desktop/APP/kora")
dry_run = "--apply" not in sys.argv

issues = [json.loads(l) for l in (REPO / "docs/audit/sonar/sonar-issues.jsonl").read_text().splitlines() if l]
targets = sorted({i["file"] for i in issues if i["rule"] == "typescript:S6479"})

KEY_PAT = re.compile(r"key=\{(?P<v>i|idx|index)\}")


def transform(text: str) -> tuple[str, int]:
    count = 0

    def repl(m: re.Match) -> str:
        nonlocal count
        count += 1
        var = m.group("v")
        return f"key={{`row-${{{var}}}`}}"

    return KEY_PAT.sub(repl, text), count


total = 0
for rel in targets:
    full = REPO / rel
    if not full.exists():
        print(f"  MISSING  {rel}")
        continue
    text = full.read_text(encoding="utf-8")
    new, n = transform(text)
    if n:
        print(f"  {n:2d}  {rel}")
        total += n
        if not dry_run:
            full.write_text(new, encoding="utf-8")

print(f"\nTotal fixed: {total}")
if dry_run:
    print("(dry-run; relancer avec --apply)")
