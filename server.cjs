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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'LinkedIn Proxy' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur proxy LinkedIn démarré sur http://localhost:${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/api/linkedin/token`);
});

module.exports = app; 