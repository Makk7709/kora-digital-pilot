import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { linkedinAPI } from '@/lib/linkedin-api';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

const LinkedInAuthSimple: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(linkedinAPI.isAuthenticated());
  const { toast } = useToast();

  const handleConnect = () => {
    try {
      setIsConnecting(true);
      const authURL = linkedinAPI.getAuthURL();
      
      toast({
        title: "🔗 Redirection vers LinkedIn",
        description: "Vous allez être redirigé vers LinkedIn pour l'authentification",
      });

      // Redirection vers LinkedIn
      window.location.href = authURL;
    } catch (error) {
      console.error('Erreur génération URL auth:', error);
      setIsConnecting(false);
      toast({
        title: "❌ Erreur",
        description: "Impossible de générer l'URL d'authentification",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    linkedinAPI.logout();
    setIsConnected(false);
    toast({
      title: "✅ Déconnecté",
      description: "Vous avez été déconnecté de LinkedIn",
    });
  };

  const testConnection = async () => {
    try {
      const connected = await linkedinAPI.testConnection();
      setIsConnected(connected);
      
      if (connected) {
        toast({
          title: "✅ Connexion active",
          description: "Votre connexion LinkedIn fonctionne",
        });
      } else {
        toast({
          title: "❌ Connexion inactive",
          description: "Veuillez vous reconnecter à LinkedIn",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Test connexion échoué:', error);
      toast({
        title: "❌ Test échoué",
        description: "Impossible de tester la connexion",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">in</span>
          </div>
          <span>Authentification LinkedIn</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className={`p-3 rounded-lg border ${
          isConnected 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-gray-50 border-gray-200 text-gray-600'
        }`}>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm font-medium">
              {isConnected ? 'Connecté à LinkedIn' : 'Non connecté'}
            </span>
          </div>
        </div>

        {/* Configuration Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Client ID:</strong> {linkedinAPI['config']?.clientId || 'Non configuré'}</p>
          <p><strong>Redirect URI:</strong> {linkedinAPI['config']?.redirectUri || 'Non configuré'}</p>
          <p><strong>Scopes:</strong> openid profile</p>
          <p className="text-green-600">✅ Scopes universels LinkedIn</p>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {!isConnected ? (
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Redirection...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Se connecter à LinkedIn
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button 
                onClick={testConnection}
                variant="outline"
                className="w-full"
              >
                Tester la connexion
              </Button>
              <Button 
                onClick={handleDisconnect}
                variant="destructive"
                className="w-full"
              >
                Se déconnecter
              </Button>
            </div>
          )}
        </div>

        {/* Debug Info */}
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
            Informations de debug
          </summary>
          <div className="mt-2 p-2 bg-gray-50 rounded text-gray-600">
            <p>Token stocké: {localStorage.getItem('linkedin_access_token') ? 'Oui' : 'Non'}</p>
            <p>Expiration: {localStorage.getItem('linkedin_token_expires') || 'Non définie'}</p>
            <p>URL actuelle: {window.location.href}</p>
          </div>
        </details>
      </CardContent>
    </Card>
  );
};

export default LinkedInAuthSimple; 