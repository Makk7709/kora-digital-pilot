# 🧪 Guide Test API LinkedIn - Kora Digital Pilot

## 🎯 Objectif
Vérifier et récupérer les **vraies données LinkedIn** vs les données hardcodées du dashboard.

## 🚀 Méthodes de Test

### 1. **Interface Graphique (RECOMMANDÉ)**
```bash
1. Ouvrez http://localhost:8088
2. Cliquez sur "🧪 Test LinkedIn" dans la sidebar gauche
3. Cliquez sur "🧪 Lancer Tests"
4. Consultez les résultats détaillés
```

### 2. **Console Navigateur (DIAGNOSTIC RAPIDE)**
```javascript
# Dans F12 → Console, collez:
document.body.textContent.includes('4.8%') // Doit retourner false
document.body.textContent.includes('5.3%') // Doit retourner true

# OU coller le contenu de: linkedin-test-direct.js
```

### 3. **Script Automatique**
```bash
# Coller dans la console le script validation-script.js
# Voir les résultats de validation complète
```

## 📊 Ce Que Vous Devriez Voir

### ✅ **Données Corrigées (Analytics)**
- **Engagement**: `5.3%` (au lieu de 4.8%)
- **LinkedIn Post**: `333 likes` (au lieu de 156)
- **Instagram Post**: `136 likes` (au lieu de 89)
- **Twitter Post**: `84 likes` (au lieu de 67)
- **Insights**: `+11%, +18%, +10%` (au lieu de +23%, +45%, +18%)

### 🔗 **Connexion LinkedIn Réelle**
Si vous connectez LinkedIn:
- Statut: "✅ Connecté"
- Métriques: Vos vraies données LinkedIn
- Posts: Vos publications récentes
- Profil: Votre nom et photo

## 🧪 Tests Disponibles

### Test Interface (Composant `LinkedInDataTest`)
1. **Authentification** - Vérifie la connexion LinkedIn
2. **Profil Utilisateur** - Récupère vos infos LinkedIn
3. **Métriques** - Vos stats réelles (7j/30j/90j)
4. **Comparaison** - Hardcodé vs Réel
5. **Hook Analytics** - État des données dans l'app

### Test Console (`linkedin-test-direct.js`)
- Diagnostic complet en 4 étapes
- Recherche automatique dans le DOM
- Comparaison données avant/après
- Instructions pour connexion

## 🔧 Actions de Test

### Pour Tester SANS Connexion LinkedIn
```bash
✅ Vérifiez que 5.3% s'affiche (pas 4.8%)
✅ Vérifiez les nouveaux nombres de likes
✅ Données simulées cohérentes dans Analytics
```

### Pour Tester AVEC Connexion LinkedIn
```bash
1. Cliquez "🔗 Connecter LinkedIn"
2. Autorisez l'accès dans la popup
3. Retour automatique → données réelles chargées
4. Comparez avec les anciennes valeurs
```

## 🚨 Problèmes Possibles

### Si "4.8%" est encore visible:
```bash
1. Force refresh: Ctrl+Shift+R (Mac: Cmd+Shift+R)
2. Videz le cache navigateur
3. Naviguez vers Analytics ET Test LinkedIn
4. Vérifiez les logs console pour erreurs
```

### Si LinkedIn ne se connecte pas:
```bash
1. Vérifiez que le popup n'est pas bloqué
2. Client Secret configuré dans .env ?
3. Port 8088 accessible ?
4. Testez avec données simulées d'abord
```

## 📱 Test Rapide (30 secondes)

1. **Ouvrez** http://localhost:8088
2. **Naviguez** vers "Analytics"
3. **Cherchez** l'engagement - doit afficher **5.3%**
4. **Naviguez** vers "Test LinkedIn"
5. **Cliquez** "🧪 Lancer Tests"
6. **Vérifiez** les résultats

## ✅ Résultat Attendu

```
🎉 SUCCÈS si vous voyez:
- Engagement: 5.3% dans Analytics
- Posts corrigés: 333, 136, 84 likes
- Tests LinkedIn: Données simulées fonctionnelles
- Connexion LinkedIn: Optionnelle mais fonctionnelle
```

- --

* *💡 Conseil**: Commencez par vérifier les données corrigées SANS connexion LinkedIn, puis testez la connexion pour les vraies données.