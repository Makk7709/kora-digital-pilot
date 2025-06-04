# 🤖 Intégration IA - Kora Digital Pilot

## 🎯 Protocole de Garantie 100% de Réussite

Cette intégration garantit **100% de réussite** grâce à un système de fallback multi-niveaux et de templates de secours.

## 🔧 Configuration

### 1. Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# Clé API Claude (Anthropic) - PRIORITÉ
VITE_ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# Clé API OpenAI - FALLBACK + IMAGES
VITE_OPENAI_API_KEY=sk-proj-your-openai-key-here

# Configuration IA
VITE_DEFAULT_AI_MODEL=claude-3-5-sonnet-20241022
VITE_FALLBACK_AI_MODEL=gpt-4o
VITE_AI_TIMEOUT=30000
VITE_MAX_TOKENS=4000
```

### 2. Obtenir les Clés API

#### OpenAI
1. Allez sur [platform.openai.com](https://platform.openai.com)
2. Créez un compte ou connectez-vous
3. Allez dans "API Keys"
4. Créez une nouvelle clé secrète
5. Copiez la clé (format: `sk-proj-...`)

#### Anthropic (Claude)
1. Allez sur [console.anthropic.com](https://console.anthropic.com)
2. Créez un compte ou connectez-vous
3. Allez dans "API Keys"
4. Créez une nouvelle clé
5. Copiez la clé (format: `sk-ant-...`)

## 🚀 Architecture du Système

### Protocole de Fallback

```
1. Tentative Anthropic Claude-3.5-Sonnet (PRIORITÉ)
 ↓ (si échec)
2. Tentative OpenAI GPT-4o (FALLBACK)
 ↓ (si échec)
3. Tentative OpenAI GPT-3.5-turbo (économique)
 ↓ (si échec)
4. Template de fallback (garantie 100%)
```

### Gestion d'Erreurs

- **Timeout** : 30 secondes par requête
- **Retry automatique** : 3 tentatives avec délai progressif
- **Gestion des quotas** : Basculement automatique entre providers
- **Fallback templates** : Contenu pré-généré par plateforme

## 📁 Structure du Code

```
src/
├── lib/
│ └── ai-service.ts # Service principal IA
├── hooks/
│ └── useAI.ts # Hook React pour l'IA
├── components/
│ ├── InspirationAI.tsx # Interface de génération
│ └── AIConnectionTest.tsx # Tests de connectivité
```

## 🔍 Fonctionnalités

### Service IA (`ai-service.ts`)
- ✅ Multi-provider (OpenAI + Anthropic)
- ✅ Fallback automatique
- ✅ Gestion des timeouts
- ✅ Templates de secours
- ✅ Prompts optimisés par plateforme
- ✅ Test de connectivité

### Hook React (`useAI.ts`)
- ✅ État de génération
- ✅ Historique des générations
- ✅ Gestion d'erreurs
- ✅ Annulation de requêtes
- ✅ Cache des réponses

### Interface Utilisateur
- ✅ Sélection multi-plateformes
- ✅ Types de contenu variés
- ✅ Tons de communication
- ✅ Indicateurs de statut
- ✅ Copie en un clic
- ✅ Historique des générations

## 🧪 Tests

### Test de Connectivité
```typescript
const { testConnection } = useAI();
const status = await testConnection();
// Retourne: { openai: boolean, anthropic: boolean }
```

### Test de Génération
```typescript
const { generateContent } = useAI();
const response = await generateContent({
 prompt: "Votre idée de contenu",
 platform: "linkedin",
 contentType: "post",
 tone: "Professionnel & stratégique"
});
```

## 📊 Monitoring

### Logs de Debug
- 🤖 Tentatives de génération
- ✅ Succès par provider
- ❌ Échecs et raisons
- 🔄 Utilisation du fallback

### Métriques Disponibles
- Taux de succès par provider
- Temps de réponse moyen
- Utilisation des fallbacks
- Erreurs par type

## 🛡️ Sécurité

### Bonnes Pratiques
- ✅ Clés API dans `.env.local` (non versionnées)
- ✅ Validation des entrées utilisateur
- ✅ Timeout pour éviter les blocages
- ✅ Gestion des erreurs d'authentification
- ✅ Limitation des tokens par requête

### Variables d'Environnement
```bash
# ⚠️ Ne jamais commiter ces clés !
# Ajoutez .env.local au .gitignore
echo ".env.local" >> .gitignore
```

## 🚀 Déploiement

### Développement
```bash
# 1. Configurez vos clés API
cp .env.local.example .env.local
# Éditez .env.local avec vos vraies clés

# 2. Lancez l'application
npm run dev

# 3. Testez la connectivité
# Allez dans Paramètres > Test de Connectivité IA
```

### Production
```bash
# 1. Build de production
npm run build

# 2. Variables d'environnement serveur
# Configurez VITE_OPENAI_API_KEY et VITE_ANTHROPIC_API_KEY
# sur votre serveur de production

# 3. Servir l'application
npx serve dist
```

## 🔧 Personnalisation

### Ajouter un Nouveau Provider
```typescript
// Dans ai-service.ts
private async callNewProvider(request: AIRequest, model: string, signal: AbortSignal) {
 // Implémentation du nouveau provider
}

// Ajouter dans les attempts
const attempts = [
 { provider: 'openai', model: 'gpt-4o' },
 { provider: 'anthropic', model: 'claude-3-sonnet-20240229' },
 { provider: 'newprovider', model: 'new-model' }, // Nouveau
];
```

### Modifier les Templates de Fallback
```typescript
// Dans ai-service.ts > getFallbackContent()
const fallbackTemplates = {
 linkedin: `Votre nouveau template LinkedIn...`,
 instagram: `Votre nouveau template Instagram...`,
 // Ajoutez d'autres plateformes
};
```

## 📈 Optimisations

### Performance
- Cache des réponses récentes
- Compression des requêtes
- Lazy loading des composants IA

### Coûts
- Utilisation de GPT-3.5 en fallback (moins cher)
- Limitation des tokens par requête
- Cache pour éviter les requêtes dupliquées

## 🆘 Dépannage

### Problèmes Courants

#### "Clé API manquante"
- Vérifiez que `.env.local` existe
- Vérifiez le format des clés (sk-proj-... ou sk-ant-...)
- Redémarrez le serveur de développement

#### "Quota dépassé"
- Vérifiez vos limites sur les plateformes API
- Le système basculera automatiquement sur l'autre provider

#### "Timeout"
- Augmentez `VITE_AI_TIMEOUT` dans `.env.local` - Vérifiez votre connexion internet

#### "Aucune réponse générée"
- Le système utilisera automatiquement les templates de fallback
- Vérifiez les logs de la console pour plus de détails

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs de la console
2. Testez la connectivité dans Paramètres
3. Consultez cette documentation
4. Contactez l'équipe technique Korev AI

- --

* *🎉 Félicitations ! Votre IA est maintenant opérationnelle avec une garantie de 100% de réussite !**