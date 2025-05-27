// Script de test des identifiants LinkedIn
// Exécuter avec: node test-linkedin-credentials.js

const fetch = require('node-fetch');

// Configuration actuelle (à vérifier)
const config = {
  clientId: '771wyq0br5qhum',
  clientSecret: 'WPL_AP1.OSKEq3inhy5qYt$',
  redirectUri: 'http://localhost:8088/auth/linkedin/callback'
};

console.log('🔧 Test des identifiants LinkedIn');
console.log('📋 Configuration actuelle:', {
  clientId: config.clientId,
  clientSecret: config.clientSecret.substring(0, 10) + '...',
  redirectUri: config.redirectUri
});

// Test avec un faux code pour vérifier les identifiants
async function testCredentials() {
  console.log('\n🧪 Test des identifiants avec un faux code...');
  
  const requestBody = new URLSearchParams({
    grant_type: 'authorization_code',
    code: 'fake_code_for_testing',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
  });

  try {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: requestBody,
    });

    const data = await response.text();
    
    console.log('📥 Réponse LinkedIn:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    console.log('📄 Contenu réponse:', data);
    
    if (response.status === 401) {
      const errorData = JSON.parse(data);
      if (errorData.error === 'invalid_client') {
        console.log('\n❌ PROBLÈME IDENTIFIÉ:');
        console.log('   - Client ID ou Client Secret incorrect');
        console.log('   - Vérifiez vos identifiants sur https://developer.linkedin.com/');
      }
    } else if (response.status === 400) {
      const errorData = JSON.parse(data);
      if (errorData.error === 'invalid_grant') {
        console.log('\n✅ IDENTIFIANTS CORRECTS:');
        console.log('   - Client ID et Client Secret sont valides');
        console.log('   - L\'erreur vient du faux code (normal)');
      }
    }
    
  } catch (error) {
    console.error('💥 Erreur test:', error.message);
  }
}

// Instructions pour corriger
console.log('\n📝 INSTRUCTIONS POUR CORRIGER:');
console.log('1. Allez sur https://developer.linkedin.com/');
console.log('2. Connectez-vous et cliquez sur "My Apps"');
console.log('3. Sélectionnez votre application "CM KORA"');
console.log('4. Dans la section "Auth", vérifiez:');
console.log('   - Client ID: ' + config.clientId);
console.log('   - Client Secret: ' + config.clientSecret);
console.log('5. Dans "OAuth 2.0 settings", vérifiez que cette URL est ajoutée:');
console.log('   - ' + config.redirectUri);

testCredentials(); 