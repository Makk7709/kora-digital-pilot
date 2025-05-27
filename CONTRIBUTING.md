# 🤝 Guide de Contribution - Kora Digital Pilot

Merci de votre intérêt pour contribuer à **Kora Digital Pilot** ! Ce guide vous aidera à comprendre comment participer efficacement au développement du projet.

## 📋 Table des Matières

- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🔧 Configuration de l'Environnement](#-configuration-de-lenvironnement)
- [📝 Types de Contributions](#-types-de-contributions)
- [🌿 Workflow Git](#-workflow-git)
- [📋 Standards de Code](#-standards-de-code)
- [🧪 Tests](#-tests)
- [📖 Documentation](#-documentation)
- [🐛 Signaler des Bugs](#-signaler-des-bugs)
- [💡 Proposer des Fonctionnalités](#-proposer-des-fonctionnalités)
- [👥 Code de Conduite](#-code-de-conduite)

---

## 🚀 Démarrage Rapide

### 1. Fork et Clone

```bash
# Fork le repository sur GitHub, puis clonez votre fork
git clone https://github.com/VOTRE-USERNAME/kora-digital-pilot.git
cd kora-digital-pilot

# Ajoutez le repository original comme remote
git remote add upstream https://github.com/Makk7709/kora-digital-pilot.git
```

### 2. Installation

```bash
# Installez les dépendances
npm install

# Copiez la configuration d'exemple
cp .env.local.example .env.local

# Configurez vos clés API (optionnel pour le développement)
# Éditez .env.local avec vos clés
```

### 3. Vérification

```bash
# Vérifiez que tout fonctionne
npm run lint
npm run build
npm run dev
```

---

## 🔧 Configuration de l'Environnement

### Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** >= 2.30.0
- **Éditeur** avec support TypeScript (VS Code recommandé)

### Extensions VS Code Recommandées

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Configuration des Clés API (Optionnel)

Pour tester les fonctionnalités IA et LinkedIn :

```env
# .env.local
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
VITE_OPENAI_API_KEY=sk-proj-your-key-here
VITE_LINKEDIN_CLIENT_ID=your-linkedin-client-id
VITE_LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

---

## 📝 Types de Contributions

### 🐛 Corrections de Bugs

- Corrigez les bugs signalés dans les [Issues](https://github.com/Makk7709/kora-digital-pilot/issues)
- Ajoutez des tests pour éviter les régressions
- Documentez la correction dans le commit

### ✨ Nouvelles Fonctionnalités

- Proposez d'abord la fonctionnalité via une [Issue](https://github.com/Makk7709/kora-digital-pilot/issues/new/choose)
- Attendez l'approbation avant de commencer le développement
- Suivez les standards de design existants

### 📖 Documentation

- Améliorez le README, les guides, ou les commentaires de code
- Ajoutez des exemples d'utilisation
- Traduisez la documentation

### 🧪 Tests

- Ajoutez des tests pour les fonctionnalités non couvertes
- Améliorez les tests existants
- Ajoutez des tests d'intégration

### 🎨 Design et UX

- Améliorez l'interface utilisateur
- Optimisez l'expérience utilisateur
- Assurez-vous de la cohérence visuelle

---

## 🌿 Workflow Git

### 1. Synchronisation

```bash
# Avant de commencer, synchronisez avec upstream
git checkout main
git pull upstream main
git push origin main
```

### 2. Création de Branche

```bash
# Créez une branche descriptive
git checkout -b feature/nom-de-la-fonctionnalite
# ou
git checkout -b fix/description-du-bug
# ou
git checkout -b docs/amelioration-documentation
```

### 3. Développement

```bash
# Faites vos changements
# Testez régulièrement
npm run dev
npm run lint
npm run build

# Commitez avec des messages clairs
git add .
git commit -m "feat: ajouter la fonctionnalité X"
```

### 4. Push et Pull Request

```bash
# Poussez votre branche
git push origin feature/nom-de-la-fonctionnalite

# Créez une Pull Request sur GitHub
# Utilisez le template fourni
```

### Convention de Nommage des Branches

- `feature/description` - Nouvelles fonctionnalités
- `fix/description` - Corrections de bugs
- `docs/description` - Documentation
- `refactor/description` - Refactoring
- `test/description` - Tests
- `chore/description` - Maintenance

---

## 📋 Standards de Code

### TypeScript

```typescript
// ✅ Bon
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  // Implementation
};

// ❌ Éviter
const getUserProfile = async (userId: any) => {
  // Implementation
};
```

### React Components

```tsx
// ✅ Bon - Composant fonctionnel avec TypeScript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
```

### Styling avec Tailwind

```tsx
// ✅ Bon - Classes organisées et lisibles
<div className="
  flex items-center justify-between
  p-4 bg-white rounded-lg shadow-md
  hover:shadow-lg transition-shadow
  dark:bg-gray-800 dark:text-white
">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    Titre
  </h2>
</div>

// ❌ Éviter - Classes en ligne trop longues
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800 dark:text-white">
```

### Gestion des Erreurs

```typescript
// ✅ Bon - Gestion d'erreur appropriée
try {
  const result = await aiService.generateContent(prompt);
  return result;
} catch (error) {
  console.error('Erreur lors de la génération:', error);
  throw new Error('Impossible de générer le contenu');
}

// ❌ Éviter - Erreurs silencieuses
try {
  const result = await aiService.generateContent(prompt);
  return result;
} catch (error) {
  // Erreur ignorée
}
```

### Convention de Commits

Utilisez [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Types de commits
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage, style
refactor: refactoring
test: ajout/modification de tests
chore: maintenance

# Exemples
git commit -m "feat: ajouter l'authentification LinkedIn"
git commit -m "fix: corriger le bug de génération IA"
git commit -m "docs: mettre à jour le guide d'installation"
```

---

## 🧪 Tests

### Tests Unitaires

```typescript
// Exemple de test avec Jest/Vitest
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Tests d'Intégration

```bash
# Tester l'IA
npm run test:ai

# Tester LinkedIn
npm run test:linkedin

# Tests complets
npm run test
```

### Tests Manuels

Avant de soumettre une PR, testez :

1. **Fonctionnalité principale** - Votre changement fonctionne
2. **Régression** - Les fonctionnalités existantes marchent toujours
3. **Responsive** - Interface adaptée mobile/desktop
4. **Accessibilité** - Navigation au clavier, lecteurs d'écran
5. **Performance** - Pas de ralentissement notable

---

## 📖 Documentation

### Commentaires de Code

```typescript
/**
 * Génère du contenu avec l'IA en utilisant le système de fallback
 * @param prompt - Le prompt à envoyer à l'IA
 * @param platform - La plateforme cible (linkedin, instagram, etc.)
 * @param tone - Le ton souhaité pour le contenu
 * @returns Promise<string> - Le contenu généré
 * @throws Error - Si aucun provider n'est disponible
 */
export const generateContent = async (
  prompt: string,
  platform: Platform,
  tone: Tone
): Promise<string> => {
  // Implementation...
};
```

### README et Guides

- Utilisez des exemples concrets
- Incluez des captures d'écran si pertinent
- Maintenez la cohérence avec le style existant
- Testez vos instructions sur un environnement propre

---

## 🐛 Signaler des Bugs

### Avant de Signaler

1. **Vérifiez** que le bug n'a pas déjà été signalé
2. **Reproduisez** le bug de manière consistante
3. **Testez** avec la dernière version
4. **Collectez** les informations nécessaires

### Informations à Inclure

- **Description** claire du problème
- **Étapes** pour reproduire
- **Comportement attendu** vs **comportement actuel**
- **Environnement** (OS, navigateur, version)
- **Logs/erreurs** de la console
- **Captures d'écran** si applicable

### Template

Utilisez le [template de bug report](.github/ISSUE_TEMPLATE/bug_report.md) fourni.

---

## 💡 Proposer des Fonctionnalités

### Processus

1. **Recherchez** si la fonctionnalité n'existe pas déjà
2. **Créez une Issue** avec le [template feature request](.github/ISSUE_TEMPLATE/feature_request.md)
3. **Discutez** avec la communauté
4. **Attendez l'approbation** avant de développer
5. **Développez** en suivant les standards
6. **Soumettez** une Pull Request

### Critères d'Acceptation

- ✅ **Alignement** avec la vision du projet
- ✅ **Qualité** du code et des tests
- ✅ **Documentation** appropriée
- ✅ **Performance** acceptable
- ✅ **Accessibilité** respectée

---

## 👥 Code de Conduite

### Nos Engagements

- **Respect** mutuel et bienveillance
- **Inclusion** de tous les contributeurs
- **Collaboration** constructive
- **Apprentissage** continu

### Comportements Attendus

- Utiliser un langage accueillant et inclusif
- Respecter les différents points de vue
- Accepter les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté

### Comportements Inacceptables

- Langage ou imagerie sexualisés
- Commentaires insultants ou désobligeants
- Harcèlement public ou privé
- Publication d'informations privées sans permission

### Application

Les instances de comportement abusif peuvent être signalées à [team@korev.ai](mailto:team@korev.ai).

---

## 🎉 Reconnaissance

Tous les contributeurs seront reconnus dans :

- 📝 **README** - Section remerciements
- 🏆 **Releases** - Notes de version
- 👥 **Contributors** - Page GitHub

### Types de Contributions Reconnues

- 💻 Code
- 📖 Documentation
- 🎨 Design
- 🐛 Bug reports
- 💡 Idées
- 🧪 Tests
- 🌍 Traductions
- 📢 Promotion

---

## 📞 Besoin d'Aide ?

- 💬 **Discussions** : [GitHub Discussions](https://github.com/Makk7709/kora-digital-pilot/discussions)
- 🐛 **Issues** : [GitHub Issues](https://github.com/Makk7709/kora-digital-pilot/issues)
- 📧 **Email** : [team@korev.ai](mailto:team@korev.ai)

---

**Merci de contribuer à Kora Digital Pilot ! 🚀**

*Ensemble, nous construisons l'avenir de la communication digitale avec l'IA.* 