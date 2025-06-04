# Guide Perplexity - Kora Digital

## 🚀 Démarrage Rapide

### Configuration
Votre clé API Perplexity est déjà configurée dans `.env.local` :
```
VITE_PERPLEXITY_API_KEY=pplx-fZQoc...
```

### Accès aux Insights
1. Ouvrez l'application : `http://localhost:8088` 2. Naviguez vers **Planning** dans le menu
3. Le panel **Insights IA** apparaît à droite avec le statut "Connecté" ✅

## 📊 Fonctionnalités Disponibles

### 1. Insights Business
- **Usage** : Analyses générales sur votre marché
- **Exemple** : "Quelles sont les tendances IA pour le marketing digital en 2025 ?"
- **Secteurs** : Marketing Digital, IA, Business, Tech, Productivité
- **Niveaux** : Rapide, Détaillé, Complet

### 2. Tendances Marketing
- **Usage** : Découverte des dernières tendances
- **Exemple** : "Marketing d'influence", "SEO", "Publicité programmatique"
- **Timeframe** : 7 jours d'analyse
- **Résultat** : Insights structurés avec scores d'impact

### 3. Analyse Concurrentielle
- **Usage** : Comparaison avec vos concurrents
- **Exemple** :
 - Concurrents : "HubSpot, Salesforce, Mailchimp"
 - Marché : "Marketing automation"
- **Résultat** : Analyse comparative détaillée

### 4. Génération de Contenu
- **Usage** : Création de contenu basé sur des recherches temps réel
- **Types** : Article de blog, Post social media, Thread Twitter
- **Exemple** : "L'impact de l'IA sur le marketing digital"
- **Avantage** : Contenu sourcé et à jour

### 5. Veille Technologique
- **Usage** : Monitoring des innovations IA
- **Exemple** : "Machine Learning", "NLP", "Computer Vision"
- **Fonctionnalité** : Watchlist personnalisée
- **Résultat** : Alertes sur les nouveautés

## 🎯 Cas d'Usage Recommandés

### Pour Kora Digital
1. **Veille concurrentielle** : Analysez les agences IA concurrentes
2. **Tendances clients** : Découvrez ce que recherchent vos prospects
3. **Contenu expert** : Créez des articles sur les dernières innovations IA
4. **Stratégie marketing** : Identifiez les opportunités émergentes

### Exemples de Requêtes
```
"Quelles sont les dernières tendances en IA générative pour les PME ?"
"Analyse des stratégies marketing des agences IA en France"
"Comment l'automatisation marketing évolue-t-elle en 2025 ?"
"Nouvelles réglementations IA en Europe et impact business"
```

## 🔧 Fonctionnalités Avancées

### Cache Intelligent
- **Durée** : 30 minutes
- **Avantage** : Réponses instantanées pour les requêtes récentes
- **Gestion** : Bouton "Vider le cache" disponible

### Sources Fiables
- **Affichage** : URLs et snippets pour chaque réponse
- **Vérification** : Liens cliquables vers les sources
- **Qualité** : Algorithme de sélection des sources pertinentes

### Actions Rapides
- **Stats cache** : Monitoring des performances
- **Requêtes prédéfinies** : "Tendances IA 2025"
- **Export** : Sauvegarde des insights importants

## 📈 Intégration Planning

### Bouton "Planifier avec Kora"
- **Enrichissement** : Utilise les insights Perplexity pour suggérer du contenu
- **Automatisation** : Génération de planning basée sur les tendances
- **Personnalisation** : Adapté à votre secteur et audience

### Workflow Recommandé
1. **Recherche** : Utilisez les insights pour identifier les sujets tendance
2. **Planification** : Intégrez ces sujets dans votre calendrier éditorial
3. **Création** : Générez du contenu avec les données temps réel
4. **Optimisation** : Ajustez selon les nouvelles tendances détectées

## 🚨 Bonnes Pratiques

### Optimisation des Requêtes
- **Spécificité** : Plus votre question est précise, meilleure est la réponse
- **Contexte** : Mentionnez votre secteur d'activité
- **Timeframe** : Précisez la période d'analyse souhaitée

### Gestion des Coûts
- **Modèle** : `llama-3.1-sonar-small-128k-online` (économique)
- **Cache** : Réutilise les réponses récentes
- **Tokens** : Limite de 1000 tokens par défaut

### Qualité des Insights
- **Vérification** : Toujours consulter les sources fournies
- **Recoupement** : Croiser avec d'autres sources si nécessaire
- **Mise à jour** : Les données sont en temps réel

## 🔍 Dépannage

### Statut "IA Déconnectée"
1. Vérifiez la clé API dans `.env.local` 2. Redémarrez le serveur de développement
3. Consultez la console pour les erreurs

### Erreurs API
- **400** : Modèle invalide ou requête malformée
- **401** : Clé API invalide ou expirée
- **429** : Limite de taux atteinte
- **500** : Erreur serveur Perplexity

### Performance
- **Lenteur** : Normal pour les requêtes complexes (5-15 secondes)
- **Cache** : Utilisez le cache pour les requêtes répétées
- **Optimisation** : Réduisez la complexité des questions

- --

* *🎉 Félicitations !** Votre intégration Perplexity est maintenant opérationnelle et prête à booster votre stratégie de contenu avec des insights IA en temps réel.