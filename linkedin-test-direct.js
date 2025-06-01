/**
 * 🧪 SCRIPT TEST DIRECT API LINKEDIN
 * 
 * Ce script teste directement l'API LinkedIn pour récupérer et afficher
 * les vraies données vs les données hardcodées.
 * 
 * UTILISATION:
 * 1. Ouvrir l'interface Kora (http://localhost:8088)
 * 2. Naviguer vers "Test LinkedIn" dans la sidebar
 * 3. OU coller ce script dans la console navigateur (F12)
 */

console.log('🧪 SCRIPT TEST DIRECT API LINKEDIN');
console.log('=====================================');

// Vérifier si linkedinAPI est disponible
if (typeof window !== 'undefined' && window.linkedinAPI) {
  console.log('✅ linkedinAPI trouvé dans window');
  testLinkedInAPI();
} else {
  console.log('⚠️  linkedinAPI non trouvé, test avec import dynamique...');
  testWithFallback();
}

async function testLinkedInAPI() {
  const api = window.linkedinAPI;
  
  console.log('\n📊 ÉTAPE 1: Vérification Authentification');
  console.log('==========================================');
  
  const isAuth = api.isAuthenticated();
  const token = localStorage.getItem('linkedin_access_token');
  const tokenExpiry = localStorage.getItem('linkedin_token_expires');
  
  console.log('État authentification:', {
    isAuthenticated: isAuth,
    hasToken: !!token,
    tokenExpiry: tokenExpiry ? new Date(parseInt(tokenExpiry)).toLocaleString('fr-FR') : 'N/A',
    isExpired: tokenExpiry ? Date.now() > parseInt(tokenExpiry) : true
  });
  
  if (!isAuth) {
    console.log('\n❌ NON AUTHENTIFIÉ - Générons l\'URL d\'auth...');
    try {
      const authURL = api.getAuthURL();
      console.log('🔗 URL d\'authentification générée:', authURL);
      console.log('💡 Ouvrez cette URL pour vous connecter:', authURL);
    } catch (error) {
      console.error('❌ Erreur génération URL auth:', error);
    }
    return;
  }
  
  console.log('\n📊 ÉTAPE 2: Test Récupération Métriques');
  console.log('=======================================');
  
  try {
    console.log('🔄 Appel api.getMetrics("7d")...');
    const metrics = await api.getMetrics('7d');
    
    console.log('✅ Métriques récupérées:');
    console.log('📈 Données principales:', {
      totalReach: metrics.totalReach,
      totalEngagement: metrics.totalEngagement,
      totalClicks: metrics.totalClicks,
      growth: metrics.growth
    });
    
    console.log('📝 Posts récupérés:', metrics.posts?.length || 0);
    if (metrics.posts && metrics.posts.length > 0) {
      console.log('🔍 Premier post détaillé:');
      const firstPost = metrics.posts[0];
      console.log({
        content: firstPost.content.substring(0, 100) + '...',
        likes: firstPost.metrics.likes,
        comments: firstPost.metrics.comments,
        shares: firstPost.metrics.shares,
        clicks: firstPost.metrics.clicks,
        impressions: firstPost.metrics.impressions,
        publishedAt: firstPost.publishedAt
      });
    }
    
    console.log('💡 Insights générés:', metrics.insights?.length || 0);
    if (metrics.insights && metrics.insights.length > 0) {
      metrics.insights.forEach((insight, index) => {
        console.log(`   ${index + 1}. ${insight.title}: ${insight.impact}`);
      });
    }
    
    console.log('\n⚖️  ÉTAPE 3: Comparaison Données Hardcodées vs Réelles');
    console.log('=====================================================');
    
    const hardcodedData = {
      engagement: '4.8%',
      linkedinLikes: 156,
      instagramLikes: 89,
      twitterLikes: 67
    };
    
    const realData = {
      engagement: metrics.totalEngagement,
      linkedinLikes: metrics.posts?.[0]?.metrics.likes || 'N/A',
      reach: metrics.totalReach,
      growth: metrics.growth
    };
    
    console.log('❌ HARDCODÉ (ancien):', hardcodedData);
    console.log('✅ RÉEL (LinkedIn API):', realData);
    
    const isDifferent = (
      realData.engagement !== hardcodedData.engagement ||
      realData.linkedinLikes !== hardcodedData.linkedinLikes
    );
    
    if (isDifferent) {
      console.log('🎉 SUCCÈS: Les données LinkedIn sont différentes des données hardcodées!');
      console.log('📊 L\'API fonctionne et récupère de vraies données.');
    } else {
      console.log('⚠️  ATTENTION: Les données semblent identiques aux valeurs hardcodées.');
      console.log('🔍 Possible utilisation de données simulées/fallback.');
    }
    
    console.log('\n🧪 ÉTAPE 4: Test Profil Utilisateur');
    console.log('===================================');
    
    try {
      const profile = await api.getUserProfile();
      console.log('✅ Profil utilisateur récupéré:');
      console.log({
        id: profile.id,
        firstName: profile.firstName?.localized?.['en_US'] || 'N/A',
        lastName: profile.lastName?.localized?.['en_US'] || 'N/A',
        hasProfilePicture: !!profile.profilePicture
      });
    } catch (profileError) {
      console.error('❌ Erreur récupération profil:', profileError);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des métriques:', error);
    console.log('🔄 Tentative avec les données de fallback...');
  }
}

function testWithFallback() {
  console.log('\n🔄 TEST AVEC DONNÉES DE DÉMONSTRATION');
  console.log('=====================================');
  
  // Simuler les données que l'API retournerait
  const simulatedMetrics = {
    totalReach: '45.2K',
    totalEngagement: '6.8%',
    totalClicks: '892',
    growth: '+15%',
    posts: [
      {
        content: '🚀 L\'IA transforme notre approche du marketing digital...',
        metrics: {
          likes: 333,
          comments: 42,
          shares: 67,
          clicks: 125,
          impressions: 2450
        }
      }
    ]
  };
  
  console.log('📊 Données simulées récupérées:');
  console.log(simulatedMetrics);
  
  // Vérifier dans le DOM les valeurs affichées
  console.log('\n🔍 RECHERCHE DANS LE DOM:');
  console.log('==========================');
  
  const searchTerms = ['4.8%', '5.3%', '333', '156'];
  searchTerms.forEach(term => {
    const found = document.body.textContent.includes(term);
    console.log(`${found ? '✅' : '❌'} "${term}" trouvé dans le DOM: ${found}`);
  });
  
  // Recommandations
  console.log('\n💡 RECOMMANDATIONS:');
  console.log('===================');
  console.log('1. Connectez-vous à LinkedIn via l\'interface pour tester avec de vraies données');
  console.log('2. Naviguez vers "Test LinkedIn" dans la sidebar pour un diagnostic complet');
  console.log('3. Vérifiez que les données affichées ne sont plus hardcodées (4.8% -> 5.3%)');
  console.log('4. Utilisez le composant LinkedInDataTest pour des tests automatisés');
}

// Fonction utilitaire pour forcer un refresh et test
window.forceLinkedInTest = async function() {
  console.log('🔄 FORCE LINKEDIN TEST - Refresh et test...');
  
  // Nettoyer le cache localStorage si nécessaire
  const shouldClearCache = confirm('Voulez-vous vider le cache LinkedIn pour un test propre?');
  if (shouldClearCache) {
    localStorage.removeItem('linkedin_access_token');
    localStorage.removeItem('linkedin_token_expires');
    console.log('🧹 Cache LinkedIn vidé');
  }
  
  // Relancer le test
  await testLinkedInAPI();
};

console.log('\n🔧 FONCTIONS DISPONIBLES:');
console.log('=========================');
console.log('• forceLinkedInTest() - Force un nouveau test complet');
console.log('• Naviguez vers "Test LinkedIn" pour l\'interface complète');

// Auto-lancement du test
setTimeout(() => {
  if (typeof window !== 'undefined' && window.linkedinAPI) {
    testLinkedInAPI();
  } else {
    testWithFallback();
  }
}, 1000); 