#!/usr/bin/env node

/**
 * 🔍 DEBUG VARIABLES ENVIRONNEMENT
 */

console.log('🔍 DEBUG VARIABLES ENVIRONNEMENT\n');

// Variables LinkedIn
console.log('📋 Variables LinkedIn:');
console.log('VITE_LINKEDIN_CLIENT_ID:', process.env.VITE_LINKEDIN_CLIENT_ID || 'NON DÉFINIE');
console.log('VITE_LINKEDIN_CLIENT_SECRET:', process.env.VITE_LINKEDIN_CLIENT_SECRET ? 
  process.env.VITE_LINKEDIN_CLIENT_SECRET.substring(0, 10) + '...' : 'NON DÉFINIE');
console.log('VITE_LINKEDIN_REDIRECT_URI:', process.env.VITE_LINKEDIN_REDIRECT_URI || 'NON DÉFINIE');

// Test de chargement du fichier .env.local
console.log('\n📋 Test chargement .env.local:');
import fs from 'fs';

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  console.log('✅ Fichier .env.local trouvé');
  console.log('📄 Contenu:');
  lines.forEach(line => {
    if (line.includes('LINKEDIN')) {
      const [key, value] = line.split('=');
      if (key && value) {
        console.log(`  ${key}: ${key.includes('SECRET') ? value.substring(0, 10) + '...' : value}`);
      }
    }
  });
} catch (error) {
  console.log('❌ Erreur lecture .env.local:', error.message);
}

// Test URL actuelle
console.log('\n📋 Configuration URL:');
console.log('Port attendu: 8088');
console.log('URL callback attendue: http://localhost:8088/auth/linkedin/callback');

console.log('\n🎯 RECOMMANDATIONS:');
console.log('1. Vérifiez que l\'application tourne sur le port 8088');
console.log('2. Vérifiez que les variables VITE_ sont bien définies');
console.log('3. Redémarrez l\'application après modification du .env.local');
console.log('4. Ouvrez http://localhost:8088/linkedin-test-simple pour tester'); 