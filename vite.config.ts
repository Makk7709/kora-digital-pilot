import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// ===== CONFIGURATION PORTS ENTERPRISE - ARCHITECTURE IMPECCABLE =====

/**
 * 🏗️ ARCHITECTURE PORTS KORA - NIVEAU ENTERPRISE
 *
 * ENVIRONNEMENT DEVELOPMENT:
 * ├── 8088 - KORA App Frontend (React/Vite)
 * ├── 8089 - Hot Module Replacement (HMR)
 * ├── 8090 - Preview Build Mode
 * ├── 8091 - Tests & Storybook (disponible)
 * ├── 3001 - LinkedIn/Anthropic Proxy (CORS)
 * ├── 3002 - Fallback Proxy
 * └── 3003 - Monitoring & Health Check
 *
 * ENVIRONNEMENT STAGING:
 * ├── 9088 - KORA App Staging
 * ├── 9089 - HMR Staging
 * └── 4001 - Proxy Staging
 *
 * ENVIRONNEMENT PRODUCTION:
 * ├── 10088 - KORA App Production
 * └── 5001 - Proxy Production
 */

// === INTERFACES TYPESCRIPT STRICTES ===
interface BasePortConfig {
  APP: number;
  PROXY: number;
}

interface DevPortConfig extends BasePortConfig {
  HMR: number;
  PREVIEW: number;
  TESTING: number;
  PROXY_FALLBACK: number;
  MONITORING: number;
}

interface StagingPortConfig extends BasePortConfig {
  HMR: number;
}

interface ProductionPortConfig extends BasePortConfig {}

const PORT_CONFIG = {
  // === DEVELOPMENT PORTS ===
  DEV: {
    APP: 8088,
    HMR: 8089,
    PREVIEW: 8090,
    TESTING: 8091,
    PROXY: 3001,
    PROXY_FALLBACK: 3002,
    MONITORING: 3003,
  } as DevPortConfig,

  // === STAGING PORTS ===
  STAGING: {
    APP: 9088,
    HMR: 9089,
    PROXY: 4001,
  } as StagingPortConfig,

  // === PRODUCTION PORTS ===
  PRODUCTION: {
    APP: 10088,
    PROXY: 5001,
  } as ProductionPortConfig,
};

// Détection environnement intelligente
const getEnvironment = (): keyof typeof PORT_CONFIG => {
  if (process.env.NODE_ENV === 'production') return 'PRODUCTION';
  if (process.env.NODE_ENV === 'staging' || process.env.VITE_ENV === 'staging') return 'STAGING';
  return 'DEV';
};

const ENV = getEnvironment();
const PORTS = PORT_CONFIG[ENV];

// Fonctions utilitaires pour accès sécurisé aux ports
const getHMRPort = (): number => {
  if (ENV === 'DEV') return (PORTS as DevPortConfig).HMR;
  if (ENV === 'STAGING') return (PORTS as StagingPortConfig).HMR;
  return 8089; // Fallback pour production
};

const getPreviewPort = (): number => {
  if (ENV === 'DEV') return (PORTS as DevPortConfig).PREVIEW;
  return 8090; // Fallback pour staging/production
};

const getMonitoringPort = (): number => {
  if (ENV === 'DEV') return (PORTS as DevPortConfig).MONITORING;
  return PORTS.PROXY; // Fallback vers proxy pour staging/production
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // === CONFIGURATION RÉSEAU ENTERPRISE ===
    host: '::', // IPv6 + IPv4 support
    port: PORTS.APP,
    strictPort: true, // ✅ CHANGÉ: Port strict pour éviter conflits
    open: false, // Pas d'ouverture auto (contrôle manuel)

    // === HOT MODULE REPLACEMENT OPTIMISÉ ===
    hmr: {
      port: getHMRPort(),
      host: 'localhost', // HMR sur localhost uniquement (sécurité)
      clientPort: getHMRPort(), // Port côté client
      overlay: true, // Overlay erreurs en développement
    },

    // === PROXY CONFIGURATION INTELLIGENTE ===
    proxy: {
      // LinkedIn/Anthropic API Proxy avec protection anti-spam DÉFINITIVE
      '/api': {
        target: `http://localhost:${PORTS.PROXY}`,
        changeOrigin: true,
        secure: false,
        timeout: 5000, // 5s timeout
        configure: (proxy, _options) => {
          let errorCount = 0;
          let isServerDefinitelyDown = false;
          let serverDownTime: Date | null = null;
          const maxErrors = 3;

          // SOLUTION RADICALE : Intercepter TOUTES les requêtes vers /api quand down
          const originalProxyReq = proxy.on.bind(proxy);

          proxy.on('proxyReq', (proxyReq, req, res) => {
            // ARRÊT TOTAL : Si serveur down, bloquer immédiatement
            if (isServerDefinitelyDown) {
              console.log(
                `🛑 [Vite Proxy] BLOCKED ${req.method} ${req.url} - Server marked as permanently down`,
              );

              // Terminer la requête immédiatement avec 503
              res.writeHead(503, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              });
              res.end(
                JSON.stringify({
                  error: 'Backend server permanently unavailable',
                  code: 'SERVER_PERMANENTLY_DOWN',
                  message: 'Backend server is down. Please start it with: npm run proxy',
                  timestamp: new Date().toISOString(),
                  blocked: true,
                }),
              );

              // Arrêter la requête proxy
              proxyReq.destroy();
              return false; // Ne pas continuer
            }

            // Sinon, logger normalement
            console.log(`🔄 [Vite Proxy] ${req.method} ${req.url} → port ${PORTS.PROXY}`);
          });

          proxy.on('error', (err, req, res) => {
            errorCount++;

            // Phase d'apprentissage : montrer les 3 premières erreurs
            if (errorCount <= maxErrors && !isServerDefinitelyDown) {
              console.log(`🚨 [Vite Proxy] Error ${errorCount}/${maxErrors}:`, err.message);
              console.log(`💡 [Vite Proxy] Ensure server running on port ${PORTS.PROXY}`);

              if (errorCount === maxErrors) {
                isServerDefinitelyDown = true;
                serverDownTime = new Date();
                console.log(`🛑 [Vite Proxy] ===== SERVER MARKED AS PERMANENTLY DOWN =====`);
                console.log(
                  `🔧 [Vite Proxy] ALL API calls will now be BLOCKED until server restart`,
                );
                console.log(`💡 [Vite Proxy] To fix: Run 'npm run proxy' in another terminal`);
                console.log(`⏰ [Vite Proxy] Auto-recovery disabled. Manual restart required.`);
                console.log(`🛑 [Vite Proxy] =============================================`);
              }
            }

            // Réponse gracieuse même après down (pour les appels déjà en cours)
            if (res && !res.headersSent) {
              res.writeHead(503, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              });
              res.end(
                JSON.stringify({
                  error: 'Backend server unavailable',
                  code: isServerDefinitelyDown ? 'SERVER_PERMANENTLY_DOWN' : 'SERVER_DOWN',
                  message: 'The backend server is not running. Please start it with: npm run proxy',
                  timestamp: new Date().toISOString(),
                  fallback: true,
                  permanent: isServerDefinitelyDown,
                }),
              );
            }
          });

          // Fonction de reset manuelle uniquement (plus de reset auto)
          (global as any).resetProxyState = () => {
            console.log(`🔄 [Vite Proxy] Manual reset requested...`);
            errorCount = 0;
            isServerDefinitelyDown = false;
            serverDownTime = null;
            console.log(`✅ [Vite Proxy] Proxy state reset. Ready to retry connections.`);
          };

          // Commande pour reset via console
          console.log(
            `💡 [Vite Proxy] To manually reset proxy state, run: global.resetProxyState()`,
          );
        },
      },

      // Health Check Endpoint complètement silencieux
      '/health': {
        target: `http://localhost:${getMonitoringPort()}`,
        changeOrigin: true,
        timeout: 3000,
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, res) => {
            // Complètement silencieux pour health check
            if (res && !res.headersSent) {
              res.writeHead(503, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              });
              res.end(
                JSON.stringify({
                  status: 'DOWN',
                  service: 'Backend Health Check',
                  timestamp: new Date().toISOString(),
                }),
              );
            }
          });
        },
      },
    },

    // === CORS CONFIGURATION ENTERPRISE ===
    cors: {
      origin: [
        `http://localhost:${PORTS.APP}`,
        `http://127.0.0.1:${PORTS.APP}`,
        `http://localhost:${getPreviewPort()}`,
        // Staging et production URLs si nécessaire
        ...(ENV === 'STAGING' ? [`http://localhost:${PORT_CONFIG.STAGING.APP}`] : []),
        ...(ENV === 'PRODUCTION' ? [`http://localhost:${PORT_CONFIG.PRODUCTION.APP}`] : []),
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },

    // === HEADERS SÉCURISÉS ===
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      ...(ENV === 'PRODUCTION' && {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      }),
    },
  },

  // === CONFIGURATION PREVIEW (BUILD MODE) ===
  preview: {
    port: getPreviewPort(),
    host: '::',
    strictPort: true,
    open: false,
  },

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // === BUILD CONFIGURATION OPTIMISÉE ===
  build: {
    // Target moderne pour de meilleures performances
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],

    rollupOptions: {
      output: {
        // Chunking intelligent pour optimiser le cache
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'vendor-charts': ['recharts'],
          'pdf-utils': ['jspdf'],
          'brand-intelligence': ['./src/services/RealBrandIntelligenceService.ts'],
        },

        // Nommage cohérent des chunks
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.ts', '').replace('.tsx', '')
            : 'chunk';
          return `${facadeModuleId}-[hash].js`;
        },

        // Assets avec hash pour cache busting
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },

    // === OPTIMISATIONS BUILD ===
    minify: ENV === 'PRODUCTION' ? 'esbuild' : false,
    sourcemap: ENV !== 'PRODUCTION', // Source maps uniquement hors production

    // Limite de warnings pour build clean
    chunkSizeWarningLimit: 1000,
  },

  // === OPTIMISATION DÉPENDANCES ===
  optimizeDeps: {
    include: ['jspdf', 'react', 'react-dom', 'react-router-dom', 'recharts'],
    exclude: [],

    // Force re-bundling pour certaines dépendances
    force: mode === 'development',
  },

  // === DÉFINITIONS GLOBALES ===
  define: {
    global: 'globalThis',

    // Variables d'environnement pour l'app
    __APP_ENV__: JSON.stringify(ENV),
    __APP_PORT__: PORTS.APP,
    __PROXY_PORT__: PORTS.PROXY,
    __DEV_MODE__: mode === 'development',
  },

  // === CONFIGURATION ESBuild ===
  esbuild: {
    drop: ENV === 'PRODUCTION' ? ['console', 'debugger'] : [],
    logOverride: {
      'this-is-undefined-in-esm': 'silent',
    },
  },

  // === LOGGING CONFIGURATION ===
  logLevel: ENV === 'PRODUCTION' ? 'error' : 'info',

  clearScreen: false, // Garde l'historique console visible
}));
