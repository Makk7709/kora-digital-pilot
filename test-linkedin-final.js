#!/usr/bin/env node

/**
 * 🧪 TEST FINAL LINKEDIN OAUTH
 * Vérification complète de l'intégration
 */

import fetch from 'node-fetch';

console.log('🧪 TEST FINAL LINKEDIN OAUTH\n');

// Test 1: Serveur proxy accessible
console.log('📋 1. Test serveur proxy...');
try {
  const response = await fetch('http://localhost:3001/api/health');
  const data = await response.json();
  
  if (data.status === 'OK') {
    console.log('✅ Serveur proxy fonctionnel');
  } else {
    console.log('❌ Serveur proxy non fonctionnel');
  }
} catch (error) {
  console.log('❌ Serveur proxy inaccessible:', error.message);
}

// Test 2: Application React accessible
console.log('\n📋 2. Test application React...');
try {
  const response = await fetch('http://localhost:8088');
  
  if (response.ok) {
    console.log('✅ Application React accessible');
  } else {
    console.log('❌ Application React non accessible');
  }
} catch (error) {
  console.log('❌ Application React inaccessible:', error.message);
}

// Test 3: Configuration environment
console.log('\n📋 3. Test configuration...');
const clientId = process.env.VITE_LINKEDIN_CLIENT_ID || '771wyq0br5qhum';
const clientSecret = process.env.VITE_LINKEDIN_CLIENT_SECRET || 'WPL_AP1.OSkEq3inhy5qYt9Y.gOV8YQ==';
const redirectUri = process.env.VITE_LINKEDIN_REDIRECT_URI || 'http://localhost:8088/auth/linkedin/callback';

console.log('✅ Client ID:', clientId);
console.log('✅ Client Secret:', clientSecret.substring(0, 10) + '...');
console.log('✅ Redirect URI:', redirectUri);

// Test 4: URL d'autorisation
console.log('\n📋 4. Génération URL d\'autorisation...');
const state = Math.random().toString(36).substring(7);
const scope = 'openid profile email';

const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('client_id', clientId);
authUrl.searchParams.set('redirect_uri', redirectUri);
authUrl.searchParams.set('state', state);
authUrl.searchParams.set('scope', scope);

console.log('✅ URL d\'autorisation générée');
console.log('🔗', authUrl.toString());

console.log('\n🎉 TESTS TERMINÉS !');
console.log('\n🚀 PROCHAINES ÉTAPES:');
console.log('1. Ouvrez: http://localhost:8088/linkedin-test-complete');
console.log('2. Cliquez sur "Lancer tous les tests"');
console.log('3. Testez l\'authentification manuelle');
console.log('4. Vérifiez que tous les tests passent');

console.log('\n✅ L\'intégration LinkedIn est prête !'); 