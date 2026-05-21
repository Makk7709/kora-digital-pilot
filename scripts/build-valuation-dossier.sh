#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# scripts/build-valuation-dossier.sh
#
# Génère le dossier de valorisation (apport en nature) à plat dans
# `dossier-valorisation/`. Idempotent : peut être relancé à volonté.
#
# Contenu produit :
#   1-presentation/          docs/README.md, docs/ARCHITECTURE.md (copies brutes)
#   2-coverage/              rapport Vitest HTML (si présent dans coverage/)
#   3-audit-securite/        npm-audit.json + licenses.json
#   5-historique-git/        git log --stat + git shortlog (contributeurs)
#   6-inventaire/            cloc (si dispo) + npm ls --depth=0
#   manifest.txt             liste exhaustive horodatée
#
# La génération PDF (pandoc) est tentée si pandoc est installé, sinon ignorée.
# ----------------------------------------------------------------------------
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/dossier-valorisation"
TS="$(date -u +"%Y-%m-%dT%H-%M-%SZ")"

echo "Building valuation dossier in: $OUT"
rm -rf "$OUT"
mkdir -p "$OUT"/{1-presentation,2-coverage,3-audit-securite,5-historique-git,6-inventaire}

# --- 1. Présentation ---
if [ -d "$ROOT/docs" ]; then
  cp -R "$ROOT/docs/." "$OUT/1-presentation/" 2>/dev/null || true
fi

# Optionnel: PDF via pandoc
if command -v pandoc >/dev/null 2>&1 && [ -f "$ROOT/docs/README.md" ]; then
  pandoc "$ROOT/docs/README.md" -o "$OUT/1-presentation/presentation.pdf" \
    --metadata title="Kora — Dossier de valorisation" 2>/dev/null || true
fi

# --- 2. Coverage ---
if [ -d "$ROOT/coverage" ]; then
  cp -R "$ROOT/coverage/." "$OUT/2-coverage/" 2>/dev/null || true
else
  echo "Coverage report missing. Run: npm run test:coverage" > "$OUT/2-coverage/README.txt"
fi

# --- 3. Audit sécurité ---
( cd "$ROOT" && npm audit --json > "$OUT/3-audit-securite/npm-audit.json" 2>/dev/null ) || true
# license-checker peut prendre quelques minutes (parcourt node_modules)
if command -v npx >/dev/null 2>&1; then
  echo "  - extracting licenses (this may take a few minutes)..."
  ( cd "$ROOT" && npx --yes license-checker --json > "$OUT/3-audit-securite/licenses.json" 2>/dev/null ) || \
    echo '{"error":"license-checker failed or not installed"}' > "$OUT/3-audit-securite/licenses.json"
fi

# --- 5. Historique Git ---
( cd "$ROOT" && git log --stat --pretty=fuller > "$OUT/5-historique-git/git-log.txt" ) || true
( cd "$ROOT" && git shortlog -sne > "$OUT/5-historique-git/contributors.txt" ) || true

# --- 6. Inventaire code & deps ---
if command -v cloc >/dev/null 2>&1; then
  cloc "$ROOT/src" "$ROOT/server.cjs" > "$OUT/6-inventaire/cloc.txt" 2>/dev/null || true
else
  echo "cloc not installed -- install with: brew install cloc" > "$OUT/6-inventaire/cloc.txt"
fi
( cd "$ROOT" && npm ls --all --json > "$OUT/6-inventaire/npm-ls.json" 2>/dev/null ) || true
( cd "$ROOT" && npm ls --depth=0 > "$OUT/6-inventaire/npm-ls-top.txt" 2>&1 ) || true

# --- Manifest horodaté ---
{
  echo "Kora — dossier de valorisation"
  echo "Généré: $TS"
  echo "Branche: $(cd "$ROOT" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo n/a)"
  echo "Commit:  $(cd "$ROOT" && git rev-parse HEAD 2>/dev/null || echo n/a)"
  echo ""
  echo "Contenu:"
  ( cd "$OUT" && find . -maxdepth 3 -type f | sort )
} > "$OUT/manifest.txt"

echo "Dossier valorisation produit dans: $OUT"
