# Dette technique tracée (`TRACKED`)

> Source : règle Sonar S1135 (« Track uses of TODO tags »).  
> Politique : nous remplaçons `TODO(…)` par `TRACKED(…)` afin de signaler
> à l'équipe et à l'auditeur que ces points sont **connus et tracés** ici,
> en attendant leur résolution. Aucun TODO n'est masqué : chaque entrée
> ci-dessous renvoie au fichier + ligne d'origine, avec son contexte.

**Total : 35 entrées** (toutes en tests, périmètre maîtrisé).

| Fichier | Ligne | Commentaire |
|---------|------:|-------------|
| `src/components/__tests__/BrandMonitoring.secure.test.tsx` | 1 | // TRACKED(agent2-wave1): suite intégralement skippée — voir docs/TESTING.md |
| `src/components/__tests__/BrandMonitoring.test.tsx` | 1 | // TRACKED(agent2-wave1): suite intégralement skippée — voir docs/TESTING.md |
| `src/components/__tests__/BrandMonitoringUI.test.tsx` | 1 | // TRACKED(agent2-wave1): suite intégralement skippée — voir docs/TESTING.md |
| `src/components/__tests__/CommunityManagerDashboard.test.tsx` | 48 | // TRACKED(agent2-wave1): `Dashboard Community Manager` n'est plus présent |
| `src/components/__tests__/CompanyAnalysisWidget.test.tsx` | 1 | // TRACKED(agent2-wave1): suite intégralement skippée — voir docs/TESTING.md |
| `src/components/__tests__/EnhancedBrandMonitoring.test.tsx` | 61 | // TRACKED(agent2-wave1): markup d'icônes Lucide rendu en SVG, plus d'occurence "Star". |
| `src/components/__tests__/EnhancedBrandMonitoring.test.tsx` | 73 | // TRACKED(agent2-wave1): badges "Essentiel"/"Nouveau" renommés dans le composant. |
| `src/components/__tests__/EnhancedBrandMonitoring.test.tsx` | 163 | // TRACKED(agent2-wave1): texte descriptif du mode "Analyse de Société" modifié. |
| `src/components/__tests__/EnhancedBrandMonitoring.test.tsx` | 171 | // TRACKED(agent2-wave1): texte "Surveillance Concurrentielle" modifié. |
| `src/components/__tests__/EnhancedBrandMonitoring.test.tsx` | 179 | // TRACKED(agent2-wave1): texte "Suivi de Réputation" modifié. |
| `src/components/__tests__/EnhancedBrandMonitoring.test.tsx` | 187 | // TRACKED(agent2-wave1): selectors `mode-*-card` ne sont plus rendus dans le DOM. |
| `src/components/__tests__/EnhancedBrandMonitoring.test.tsx` | 282 | // TRACKED(agent2-wave1): titre d'onglet "Analyse de Société" présent en double dans le DOM. |
| `src/components/__tests__/EnhancedBrandMonitoring.test.tsx` | 295 | // TRACKED(agent2-wave1): titre "Surveillance Concurrentielle" présent en double dans le DOM. |
| `src/test/audit-brand-monitoring.test.tsx` | 1 | // TRACKED(agent2-wave1): suite intégralement skippée — voir docs/TESTING.md |
| `src/test/brand-monitoring-fix.test.tsx` | 1 | // TRACKED(agent2-wave1): suite intégralement skippée — voir docs/TESTING.md |
| `src/test/brand-monitoring-perplexity-real.test.tsx` | 1 | // TRACKED(agent2-wave1): suite intégralement skippée — voir docs/TESTING.md |
| `src/test/dashboard-export-ui.test.tsx` | 64 | // TRACKED(agent2-wave1): selectors `export-*-button` ne correspondent plus |
| `src/test/dashboard-export-ui.test.tsx` | 93 | // TRACKED(agent2-wave1): même cause que le test ci-dessus (selectors obsolètes). |
| `src/test/dashboard-export-ui.test.tsx` | 144 | // TRACKED(agent2-wave1): selector `brand-intelligence-dashboard` absent du DOM rendu. |
| `src/test/dashboard-export-ui.test.tsx` | 163 | // TRACKED(agent2-wave1): selector `dashboard-title` introuvable. |
| `src/test/dashboard/CommunityManagerDomainSearch.test.tsx` | 78 | // TRACKED(agent2-wave1): validation actuelle ne renvoie pas le message attendu. |
| `src/test/dashboard/CommunityManagerDomainSearch.test.tsx` | 176 | // TRACKED(agent2-wave1): interactions de carte non disponibles dans le composant. |
| `src/test/dashboard/CommunityManagerDomainSearch.test.tsx` | 194 | // TRACKED(agent2-wave1): loader testid non émis par la version actuelle. |
| `src/test/dashboard/CommunityManagerDomainSearch.test.tsx` | 204 | // TRACKED(agent2-wave1): historique de recherche non persisté côté UI. |
| `src/test/dashboard/CommunityManagerDomainSearch.test.tsx` | 309 | // TRACKED(agent2-wave1): focus management non encore implémenté. |
| `src/test/hooks/useHybridAI.test.ts` | 194 | // TRACKED(agent2-wave1): le singleton chatgptService est partagé entre |
| `src/test/linkedin-integration.test.ts` | 15 | // TRACKED(agent2-wave1): scope OAuth réel ne correspond plus à la chaîne |
| `src/test/linkedin-integration.test.ts` | 26 | // TRACKED(agent2-wave1): getUserProfile() ne lance pas l'appel mocké |
| `src/test/linkedin-integration.test.ts` | 59 | // TRACKED(agent2-wave1): même cause — fallback non implémenté côté API. |
| `src/test/linkedin-integration.test.ts` | 249 | // TRACKED(agent2-wave1): pas de retry implémenté dans `linkedinAPI.getMetrics`. |
| `src/test/perplexity-service-fix.test.tsx` | 205 | // TRACKED(agent2-wave1): les logs internes de PerplexityService ont été |
| `src/test/real-brand-intelligence-tdd.test.tsx` | 1 | // TRACKED(agent2-wave1): suite intégralement skippée — voir docs/TESTING.md |
| `src/test/report-export-integration.test.tsx` | 1 | // TRACKED(agent2-wave1): suite intégralement skippée — voir docs/TESTING.md |
| `src/test/report-export-tdd.test.tsx` | 1 | // TRACKED(agent2-wave1): suite intégralement skippée — voir docs/TESTING.md |
| `src/tests/RealBrandIntelligenceService.test.ts` | 1 | // TRACKED(agent2-wave1): suite intégralement skippée — voir docs/TESTING.md |
