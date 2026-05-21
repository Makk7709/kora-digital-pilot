require('dotenv').config();

// SECURITY DEBT: les tokens LinkedIn sont stockés en localStorage côté client
// (cf. src/lib/linkedin-api.ts:236-243). Migration prévue: poser ici un cookie
// httpOnly + SameSite=Lax pour le couple access/id token, et laisser le proxy
// faire les appels LinkedIn authentifiés en lisant le cookie. Hors scope sprint.
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
const path = require('path');

// ===== CONFIGURATION PORTS ENTERPRISE - SERVEUR PROXY =====

/**
 * 🚀 SERVEUR PROXY KORA - ARCHITECTURE ENTERPRISE
 * 
 * SERVICES CONFIGURÉS:
 * ├── LinkedIn OAuth API Proxy
 * ├── Anthropic Claude API Proxy  
 * ├── Health Check & Monitoring
 * └── CORS Security Headers
 * 
 * PORTS PAR ENVIRONNEMENT:
 * ├── DEV: 3001 (main), 3002 (fallback), 3003 (monitoring)
 * ├── STAGING: 4001
 * └── PRODUCTION: 5001
 */

// === DÉTECTION ENVIRONNEMENT INTELLIGENTE ===
const getEnvironment = () => {
  if (process.env.NODE_ENV === 'production') return 'PRODUCTION';
  if (process.env.NODE_ENV === 'staging' || process.env.VITE_ENV === 'staging') return 'STAGING';
  return 'DEV';
};

const ENV = getEnvironment();

// === CONFIGURATION PORTS ENTERPRISE ===
const PORT_CONFIG = {
  DEV: {
    MAIN: parseInt(process.env.PROXY_PORT) || 3001,
    FALLBACK: 3002,
    MONITORING: 3003,
    ALLOWED_ORIGINS: [
      'http://localhost:8088',
      'http://127.0.0.1:8088',
      'http://localhost:8090' // Preview
    ]
  },
  STAGING: {
    MAIN: parseInt(process.env.PROXY_PORT) || 4001,
    ALLOWED_ORIGINS: [
      'http://localhost:9088',
      'http://127.0.0.1:9088'
    ]
  },
  PRODUCTION: {
    MAIN: parseInt(process.env.PROXY_PORT) || 5001,
    ALLOWED_ORIGINS: [
      'http://localhost:10088',
      'http://127.0.0.1:10088'
    ]
  }
};

const CONFIG = PORT_CONFIG[ENV];
const PORT = CONFIG.MAIN;

console.log(`🏗️ [Proxy Server] Environment: ${ENV}`);
console.log(`🚀 [Proxy Server] Configuration: Port ${PORT}`);

const app = express();

// === MIDDLEWARE ENTERPRISE ===

// CORS Configuration sécurisée
app.use(cors({
  origin: CONFIG.ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'x-api-key',
    'anthropic-version'
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// === HELMET (CSP + secure headers) ===
// CSP minimale autorisant self + endpoints upstream utilisés par le proxy.
// connectSrc autorise les domaines APIs externes appelées côté serveur uniquement;
// le frontend n'appelle pas ces domaines directement.
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: [
          "'self'",
          'https://api.linkedin.com',
          'https://www.linkedin.com',
          'https://api.anthropic.com',
          'https://api.openai.com',
          'https://api.perplexity.ai',
        ],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: ENV === 'PRODUCTION' ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: ENV === 'PRODUCTION' ? { maxAge: 31536000, includeSubDomains: true } : false,
  })
);

// Body parsing avec limites de sécurité (1mb suffit largement pour nos payloads)
app.use(express.json({
  limit: '1mb',
  strict: true,
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON payload' });
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logging minimal des requêtes (méthode + path + ip + status). Pas de body.
app.use((req, res, next) => {
  if (ENV === 'DEV') {
    res.on('finish', () => {
      console.log(`📥 [${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${req.ip}`);
    });
  }
  next();
});

// === MIDDLEWARE DE VALIDATION ===
const validateApiKey = (keyName, required = true) => (req, res, next) => {
  const apiKey = req.body[keyName];
  
  if (required && !apiKey) {
    return res.status(400).json({
      error: `${keyName} manquante`,
      required: [keyName],
      timestamp: new Date().toISOString()
    });
  }
  
  if (apiKey && (typeof apiKey !== 'string' || apiKey.length < 10)) {
    return res.status(400).json({
      error: `${keyName} invalide`,
      details: 'La clé API doit contenir au moins 10 caractères',
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

// Rate limiter basé sur express-rate-limit (mieux que l'implémentation maison)
const rateLimiter = (maxRequests = 100, windowMs = 60000) =>
  rateLimit({
    windowMs,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Trop de requêtes',
        retryAfter: Math.ceil(windowMs / 1000),
        timestamp: new Date().toISOString(),
      });
    },
  });

// Limiteur global plus permissif appliqué à toute l'API.
app.use('/api/', rateLimiter(300, 60_000));

// === ENDPOINTS API ENTERPRISE ===

// Proxy pour l'échange de token LinkedIn
app.post('/api/linkedin/token', 
  rateLimiter(50, 60000), // 50 req/min max
  (req, res) => {
  const startTime = Date.now();
  
  (async () => {
    try {
      console.log('🔄 [LinkedIn Token] Début échange token');
      
      const { code, client_id, client_secret, redirect_uri } = req.body;
      
      if (!code || !client_id || !client_secret || !redirect_uri) {
        return res.status(400).json({
          error: 'Paramètres manquants',
          required: ['code', 'client_id', 'client_secret', 'redirect_uri'],
          timestamp: new Date().toISOString()
        });
      }

      const requestBody = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect_uri,
      });

      console.log('📤 [LinkedIn Token] Requête vers LinkedIn API');

      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'User-Agent': `KORA-Proxy/${ENV}-${PORT}`
        },
        body: requestBody,
        timeout: 30000 // 30s timeout
      });

      const responseTime = Date.now() - startTime;
      const data = await response.text();
      
      console.log(`📥 [LinkedIn Token] Réponse reçue: ${response.status} (${responseTime}ms)`);

      if (!response.ok) {
        console.error('❌ [LinkedIn Token] Erreur API:', {
          status: response.status,
          statusText: response.statusText,
          data: data.substring(0, 200)
        });
        
        return res.status(response.status).json({
          error: 'LinkedIn OAuth error',
          details: data,
          responseTime,
          timestamp: new Date().toISOString()
        });
      }

      // Validation JSON
      try {
        JSON.parse(data);
      } catch (e) {
        console.error('❌ [LinkedIn Token] Réponse non-JSON:', data.substring(0, 100));
        return res.status(500).json({
          error: 'Réponse API invalide',
          details: 'LinkedIn a retourné une réponse non-JSON',
          timestamp: new Date().toISOString()
        });
      }

      console.log(`✅ [LinkedIn Token] Succès (${responseTime}ms)`);
      
      // Retourner la réponse LinkedIn avec métadonnées
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Response-Time', `${responseTime}ms`);
      res.setHeader('X-Proxy-Version', 'KORA-Enterprise-v1.0');
      res.send(data);

    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('💥 [LinkedIn Token] Erreur serveur:', {
        message: error.message,
        stack: ENV === 'DEV' ? error.stack : undefined,
        responseTime
      });
      
      res.status(500).json({
        error: 'Erreur serveur proxy',
        message: ENV === 'DEV' ? error.message : 'Erreur interne',
        responseTime,
        timestamp: new Date().toISOString()
      });
    }
  })();
});

// Proxy pour Anthropic Claude (contournement CORS)
app.post('/api/anthropic/messages', 
  rateLimiter(30, 60000), // 30 req/min max pour IA
  validateApiKey('anthropic_key'),
  (req, res) => {
  const startTime = Date.now();
  
  (async () => {
    try {
      console.log('🤖 [Claude API] Début requête IA');
      
      const { messages, model, max_tokens, system, temperature, anthropic_key } = req.body;
      
      if (!messages || !model) {
        return res.status(400).json({
          error: 'Paramètres manquants',
          required: ['messages', 'model', 'anthropic_key'],
          timestamp: new Date().toISOString()
        });
      }

      console.log(`📤 [Claude API] Requête vers Anthropic - Model: ${model}`);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropic_key,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'User-Agent': `KORA-Proxy/${ENV}-${PORT}`
        },
        body: JSON.stringify({
          model,
          max_tokens,
          system,
          messages,
          temperature: temperature || 0.8,
        }),
        timeout: 120000 // 2min timeout pour IA
      });

      const responseTime = Date.now() - startTime;
      const data = await response.text();
      
      console.log(`📥 [Claude API] Réponse: ${response.status} (${responseTime}ms)`);

      if (!response.ok) {
        console.error('❌ [Claude API] Erreur:', {
          status: response.status,
          data: data.substring(0, 200)
        });
        
        return res.status(response.status).json({
          error: 'Anthropic Claude error',
          details: data,
          responseTime,
          timestamp: new Date().toISOString()
        });
      }

      console.log(`✅ [Claude API] Succès (${responseTime}ms)`);
      
      // Retourner la réponse Claude
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Response-Time', `${responseTime}ms`);
      res.setHeader('X-Proxy-Version', 'KORA-Enterprise-v1.0');
      res.send(data);

    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('💥 [Claude API] Erreur serveur:', {
        message: error.message,
        responseTime
      });
      
      res.status(500).json({
        error: 'Erreur serveur proxy Claude',
        message: ENV === 'DEV' ? error.message : 'Erreur interne',
        responseTime,
        timestamp: new Date().toISOString()
      });
    }
  })();
});

// Proxy pour récupérer le profil LinkedIn via OpenID Connect
app.post('/api/linkedin/profile', 
  rateLimiter(100, 60000),
  (req, res) => {
  const startTime = Date.now();
  
  (async () => {
    try {
      console.log('🔄 [LinkedIn Profile] Récupération profil OpenID Connect');
      
      const { access_token, endpoint } = req.body;
      
      if (!access_token) {
        return res.status(400).json({
          error: 'Access token manquant',
          timestamp: new Date().toISOString()
        });
      }

      // Utiliser l'endpoint fourni ou par défaut userinfo OpenID Connect
      const profileEndpoint = endpoint || 'https://api.linkedin.com/v2/userinfo';
      
      console.log(`📤 [LinkedIn Profile] Requête vers: ${profileEndpoint}`);

      const response = await fetch(profileEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/json',
          'User-Agent': `KORA-Proxy/${ENV}-${PORT}`
        },
        timeout: 30000
      });

      const responseTime = Date.now() - startTime;
      const data = await response.text();
      
      console.log(`📥 [LinkedIn Profile] Réponse: ${response.status} (${responseTime}ms)`);

      if (!response.ok) {
        console.error('❌ [LinkedIn Profile] Erreur:', {
          status: response.status,
          endpoint: profileEndpoint,
          data: data.substring(0, 200)
        });
        
        return res.status(response.status).json({
          error: 'LinkedIn Profile error',
          details: data,
          endpoint: profileEndpoint,
          responseTime,
          timestamp: new Date().toISOString()
        });
      }

      // Valider que la réponse est du JSON valide (sans logger d'email en clair)
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ [LinkedIn Profile] OpenID Connect réponse OK', {
          hasId: !!jsonData.sub,
          hasName: !!jsonData.given_name,
          hasEmail: !!jsonData.email,
          claimsCount: Object.keys(jsonData).length,
          responseTime,
        });
      } catch (parseError) {
        console.error('❌ [LinkedIn Profile] Réponse non-JSON:', data.substring(0, 100));
        return res.status(500).json({
          error: 'Réponse API invalide',
          details: 'LinkedIn a retourné une réponse non-JSON',
          timestamp: new Date().toISOString()
        });
      }

      // Retourner la réponse LinkedIn
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Response-Time', `${responseTime}ms`);
      res.setHeader('X-Proxy-Version', 'KORA-Enterprise-v1.0');
      res.send(data);

    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('💥 [LinkedIn Profile] Erreur serveur:', {
        message: error.message,
        responseTime
      });
      
      res.status(500).json({
        error: 'Erreur serveur proxy profil',
        message: ENV === 'DEV' ? error.message : 'Erreur interne',
        responseTime,
        timestamp: new Date().toISOString()
      });
    }
  })();
});

// === ENDPOINTS MONITORING & HEALTH CHECK ===

// Health check détaillé
app.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'OK',
    service: 'KORA Proxy Server',
    version: '1.0.0-enterprise',
    environment: ENV,
    port: PORT,
    uptime: {
      seconds: Math.floor(uptime),
      human: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
    },
    memory: {
      used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    },
    timestamp: new Date().toISOString(),
    nodeVersion: process.version
  });
});

// Endpoint de métriques (développement uniquement)
if (ENV === 'DEV') {
  app.get('/api/metrics', (req, res) => {
    res.json({
      environment: ENV,
      port: PORT,
      allowedOrigins: CONFIG.ALLOWED_ORIGINS,
      endpoints: [
        'POST /api/linkedin/token',
        'POST /api/anthropic/messages', 
        'POST /api/linkedin/profile',
        'GET /api/health',
        'GET /api/metrics'
      ],
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    });
  });
}

// === GESTION ERREURS GLOBALES ===
app.use((err, req, res, next) => {
  console.error('💥 [Global Error Handler]:', {
    message: err.message,
    stack: ENV === 'DEV' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json({
    error: 'Erreur serveur interne',
    message: ENV === 'DEV' ? err.message : 'Une erreur inattendue s\'est produite',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint non trouvé',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'POST /api/linkedin/token',
      'POST /api/anthropic/messages',
      'POST /api/linkedin/profile',
      'GET /api/health'
    ],
    timestamp: new Date().toISOString()
  });
});

// === DÉMARRAGE SERVEUR ENTERPRISE ===
const server = app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ===== KORA PROXY SERVER - ENTERPRISE EDITION =====');
  console.log(`📡 Environment: ${ENV}`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔒 Allowed Origins: ${CONFIG.ALLOWED_ORIGINS.join(', ')}`);
  console.log('📋 Endpoints:');
  console.log('   ├── POST /api/linkedin/token');
  console.log('   ├── POST /api/anthropic/messages');
  console.log('   ├── POST /api/linkedin/profile');
  console.log('   └── GET /api/health');
  if (ENV === 'DEV') {
    console.log('   └── GET /api/metrics (dev only)');
  }
  console.log('✅ Serveur démarré avec succès');
  console.log('');
});

// Gestion graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 [Shutdown] Signal SIGTERM reçu');
  server.close(() => {
    console.log('✅ [Shutdown] Serveur fermé proprement');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 [Shutdown] Signal SIGINT reçu (Ctrl+C)');
  server.close(() => {
    console.log('✅ [Shutdown] Serveur fermé proprement');
    process.exit(0);
  });
});

module.exports = app; 