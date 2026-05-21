# Modèle de données

Description des types métier principaux et du périmètre de persistance de Kora Digital Pilot.

## 1. Périmètre de persistance

La plateforme ne stocke aucune donnée côté serveur. Tout l'état applicatif persistant est sérialisé dans le `localStorage` du navigateur de l'utilisateur. Le proxy `server.cjs` est sans état (à l'exception de compteurs en mémoire pour le rate limiting et les métriques).

Conséquences :

- Pas de synchronisation multi-utilisateurs ni multi-appareils.
- Aucune donnée personnelle structurée n'est conservée hors du poste utilisateur.
- La perte du `localStorage` (mode navigation privée, nettoyage manuel) entraîne la perte du planning, de l'historique d'exports et de la session LinkedIn.

## 2. Clés `localStorage` utilisées

| Clé | Module détenteur | Contenu | Sensibilité |
| --- | --- | --- | --- |
| `linkedin_access_token` | `src/lib/linkedin-api.ts`, `src/hooks/useLinkedInAnalytics.ts` | Access token OAuth LinkedIn | Élevée (porteur d'identité) |
| `linkedin_id_token` | idem | ID token OpenID Connect LinkedIn | Élevée |
| `linkedin_token_expires` | idem | Timestamp d'expiration de l'access token | Faible |
| `linkedin_last_sync` | idem | Date du dernier rafraîchissement | Faible |
| `linkedin_cached_metrics` | idem | Cache des métriques LinkedIn pour l'UI | Modérée |
| `linkedin_oauth_state` | `LinkedInAuth.tsx` | État anti-CSRF du flow OAuth | Modérée |
| `kora_planning_data` | `src/lib/planning-service.ts` | Données du planning éditorial | Modérée |
| `kora_weekly_plans` | `src/lib/planning-service.ts` | Plans hebdomadaires | Modérée |
| `kora_export_history` | `src/services/export/history-manager.ts` | Historique des exports persisté | Modérée |
| `kora-export-history` | `src/services/export/export-orchestrator.ts` | Historique d'exports (variante orchestrateur, à consolider) | Modérée |
| `perplexity_protection_settings` | `src/lib/perplexity-protection-middleware.ts` | Paramètres de protection anti-spam | Faible |
| `perplexity_protection_history` | idem | Historique des appels protégés | Faible |
| `perplexity_usage_stats` | idem | Statistiques d'usage Perplexity | Faible |

Note : il existe une doublonne `kora_export_history` / `kora-export-history` à harmoniser (dette listée dans `TECH_DEBT.md`).

## 3. Types métier principaux

Les types sont définis dans `src/types/BrandIntelligenceTypes.ts` (≈720 lignes) et `src/types/brand-analysis.ts`. Sélection des structures les plus pertinentes.

### 3.1 Veille de marque (Perplexity)

`src/types/BrandIntelligenceTypes.ts` expose entre autres :

- `DataFreshness` : âge des données, fiabilité (`high`/`medium`/`low`), nombre de sources.
- `SourceVerification` : crédibilité (`high`/`medium`/`low`), type (`primary`/`secondary`/`tertiary`).
- `ObjectiveAnalysis` : histoire de la marque (fondation, jalons), position marché, santé financière, métriques d'innovation et de réputation.
- `RecentAction` : actions récentes typées (`product`, `partnership`, `acquisition`, `strategy`, `marketing`, `crisis`, `regulation`), impact 1–10, périmètre géographique.
- `StrategicAnalysis` : modèle économique, avantages concurrentiels, risques stratégiques, priorités.
- `SWOTMetrics`, `ContentMetrics`, `CompetitiveMetrics`, `ReputationKPIs` : métriques quantifiées extraites des réponses Perplexity.
- `ActionableRecommendation`, `SmartAlerts` : intelligence actionnable (recommandations priorisées, alertes catégorisées).
- `DeepResearchReport` : agrégat de l'ensemble produit par `RealBrandIntelligenceService.generateRealDeepResearchReport`.

### 3.2 Analyse de marque (variant)

`src/types/brand-analysis.ts` expose une seconde famille de types orientés rapport :

- `RealMention`, `RealSentiment`, `RealCompetitor`, `RealKeyword`, `RealSWOT`, `RealAlert`.
- `BrandReport` : agrégat de mentions, sentiment, concurrents, mots-clés, SWOT, alertes.
- `PerplexityReport` : version « lecture » du rapport, formatée pour l'utilisateur final.
- `BrandAnalysisService` : interface du service.

Deux familles de types coexistent. Une consolidation est listée dans `TECH_DEBT.md`.

### 3.3 LinkedIn

Les structures LinkedIn (profil, métriques, posts récents) sont définies inline dans `src/lib/linkedin-api.ts` et dans les hooks `useLinkedInAnalytics.ts` / `useLinkedInStats.ts`. Elles couvrent : profil OpenID, statistiques d'organisation, posts récents avec métriques d'engagement, et un cache local.

### 3.4 Planning éditorial

`src/lib/planning-service.ts` modélise les posts planifiés (date, plateforme, statut, contenu) et les plans hebdomadaires.

### 3.5 Export

`src/services/export/` modélise un historique d'export (timestamp, format, statut, métadonnées du rapport), exploité par les exports PDF (`src/lib/pdf-exporter.ts`, ≈1640 lignes) et CSV / Excel.

## 4. Sources de données et mode démo / réel

Depuis la branche `feat/data-truth-mode`, l'application sépare explicitement les sources réelles des données simulées via deux mécanismes :

- `src/lib/data-mode.ts` expose `getDataMode()`, `isDemoMode()` et `isRealMode()`. La valeur est lue à partir de `import.meta.env.VITE_DATA_MODE` (`'real'` par défaut). Un override DEV-only est disponible via le `DataModeContext` (toggle de la bannière) et persisté dans `localStorage` sous la clé `kora_data_mode_override`.
- `src/lib/demo-data.ts` centralise toutes les valeurs Instagram / X / Facebook précédemment éparpillées dans les composants (`DEMO_DASHBOARD_PLATFORMS`, `DEMO_ANALYTICS_BY_PERIOD`, `DEMO_TOP_POSTS`, `DEMO_INSIGHTS`, `DEMO_LIBRARY_ITEMS`, etc.). Chaque export est typé et préfixé `DEMO_` pour rendre tout usage non ambigu en relecture.
- `src/components/DataModeBanner.tsx` affiche un bandeau sticky « Mode démo » visible sur toute la coque `/app` lorsque le mode démo est actif.
- `src/components/EmptyState.tsx` remplace les blocs simulés (Instagram, X, suggestions IA, top posts) en mode réel par un placeholder « Non connecté » avec CTA vers la connexion.

### 4.1 Tableau récapitulatif

| Source | Statut | Réel ou démo | Persistance |
| --- | --- | --- | --- |
| LinkedIn (`src/lib/linkedin-api.ts`, `useLinkedInAnalytics`, `useLinkedInStats`) | Implémenté | **Réel** via OAuth + proxy `/api/linkedin/*` | `localStorage` (`linkedin_*`) |
| Perplexity (`src/lib/perplexity-service.ts`, `usePerplexity`) | Implémenté | **Réel** si `VITE_PERPLEXITY_API_KEY` valide, sinon mode simulation `'kora-simulation-v1'` | `localStorage` (`perplexity_*`) |
| OpenAI / Anthropic (`src/lib/ai-service.ts`, `useAI`, `useHybridAI`) | Implémenté | **Réel** si clés API valides | Aucune persistance |
| Dashboard multi-plateforme (`Dashboard.tsx`) | Démo en mode `demo`, EmptyState en mode `real` | **Démo** (LinkedIn widget reste réel si token présent) | Aucune |
| Analytics (`Analytics.tsx`) | Hybride : LinkedIn réel + Instagram/X démo en mode `demo`, EmptyState en mode `real` | **Hybride** | Aucune |
| Library (`Library.tsx`) | 4 contenus d'exemple en mode `demo`, vide en mode `real` | **Démo** | Aucune |
| BrandMonitoring / BrandIntelligenceDashboard | Réel via Perplexity, fallback simulé documenté côté service | **Hybride** | `localStorage` (rapports) |
| Instagram Graph API | Non implémenté | **Démo uniquement** | – |
| X (Twitter) API | Non implémenté | **Démo uniquement** | – |
| Facebook / Meta Business API | Non implémenté | **Démo uniquement** (export typé `DEMO_FACEBOOK_METRICS` à `null`) | – |
| Export PDF / Excel | Reflet de la donnée affichée dans l'UI | Hérite du mode actif | `localStorage` (historique) |

### 4.2 Variables d'environnement liées

| Variable | Valeurs | Effet |
| --- | --- | --- |
| `VITE_DATA_MODE` | `'real'` (défaut) \| `'demo'` | Active l'affichage des données simulées (Instagram, X, Facebook, Library) et la bannière `DataModeBanner`. En mode `'real'`, les composants concernés affichent un `EmptyState`. |
| `VITE_LINKEDIN_CLIENT_ID` / `_SECRET` / `_REDIRECT_URI` | Strings | Active la source réelle LinkedIn. Sans token, le widget LinkedIn affiche un état déconnecté indépendamment de `VITE_DATA_MODE`. |
| `VITE_PERPLEXITY_API_KEY` | String | Active la source réelle Perplexity. Sans clé, `usePerplexity` bascule sur le modèle de simulation `'kora-simulation-v1'` (clairement étiqueté dans les logs et les badges). |

### 4.3 Garanties pour un évaluateur externe

- Aucune métrique Instagram, X (Twitter) ou Facebook n'est affichée comme « réelle » : chaque carte porte un badge `Données simulées` (amber) en mode démo, ou un `EmptyState` (gris) en mode réel.
- En mode réel par défaut (`VITE_DATA_MODE=real`), les sections sans source réelle n'affichent **aucun chiffre maquillé**.
- Aucun mélange réel/démo sur la même vue n'est possible sans différenciation visuelle : LinkedIn temps réel porte un badge `Données réelles` (vert), Instagram/X portent `Données simulées` ou un EmptyState selon le mode.
- Le toggle de mode est strictement DEV-only ; en production, seule `VITE_DATA_MODE` au build fait foi.

---

Dernière mise à jour : 2026-05-21.

