/**
 * 🚨 SCRIPT DE VALIDATION INTERFACE KORA
 * 
 * Ce script permet de vérifier que l'interface affiche les données corrigées
 * au lieu des données hardcodées.
 * 
 * UTILISATION:
 * 1. Ouvrir l'interface Kora dans le navigateur (http://localhost:8088)
 * 2. Ouvrir les outils de développement (F12)
 * 3. Coller ce script dans la console
 * 4. Exécuter pour vérifier les données affichées
 */

console.log('🚨 VALIDATION INTERFACE KORA - Vérification données corrigées');
console.log('==================================================================');

// Fonction pour chercher du texte dans le DOM
function findTextInDOM(searchText) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const results = [];
  let node;
  
  while (node = walker.nextNode()) {
    if (node.textContent.includes(searchText)) {
      results.push({
        text: node.textContent.trim(),
        element: node.parentElement,
        location: node.parentElement.outerHTML.substring(0, 100) + '...'
      });
    }
  }
  
  return results;
}

// Tests de validation
const validationTests = [
  {
    name: 'ENGAGEMENT RATE CORRECTION',
    shouldNotFind: '4.8%',
    shouldFind: '5.3%',
    description: 'Vérifier que 4.8% est remplacé par 5.3%'
  },
  {
    name: 'LINKEDIN LIKES CORRECTION',
    shouldNotFind: '156 likes',
    shouldFind: '333',
    description: 'Vérifier que les likes LinkedIn sont corrigés'
  },
  {
    name: 'INTERACTION IMPROVEMENTS',
    shouldNotFind: '89 likes',
    shouldFind: ['136', '84'],
    description: 'Vérifier les corrections Instagram et Twitter'
  }
];

console.log('\n📊 RÉSULTATS DES TESTS:');
console.log('========================');

validationTests.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.name}`);
  console.log(`   Description: ${test.description}`);
  
  // Vérifier que les anciennes valeurs ne sont plus présentes
  if (test.shouldNotFind) {
    const oldValues = findTextInDOM(test.shouldNotFind);
    if (oldValues.length === 0) {
      console.log(`   ✅ PASS: Ancienne valeur "${test.shouldNotFind}" non trouvée`);
    } else {
      console.log(`   ❌ FAIL: Ancienne valeur "${test.shouldNotFind}" encore présente!`);
      console.log(`      Trouvée ${oldValues.length} fois:`, oldValues);
    }
  }
  
  // Vérifier que les nouvelles valeurs sont présentes
  if (test.shouldFind) {
    const searchTerms = Array.isArray(test.shouldFind) ? test.shouldFind : [test.shouldFind];
    
    searchTerms.forEach(term => {
      const newValues = findTextInDOM(term);
      if (newValues.length > 0) {
        console.log(`   ✅ PASS: Nouvelle valeur "${term}" trouvée (${newValues.length} fois)`);
      } else {
        console.log(`   ❌ FAIL: Nouvelle valeur "${term}" non trouvée!`);
      }
    });
  }
});

// Test spécifique pour vérifier le taux d'engagement global
const engagementElements = document.querySelectorAll('[data-testid*="engagement"], .text-2xl, .text-3xl');
const engagementValues = Array.from(engagementElements)
  .map(el => el.textContent)
  .filter(text => text.includes('%'));

console.log('\n🎯 ANALYSE DÉTAILLÉE DES TAUX D\'ENGAGEMENT:');
console.log('============================================');
console.log('Valeurs d\'engagement trouvées:', engagementValues);

// Vérification finale
const old4_8Found = findTextInDOM('4.8%').length;
const new5_3Found = findTextInDOM('5.3%').length;

console.log('\n🔍 RÉSUMÉ FINAL:');
console.log('=================');
console.log(`Occurrences de "4.8%": ${old4_8Found} ${old4_8Found === 0 ? '✅' : '❌'}`);
console.log(`Occurrences de "5.3%": ${new5_3Found} ${new5_3Found > 0 ? '✅' : '❌'}`);

if (old4_8Found === 0 && new5_3Found > 0) {
  console.log('\n🎉 SUCCÈS! Les corrections ont été appliquées correctement!');
  console.log('   L\'interface affiche maintenant 5.3% au lieu de 4.8%');
} else {
  console.log('\n⚠️  PROBLÈME DÉTECTÉ!');
  console.log('   Certaines données hardcodées sont encore présentes');
  console.log('   Action requise: Vérifier les composants et forcer le refresh');
}

console.log('\n📝 INSTRUCTIONS SUPPLÉMENTAIRES:');
console.log('- Naviguer vers la section Analytics');
console.log('- Vérifier l\'affichage visuel des métriques');
console.log('- Tester le hot-reload en modifiant du code');
console.log('- Vider le cache navigateur si nécessaire (Ctrl+Shift+R)'); 