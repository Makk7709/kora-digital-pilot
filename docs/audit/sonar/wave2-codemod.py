"""Codemod Wave 2 — S1128 (unused imports), S1854 (unused assignments),
S4165 (redundant), S125 (commented-out code).

Stratégies :
- S1128 : pour chaque (fichier, ligne, nom-import-cible), modifier la
  ligne d'import pour retirer juste ce nom (préserve les autres imports
  du même statement).
- S1854 : transformer `const|let X = ...` en suppression de la ligne UNIQUEMENT
  si la ligne fait clairement une assignation et que rien d'autre n'y dépend.
  Sinon, log un SKIP et traiter à la main.
- S4165 / S125 : marqué à la main (peu d'occurrences).
"""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

REPO = Path("/Users/aminemohamed/Desktop/APP/kora")
ISSUES = REPO / "docs/audit/sonar/sonar-issues.jsonl"

# Reconstitue les noms tronqués par pdftotext
NAME_FIXES = {
    "BrandAnalysisOrch estrator": "BrandAnalysisOrchestrator",
    " reEvent": "fireEvent",
    "DeepResearchRep ort": "DeepResearchReport",
    "LinkedInDiagnostic ": "LinkedInDiagnostic",
    "BrandAnalysisOrch": "BrandAnalysisOrchestrator",
}


def extract_target_name(msg: str) -> str | None:
    """Extrait le nom symbol depuis le message Sonar : 'Remove this unused import of 'X'.'"""
    m = re.search(r"unused import of ['\"]([^'\"]+)['\"]", msg)
    if m:
        name = m.group(1)
        return NAME_FIXES.get(name, name).strip()
    return None


def extract_var_name(msg: str) -> str | None:
    """Extrait nom de variable pour S1854 / S4165."""
    m = re.search(r"variable [\"']([^\"']+)[\"']", msg)
    if m:
        return NAME_FIXES.get(m.group(1), m.group(1)).strip()
    m = re.search(r"['\"]([A-Za-z_]\w*)['\"]\s+already", msg)
    if m:
        return m.group(1)
    return None


issues = [json.loads(l) for l in ISSUES.read_text().splitlines() if l]

dry_run = "--apply" not in sys.argv


def remove_named_import(lines: list[str], lineno: int, name: str) -> bool:
    """Cherche une zone import autour de lineno, retire `name` des accolades.
    Si la ligne est `import X from 'foo'` (default) et X == name, supprime la ligne.
    """
    # Look in ±5 lines
    for off in range(-3, 6):
        idx = lineno - 1 + off
        if not (0 <= idx < len(lines)):
            continue
        line = lines[idx]
        # Default import seul
        m_default = re.match(rf"^\s*import\s+{re.escape(name)}\s+from\s+['\"]", line)
        if m_default:
            lines.pop(idx)
            return True
        # Named imports : `import { A, B, C } from 'foo'`
        # ou multi-lignes — on assemble la déclaration complète
        # Approche simple : si la ligne contient `{ ... }` avec name, on retire name
        if "import" in line and "{" in line:
            new_line, n = re.subn(
                rf"(?<![\w_]){re.escape(name)}\s*,?\s*",
                "",
                line,
                count=1,
            )
            # nettoyer doubles virgules ou ,}
            new_line = re.sub(r",\s*,", ",", new_line)
            new_line = re.sub(r"{\s*,", "{", new_line)
            new_line = re.sub(r",\s*}", "}", new_line)
            new_line = re.sub(r"{\s*}", "{}", new_line)
            if n > 0 and new_line != line:
                # Si l'import est devenu vide ({} ou type seul), supprimer la ligne
                if re.match(r"^\s*import\s+\{\s*\}\s+from", new_line) or re.match(
                    r"^\s*import\s+\{\s*\}\s*;?\s*$", new_line
                ):
                    lines.pop(idx)
                else:
                    lines[idx] = new_line
                return True
        # Multi-line import bloc — on scanne en avant pour `{`/`}`
    # Tentative : import multi-lignes commençant par `import {` sur une ligne, name plus loin
    for idx in range(max(0, lineno - 6), min(len(lines), lineno + 6)):
        line = lines[idx]
        if re.search(rf"(?<![\w_]){re.escape(name)}(?![\w_])", line) and "import" not in line:
            # Vérifier qu'on est dans un bloc import en cherchant `from` plus loin
            in_import = False
            for j in range(idx, min(len(lines), idx + 15)):
                if "from " in lines[j] and ("'" in lines[j] or '"' in lines[j]):
                    in_import = True
                    break
                if "}" in lines[j] and "from" in lines[j]:
                    in_import = True
                    break
            if in_import:
                new_line, n = re.subn(
                    rf"(?<![\w_]){re.escape(name)}\s*,?\s*",
                    "",
                    line,
                    count=1,
                )
                new_line = re.sub(r",\s*$", "", new_line.rstrip()) + ("\n" if line.endswith("\n") else "")
                if n > 0 and new_line.strip():
                    lines[idx] = new_line
                    return True
                if n > 0 and not new_line.strip():
                    lines.pop(idx)
                    return True
    return False


def remove_unused_assignment(lines: list[str], lineno: int, name: str) -> bool:
    """Supprime une affectation inutile :
    - `const NAME = ...;` -> ligne entière
    - `let NAME = ...;` (sans usage ultérieur) -> ligne entière
    - `NAME = ...;` -> ligne entière
    Limite : ne touche pas aux destructurations ou patterns complexes.
    """
    for off in range(-3, 6):
        idx = lineno - 1 + off
        if not (0 <= idx < len(lines)):
            continue
        line = lines[idx]
        # Cas 1 : const/let NAME = ... ;
        if re.match(rf"^\s*(?:const|let)\s+{re.escape(name)}\s*=", line):
            lines.pop(idx)
            return True
        # Cas 2 : réaffectation simple NAME = ... ;
        if re.match(rf"^\s*{re.escape(name)}\s*=", line) and "=>" not in line:
            lines.pop(idx)
            return True
    return False


fixed = defaultdict(int)
skipped = defaultdict(list)

by_file_s1128 = defaultdict(list)
by_file_s1854 = defaultdict(list)

for i in issues:
    if i["rule"] == "typescript:S1128":
        name = extract_target_name(i["message"])
        if name:
            by_file_s1128[i["file"]].append((i["line"], name, i["message"]))
    elif i["rule"] == "typescript:S1854":
        name = extract_var_name(i["message"])
        if name:
            by_file_s1854[i["file"]].append((i["line"], name, i["message"]))


def apply_to_file(filepath: str, ops: list[tuple], handler):
    full = REPO / filepath
    if not full.exists():
        for ln, name, msg in ops:
            skipped["MISSING_FILE"].append(f"{filepath}:{ln} {name}")
        return 0
    text = full.read_text(encoding="utf-8")
    lines = text.split("\n")
    applied = 0
    # Trier en ordre décroissant pour ne pas perdre les indices après pop()
    for ln, name, msg in sorted(ops, key=lambda x: -x[0]):
        if handler(lines, ln, name):
            applied += 1
            fixed[handler.__name__] += 1
        else:
            skipped[handler.__name__].append(f"{filepath}:{ln} {name}")
    if applied > 0 and not dry_run:
        full.write_text("\n".join(lines), encoding="utf-8")
    if applied > 0:
        print(f"  {applied:2d}/{len(ops):2d}  {filepath}  [{handler.__name__}]")
    return applied


for filepath, ops in sorted(by_file_s1128.items()):
    apply_to_file(filepath, ops, remove_named_import)

print()
for filepath, ops in sorted(by_file_s1854.items()):
    apply_to_file(filepath, ops, remove_unused_assignment)

print(f"\n=== TOTAL fixed: {sum(fixed.values())} ===")
for h, c in fixed.items():
    print(f"  {c}  {h}")
print(f"\n=== Skipped: {sum(len(v) for v in skipped.values())} ===")
for h, items in skipped.items():
    print(f"  {h} ({len(items)}):")
    for it in items[:20]:
        print(f"    {it}")

if dry_run:
    print("\n(dry-run; relancer avec --apply pour écrire)")
