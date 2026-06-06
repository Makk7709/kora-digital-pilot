import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLinkedInAnalytics } from '@/hooks/useLinkedInAnalytics';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

const LinkedInStatus: React.FC = () => {
  const { isAuthenticated, isLoading, isConfigured, authenticate, testConnection } =
    useLinkedInAnalytics();

  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!isConfigured) {
      toast({
        title: 'Configuration manquante',
        description: "LinkedIn n'est pas configuré dans les variables d'environnement",
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsConnecting(true);
      authenticate();
    } catch (error) {
      console.error('Erreur connexion LinkedIn:', error);
      toast({
        title: 'Erreur de connexion',
        description: 'Impossible de se connecter à LinkedIn',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTestConnection = async () => {
    const isConnected = await testConnection();

    if (isConnected) {
      toast({
        title: '✅ LinkedIn connecté',
        description: 'La connexion LinkedIn est active et fonctionnelle',
      });
    } else {
      toast({
        title: '❌ LinkedIn déconnecté',
        description: 'Veuillez vous reconnecter à LinkedIn',
        variant: 'destructive',
      });
    }
  };

  // Affichage conditionnel selon l'état
  if (!isConfigured) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200">
        <AlertCircle className="w-3 h-3 text-gray-400" />
        <span className="text-gray-500 text-xs font-medium">LinkedIn non configuré</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-50 border border-green-200">
          <CheckCircle className="w-3 h-3 text-green-600" />
          <span className="text-green-600 text-xs font-medium">LinkedIn connecté</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleTestConnection}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
        <AlertCircle className="w-3 h-3 text-orange-600" />
        <span className="text-orange-600 text-xs font-medium">LinkedIn déconnecté</span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleConnect}
        disabled={isConnecting || isLoading}
        className="h-6 px-2 text-xs"
      >
        {isConnecting ? (
          <div className="w-3 h-3 border border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        ) : (
          <ExternalLink className="w-3 h-3" />
        )}
      </Button>
    </div>
  );
};

export default LinkedInStatus;
