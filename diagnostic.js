#!/usr/bin/env node

console.log('🔍 Diagnostic Kora Digital - Application React');
console.log('================================================');

// Vérifier les dépendances principales
const fs = require('fs');
const path = require('path');

try {
  // Vérifier package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('✅ package.json trouvé');
  console.log(`   - React: ${packageJson.dependencies?.react || 'Non trouvé'}`);
  console.log(`   - TypeScript: ${packageJson.devDependencies?.typescript || 'Non trouvé'}`);
  console.log(`   - Vite: ${packageJson.devDependencies?.vite || 'Non trouvé'}`);

  // Vérifier les fichiers critiques
  const criticalFiles = [
    'src/main.tsx',
    'src/App.tsx',
    'src/pages/Index.tsx',
    'src/components/Planning.tsx',
    'index.html'
  ];

  console.log('\n📁 Fichiers critiques:');
  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} - MANQUANT`);
    }
  });

  // Vérifier la structure des dossiers
  const criticalDirs = [
    'src',
    'src/components',
    'src/pages',
    'src/hooks',
    'src/lib',
    'public'
  ];

  console.log('\n📂 Structure des dossiers:');
  criticalDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`   ✅ ${dir}/`);
    } else {
      console.log(`   ❌ ${dir}/ - MANQUANT`);
    }
  });

  // Vérifier les variables d'environnement
  console.log('\n🔧 Configuration:');
  console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'non défini'}`);
  console.log(`   - Port Vite: 8088 (configuré)`);

  // Vérifier les erreurs potentielles dans les fichiers
  console.log('\n🔍 Analyse des erreurs potentielles:');
  
  // Vérifier main.tsx
  if (fs.existsSync('src/main.tsx')) {
    const mainContent = fs.readFileSync('src/main.tsx', 'utf8');
    if (mainContent.includes('ReactDOM.createRoot')) {
      console.log('   ✅ Point d\'entrée React 18 correct');
    } else {
      console.log('   ⚠️  Point d\'entrée React potentiellement incorrect');
    }
  }

  // Vérifier App.tsx
  if (fs.existsSync('src/App.tsx')) {
    const appContent = fs.readFileSync('src/App.tsx', 'utf8');
    if (appContent.includes('BrowserRouter')) {
      console.log('   ✅ Router configuré');
    } else {
      console.log('   ⚠️  Router non trouvé');
    }
  }

  console.log('\n🚀 Recommandations:');
  console.log('   1. Vérifiez que le serveur Vite fonctionne sur http://localhost:8088');
  console.log('   2. Ouvrez la console développeur (F12) pour voir les erreurs JavaScript');
  console.log('   3. Vérifiez que tous les imports sont corrects');
  console.log('   4. Les erreurs proxy /api/anthropic/messages sont normales si l\'API n\'est pas configurée');

} catch (error) {
  console.error('❌ Erreur lors du diagnostic:', error.message);
}

console.log('\n📋 Commandes utiles:');
console.log('   npm run dev    - Démarrer en mode développement');
console.log('   npm run build  - Compiler l\'application');
console.log('   npm run preview - Prévisualiser la version compilée'); 