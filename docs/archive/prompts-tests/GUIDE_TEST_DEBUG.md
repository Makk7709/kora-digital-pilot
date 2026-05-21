# 🔍 GUIDE DE TEST - RÉSOLUTION PROBLÈME "NaN"

## 🎯 OBJECTIF
Diagnostiquer pourquoi le score de réputation affiche "NaN" au lieu d'un nombre.

## 📋 ÉTAPES DE TEST

### 1️⃣ **Ouvrir la Console du Navigateur**
```
1. Allez sur l'application (localhost:8088/app)
2. Appuyez sur F12
3. Onglet "Console"
4. Vider la console (Clear)
```

### 2️⃣ **Tester avec l'API Réelle**
```
1. Aller dans "Veille de Marque"
2. Cliquer sur "Test API Réelle"
3. Regarder les logs dans la console
```

### 3️⃣ **Analyser les Logs**

#### ✅ **Logs Attendus - API**
```
🔍 Récupération du sentiment pour: Nike
📡 Réponse API sentiment: [début du texte de réponse]
🔍 Parsing sentiment, réponse reçue: [début du texte]
📊 Sentiment extrait - Positif: X, Neutre: Y, Négatif: Z
✅ Sentiment final - Score: XX, Trend: positive
```

#### ❌ **Si vous voyez ces problèmes**
```
⚠️ Aucun pourcentage trouvé, analyse du texte...
📊 Sentiment estimé - Positif: X, Neutre: Y, Négatif: Z
```

### 4️⃣ **Actions selon les Résultats**

#### **CAS 1: Aucun log d'API**
- ❌ Service non configuré
- 🔧 Vérifier la clé API Perplexity

#### **CAS 2: API répond mais parsing échoue**
- ❌ Format de réponse différent
- 🔧 Copier la réponse API et m'envoyer les 500 premiers caractères

#### **CAS 3: Parsing fonctionne mais NaN**
- ❌ Calcul du score défaillant
- 🔧 Bug dans la logique de calcul

## 🛠️ ACTIONS IMMÉDIATES

### **Test 1: Mode Test d'abord**
```
1. Cliquer "Mode Test"
2. Vérifier si le score affiche 79 (pas NaN)
3. Si Mode Test fonctionne → Problème API/parsing
4. Si Mode Test échoue → Problème d'affichage React
```

### **Test 2: API Réelle avec logs**
```
1. Console ouverte
2. "Test API Réelle"
3. Copier TOUS les logs qui commencent par 🔍 📡 📊 ✅
4. Me les envoyer pour analyse
```

## 🚨 RÉSOLUTION RAPIDE

### **Si le Mode Test affiche NaN**
```typescript
// Problème dans le composant React
// Le mockBrandReport a peut-être un sentiment invalide
```

### **Si l'API retourne un format inattendu**
```typescript
// Exemple de ce que je cherche dans les logs:
📡 Réponse API sentiment: "Nike est une marque leader dans le sport avec un sentiment généralement positif. Analyse des mentions récentes: 65% positives, 25% neutres, 10% négatives."
```

## 📞 CE QUE J'AI BESOIN DE VOUS

1. **Copie des logs console** après Test API Réelle
2. **Capture d'écran** du mode test (si différent)
3. **Confirmation** si mode test affiche 79 ou NaN

- --

* *🎯 Avec ces informations, je peux corriger le problème en 5 minutes !**