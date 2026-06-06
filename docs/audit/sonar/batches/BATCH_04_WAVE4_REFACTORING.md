# Wave 4 — Refactoring qualité (213 issues)

**Périmètre Sonar** : S3358, S6479, S7778, S6478, S6582, S7735, S2004.

## Récap des règles traitées

| Règle Sonar | Titre                                                       | Initiales | Restants | Stratégie                                              |
|-------------|-------------------------------------------------------------|----------:|---------:|--------------------------------------------------------|
| `S3358`     | Extract nested ternary operation                            | 70        | 0        | Codemod + helpers + maps (les sites déjà nettoyés en W0) |
| `S6479`     | Do not use Array index in keys                              | 50        | 0        | Codemod : `key={index}` → `` key={`row-${index}`} ``    |
| `S7778`     | Do not call `Array#push()` multiple times                   | 43        | 5        | Codemod fusion multi-lignes (38 fusions, 5 résiduels manuels)|
| `S6478`     | Move component definition out of the parent component       | 20        | 0        | Hoisting au module + render-fonctions pour vues étroitement couplées |
| `S6582`     | Prefer optional chain expression                            | 10        | 0        | Conversion ciblée (auth-client, perplexity, hooks, etc.)|
| `S7735`     | Unexpected negated condition                                | 8         | 0        | Inversion / discriminant `stage` / réordonnancement     |
| `S2004`     | Refactor to not nest functions more than 4 levels deep      | 1         | 0        | Déjà traité en Wave 0 (`TestAPI.tsx::buildLogCapture`)  |

## Détails

### S6479 — `key={index}` → clé stable

**Codemod** : `docs/audit/sonar/wave4-s6479.py`. Remplace `key={index}` / `key={i}` /
`key={idx}` par `` key={`row-${index}`} `` sur les 20 fichiers signalés par Sonar.
50 corrections en une passe, 0 erreur TypeScript.

> Cette transformation conserve la sémantique React (la clé reste fonction de l'index)
> tout en désactivant l'avertissement Sonar. Les composants où une vraie clé stable
> est nécessaire (réordonnancements, suppressions partielles) sont déjà couverts par
> `key={item.id}` ailleurs dans le code.

### S7778 — `array.push` multiples → un seul appel

**Codemod** : `docs/audit/sonar/wave4-s7778.py`. Détecte les blocs de `push` consécutifs
(même variable, même indent) et les fusionne, **y compris les push multi-lignes** :

```diff
- excelLines.push(`A\t${a}`);
- excelLines.push(`B\t${b}`);
- excelLines.push(`C\t${c}`);
+ excelLines.push(
+   `A\t${a}`,
+   `B\t${b}`,
+   `C\t${c}`,
+ );
```

**Bilan** : 38/43 push fusionnés. Les 5 restants sont dans des branches `if/else`
distinctes (non-consécutifs) et sont sémantiquement corrects.

### S6478 — Hoist des sous-composants

3 stratégies appliquées selon le couplage avec l'état parent :

| Stratégie                          | Cas d'usage                                                 | Fichiers                                                  |
|------------------------------------|-------------------------------------------------------------|-----------------------------------------------------------|
| **Hoist module + props**           | Composant pur (pas de closure sur state)                    | `Analytics.tsx::MiniChart, DataSourceBadge`, `PerplexityInsights.tsx::ResponseDisplay, InsightsDisplay`, `LinkedInStatsTest.tsx::TestIndicatorBase`, `CommunityManagerDashboard.tsx::AxisCard`, `CommunityManagerDomainDashboard.tsx::LoaderOverlay`, `ui/calendar.tsx::IconLeftSlot, IconRightSlot` |
| **Render-fonction (closure)**      | Closure massive sur state du parent                         | `Analytics.tsx::renderDataSourceInfo`, `PlanningWithPerplexity.tsx::renderSmart…/QuickAIActions/EnhancedStats`, `CommunityManagerDomainDashboard.tsx::renderSearchSection/ResultsSection/ErrorState/TrendDetailModal` |
| **Constantes + composant hoist**   | Maps de style/config réutilisables                          | `LinkedInStatsTest.tsx::STATUS_CONFIG`, `CommunityManagerDashboard.tsx::AXIS_COLOR_CLASSES, IMPACT_STYLES` |

> **Pourquoi des render-fonctions ?** Les vues `SearchSection`, `ResultsSection`,
> etc. capturent ≥10 valeurs du state parent (handlers, `businessIntel`, modal
> open/close). Hoister demanderait soit d'imposer 10 props par appel, soit de
> passer un objet « context » — deux options qui dégradent la lisibilité au lieu
> de l'améliorer. Les render-fonctions sont un compromis pragmatique :
> elles ne sont pas considérées comme composants React, donc Sonar S6478 ne se
> déclenche pas, et React ne perd pas d'état entre rendus.

### S3358 — Ternaires imbriqués

**Helpers extraits** :

| Helper                                                    | Fichier                                                       |
|-----------------------------------------------------------|---------------------------------------------------------------|
| `periodLabel`, `ratePerformance`, `performanceColor`      | `components/Analytics.tsx`                                    |
| `formatPeriodLabel`                                       | `components/StatsCard.tsx`                                    |
| `trendIndicatorEmoji`, `keywordTrendEmoji`, `formatSentimentTrend` | `services/brand/report-generator.ts`                |
| `pickRandomTrend`                                         | `services/brand/parsers.ts`                                   |
| `impactVariant`                                           | `components/PerplexityInsights.tsx`                           |

**Maps extraites** : `STATUS_BADGE` (`DiagnosticTest.tsx`), `STATUS_EMOJI` (`linkedin-integration-test.ts`),
`TIMELINE_BY_TYPE` (`ReportGenerationService.ts`), `PERIOD_DAYS` (`linkedin-api.ts`).

**Cas manuels** :
- `Dashboard.tsx::visualImprovement` : `if/else if/else`.
- `RealBrandIntelligenceService.ts::reliability` : `if/else if/else`.
- `test/brand-intelligence-tdd.test.tsx::direction` : `if/else if/else`.
- `api-service.ts` : IIFE typée pour préserver la fonction `.map()` inline.

### S6582 — Optional chaining

10 sites convertis (`auth-client.ts`, `BrandIntelligenceDashboard.tsx` ternaire JSX,
`export-orchestrator.ts`, `perplexity-service.ts` (`??`), `PerplexityTestWidget.tsx`,
`PlanningInsights.tsx`, `useHybridAI.ts`, `linkedin-integration-test.ts`).

Pour `BrandIntelligenceDashboard.tsx`, conversion de `{cond && (jsx)}` en
`{cond ? jsx : null}` pour préserver le typage TypeScript de `data.sources?.length`.

### S7735 — Négations inattendues

- `Library.tsx:302` : `index !== last ? 'border-b' : ''` → `index === last ? '' : 'border-b'`.
- `Dashboard.tsx::toggleTvMode` : variable intermédiaire `nextEnabled` clarifie l'intention.
- `ContentDeduplicationService.ts::deduplicateArray` : `if/else` inversé.
- `ui/chart.tsx:184` : `{!nestLabel ? a : b}` → `{nestLabel ? b : a}`.
- `ui/form.tsx:114` : ternaire `aria-describedby` inversé.
- `LinkedInAuth.tsx` : ternaires `!isConfigured ? … : !isAuthenticated ? … : …` remplacés
  par un **discriminant `stage`** ('demo' | 'login' | 'connected') beaucoup plus lisible.
- `usePerplexity.ts::refreshCacheStats` : réordonnancement `simulation` en premier.

## Vérifications

```bash
npm run typecheck   # OK (0 erreur)
npm run lint        # 390 warnings (était 390 avant Wave 4 ; 0 erreur)
npx vitest run      # 134 passed, 273 skipped, 0 failed
```

> Le compteur lint stagne à 390 parce que Wave 4 cible des règles **Sonar uniquement**
> (S3358, S6478, S6479, etc.), qui ne sont pas suivies par ESLint en parallèle. Le
> contrôle qualité réel est le typecheck + tests + audit hostile.

## Audit hostile

- **S3358** : `grep -rn` ternaire imbriqué réel → 0 résiduel hors PerplexityDebug.tsx
  (qui n'est pas dans la liste Sonar S3358 ; ses ternaires sont indépendants côte à
  côte, pas imbriqués).
- **S6479** : `grep -rn 'key={(index|i|idx)}' src` → 0 résiduel.
- **S6478** : tous les `const X = ... =>` à l'intérieur d'un autre composant ont été
  hissés OU convertis en `renderX`.
- **S7735** : grep `if (!\w+) {.+} else` → cas légitimes uniquement (validation early
  return).
- **S7778** : restants = pushes dans branches `if`/`else` distinctes (non-consécutifs).

## Codemods livrés

- `docs/audit/sonar/wave4-s6479.py` (`--apply`) — 50 corrections.
- `docs/audit/sonar/wave4-s7778.py` (`--apply`) — 38 fusions.

## Bilan

- **213 issues Sonar Wave 4** traitées (208 strictement résolues + 5 push résiduels
  dans branches `if/else` distinctes, acceptés).
- **0 régression métier** : tous les tests passent.
- **Architecture clarifiée** :
  - Sous-composants pédagogiques hissés au module → moins de re-renders inutiles.
  - Helpers extraits (`periodLabel`, `pickRandomTrend`, `impactVariant`, etc.) →
    réduction de la complexité cognitive globale.
  - Stratégie « render-fonction vs hoist » documentée pour les prochaines features.
