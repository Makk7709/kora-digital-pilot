# Coverage Report — Kora (Wave 1)

| Field | Value |
|-------|-------|
| Date  | 2026-05-21 |
| Branche | `feat/ci-tests-stable` |
| Base | `main` au tag `valuation-prep-merged` |
| Commit | (voir `git log` de la branche ; généré sur `6b80a3f` + ce commit) |
| Runner | Node 20.19.3 · npm 10.8.2 · Vitest 2.1.9 · provider `v8` |
| Commande de reproduction | `npm ci && npm run test:coverage` |

> **Snapshot HTML** : `docs/audit/coverage/index.html` (versionné, ~6,6 Mo,
> 144 fichiers). Rapport brut regénérable sous `coverage/` après chaque
> run local (et uploadé en artifact GitHub `coverage-<sha>`).

---

## 1. Global

| Axe         | %       | Seuil CI (`vitest.config.ts`) | Marge |
|-------------|--------:|------------------------------:|------:|
| Lines       | **16.68 %** | 14 %                       | +2.7 pts |
| Statements  | **16.68 %** | 14 %                       | +2.7 pts |
| Branches    | **46.74 %** | 44 %                       | +2.7 pts |
| Functions   | **31.44 %** | 29 %                       | +2.4 pts |

Les seuils sont calibrés "valeur réelle − 2 points" pour donner une
marge de sécurité (cf. brief Wave 1). Ils sont **bloquants** : la CI
échoue si la couverture descend sous l'un de ces planchers.

---

## 2. Par module

| Module                    | Lines | Branches | Functions | Statements |
|---------------------------|------:|---------:|----------:|-----------:|
| `src/components`          | 12.63 | 50.67    | 23.37     | 12.63 |
| `src/components/enhanced` | 36.34 | 35.29    | 20.00     | 36.34 |
| `src/components/ui`       |  9.53 | 28.00    |  2.70     |  9.53 |
| `src/lib`                 | 23.22 | 60.56    | 30.98     | 23.22 |
| `src/services`            | 62.01 | 41.32    | 75.21     | 62.01 |
| `src/services/brand`      |  4.78 |  0.00    |  0.00     |  4.78 |
| `src/services/core`       |  0.00 |  0.00    |  0.00     |  0.00 |
| `src/services/export`     |  9.82 | 66.66    | 10.52     |  9.82 |
| `src/services/export/formats` | 5.92 | 100.00 |  5.55     |  5.92 |
| `src/services/integration` | 0.00 |  0.00    |  0.00     |  0.00 |

### Lecture rapide

* Les services "noyau" qui parsent / persistent (`services/core`,
  `services/integration`) sont les zones les plus risquées :
  **aucune ligne couverte**. Cible Wave 2.
* `src/services` reste la partie la mieux couverte (62 % de lignes)
  grâce aux suites héritées encore actives.
* `src/components/ui` est volontairement bas : la plupart sont des
  primitives `shadcn` non testées unitairement. Acceptable pour la
  Wave 1.

---

## 3. Méthodologie

1. **Provider** : `@vitest/coverage-v8` 2.1.9. V8 est aligné avec le
   runtime Node (pas d'instrumentation Istanbul, pas de transformer
   parallèle ; mesure 1:1 ce qui s'exécute).
2. **Inclusion** : `src/services/**/*.ts`, `src/lib/**/*.ts`,
   `src/components/**/*.tsx`. Voir `vitest.config.ts > coverage.include`.
3. **Exclusion** : tests, fichiers `*.test.*`, `node_modules`. Idem
   `coverage.exclude`.
4. **Reproductibilité** :
   * `retry: 0` — pas de masquage de flakiness.
   * `testTimeout: 15s`, `hookTimeout: 10s` — pas de hang silencieux.
   * `env` injecte des clés API factices pour éviter toute initialisation
     conditionnelle qui aurait pu varier d'une machine à l'autre.
5. **Skips** : 273 tests sont actuellement skipés (voir
   `docs/TESTING.md > 5. Suites quarantinées`). Cela tire la couverture
   vers le bas — c'est conscient et tracé. Chaque suite réactivée en
   Wave 2 fera mécaniquement remonter les seuils.

---

## 4. Commandes utiles

```bash
# Run unique avec couverture + enforcement des seuils
npm run test:coverage

# Rapport HTML interactif local
open coverage/index.html

# Reproduire l'archive figée dans docs/
rm -rf docs/audit/coverage
mkdir -p docs/audit/coverage
cp -r coverage/* docs/audit/coverage/
rm -f docs/audit/coverage/coverage-final.json   # 2 Mo, inutile pour la revue
```

---

## 5. Risques connus & plan d'évolution

| Risque | Impact | Plan |
|--------|--------|------|
| Coverage `lines/statements` à 16,68 % | Couverture insuffisante pour détecter une régression non triviale. | Wave 2 : réactiver `BrandMonitoring*`, `CompanyAnalysisWidget`, `report-export-*` (cf. `docs/TESTING.md`). Cible Wave 2 : 25 % `lines/statements`. |
| `services/core` à 0 % | Bug silencieux possible dans le cœur d'analyse. | Suite de tests unitaires `BrandAnalysisCore` à écrire (Wave 2). |
| `services/integration` à 0 % | Aucun test sur l'intégration LinkedIn / Perplexity orchestrée. | Tests d'intégration mockés (Wave 3, dépend Agent 1). |
| `components/ui` à 9,5 % | Faux négatif accepté : ce sont des primitives shadcn génériques. | Pas d'action prévue. |
| 273 tests skipés | Faux sentiment de sécurité. | Cf. `docs/TESTING.md`. |
