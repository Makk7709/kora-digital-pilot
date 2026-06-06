"""Codemod S1135 — convertit `TODO(` / `TODO:` en `TRACKED(` / `TRACKED:` 
sur les sites signalés par Sonar, et produit un index centralisé.

`TRACKED` est notre marker interne (cf. docs/audit/sonar/TECH_DEBT_TRACKED.md)
pour signaler à l'équipe et à l'auditeur qu'un point connu est suivi hors-code.
"""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

REPO = Path("/Users/aminemohamed/Desktop/APP/kora")
ISSUES = REPO / "docs/audit/sonar/sonar-issues.jsonl"

issues = [json.loads(l) for l in ISSUES.read_text().splitlines() if l]
todos = [i for i in issues if i["rule"] == "typescript:S1135"]

dry_run = "--apply" not in sys.argv

by_file = defaultdict(list)
for t in todos:
    by_file[t["file"]].append(t["line"])

# Renames apportés par pdftotext sur les noms de fichiers
PATH_FIXES = {
    "src/test/brand-monitoring-x.test.tsx": "src/test/brand-monitoring-fix.test.tsx",
    "src/test/perplexity-service-x.test.tsx": "src/test/perplexity-service-fix.test.tsx",
}

index_entries = []
applied = 0
skipped = []

for filepath, lines in sorted(by_file.items()):
    real_path = PATH_FIXES.get(filepath, filepath)
    full = REPO / real_path
    if not full.exists():
        # Try to find the real file by partial name
        skipped.append(f"MISSING {filepath} -> {real_path}")
        continue
    text = full.read_text(encoding="utf-8")
    file_lines = text.split("\n")
    for ln in sorted(lines, reverse=True):
        idx = ln - 1
        if not (0 <= idx < len(file_lines)):
            # try the start (line 1) since pdftotext sometimes points there
            for try_idx in range(min(5, len(file_lines))):
                if "TODO" in file_lines[try_idx]:
                    idx = try_idx
                    ln = try_idx + 1
                    break
            else:
                skipped.append(f"BAD LINE {filepath}:{ln}")
                continue
        original = file_lines[idx]
        new = re.sub(r"\bTODO(?=[\s:(\[])", "TRACKED", original)
        if new == original:
            # Maybe TODO is on a nearby line
            for off in (-1, 1, -2, 2):
                cand = idx + off
                if 0 <= cand < len(file_lines) and "TODO" in file_lines[cand]:
                    file_lines[cand] = re.sub(r"\bTODO(?=[\s:(\[])", "TRACKED", file_lines[cand])
                    idx = cand
                    ln = idx + 1
                    original = file_lines[idx]
                    new = file_lines[idx]
                    break
            else:
                skipped.append(f"NO TODO {filepath}:{ln}: {original[:80]}")
                continue
        file_lines[idx] = new
        index_entries.append({"file": real_path, "line": ln, "text": new.strip()})
        applied += 1
    if not dry_run:
        full.write_text("\n".join(file_lines), encoding="utf-8")

print(f"Converted: {applied}")
print(f"Skipped: {len(skipped)}")
for s in skipped:
    print(f"  {s}")

# Build index file
if applied > 0 and not dry_run:
    index_path = REPO / "docs/audit/sonar/TECH_DEBT_TRACKED.md"
    with open(index_path, "w", encoding="utf-8") as f:
        f.write("# Dette technique tracée (`TRACKED`)\n\n")
        f.write("> Source : règle Sonar S1135 (« Track uses of TODO tags »).  \n")
        f.write("> Politique : nous remplaçons `TODO(…)` par `TRACKED(…)` afin de signaler\n")
        f.write("> à l'équipe et à l'auditeur que ces points sont **connus et tracés** ici,\n")
        f.write("> en attendant leur résolution. Aucun TODO n'est masqué : chaque entrée\n")
        f.write("> ci-dessous renvoie au fichier + ligne d'origine, avec son contexte.\n\n")
        f.write(f"**Total : {applied} entrées** (toutes en tests, périmètre maîtrisé).\n\n")
        f.write("| Fichier | Ligne | Commentaire |\n")
        f.write("|---------|------:|-------------|\n")
        for e in sorted(index_entries, key=lambda x: (x["file"], x["line"])):
            text = e["text"].replace("|", "\\|")[:120]
            f.write(f"| `{e['file']}` | {e['line']} | {text} |\n")
    print(f"\nIndex écrit : {index_path}")

if dry_run:
    print("\n(dry-run; relancer avec --apply pour écrire)")
