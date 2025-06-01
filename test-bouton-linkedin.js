#!/usr/bin/env node

/**
 * 🔍 TEST BOUTON LINKEDIN
 * Vérification complète du problème
 */

import fetch from 'node-fetch';

console.log('🔍 TEST BOUTON LINKEDIN\n');

// Test 1: Serveurs actifs
console.log('📋 1. Vérification des serveurs...');
try {
  const [reactResponse, proxyResponse] = await Promise.all([
    fetch('http://localhost:8088').catch(() => null),
    fetch('http://localhost:3001/api/health').catch(() => null)
  ]);

  if (reactResponse?.ok) {
    console.log('✅ Application React accessible (port 8088)');
  } else {
    console.log('❌ Application React non accessible');
  }

  if (proxyResponse?.ok) {
    console.log('✅ Serveur proxy accessible (port 3001)');
  } else {
    console.log('❌ Serveur proxy non accessible');
  }
} catch (error) {
  console.log('❌ Erreur test serveurs:', error.message);
}

// Test 2: Configuration .env.local
console.log('\n📋 2. Vérification configuration...');
import fs from 'fs';

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  const config = {};
  lines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      config[key.trim()] = value.trim();
    }
  });

  const requiredVars = [
    'VITE_LINKEDIN_CLIENT_ID',
    'VITE_LINKEDIN_CLIENT_SECRET', 
    'VITE_LINKEDIN_REDIRECT_URI'
  ];

  let allConfigured = true;
  requiredVars.forEach(varName => {
    if (config[varName]) {
      console.log(`✅ ${varName}: ${varName.includes('SECRET') ? config[varName].substring(0, 10) + '...' : config[varName]}`);
    } else {
      console.log(`❌ ${varName}: NON DÉFINIE`);
      allConfigured = false;
    }
  });

  if (allConfigured) {
    console.log('✅ Configuration complète');
  } else {
    console.log('❌ Configuration incomplète');
  }
} catch (error) {
  console.log('❌ Erreur lecture .env.local:', error.message);
}

// Test 3: Pages accessibles
console.log('\n📋 3. Test des pages...');
const pages = [
  'http://localhost:8088/',
  'http://localhost:8088/linkedin-test-simple',
  'http://localhost:8088/linkedin-test-complete'
];

for (const page of pages) {
  try {
    const response = await fetch(page);
    if (response.ok) {
      console.log(`✅ ${page.split('/').pop() || 'accueil'}: accessible`);
    } else {
      console.log(`❌ ${page.split('/').pop() || 'accueil'}: erreur ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ ${page.split('/').pop() || 'accueil'}: inaccessible`);
  }
}

console.log('\n🎯 INSTRUCTIONS POUR VOIR LE BOUTON:');
console.log('1. Ouvrez votre navigateur');
console.log('2. Allez sur: http://localhost:8088/linkedin-test-simple');
console.log('3. Ouvrez la console développeur (F12)');
console.log('4. Vérifiez les variables d\'environnement dans les logs');
console.log('5. Le bouton "Se connecter à LinkedIn" devrait être visible');

console.log('\n🔧 SI LE BOUTON N\'APPARAÎT PAS:');
console.log('1. Vérifiez que l\'application tourne sur le bon port (8088)');
console.log('2. Redémarrez l\'application: npm run dev:full');
console.log('3. Videz le cache du navigateur (Ctrl+F5)');
console.log('4. Vérifiez la console pour les erreurs JavaScript');

console.log('\n📱 PAGES DE TEST DISPONIBLES:');
console.log('• http://localhost:8088/linkedin-test-simple (test basique)');
console.log('• http://localhost:8088/linkedin-test-complete (test complet)');
console.log('• http://localhost:8088/ (application principale)');

console.log('\n✅ Test terminé !'); 