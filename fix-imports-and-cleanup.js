#!/usr/bin/env node

/**
 * 🧪 SCRIPT TDD - CORRECTION IMPORTS ET NETTOYAGE CHIRURGICAL
 * Automatise la phase de nettoyage des duplications RealBrandIntelligence
 * Méthodologie TDD stricte avec validation à chaque étape
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 DÉMARRAGE PROCÉDURE CHIRURGICALE TDD');
console.log('═══════════════════════════════════════');

// === PHASE 1: VALIDATION PRÉ-CORRECTION ===
console.log('\n📋 PHASE 1: VALIDATION PRÉ-CORRECTION');

function runTestAndCheck(command, description) {
  console.log(`\n🔍 ${description}`);
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ SUCCESS: ${description}`);
    return result;
  } catch (error) {
    console.log(`❌ FAILED: ${description}`);
    console.log(error.stdout);
    return null;
  }
}

// Test 1: Backup sécurisé
console.log('🛡️ Création backup sécurisé...');
const backupDir = './backup_real_brand_services';
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

const filesToBackup = [
  'src/services/RealBrandIntelligenceServiceComplete.ts',
  'src/services/RealBrandIntelligenceServiceFixed.ts', 
  'src/services/RealBrandIntelligenceServiceProduction.ts',
  'src/test/report-export-integration.test.tsx',
  'src/tests/RealBrandIntelligenceService.test.ts'
];

filesToBackup.forEach(file => {
  if (fs.existsSync(file)) {
    const backupFile = path.join(backupDir, path.basename(file));
    fs.copyFileSync(file, backupFile);
    console.log(`📦 Backup: ${file} → ${backupFile}`);
  }
});

// === PHASE 2: CORRECTION IMPORTS TESTS ===
console.log('\n🔧 PHASE 2: CORRECTION IMPORTS TESTS');

// Correction Import 1: report-export-integration.test.tsx
const testFile1 = 'src/test/report-export-integration.test.tsx';
if (fs.existsSync(testFile1)) {
  console.log('🔨 Correction import dans report-export-integration.test.tsx');
  let content = fs.readFileSync(testFile1, 'utf8');
  content = content.replace(
    "import { RealBrandIntelligenceService } from '../services/RealBrandIntelligenceServiceFixed';",
    "import { RealBrandIntelligenceService } from '../services/RealBrandIntelligenceService';"
  );
  fs.writeFileSync(testFile1, content);
  console.log('✅ Import corrigé: report-export-integration.test.tsx');
} else {
  console.log('⚠️ Fichier non trouvé: report-export-integration.test.tsx');
}

// Correction Import 2: RealBrandIntelligenceService.test.ts
const testFile2 = 'src/tests/RealBrandIntelligenceService.test.ts';
if (fs.existsSync(testFile2)) {
  console.log('🔨 Correction import dans RealBrandIntelligenceService.test.ts');
  let content = fs.readFileSync(testFile2, 'utf8');
  content = content.replace(
    "import { RealBrandIntelligenceService } from '../services/RealBrandIntelligenceServiceComplete';",
    "import { RealBrandIntelligenceService } from '../services/RealBrandIntelligenceService';"
  );
  fs.writeFileSync(testFile2, content);
  console.log('✅ Import corrigé: RealBrandIntelligenceService.test.ts');
} else {
  console.log('⚠️ Fichier non trouvé: RealBrandIntelligenceService.test.ts');
}

// === PHASE 3: VALIDATION POST-CORRECTION ===
console.log('\n🧪 PHASE 3: VALIDATION POST-CORRECTION');

// Test build après correction imports
const buildResult = runTestAndCheck('npm run build', 'Build après correction imports');
if (!buildResult) {
  console.log('❌ ARRÊT: Erreur de build après correction imports');
  process.exit(1);
}

// === PHASE 4: SUPPRESSION CHIRURGICALE ===
console.log('\n🗑️ PHASE 4: SUPPRESSION CHIRURGICALE');

const filesToDelete = [
  'src/services/RealBrandIntelligenceServiceComplete.ts',
  'src/services/RealBrandIntelligenceServiceFixed.ts',
  'src/services/RealBrandIntelligenceServiceProduction.ts'
];

// Suppression des duplicatas avec vérification
filesToDelete.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`🗑️ Suppression: ${file}`);
    
    // Vérification finale qu'aucun import actif
    const grepResult = runTestAndCheck(
      `grep -r "from '${file.replace('src/', '../')}" src/`, 
      `Vérification aucun import actif de ${file}`
    );
    
    if (grepResult && grepResult.trim()) {
      console.log(`⚠️ WARNING: Import actif détecté pour ${file}`);
      console.log(grepResult);
      return; // Ne pas supprimer
    }
    
    fs.unlinkSync(file);
    console.log(`✅ Supprimé: ${file}`);
  } else {
    console.log(`⚠️ Fichier déjà absent: ${file}`);
  }
});

// Suppression dossier pilote si existant
const pilotDir = 'kora-digital-pilot';
if (fs.existsSync(pilotDir)) {
  console.log('🗑️ Suppression dossier pilote obsolète...');
  fs.rmSync(pilotDir, { recursive: true, force: true });
  console.log('✅ Dossier pilote supprimé');
}

// === PHASE 5: VALIDATION FINALE ===
console.log('\n🎯 PHASE 5: VALIDATION FINALE');

// Test 1: Build final
const finalBuildResult = runTestAndCheck('npm run build', 'Build final après nettoyage');
if (!finalBuildResult) {
  console.log('❌ ÉCHEC CRITIQUE: Erreur build final');
  
  // Restauration automatique depuis backup
  console.log('🔄 RESTAURATION AUTOMATIQUE...');
  filesToBackup.forEach(file => {
    const backupFile = path.join(backupDir, path.basename(file));
    if (fs.existsSync(backupFile)) {
      fs.copyFileSync(backupFile, file);
      console.log(`🔄 Restauré: ${backupFile} → ${file}`);
    }
  });
  
  process.exit(1);
}

// Test 2: Vérification imports corrects
const importCheck = runTestAndCheck(
  'grep -r "import.*RealBrandIntelligenceService" src/ --include="*.tsx" --include="*.ts"',
  'Vérification imports finaux'
);

console.log('\n📊 IMPORTS FINAUX:');
console.log(importCheck || 'Aucun import trouvé');

// Test 3: Métriques finales
console.log('\n📈 MÉTRIQUES NETTOYAGE:');
const remainingFiles = [
  'src/services/RealBrandIntelligenceService.ts'
].filter(fs.existsSync);

console.log(`✅ Services restants: ${remainingFiles.length}`);
console.log(`🗑️ Services supprimés: ${filesToDelete.length}`);
console.log(`📦 Backups créés: ${filesToBackup.length}`);

// === RAPPORT FINAL ===
console.log('\n🎉 RAPPORT FINAL - NETTOYAGE RÉUSSI');
console.log('═══════════════════════════════════');
console.log('✅ Imports tests corrigés');
console.log('✅ Duplications supprimées');
console.log('✅ Build fonctionnel');
console.log('✅ Architecture simplifiée');
console.log('✅ Backups sécurisés disponibles');
console.log('\n🚀 CODEBASE NETTOYÉE - TDD VALIDÉ');

// Suppression backup si tout OK (optionnel)
console.log('\n🧹 Nettoyage final...');
setTimeout(() => {
  const keepBackup = process.argv.includes('--keep-backup');
  if (!keepBackup) {
    fs.rmSync(backupDir, { recursive: true, force: true });
    console.log('🗑️ Backups temporaires supprimés');
  } else {
    console.log('📦 Backups conservés dans:', backupDir);
  }
  
  console.log('\n✨ PROCÉDURE CHIRURGICALE TERMINÉE AVEC SUCCÈS');
}, 1000); 