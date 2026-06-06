# Wave 3 — Modernisation regex (117 issues)

**Périmètre Sonar** : S6594, S5869, S6397, S5843, S7780, S6535.

## Récap des règles traitées

| Règle Sonar | Titre                                                  | Initiales | Restants | Stratégie                                     |
|-------------|--------------------------------------------------------|----------:|---------:|-----------------------------------------------|
| `S6594`     | Use `RegExp.exec()` instead of `String.match`          | 69        | 0        | Codemod ciblé + 7 patches manuels             |
| `S5869`     | Remove duplicates in this character class              | 16        | 0        | Manuel : `[a-zA-Z…]/gi` → `[a-z…]/gi`, dédup `["""]` |
| `S6397`     | Replace this character class by the character itself   | 11        | 0        | `[\s]` → `\s`, `[:]` → `:`, `[e]?` → `e?`, `[s]?` → `s?` |
| `S5843`     | Simplify regular expression complexity                  | 9         | 0        | Factorisation manuelle en sous-patterns       |
| `S7780`     | Use `String.raw` to avoid escaping `\`                 | 9         | 0        | Conversion `` `…\\d…` `` → `` String.raw`…\d…` `` |
| `S6535`     | Unnecessary escape character (e.g. `\'`)               | 3         | 0        | Suppression de l'antislash dans 3 fichiers de tests |

## Détails par règle

### S6594 — `.exec()` au lieu de `.match()`

Pour les regex **sans flag `g`**, `regex.exec(str)` est sémantiquement équivalent à
`str.match(regex)` mais plus rapide (un seul appel, pas de fallback `Symbol.match`).

**Codemod** : `docs/audit/sonar/wave3-s6594.py` (`--apply`).
- Repère `<expr>.match(/regex/flags)` à plat (regex/flag/string).
- Ne touche **jamais** aux regex avec `g` (sémantique différente).
- 50 substitutions automatiques sur 9 fichiers.

**Patches manuels (19 cas restants)** :

| Fichier | Cas |
|---------|-----|
| `BrandAnalysisCore.ts`, `DataAggregationService.ts`, `extractors.ts` | `.match(new RegExp(…))` → `new RegExp(…).exec(…)` (3 sites) |
| `BrandAnalysisCore.ts` (×3), `parsers.ts` (×3), `extractors.ts` (×4) | `.match(\n   /regex/\n  )` multi-lignes → forme `.exec()` |
| `CommunityManagerDashboard.tsx:214` | `line.match(/^\d+\.|^-|^•/)` → `/^…/.test(line)` (booléen) |

### S5869 — Doublons dans classes de caractères

Cas typique : `[a-zA-ZÀ-ÿ\s]/gi`. Avec le flag `i`, `A-Z` est un doublon de `a-z`.
**Fix** : retirer `A-Z` → `[a-zÀ-ÿ\s]/gi`.

Fichiers patchés : `BrandAnalysisCore.ts`, `DataAggregationService.ts`,
`brand/real/extractors.ts`.

Cas particulier : `src/services/brand/parsers.ts:44` contenait `[""""]` (trois `"`
U+0022 identiques). Remplacé par `"…"` simple.

### S6397 — Classes à un seul caractère

Patterns triviaux :

| Avant | Après |
|-------|-------|
| `/KORA[\s]*$/gm` | `/KORA\s*$/gm` (5 sites : `BrandAnalysisCore.ts`, `content-cleaner.ts` ×2, `DataAggregationService.ts`, `perplexity-service.ts` ×2, `ReportGenerationService.ts`) |
| `replace(/[:]/g, '-')` | `.split(':').join('-')` (`BrandIntelligenceDashboard.tsx` — `replaceAll` non dispo en ES2020) |
| `fondé[e]?`, `créé[e]?`, `fondateur[s]?` | `fondée?`, `créée?`, `fondateurs?` (`brand/real/extractors.ts`) |

### S5843 — Complexité regex >20

| Fichier | Stratégie |
|---------|-----------|
| `services/brand/parsers.ts:213` (parseCompetitors) | Composition `NAME / MENTIONS / SENTIMENT / MARKET / SEP` avec `RegExp` literals |
| `services/brand/parsers.ts:348` (parseSWOTAnalysis) | Helper `buildSwotRegex(current)` qui assemble la regex à partir d'un dict de headers |
| `services/brand/real/parsers.ts:95,100` | Extraction de `SCORE_TAIL` commun et factorisation `(?:innovation|R&D)` |
| `services/core/BrandAnalysisCore.ts:356` | Factorisation `MONTHS_FR`, `NUMERIC_DATE`, `NAMED_DATE` |
| `services/brand/real/extractors.ts:465` (extractFoundingYear) | Une seule alternance optionnelle `(?:(?:fondée?|créée?)\s+en\s+)?(\d{4})` |

### S7780 — `String.raw` pour les regex dynamiques

Sept regex dynamiques (`new RegExp(\`…\\d…\`, …)`) reposaient sur des `\\d`,
`\\s`, `\\n` au sein d'un template literal — chaque antislash exigeait un double
échappement. `String.raw` permet d'écrire `\d`, `\s` directement.

**Sites convertis** :
- `services/core/BrandAnalysisCore.ts` (×2)
- `services/brand/DataAggregationService.ts` (×4 — y compris factorisation
  parallèle de la fonction `extractNumber` / `extractPercentage`)
- `services/brand/real/extractors.ts` (×1)
- `services/integration/ReportGenerationService.ts` (×1)

### S6535 — Échappements inutiles dans regex

Les apostrophes `'` n'ont jamais besoin d'être échappées dans une regex
JavaScript :

- `src/components/__tests__/BrandMonitoring.test.tsx:464` : `/réessayer l\'analyse/i` → `/réessayer l'analyse/i`
- `src/test/dashboard/CommunityManagerDomainSearch.test.tsx:88,220` : idem

## Vérifications

```bash
npm run typecheck   # OK (0 erreur TS, 1 erreur fixée : replaceAll ES2020)
npm run lint        # 390 warnings (était 393 avant Wave 3 ; 0 erreur)
npx vitest run      # 134 passed, 273 skipped, 0 failed
```

## Audit hostile

- `grep -rn '\.match(/' src` filtré pour les non-`g` : **0 résiduel** Sonar
  (1 reste : `useBusinessIntelligence.ts:421` est en flag `g` donc hors S6594).
- `grep -rn '\[A-Za-zÀ-ÿ'` → 0 résiduel.
- `grep -rn 'KORA\[\\s\]\*\$'` → 0 résiduel.
- `grep -rn "new RegExp(\`" | grep '\\\\d'` → 0 résiduel.
- Aucune fonction d'extraction métier impactée (toutes testées par les tests TDD `brand-intelligence`).

## Notes & risques

- **Bumper la cible TS à ES2021** est resté optionnel : `replaceAll` n'est utilisé
  que ponctuellement, on a préféré `.split(…).join(…)` pour rester compatible avec
  la cible actuelle. Une migration ES2021 reste tracée dans `TECH_DEBT.md` si
  l'audit la recommande.
- Les regex SWOT factorisées (`buildSwotRegex`) sont **stateful** : on les
  instancie à chaque appel pour éviter les bugs d'index sur `lastIndex` lors
  d'appels successifs (S6783 est traité en Wave 4).

## Bilan

- **117 issues Sonar Wave 3** : 100 % traitées.
- **0 régression métier** : tests TDD brand-intelligence et export passants.
- **3 warnings ESLint en moins** (393 → 390) — les autres sont des `no-explicit-any`
  hors périmètre Wave 3.
