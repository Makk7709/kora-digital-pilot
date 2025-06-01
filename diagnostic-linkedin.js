/**
 * 🔍 DIAGNOSTIC COMPLET LINKEDIN API
 * 
 * Ce script teste directement l'API LinkedIn et affiche les métriques
 * pour diagnostiquer pourquoi elles n'apparaissent pas dans l'interface.
 * 
 * UTILISATION:
 * 1. Ouvrir http://localhost:8088
 * 2. Ouvrir la console navigateur (F12)
 * 3. Coller ce script complet et appuyer sur Entrée
 */

console.clear();
console.log('🔍 DIAGNOSTIC COMPLET LINKEDIN API');
console.log('================================');
console.log('Temps de démarrage:', new Date().toLocaleTimeString('fr-FR'));

// Étape 1: Vérifier la disponibilité de l'API
console.log('\n📊 ÉTAPE 1: Vérification API LinkedIn');
console.log('=====================================');

if (typeof window.linkedinAPI === 'undefined') {
  console.error('❌ window.linkedinAPI non trouvé');
  console.log('💡 Solution: Rechargez la page et réessayez');
} else {
  console.log('✅ window.linkedinAPI trouvé');
  console.log('API disponible:', typeof window.linkedinAPI);
}

// Étape 2: Test authentification
console.log('\n🔐 ÉTAPE 2: Test Authentification');
console.log('=================================');

const isAuth = window.linkedinAPI?.isAuthenticated();
const hasToken = !!localStorage.getItem('linkedin_access_token');
const tokenExpiry = localStorage.getItem('linkedin_token_expires');

console.log('État authentification:', {
  isAuthenticated: isAuth,
  hasToken: hasToken,
  tokenExpiry: tokenExpiry ? new Date(parseInt(tokenExpiry)).toLocaleString('fr-FR') : 'Aucun'
});

// Étape 3: Test récupération métriques DIRECTE
console.log('\n📈 ÉTAPE 3: Test Récupération Métriques DIRECTE');
console.log('===============================================');

async function testDirectMetrics() {
  if (!window.linkedinAPI) {
    console.error('❌ API non disponible');
    return;
  }

  try {
    console.log('🔄 Appel direct de getMetrics("7d")...');
    const startTime = performance.now();
    
    const metrics = await window.linkedinAPI.getMetrics('7d');
    
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    console.log(`✅ Métriques récupérées en ${duration}ms`);
    console.log('📊 DONNÉES COMPLÈTES:');
    console.log({
      totalReach: metrics.totalReach,
      totalEngagement: metrics.totalEngagement,
      totalClicks: metrics.totalClicks,
      growth: metrics.growth,
      postsCount: metrics.posts?.length || 0,
      insightsCount: metrics.insights?.length || 0
    });
    
    console.log('\n📝 POSTS DÉTAILLÉS:');
    if (metrics.posts && metrics.posts.length > 0) {
      metrics.posts.forEach((post, index) => {
        console.log(`Post ${index + 1}:`, {
          content: post.content.substring(0, 60) + '...',
          likes: post.metrics.likes,
          comments: post.metrics.comments,
          shares: post.metrics.shares,
          clicks: post.metrics.clicks,
          impressions: post.metrics.impressions
        });
      });
    } else {
      console.log('Aucun post trouvé');
    }
    
    console.log('\n💡 INSIGHTS:');
    if (metrics.insights && metrics.insights.length > 0) {
      metrics.insights.forEach((insight, index) => {
        console.log(`${index + 1}. ${insight.title}: ${insight.impact}`);
      });
    } else {
      console.log('Aucun insight trouvé');
    }
    
    return metrics;
    
  } catch (error) {
    console.error('❌ Erreur lors du test direct:', error);
    console.log('Stack trace:', error.stack);
    return null;
  }
}

// Étape 4: Test hook useLinkedInAnalytics
console.log('\n🎣 ÉTAPE 4: Test Hook Analytics (si disponible)');
console.log('==============================================');

function testHookData() {
  // Chercher les données du hook dans les composants React
  const reactRoot = document.querySelector('#root');
  if (reactRoot && reactRoot._reactInternalInstance) {
    console.log('✅ Instance React trouvée');
  } else {
    console.log('⚠️ Instance React non accessible directement');
  }
  
  // Vérifier localStorage pour les données du hook
  const lastSync = localStorage.getItem('linkedin_last_sync');
  console.log('Dernière sync:', lastSync ? new Date(lastSync).toLocaleString('fr-FR') : 'Jamais');
}

testHookData();

// Étape 5: Vérification dans le DOM
console.log('\n🔍 ÉTAPE 5: Recherche dans le DOM');
console.log('================================');

function searchInDOM() {
  const searchTerms = [
    '4.8%',    // Ancienne valeur
    '5.3%',    // Nouvelle valeur  
    '6.8%',    // Valeur API simulée
    '333',     // Nouveaux likes LinkedIn
    '156',     // Anciens likes LinkedIn
    '45.2K',   // Reach simulé
    '+15%'     // Growth simulé
  ];
  
  searchTerms.forEach(term => {
    const found = document.body.textContent.includes(term);
    const color = found ? '✅' : '❌';
    console.log(`${color} "${term}" trouvé dans le DOM: ${found}`);
  });
}

searchInDOM();

// Lancer le test principal
console.log('\n🚀 LANCEMENT DU TEST PRINCIPAL');
console.log('==============================');

testDirectMetrics().then(metrics => {
  console.log('\n🎯 RÉSULTATS FINAUX');
  console.log('===================');
  
  if (metrics) {
    console.log('✅ SUCCÈS: Métriques récupérées');
    console.log('📊 Engagement LinkedIn:', metrics.totalEngagement);
    console.log('📈 Premier post likes:', metrics.posts?.[0]?.metrics.likes);
    console.log('📱 Total posts:', metrics.posts?.length);
    
    // Comparaison avec les valeurs attendues
    const expectedEngagement = '6.8%';
    const expectedLikes = 333;
    
    console.log('\n⚖️ COMPARAISON ATTENDUE:');
    console.log(`Engagement: ${metrics.totalEngagement} (attendu: ${expectedEngagement})`);
    console.log(`Premier post likes: ${metrics.posts?.[0]?.metrics.likes} (attendu: ${expectedLikes})`);
    
    if (metrics.totalEngagement === expectedEngagement) {
      console.log('✅ Engagement correct!');
    } else {
      console.log('⚠️ Engagement différent de l\'attendu');
    }
    
    if (metrics.posts?.[0]?.metrics.likes === expectedLikes) {
      console.log('✅ Likes corrects!');
    } else {
      console.log('⚠️ Likes différents de l\'attendu');
    }
    
    // Guide de résolution
    console.log('\n🔧 PROCHAINES ÉTAPES:');
    console.log('=====================');
    console.log('1. Si les métriques s\'affichent ici mais pas dans l\'interface:');
    console.log('   → Problème de synchronisation entre API et composants React');
    console.log('2. Si l\'engagement est 6.8% (API) mais interface montre autre chose:');
    console.log('   → Vérifier quel composant utilise quelles données');
    console.log('3. Pour tester l\'interface Test LinkedIn:');
    console.log('   → Naviguer vers "🧪 Test LinkedIn" dans la sidebar');
    
  } else {
    console.log('❌ ÉCHEC: Impossible de récupérer les métriques');
    console.log('🔧 Solutions à essayer:');
    console.log('1. Recharger la page (Ctrl+Shift+R)');
    console.log('2. Vérifier les erreurs dans l\'onglet Network');
    console.log('3. Essayer de naviguer vers Analytics puis Test LinkedIn');
  }
  
  console.log('\n⏰ Test terminé à:', new Date().toLocaleTimeString('fr-FR'));
});

// Fonctions utilitaires exposées
window.testLinkedInNow = () => testDirectMetrics();
window.searchDOMNow = () => searchInDOM();

console.log('\n🛠️ FONCTIONS UTILITAIRES DISPONIBLES:');
console.log('=====================================');
console.log('• testLinkedInNow() - Relancer le test des métriques');
console.log('• searchDOMNow() - Rechercher les valeurs dans le DOM');
console.log('• window.linkedinAPI.getMetrics("7d") - Test API direct'); 