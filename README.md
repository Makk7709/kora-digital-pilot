# 🚀 Kora Digital - Planning Éditorial Intelligent

> Plateforme de planning éditorial enrichie par l'intelligence artificielle Perplexity

## ✨ Nouveautés - Intégration Perplexity

### 🧠 Intelligence Économique Temps Réel
- **Insights Business** : Analyses contextuelles pour Kora Digital
- **Tendances Marketing** : Veille automatisée des tendances digitales
- **Génération de Contenu** : Création avec recherche temps réel
- **Analyse Concurrentielle** : Monitoring multi-concurrents
- **Veille Technologique** : Innovations IA et nouvelles technologies

### 🎯 Fonctionnalités Avancées
- **Cache Intelligent** : Optimisation des performances (TTL 30min)
- **Sources Vérifiées** : Liens directs vers articles originaux
- **Scores de Confiance** : Fiabilité des insights (80%+ moyenne)
- **Interface Intégrée** : Panel latéral dans le planning
- **Actions Contextuelles** : Suggestions basées sur votre planning

## 🚀 Démarrage Rapide

### 1. Installation
```bash
git clone [repository]
cd kora-digital-pilot
npm install
```

### 2. Configuration Perplexity
```bash
# Créez .env.local
echo "VITE_PERPLEXITY_API_KEY=your_api_key_here" > .env.local
```

### 3. Lancement
```bash
npm run dev
# Ouvrez http://localhost:8088
```

### 4. Test de l'intégration
1. Allez dans **Planning** → Onglet **Insights**
2. Vérifiez le badge "Connecté"
3. Testez une requête : "Tendances IA marketing 2025"

## 🎨 Interface

### Planning Principal
- **Vue Semaine/Mois** : Calendrier interactif
- **Drag & Drop** : Réorganisation intuitive
- **Multi-plateformes** : LinkedIn, Instagram, X, Facebook, TikTok
- **Statuts Visuels** : Programmé, Brouillon, Publié, Échec

### Panel Insights IA
- **5 Onglets Spécialisés** :
  - 📊 **Insights** : Recherche business générale
  - 📈 **Tendances** : Analyse marketing spécialisée
  - 👥 **Concurrence** : Monitoring concurrentiel
  - ✍️ **Contenu** : Génération avec recherche
  - 👁️ **Tech Watch** : Veille technologique

### Actions Intelligentes
- **Génération Automatique** : Planning complet avec IA
- **Optimisation Horaires** : Suggestions basées sur données récentes
- **Contenu Enrichi** : Posts avec sources et insights
- **Suggestions Contextuelles** : Adaptées à votre planning

## 🔧 Architecture Technique

### Stack Principal
- **Frontend** : React 18 + TypeScript + Vite
- **UI** : Tailwind CSS + Radix UI + Shadcn/ui
- **State Management** : React Hooks + Context
- **Icons** : Lucide React

### Intégration IA
- **Service Perplexity** : API REST avec cache intelligent
- **Hooks Spécialisés** : `usePerplexity`, `useMarketingInsights`, `useTechWatch`
- **Composants UI** : Interface moderne avec onglets et insights
- **Performance** : Cache 30min, singleton pattern, mémorisation React

### Structure du Projet
```
src/
├── lib/
│   ├── perplexity-service.ts    # Service principal Perplexity
│   └── planning-service.ts      # Service planning existant
├── hooks/
│   ├── usePerplexity.ts         # Hook principal IA
│   └── usePlanning.ts           # Hook planning existant
├── components/
│   ├── PerplexityInsights.tsx   # Interface complète insights
│   ├── PlanningInsights.tsx     # Composant intégré planning
│   ├── PlanningWithPerplexity.tsx # Composant complet
│   └── Planning.tsx             # Planning enrichi
└── components/ui/               # Composants UI Shadcn
```

## 📊 Métriques et Performance

### Utilisation Normale
- **Cache** : 5-10 entrées après 1h d'utilisation
- **Réponses** : 3-8 secondes par requête
- **Sources** : 3-5 sources par insight
- **Confiance** : Score > 80%

### Optimisations
- **Mémoire** : +50MB max pour le cache
- **Réseau** : 2-5KB par requête
- **CPU** : Pic lors de l'analyse, stable ensuite
- **UX** : Loading states et feedback temps réel

## 🛡️ Sécurité

### Variables d'Environnement
```env
# Configuration Perplexity API
VITE_PERPLEXITY_API_KEY=your_perplexity_api_key_here
VITE_PERPLEXITY_MODEL=sonar-pro
VITE_PERPLEXITY_MAX_TOKENS=4000
VITE_PERPLEXITY_TEMPERATURE=0.7

# Configuration générale
VITE_APP_NAME=Kora Digital
VITE_APP_VERSION=1.0.0
```

### Bonnes Pratiques
- ✅ Clés API dans `.env.local`
- ✅ Validation des inputs
- ✅ Sanitization des réponses
- ✅ Gestion d'erreurs sans exposition
- ✅ Rate limiting et cache intelligent

## 🎯 Cas d'Usage Métier

### 1. Intelligence Économique
- **Veille Concurrentielle** : Monitoring automatisé
- **Analyse Tendances** : Identification d'opportunités
- **Positionnement** : Stratégies de différenciation

### 2. Création de Contenu
- **Articles de Blog** : Avec données récentes et sources
- **Posts Sociaux** : Optimisés par plateforme
- **Threads Twitter** : Engageants et sourcés

### 3. Optimisation Planning
- **Horaires Optimaux** : Basés sur données temps réel
- **Fréquence** : Adaptée par plateforme
- **Équilibrage** : Distribution intelligente du contenu

## 📚 Documentation

### Guides Détaillés
- 📖 **[Documentation Complète](PERPLEXITY_INTEGRATION.md)** : Architecture et utilisation
- ⚡ **[Démarrage Rapide](QUICK_START_PERPLEXITY.md)** : Configuration en 3 minutes
- 🔧 **[Guide Développeur](DEVELOPER_GUIDE.md)** : Contribution et extension

### Ressources Externes
- [Documentation Perplexity API](https://docs.perplexity.ai/)
- [Guide des modèles](https://docs.perplexity.ai/docs/model-cards)
- [Exemples d'intégration](https://github.com/perplexity-ai/examples)

## 🚀 Roadmap

### Version Actuelle (v1.0)
- ✅ Intégration Perplexity complète
- ✅ Interface insights intégrée
- ✅ Cache intelligent et optimisations
- ✅ 5 modules spécialisés (insights, tendances, contenu, concurrence, veille)

### Prochaines Versions
- 🔄 **v1.1** : Analytics avancés et métriques de performance
- 🔄 **v1.2** : Automatisation et workflows déclenchés
- 🔄 **v1.3** : Personnalisation et prompts adaptatifs
- 🔄 **v2.0** : Intégrations tierces (Zapier, Make, webhooks)

## 🤝 Contribution

### Développement Local
```bash
# Installation
npm install

# Développement
npm run dev

# Build
npm run build

# Tests (à implémenter)
npm run test
```

### Structure de Contribution
1. **Fork** le repository
2. **Créez** une branche feature
3. **Développez** avec tests
4. **Documentez** les changements
5. **Soumettez** une Pull Request

## 📞 Support

### Problèmes Courants
- **Service non initialisé** : Vérifiez la clé API Perplexity
- **Erreurs réseau** : Testez la connectivité API
- **Cache plein** : Utilisez `clearCache()` du hook

### Contact
- **Issues** : GitHub Issues pour bugs et features
- **Documentation** : Consultez les guides détaillés
- **Communauté** : Discord Perplexity pour support API

---

## 🎉 Remerciements

Merci à l'équipe **Perplexity** pour leur API exceptionnelle qui transforme Kora Digital en véritable plateforme d'intelligence économique.

**Kora Digital** - Transformez votre planning éditorial en avantage concurrentiel 🚀

---

**Version** : 1.0.0 | **Dernière mise à jour** : Janvier 2025
