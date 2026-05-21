# Data Truth Report — Mode démo / réel explicite

- **Date** : 2026-05-21
- **Branche** : `feat/data-truth-mode`
- **Commit HEAD du report (refactor)** : `6a7242b` ; commit du rapport lui-même : `8f21899`
- **Base** : `main` au tag `valuation-prep-merged` (snapshot de sécurité : tag `pre-agent4-snapshot`)
- **Périmètre** : Agent 4 (Vérité produit / Données réelles) — Wave 1

## 1. Objectif

Rendre impossible toute reproche d'un cabinet d'évaluation au sujet de
métriques maquillées : chaque chiffre affiché dans l'UI doit être soit
réel (LinkedIn, Perplexity, OpenAI, Anthropic), soit explicitement
étiqueté comme simulé via :

1. Une variable d'environnement `VITE_DATA_MODE` (`'real'` par défaut).
2. Une bannière persistante `DataModeBanner` visible sur toute la coque
   `/app` en mode démo.
3. Un badge `Données simulées` (amber) ou `EmptyState` (gris) à proximité
   immédiate de chaque carte.

## 2. Inventaire — constantes hardcodées AVANT refactor

Le tableau ci-dessous référence l'ensemble des arrays / objets de
métriques constants identifiés dans `src/components/` à partir du commit
`1b99eac` (HEAD `main` au démarrage).

| Fichier | Plage L. | Variable / structure | Plateformes | Volume |
|---|---|---|---|---|
| `src/components/Dashboard.tsx` | 28–32 | `platformsData` (LinkedIn, Instagram, X (Twitter)) | LinkedIn, Instagram, X | 3 entrées × 4 champs = 12 valeurs |
| `src/components/Dashboard.tsx` | 49–87 | `postsData` (posts récents par plateforme) | LinkedIn, Instagram, X | 3 posts × ~3 champs = 9 valeurs |
| `src/components/Dashboard.tsx` | 90–94 | `timeOffsets` (offsets randomisés) | n/a | calculé |
| `src/components/Dashboard.tsx` | 190–195 | `stats` (Posts cette semaine, Engagement, Portée, Clics) | agrégat | 4 trends hardcodés (`+8%`, `+0.3%`, `+12%`, `+5%`) |
| `src/components/Analytics.tsx` | 135–193 | `platformsData['7d']` | LinkedIn, Instagram, X | 3 × ~10 champs = 30 valeurs |
| `src/components/Analytics.tsx` | 195–253 | `platformsData['30d']` | LinkedIn, Instagram, X | 3 × ~10 champs = 30 valeurs |
| `src/components/Analytics.tsx` | 254–312 | `platformsData['90d']` | LinkedIn, Instagram, X | 3 × ~10 champs = 30 valeurs |
| `src/components/Analytics.tsx` | 402–442 | `defaultPosts` (top posts) | LinkedIn, Instagram, X | 3 posts × 4 metrics + perf = 18 valeurs |
| `src/components/Analytics.tsx` | 474–499 | `defaultInsights` | n/a | 3 insights × 3 champs |
| `src/components/Analytics.tsx` | 817, 838, 859, 880 | Deltas hardcodés (`+12%`, `+0.3%`, `+8%`, `+2.1%`) | agrégat | 4 valeurs |
| `src/components/Analytics.tsx` | 1059 | Comparatif périodique (`76.8K` / `276.4K` / `920K`) | agrégat | 3 valeurs |
| `src/components/Library.tsx` | 12–18 | `categories` (24/12/6/4/2) | n/a | 5 catégories |
| `src/components/Library.tsx` | 20–65 | `savedContent` (4 contenus LinkedIn/X/Instagram/Multi) | LinkedIn, Instagram, X | 4 × ~9 champs = 36 valeurs |
| `src/components/Library.tsx` | 215–227 | Statistiques sidebar (24/18/4/2) | agrégat | 4 valeurs |

**Total approximatif** : ~180 valeurs hardcodées réparties sur 3
composants, mélangeant LinkedIn, Instagram, X et agrégats — aucune
n'était clairement étiquetée comme telle à l'écran d'un évaluateur
externe.

## 3. Inventaire — APRÈS refactor

| Fichier | Statut | Source des valeurs |
|---|---|---|
| `src/lib/demo-data.ts` (nouveau) | **Source unique de vérité démo.** Tous les exports préfixés `DEMO_*`, typés (`DemoPlatformSnapshot`, `DemoTopPost`, `DemoInsight`, `DemoLibraryItem`), en-tête d'avertissement explicite. | – |
| `src/lib/data-mode.ts` (nouveau) | `getDataMode()`, `isDemoMode()`, override DEV-only via `localStorage` (`kora_data_mode_override`). Default `'real'`. | `import.meta.env.VITE_DATA_MODE` |
| `src/contexts/DataModeContext.tsx` (nouveau) | Context React + toggle DEV-only. | – |
| `src/components/DataModeBanner.tsx` (nouveau) | Bandeau sticky amber, role `status`, monté dans `pages/Index.tsx`. | – |
| `src/components/EmptyState.tsx` (nouveau) | Remplace les blocs simulés en mode réel. | – |
| `src/components/Dashboard.tsx` | **0 constante hardcodée résiduelle**. Importe `DEMO_DASHBOARD_PLATFORMS`, `DEMO_AGGREGATE_KPIS`. Blocs Instagram/X gated par `isDemo`. LinkedIn widget intact. | `src/lib/demo-data.ts` |
| `src/components/Analytics.tsx` | **0 constante hardcodée résiduelle** pour les plateformes. Importe `DEMO_ANALYTICS_BY_PERIOD`, `DEMO_TOP_POSTS`, `DEMO_INSIGHTS`, `DEMO_AGGREGATE_KPIS`. Trois chemins de données : démo / vide / merge LinkedIn. | `src/lib/demo-data.ts` |
| `src/components/Library.tsx` | **0 constante hardcodée résiduelle**. Importe `DEMO_LIBRARY_ITEMS`, `DEMO_LIBRARY_CATEGORIES`, `DEMO_LIBRARY_STATS`. | `src/lib/demo-data.ts` |
| `src/App.tsx` | Wrap par `DataModeProvider`. | – |
| `src/pages/Index.tsx` | `DataModeBanner` monté en haut de la coque. | – |
| `env.example` | Ajoute `VITE_DATA_MODE=real` avec commentaire. | – |

## 4. Composants affichant désormais un `EmptyState` en mode réel

| Composant | Bloc | Plateforme(s) | CTA |
|---|---|---|---|
| `Dashboard.tsx` | Publications récentes | Instagram / X (Twitter) | « Voir Analytics » |
| `Dashboard.tsx` | Suggestions IA cross-plateforme | LinkedIn / Instagram / X | « Configurer les sources » |
| `Dashboard.tsx` | Stats grid (4 cartes) | agrégat | Valeurs `—` + trend « Source non connectée » |
| `Analytics.tsx` | Performance par plateforme | « LinkedIn, Instagram, X (Twitter) » si aucune source connectée | « Ouvrir les Paramètres » |
| `Analytics.tsx` | Carte Instagram (seule) | Instagram | – |
| `Analytics.tsx` | Carte X (Twitter) (seule) | X (Twitter) | – |
| `Analytics.tsx` | Insights de Kora | n/a (vide si pas de LinkedIn ni démo) | – |
| `Analytics.tsx` | Top posts | n/a (vide si pas de LinkedIn ni démo) | – |
| `Library.tsx` | Catalogue vide | n/a | « Créer du nouveau contenu » |

## 5. Garanties de différenciation visuelle

- **Bannière sticky** `DataModeBanner` visible sur tout `/app` en mode
  démo : titre « Mode démo actif », mention explicite « Instagram, X
  (Twitter) et Facebook simulés », CTA dev-only « Passer en mode réel ».
- **Badges contextuels** :
  - `Données simulées` (amber) : sur chaque carte de métrique en mode
    démo (Dashboard stats grid, Analytics overview, plateformes
    Instagram/X, top posts, insights, library statistics).
  - `Données réelles` (vert, icône `CheckCircle2`) : sur la carte
    LinkedIn lorsque les données proviennent de l'API LinkedIn, sur les
    top posts LinkedIn réels, sur les insights LinkedIn réels.
  - `LinkedIn temps réel` (vert) : sur les 4 KPI agrégés d'Analytics
    quand un merge LinkedIn a eu lieu.
  - `Aucune source` (gris) : sur les 4 KPI agrégés d'Analytics en mode
    réel sans LinkedIn connecté (valeurs `—`).
- **Aucun mélange réel/démo non différencié** : la fusion LinkedIn dans
  `Analytics.tsx` recalcule explicitement les totaux en marquant
  `isRealData` par plateforme. Le `DataSourceBadge` est rendu sur
  chaque carte plateforme et sur chaque insight / top post.

## 6. Variables d'environnement

| Variable | Valeurs | Effet | Fichier déclarant |
|---|---|---|---|
| `VITE_DATA_MODE` | `'real'` (défaut) \| `'demo'` | Active l'affichage démo et la bannière. | `env.example` |
| `kora_data_mode_override` (localStorage) | `'real'` \| `'demo'` | Override DEV-only via `DataModeContext.toggleMode()`. Ignoré en prod. | `src/lib/data-mode.ts` |

## 7. Périmètre intact (sources réelles non touchées)

Conformément aux règles d'ownership :

- `src/lib/linkedin-api.ts` : non modifié (ownership Agent 1).
- `src/hooks/useLinkedInAnalytics.ts`, `useLinkedInStats.ts` : non modifiés.
- `src/components/LinkedInWidget.tsx`, `LinkedInRecentPosts.tsx`, etc. :
  non modifiés (sources LinkedIn restent réelles).
- `src/lib/perplexity-service.ts`, `src/hooks/usePerplexity.ts` : non
  modifiés (Perplexity reste source réelle).
- `src/components/CommunityManagerDashboard.tsx`,
  `CommunityManagerDomainDashboard.tsx`, `BrandMonitoring.tsx`,
  `enhanced/BrandIntelligenceDashboard.tsx` : non modifiés (déjà sur
  sources réelles ou démo clairement étiquetée `(Démo)` / `(Test)`
  dans le nom de marque).
- `server.cjs`, `tsconfig*.json`, tests, CI : non modifiés.

## 8. Risques résiduels

1. **Texte d'encart `Planning.tsx`** (L. 213–231) : 2 suggestions
   textuelles statiques (« Vos posts LinkedIn performent mieux entre
   8h-10h et 17h-19h » / « L'IA générative est très recherchée cette
   semaine »). Pas de chiffre, pas de KPI. À brancher sur Perplexity
   dans une itération suivante (suivi `TECH_DEBT.md`).
2. **`CompanyAnalysisWidget.tsx`** (L. 280–322) : valeurs par défaut
   d'un objet `BrandAnalysisResult` (followers `1000`, engagement
   `2.5`, etc.). Utilisé comme fallback structural et non comme
   métrique affichée à l'utilisateur ; pas de mise en avant UI. Aucun
   impact valorisation.
3. **`BrandMonitoring.tsx`** (`mockBrandReport`, `createDemoReport`) :
   contiennent des chiffres pour la marque « Nike (Test) » / « Nike
   (Démo) ». Le nom de marque affiché porte explicitement le suffixe
   `(Démo)` ou `(Test)` — la distinction est déjà visible à l'écran.
   Non modifié.
4. **Mode `'kora-simulation-v1'`** de `usePerplexity` : activé
   automatiquement si la clé API Perplexity n'est pas valide. Le badge
   et les logs distinguent le mode simulation ; ce mécanisme est
   antérieur à ce travail et reste sous responsabilité du service
   Perplexity. Ne pas désactiver sans concertation produit.
5. **LinkedIn (Agent 1)** : aucune donnée LinkedIn n'a été modifiée.
   Si Agent 1 retire la persistance localStorage des tokens, le
   `EmptyState` Analytics s'affichera plus souvent — comportement
   attendu et déjà géré dans `Analytics.tsx`.

## 9. Validation

| Vérification | Résultat |
|---|---|
| `npm run lint` | 0 errors (917 warnings préexistants, principalement `any` dans les tests) |
| `npm run typecheck` | OK |
| `npm run build` | OK (`dist/` généré, 1.8 Mo) |
| `npm run check` (sans test) | équivalent à lint + typecheck + build : OK |
| Imports cohérents | Aucun import résiduel ne pointe vers une constante déplacée (`platformsData`, `defaultPosts`, `defaultInsights`, `savedContent` n'existent plus en dehors de `src/lib/demo-data.ts`). |
| Smoke visuel (arbre d'imports) | `Dashboard`, `Analytics`, `Library` importent depuis `@/lib/demo-data` et `@/contexts/DataModeContext`. `App.tsx` enveloppe avec `DataModeProvider`. `pages/Index.tsx` monte `DataModeBanner`. |

## 10. Commits (`feat/data-truth-mode`)

```
8f21899 docs(data-truth): document demo/real data mode and audit results
6a7242b refactor(library,app): mode-aware library + mount data-mode banner
4ce86ef refactor(analytics): wire Analytics to demo-data + EmptyState
813a1f0 refactor(dashboard): wire Dashboard to demo-data + EmptyState
c140ea1 feat(data-mode): introduce explicit demo/real data mode infrastructure
```

---

Dernière mise à jour : 2026-05-21 — Agent 4 (Vérité produit).
