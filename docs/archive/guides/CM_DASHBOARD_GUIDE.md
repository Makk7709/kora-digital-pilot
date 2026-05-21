> Note d'archivage (2026-05-21) : contenu intégré dans `docs/FEATURES.md` (catalogue fonctionnel) et, le cas échéant, dans `docs/SECURITY.md` ou `docs/OPERATIONS.md`. Ce guide est conservé pour traçabilité mais n'est plus maintenu. Toute information divergente vis-à-vis des documents canoniques est obsolète.

# 🧠 Dashboard Community Manager - Guide Complet

## 🎯 **Vue d'ensemble**

Le Dashboard Community Manager est votre centre de veille intelligente automatisée, conçu spécifiquement pour optimiser votre stratégie de contenu avec des insights IA en temps réel.

### **4 Axes Stratégiques**

1. **🔥 Tendances IA** - Les dernières innovations et opportunités business
2. **✨ Améliorations Contenu** - Optimisations pour maximiser l'engagement
3. **📈 Contenus Tendances** - Top 10 des sujets viraux du moment
4. **👁️ Veille d'Entreprise** - Monitoring de votre réputation et secteur

- --

## 🚀 **Démarrage Rapide**

### 1. **Configuration Initiale**
```bash
# Créer le fichier .env.local
echo "VITE_PERPLEXITY_API_KEY=pplx-your-api-key" > .env.local

# Démarrer l'application
npm run dev
```

### 2. **Accès au Dashboard**
1. Ouvrez l'application : `http://localhost:3000` 2. Cliquez sur **🧠 CM Dashboard** dans le menu
3. Vérifiez le statut "Connecté" en haut à droite

### 3. **Premier Scan**
1. Cliquez sur **"Scanner maintenant"**
2. Attendez 30-60 secondes (scan des 4 axes)
3. Explorez les insights générés

- --

## 📊 **Fonctionnalités Détaillées**

### **🔥 Tendances IA**
- **Objectif** : Identifier les innovations IA pertinentes pour votre secteur
- **Fréquence** : Scan automatique 2x/jour (8h et 20h)
- **Contenu** :
 - Nouvelles technologies émergentes
 - Opportunités business pour agences
 - Impact sur le marketing digital
 - Prédictions sectorielles

* *Exemple d'insights :**
- "L'IA générative transforme la création de contenu"
- "Nouveaux modèles multimodaux pour le marketing"
- "Automatisation des campagnes publicitaires"

### **✨ Améliorations Contenu**
- **Objectif** : Optimiser vos publications pour maximiser l'engagement
- **Focus** : Techniques actuelles qui fonctionnent
- **Contenu** :
 - Nouveaux formats de contenu
 - Algorithmes des réseaux sociaux
 - Techniques de storytelling
 - Optimisations SEO social

* *Exemple d'insights :**
- "Les carrousels LinkedIn génèrent +40% d'engagement"
- "Hashtags optimaux : 3-5 par post Instagram"
- "Horaires de publication idéaux par plateforme"

### **📈 Contenus Tendances (Top 10)**
- **Objectif** : Surfer sur les sujets viraux du moment
- **Mise à jour** : Temps réel
- **Contenu** :
 - Sujets trending dans l'IA/tech
 - Hashtags populaires
 - Angles d'approche viral
 - Opportunités de contenu

* *Exemple d'insights :**
- "#AIRevolution - 2.3M mentions cette semaine"
- "ChatGPT vs Claude : débat viral"
- "IA et emploi : angle humain à exploiter"

### **👁️ Veille d'Entreprise**
- **Objectif** : Monitorer votre réputation et celle de vos concurrents
- **Surveillance** :
 - Mentions de "Kora Digital"
 - Tendances du secteur agences IA
 - Analyses concurrentielles
 - Opportunités de positionnement

* *Exemple d'insights :**
- "Agences IA : demande +150% en 2025"
- "Mention positive dans TechCrunch"
- "Concurrent X lance nouveau service"

- --

## ⚙️ **Configuration Avancée**

### **Scan Automatique**
- **Fréquence par défaut** : Toutes les 12 heures
- **Contrôle** : Bouton ON/OFF dans l'interface
- **Personnalisation** : Modifiable dans le code

```typescript
// Modifier la fréquence dans CommunityManagerDashboard.tsx
const interval = setInterval(performAutoScan, 6 * 60 * 60 * 1000); // 6h au lieu de 12h
```

### **Prompts Personnalisés**
Vous pouvez adapter les requêtes Perplexity pour votre secteur :

```typescript
// Exemple : Focus sur un secteur spécifique
const scanAITrends = async (): Promise<TrendInsight[]> => {
 const response = await perplexity.getBusinessInsights({
 query: `Tendances IA spécifiques au secteur [VOTRE_SECTEUR] en ${new Date().getFullYear()}...`,
 // ... autres paramètres
 });
};
```

### **Filtres et Alertes**
- **Mots-clés prioritaires** : Configurables par secteur
- **Niveaux d'impact** : High/Medium/Low automatiques
- **Notifications** : Toast en temps réel

- --

## 📈 **Utilisation Optimale**

### **Workflow Quotidien Recommandé**

#### **🌅 Matin (8h-9h)**
1. **Consulter le dashboard** - Vérifier les nouveaux insights
2. **Analyser les tendances** - Identifier les opportunités du jour
3. **Planifier le contenu** - Intégrer les insights dans votre planning

#### **🌆 Soir (18h-19h)**
1. **Scan manuel** - Forcer une mise à jour si nécessaire
2. **Préparer le lendemain** - Noter les sujets à exploiter
3. **Veille concurrentielle** - Analyser les mentions sectorielles

### **Intégration avec le Planning**
1. **Copier les insights** - Utiliser les titres comme inspiration
2. **Adapter le contenu** - Personnaliser selon votre audience
3. **Programmer les posts** - Utiliser les horaires optimaux suggérés

### **Mesure de Performance**
- **Taux d'utilisation** : Insights transformés en contenu
- **Engagement** : Performance des posts inspirés par la veille
- **Réactivité** : Temps entre trend et publication

- --

## 🔧 **Dépannage**

### **Problèmes Courants**

#### **"Service non disponible"**
```bash
# Vérifier la clé API
cat .env.local | grep PERPLEXITY
# Doit afficher : VITE_PERPLEXITY_API_KEY=pplx-...
```

#### **"Scan échoue"**
1. Vérifier la connexion internet
2. Tester la clé API manuellement
3. Consulter la console pour les erreurs

#### **"Pas d'insights générés"**
- Les réponses Perplexity peuvent varier
- Relancer le scan après quelques minutes
- Vérifier que les prompts sont adaptés

### **Optimisation Performance**
- **Cache intelligent** : 30min par défaut
- **Requêtes parallèles** : 4 axes simultanés
- **Gestion d'erreurs** : Fallback gracieux

- --

## 🎯 **Cas d'Usage Concrets**

### **Scenario 1 : Lancement Produit IA**
1. **Veille tendances** → Identifier le timing optimal
2. **Contenu trending** → Trouver les angles viraux
3. **Améliorations** → Optimiser le format de l'annonce
4. **Monitoring** → Suivre les réactions du marché

### **Scenario 2 : Crise Secteur IA**
1. **Alerts temps réel** → Détecter les signaux faibles
2. **Veille entreprise** → Monitorer les mentions
3. **Contenu réactif** → Préparer une réponse adaptée
4. **Positionnement** → Exploiter les opportunités

### **Scenario 3 : Campagne Marketing**
1. **Tendances IA** → Identifier les sujets porteurs
2. **Optimisations** → Maximiser l'engagement
3. **Planning intégré** → Programmer la diffusion
4. **Suivi performance** → Mesurer l'impact

- --

## 🚀 **Roadmap Future**

### **Version 1.1 (Q2 2025)**
- [ ] **Alertes push** - Notifications importantes
- [ ] **Export insights** - PDF/Excel des analyses
- [ ] **Templates automatiques** - Posts pré-rédigés
- [ ] **Intégration Slack** - Partage d'équipe

### **Version 1.2 (Q3 2025)**
- [ ] **IA prédictive** - Anticipation des tendances
- [ ] **Scoring d'opportunités** - Priorisation automatique
- [ ] **Multi-langues** - Support international
- [ ] **API publique** - Intégrations tierces

### **Version 2.0 (Q4 2025)**
- [ ] **Dashboard collaboratif** - Équipes multiples
- [ ] **Machine learning** - Apprentissage des préférences
- [ ] **Intégration CRM** - Sync avec vos outils
- [ ] **Analytics avancés** - ROI de la veille

- --

## 📞 **Support**

### **Documentation**
- **Guide technique** : `PERPLEXITY_INTEGRATION.md` - **API Reference** : `src/lib/perplexity-service.ts` - **Composants** : `src/components/CommunityManagerDashboard.tsx` ### **Communauté**
- **Issues GitHub** : Signaler les bugs
- **Discussions** : Partager vos cas d'usage
- **Contributions** : Améliorer les prompts

- --

## 🎉 **Conclusion**

Le Dashboard Community Manager transforme votre approche de la veille en automatisant l'intelligence économique. Avec ses 4 axes stratégiques et son scan automatique 2x/jour, vous restez toujours en avance sur les tendances IA et optimisez votre contenu en temps réel.

* *🚀 Prêt à révolutionner votre stratégie de contenu ?**

1. Configurez votre clé Perplexity
2. Lancez votre premier scan
3. Explorez les insights générés
4. Intégrez dans votre planning éditorial

* *L'IA au service de votre créativité !** 🧠✨