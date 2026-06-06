import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './lib/error-handler';
import { linkedinAPI } from './lib/linkedin-api';

// Exposer l'API LinkedIn dans le global scope pour les tests
if (typeof globalThis !== 'undefined') {
  (globalThis as any).linkedinAPI = linkedinAPI;
  console.log('🔗 LinkedIn API exposée dans window.linkedinAPI pour les tests');
}

// 🛑 PROTECTION ANTI-SPAM - Initialiser le bloqueur global
import './lib/global-api-blocker';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Élément racine #root introuvable dans le DOM');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
