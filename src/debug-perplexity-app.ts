// Debug Perplexity dans le contexte de l'application
console.log('🔍 Debug Perplexity - Contexte Application');
console.log('==========================================');

// 1. Vérifier les variables d'environnement Vite
console.log('\n📋 Variables d\'environnement Vite:');
console.log('MODE:', import.meta.env.MODE);
console.log('DEV:', import.meta.env.DEV);
console.log('PROD:', import.meta.env.PROD);

// 2. Vérifier la clé Perplexity
const perplexityKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
console.log('\n🔑 Clé Perplexity:');
console.log('Valeur:', perplexityKey ? `${perplexityKey.substring(0, 15)}...` : 'NON DÉFINIE');
console.log('Longueur:', perplexityKey ? perplexityKey.length : 0);
console.log('Type:', typeof perplexityKey);

// 3. Test de la logique de validation (même que dans usePerplexity)
function testValidation(apiKey: string | undefined) {
  console.log('\n🧪 Test de validation (logique usePerplexity):');
  
  const isRealApiKey = apiKey && 
    apiKey !== 'demo_key_for_testing' && 
    apiKey !== 'your_perplexity_api_key_here' &&
    apiKey.length > 10;
  
  console.log('apiKey existe:', !!apiKey);
  console.log('apiKey !== "demo_key_for_testing":', apiKey !== 'demo_key_for_testing');
  console.log('apiKey !== "your_perplexity_api_key_here":', apiKey !== 'your_perplexity_api_key_here');
  console.log('apiKey.length > 10:', apiKey ? apiKey.length > 10 : false);
  console.log('isRealApiKey:', isRealApiKey);
  
  return isRealApiKey;
}

const isValid = testValidation(perplexityKey);

// 4. Afficher toutes les variables d'environnement
console.log('\n📊 Toutes les variables d\'environnement:');
Object.keys(import.meta.env).forEach(key => {
  const value = import.meta.env[key];
  if (key.includes('API') || key.includes('PERPLEXITY')) {
    console.log(`${key}:`, value ? `${value.substring(0, 15)}...` : 'NON DÉFINIE');
  } else {
    console.log(`${key}:`, value);
  }
});

// 5. Conclusion
console.log('\n🎯 Conclusion:');
if (isValid) {
  console.log('✅ La clé devrait être détectée comme valide');
  console.log('✅ Le mode API réel devrait être activé');
} else {
  console.log('❌ La clé sera considérée comme invalide');
  console.log('❌ Le mode simulation sera activé');
}

console.log('\n==========================================');

export { perplexityKey, isValid }; 