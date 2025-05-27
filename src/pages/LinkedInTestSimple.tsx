import React from 'react';
import LinkedInAuthSimple from '@/components/LinkedInAuthSimple';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { linkedinAPI } from '@/lib/linkedin-api';

const LinkedInTestSimple: React.FC = () => {
  const [configStatus, setConfigStatus] = React.useState<{
    currentPort: string;
    expectedPort: string;
    redirectUri: string;
    isPortCorrect: boolean;
  } | null>(null);

  React.useEffect(() => {
    const currentPort = window.location.port || '80';
    const expectedPort = '8088';
    const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
    
    setConfigStatus({
      currentPort,
      expectedPort,
      redirectUri,
      isPortCorrect: currentPort === expectedPort
    });
  }, []);

  const testCallbackURL = () => {
    const testURL = `${window.location.origin}/auth/linkedin/callback?code=test_code&state=test_state`;
    console.log('🧪 Test URL callback:', testURL);
    window.open(testURL, '_blank');
  };

  const testAuthURL = () => {
    const authURL = linkedinAPI.getAuthURL();
    console.log('🧪 URL d\'authentification générée:', authURL);
    alert(`URL générée:\n${authURL}`);
  };

  const clearStorage = () => {
    localStorage.removeItem('linkedin_access_token');
    localStorage.removeItem('linkedin_token_expires');
    localStorage.removeItem('linkedin_oauth_state');
    console.log('🧹 Storage LinkedIn nettoyé');
    window.location.reload();
  };

  const copyRedirectUri = () => {
    if (configStatus) {
      navigator.clipboard.writeText(configStatus.redirectUri);
      alert(`URL copiée dans le presse-papiers:\n${configStatus.redirectUri}`);
    }
  };

  const testImmediateAuth = () => {
    console.log('🚀 Test immédiat après autorisation');
    
    // Nettoyer le localStorage
    localStorage.removeItem('linkedin_access_token');
    localStorage.removeItem('linkedin_token_expires');
    localStorage.removeItem('linkedin_oauth_state');
    
    // Générer une nouvelle URL d'auth
    const authURL = linkedinAPI.getAuthURL();
    console.log('🔗 URL d\'auth générée:', authURL);
    
    // Ouvrir dans la même fenêtre pour test immédiat
    window.location.href = authURL;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Test LinkedIn - Version Simple
          </h1>
          <p className="text-slate-600">
            Test d'authentification LinkedIn avec permissions de base
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authentification */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Authentification
            </h2>
            <LinkedInAuthSimple />
          </div>

          {/* Diagnostic */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Diagnostic
            </h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tests de Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={testAuthURL}
                  variant="outline"
                  className="w-full"
                >
                  🔗 Tester URL d'authentification
                </Button>
                
                <Button 
                  onClick={testCallbackURL}
                  variant="outline"
                  className="w-full"
                >
                  🔄 Tester URL de callback
                </Button>
                
                <Button 
                  onClick={clearStorage}
                  variant="destructive"
                  className="w-full"
                >
                  🧹 Nettoyer le storage
                </Button>

                <Button 
                  onClick={copyRedirectUri}
                  variant="outline"
                  className="w-full"
                >
                  📋 Copier URL de redirection
                </Button>

                <div className="space-y-4">
                  <Button 
                    onClick={testImmediateAuth}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    🚀 Test Immédiat LinkedIn
                  </Button>
                  
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    <strong>Test Immédiat :</strong> Ce bouton va vous rediriger vers LinkedIn 
                    et tester l'échange de token immédiatement après autorisation.
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded">
                  <p><strong>Port actuel:</strong> {window.location.port || '80'}</p>
                  <p><strong>URL actuelle:</strong> {window.location.origin}</p>
                  <p><strong>Callback configuré:</strong> {window.location.origin}/auth/linkedin/callback</p>
                  
                  {configStatus && (
                    <div className={`mt-2 p-2 rounded text-xs ${
                      configStatus.isPortCorrect 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {configStatus.isPortCorrect ? (
                        <div className="flex items-center space-x-1">
                          <span>✅</span>
                          <span>Port correct ({configStatus.currentPort})</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <span>⚠️</span>
                            <span>Port incorrect !</span>
                          </div>
                          <div>Actuel: {configStatus.currentPort}, Attendu: {configStatus.expectedPort}</div>
                          <div className="mt-1 text-xs">
                            Mettez à jour l'URL dans LinkedIn Developer Portal
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Instructions
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="space-y-4 text-sm text-slate-600">
              <div>
                <h3 className="font-medium text-slate-900 mb-2">1. Configuration LinkedIn</h3>
                <p>Assurez-vous d'avoir ajouté cette URL de redirection dans votre app LinkedIn :</p>
                <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
                  {window.location.origin}/auth/linkedin/callback
                </code>
              </div>

              <div>
                <h3 className="font-medium text-slate-900 mb-2">2. Permissions utilisées</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>openid</code> - Authentification OpenID Connect</li>
                  <li><code>profile</code> - Profil de base (nom, photo)</li>
                </ul>
                <p className="text-xs text-green-600 mt-2">
                  ✅ Ces scopes sont disponibles pour toutes les applications LinkedIn
                </p>
              </div>

              <div>
                <h3 className="font-medium text-slate-900 mb-2">3. Processus</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Cliquez sur "Se connecter à LinkedIn"</li>
                  <li>Autorisez l'application sur LinkedIn</li>
                  <li>Vous serez redirigé vers la page de callback</li>
                  <li>Retour automatique vers cette page</li>
                </ol>
              </div>

              <div>
                <h3 className="font-medium text-slate-900 mb-2">4. Dépannage</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Vérifiez l'URL de redirection dans LinkedIn Developer</li>
                  <li>Assurez-vous que l'app est en mode "Development"</li>
                  <li>Vérifiez les permissions demandées</li>
                  <li>Consultez la console pour les erreurs</li>
                  <li>Utilisez les boutons de test ci-dessus</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Liens utiles */}
        <div className="mt-8 text-center">
          <div className="inline-flex space-x-4 text-sm">
            <a 
              href="https://developer.linkedin.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              LinkedIn Developer Portal
            </a>
            <a 
              href="/linkedin-test" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Version complète
            </a>
            <a 
              href="/app" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Retour au dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInTestSimple; 