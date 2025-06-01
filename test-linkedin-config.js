#!/usr/bin/env node

// Script de test pour vérifier la configuration LinkedIn
console.log('🔍 Test de configuration LinkedIn\n');

// Configuration attendue
const expectedConfig = {
  clientId: '771wyq0br5qhum',
  clientSecret: 'WPL_AP1.OSKEq3inhy5qYt$',
  redirectUri: 'http://localhost:8088/auth/linkedin/callback',
  port: 8088
};

console.log('📋 Configuration attendue:');
console.log(`  Client ID: ${expectedConfig.clientId}`);
console.log(`  Client Secret: ${expectedConfig.clientSecret.substring(0, 10)}...`);
console.log(`  Redirect URI: ${expectedConfig.redirectUri}`);
console.log(`  Port: ${expectedConfig.port}\n`);

// Test des URLs
const testUrls = [
  'http://localhost:8088',
  'http://localhost:8088/linkedin-test-simple',
  'http://localhost:8088/auth/linkedin/callback?code=test&state=test'
];

console.log('🌐 URLs à tester:');
testUrls.forEach(url => {
  console.log(`  ✓ ${url}`);
});

console.log('\n📝 Instructions pour LinkedIn Developer Portal:');
console.log('1. Aller sur https://developer.linkedin.com/');
console.log('2. Sélectionner votre app "CM KORA"');
console.log('3. Dans "Auth" > "Authorized redirect URLs", ajouter:');
console.log(`   ${expectedConfig.redirectUri}`);
console.log('4. Vérifier que les permissions suivantes sont activées:');
console.log('   - r_liteprofile');
console.log('   - r_emailaddress');
console.log('5. S\'assurer que l\'app est en mode "Development"');

console.log('\n🧪 Tests à effectuer:');
console.log('1. Ouvrir http://localhost:8088/linkedin-test-simple');
console.log('2. Cliquer sur "Tester URL d\'authentification"');
console.log('3. Vérifier l\'URL générée');
console.log('4. Cliquer sur "Se connecter à LinkedIn"');
console.log('5. Autoriser l\'application');
console.log('6. Vérifier la redirection vers le callback');
console.log('7. Vérifier le retour vers l\'application');

console.log('\n🔧 En cas de problème:');
console.log('- Vérifier la console du navigateur');
console.log('- Vérifier l\'onglet Network pour les requêtes');
console.log('- Utiliser les boutons de test de diagnostic');
console.log('- Nettoyer le localStorage si nécessaire');

console.log('\n✅ Configuration terminée !'); 