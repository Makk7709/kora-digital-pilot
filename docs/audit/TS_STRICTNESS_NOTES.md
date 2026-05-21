# TypeScript Strictness — Notes d'audit (Wave 2, Agent 3)

Date: 2026-05-22
Branche: `feat/ts-quality`
Périmètre: progression progressive vers `strict: true` dans `tsconfig.app.json`,
sans casser la compilation ni les 134 tests.

## État du module `tsconfig.app.json`

| Flag | Avant Wave 2 | Après Wave 2 | Justification |
|---|---|---|---|
| `strict` | `false` | `false` | Activable une fois les flags individuels passants. |
| `noImplicitAny` | `false` (tech-debt 51 erreurs) | **`true`** ✅ | 19 erreurs résiduelles fixées (type explicit, `Record<string, ...>` casts). |
| `strictNullChecks` | `false` | `false` (laissé) | 55 erreurs résiduelles, au-dessus du seuil interne (50). Concentration: BrandIntelligenceDashboard.tsx (33), ReportGenerationService.ts (10), useBusinessIntelligence.ts (5), BrandMonitoring.tsx (4), useLinkedInAnalytics.ts (2). |
| `noUnusedLocals` | `false` | `false` (laissé) | 176 erreurs au TS, déjà couvertes par la règle eslint `@typescript-eslint/no-unused-vars` (warning, pas error). Activer génèrerait du bruit dupliqué. |
| `noUnusedParameters` | `false` | `false` (laissé) | Idem: doublon avec eslint. |
| `noFallthroughCasesInSwitch` | `false` | `false` | Pas suffisamment d'opportunités, hors scope. |

## Détail `strictNullChecks`

55 erreurs réparties sur 6 fichiers. Cause principale: les types
`SWOTMetrics`, `CompetitiveMetrics`, `ContentMetrics` (dans
`src/types/BrandIntelligenceTypes.ts`) ont leurs sous-objets marqués comme
optionnels (`?`), alors que les composants/services consommateurs supposent
qu'ils sont toujours présents après `parseRealXxx` du `RealBrandIntelligenceService`.

Deux pistes pour une itération future:

1. **Resserrer les types métier** dans `BrandIntelligenceTypes.ts` :
   transformer les champs garantis par les parsers en propriétés
   non-optionnelles, et utiliser des unions discriminantes pour les états
   pré/post-parsing.
2. **Optional chaining systématique** côté composants (`a?.b?.c`) : plus
   rapide à appliquer mais cosmétique, n'élimine pas la dette.

Recommandation: option 1 — un sprint de 1-2j de typing dédié aux 6
fichiers identifiés permettra d'activer `strictNullChecks` proprement.

## Reduce-any progression

Voir le récap dans le commit oneline. État:

- Avant: 302 occurrences `@typescript-eslint/no-explicit-any` warnings.
- Après: cible ≤ 200 (cf. `npm run lint`).

Stratégie privilégiée:

- `unknown` + narrowing pour les payloads externes.
- Interfaces dédiées dans `src/lib/ai/types.ts`,
  `src/services/brand/real/recommendations.ts` (DraftRecommendation,
  AlertRecord), `src/services/export/formats/pdf/styles.ts` (PdfDimensions).
- Casts ciblés `as unknown as T` quand le type métier est trop large pour
  une inférence clean (ex: parsers Perplexity).

## Suite recommandée (hors Wave 2)

1. Sprint typing — `strictNullChecks: true` + resserrement de
   `BrandIntelligenceTypes.ts`.
2. Activer `noUnusedLocals` / `noUnusedParameters` après campagne unique
   de préfixes `_` (sinon double-bruit avec eslint).
3. Quand les trois précédents passent, basculer `strict: true` et retirer
   les flags individuels redondants.
