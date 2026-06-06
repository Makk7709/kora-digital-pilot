"""Codemod Wave 2 (suite) — nettoie les unused-vars ESLint résiduels :

1) `catch (error)` non utilisé  →  `catch (_error)` (convention `^_`).
2) `useNavigate` importé jamais utilisé : suppression depuis import.
3) Args/vars `_`-prefix : `report`, `metrics`, `category`, `thisArg`, `endpoint`, `currentReport`.
4) `prefer-const` : `let downloadUrl` / `let currentY` jamais réassignés → `const`.

NB : seules les occurrences signalées par ESLint sont touchées (file:line ciblés),
pour rester auditable.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

REPO = Path("/Users/aminemohamed/Desktop/APP/kora")
dry_run = "--apply" not in sys.argv


def patch_line(path: str, line_no: int, transform):
    """Applique `transform(line)` à path:line_no si possible."""
    full = REPO / path
    if not full.exists():
        print(f"  MISSING  {path}")
        return False
    text = full.read_text(encoding="utf-8")
    lines = text.split("\n")
    if not (1 <= line_no <= len(lines)):
        print(f"  BAD LINE {path}:{line_no}")
        return False
    original = lines[line_no - 1]
    new = transform(original)
    if new is None or new == original:
        return False
    lines[line_no - 1] = new
    if not dry_run:
        full.write_text("\n".join(lines), encoding="utf-8")
    print(f"  OK  {path}:{line_no}")
    return True


def replace_catch_error(line: str) -> str | None:
    """`catch (error)` → `catch (_error)` (uniquement si `error` n'apparaît pas
    dans le corps du catch sur la même ligne, ce qui est le cas d'un catch simple)."""
    return re.sub(r"\bcatch\s*\(\s*error\s*\)", "catch (_error)", line)


def prefix_underscore(name: str):
    """Retourne un transformer qui remplace `name` par `_name`."""
    pat = re.compile(rf"\b{re.escape(name)}\b")

    def _t(line: str) -> str | None:
        return pat.sub(f"_{name}", line, count=1)

    return _t


def let_to_const(line: str) -> str | None:
    return re.sub(r"^\s*let\s+", lambda m: m.group(0).replace("let", "const"), line)


def remove_import_named(name: str):
    pat = re.compile(rf"(?<![\w_]){re.escape(name)}\s*,?\s*")

    def _t(line: str) -> str | None:
        new = pat.sub("", line, count=1)
        new = re.sub(r",\s*}", " }", new)
        new = re.sub(r"{\s*,", "{", new)
        new = re.sub(r",\s*,", ",", new)
        # If import becomes empty, drop it
        if re.match(r"^\s*import\s*{\s*}\s*from", new):
            return ""
        return new

    return _t


def delete_line(_line: str) -> str | None:
    return ""


# Liste des corrections (path, line, transform, label).
TASKS = [
    # catch (error) → catch (_error)
    ("src/components/CommunityManagerDashboard.tsx", 131, replace_catch_error, "catch"),
    ("src/components/ImageGenerator.tsx", 161, replace_catch_error, "catch"),
    ("src/components/InspirationAI.tsx", 165, replace_catch_error, "catch"),
    ("src/components/LinkedInStatsTest.tsx", 120, replace_catch_error, "catch"),
    ("src/components/LinkedInStatsTest.tsx", 154, replace_catch_error, "catch"),
    ("src/components/LinkedInWidget.tsx", 74, replace_catch_error, "catch"),
    ("src/components/PostModal.tsx", 152, replace_catch_error, "catch"),
    ("src/components/StatsCard.tsx", 200, replace_catch_error, "catch"),
    ("src/hooks/usePlanning.ts", 501, replace_catch_error, "catch"),
    ("src/lib/planning-service.ts", 398, replace_catch_error, "catch"),
    ("src/services/brand/brand-analysis-orchestrator.ts", 199, replace_catch_error, "catch"),
    ("src/services/export/formats/json-exporter.ts", 60, replace_catch_error, "catch"),
    ("src/test/production/ExportProductionCompliance.test.ts", 369, replace_catch_error, "catch"),
    # useNavigate imports → suppression
    ("src/components/Sidebar.tsx", 3, remove_import_named("useNavigate"), "rm-import"),
    ("src/pages/Landing.tsx", 4, remove_import_named("useNavigate"), "rm-import"),
    # args/vars prefixés
    ("src/lib/brand-prompts.ts", 183, prefix_underscore("category"), "_-prefix"),
    ("src/lib/global-api-blocker.ts", 104, prefix_underscore("thisArg"), "_-prefix"),
    ("src/lib/perplexity-protection-middleware.ts", 61, prefix_underscore("endpoint"), "_-prefix"),
    ("src/test/brand-intelligence-tdd.test.tsx", 308, prefix_underscore("currentReport"), "_-prefix"),
    ("src/test/brand-intelligence-tdd.test.tsx", 530, prefix_underscore("report"), "_-prefix"),
    ("src/test/brand-intelligence-tdd.test.tsx", 544, prefix_underscore("report"), "_-prefix"),
    ("src/test/brand-intelligence-tdd.test.tsx", 564, prefix_underscore("report"), "_-prefix"),
    ("src/test/brand-intelligence-tdd.test.tsx", 600, prefix_underscore("report"), "_-prefix"),
    ("src/test/brand-intelligence-tdd.test.tsx", 625, prefix_underscore("metrics"), "_-prefix"),
    ("src/test/brand-intelligence-tdd.test.tsx", 804, prefix_underscore("metrics"), "_-prefix"),
    ("src/test/brand-intelligence-tdd.test.tsx", 854, prefix_underscore("report"), "_-prefix"),
    ("src/test/brand-intelligence-tdd.test.tsx", 868, prefix_underscore("report"), "_-prefix"),
    # prefer-const
    ("src/services/export/export-orchestrator.ts", 149, let_to_const, "let→const"),
    ("src/services/export/formats/pdf-exporter.ts", 1925, let_to_const, "let→const"),
]


fixed = 0
for path, line_no, transform, label in TASKS:
    if patch_line(path, line_no, transform):
        fixed += 1

print(f"\n=== Fixed: {fixed}/{len(TASKS)} ===")
if dry_run:
    print("(dry-run; relancer avec --apply)")
