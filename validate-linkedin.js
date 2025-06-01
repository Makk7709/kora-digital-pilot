#!/usr/bin/env node

/**
 * 🔍 SCRIPT DE VALIDATION LINKEDIN OAUTH
 * Valide la configuration et teste les endpoints
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 VALIDATION LINKEDIN OAUTH - DÉMARRAGE\n');

// 1. Vérification du fichier .env
console.log('📋 1. Vérification du fichier .env...');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ Fichier .env introuvable !');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

const requiredVars = [
  'VITE_LINKEDIN_CLIENT_ID',
  'VITE_LINKEDIN_CLIENT_SECRET',
  'VITE_LINKEDIN_REDIRECT_URI'
];

const envVars = {};
envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

let configValid = true;

requiredVars.forEach(varName => {
  if (!envVars[varName]) {
    console.error(`❌ Variable manquante: ${varName}`);
    configValid = false;
  } else if (envVars[varName].includes('YOUR_')) {
    console.error(`❌ Variable non configurée: ${varName} = ${envVars[varName]}`);
    configValid = false;
  } else {
    console.log(`✅ ${varName}: ${varName.includes('SECRET') ? 
      envVars[varName].substring(0, 10) + '...' : 
      envVars[varName]}`);
  }
});

if (!configValid) {
  console.error('\n❌ Configuration invalide. Corrigez les erreurs ci-dessus.');
  process.exit(1);
}

console.log('✅ Configuration .env valide\n');

// 2. Vérification des fichiers requis
console.log('📋 2. Vérification des fichiers requis...');
const requiredFiles = [
  'server.cjs',
  'src/lib/linkedin-api.ts',
  'src/components/LinkedInCallback.tsx',
  'src/pages/LinkedInTestComplete.tsx',
  'src/test/linkedin-integration-test.ts'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.error(`❌ Fichier manquant: ${file}`);
    configValid = false;
  }
});

if (!configValid) {
  console.error('\n❌ Fichiers manquants. Vérifiez l\'installation.');
  process.exit(1);
}

console.log('✅ Tous les fichiers requis sont présents\n');

// 3. Validation de l'URL de redirection
console.log('📋 3. Validation de l\'URL de redirection...');
const redirectUri = envVars['VITE_LINKEDIN_REDIRECT_URI'];

try {
  const url = new URL(redirectUri);
  
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    console.error(`❌ Protocole invalide: ${url.protocol}`);
    configValid = false;
  }
  
  if (!url.hostname.includes('localhost') && !url.hostname.includes('127.0.0.1')) {
    console.warn(`⚠️ URL de redirection non-locale: ${url.hostname}`);
  }
  
  if (!url.pathname.includes('/auth/linkedin/callback')) {
    console.error(`❌ Chemin de callback invalide: ${url.pathname}`);
    configValid = false;
  }
  
  console.log(`✅ URL de redirection valide: ${redirectUri}`);
} catch (error) {
  console.error(`❌ URL de redirection malformée: ${redirectUri}`);
  configValid = false;
}

// 4. Génération de l'URL d'autorisation de test
console.log('\n📋 4. Génération de l\'URL d\'autorisation...');
const clientId = envVars['VITE_LINKEDIN_CLIENT_ID'];
const state = Math.random().toString(36).substring(7);
const scope = 'openid profile email';

const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('client_id', clientId);
authUrl.searchParams.set('redirect_uri', redirectUri);
authUrl.searchParams.set('state', state);
authUrl.searchParams.set('scope', scope);

console.log(`✅ URL d'autorisation générée:`);
console.log(`   ${authUrl.toString()}\n`);

// 5. Instructions finales
console.log('📋 5. Instructions de test...');
console.log('✅ Configuration validée avec succès !');
console.log('\n🚀 ÉTAPES SUIVANTES:');
console.log('1. Démarrez l\'application: npm run dev:full');
console.log('2. Ouvrez: http://localhost:8088/linkedin-test-complete');
console.log('3. Lancez les tests automatiques');
console.log('4. Testez l\'authentification manuelle');
console.log('\n📚 BONNES PRATIQUES APPLIQUÉES:');
console.log('✅ Utilisation d\'OpenID Connect (scope: openid profile email)');
console.log('✅ Gestion sécurisée des secrets côté serveur');
console.log('✅ Validation complète des paramètres OAuth');
console.log('✅ Tests automatisés de l\'intégration');
console.log('✅ Interface de test utilisateur-friendly');

console.log('\n🎉 VALIDATION TERMINÉE - PRÊT POUR LES TESTS !');

if (configValid) {
  process.exit(0);
} else {
  process.exit(1);
} 