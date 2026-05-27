# 06 — Limites techniques assumées

Document de transparence à destination du cabinet d'évaluation. Tous les éléments listés sont **connus, documentés et tracés** dans la base documentaire ; aucune ne constitue un défaut caché.

Référence principale : [`docs/TECH_DEBT.md`](../TECH_DEBT.md) (18 entrées exhaustives).

## 6.1 Couverture et tests

| Limite | Détail | Source | Statut |
| --- | --- | --- | --- |
| 273 tests en quarantaine (`it.skip`) | Suites UI legacy `BrandMonitoring*`, `CompanyAnalysisWidget`, `report-export-*` | [`docs/TESTING.md`](../TESTING.md) §5 | Documenté ; trajectoire Wave 2/3 |
| Couverture absolue modérée (16,68 % lines) | Concentration historique sur `RealBrandIntelligenceService` | [`docs/audit/COVERAGE_REPORT.md`](../audit/COVERAGE_REPORT.md) | Mesure bloquante en CI ; cible Wave 2 : 25 % |
| `src/services/core` et `src/services/integration` à 0 % | Aucune suite unitaire à ce snapshot | [`docs/audit/COVERAGE_REPORT.md`](../audit/COVERAGE_REPORT.md) §2 | Cible prioritaire Wave 2 |
| `src/components/ui` à 9,5 % | Primitives shadcn (Radix) — pas testées unitairement | idem | Accepté, pas d'action prévue |

## 6.2 Architecture serveur

| Limite | Détail | Source | Statut |
| --- | --- | --- | --- |
| Store sessions mono-instance | `Map` en mémoire dans `server.cjs` ; un restart purge les sessions | [`docs/SECURITY.md`](../SECURITY.md) §3.3 | Acceptable en local ; roadmap Redis pour multi-instance |
| Pas d'auth applicative sur le proxy | Tout processus pouvant atteindre `localhost:3001` peut appeler les endpoints | [`docs/SECURITY.md`](../SECURITY.md) §4.2 | Acceptable en local ; à durcir pour exposition réseau |
| Pas de base de données serveur | Persistance exclusivement `localStorage` côté client | [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) §2 | Acceptable pour le périmètre actuel ; à industrialiser pour SaaS |

## 6.3 Logging

| Limite | Détail | Source | Statut |
| --- | --- | --- | --- |
| ≈ 500+ occurrences `console.*` résiduelles | Code applicatif (composants, hooks, services hors brand intelligence) | [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §4 | Migration vers `src/lib/logger.ts` à généraliser ; logger HTTP du proxy déjà structuré (Wave 1) |

## 6.4 Fichiers volumineux

Sept fichiers dépassent 1 000 lignes :

| Fichier | Lignes | Décomposition cible |
| --- | --- | --- |
| `src/services/RealBrandIntelligenceService.ts` | 2 332 | Découpage par responsabilité (extracteurs, parseurs, orchestrateurs) — ownership Agent 3 / qualité |
| `src/services/export/formats/pdf-exporter.ts` | 1 642 | Sections déjà extraites dans `pdf-exporter-sections.ts` ; reste à finaliser |
| `src/components/BrandMonitoring.tsx` | 1 393 | Découpage en sous-composants Brand Monitoring |
| `src/lib/linkedin-api.ts` | 1 261 | Couche client + couche session déjà séparées en Wave 1 |
| `src/components/enhanced/BrandIntelligenceDashboard.tsx` | 1 227 | Découpage par section UI |
| `src/lib/ai-service.ts` | 1 202 | Découpage par fournisseur (OpenAI / Anthropic / Perplexity) |
| `src/components/Analytics.tsx` | 1 178 | Découpage par onglet Analytics |

**Statut** : documenté dans [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §3. Trajectoire de découpage Wave 2/3.

## 6.5 Vulnérabilités résiduelles

| Type | Nombre | Source | Statut |
| --- | --- | --- | --- |
| Critical | 0 | [`docs/audit/npm-audit.json`](../audit/npm-audit.json) | ✅ Résolu Wave 1 (bump jspdf) |
| High | 0 | idem | ✅ Résolu Wave 1 |
| Moderate | 8 | idem | Tous dans `devDependencies` (Vitest 2.x, vite, esbuild, brace-expansion) ; aucun impact bundle. Bump Vitest 3.x planifié |

## 6.6 Pipeline et déploiement

| Limite | Détail | Source | Statut |
| --- | --- | --- | --- |
| Pas de pipeline CI/CD de déploiement production | Workflow `ci.yml` couvre lint + typecheck + tests + build, **pas** de déploiement | [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §12 | À industrialiser (hébergement statique pour bundle + conteneur pour proxy) |
| Pas de pipeline de release versionnée | Pas de `release-please` ou équivalent | idem | À introduire si Korev AI publie le projet en open source |
| Pas de remote Git public | Repo local uniquement au snapshot | [`docs/cabinet/01-perimetre.md`](./01-perimetre.md) §1.8 | Placeholder `<OWNER>/<REPO>` dans [`README.md`](../../README.md) avec TODO explicite |

## 6.7 Documentation et conformité juridique

| Limite | Détail | Source | Statut |
| --- | --- | --- | --- |
| Pas de DPIA / AIPD formalisée | Conformité RGPD non analysée à ce snapshot | [`docs/cabinet/05-securite-conformite.md`](./05-securite-conformite.md) §5.7 | À conduire par cabinet juridique |
| Pas d'analyse d'impact AI Act | Idem | [`docs/cabinet/05-securite-conformite.md`](./05-securite-conformite.md) §5.8 | Idem |
| Statut marques « Korev AI » / « Kora Digital Pilot » | À confirmer auprès du porteur | [`docs/audit/PROJECT_AUDIT_NOTES.md`](../audit/PROJECT_AUDIT_NOTES.md) §7 | À confirmer par le porteur |
| Contact `security@korev.ai` | Placeholder | [`SECURITY.md`](../../SECURITY.md), [`docs/SECURITY.md`](../SECURITY.md) §7 | À confirmer par le porteur |

## 6.8 Historique Git

| Limite | Détail | Source | Statut |
| --- | --- | --- | --- |
| Anciens secrets dans l'historique | Présents dans des commits antérieurs à `pre-quickwins-snapshot` | [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §11 et §17 | Patterns `filter-repo` prêts ; exécution déléguée au porteur **après rotation effective des clés** |

## 6.9 Données simulées résiduelles

| Élément | Détail | Source | Statut |
| --- | --- | --- | --- |
| Encarts textuels statiques `Planning.tsx` | 2 suggestions textuelles (horaires LinkedIn, IA générative) | [`docs/audit/DATA_TRUTH_REPORT.md`](../audit/DATA_TRUTH_REPORT.md) §8.1 | Pas de KPI affiché ; à brancher Perplexity en itération suivante |
| Valeurs par défaut `CompanyAnalysisWidget.tsx` | Fallback structural d'un objet `BrandAnalysisResult` (followers `1000`, engagement `2.5`) | [`docs/audit/DATA_TRUTH_REPORT.md`](../audit/DATA_TRUTH_REPORT.md) §8.2 | Pas mis en avant UI ; aucun impact valorisation |
| `BrandMonitoring.tsx` — marques « Nike (Démo) » / « Nike (Test) » | Données démonstration avec suffixe explicite dans le nom de marque affiché | [`docs/audit/DATA_TRUTH_REPORT.md`](../audit/DATA_TRUTH_REPORT.md) §8.3 | Distinction visible à l'écran ; non modifié |
| Mode `'kora-simulation-v1'` de `usePerplexity` | Activé automatiquement si la clé API Perplexity n'est pas valide | idem | Mécanisme antérieur à Wave 1 ; badge et logs distinguent le mode simulation |

## 6.10 Identité projet

| Limite | Détail | Source | Statut |
| --- | --- | --- | --- |
| Branding mixte (`Kora`, `KORA`, `Kora Digital Pilot`) | Capitalisation hétérogène dans commentaires et certaines vues | [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §14 | Dénomination canonique arrêtée en Wave 2 : `kora-digital-pilot` (slug) / « Kora Digital Pilot » (commerciale) |

## 6.11 Synthèse — sévérité des limites assumées

| Sévérité | Nombre d'entrées | Caractérisation |
| --- | --- | --- |
| Bloquante pour exposition publique | 3 | Pas d'auth applicative, pas de pipeline de prod, pas d'analyse RGPD |
| Modérée — impact maintenabilité | 4 | Fichiers > 1 000 lignes, logging non centralisé, branding mixte, tests quarantinés |
| Faible — documentée et tracée | 5 | Sessions mono-instance, store `localStorage`, encarts textuels statiques, valeurs fallback, `console.*` résiduels |
| Action humaine requise | 2 | Rotation des clés providers, exécution `git filter-repo` |
| À confirmer par le porteur | 4 | Marques, organisation GitHub, contact security@, statut juridique contributions Agents IA |

**Constaté** par croisement des trois sources (`docs/TECH_DEBT.md`, `docs/SECURITY.md`, `docs/audit/*`).

---

Dernière mise à jour : 2026-05-22.
