// Script de debug LinkedIn - Version détaillée
// Exécuter dans la console du navigateur sur http://localhost:8088

console.log('🔧 === DEBUG LINKEDIN CONFIGURATION ===');

// 1. Vérifier la configuration
const config = {
  clientId: '771wyq0br5qhum',
  clientSecret: 'WPL_AP1.OSKEq3inhy5qYt$',
  redirectUri: `${window.location.origin}/auth/linkedin/callback`,
  currentUrl: window.location.href,
  port: window.location.port
};

console.log('📋 Configuration actuelle:', config);

// 2. Tester la génération d'URL d'auth
function testAuthURL() {
  const state = Math.random().toString(36).substring(2, 15);
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: 'openid profile',
    state: state
  });
  
  const authURL = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  console.log('🔗 URL d\'authentification générée:', authURL);
  return authURL;
}

// 3. Simuler un test de token
async function testTokenExchange(testCode = 'test_code_123') {
  console.log('🧪 Test simulation échange token...');
  
  const requestBody = new URLSearchParams({
    grant_type: 'authorization_code',
    code: testCode,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
  });

  console.log('📤 Paramètres qui seraient envoyés:', {
    grant_type: 'authorization_code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    code: testCode,
    client_secret: config.clientSecret.substring(0, 10) + '...'
  });

  // Note: Ne pas faire la vraie requête avec un faux code
  console.log('⚠️ Test simulation seulement - pas de vraie requête');
}

// 4. Vérifier le localStorage
function checkStorage() {
  console.log('💾 État du localStorage:');
  console.log('- Token:', localStorage.getItem('linkedin_access_token') || 'Aucun');
  console.log('- Expiration:', localStorage.getItem('linkedin_token_expires') || 'Aucune');
  console.log('- State:', localStorage.getItem('linkedin_oauth_state') || 'Aucun');
}

// 5. Nettoyer le storage
function clearStorage() {
  localStorage.removeItem('linkedin_access_token');
  localStorage.removeItem('linkedin_token_expires');
  localStorage.removeItem('linkedin_oauth_state');
  console.log('🧹 Storage nettoyé');
}

// Exécuter les tests
console.log('\n🔍 === TESTS AUTOMATIQUES ===');
testAuthURL();
testTokenExchange();
checkStorage();

console.log('\n📝 === FONCTIONS DISPONIBLES ===');
console.log('- testAuthURL() : Générer une URL d\'auth');
console.log('- testTokenExchange() : Simuler échange token');
console.log('- checkStorage() : Vérifier le localStorage');
console.log('- clearStorage() : Nettoyer le localStorage');

console.log('\n✅ Debug terminé - Consultez les logs ci-dessus');

// Rendre les fonctions disponibles globalement
window.linkedinDebug = {
  testAuthURL,
  testTokenExchange,
  checkStorage,
  clearStorage,
  config
}; 