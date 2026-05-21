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

## 4. Données réelles vs données simulées

Point d'attention important pour la valorisation : certaines vues présentent des **valeurs hardcodées d'illustration** et non des données réellement collectées. Ces valeurs sont étiquetées dans le code et doivent être remplacées par des données réelles avant toute commercialisation.

| Vue | Statut | Source |
| --- | --- | --- |
| `src/components/Dashboard.tsx` (`calculateDashboardMetrics`) | Valeurs illustratives codées en dur (LinkedIn 45 200, Instagram 28 700, etc.) | Commentaire `CORRECTION TDD : Données calculées dynamiquement` mais les entrées de base restent fictives |
| `src/components/Dashboard.tsx` (`generateRealisticPosts`) | Posts d'exemple générés à partir des chiffres ci-dessus | Idem |
| `src/components/Analytics.tsx` | Métriques de référence partiellement simulées | À auditer ligne à ligne |
| `src/hooks/usePerplexity.ts` | Mode de simulation possible (`model: 'kora-simulation-v1'`) | Activé lorsque aucune clé Perplexity valide n'est fournie |
| `src/components/BrandMonitoring.tsx`, `BrandIntelligenceDashboard.tsx` | Données réelles via Perplexity quand la clé est configurée, fallback simulé sinon | `RealBrandIntelligenceService` |
| `src/hooks/useLinkedInAnalytics.ts`, `useLinkedInStats.ts` | Données réelles via API LinkedIn quand le token est valide | Proxy `/api/linkedin/*` |
| Export PDF / Excel | Reflet de la donnée affichée dans l'UI (réelle ou simulée selon la vue) | – |

Recommandation pour la valorisation : tout chiffre affiché dans le dashboard doit, à terme, provenir soit d'une API tierce (LinkedIn, Perplexity), soit d'un saisi utilisateur, soit d'un calcul dérivé. Le périmètre actuel doit être présenté comme un POC fonctionnel sur Perplexity + LinkedIn, complété d'illustrations sur les autres plateformes.

---

Dernière mise à jour : 2026-05-21.
