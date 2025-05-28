#!/usr/bin/env node

console.log('🧪 Test API Perplexity - Kora Digital');
console.log('=====================================\n');

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const perplexityKey = process.env.VITE_PERPLEXITY_API_KEY;

if (!perplexityKey) {
  console.log('❌ Clé API Perplexity non trouvée');
  process.exit(1);
}

console.log(`🔑 Clé API: ${perplexityKey.substring(0, 15)}...`);
console.log(`📏 Longueur: ${perplexityKey.length} caractères\n`);

// Test de l'API Perplexity
async function testPerplexityAPI() {
  console.log('🌐 Test de connexion à l\'API Perplexity...');
  
  const url = 'https://api.perplexity.ai/chat/completions';
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${perplexityKey}`,
  };

  const body = {
    model: 'llama-3.1-sonar-small-128k-online',
    messages: [
      {
        role: 'system',
        content: 'Tu es un assistant IA spécialisé en marketing digital.'
      },
      {
        role: 'user',
        content: 'Donne-moi une tendance marketing digital actuelle en 2 phrases maximum.'
      }
    ],
    max_tokens: 200,
    temperature: 0.3,
  };

  try {
    console.log('📡 Envoi de la requête...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    console.log(`📊 Statut HTTP: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Erreur API:');
      console.log('   Status:', response.status);
      console.log('   Message:', errorData.error?.message || 'Erreur inconnue');
      console.log('   Type:', errorData.error?.type || 'N/A');
      
      if (response.status === 401) {
        console.log('\n💡 Suggestions:');
        console.log('   - Vérifiez que votre clé API est valide');
        console.log('   - Vérifiez que votre compte Perplexity est actif');
        console.log('   - Vérifiez les permissions de la clé API');
      } else if (response.status === 429) {
        console.log('\n💡 Limite de taux atteinte. Attendez avant de réessayer.');
      }
      
      return false;
    }

    const data = await response.json();
    console.log('✅ Réponse reçue avec succès !');
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('\n📝 Contenu généré:');
      console.log('   ' + data.choices[0].message.content);
      
      console.log('\n📊 Utilisation:');
      if (data.usage) {
        console.log(`   Tokens prompt: ${data.usage.prompt_tokens || 'N/A'}`);
        console.log(`   Tokens completion: ${data.usage.completion_tokens || 'N/A'}`);
        console.log(`   Total tokens: ${data.usage.total_tokens || 'N/A'}`);
      }
      
      console.log('\n🎯 Modèle utilisé:', data.model || 'N/A');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erreur de connexion:');
    console.log('   ', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Problème de réseau. Vérifiez votre connexion internet.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connexion refusée. L\'API Perplexity pourrait être indisponible.');
    }
    
    return false;
  }
}

// Test de validation de la clé
function validateKey(key) {
  console.log('🔍 Validation de la clé API...');
  
  const checks = [
    { name: 'Non vide', test: () => key && key.length > 0 },
    { name: 'Format pplx-', test: () => key.startsWith('pplx-') },
    { name: 'Longueur suffisante', test: () => key.length > 20 },
    { name: 'Pas de clé de démo', test: () => key !== 'demo_key_for_testing' },
    { name: 'Pas de placeholder', test: () => key !== 'your_perplexity_api_key_here' },
  ];
  
  let allValid = true;
  checks.forEach(check => {
    const isValid = check.test();
    console.log(`   ${isValid ? '✅' : '❌'} ${check.name}`);
    if (!isValid) allValid = false;
  });
  
  return allValid;
}

// Exécution du test
async function runTest() {
  const isValidKey = validateKey(perplexityKey);
  
  if (!isValidKey) {
    console.log('\n❌ Clé API invalide. Corrigez les problèmes ci-dessus.');
    return;
  }
  
  console.log('\n✅ Clé API valide. Test de connexion...\n');
  
  const apiWorks = await testPerplexityAPI();
  
  console.log('\n=====================================');
  if (apiWorks) {
    console.log('🎉 API Perplexity fonctionne correctement !');
    console.log('   Le mode API réel devrait être activé dans l\'application.');
  } else {
    console.log('❌ Problème avec l\'API Perplexity.');
    console.log('   L\'application utilisera le mode simulation.');
  }
  console.log('=====================================');
}

runTest().catch(console.error); 