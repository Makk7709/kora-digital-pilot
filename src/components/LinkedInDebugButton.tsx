import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LinkedInDebugButton: React.FC = () => {
  const [debugInfo, setDebugInfo] = React.useState<any>({});

  React.useEffect(() => {
    // Collecter les informations de debug
    const info = {
      clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
      clientSecret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET ? 'DÉFINI' : 'NON DÉFINI',
      redirectUri: import.meta.env.VITE_LINKEDIN_REDIRECT_URI,
      currentUrl: window.location.href,
      allViteVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')),
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV
    };
    
    setDebugInfo(info);
    console.log('🔍 Debug LinkedIn Button:', info);
  }, []);

  const handleLinkedInConnect = () => {
    console.log('🔗 Bouton LinkedIn cliqué !');
    
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_LINKEDIN_REDIRECT_URI;
    
    if (!clientId) {
      alert('❌ VITE_LINKEDIN_CLIENT_ID non défini !');
      return;
    }
    
    if (!redirectUri) {
      alert('❌ VITE_LINKEDIN_REDIRECT_URI non défini !');
      return;
    }
    
    const state = Math.random().toString(36).substring(7);
    const scope = 'openid profile email';
    
    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('scope', scope);
    
    console.log('🚀 URL d\'authentification:', authUrl.toString());
    
    // Stocker l'état pour validation
    localStorage.setItem('linkedin_oauth_state', state);
    
    // Redirection
    window.location.href = authUrl.toString();
  };

  const testAlert = () => {
    alert('✅ Le bouton fonctionne !');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          🔍 Debug Bouton LinkedIn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bouton principal */}
        <div className="text-center space-y-2">
          <Button 
            onClick={handleLinkedInConnect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            🔗 Se connecter à LinkedIn (DEBUG)
          </Button>
          
          <Button 
            onClick={testAlert}
            variant="outline"
            className="w-full"
          >
            🧪 Test Bouton Simple
          </Button>
        </div>

        {/* Informations de debug */}
        <div className="bg-gray-50 p-4 rounded-lg text-sm">
          <h3 className="font-semibold mb-2">📋 Informations Debug:</h3>
          <div className="space-y-1 font-mono text-xs">
            <div>
              <strong>Client ID:</strong> {debugInfo.clientId || '❌ NON DÉFINI'}
            </div>
            <div>
              <strong>Client Secret:</strong> {debugInfo.clientSecret}
            </div>
            <div>
              <strong>Redirect URI:</strong> {debugInfo.redirectUri || '❌ NON DÉFINI'}
            </div>
            <div>
              <strong>URL actuelle:</strong> {debugInfo.currentUrl}
            </div>
            <div>
              <strong>Mode:</strong> {debugInfo.mode}
            </div>
            <div>
              <strong>Dev:</strong> {debugInfo.dev ? 'Oui' : 'Non'}
            </div>
            <div>
              <strong>Variables VITE_:</strong> {debugInfo.allViteVars?.join(', ') || 'Aucune'}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className={`p-3 rounded-lg border text-center ${
          debugInfo.clientId && debugInfo.redirectUri
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {debugInfo.clientId && debugInfo.redirectUri ? (
            <div>
              ✅ <strong>Configuration OK</strong> - Le bouton devrait fonctionner
            </div>
          ) : (
            <div>
              ❌ <strong>Configuration manquante</strong> - Vérifiez le fichier .env.local
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <h4 className="font-semibold text-blue-900 mb-1">🎯 Instructions:</h4>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Vérifiez que les variables sont bien affichées ci-dessus</li>
            <li>Cliquez sur "Test Bouton Simple" pour vérifier que les boutons fonctionnent</li>
            <li>Cliquez sur "Se connecter à LinkedIn" pour tester l'authentification</li>
            <li>Ouvrez la console (F12) pour voir les logs détaillés</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInDebugButton; 