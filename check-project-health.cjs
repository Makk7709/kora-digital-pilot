#!/usr/bin/env node

/**
 * 🔍 Script de Vérification de la Santé du Projet
 * Kora Digital Pilot - Health Check
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Kora Digital Pilot - Vérification de la Santé du Projet\n');

// Couleurs pour la console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const checkmark = '✅';
const crossmark = '❌';
const warning = '⚠️';

let score = 0;
let totalChecks = 0;

function check(condition, message, isRequired = true) {
  totalChecks++;
  if (condition) {
    console.log(`${checkmark} ${colors.green}${message}${colors.reset}`);
    score++;
    return true;
  } else {
    const icon = isRequired ? crossmark : warning;
    const color = isRequired ? colors.red : colors.yellow;
    console.log(`${icon} ${color}${message}${colors.reset}`);
    return false;
  }
}

function checkFileExists(filePath, description, isRequired = true) {
  return check(fs.existsSync(filePath), `${description}: ${filePath}`, isRequired);
}

function checkPackageScript(scriptName, description) {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return check(
      packageJson.scripts && packageJson.scripts[scriptName],
      `${description}: npm run ${scriptName}`,
      true
    );
  } catch (error) {
    return check(false, `${description}: npm run ${scriptName}`, true);
  }
}

console.log(`${colors.bold}📋 Vérification des Fichiers Essentiels${colors.reset}`);
checkFileExists('README.md', 'Documentation principale');
checkFileExists('package.json', 'Configuration npm');
checkFileExists('vite.config.ts', 'Configuration Vite');
checkFileExists('tsconfig.json', 'Configuration TypeScript');
checkFileExists('tailwind.config.ts', 'Configuration Tailwind');

console.log(`\n${colors.bold}🤝 Vérification de la Documentation GitHub${colors.reset}`);
checkFileExists('.github/ISSUE_TEMPLATE/bug_report.md', 'Template bug report');
checkFileExists('.github/ISSUE_TEMPLATE/feature_request.md', 'Template feature request');
checkFileExists('.github/pull_request_template.md', 'Template pull request');
checkFileExists('CONTRIBUTING.md', 'Guide de contribution');
checkFileExists('LICENSE', 'Licence du projet');

console.log(`\n${colors.bold}🏗️ Vérification de la Structure du Projet${colors.reset}`);
checkFileExists('src/App.tsx', 'Composant principal React');
checkFileExists('src/components', 'Dossier des composants');
checkFileExists('src/pages', 'Dossier des pages');
checkFileExists('src/lib', 'Dossier des services');
checkFileExists('src/hooks', 'Dossier des hooks');

console.log(`\n${colors.bold}⚙️ Vérification des Scripts npm${colors.reset}`);
checkPackageScript('dev', 'Script de développement');
checkPackageScript('build', 'Script de build');
checkPackageScript('lint', 'Script de linting');
checkPackageScript('dev:full', 'Script de développement complet');
checkPackageScript('proxy', 'Script du serveur proxy');

console.log(`\n${colors.bold}🔧 Vérification de la Configuration${colors.reset}`);
checkFileExists('.env.local.example', 'Exemple de configuration', false);
checkFileExists('.gitignore', 'Configuration Git ignore');
checkFileExists('server.cjs', 'Serveur proxy LinkedIn');

console.log(`\n${colors.bold}🎨 Vérification des Assets${colors.reset}`);
checkFileExists('public', 'Dossier des assets publics');
checkFileExists('index.html', 'Page HTML principale');

// Vérification des dépendances importantes
console.log(`\n${colors.bold}📦 Vérification des Dépendances${colors.reset}`);
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  check(deps.react, 'React installé');
  check(deps.typescript, 'TypeScript installé');
  check(deps.vite, 'Vite installé');
  check(deps['tailwindcss'], 'Tailwind CSS installé');
  check(deps['@tanstack/react-query'], 'React Query installé');
} catch (error) {
  check(false, 'Lecture du package.json');
}

// Résumé final
console.log(`\n${colors.bold}📊 Résumé de la Vérification${colors.reset}`);
const percentage = Math.round((score / totalChecks) * 100);
const status = percentage >= 90 ? 'Excellent' : percentage >= 75 ? 'Bon' : percentage >= 50 ? 'Moyen' : 'Problématique';
const statusColor = percentage >= 90 ? colors.green : percentage >= 75 ? colors.blue : percentage >= 50 ? colors.yellow : colors.red;

console.log(`Score: ${statusColor}${score}/${totalChecks} (${percentage}%)${colors.reset}`);
console.log(`Statut: ${statusColor}${status}${colors.reset}`);

if (percentage >= 90) {
  console.log(`\n🎉 ${colors.green}Félicitations ! Votre projet Kora Digital Pilot est parfaitement configuré !${colors.reset}`);
} else if (percentage >= 75) {
  console.log(`\n👍 ${colors.blue}Très bien ! Votre projet est bien configuré avec quelques améliorations mineures possibles.${colors.reset}`);
} else if (percentage >= 50) {
  console.log(`\n⚠️ ${colors.yellow}Attention ! Votre projet nécessite quelques ajustements pour être optimal.${colors.reset}`);
} else {
  console.log(`\n🚨 ${colors.red}Problème ! Votre projet nécessite des corrections importantes.${colors.reset}`);
}

console.log(`\n${colors.bold}🚀 Prochaines Étapes Recommandées:${colors.reset}`);
console.log('1. Configurez vos clés API dans .env.local');
console.log('2. Testez l\'application avec: npm run dev:full');
console.log('3. Vérifiez la connectivité IA dans les paramètres');
console.log('4. Explorez la documentation dans le README.md');

console.log(`\n${colors.bold}📞 Besoin d'aide ?${colors.reset}`);
console.log('• Documentation: README.md');
console.log('• Issues: https://github.com/Makk7709/kora-digital-pilot/issues');
console.log('• Discussions: https://github.com/Makk7709/kora-digital-pilot/discussions');
console.log('• Email: team@korev.ai');

process.exit(percentage >= 50 ? 0 : 1); 