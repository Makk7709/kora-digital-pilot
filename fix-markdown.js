#!/usr/bin/env node

/**
 * 🔧 SCRIPT DE CORRECTION MARKDOWN AUTOMATIQUE
 * Corrige automatiquement les problèmes de formatage markdown les plus courants
 * Usage: node fix-markdown.js [fichier.md] ou node fix-markdown.js --all
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

// Configuration des couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  fix: (msg) => console.log(`${colors.magenta}🔧 ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.cyan}${colors.bright}🚀 ${msg}${colors.reset}`)
};

class MarkdownFixer {
  constructor() {
    this.fixes = [];
    this.patterns = [
      // Correction des caractères spéciaux problématiques
      {
        name: 'Caractères Unicode problématiques',
        pattern: /[\u201C\u201D]/g,
        replacement: '"',
        description: 'Remplace les guillemets courbes par des guillemets droits'
      },
      {
        name: 'Apostrophes typographiques',
        pattern: /[\u2018\u2019]/g,
        replacement: "'",
        description: 'Remplace les apostrophes courbes par des apostrophes droites'
      },
      {
        name: 'Tirets longs',
        pattern: /[\u2013\u2014]/g,
        replacement: '--',
        description: 'Remplace les tirets longs par des tirets doubles'
      },
      
      // Correction de l'espacement
      {
        name: 'Espaces multiples',
        pattern: /[ ]{2,}/g,
        replacement: ' ',
        description: 'Remplace les espaces multiples par un seul espace'
      },
      {
        name: 'Espaces en fin de ligne',
        pattern: /[ \t]+$/gm,
        replacement: '',
        description: 'Supprime les espaces en fin de ligne'
      },
      {
        name: 'Lignes vides multiples',
        pattern: /\n{3,}/g,
        replacement: '\n\n',
        description: 'Remplace les lignes vides multiples par une seule'
      },
      
      // Correction des en-têtes
      {
        name: 'Espaces après hashtags',
        pattern: /^(#{1,6})([^\s#])/gm,
        replacement: '$1 $2',
        description: 'Ajoute un espace après les hashtags des en-têtes'
      },
      
      // Correction des listes
      {
        name: 'Espaces dans les listes à puces',
        pattern: /^(\s*)([-\*\+])([^\s])/gm,
        replacement: '$1$2 $3',
        description: 'Ajoute un espace après les puces de liste'
      },
      {
        name: 'Espaces dans les listes numérotées',
        pattern: /^(\s*)(\d+\.)([^\s])/gm,
        replacement: '$1$2 $3',
        description: 'Ajoute un espace après les numéros de liste'
      },
      
      // Correction des liens et images
      {
        name: 'Espaces dans les liens',
        pattern: /\[([^\]]+)\]\s*\(([^)]+)\)/g,
        replacement: '[$1]($2)',
        description: 'Supprime les espaces entre crochets et parenthèses des liens'
      },
      
      // Correction des blocs de code
      {
        name: 'Espaces autour des backticks inline',
        pattern: /\s`([^`]+)`\s/g,
        replacement: ' `$1` ',
        description: 'Normalise les espaces autour du code inline'
      },
      
      // Correction des tableaux
      {
        name: 'Espaces dans les tableaux',
        pattern: /\|\s*([^|]+?)\s*\|/g,
        replacement: '| $1 |',
        description: 'Normalise les espaces dans les cellules de tableau'
      },
      
      // Correction des échappements
      {
        name: 'Échappements inutiles',
        pattern: /\\([^\\`*_{}[\]()#+\-.!|])/g,
        replacement: '$1',
        description: 'Supprime les échappements inutiles'
      }
    ];
  }

  analyzeFile(filePath) {
    log.info(`Analyse de ${filePath}...`);
    
    if (!fs.existsSync(filePath)) {
      log.error(`Fichier non trouvé: ${filePath}`);
      return null;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const stats = {
        lines: content.split('\n').length,
        chars: content.length,
        words: content.split(/\s+/).filter(w => w.length > 0).length,
        issues: []
      };

      // Détecter les problèmes
      this.patterns.forEach(pattern => {
        const matches = content.match(pattern.pattern);
        if (matches) {
          stats.issues.push({
            name: pattern.name,
            count: matches.length,
            description: pattern.description
          });
        }
      });

      return { content, stats };
    } catch (error) {
      log.error(`Erreur lecture fichier: ${error.message}`);
      return null;
    }
  }

  fixContent(content) {
    let fixedContent = content;
    const appliedFixes = [];

    this.patterns.forEach(pattern => {
      const before = fixedContent;
      fixedContent = fixedContent.replace(pattern.pattern, pattern.replacement);
      
      if (before !== fixedContent) {
        const matches = before.match(pattern.pattern);
        appliedFixes.push({
          name: pattern.name,
          count: matches ? matches.length : 0,
          description: pattern.description
        });
      }
    });

    return { fixedContent, appliedFixes };
  }

  fixFile(filePath, dryRun = false) {
    const analysis = this.analyzeFile(filePath);
    if (!analysis) return false;

    const { content, stats } = analysis;

    log.info(`📊 Statistiques du fichier:`);
    console.log(`   Lignes: ${stats.lines}`);
    console.log(`   Caractères: ${stats.chars}`);
    console.log(`   Mots: ${stats.words}`);
    console.log(`   Problèmes détectés: ${stats.issues.length}`);

    if (stats.issues.length === 0) {
      log.success('Aucun problème détecté!');
      return true;
    }

    // Afficher les problèmes détectés
    log.warning('Problèmes détectés:');
    stats.issues.forEach(issue => {
      console.log(`   • ${issue.name}: ${issue.count} occurrence(s)`);
      console.log(`     ${issue.description}`);
    });

    // Appliquer les corrections
    const { fixedContent, appliedFixes } = this.fixContent(content);

    if (appliedFixes.length === 0) {
      log.info('Aucune correction automatique possible.');
      return true;
    }

    log.fix('Corrections appliquées:');
    appliedFixes.forEach(fix => {
      console.log(`   • ${fix.name}: ${fix.count} correction(s)`);
    });

    if (dryRun) {
      log.info('Mode test - aucune modification sauvegardée');
      return true;
    }

    // Créer une sauvegarde
    const backupPath = `${filePath}.backup`;
    try {
      fs.writeFileSync(backupPath, content);
      log.info(`Sauvegarde créée: ${backupPath}`);
    } catch (error) {
      log.warning(`Impossible de créer la sauvegarde: ${error.message}`);
    }

    // Sauvegarder le fichier corrigé
    try {
      fs.writeFileSync(filePath, fixedContent);
      log.success(`Fichier corrigé: ${filePath}`);
      return true;
    } catch (error) {
      log.error(`Erreur sauvegarde: ${error.message}`);
      return false;
    }
  }

  findMarkdownFiles(directory = '.') {
    const files = [];
    
    function scanDirectory(dir) {
      try {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            scanDirectory(fullPath);
          } else if (stat.isFile() && item.endsWith('.md')) {
            files.push(fullPath);
          }
        });
      } catch (error) {
        // Ignorer les erreurs de lecture de dossier
      }
    }

    scanDirectory(directory);
    return files;
  }

  generateReport(results) {
    log.header('RAPPORT DE CORRECTION MARKDOWN');
    console.log('='.repeat(50));
    
    let totalFiles = results.length;
    let successCount = results.filter(r => r.success).length;
    let totalIssues = results.reduce((sum, r) => sum + (r.issuesFound || 0), 0);
    let totalFixes = results.reduce((sum, r) => sum + (r.fixesApplied || 0), 0);

    console.log(`📁 Fichiers traités: ${totalFiles}`);
    console.log(`✅ Succès: ${successCount}`);
    console.log(`❌ Échecs: ${totalFiles - successCount}`);
    console.log(`🔍 Problèmes détectés: ${totalIssues}`);
    console.log(`🔧 Corrections appliquées: ${totalFixes}`);
    console.log('='.repeat(50));

    if (totalFixes > 0) {
      log.success('🎉 Correction terminée avec succès!');
      log.info('💡 Conseil: Vérifiez les fichiers modifiés avant de commiter');
    } else {
      log.info('ℹ️  Aucune correction nécessaire');
    }
  }
}

// CLI Interface
function showHelp() {
  console.log(`
🔧 CORRECTEUR MARKDOWN AUTOMATIQUE

Usage:
  node fix-markdown.js [options] [fichier]

Options:
  --all, -a          Corriger tous les fichiers .md du projet
  --dry-run, -d      Mode test (ne modifie pas les fichiers)
  --help, -h         Afficher cette aide

Exemples:
  node fix-markdown.js README.md           # Corriger un fichier spécifique
  node fix-markdown.js --all               # Corriger tous les fichiers .md
  node fix-markdown.js --all --dry-run     # Tester sans modifier

Le script crée automatiquement des sauvegardes (.backup) avant modification.
`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  const dryRun = args.includes('--dry-run') || args.includes('-d');
  const fixAll = args.includes('--all') || args.includes('-a');
  
  log.header('DÉMARRAGE CORRECTEUR MARKDOWN');
  
  if (dryRun) {
    log.warning('Mode test activé - aucune modification ne sera sauvegardée');
  }

  const fixer = new MarkdownFixer();
  const results = [];

  if (fixAll) {
    log.info('Recherche de fichiers markdown...');
    const files = fixer.findMarkdownFiles();
    
    if (files.length === 0) {
      log.error('Aucun fichier .md trouvé');
      return;
    }

    log.info(`${files.length} fichiers trouvés`);
    
    for (const file of files) {
      console.log(`\n${'─'.repeat(60)}`);
      const success = fixer.fixFile(file, dryRun);
      results.push({ file, success });
    }
  } else {
    // Fichier spécifique
    const fileName = args.find(arg => !arg.startsWith('--') && !arg.startsWith('-'));
    
    if (!fileName) {
      log.error('Veuillez spécifier un fichier ou utiliser --all');
      showHelp();
      return;
    }

    const success = fixer.fixFile(fileName, dryRun);
    results.push({ file: fileName, success });
  }

  console.log(`\n${'═'.repeat(60)}`);
  fixer.generateReport(results);
}

// Lancement du script
if (require.main === module) {
  main().catch(error => {
    log.error(`Erreur fatale: ${error.message}`);
    process.exit(1);
  });
}

module.exports = MarkdownFixer; 