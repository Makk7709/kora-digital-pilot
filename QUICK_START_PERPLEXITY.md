# 🚀 Démarrage Rapide - Perplexity Integration

## ⚡ Configuration en 3 minutes

### 1. **Clé API Perplexity**
```bash
# Créez le fichier .env.local
echo "VITE_PERPLEXITY_API_KEY=your_api_key_here" > .env.local
```

### 2. **Démarrage**
```bash
npm run dev
```

### 3. **Test de l'intégration**
- Ouvrez l'application
- Allez dans **Planning** → Onglet **Insights**
- Vérifiez le statut "Connecté" en haut

## 🎯 Premiers Tests

### Test 1: Insights Business
1. Onglet **Insights**
2. Sélectionnez "Marketing Digital"
3. Tapez: "Tendances IA marketing 2025"
4. Cliquez **Analyser**

### Test 2: Génération de Contenu
1. Onglet **Contenu**
2. Sujet: "L'impact de l'IA sur le marketing digital"
3. Type: "Post social media"
4. Cliquez **Générer le contenu**

### Test 3: Tendances Marketing
1. Onglet **Tendances**
2. Tapez: "Marketing d'influence"
3. Cliquez **Analyser les tendances**

## 🔧 Vérifications

### ✅ Service Initialisé
- Badge "Connecté" visible
- Pas d'erreur dans la console
- Cache stats > 0 après utilisation

### ✅ Réponses Fonctionnelles
- Contenu généré avec sources
- Insights structurés
- Temps de réponse < 10s

### ❌ Problèmes Courants

**"Service non initialisé"**
```bash
# Vérifiez la clé API
cat .env.local | grep PERPLEXITY
```

**"Erreur réseau"**
```bash
# Testez la connectivité
curl -H "Authorization: Bearer YOUR_KEY" https://api.perplexity.ai/chat/completions
```

## 🎨 Interface Rapide

### Navigation
- **Planning** → **Insights** : Interface complète
- **Panel latéral** → **Insights** : Vue intégrée
- **Actions rapides** : Boutons prédéfinis

### Raccourcis
- `Ctrl+I` : Ouvrir insights (à implémenter)
- Boutons prédéfinis : "Tendances IA 2025"
- Actions contextuelles dans le planning

## 📊 Métriques de Succès

### Utilisation Normale
- **Cache** : 5-10 entrées après 1h d'utilisation
- **Réponses** : 3-8 secondes par requête
- **Sources** : 3-5 sources par insight
- **Confiance** : Score > 80%

### Performance
- **Mémoire** : +50MB max pour le cache
- **Réseau** : 2-5KB par requête
- **CPU** : Pic lors de l'analyse, stable ensuite

## 🚀 Prochaines Étapes

1. **Testez tous les onglets** (5 min)
2. **Générez du contenu** pour votre planning
3. **Configurez la veille** technologique
4. **Explorez les sources** fournies
5. **Optimisez votre planning** avec les insights

## 💡 Conseils d'Utilisation

### Requêtes Efficaces
- **Spécifiques** : "Marketing B2B SaaS 2025" vs "Marketing"
- **Contextuelles** : Mentionnez votre secteur
- **Temporelles** : Précisez la période d'analyse

### Optimisation Cache
- **Réutilisez** les requêtes similaires
- **Variez** légèrement pour nouveaux insights
- **Videz** le cache si problème de mémoire

### Intégration Planning
- **Utilisez** les insights pour créer du contenu
- **Appliquez** les suggestions d'horaires
- **Suivez** les tendances détectées

---

**🎉 Félicitations !** Votre intégration Perplexity est opérationnelle.

**Support** : Consultez `PERPLEXITY_INTEGRATION.md` pour la documentation complète. 