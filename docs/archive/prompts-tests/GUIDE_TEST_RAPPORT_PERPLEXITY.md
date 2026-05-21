# 🔧 Guide de Test - Rapport Perplexity

## 🎯 Objectif
Vérifier que le rapport Perplexity s'affiche correctement avec tous ses onglets et données.

## 📋 Étapes de Test

### 1. Lancement de l'Application
```bash
cd kora-digital-pilot
npm run dev
```
L'application devrait être accessible sur `http://localhost:5173` ### 2. Navigation vers la Veille de Marque
- Aller dans la section "Veille de Marque"
- Vérifier que l'interface s'affiche correctement

### 3. Test avec Mode Test (Recommandé)
1. **Cliquer sur "Mode Test"** dans le formulaire d'analyse
2. **Vérifier** que les données de test s'affichent :
 - ✅ realBrandReport: ✓ (Nike (Test))
 - Section "Score de réputation" avec données
 - Section "Surveillance concurrentielle"
 - Section "Contenu et thématiques"
 - Section "Analyse SWOT"

### 4. Génération du Rapport Perplexity
1. **Cliquer sur "Générer rapport Perplexity"**
2. **Vérifier dans la console** (F12 → Console) :
 ```
 🚀 [DEBUG] handleGenerateReport - Début
 📊 [DEBUG] Données disponibles: {...}
 ⚙️ [DEBUG] Appel du service generatePerplexityReport...
 ✅ [DEBUG] Rapport généré avec succès: {...}
 📝 [DEBUG] Contenu des insights: [...]
 🎯 [DEBUG] Contenu des actions: [...]
 ```

### 5. Vérification de l'Affichage du Rapport
Après génération, vérifier que s'affiche :

#### Section Debug (temporaire)
- ✅ realBrandReport: ✓ (Nike (Test))
- ✅ perplexityReport: ✓ (ID: report_...)
- Contenu du rapport avec insights et actions

#### Section Rapport Perplexity
- **En-tête** : "Rapport Perplexity - Nike (Test)"
- **Score de réputation** : XX/100
- **Onglets** : Résumé | Insights | Analyse | Actions

### 6. Test des Onglets
Cliquer sur chaque onglet et vérifier :

#### Onglet "Résumé" ✅
- Résumé Exécutif avec texte formaté
- Position Concurrentielle

#### Onglet "Insights" ✅
- Titre : "Insights Clés (X)" avec X ≥ 6
- Liste d'insights numérotés avec émojis
- Chaque insight dans une carte grise

#### Onglet "Analyse" ✅
- 6 sections d'analyse :
 - Analyse du Sentiment
 - Analyse des Mentions
 - Analyse Concurrentielle
 - Analyse des Mots-clés
 - Analyse SWOT
 - Alertes

#### Onglet "Actions" ✅
- Titre : "Recommandations d'Actions (X)" avec X ≥ 8
- Liste d'actions numérotées dans des cartes vertes
- Chaque action avec description détaillée

### 7. Logs de Diagnostic à Vérifier

#### Dans BrandMonitoring.tsx
```
🎨 [BrandMonitoring] État perplexityReport mis à jour: {
 reportExists: true,
 reportId: "report_...",
 brandName: "Nike (Test)",
 insightsCount: 8+,
 actionsCount: 12+,
 hasDetailedAnalysis: true
}
```

#### Dans PerplexityReportViewer.tsx
```
🎨 [PerplexityReportViewer] Rendu avec données: {
 reportId: "report_...",
 brandName: "Nike (Test)",
 keyInsightsCount: 8+,
 recommendedActionsCount: 12+,
 hasDetailedAnalysis: true,
 activeTab: "summary"
}
```

## 🚨 Problèmes Potentiels et Solutions

### Problème 1: Onglets vides
* *Symptôme** : Les onglets "Insights" ou "Actions" sont vides
* *Solution** : Vérifier dans la console que `keyInsights.length >= 6` et `recommendedActions.length >= 8` ### Problème 2: Rapport ne s'affiche pas
* *Symptôme** : Aucune section "Rapport Perplexity" après génération
* *Solution** : Vérifier que `perplexityReport` n'est pas null dans les logs

### Problème 3: Erreur de génération
* *Symptôme** : Toast d'erreur lors de la génération
* *Solution** : Vérifier que `realBrandReport` existe et que le service est initialisé

## ✅ Critères de Succès

1. **Mode Test fonctionne** : Données mockées s'affichent
2. **Génération réussie** : Toast de succès + logs positifs
3. **Rapport visible** : Section "Rapport Perplexity" apparaît
4. **Onglets fonctionnels** : Tous les 4 onglets affichent du contenu
5. **Données complètes** :
 - Insights ≥ 6
 - Actions ≥ 8
 - Analyses détaillées complètes

## 🔧 Commandes de Debug

### Vérifier l'état React (dans la console)
```javascript
// Vérifier l'état du composant
console.log('État actuel:', {
 realBrandReport: window.realBrandReport,
 perplexityReport: window.perplexityReport
});
```

### Forcer un re-render
```javascript
// Si l'affichage semble bloqué
window.location.reload();
```

## 📞 Support
Si les tests échouent, vérifier :
1. Les logs de la console (F12)
2. L'état des variables React
3. La structure des données générées
4. Les conditions de rendu dans le JSX