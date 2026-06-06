"""Codemod Wave 3 — S6594 : `str.match(/re/)` → `/re/.exec(str)` quand pas de flag `g`.

Garde-fous :
- Ne touche jamais aux regex avec flag `g` (sémantique différente : `.match` renvoie
  un tableau de toutes les occurrences, `.exec` une seule + advance internal state).
- Ne touche pas aux `match(new RegExp(...))` pour éviter de coller un appel de
  constructeur sans parenthèses (on les traite à la main).
- Préserve l'expression de gauche : tout sauf parenthèses simples nécessite
  encapsulation `(expr).exec(...)`.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

REPO = Path("/Users/aminemohamed/Desktop/APP/kora")
dry_run = "--apply" not in sys.argv

TARGETS = [
    "src/services/brand/real/extractors.ts",
    "src/services/brand/DataAggregationService.ts",
    "src/services/core/BrandAnalysisCore.ts",
    "src/services/brand/real/parsers.ts",
    "src/services/brand/parsers.ts",
    "src/services/integration/ReportGenerationService.ts",
    "src/hooks/useBusinessIntelligence.ts",
    "src/services/brand/real/recommendations.ts",
    "src/lib/ai/fallback-generator.ts",
]

# Capture `<expr>.match(<regex-literal>)`
#   expr  = chaîne de chars [\w.\]\)] (identifiers / props / index access / call chain)
#   regex = /.../flags  où flags ⊂ [a-z]*
PATTERN = re.compile(
    r"""
    (?P<lhs>[\w\)\]\.]+)        # left side (identifier/chain)
    \.match\(\s*
    /(?P<body>(?:\\.|[^/\\])*?)/(?P<flags>[a-z]*)
    \s*\)
    """,
    re.VERBOSE,
)


def transform_line(line: str) -> tuple[str, int]:
    count = 0

    def repl(m: re.Match) -> str:
        nonlocal count
        flags = m.group("flags")
        if "g" in flags:
            return m.group(0)
        count += 1
        return f"/{m.group('body')}/{flags}.exec({m.group('lhs')})"

    new = PATTERN.sub(repl, line)
    return new, count


total = 0
files_touched = 0
for rel in TARGETS:
    full = REPO / rel
    if not full.exists():
        print(f"  MISSING  {rel}")
        continue
    text = full.read_text(encoding="utf-8")
    lines = text.split("\n")
    file_count = 0
    for i, line in enumerate(lines):
        new, n = transform_line(line)
        if n:
            lines[i] = new
            file_count += n
    if file_count:
        if not dry_run:
            full.write_text("\n".join(lines), encoding="utf-8")
        files_touched += 1
        total += file_count
        print(f"  {file_count:3d}  {rel}")

print(f"\nTotal: {total} replacements in {files_touched} files")
if dry_run:
    print("(dry-run; relancer avec --apply)")
