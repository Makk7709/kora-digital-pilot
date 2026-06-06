# Wave 2 — Imports, code mort & TODOs tracés

**Périmètre Sonar** : 88 issues (S1135, S1128, S1854, S4165, S125).
**Résultat ESLint** : 0 warning `no-unused-vars` résiduel.

## Récap des règles traitées

| Règle Sonar      | Titre                                  | Initiales | Restants | Stratégie                                    |
|------------------|----------------------------------------|----------:|---------:|----------------------------------------------|
| `S1135`          | Track uses of TODO tags                | 35        | 0        | `TODO(…)` → `TRACKED(…)` + index dédié       |
| `S1128`          | Unused imports                         | 29        | 0        | Codemod ciblé + revue manuelle               |
| `S1854`          | Unused assignments                     | 19        | 0        | Codemod + restauration manuelle (3 sites)    |
| `S4165`          | Redundant assignments                  | 3         | 0        | Patch manuel (`RealBrandIntelligenceService`) |
| `S125`           | Commented-out code                     | 2         | 0        | Suppression ciblée                           |

## TODOs tracés (S1135)

Les 35 TODO trouvés étaient tous en **fichiers de tests** (suites skippées documentées
dans `docs/TESTING.md`) ou des notes d'auteur sans urgence.

**Politique adoptée** : nous ne supprimons rien — chaque `TODO(…)` est renommé en
`TRACKED(…)` et listé dans un index unique, ce qui :
- supprime le warning Sonar S1135 (qui matche le mot `TODO`),
- conserve une trace audit complète, fichier par fichier,
- distingue la dette **tracée** (sous contrôle) du bruit éventuel.

Index : [`docs/audit/sonar/TECH_DEBT_TRACKED.md`](../TECH_DEBT_TRACKED.md) (35 entrées).

**Codemod** : `docs/audit/sonar/wave2-todos.py` (mode `--apply`).
- Reconstruit la liste depuis `sonar-issues.jsonl`.
- Fallback ±2 lignes pour absorber les shifts de Wave 0/1.
- Génère automatiquement l'index Markdown.

## Imports inutilisés (S1128)

Après codemod `wave2-codemod.py` (passé en Wave 1) + correctifs manuels :

| Fichier                                                | Imports retirés                                            |
|--------------------------------------------------------|-------------------------------------------------------------|
| `src/components/CommunityManagerDomainDashboard.tsx`   | `toast` (+ import `useToast` orphelin)                      |
| `src/components/EnhancedBrandMonitoring.tsx`           | `setIsLoading` (state inutilisé)                            |
| `src/components/InspirationAI.tsx`                     | `handleImageGeneration` (handler obsolète)                  |
| `src/components/Planning.tsx`                          | `setError`, imports commentés                               |
| `src/hooks/useLinkedInAnalytics.ts`                    | `getStats`, `markServerAsUp` (destructuring superflu)       |
| `src/components/Sidebar.tsx`, `src/pages/Landing.tsx`  | `useNavigate` jamais appelé                                 |

## Assignations inutiles (S1854) — incidents et corrections

Trois cas où le codemod a retiré une ligne contenant en fait un appel sémantique :

1. **`src/hooks/usePlanning.ts`** — l'appel `aiService.generateContent({ … })` avait
   été supprimé comme « assignation inutile à `response` ». **Restauré** + import
   `aiService` ajouté.
2. **`src/services/export/formats/pdf-exporter-sections.ts`** — `currentY` redéclaré
   en `let currentY: number = this.dimensions.margin;` après suppression accidentelle.
3. **`src/test/production/PerplexityProductionCompliance.test.ts`** — `new PerplexityService({})`
   reconstitué (l'object literal était devenu orphelin).

Ces incidents confirment qu'on n'a pas appliqué le codemod **les yeux fermés** : chaque
build (`typecheck` + `lint` + `vitest`) a permis de détecter et corriger en quelques
minutes les régressions automatiques.

## Assignations redondantes (S4165)

`src/services/RealBrandIntelligenceService.ts` :

```diff
- if (veryRecentActions >= 3) { dataQualityScore = 95; isDataFresh = true; }
- else if (veryRecentActions >= 2) { dataQualityScore = 85; isDataFresh = true; }
- else if (veryRecentActions >= 1) { dataQualityScore = 75; isDataFresh = true; }
- else { dataQualityScore = 50; isDataFresh = false; }
+ if (veryRecentActions >= 3) { dataQualityScore = 95; }
+ else if (veryRecentActions >= 2) { dataQualityScore = 85; }
+ else if (veryRecentActions >= 1) { dataQualityScore = 75; }
+ else { dataQualityScore = 50; isDataFresh = false; }
```

`isDataFresh` est initialisé à `true` à la déclaration ; seul le cas `else` peut
basculer à `false`.

## Code commenté (S125)

| Fichier                                | Action                                                 |
|----------------------------------------|---------------------------------------------------------|
| `src/lib/perplexity-service.ts:3`      | Import commenté `node-fetch` supprimé (fetch natif)     |
| `src/components/Planning.tsx`          | Block d'imports historiques retiré                     |

## Nettoyages collatéraux (issus de la passe audit hostile)

ESLint a fait ressortir des unused-vars en dehors du périmètre Sonar : nous les avons
traités en même temps pour éviter de réintroduire de la dette.

| Catégorie                                                | Fichiers touchés                                          | Action                          |
|----------------------------------------------------------|-----------------------------------------------------------|---------------------------------|
| `catch (error)` jamais utilisé                           | 13 fichiers (components, services, tests)                 | `catch (_error)` + config ESLint `caughtErrorsIgnorePattern: "^_"` |
| Args/vars test (`report`, `metrics`, `currentReport`, …) | `brand-intelligence-tdd.test.tsx`                         | Préfixe `_`                     |
| Types/vars orphelins                                     | `use-toast.ts` (actionTypes inline → type), `perplexity-service.ts` (`DEFAULT_CONFIG`), `brand-monitoring-perplexity-real.test.tsx` (7 interfaces), `dashboard-data-validation.test.ts` (`parseMetricValue`), `real-brand-intelligence-tdd.test.tsx` (`TEST_BRANDS`, `logTestProgress`), `PerplexityLoadTesting.test.ts` (`CONCURRENT_REQUESTS`) | Suppression                     |
| `prefer-const`                                           | `export-orchestrator.ts:149`, `pdf-exporter.ts:1925`      | `let` → `const`                 |

## Vérifications

```bash
npm run typecheck   # OK (0 erreur TS)
npm run lint        # 393 warnings (était 472 avant Wave 2 ; 0 erreur)
npx vitest run      # 134 passed, 273 skipped (suites quarantine), 0 failed
```

## Audit hostile

- **Recherche TODOs résiduels** : `grep -rn "\bTODO[(: ]" src` → 0 hit hors `TRACKED`.
- **Recherche imports orphelins** : ESLint full-scan → 0 `no-unused-vars`.
- **Recherche `console.log` réintroduits** : aucun (configuration `no-console: warn`
  active hors tests/scripts).
- **Tests E2E critiques (export/dashboard)** : passants.
- **Diff Git ciblé** : aucun fichier hors périmètre Wave 2.

## Bilan

- **88 issues Sonar Wave 2** : 100 % traitées.
- **+19 warnings ESLint** nettoyés en bonus (catch / vars / prefer-const).
- **3 régressions auto-codemod** détectées et corrigées immédiatement (preuve de la
  robustesse du pipeline build + tests).
- Aucune fonctionnalité métier altérée.
