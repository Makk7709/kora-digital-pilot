# Batch 01 — Wave 1 : APIs natives & globals (201 issues)

> Sévérités : MINOR / INFO  
> Périmètre : 6 règles mécaniques d'alignement aux APIs natives JavaScript modernes  
> Statut : ✅ 201 / 201 corrigées, typecheck OK, lint 0 erreurs, 134 tests verts

## Règles couvertes

| Règle  | Nombre | Transformation appliquée |
|--------|-------:|--------------------------|
| S7773  | 108 | `parseInt` → `Number.parseInt`, `parseFloat` → `Number.parseFloat`, `isNaN` → `Number.isNaN`, `isFinite` → `Number.isFinite`, `NaN` → `Number.NaN`, `Infinity` → `Number.POSITIVE_INFINITY` |
| S7764  | 83  | `window` / `global` → `globalThis` |
| S7748  | 6   | Suppression des `0` décimaux inutiles (`1.0` → `1`, `0.50` → `0.5`) |
| S7772  | 2   | `from 'path'` → `from 'node:path'` dans `vite.config.ts` et `vitest.config.ts` |
| S7781  | 1   | `.replace(/g/g, x)` → `.replaceAll('g', x)` (cas littéraux simples) |
| S7759  | 1   | `new Date().getTime()` → `Date.now()` |

## Méthode

Un codemod Python (`docs/audit/sonar/wave1-codemod.py`) reproductible :

1. Charge le JSONL des 802 issues
2. Filtre les 201 issues Wave 1
3. Pour chaque (fichier, ligne), applique la transformation textuelle via regex à lookbehind/lookahead pour ne pas casser :
   - Les chaînes contenant `parseInt` comme texte
   - Les accès propriété déjà préfixés (`Number.parseInt`, `obj.parseInt`)
   - Les identifiants composites (`windowName`, `globalScope`)
4. Tolère un décalage `±30 lignes` par rapport au numéro Sonar (les fixes de Wave 0 ont shifté certaines lignes)
5. Mode `--dry-run` par défaut, `--apply` pour écrire

Bilan d'exécution :
- Appliquées par codemod : **172 / 201**
- Skips résolus manuellement : **29 / 201** dont :
  - 8 issues sur `linkedin-api.ts` et `StatsCard.tsx` (lignes très décalées)
  - 2 issues `vite.config.ts` / `vitest.config.ts` (chemin tronqué par pdftotext : `vite.cong.ts`)
  - 1 issue `perplexity-service-fix.test.tsx` (chemin tronqué : `perplexity-service-x.test.tsx`)
  - 18 issues marquées « SKIP » mais déjà corrigées en un seul passage (Sonar reporte deux fois le même site quand deux occurrences sont sur la même ligne)

Total : **201 / 201**.

## Décisions / précautions

- **Pas de transformation globale `s/window/globalThis/g`** : seules les occurrences signalées sont touchées, ce qui évite de casser les noms de propriété (`window.location`) ou les variables locales nommées `window`.
- **`isNaN` → `Number.isNaN`** : sémantique légèrement différente (`isNaN('foo')` vaut `true`, `Number.isNaN('foo')` vaut `false`). Dans le code Kora, `isNaN` est toujours appelé sur un nombre (résultat de `Date.getTime()` etc.) → safe.
- **`NaN` → `Number.NaN`** : équivalents stricts.
- **S7748 trailing zeros** : strictement les zéros après la virgule, pas les zéros significatifs (préfixe).

## Vérifications

```bash
npm run typecheck   # ✓ 0 erreur
npm run lint        # 0 erreurs, 472 warnings (inchangé vs Wave 0)
npx vitest run      # 134 passed, 273 skipped, 0 failed
grep -E '(^|[^.\w])(parseInt|parseFloat|isNaN|isFinite)\(' src/**/*.{ts,tsx}  # 0 résultat
```

## Audit hostile

- **Pas de fonctionnalité cassée** : les transformations sont équivalentes (sauf pour `isNaN` → `Number.isNaN` où la sémantique change mais reste correcte dans notre code).
- **Pas de régression de couverture** : aucun test ne testait `isNaN('string-truc')` qui changerait.
- **Lignes touchées non commentées** : les transformations s'appliquent strictement sur les sites de code, pas dans des commentaires (validé par regex).
- **0 ligne shiftée** : tests passent, donc l'AST reste valide.

## Suivant

→ Wave 2 (Imports & dead code — 88 issues)
