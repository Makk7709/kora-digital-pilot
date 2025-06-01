/**
 * 🔧 DIAGNOSTIC TDD - CONNECTIVITÉ API PERPLEXITY
 * Script pour identifier et résoudre les problèmes d'API
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Charger l'environnement
dotenv.config();

console.log('🔧 ===================');
console.log('🚀 DIAGNOSTIC TDD API');
console.log('🔧 ===================\n');

async function diagnosticComplet() {
  const issues = [];
  const solutions = [];

  console.log('1️⃣ VÉRIFICATION ENVIRONNEMENT...\n');

  // 1. Vérifier fichier .env
  const envPath = path.join(process.cwd(), '.env');
  const envExists = fs.existsSync(envPath);
  
  console.log(`📁 Fichier .env: ${envExists ? '✅ Trouvé' : '❌ Manquant'}`);
  
  if (!envExists) {
    issues.push('Fichier .env manquant');
    solutions.push('Créer fichier .env avec VITE_PERPLEXITY_API_KEY=votre-clé');
    
    // Créer un exemple de .env
    const envContent = `# Configuration Perplexity API pour TDD
VITE_PERPLEXITY_API_KEY=pplx-your-real-api-key-here
VITE_PERPLEXITY_MODEL=llama-3.1-sonar-large-128k-online
VITE_PERPLEXITY_MAX_TOKENS=8000
VITE_PERPLEXITY_TEMPERATURE=0.2
NODE_ENV=development`;

    try {
      fs.writeFileSync('.env.example', envContent);
      console.log('✅ Fichier .env.example créé');
      solutions.push('Renommer .env.example en .env et configurer votre clé API');
    } catch (err) {
      console.log('❌ Impossible de créer .env.example');
    }
  }

  // 2. Vérifier clé API
  const apiKey = process.env.VITE_PERPLEXITY_API_KEY;
  console.log(`🔑 API Key: ${apiKey ? '✅ Configurée' : '❌ Manquante'}`);
  
  if (!apiKey) {
    issues.push('VITE_PERPLEXITY_API_KEY manquante');
    solutions.push('Ajouter VITE_PERPLEXITY_API_KEY=pplx-xxx dans .env');
  } else if (apiKey === 'pplx-your-real-api-key-here' || apiKey === 'demo-key') {
    issues.push('Clé API factice détectée');
    solutions.push('Remplacer par une vraie clé API Perplexity');
  }

  // 3. Vérifier fetch
  console.log(`🌐 Node fetch: ${typeof fetch === 'function' ? '✅ Disponible' : '❌ Indisponible'}`);
  
  if (typeof fetch !== 'function') {
    issues.push('fetch() non disponible en Node.js');
    solutions.push('Installer node-fetch: npm install node-fetch');
  }

  console.log('\n2️⃣ TEST CONNECTIVITÉ API...\n');

  if (apiKey && apiKey !== 'pplx-your-real-api-key-here' && typeof fetch === 'function') {
    try {
      console.log('📡 Test appel Perplexity API...');
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [{
            role: 'user',
            content: 'Test simple: Quelle est la couleur du ciel ?'
          }],
          max_tokens: 100,
          temperature: 0.1
        })
      });

      console.log(`📊 Status: ${response.status}`);
      console.log(`📋 Headers: ${JSON.stringify(Object.fromEntries(response.headers), null, 2)}`);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API fonctionne !');
        console.log(`📝 Réponse: ${data.choices[0].message.content.substring(0, 100)}...`);
      } else {
        const error = await response.text();
        console.log('❌ Erreur API:', response.status, error);
        issues.push(`Erreur API: ${response.status}`);
        
        if (response.status === 401) {
          solutions.push('Vérifier la validité de votre clé API Perplexity');
        } else if (response.status === 429) {
          solutions.push('Quota API dépassé - vérifier votre plan Perplexity');
        } else {
          solutions.push('Vérifier la configuration API et les paramètres');
        }
      }

    } catch (error) {
      console.log('❌ Erreur réseau:', error.message);
      issues.push(`Erreur réseau: ${error.message}`);
      solutions.push('Vérifier connexion internet et proxy');
    }
  } else {
    console.log('⏭️  Test API ignoré (configuration incomplète)');
  }

  console.log('\n3️⃣ TEST SERVICE TDD...\n');

  // Test avec fallback pour éviter crash
  try {
    const { RealBrandIntelligenceService } = await import('./src/services/RealBrandIntelligenceService.js');
    console.log('✅ Service TDD importé avec succès');
    
    // Test minimal sans API
    const service = new RealBrandIntelligenceService();
    console.log('✅ Service TDD instancié');
    
  } catch (error) {
    console.log('❌ Erreur service TDD:', error.message);
    issues.push(`Service TDD défaillant: ${error.message}`);
    solutions.push('Vérifier imports et dépendances du service');
  }

  console.log('\n4️⃣ RÉSUMÉ DIAGNOSTIC...\n');

  if (issues.length === 0) {
    console.log('🎉 AUCUN PROBLÈME DÉTECTÉ');
    console.log('✅ Configuration TDD complète et fonctionnelle');
  } else {
    console.log(`❌ ${issues.length} PROBLÈME(S) IDENTIFIÉ(S):`);
    issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });

    console.log('\n💡 SOLUTIONS RECOMMANDÉES:');
    solutions.forEach((solution, i) => {
      console.log(`   ${i + 1}. ${solution}`);
    });
  }

  console.log('\n5️⃣ PROCHAINES ÉTAPES...\n');

  if (apiKey && apiKey !== 'pplx-your-real-api-key-here') {
    console.log('🚀 Pour tester le service TDD:');
    console.log('   node test-real-tdd-service.js');
    console.log('   npm test -- src/test/real-brand-intelligence-tdd.test.tsx');
  } else {
    console.log('⚠️  Configuration requise:');
    console.log('   1. Obtenir clé API: https://www.perplexity.ai/settings/api');
    console.log('   2. Ajouter dans .env: VITE_PERPLEXITY_API_KEY=pplx-xxx');
    console.log('   3. Relancer: node debug-tdd-api-connectivity.js');
  }

  console.log('\n🏁 Diagnostic terminé !');
  
  return {
    issues,
    solutions,
    apiWorking: apiKey && issues.length === 0
  };
}

// Exécution
diagnosticComplet().catch(console.error); 