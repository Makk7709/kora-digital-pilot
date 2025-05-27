# 🚀 Kora Digital Pilot

<div align="center">

![Kora Digital Pilot](https://img.shields.io/badge/Kora-Digital%20Pilot-0ea5e9?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646cff?style=for-the-badge&logo=vite)

**Plateforme de pilotage digital avec intelligence artificielle intégrée**

*Développé par l'équipe Korev AI*

[🚀 Demo Live](#) • [📖 Documentation](#) • [🐛 Issues](https://github.com/Makk7709/kora-digital-pilot/issues) • [💬 Discussions](https://github.com/Makk7709/kora-digital-pilot/discussions)

</div>

---

## 📋 Table des Matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🤖 Intelligence Artificielle](#-intelligence-artificielle)
- [🛠️ Installation](#️-installation)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🏗️ Architecture](#️-architecture)
- [🎨 Technologies](#-technologies)
- [🔧 Configuration](#-configuration)
- [📱 Intégrations](#-intégrations)
- [🧪 Tests](#-tests)
- [📊 Analytics](#-analytics)
- [🚀 Déploiement](#-déploiement)
- [🤝 Contribution](#-contribution)
- [📞 Support](#-support)

---

## ✨ Fonctionnalités

### 🎯 **Core Features**
- 📊 **Dashboard Analytics** - Métriques et KPIs en temps réel
- 🤖 **IA Générative** - Création de contenu avec OpenAI & Claude
- 📱 **Multi-plateformes** - LinkedIn, Instagram, X/Twitter
- 🎯 **Optimisation** - Contenu adapté à chaque plateforme
- 📈 **Suivi Performance** - Analytics et insights détaillés
- 🔄 **Planification** - Calendrier éditorial intelligent

### 🔗 **Intégrations Sociales**
- ✅ **LinkedIn** - Posts, articles, analytics
- ✅ **Instagram** - Posts visuels, stories, réels
- ✅ **X/Twitter** - Tweets, threads, réponses
- 🔄 **Facebook** - En développement
- 🔄 **TikTok** - En développement

### 🎨 **Interface Utilisateur**
- 🌙 **Mode sombre/clair** - Thème adaptatif
- 📱 **Responsive Design** - Compatible mobile/desktop
- ⚡ **Performance** - Interface ultra-rapide
- 🎯 **UX Optimisée** - Design intuitif et moderne

---

## 🤖 Intelligence Artificielle

### 🛡️ **Protocole de Garantie 100%**
Notre système IA garantit une disponibilité maximale grâce à :

- **🔄 Multi-provider** : Anthropic Claude-3.5 + OpenAI GPT-4o
- **⚡ Fallback automatique** : Basculement intelligent entre APIs
- **📝 Templates de secours** : Contenu garanti même sans API
- **💰 Optimisation coûts** : GPT-3.5 en fallback économique

### 🎯 **Capacités IA**

| Fonctionnalité | Claude-3.5 | GPT-4o | GPT-3.5 |
|----------------|------------|--------|---------|
| Génération de contenu | ✅ Priorité | ✅ Fallback | ✅ Économique |
| Génération d'images | ❌ | ✅ DALL-E | ❌ |
| Analyse de sentiment | ✅ | ✅ | ✅ |
| Optimisation SEO | ✅ | ✅ | ✅ |

### 🎨 **Types de Contenu Supportés**

```mermaid
graph TD
    A[IA Kora] --> B[LinkedIn]
    A --> C[Instagram]
    A --> D[Twitter/X]
    
    B --> B1[Posts professionnels]
    B --> B2[Articles longs]
    B --> B3[Threads]
    
    C --> C1[Posts visuels]
    C --> C2[Stories]
    C --> C3[Réels]
    
    D --> D1[Tweets]
    D --> D2[Threads]
    D --> D3[Réponses]
```

---

## 🛠️ Installation

### 📋 **Prérequis**

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **yarn** >= 1.22.0
- **Git** >= 2.30.0

### ⚡ **Installation Rapide**

```bash
# 1. Cloner le repository
git clone https://github.com/Makk7709/kora-digital-pilot.git
cd kora-digital-pilot

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.local.example .env.local

# 4. Lancer l'application
npm run dev:full
```

### 🔧 **Installation Détaillée**

<details>
<summary>Cliquez pour voir les étapes détaillées</summary>

```bash
# Vérifier les versions
node --version  # >= 18.0.0
npm --version   # >= 9.0.0

# Cloner et configurer
git clone https://github.com/Makk7709/kora-digital-pilot.git
cd kora-digital-pilot

# Installer les dépendances
npm ci  # Installation propre

# Configuration des variables d'environnement
cp .env.local.example .env.local
nano .env.local  # Éditer avec vos clés API

# Vérifier l'installation
npm run lint
npm run build

# Lancer en développement
npm run dev:full
```

</details>

---

## 🚀 Démarrage Rapide

### 1️⃣ **Configuration IA**

```bash
# Copiez le fichier de configuration
cp .env.local.example .env.local
```

Ajoutez vos clés API dans `.env.local` :

```env
# APIs IA (Priorité : Claude > GPT-4o > GPT-3.5)
VITE_ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
VITE_OPENAI_API_KEY=sk-proj-your-openai-key-here

# Configuration LinkedIn
VITE_LINKEDIN_CLIENT_ID=your-linkedin-client-id
VITE_LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Configuration avancée
VITE_DEFAULT_AI_MODEL=claude-3-5-sonnet-20241022
VITE_FALLBACK_AI_MODEL=gpt-4o
VITE_AI_TIMEOUT=30000
VITE_MAX_TOKENS=4000
```

### 2️⃣ **Obtenir les Clés API**

| Provider | URL | Priorité |
|----------|-----|----------|
| **Anthropic Claude** | [console.anthropic.com](https://console.anthropic.com/) | 🥇 Priorité |
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | 🥈 Fallback + Images |

### 3️⃣ **Lancer l'Application**

```bash
# Développement complet (avec proxy LinkedIn)
npm run dev:full

# Développement simple (frontend uniquement)
npm run dev

# Build de production
npm run build && npm run preview
```

### 4️⃣ **Tester la Connectivité**

1. Ouvrez [http://localhost:8088](http://localhost:8088)
2. Allez dans **Paramètres > Test de Connectivité IA**
3. Cliquez sur **Tester la connexion**
4. Vérifiez le statut ✅ OpenAI et ✅ Anthropic

---

## 🏗️ Architecture

### 📁 **Structure du Projet**

```
kora-digital-pilot/
├── 📁 src/
│   ├── 📁 components/          # Composants React
│   │   ├── 📁 ui/             # Composants UI (shadcn/ui)
│   │   ├── 📄 Dashboard.tsx   # Tableau de bord principal
│   │   ├── 📄 InspirationAI.tsx # Interface IA
│   │   ├── 📄 LinkedInAuth.tsx # Authentification LinkedIn
│   │   └── 📄 Analytics.tsx   # Composants analytics
│   ├── 📁 hooks/              # Hooks React personnalisés
│   │   ├── 📄 useAI.ts       # Hook pour l'IA
│   │   └── 📄 useLinkedInStats.ts # Hook LinkedIn
│   ├── 📁 lib/                # Services et utilitaires
│   │   ├── 📄 ai-service.ts  # Service IA principal
│   │   ├── 📄 linkedin-api.ts # API LinkedIn
│   │   └── 📄 utils.ts       # Utilitaires généraux
│   ├── 📁 pages/              # Pages de l'application
│   │   ├── 📄 Landing.tsx    # Page d'accueil
│   │   ├── 📄 Index.tsx      # Dashboard principal
│   │   └── 📄 Settings.tsx   # Paramètres
│   └── 📄 App.tsx            # Composant racine
├── 📁 public/                 # Assets statiques
├── 📄 server.cjs             # Serveur proxy LinkedIn
├── 📄 package.json           # Dépendances et scripts
└── 📄 README.md              # Documentation
```

### 🔄 **Flux de Données**

```mermaid
graph LR
    A[User Input] --> B[AI Service]
    B --> C{Provider Available?}
    C -->|Yes| D[Claude/GPT]
    C -->|No| E[Fallback Template]
    D --> F[Generated Content]
    E --> F
    F --> G[Platform Optimization]
    G --> H[User Interface]
```

### 🏛️ **Architecture Technique**

- **Frontend** : React 18 + TypeScript + Vite
- **State Management** : React Query + React Hooks
- **UI Framework** : Tailwind CSS + shadcn/ui
- **Routing** : React Router v6
- **Build Tool** : Vite avec SWC
- **Linting** : ESLint + TypeScript ESLint

---

## 🎨 Technologies

### 🚀 **Stack Principal**

| Technologie | Version | Rôle |
|-------------|---------|------|
| **React** | 18.3.1 | Framework frontend |
| **TypeScript** | 5.5.3 | Typage statique |
| **Vite** | 5.4.1 | Build tool & dev server |
| **Tailwind CSS** | 3.4.11 | Framework CSS |
| **React Query** | 5.56.2 | State management |

### 🎨 **UI & Design**

| Package | Version | Description |
|---------|---------|-------------|
| **shadcn/ui** | Latest | Composants UI modernes |
| **Radix UI** | 1.x | Primitives accessibles |
| **Lucide React** | 0.462.0 | Icônes SVG |
| **Tailwind Animate** | 1.0.7 | Animations CSS |

### 🤖 **Intelligence Artificielle**

| Provider | Modèles | Usage |
|----------|---------|-------|
| **Anthropic** | Claude-3.5-Sonnet | Génération de contenu (priorité) |
| **OpenAI** | GPT-4o, GPT-3.5, DALL-E | Fallback + génération d'images |

### 🔗 **Intégrations**

| Service | API Version | Fonctionnalités |
|---------|-------------|-----------------|
| **LinkedIn** | v2 | Auth, posts, analytics |
| **Instagram** | Graph API | Posts, stories (en dev) |
| **Twitter/X** | v2 | Tweets, threads (en dev) |

---

## 🔧 Configuration

### 🌍 **Variables d'Environnement**

<details>
<summary>Configuration complète des variables d'environnement</summary>

```env
# ===========================================
# CONFIGURATION IA
# ===========================================

# Clés API (OBLIGATOIRE pour l'IA)
VITE_ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
VITE_OPENAI_API_KEY=sk-proj-your-openai-key-here

# Modèles IA
VITE_DEFAULT_AI_MODEL=claude-3-5-sonnet-20241022
VITE_FALLBACK_AI_MODEL=gpt-4o
VITE_ECONOMIC_AI_MODEL=gpt-3.5-turbo

# Paramètres IA
VITE_AI_TIMEOUT=30000
VITE_MAX_TOKENS=4000
VITE_AI_TEMPERATURE=0.7

# ===========================================
# CONFIGURATION LINKEDIN
# ===========================================

# OAuth LinkedIn (OBLIGATOIRE pour LinkedIn)
VITE_LINKEDIN_CLIENT_ID=your-linkedin-client-id
VITE_LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
VITE_LINKEDIN_REDIRECT_URI=http://localhost:8088/auth/linkedin/callback

# API LinkedIn
VITE_LINKEDIN_API_VERSION=v2
VITE_LINKEDIN_SCOPE=r_liteprofile,r_emailaddress,w_member_social

# ===========================================
# CONFIGURATION DÉVELOPPEMENT
# ===========================================

# Serveur de développement
VITE_DEV_SERVER_PORT=8088
VITE_PROXY_SERVER_PORT=3001

# Debug
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=info

# ===========================================
# CONFIGURATION PRODUCTION
# ===========================================

# URLs de production
VITE_API_BASE_URL=https://api.korev.ai
VITE_APP_URL=https://kora.korev.ai

# Analytics
VITE_ANALYTICS_ID=your-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn
```

</details>

### ⚙️ **Configuration Avancée**

<details>
<summary>Personnalisation des prompts et templates</summary>

#### **Personnaliser les Prompts IA**

Modifiez `src/lib/ai-service.ts` :

```typescript
// Personnaliser le prompt système
const buildSystemPrompt = (platform: string, tone: string) => {
  return `Tu es Kora, l'IA de Korev AI spécialisée en ${platform}.
  Ton ton est ${tone}.
  Crée du contenu engageant et professionnel...`;
};

// Ajouter de nouveaux tons
const TONES = {
  professional: "Professionnel et stratégique",
  innovative: "Innovant et futuriste",
  educational: "Éducatif et expert",
  inspirational: "Inspirant et visionnaire",
  casual: "Décontracté et accessible", // Nouveau ton
  technical: "Technique et précis"      // Nouveau ton
};
```

#### **Ajouter de Nouvelles Plateformes**

Dans `src/components/InspirationAI.tsx` :

```typescript
const PLATFORMS = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { id: 'instagram', name: 'Instagram', icon: Instagram },
  { id: 'twitter', name: 'X/Twitter', icon: Twitter },
  { id: 'tiktok', name: 'TikTok', icon: Video },     // Nouvelle plateforme
  { id: 'youtube', name: 'YouTube', icon: Youtube }   // Nouvelle plateforme
];
```

</details>

---

## 📱 Intégrations

### 🔗 **LinkedIn Integration**

Notre intégration LinkedIn complète permet :

#### ✅ **Fonctionnalités Disponibles**
- **🔐 Authentification OAuth 2.0** - Connexion sécurisée
- **📝 Publication de posts** - Texte, images, liens
- **📊 Analytics en temps réel** - Vues, likes, commentaires
- **👥 Gestion du profil** - Informations utilisateur
- **🔄 Synchronisation automatique** - Mise à jour des stats

#### 🚀 **Configuration LinkedIn**

1. **Créer une application LinkedIn** :
   - Allez sur [LinkedIn Developers](https://www.linkedin.com/developers/)
   - Créez une nouvelle application
   - Configurez les redirections : `http://localhost:8088/auth/linkedin/callback`

2. **Configurer les permissions** :
   ```
   r_liteprofile     # Profil utilisateur
   r_emailaddress    # Email utilisateur
   w_member_social   # Publication de contenu
   ```

3. **Ajouter les clés dans `.env.local`** :
   ```env
   VITE_LINKEDIN_CLIENT_ID=your-client-id
   VITE_LINKEDIN_CLIENT_SECRET=your-client-secret
   ```

#### 🧪 **Tester l'Intégration**

```bash
# Lancer le serveur complet avec proxy LinkedIn
npm run dev:full

# Tester l'authentification
curl http://localhost:3001/api/linkedin/token

# Accéder aux pages de test
# http://localhost:8088/linkedin-test
# http://localhost:8088/linkedin-debug
```

### 🔄 **Autres Intégrations (En Développement)**

| Plateforme | Statut | Fonctionnalités Prévues |
|------------|--------|-------------------------|
| **Instagram** | 🔄 En cours | Posts, Stories, Réels |
| **Twitter/X** | 🔄 En cours | Tweets, Threads |
| **Facebook** | 📋 Planifié | Posts, Pages |
| **TikTok** | 📋 Planifié | Vidéos courtes |
| **YouTube** | 📋 Planifié | Descriptions, Shorts |

---

## 🧪 Tests

### 🔍 **Tests de Connectivité**

#### **Test IA Intégré**
```bash
# Accéder à l'interface de test
http://localhost:8088/settings

# Ou utiliser l'API directement
curl -X POST http://localhost:8088/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test de connectivité"}'
```

#### **Test LinkedIn**
```bash
# Pages de test disponibles
http://localhost:8088/linkedin-test          # Test complet
http://localhost:8088/linkedin-test-simple   # Test simple
http://localhost:8088/linkedin-debug         # Debug avancé
```

### 🛠️ **Scripts de Test**

```bash
# Test de l'environnement
node debug-env.js

# Test des credentials LinkedIn
node test-linkedin-credentials.cjs

# Validation complète
node validate-linkedin.js

# Test du bouton LinkedIn
node test-bouton-linkedin.js
```

### 📊 **Monitoring et Debug**

#### **Logs en Temps Réel**
- 🤖 **Console IA** : Tentatives de génération
- ✅ **Succès** : Provider utilisé et temps de réponse
- ❌ **Échecs** : Erreurs et raisons
- 🔄 **Fallback** : Basculement automatique

#### **Debug LinkedIn**
- 📡 **Requêtes API** : Headers et payload
- 🔐 **Authentification** : Statut des tokens
- 📊 **Réponses** : Données reçues de LinkedIn

---

## 📊 Analytics

### 📈 **Métriques Disponibles**

#### **Performance IA**
- ⚡ **Temps de réponse** par provider
- 💰 **Coût par requête** (estimation)
- 📊 **Taux de succès** par modèle
- 🔄 **Utilisation du fallback**

#### **Engagement Social**
- 👀 **Vues** par plateforme
- ❤️ **Likes et réactions**
- 💬 **Commentaires et partages**
- 📈 **Croissance de l'audience**

#### **Contenu**
- 📝 **Types de contenu** les plus performants
- 🎯 **Tons** les plus engageants
- ⏰ **Meilleurs moments** de publication
- 🏷️ **Hashtags** populaires

### 📊 **Dashboard Analytics**

```typescript
// Exemple d'utilisation du hook analytics
const { stats, loading, error } = useLinkedInStats();

// Métriques disponibles
stats.totalViews      // Vues totales
stats.totalLikes      // Likes totaux
stats.totalComments   // Commentaires totaux
stats.engagementRate  // Taux d'engagement
stats.topPosts        // Posts les plus performants
```

---

## 🚀 Déploiement

### 🌐 **Déploiement Vercel (Recommandé)**

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Build du projet
npm run build

# 3. Déployer
vercel --prod

# 4. Configurer les variables d'environnement
vercel env add VITE_ANTHROPIC_API_KEY
vercel env add VITE_OPENAI_API_KEY
vercel env add VITE_LINKEDIN_CLIENT_ID
vercel env add VITE_LINKEDIN_CLIENT_SECRET
```

### 🐳 **Déploiement Docker**

<details>
<summary>Configuration Docker</summary>

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
RUN npm ci --only=production

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Exposer le port
EXPOSE 8088

# Commande de démarrage
CMD ["npm", "run", "preview"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  kora-digital-pilot:
    build: .
    ports:
      - "8088:8088"
    environment:
      - VITE_ANTHROPIC_API_KEY=${VITE_ANTHROPIC_API_KEY}
      - VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}
      - VITE_LINKEDIN_CLIENT_ID=${VITE_LINKEDIN_CLIENT_ID}
      - VITE_LINKEDIN_CLIENT_SECRET=${VITE_LINKEDIN_CLIENT_SECRET}
    volumes:
      - ./.env.local:/app/.env.local:ro
```

```bash
# Commandes Docker
docker-compose up -d
docker-compose logs -f
```

</details>

### ☁️ **Autres Plateformes**

| Plateforme | Complexité | Documentation |
|------------|------------|---------------|
| **Netlify** | 🟢 Facile | [Guide Netlify](https://docs.netlify.com/) |
| **Railway** | 🟢 Facile | [Guide Railway](https://docs.railway.app/) |
| **Heroku** | 🟡 Moyen | [Guide Heroku](https://devcenter.heroku.com/) |
| **AWS** | 🔴 Complexe | [Guide AWS](https://aws.amazon.com/getting-started/) |

---

## 🤝 Contribution

### 🛠️ **Guide de Contribution**

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### 📋 **Standards de Code**

```bash
# Vérification du code
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run format        # Prettier (si configuré)

# Tests
npm run test          # Tests unitaires
npm run test:e2e      # Tests end-to-end
```

### 🐛 **Signaler un Bug**

Utilisez le [template d'issue](https://github.com/Makk7709/kora-digital-pilot/issues/new?template=bug_report.md) avec :

- 📝 **Description** claire du problème
- 🔄 **Étapes** pour reproduire
- 💻 **Environnement** (OS, navigateur, version)
- 📸 **Captures d'écran** si applicable

### 💡 **Proposer une Fonctionnalité**

Utilisez le [template de feature](https://github.com/Makk7709/kora-digital-pilot/issues/new?template=feature_request.md) avec :

- 🎯 **Objectif** de la fonctionnalité
- 📋 **Spécifications** détaillées
- 🎨 **Maquettes** ou wireframes
- 🔗 **Liens** vers des références

---

## 📞 Support

### 🆘 **Obtenir de l'Aide**

| Type de Support | Canal | Temps de Réponse |
|-----------------|-------|------------------|
| 🐛 **Bugs** | [GitHub Issues](https://github.com/Makk7709/kora-digital-pilot/issues) | 24-48h |
| 💡 **Questions** | [GitHub Discussions](https://github.com/Makk7709/kora-digital-pilot/discussions) | 1-3 jours |
| 📧 **Contact Direct** | [team@korev.ai](mailto:team@korev.ai) | 1-2 jours |

### 📚 **Documentation**

- 📖 **[Guide Complet](./AI_INTEGRATION.md)** - Documentation détaillée
- 🔗 **[API LinkedIn](./LINKEDIN_INTEGRATION_COMPLETE.md)** - Intégration LinkedIn
- 🎨 **[Guide Visuel](./BRAND_VISUAL_GUIDELINES.md)** - Guidelines de design
- 🤖 **[IA Avancée](./AI_FIXES_SUMMARY.md)** - Configuration IA

### 🔧 **Dépannage Rapide**

<details>
<summary>Problèmes Courants</summary>

#### **❌ L'IA ne fonctionne pas**
```bash
# Vérifier les clés API
echo $VITE_ANTHROPIC_API_KEY
echo $VITE_OPENAI_API_KEY

# Tester la connectivité
curl -H "Authorization: Bearer $VITE_OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

#### **❌ LinkedIn ne se connecte pas**
```bash
# Vérifier la configuration
node test-linkedin-credentials.cjs

# Vérifier le serveur proxy
curl http://localhost:3001/api/linkedin/token
```

#### **❌ Build échoue**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Vérifier TypeScript
npm run type-check
```

</details>

### 📊 **Statut du Service**

- 🟢 **API IA** : Opérationnel
- 🟢 **LinkedIn API** : Opérationnel  
- 🟢 **Interface Web** : Opérationnel
- 🟡 **Instagram API** : En développement
- 🟡 **Twitter API** : En développement

---

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- 🎨 **[shadcn/ui](https://ui.shadcn.com/)** - Composants UI magnifiques
- 🤖 **[Anthropic](https://www.anthropic.com/)** - Claude AI
- 🧠 **[OpenAI](https://openai.com/)** - GPT & DALL-E
- 🔗 **[LinkedIn](https://developer.linkedin.com/)** - API sociale
- ⚡ **[Vite](https://vitejs.dev/)** - Build tool ultra-rapide

---

<div align="center">

**🎉 Développé avec ❤️ par l'équipe Korev AI**

[![GitHub stars](https://img.shields.io/github/stars/Makk7709/kora-digital-pilot?style=social)](https://github.com/Makk7709/kora-digital-pilot/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Makk7709/kora-digital-pilot?style=social)](https://github.com/Makk7709/kora-digital-pilot/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/Makk7709/kora-digital-pilot?style=social)](https://github.com/Makk7709/kora-digital-pilot/watchers)

[⬆ Retour en haut](#-kora-digital-pilot)

</div>
