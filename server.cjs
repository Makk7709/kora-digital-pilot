const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Proxy pour l'échange de token LinkedIn
app.post('/api/linkedin/token', async (req, res) => {
  try {
    console.log('🔄 Proxy: Échange token LinkedIn');
    
    const { code, client_id, client_secret, redirect_uri } = req.body;
    
    if (!code || !client_id || !client_secret || !redirect_uri) {
      return res.status(400).json({
        error: 'Paramètres manquants',
        required: ['code', 'client_id', 'client_secret', 'redirect_uri']
      });
    }

    const requestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
    });

    console.log('📤 Proxy: Requête vers LinkedIn');

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: requestBody,
    });

    const data = await response.text();
    
    console.log('📥 Proxy: Réponse LinkedIn:', {
      status: response.status,
      ok: response.ok
    });

    if (!response.ok) {
      console.error('❌ Proxy: Erreur LinkedIn:', data);
      return res.status(response.status).json({
        error: 'LinkedIn OAuth error',
        details: data
      });
    }

    // Retourner la réponse LinkedIn
    res.setHeader('Content-Type', 'application/json');
    res.send(data);

  } catch (error) {
    console.error('💥 Proxy: Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur proxy',
      message: error.message
    });
  }
});

// Proxy pour Anthropic Claude (contournement CORS)
app.post('/api/anthropic/messages', async (req, res) => {
  try {
    console.log('🤖 Proxy: Appel Claude via serveur backend');
    
    const { messages, model, max_tokens, system, temperature, anthropic_key } = req.body;
    
    if (!anthropic_key) {
      return res.status(400).json({
        error: 'Clé API Anthropic manquante'
      });
    }

    if (!messages || !model) {
      return res.status(400).json({
        error: 'Paramètres manquants',
        required: ['messages', 'model', 'anthropic_key']
      });
    }

    console.log('📤 Proxy: Requête vers Anthropic Claude');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropic_key,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens,
        system,
        messages,
        temperature: temperature || 0.8,
      }),
    });

    const data = await response.text();
    
    console.log('📥 Proxy: Réponse Claude:', {
      status: response.status,
      ok: response.ok
    });

    if (!response.ok) {
      console.error('❌ Proxy: Erreur Claude:', data);
      return res.status(response.status).json({
        error: 'Anthropic Claude error',
        details: data
      });
    }

    // Retourner la réponse Claude
    res.setHeader('Content-Type', 'application/json');
    res.send(data);

  } catch (error) {
    console.error('💥 Proxy: Erreur serveur Claude:', error);
    res.status(500).json({
      error: 'Erreur serveur proxy Claude',
      message: error.message
    });
  }
});

// Proxy pour récupérer le profil LinkedIn via OpenID Connect
app.post('/api/linkedin/profile', async (req, res) => {
  try {
    console.log('🔄 Proxy: Récupération profil LinkedIn (OpenID Connect)');
    
    const { access_token, endpoint } = req.body;
    
    if (!access_token) {
      return res.status(400).json({
        error: 'Access token manquant'
      });
    }

    // Utiliser l'endpoint fourni ou par défaut userinfo OpenID Connect
    const profileEndpoint = endpoint || 'https://api.linkedin.com/v2/userinfo';
    
    console.log('📤 Proxy: Requête profil vers:', profileEndpoint);

    const response = await fetch(profileEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.text();
    
    console.log('📥 Proxy: Réponse profil LinkedIn OpenID Connect:', {
      status: response.status,
      ok: response.ok,
      endpoint: profileEndpoint
    });

    if (!response.ok) {
      console.error('❌ Proxy: Erreur profil LinkedIn:', data);
      return res.status(response.status).json({
        error: 'LinkedIn Profile error',
        details: data,
        endpoint: profileEndpoint
      });
    }

    // Valider que la réponse est du JSON valide
    try {
      const jsonData = JSON.parse(data);
      console.log('✅ Proxy: Données profil OpenID Connect valides:', {
        hasId: !!jsonData.sub,
        hasName: !!jsonData.given_name,
        hasEmail: !!jsonData.email,
        claims: Object.keys(jsonData)
      });
    } catch (parseError) {
      console.error('❌ Proxy: Réponse LinkedIn non-JSON:', data);
    }

    // Retourner la réponse LinkedIn
    res.setHeader('Content-Type', 'application/json');
    res.send(data);

  } catch (error) {
    console.error('💥 Proxy: Erreur serveur profil:', error);
    res.status(500).json({
      error: 'Erreur serveur proxy profil',
      message: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'LinkedIn Proxy' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur proxy LinkedIn démarré sur http://localhost:${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/api/linkedin/token`);
});

module.exports = app; 