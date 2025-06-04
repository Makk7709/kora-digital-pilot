# 🎯 PROMPT CONSIGNES & AUDIT - REFACTORING ARCHITECTURAL KORA

## 📋 CONTEXTE & MISSION
**Objectif** : Finaliser la refonte architecturale de Kora pour préparer l'audit du 25 juin
**Persona** : Architecte Logiciel Senior, expert sécurité et scalabilité
**Phase actuelle** : PHASE 1 COMPLÉTÉE (Nettoyage) → PHASE 2 (Consolidation services)

---

## ✅ PHASE 1 - NETTOYAGE ACCOMPLIE (61 fichiers supprimés)

### 🗑️ Artefacts Supprimés
- **Logs & Debug** : `compilation_errors.log`, `debug-*.js` (5 fichiers)
- **Tests Obsolètes** : `test-*.html` (15 fichiers), `test-*.js` (20 fichiers)
- **Documentation Legacy** : `AUDIT_*.md`, `RAPPORT_*.md` (18 fichiers)
- **Backups Temporaires** : `backup_real_brand_services/`, `temp/`
- **Scripts Validation** : `validate-*.js`, `diagnostic-*.js` (11 fichiers)

### 🧹 Structure Actuelle Nettoyée
```
kora/
├── 📁 src/              # Code source principal
├── 📁 public/           # Assets statiques (nettoyé)
├── 📁 docs/             # Documentation (créé)
├── 📁 node_modules/     # Dépendances
├── 📄 ARCHITECTURE_REFACTORING_PLAN.md ✅
└── 📄 Fichiers config (package.json, vite.config.ts, etc.)
```

---

## 🎯 PHASE 2 - CONSOLIDATION SERVICES (PRIORITÉ IMMÉDIATE)

### 🔄 Services à Refactorer (Architecture Critique)
1. **RealBrandIntelligenceService.ts** (82KB) 
   - ❌ Monolithique, difficile à maintenir
   - ✅ À découper en modules spécialisés

2. **BrandAnalysisService.ts** (42KB)
   - ❌ Logique métier mélangée
   - ✅ À optimiser et modulariser

3. **ReportExportService.ts** (37KB)
   - ❌ Export PDF complexe non modulaire
   - ✅ À simplifier en services atomiques

### 🎯 Architecture Modulaire Cible
```
src/services/
├── 📁 brand/
│   ├── intelligence.service.ts    # Logique IA marque
│   ├── analysis.service.ts        # Analyse données
│   └── monitoring.service.ts      # Surveillance temps réel
├── 📁 export/
│   ├── pdf.service.ts            # Export PDF optimisé
│   └── data.service.ts           # Export données brutes
├── 📁 integration/
│   ├── linkedin.service.ts       # API LinkedIn
│   └── perplexity.service.ts     # API Perplexity
└── 📁 core/
    ├── api.service.ts            # Client HTTP unifié
    └── cache.service.ts          # Cache intelligent
```

---

## 🔧 PHASE 3 - OPTIMISATION COMPOSANTS

### 🚨 Composants Critiques (Code Smell Détecté)
1. **BrandMonitoring.tsx** (54KB, 1384 lignes)
   - ❌ Responsabilité unique violée
   - ❌ Console.log debug partout (lignes 552-619)
   - ✅ À découper en 8-10 sous-composants

2. **Analytics.tsx** (47KB, 1179 lignes)
   - ❌ Logique métier dans UI
   - ✅ À modulariser (hooks + composants dédiés)

3. **ImageGenerator.tsx** (25KB, 548 lignes)
   - ❌ Gestion d'état complexe
   - ✅ À optimiser avec patterns React modernes

### 🎨 Structure Composants Cible
```
src/components/
├── 📁 layouts/           # Layouts réutilisables
├── 📁 features/          # Composants métier
│   ├── 📁 brand-monitoring/
│   │   ├── BrandOverview.tsx
│   │   ├── TrendAnalysis.tsx
│   │   └── ReportGenerator.tsx
│   ├── 📁 analytics/
│   │   ├── Dashboard.tsx
│   │   ├── Charts.tsx
│   │   └── Filters.tsx
│   └── 📁 export/
├── 📁 shared/           # Composants partagés
│   ├── 📁 ui/          # Design system
│   └── 📁 charts/      # Graphiques réutilisables
└── 📁 forms/           # Formulaires génériques
```

---

## 🛡️ PHASE 4 - SÉCURISATION (AUDIT-READY)

### 🔐 Modules Sécurité Critiques
- [ ] **Authentication & Authorization (RBAC)**
- [ ] **Input Validation & Sanitization**
- [ ] **API Rate Limiting**
- [ ] **Secure Logging System** (remplacer console.log)
- [ ] **Error Handling Standardization**

### ⚡ Modules Performance
- [ ] **Code Splitting** automatique par route
- [ ] **Lazy Loading** composants lourds
- [ ] **Service Worker** pour cache offline
- [ ] **Bundle Analysis** & optimisation

---

## 🚀 PHASE 5 - CI/CD READY

### 📦 Configuration DevOps
- [ ] **Dockerfile** multi-stage production
- [ ] **Docker Compose** pour environnement dev
- [ ] **GitHub Actions** workflows (build, test, deploy)
- [ ] **ESLint/Prettier** config stricte
- [ ] **Husky** pre-commit hooks
- [ ] **Tests automatisés** pipeline

---

## 🔍 POINTS DE CONTRÔLE QUALITÉ

### ✅ Métriques à Valider
- **Bundle Size** : Réduction cible 40% (actuel: estimation 2.5MB)
- **Lines of Code** : Réduction cible 30% (suppression redondances)
- **Cyclomatic Complexity** : Score < 10 par fonction
- **Test Coverage** : > 90% (actuellement 0%)
- **Security Score** : Grade A (audit SonarQube)

### 🚨 Code Smells Identifiés
1. **Console.log** partout (BrandMonitoring.tsx lignes 552-619)
2. **Fichiers > 1000 lignes** (3 fichiers critiques)
3. **Duplication de logique** entre services
4. **Tests dispersés** (2 dossiers: `test/` et `tests/`)
5. **Types TypeScript** incomplets

---

## 📋 ACTIONS PRIORITAIRES IMMÉDIATES

### 🔥 URGENCE 1 - Consolidation Services
```bash
# 1. Analyser les dépendances entre services
grep -r "import.*Service" src/services/

# 2. Créer la nouvelle structure modulaire
mkdir -p src/services/{brand,export,integration,core}

# 3. Découper RealBrandIntelligenceService.ts
# → intelligence.service.ts + analysis.service.ts + monitoring.service.ts
```

### 🔥 URGENCE 2 - Nettoyage Code Debug
```bash
# Supprimer tous les console.log de debug
grep -r "console.log.*DEBUG" src/ --include="*.tsx" --include="*.ts"

# Remplacer par un système de logging professionnel
```

### 🔥 URGENCE 3 - Unification Tests
```bash
# Fusionner src/test/ et src/tests/ → src/__tests__/
# Standardiser la structure de test
```

---

## 🎯 VALIDATION FINALE PRÉ-AUDIT

### ☑️ Checklist Architecturale
- [ ] **Zéro duplication** de code entre modules
- [ ] **Séparation des responsabilités** respectée
- [ ] **Injection de dépendances** implémentée
- [ ] **Gestion d'erreurs** centralisée
- [ ] **Logging sécurisé** sans exposition de données sensibles

### ☑️ Checklist Performance
- [ ] **Bundle splitting** par route/feature
- [ ] **Tree shaking** optimisé
- [ ] **Images optimisées** (WebP, lazy loading)
- [ ] **Cache strategy** implémentée
- [ ] **Métriques de performance** < 3s LCP

### ☑️ Checklist Sécurité
- [ ] **API keys** externalisées (.env)
- [ ] **Validation des inputs** côté client/serveur
- [ ] **CORS** configuré strictement
- [ ] **Headers de sécurité** implémentés
- [ ] **Audit des dépendances** npm audit fix

---

## 🚨 ALERTES & POINTS D'ATTENTION

### ⚠️ Composants Critiques à Ne Pas Casser
- `BrandMonitoring.tsx` (logique métier complexe)
- `ReportExportService.ts` (export PDF en production)
- `RealBrandIntelligenceService.ts` (cœur de l'app)

### ⚠️ Dépendances à Vérifier
- Vite HMR (ports 8088-8090 utilisés)
- APIs externes (LinkedIn, Perplexity)
- Services de cache existants

---

## 📞 RÉSULTATS ATTENDUS POST-REFACTORING

### 🎯 Livrable Final
- **Architecture modulaire** audit-ready
- **Documentation technique** complète
- **Tests automatisés** avec coverage > 90%
- **Pipeline CI/CD** fonctionnel
- **Métriques de qualité** validées
- **Sécurité renforcée** grade A

### 📊 Rapport de Contrôle à Produire
```markdown
## AUDIT ARCHITECTURAL - VALIDATION FINALE
- ✅ Zéro artefact legacy
- ✅ Architecture scalable validée
- ✅ Sécurité audit-ready confirmée
- ✅ Performance optimisée mesurée
- ✅ Documentation complète et à jour
```

---

**🚀 PRÊT POUR LA PHASE 2 - CONSOLIDATION SERVICES**
**⏰ Estimation : 4-6h pour finaliser l'architecture complète** 