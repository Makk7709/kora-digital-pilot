#!/usr/bin/env node

console.log('🔍 Diagnostic Perplexity API - Kora Digital');
console.log('==========================================\n');

// 1. Vérifier les fichiers d'environnement
const fs = require('fs');
const path = require('path');

console.log('📁 1. Vérification des fichiers d\'environnement...');

const envFiles = ['.env', '.env.local', '.env.local.example'];
envFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}: ${exists ? 'Existe' : 'Manquant'}`);
  
  if (exists && file !== '.env.local.example') {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const perplexityLine = content.split('\n').find(line => 
        line.includes('VITE_PERPLEXITY_API_KEY')
      );
      
      if (perplexityLine) {
        const key = perplexityLine.split('=')[1];
        console.log(`      📋 Clé trouvée: ${key ? key.substring(0, 15) + '...' : 'VIDE'}`);
        console.log(`      📏 Longueur: ${key ? key.length : 0} caractères`);
        
        // Vérifier si la clé semble valide
        if (key && key.startsWith('pplx-') && key.length > 20) {
          console.log(`      ✅ Format valide (commence par 'pplx-')`);
        } else if (key && key.length < 20) {
          console.log(`      ⚠️  Clé trop courte (probablement tronquée)`);
        } else {
          console.log(`      ❌ Format invalide`);
        }
      } else {
        console.log(`      ❌ Variable VITE_PERPLEXITY_API_KEY non trouvée`);
      }
    } catch (error) {
      console.log(`      ❌ Erreur lecture: ${error.message}`);
    }
  }
});

console.log('\n🔧 2. Test de chargement des variables d\'environnement...');

// Simuler le chargement Vite
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const perplexityKey = process.env.VITE_PERPLEXITY_API_KEY;
console.log(`   📋 VITE_PERPLEXITY_API_KEY: ${perplexityKey ? perplexityKey.substring(0, 15) + '...' : 'NON DÉFINIE'}`);
console.log(`   📏 Longueur: ${perplexityKey ? perplexityKey.length : 0} caractères`);

// 3. Test de validation de la clé
console.log('\n🧪 3. Test de validation de la clé...');

function isValidPerplexityKey(key) {
  if (!key) return false;
  if (key === 'demo_key_for_testing') return false;
  if (key === 'your_perplexity_api_key_here') return false;
  if (key.length <= 10) return false;
  return true;
}

const isValid = isValidPerplexityKey(perplexityKey);
console.log(`   ${isValid ? '✅' : '❌'} Clé valide: ${isValid}`);

if (!isValid) {
  console.log('\n🔧 4. Suggestions de correction...');
  
  if (!perplexityKey) {
    console.log('   📝 Ajoutez VITE_PERPLEXITY_API_KEY dans .env.local');
  } else if (perplexityKey.length < 20) {
    console.log('   ⚠️  La clé semble tronquée. Vérifiez qu\'elle est complète.');
    console.log('   💡 Une clé Perplexity valide commence par "pplx-" et fait ~50+ caractères');
  } else if (perplexityKey === 'demo_key_for_testing') {
    console.log('   🔄 Remplacez la clé de démo par votre vraie clé API');
  }
  
  console.log('\n📖 Pour obtenir une clé API Perplexity:');
  console.log('   1. Allez sur https://www.perplexity.ai/');
  console.log('   2. Créez un compte développeur');
  console.log('   3. Générez une clé API');
  console.log('   4. Ajoutez-la dans .env.local');
} else {
  console.log('\n✅ Configuration semble correcte !');
  console.log('   🎯 Le mode API réel devrait être activé');
}

console.log('\n🎭 5. Mode de fonctionnement attendu...');
if (isValid) {
  console.log('   🌐 Mode API Réel - Données temps réel via Perplexity');
} else {
  console.log('   🎭 Mode Simulation - Contenu généré par Kora IA');
}

console.log('\n==========================================');
console.log('🏁 Diagnostic terminé !'); 