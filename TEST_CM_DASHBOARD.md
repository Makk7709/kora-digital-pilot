# 🧪 Test du Dashboard Community Manager

## ✅ **Checklist de Vérification**

### **1. Configuration de Base**
- [ ] Fichier `.env.local` créé avec `VITE_PERPLEXITY_API_KEY` - [ ] Application démarre sur `http://localhost:3000` - [ ] Aucune erreur dans la console au démarrage
- [ ] Menu "🧠 CM Dashboard" visible dans la sidebar

### **2. Interface Utilisateur**
- [ ] Dashboard s'affiche correctement
- [ ] 4 cartes principales visibles (Tendances IA, Améliorations, Trending, Veille)
- [ ] Statistiques en haut (compteurs à 0 initialement)
- [ ] Boutons "Auto-scan ON/OFF" et "Scanner maintenant" fonctionnels
- [ ] Statut de connexion Perplexity affiché

### **3. Fonctionnalité de Scan**
- [ ] Clic sur "Scanner maintenant" déclenche le scan
- [ ] Indicateur de chargement visible pendant le scan
- [ ] Toast de confirmation après scan réussi
- [ ] Insights apparaissent dans les 4 cartes
- [ ] Compteurs mis à jour avec le nombre d'insights

### **4. Contenu des Insights**
- [ ] **Tendances IA** : 3-5 insights sur l'innovation IA
- [ ] **Améliorations Contenu** : 3-5 conseils d'optimisation
- [ ] **Contenus Tendances** : Jusqu'à 10 sujets viraux
- [ ] **Veille Entreprise** : Mentions sectorielles et concurrentielles

### **5. Qualité des Données**
- [ ] Insights pertinents et récents
- [ ] Sources fiables mentionnées
- [ ] Niveaux d'impact (high/medium/low) cohérents
- [ ] Timestamps corrects
- [ ] Liens externes fonctionnels

- --

## 🔧 **Tests Techniques**

### **Test 1 : Scan Manuel**
```bash
# Démarrer l'app
npm run dev

# Dans le navigateur :
# 1. Aller sur http://localhost:3000
# 2. Cliquer sur "🧠 CM Dashboard"
# 3. Cliquer sur "Scanner maintenant"
# 4. Vérifier que les 4 cartes se remplissent
```

* *Résultat attendu :**
- Scan complet en 30-60 secondes
- 15-25 insights au total
- Aucune erreur dans la console

### **Test 2 : Auto-scan**
```bash
# Vérifier l'auto-scan (mode développement = scan immédiat)
# 1. Rafraîchir la page
# 2. Observer le scan automatique au chargement
# 3. Vérifier le timer "Prochain scan"
```

* *Résultat attendu :**
- Scan automatique au chargement
- Timer affiché pour le prochain scan (12h)
- Possibilité de désactiver avec le bouton ON/OFF

### **Test 3 : Gestion d'Erreurs**
```bash
# Test sans clé API
# 1. Renommer .env.local temporairement
# 2. Redémarrer l'app
# 3. Tenter un scan
```

* *Résultat attendu :**
- Statut "Déconnecté" affiché
- Message d'erreur explicite
- Bouton "Scanner" désactivé

- --

## 📊 **Validation des Insights**

### **Critères de Qualité**

#### **Tendances IA**
- ✅ Innovations récentes (< 30 jours)
- ✅ Pertinence business pour agences
- ✅ Sources technologiques fiables
- ✅ Impact clairement défini

#### **Améliorations Contenu**
- ✅ Conseils actionnables
- ✅ Basés sur des données récentes
- ✅ Applicables aux réseaux sociaux
- ✅ Métriques d'engagement mentionnées

#### **Contenus Tendances**
- ✅ Sujets actuellement viraux
- ✅ Hashtags populaires inclus
- ✅ Angles d'approche suggérés
- ✅ Potentiel viral évalué

#### **Veille Entreprise**
- ✅ Mentions sectorielles pertinentes
- ✅ Analyse concurrentielle
- ✅ Opportunités identifiées
- ✅ Signaux faibles détectés

- --

## 🐛 **Problèmes Connus et Solutions**

### **Erreur : "Service non initialisé"**
* *Cause :** Clé API Perplexity manquante ou invalide
* *Solution :**
```bash
# Vérifier la clé
echo $VITE_PERPLEXITY_API_KEY
# Ou dans .env.local
cat .env.local | grep PERPLEXITY
```

### **Erreur : "Scan échoue"**
* *Cause :** Problème réseau ou limite API
* *Solution :**
1. Vérifier la connexion internet
2. Attendre quelques minutes (limite de taux)
3. Vérifier les logs de la console

### **Insights vides ou peu pertinents**
* *Cause :** Réponses Perplexity variables
* *Solution :**
1. Relancer le scan
2. Vérifier les prompts dans le code
3. Adapter les requêtes si nécessaire

### **Performance lente**
* *Cause :** Requêtes Perplexity simultanées
* *Solution :**
- Normal : 30-60 secondes pour 4 axes
- Optimisation possible : scan séquentiel

- --

## 📈 **Métriques de Performance**

### **Temps de Réponse**
- **Scan complet** : 30-60 secondes
- **Scan individuel** : 5-15 secondes
- **Chargement interface** : < 2 secondes

### **Qualité des Données**
- **Pertinence** : > 80% des insights utilisables
- **Fraîcheur** : < 24h pour les tendances
- **Sources** : > 90% de sources fiables

### **Utilisation**
- **Cache hit rate** : > 70% (requêtes répétées)
- **Erreur rate** : < 5%
- **Satisfaction utilisateur** : > 8/10

- --

## 🎯 **Scénarios de Test Avancés**

### **Test de Charge**
```bash
# Tester plusieurs scans rapprochés
# 1. Scanner maintenant
# 2. Attendre 30 secondes
# 3. Scanner à nouveau
# 4. Vérifier la gestion du cache
```

### **Test de Persistance**
```bash
# Vérifier la persistance des données
# 1. Effectuer un scan
# 2. Rafraîchir la page
# 3. Vérifier que les insights sont conservés
```

### **Test Multi-onglets**
```bash
# Tester la synchronisation
# 1. Ouvrir 2 onglets sur le dashboard
# 2. Scanner dans l'onglet 1
# 3. Vérifier la mise à jour dans l'onglet 2
```

- --

## ✅ **Validation Finale**

### **Checklist de Production**
- [ ] Tous les tests passent
- [ ] Performance acceptable (< 60s)
- [ ] Gestion d'erreurs robuste
- [ ] Interface responsive
- [ ] Documentation complète
- [ ] Clé API configurée
- [ ] Monitoring en place

### **Critères d'Acceptation**
1. **Fonctionnel** : 4 axes opérationnels
2. **Performance** : Scan < 60 secondes
3. **Fiabilité** : < 5% d'erreurs
4. **Utilisabilité** : Interface intuitive
5. **Valeur** : Insights actionnables

- --

## 🚀 **Prêt pour la Production**

Une fois tous les tests validés, le Dashboard Community Manager est prêt à transformer votre veille IA en avantage concurrentiel !

* *Prochaines étapes :**
1. ✅ Configuration production
2. ✅ Formation utilisateur
3. ✅ Monitoring continu
4. ✅ Optimisations basées sur l'usage

* *🎉 Félicitations ! Votre veille IA automatisée est opérationnelle !**