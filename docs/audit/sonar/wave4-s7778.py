"""Codemod Wave 4.1 — S7778 : fusionne les `.push()` consécutifs.

Gère les push multi-lignes (template literals, expressions complexes).

Stratégie :
- Parse ligne à ligne, on identifie le début d'un push par `<indent><var>.push(`.
- On consomme jusqu'à la ligne qui ferme avec `);` au même indent ou tail.
- On agrège les push consécutifs sur le même `var` au même `indent`.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

REPO = Path("/Users/aminemohamed/Desktop/APP/kora")
dry_run = "--apply" not in sys.argv

TARGETS = [
    "src/services/export/formats/excel-exporter.ts",
    "src/services/export/formats/csv-exporter.ts",
    "src/components/LinkedInExport.tsx",
    "src/services/brand/report-generator.ts",
]

PUSH_START_RE = re.compile(r"^(?P<indent>\s*)(?P<var>[\w.]+)\.push\((?P<rest>.*)$")


def find_push_block(lines: list[str], start: int) -> tuple[int, int, str, str, str] | None:
    """Retourne (start, end_exclusive, indent, var, arg_text) si on a un push complet
    démarrant à `start`. arg_text est tout l'intérieur entre () sans le `;` final.
    """
    m = PUSH_START_RE.match(lines[start])
    if not m:
        return None
    indent = m.group("indent")
    var = m.group("var")
    rest = m.group("rest")

    # Cas mono-ligne : `var.push(arg);`
    # Recherche le `);` qui ferme — en respectant les parenthèses imbriquées.
    depth = 1  # on a déjà consommé `(`
    arg_chunks: list[str] = []
    chunk = ""
    end = start
    pos = 0
    for ch in rest:
        if ch == "(":
            depth += 1
            chunk += ch
        elif ch == ")":
            depth -= 1
            if depth == 0:
                arg_chunks.append(chunk)
                # Le ; doit suivre
                rem = rest[pos + 1:]
                if rem.lstrip().startswith(";"):
                    return start, start + 1, indent, var, "".join(arg_chunks).rstrip()
                return None
            chunk += ch
        else:
            chunk += ch
        pos += 1
    arg_chunks.append(chunk)

    # Multi-ligne : on continue sur les lignes suivantes jusqu'à `);` au depth 0
    j = start + 1
    while j < len(lines):
        line = lines[j]
        new_chunk = ""
        for ch in line:
            if ch == "(":
                depth += 1
            elif ch == ")":
                depth -= 1
                if depth == 0:
                    new_chunk += ""  # ne pas inclure le ')' final
                    arg_chunks.append("\n" + new_chunk.rstrip())
                    # Le `);` doit être au début ou suivi
                    closing_idx = line.index(")")
                    rem = line[closing_idx + 1 :]
                    if rem.lstrip().startswith(";"):
                        return start, j + 1, indent, var, "".join(arg_chunks).rstrip()
                    return None
            new_chunk += ch
        arg_chunks.append("\n" + new_chunk.rstrip())
        j += 1
    return None


def fuse_pushes(source: str) -> tuple[str, int]:
    lines = source.split("\n")
    out: list[str] = []
    fused = 0
    i = 0
    while i < len(lines):
        block = find_push_block(lines, i)
        if not block:
            out.append(lines[i])
            i += 1
            continue
        _, end, indent, var, arg = block
        args = [arg]
        cursor = end
        while True:
            nxt = find_push_block(lines, cursor)
            if not nxt:
                break
            _, end2, indent2, var2, arg2 = nxt
            if indent2 != indent or var2 != var:
                break
            args.append(arg2)
            cursor = end2

        if len(args) > 1:
            fused += len(args) - 1
            # Normalisation : on retire les blancs et virgules de fin de chaque arg
            clean_args: list[str] = []
            for a in args:
                stripped = a.strip()
                # Retire trailing comma
                while stripped.endswith(","):
                    stripped = stripped[:-1].rstrip()
                clean_args.append(stripped)

            out.append(f"{indent}{var}.push(")
            for k, a in enumerate(clean_args):
                suffix = "," if k < len(clean_args) - 1 else ","
                a_lines = a.split("\n")
                if len(a_lines) == 1:
                    out.append(f"{indent}  {a_lines[0]}{suffix}")
                else:
                    # Conserver indent relatif
                    out.append(f"{indent}  {a_lines[0]}")
                    for ln in a_lines[1:]:
                        out.append(f"{indent}  {ln}")
                    out[-1] = out[-1] + suffix
            out.append(f"{indent});")
            i = cursor
        else:
            # 1 push — on remet tel quel
            out.extend(lines[i:end])
            i = end
    return "\n".join(out), fused


total = 0
for rel in TARGETS:
    full = REPO / rel
    if not full.exists():
        print(f"  MISSING  {rel}")
        continue
    text = full.read_text(encoding="utf-8")
    new, fused = fuse_pushes(text)
    if fused:
        print(f"  {fused:3d}  {rel}")
        total += fused
        if not dry_run:
            full.write_text(new, encoding="utf-8")

print(f"\nTotal fused: {total}")
if dry_run:
    print("(dry-run; relancer avec --apply)")
