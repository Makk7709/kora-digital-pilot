import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/error-handler'
import { linkedinAPI } from './lib/linkedin-api'

// Exposer l'API LinkedIn dans le global scope pour les tests
if (typeof window !== 'undefined') {
  (window as any).linkedinAPI = linkedinAPI
  console.log('🔗 LinkedIn API exposée dans window.linkedinAPI pour les tests')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
