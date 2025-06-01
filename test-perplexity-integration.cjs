/**
 * 🧪 TEST RAPIDE - Intégration Perplexity Sans Mocks
 * Vérification que l'API Perplexity répond correctement
 */

const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Charger les variables d'environnement
dotenv.config();

async function testPerplexityIntegration() {
  console.log('🧪 Test d\'intégration Perplexity - Intelligence TDD');
  console.log('=' .repeat(60));

  // 1. Vérifier les variables d'environnement
  const apiKey = process.env.VITE_PERPLEXITY_API_KEY;
  const model = process.env.VITE_PERPLEXITY_MODEL || 'llama-3.1-sonar-small-128k-online';
  
  if (!apiKey || apiKey === 'your_perplexity_api_key_here') {
    console.log('❌ ERREUR: Clé API Perplexity non configurée');
    console.log('💡 Assurez-vous que VITE_PERPLEXITY_API_KEY est définie dans .env');
    return false;
  }

  console.log('✅ Variables d\'environnement OK');
  console.log(`🔑 Modèle: ${model}`);
  console.log(`🗝️  Clé API: ${apiKey.substring(0, 10)}...`);

  // 2. Test d'appel direct à l'API Perplexity
  try {
    console.log('\n🚀 Test d\'appel API Perplexity...');
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: "Analyse rapide de la marque Nike en 50 mots maximum"
          }
        ],
        max_tokens: 200,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Erreur API: ${response.status} - ${errorText}`);
      return false;
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('✅ Réponse Perplexity reçue avec succès!');
      console.log('📄 Contenu:', data.choices[0].message.content.substring(0, 100) + '...');
      console.log('💰 Tokens utilisés:', data.usage?.total_tokens || 'N/A');
      return true;
    } else {
      console.log('❌ Format de réponse inattendu:', JSON.stringify(data, null, 2));
      return false;
    }

  } catch (error) {
    console.log('❌ Erreur lors du test:', error.message);
    return false;
  }
}

// 3. Test du backend local
async function testBackendIntegration() {
  console.log('\n🌐 Test du backend local...');
  
  try {
    const response = await fetch('http://localhost:8080/api/health');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend local accessible');
      console.log('📡 Service:', data.service || 'Inconnu');
      return true;
    } else {
      console.log('❌ Backend non accessible');
      return false;
    }
  } catch (error) {
    console.log('❌ Impossible de joindre le backend:', error.message);
    return false;
  }
}

// Exécution des tests
async function runAllTests() {
  console.log('🎯 AUDIT INTÉGRATION PERPLEXITY - INTELLIGENCE TDD\n');
  
  const backendOK = await testBackendIntegration();
  const perplexityOK = await testPerplexityIntegration();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSULTATS DU TEST:');
  console.log(`🌐 Backend Local: ${backendOK ? '✅ OK' : '❌ ÉCHEC'}`);
  console.log(`🧠 API Perplexity: ${perplexityOK ? '✅ OK' : '❌ ÉCHEC'}`);
  
  if (backendOK && perplexityOK) {
    console.log('\n🎉 SUCCÈS! L\'Intelligence TDD devrait fonctionner avec de vraies données Perplexity!');
    console.log('🚀 Allez sur http://localhost:8088 → Intelligence TDD et testez avec "Nike" ou "Tesla"');
  } else {
    console.log('\n⚠️  Problème détecté. Vérifiez la configuration.');
  }
}

// Point d'entrée
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testPerplexityIntegration, testBackendIntegration }; 