# 🤝 Guide de Contribution - Real Brand Intelligence Service

Merci de votre intérêt pour contribuer au **Real Brand Intelligence Service** ! Ce guide vous aidera à comprendre comment participer efficacement au développement.

## 📋 **Table des Matières**

- [🚀 Démarrage Rapide](#démarrage-rapide)
- [🏗️ Architecture](#architecture)
- [🧪 Tests](#tests)
- [📝 Standards de Code](#standards-de-code)
- [🔄 Workflow de Contribution](#workflow-de-contribution)
- [🐛 Signaler des Bugs](#signaler-des-bugs)
- [💡 Proposer des Fonctionnalités](#proposer-des-fonctionnalités)
- [📖 Documentation](#documentation)

## 🚀 **Démarrage Rapide**

### Prérequis
- Node.js 18+
- npm ou yarn
- Git
- Clé API Perplexity (pour tests réels)

### Installation
```bash
# 1. Fork et clone
git clone https://github.com/YOUR_USERNAME/kora.git
cd kora

# 2. Installation dépendances
npm install

# 3. Configuration environnement
cp .env.example .env
# Éditer .env avec votre clé API Perplexity

# 4. Lancer les tests
npm test

# 5. Démarrage développement
npm run dev
```

## 🏗️ **Architecture**

### Structure du Projet
```
src/
├── services/
│ ├── RealBrandIntelligenceServiceComplete.ts # Service principal ⭐
│ ├── EnhancedBrandIntelligenceService.ts # Interfaces TypeScript
│ └── RealBrandIntelligenceServiceFixed.ts # Version legacy
├── lib/
│ └── perplexity-service.ts # Client API Perplexity
└── tests/
 └── RealBrandIntelligenceService.test.ts # Tests complets
```

### Composants Clés

#### **Service Principal**
- **Responsabilité** : Orchestration des analyses de marque
- **Technologies** : TypeScript, API Perplexity
- **Patterns** : Factory, Strategy, Observer

#### **Extraction de Données**
- **Regex Patterns** : Extraction robuste avec fallback
- **Parsing Intelligent** : Analyse contextuelle
- **Validation** : Cohérence et sanitisation

#### **Tests**
- **Framework** : Vitest
- **Couverture** : 33 tests, 100% réussite
- **Types** : Unitaires, intégration, performance

## 🧪 **Tests**

### Lancement des Tests
```bash
# Tests complets
npm test

# Tests avec watch mode
npm run test:watch

# Tests spécifiques
npm test -- RealBrandIntelligenceService

# Coverage
npm run test:coverage
```

### Types de Tests

#### **Tests Unitaires**
- Méthodes d'extraction de données
- Algorithmes de scoring
- Utilitaires de parsing

#### **Tests d'Intégration**
- Workflow complet de génération de rapport
- Intégration API Perplexity
- Validation des types TypeScript

#### **Tests de Performance**
- Temps d'exécution < 30s
- Optimisation appels API parallèles
- Gestion mémoire

### Écriture de Nouveaux Tests
```typescript
describe('Nouvelle Fonctionnalité', () => {
 beforeEach(() => {
 // Configuration test
 vi.stubEnv('VITE_PERPLEXITY_API_KEY', 'test-key');
 });

 it('doit fonctionner correctement', async () => {
 // Arrange
 const service = new RealBrandIntelligenceService();

 // Act
 const result = await service.newMethod('test');

 // Assert
 expect(result).toBeDefined();
 expect(result.property).toBe(expectedValue);
 });
});
```

## 📝 **Standards de Code**

### TypeScript
- **Mode Strict** : Activé obligatoire
- **Types Explicites** : Éviter `any` - **Interfaces** : Pour tous les objets complexes
- **Null Safety** : Vérifications obligatoires

### Conventions de Nommage
```typescript
// ✅ Bon
interface UserAnalysis {
 confidenceScore: number;
 extractionTimestamp: Date;
}

class RealBrandService {
 async analyzeCompanyData(brandName: string): Promise<AnalysisResult> {
 // Implementation
 }
}

// ❌ Éviter
interface data {
 score: any;
 time: any;
}
```

### Gestion d'Erreurs
```typescript
// ✅ Bon
try {
 const result = await this.perplexityService.getBusinessInsights(query);
 return this.parseResult(result);
} catch (error) {
 console.error(`Erreur analyse ${brandName}:`, error);
 throw new Error(`Échec analyse: ${error.message}`);
}

// ❌ Éviter
const result = await this.perplexityService.getBusinessInsights(query);
return result; // Pas de gestion d'erreur
```

### Documentation Code
```typescript
/**
 * 🎯 Génère un rapport complet d'intelligence de marque
 *
 * @param brandName - Nom de la marque à analyser
 * @returns Rapport détaillé avec analyses multi-dimensionnelles
 * @throws Error si l'API Perplexity échoue ou données insuffisantes
 *
 * @example
 * ```typescript
 * const service = new RealBrandIntelligenceService();
 * const report = await service.generateRealDeepResearchReport('Apple Inc.');
 * console.log(`Score: ${report.confidenceScore}/100`);
 * ```
 * /
async generateRealDeepResearchReport(brandName: string): Promise<DeepResearchReport> {
 // Implementation
}
```

## 🔄 **Workflow de Contribution**

### 1. Préparation
```bash
# Fork le repo sur GitHub
# Clone votre fork
git clone https://github.com/YOUR_USERNAME/kora.git
cd kora

# Ajouter remote upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/kora.git
```

### 2. Développement
```bash
# Créer branche feature
git checkout -b feature/awesome-feature

# Développer avec tests
npm run test:watch

# Commits fréquents
git add .
git commit -m "feat: add awesome feature"
```

### 3. Tests et Validation
```bash
# Tests complets
npm test

# Vérification TypeScript
npm run type-check

# Linting (si configuré)
npm run lint
```

### 4. Pull Request
```bash
# Push vers votre fork
git push origin feature/awesome-feature

# Créer PR sur GitHub
# Titre: "feat: add awesome feature"
# Description détaillée avec:
# - Contexte du problème
# - Solution implémentée
# - Tests ajoutés
# - Breaking changes éventuels
```

### Standards de Commits
Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Types principaux
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
test: ajout/modification tests
refactor: refactorisation sans changement fonctionnel
perf: amélioration performance
chore: tâches maintenance

# Exemples
feat: add competitive analysis module
fix: resolve confidence score calculation
docs: update API reference
test: add integration tests for SWOT metrics
```

## 🐛 **Signaler des Bugs**

### Template Issue Bug
```markdown
## 🐛 Description du Bug
Description claire et concise du problème.

## 🔄 Reproduction
Étapes pour reproduire le comportement:
1. Aller à '...'
2. Cliquer sur '...'
3. Défiler jusqu'à '...'
4. Voir l'erreur

## ✅ Comportement Attendu
Description claire de ce qui devrait arriver.

## 📊 Comportement Actuel
Description de ce qui arrive actuellement.

## 📱 Environnement
- OS: [ex: macOS 13.0]
- Node.js: [ex: 18.17.0]
- Version: [ex: 1.0.0]
- Navigateur: [ex: Chrome 119]

## 📋 Logs
```
Coller les logs d'erreur ici
```

## 📎 Captures d'Écran
Si applicable, ajouter des captures d'écran.

## ➕ Contexte Additionnel
Tout autre contexte utile au problème.
```

## 💡 **Proposer des Fonctionnalités**

### Template Feature Request
```markdown
## 🚀 Feature Request

### 🎯 Problème à Résoudre
Description claire du problème business/utilisateur.

### 💡 Solution Proposée
Description détaillée de la solution souhaitée.

### 🔄 Alternatives Considérées
Autres solutions évaluées et pourquoi elles ne conviennent pas.

### 📊 Impact Business
- Utilisateurs affectés: [nombre/type]
- Valeur ajoutée: [description]
- Effort estimé: [faible/moyen/élevé]

### 🛠️ Spécifications Techniques
- [ ] Nouvelle API endpoint
- [ ] Modification base de données
- [ ] Changement interface utilisateur
- [ ] Intégration tierce
- [ ] Breaking change

### ✅ Critères d'Acceptation
- [ ] Critère 1
- [ ] Critère 2
- [ ] Critère 3
```

## 📖 **Documentation**

### Types de Documentation
- **README.md** : Vue d'ensemble et démarrage rapide
- **CHANGELOG.md** : Historique des versions
- **API Reference** : Documentation détaillée des méthodes
- **Examples** : Cas d'usage concrets
- **Architecture** : Diagrammes et explications techniques

### Standards Documentation
```markdown
# 📚 Titre avec Émoji Pertinent

> Description courte et claire

## 📋 Table des Matières
- [Section 1](#section-1)
- [Section 2](#section-2)

## 🎯 Section avec Émoji
Description détaillée avec exemples de code.

### Code Examples
```typescript
// Exemple claire et commenté
const service = new RealBrandIntelligenceService();
const result = await service.method();
```

### 💡 Tips et Notes
> 💡 **Tip** : Information utile pour les développeurs

### ⚠️ Warnings
> ⚠️ **Attention** : Information critique à retenir
```

## 🎯 **Zones d'Amélioration Prioritaires**

### Performance
- Cache Redis pour optimiser les appels API
- Rate limiting intelligent
- Compression des réponses

### Fonctionnalités
- Support multi-langues (EN, ES, DE)
- Export rapports (PDF, Excel)
- Webhooks pour notifications

### Architecture
- Modularisation services
- Plugin system
- API REST publique

### Tests
- Tests end-to-end
- Performance benchmarks
- Tests de charge

## 🏆 **Reconnaissance**

### Contributors
Les contributeurs sont listés dans le README principal et recevront :
- Crédit dans CHANGELOG
- Badge contributor GitHub
- Mention dans releases notes

### Types de Contributions Appréciées
- 🐛 **Bug fixes** : Corrections importantes
- ✨ **Features** : Nouvelles fonctionnalités
- 📝 **Documentation** : Améliorations doc
- 🧪 **Tests** : Amélioration couverture
- 🎨 **UX** : Amélioration interface
- ⚡ **Performance** : Optimisations

## 📞 **Contact et Support**

- **GitHub Issues** : Pour bugs et feature requests
- **Discussions** : Pour questions générales
- **Email** : Pour questions sensibles/privées

- --

* *Merci pour votre contribution au Real Brand Intelligence Service ! 🚀**

* Ensemble, nous créons le meilleur service d'intelligence de marque.*