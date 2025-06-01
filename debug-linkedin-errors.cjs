#!/usr/bin/env node

// 🔍 Script de diagnostic avancé LinkedIn - Erreurs d'authentification
console.log('🔍 === DIAGNOSTIC LINKEDIN AVANCÉ ===\n');

const fs = require('fs');
const path = require('path');

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, icon, message) {
  console.log(`${colors[color]}${icon} ${message}${colors.reset}`);
}

function logSuccess(message) { log('green', '✅', message); }
function logError(message) { log('red', '❌', message); }
function logWarning(message) { log('yellow', '⚠️', message); }
function logInfo(message) { log('blue', 'ℹ️', message); }
function logDebug(message) { log('cyan', '🔍', message); }

// 1. Vérifier les erreurs courantes dans les logs
function analyzeErrors() {
  logInfo('1. ANALYSE DES ERREURS OBSERVÉES\n');
  
  const errors = [
    {
      error: "Deprecated API for given entry type",
      cause: "API LinkedIn dépréciée",
      severity: "LOW",
      impact: "Aucun - Juste un warning",
      solution: "Normal - LinkedIn utilise des APIs dépréciées en interne"
    },
    {
      error: "404 - icons.svg",
      cause: "Ressource LinkedIn manquante",
      severity: "LOW", 
      impact: "Visuel seulement",
      solution: "Erreur côté LinkedIn - Aucune action requise"
    },
    {
      error: "XMLHttpRequest readyState: 4, timeout: 0",
      cause: "Requête AJAX échouée",
      severity: "HIGH",
      impact: "Peut empêcher l'échange de token",
      solution: "Vérifier le proxy et les credentials"
    },
    {
      error: "message channel closed before response",
      cause: "Problème de timing popup LinkedIn",
      severity: "MEDIUM",
      impact: "Peut interrompre l'authentification",
      solution: "Ne pas fermer la popup trop rapidement"
    },
    {
      error: "Cannot read properties of null (textContent)",
      cause: "Élément DOM manquant",
      severity: "MEDIUM",
      impact: "Erreur JavaScript côté LinkedIn",
      solution: "Vérifier la compatibilité navigateur"
    }
  ];

  errors.forEach((err, index) => {
    console.log(`${index + 1}. ${err.error}`);
    console.log(`   Cause: ${err.cause}`);
    console.log(`   Sévérité: ${err.severity}`);
    console.log(`   Impact: ${err.impact}`);
    console.log(`   Solution: ${err.solution}\n`);
  });
}

// 2. Vérifier la configuration
function checkConfiguration() {
  logInfo('2. VÉRIFICATION CONFIGURATION\n');
  
  try {
    // Vérifier le fichier .env
    if (fs.existsSync('.env')) {
      const envContent = fs.readFileSync('.env', 'utf8');
      const envLines = envContent.split('\n').filter(line => line.includes('LINKEDIN'));
      
      logSuccess('Fichier .env trouvé:');
      envLines.forEach(line => {
        if (line.includes('CLIENT_ID')) {
          const clientId = line.split('=')[1];
          console.log(`   CLIENT_ID: ${clientId?.substring(0, 10)}...`);
        } else if (line.includes('CLIENT_SECRET')) {
          const hasSecret = line.split('=')[1]?.length > 0;
          console.log(`   CLIENT_SECRET: ${hasSecret ? '✅ Configuré' : '❌ Manquant'}`);
        } else if (line.includes('REDIRECT_URI')) {
          const redirectUri = line.split('=')[1];
          console.log(`   REDIRECT_URI: ${redirectUri}`);
        }
      });
    } else {
      logError('Fichier .env non trouvé');
    }
    
    console.log();
    
    // Vérifier les fichiers de configuration
    const configFiles = [
      'src/lib/linkedin-api.ts',
      'server.cjs',
      'src/components/LinkedInCallback.tsx'
    ];
    
    configFiles.forEach(file => {
      if (fs.existsSync(file)) {
        logSuccess(`${file} - OK`);
      } else {
        logError(`${file} - MANQUANT`);
      }
    });
    
  } catch (error) {
    logError(`Erreur vérification configuration: ${error.message}`);
  }
}

// 3. Tests de connectivité
async function testConnectivity() {
  logInfo('3. TESTS DE CONNECTIVITÉ\n');
  
  const tests = [
    {
      name: 'Proxy local (port 3001)',
      url: 'http://localhost:3001/api/health',
      expected: 'OK'
    },
    {
      name: 'Serveur Vite (port 8088)', 
      url: 'http://localhost:8088',
      expected: 'HTML'
    },
    {
      name: 'LinkedIn API accessToken',
      url: 'https://www.linkedin.com/oauth/v2/accessToken',
      expected: 'POST only'
    },
    {
      name: 'LinkedIn API userinfo',
      url: 'https://api.linkedin.com/v2/userinfo',
      expected: 'Auth required'
    }
  ];

  for (const test of tests) {
    try {
      logDebug(`Test: ${test.name}`);
      
      if (test.url.includes('localhost')) {
        // Test local avec timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        try {
          const response = await fetch(test.url, { 
            signal: controller.signal,
            mode: 'cors'
          });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            logSuccess(`${test.name} - Accessible`);
          } else {
            logWarning(`${test.name} - Status ${response.status}`);
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          logError(`${test.name} - ${fetchError.message}`);
        }
      } else {
        logInfo(`${test.name} - External API (skipped in Node.js)`);
      }
    } catch (error) {
      logError(`${test.name} - ${error.message}`);
    }
  }
}

// 4. Proposer des solutions
function proposeSolutions() {
  logInfo('4. SOLUTIONS RECOMMANDÉES\n');
  
  const solutions = [
    {
      priority: 'HIGH',
      title: 'Vérifier les serveurs',
      steps: [
        'Démarrer le proxy: node server.cjs',
        'Démarrer Vite: npm run dev', 
        'Vérifier: curl http://localhost:3001/api/health',
        'Tester: http://localhost:8088/linkedin-test'
      ]
    },
    {
      priority: 'MEDIUM',
      title: 'Tester l\'authentification step-by-step',
      steps: [
        'Ouvrir Console DevTools (F12)',
        'Aller sur la page de test LinkedIn',
        'Cliquer sur "Se connecter avec LinkedIn"',
        'Observer les logs dans Console et Network',
        'Vérifier si le code est reçu dans l\'URL callback'
      ]
    },
    {
      priority: 'LOW',
      title: 'Solutions pour erreurs non-critiques',
      steps: [
        'Ignorer les erreurs 404 LinkedIn (normales)',
        'Ignorer les "Deprecated API" warnings',
        'Se concentrer sur les erreurs d\'échange de token',
        'Vérifier que le callback URL est correct'
      ]
    }
  ];

  solutions.forEach(solution => {
    const priorityColor = solution.priority === 'HIGH' ? 'red' : 
                         solution.priority === 'MEDIUM' ? 'yellow' : 'blue';
    
    log(priorityColor, `🎯 [${solution.priority}]`, solution.title);
    solution.steps.forEach((step, index) => {
      console.log(`     ${index + 1}. ${step}`);
    });
    console.log();
  });
}

// 5. Script de test rapide
function generateTestScript() {
  logInfo('5. SCRIPT DE TEST RAPIDE\n');
  
  const testScript = `
# Test rapide LinkedIn Authentication

# 1. Démarrer les serveurs
echo "🚀 Démarrage serveurs..."
node server.cjs &
PROXY_PID=$!
npm run dev &
VITE_PID=$!

# 2. Attendre que les serveurs démarrent
echo "⏳ Attente démarrage (5s)..."
sleep 5

# 3. Tester le proxy
echo "🔍 Test proxy..."
curl -s http://localhost:3001/api/health

# 4. Ouvrir la page de test
echo "🌐 Ouverture page de test..."
open http://localhost:8088/linkedin-test

echo "✅ Test prêt ! Vérifiez la console du navigateur."
echo "🛑 Pour arrêter: kill $PROXY_PID $VITE_PID"
`;

  console.log('Copiez et exécutez ce script:');
  console.log(colors.cyan + testScript + colors.reset);
}

// 6. Commandes de debugging utiles
function showDebugCommands() {
  logInfo('6. COMMANDES DE DEBUGGING UTILES\n');
  
  const commands = [
    {
      command: 'curl -s http://localhost:3001/api/health',
      description: 'Tester le proxy'
    },
    {
      command: 'lsof -i :3001',
      description: 'Vérifier si le port 3001 est occupé'
    },
    {
      command: 'lsof -i :8088', 
      description: 'Vérifier si le port 8088 est occupé'
    },
    {
      command: 'cat .env | grep LINKEDIN',
      description: 'Vérifier les variables LinkedIn'
    },
    {
      command: 'node -e "console.log(process.env)"',
      description: 'Lister toutes les variables d\'environnement'
    }
  ];

  commands.forEach(cmd => {
    console.log(`${colors.cyan}${cmd.command}${colors.reset}`);
    console.log(`   → ${cmd.description}\n`);
  });
}

// Exécution du diagnostic
async function runDiagnosis() {
  analyzeErrors();
  checkConfiguration(); 
  await testConnectivity();
  proposeSolutions();
  generateTestScript();
  showDebugCommands();
  
  logSuccess('Diagnostic terminé ! Suivez les solutions par ordre de priorité.');
}

// Exécuter si appelé directement
if (require.main === module) {
  runDiagnosis().catch(console.error);
}

module.exports = { runDiagnosis, analyzeErrors, checkConfiguration }; 