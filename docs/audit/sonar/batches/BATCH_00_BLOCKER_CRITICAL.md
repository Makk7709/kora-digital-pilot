# Batch 00 — BLOCKER + CRITICAL (15 issues)

> Wave 0 / Sonar cleanup  
> Sévérités traitées : 1 BLOCKER + 14 CRITICAL  
> Statut : ✅ Corrigées, typecheck OK, lint 0 erreurs, 134 tests verts (0 fail)

## Périmètre

15 issues à très forte criticité issues du rapport Sonar `Kora Sonar.pdf` :

| # | Sévérité | Règle | Fichier | Ligne | Description |
|---|----------|-------|---------|------:|-------------|
| 1 | BLOCKER  | S3516 | `src/components/InspirationAI.tsx` | 204 | `getPrimaryAIBadge` retournait toujours `'Kora IA'` (constante) |
| 2 | CRITICAL | S3776 | `src/components/enhanced/BrandIntelligenceDashboard.tsx` | 145 | `exportReport` — complexité 16 → 15 |
| 3 | CRITICAL | S3776 | `src/components/CommunityManagerDashboard.tsx` | 277 | `AxisCard` — complexité 22 → 15 (ternaires color/impact extraits en tables) |
| 4 | CRITICAL | S3776 | `src/services/ContentDeduplicationService.ts` | 285 | `mergeSmartContent` — complexité 16 → 15 |
| 5 | CRITICAL | S3776 | `src/components/DiagnosticTest.tsx` | 18 | `runDiagnostics` — complexité 24 → 15 (5 try/catch fragmentés) |
| 6 | CRITICAL | S7059 | `src/lib/linkedin-api.ts` | 131 | `void this.restoreSession()` retiré du constructeur |
| 7 | CRITICAL | S3776 | `src/lib/linkedin-api.ts` | 571 | `getOrganizationPosts` — complexité 18 → 15 |
| 8 | CRITICAL | S3776 | `src/components/LinkedInDashboardWidget.tsx` | 28 | Composant éclaté en `CompactWidget` + `FullWidget` + `MetricBlock` + `TrendArrow` (39 → 15) |
| 9 | CRITICAL | S3776 | `src/lib/perplexity-service.ts` | 360 | `parseMarketInsights` — complexité 16 → 15 |
| 10 | CRITICAL | S3776 | `src/services/brand/report-generator.ts` | 98 | `extractKeyInsights` — complexité 19 → 15 (6 helpers thématiques) |
| 11 | CRITICAL | S3776 | `src/services/brand/report-generator.ts` | 221 | `generateRecommendedActions` — complexité 20 → 15 (4 helpers thématiques) |
| 12 | CRITICAL | S3776 | `src/lib/server-detection.ts` | 89 | `checkServerStatus` — complexité 22 → 15 (`probeHealth` + handlers transitions) |
| 13 | CRITICAL | S3776 | `src/components/StatsCard.tsx` | 36 | `StatsCard` — sous-composants hissés au top-level |
| 14 | CRITICAL | S3735 | `src/contexts/TenantContext.tsx` | 107 | `void refresh()` → `refresh().catch(logger.error)` |
| 15 | CRITICAL | S2004 | `src/components/TestAPI.tsx` | 18 | `logCapture` hissé en top-level pour casser l'imbrication |

## Stratégies de correction appliquées

### Cognitive complexity (S3776, 10 occurrences)

Trois patterns récurrents :

1. **Extraction de helpers thématiques** — fonctions privées par axe métier qui retournent une liste de résultats partiels, agrégés par la fonction publique. Ex. `extractKeyInsights` → 6 helpers (sentiment, mentions, competitive, keyword, swot, alert).
2. **Externalisation des palettes de styles** — `Record<string, {...}>` constants au lieu de chaînes de ternaires imbriquées. Ex. `AXIS_COLOR_CLASSES`, `IMPACT_STYLES`, `STATUS_CONFIGS`.
3. **Hoisting de sous-composants** — sortir les sous-composants définis à l'intérieur du corps d'un FC les empêche d'être comptés dans la complexité du parent (et corrige aussi S6478 « React components should not be nested »). Appliqué dans `LinkedInDashboardWidget` et `StatsCard`.

### Async in constructor (S7059)

Le constructeur de `LinkedInAPI` lançait `void this.restoreSession()` opportunistiquement. Les hooks consommateurs (`useLinkedInAnalytics`) appellent déjà `restoreSession()` explicitement au mount → le double appel ne sert à rien et viole le cycle de vie déterministe. Suppression simple, commentaire explicatif laissé en place.

### `void` operator (S3735)

`void refresh()` masquait silencieusement les erreurs de `refresh()`. Remplacé par `refresh().catch((error) => logger.error(...))` : le warning Sonar disparaît, et on récupère une trace utile en cas de panne Supabase.

### Functions nested too deeply (S2004)

`TestAPI` définissait `logCapture` (qui retourne lui-même une fonction) à l'intérieur d'un `useEffect` à l'intérieur du composant — 4 niveaux atteints, plus le `setLogs(prev => …)` faisait basculer à 5. Le helper `buildLogCapture(level, originals, appendLog)` est désormais hissé au top-level du module.

### Invariant return (S3516)

`getPrimaryAIBadge` parcourait 4 conditions différentes pour toujours retourner `'Kora IA'`. Remplacé par une constante `PRIMARY_AI_BADGE` documentée : la séparation logique provider / libellé produit est volontaire (le badge marque l'identité du produit indépendamment du moteur).

## Vérifications

```bash
npm run typecheck   # ✓ 0 erreur
npm run lint        # 0 erreurs, 472 warnings (vs 493 avant - 21 warnings éliminés)
npx vitest run      # 134 passed, 273 skipped, 0 failed (12 suites)
```

## Audit hostile

- **Régression métier ?** Aucune ; les helpers extraits préservent les contrats des fonctions publiques (signatures, ordre des sorties, branches d'erreur).
- **Sub-components instables ?** `LinkedInDashboardWidget` et `StatsCard` ont leurs sous-composants désormais au module-scope → identité stable entre renders (corrige aussi indirectement S6481).
- **Suppression d'opération async dans constructor ?** Vérifié que les 2 hooks (`useLinkedInAnalytics`) appellent explicitement `restoreSession()` au mount ; aucun comportement perdu.
- **`void` removed ?** Le `.catch` ajouté logge via `logger.error` (déjà importé dans le projet) au lieu d'avaler silencieusement.
- **`getPrimaryAIBadge` invariant** : confirmé en relisant les 4 branches de l'ancienne fonction — toutes renvoyaient `'Kora IA'`.

## Diff résumé

```
 src/components/CommunityManagerDashboard.tsx      | +60 -54
 src/components/DiagnosticTest.tsx                 | +95 -90
 src/components/InspirationAI.tsx                  | +4 -19
 src/components/LinkedInDashboardWidget.tsx        | +152 -148  (réécriture)
 src/components/StatsCard.tsx                      | +6 -8
 src/components/TestAPI.tsx                        | +20 -18
 src/components/enhanced/BrandIntelligenceDashboard.tsx | +94 -77
 src/contexts/TenantContext.tsx                    | +5 -2
 src/lib/linkedin-api.ts                           | +95 -120
 src/lib/perplexity-service.ts                     | +35 -20
 src/lib/server-detection.ts                       | +52 -46
 src/services/ContentDeduplicationService.ts       | +20 -18
 src/services/brand/report-generator.ts            | +150 -98
```

## Suivant

→ Wave 1 (APIs natives & globals — 201 issues mécaniques)
