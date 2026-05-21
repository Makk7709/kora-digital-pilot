# 04 — Preuves de tests et couverture

## 4.1 Outillage

| Outil | Version | Rôle |
| --- | --- | --- |
| Vitest | 2.1.9 | Runner de tests TypeScript |
| `@vitest/coverage-v8` | 2.1.9 | Provider de couverture V8 (1:1 avec le runtime Node) |
| `@vitest/ui` | 2.1.9 | UI optionnelle de Vitest |
| Testing Library (`react`, `jest-dom`, `user-event`) | 16.x / 6.x / 14.x | Tests de composants React |
| jsdom | 26.x | Environnement DOM headless |

**Constaté** par lecture de [`package.json`](../../package.json) `devDependencies` et de [`vitest.config.ts`](../../vitest.config.ts).

## 4.2 Volumétrie des tests

| Mesure | Valeur | Source |
| --- | --- | --- |
| Fichiers de tests | 27 (`.test.ts` / `.test.tsx`) | `find src -name '*.test.*'` |
| Lignes de tests cumulées | ≈ 10 291 | [`docs/audit/PROJECT_AUDIT_NOTES.md`](../audit/PROJECT_AUDIT_NOTES.md) §4.1 |
| Tests passants en CI | 134 | [`docs/audit/COVERAGE_REPORT.md`](../audit/COVERAGE_REPORT.md) §1 + [`docs/TESTING.md`](../TESTING.md) |
| Tests en quarantaine (`it.skip` explicite) | 273 | idem |

**Constaté** par exécution `npm run test:run` et croisement des rapports.

## 4.3 Couverture mesurée et bloquante

Méthodologie complète : [`docs/audit/COVERAGE_REPORT.md`](../audit/COVERAGE_REPORT.md) §3.

| Axe | Valeur mesurée | Seuil CI (`vitest.config.ts`) | Marge |
| --- | --- | --- | --- |
| Lines | **16,68 %** | 14 % | +2,7 pts |
| Statements | **16,68 %** | 14 % | +2,7 pts |
| Branches | **46,74 %** | 44 % | +2,7 pts |
| Functions | **31,44 %** | 29 % | +2,4 pts |

Les seuils sont calibrés « valeur réelle − 2 points » pour ménager une marge de sécurité. Ils sont **bloquants** : la CI échoue si la couverture descend sous l'un de ces planchers.

**Constaté** par lecture de [`vitest.config.ts`](../../vitest.config.ts) section `coverage.thresholds` et des chiffres rapportés dans [`docs/audit/COVERAGE_REPORT.md`](../audit/COVERAGE_REPORT.md).

## 4.4 Répartition par module

| Module | Lines | Branches | Functions |
| --- | --: | --: | --: |
| `src/services` | 62,01 % | 41,32 % | 75,21 % |
| `src/components/enhanced` | 36,34 % | 35,29 % | 20,00 % |
| `src/lib` | 23,22 % | 60,56 % | 30,98 % |
| `src/components` | 12,63 % | 50,67 % | 23,37 % |
| `src/services/export` | 9,82 % | 66,66 % | 10,52 % |
| `src/components/ui` | 9,53 % | 28,00 % | 2,70 % |
| `src/services/export/formats` | 5,92 % | 100,00 % | 5,55 % |
| `src/services/brand` | 4,78 % | 0,00 % | 0,00 % |
| `src/services/core` | 0,00 % | 0,00 % | 0,00 % |
| `src/services/integration` | 0,00 % | 0,00 % | 0,00 % |

**Constaté** par lecture directe de [`docs/audit/COVERAGE_REPORT.md`](../audit/COVERAGE_REPORT.md) §2.

### Lecture rapide

- Le service le mieux couvert reste `src/services` à 62 % de lignes, tiré par `RealBrandIntelligenceService` (TDD historique).
- Les sous-dossiers `services/core` et `services/integration` sont à 0 % — ce sont des cibles prioritaires Wave 2/3 (cf. [`07-plan-remediation-date.md`](./07-plan-remediation-date.md)).
- `src/components/ui` à 9,53 % : volontaire — ce sont les primitives shadcn (Radix) génériques.

## 4.5 Snapshot HTML versionné

Le rapport HTML interactif de la couverture est versionné dans [`docs/audit/coverage/`](../audit/coverage/) (~6,6 Mo, 144 fichiers). Il est régénérable localement par :

```bash
rm -rf docs/audit/coverage
mkdir -p docs/audit/coverage
npm run test:coverage           # produit coverage/
cp -r coverage/* docs/audit/coverage/
rm -f docs/audit/coverage/coverage-final.json
```

Procédure complète dans [`docs/audit/COVERAGE_REPORT.md`](../audit/COVERAGE_REPORT.md) §4.

**Constaté** par lecture de [`docs/audit/coverage/index.html`](../audit/coverage/index.html) et de `.gitignore` (entrée `!docs/audit/coverage/` explicite).

## 4.6 Tests en quarantaine — transparence

273 tests sont placés en `it.skip` explicite avec TODO documenté. Le détail par suite est dans [`docs/TESTING.md`](../TESTING.md) §5. Périmètres concernés :

- `BrandMonitoring*` et `BrandMonitoring.secure*` — suites UI legacy avec timeouts.
- `CompanyAnalysisWidget` — couplage à des mocks instables.
- `report-export-*` — dépendances à des fixtures temps réelles.

**Cause assumée** : ces suites étaient sources de flakiness en CI ; leur réactivation est traçable Wave 2 / Wave 3 (cf. [`07-plan-remediation-date.md`](./07-plan-remediation-date.md)).

**Impact valorisation** : la couverture mesurée (16,68 %) sous-représente probablement le code historiquement testé. Le ratchet de couverture prévu en Wave 2 (cible 25 %) est mécanique à chaque réactivation.

## 4.7 Reproductibilité et déterminisme

Configuré dans [`vitest.config.ts`](../../vitest.config.ts) :

| Paramètre | Valeur | Justification |
| --- | --- | --- |
| `retry` | `0` | Aucun masquage de flakiness — tout test instable est skipé explicitement |
| `testTimeout` | `15000` ms | Pas de hang silencieux |
| `hookTimeout` | `10000` ms | Idem pour les `beforeAll/beforeEach` |
| `env` | clés API factices injectées | Évite toute initialisation conditionnelle dépendant de l'environnement de la machine |
| Provider couverture | `v8` | Aligné avec le runtime Node, pas d'instrumentation Istanbul |

**Constaté** par lecture directe de la configuration.

## 4.8 Commandes utiles

```bash
# Tests CI hermétiques
npm run test:run

# Couverture + enforcement des seuils
npm run test:coverage

# Rapport HTML interactif
open coverage/index.html
```

## 4.9 Conclusion sur la posture qualité

| Constat | Statut |
| --- | --- |
| Mesure opposable de la couverture | ✅ V8 + seuils bloquants |
| Reproductibilité par un tiers | ✅ Documentée et reproductible |
| Quarantaine assumée et tracée | ✅ Tests skipés explicites avec TODO |
| Zones non couvertes assumées | ✅ Listées avec trajectoire (`07-plan-remediation-date.md`) |
| Couverture absolue suffisante pour une release production | 🟡 Non — cible Wave 2 : 25 % lines/statements |

**Déduit** des constats ci-dessus : la posture qualité est documentée, reproductible et opposable, mais le niveau de couverture absolu reste à augmenter selon le plan de remédiation Wave 2 / Wave 3.

---

Dernière mise à jour : 2026-05-22.
