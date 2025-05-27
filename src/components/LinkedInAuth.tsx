import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLinkedInAnalytics } from '@/hooks/useLinkedInAnalytics';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, ExternalLink, RefreshCw, LogOut } from 'lucide-react';

interface LinkedInAuthProps {
  onAuthSuccess?: () => void;
}

const LinkedInAuth: React.FC<LinkedInAuthProps> = ({ onAuthSuccess }) => {
  const {
    isAuthenticated,
    isLoading,
    isConfigured,
    lastSync,
    authenticate,
    logout,
    testConnection,
    handleOAuthCallback
  } = useLinkedInAnalytics();
  
  const { toast } = useToast();

  // Gérer le callback OAuth au chargement
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      toast({
        title: "Erreur d'authentification",
        description: "L'authentification LinkedIn a échoué",
        variant: "destructive",
      });
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code && isConfigured) {
      handleOAuthCallback(code).then((success) => {
        if (success) {
          toast({
            title: "Connexion réussie !",
            description: "Votre compte LinkedIn est maintenant connecté",
          });
          onAuthSuccess?.();
        } else {
          toast({
            title: "Erreur de connexion",
            description: "Impossible de se connecter à LinkedIn",
            variant: "destructive",
          });
        }
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, [handleOAuthCallback, toast, onAuthSuccess, isConfigured]);

  const handleTestConnection = async () => {
    const isConnected = await testConnection();
    
    if (isConnected) {
      toast({
        title: "Connexion active",
        description: "LinkedIn est connecté et fonctionnel",
      });
    } else {
      toast({
        title: "Connexion inactive",
        description: "Veuillez vous reconnecter à LinkedIn",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "Votre compte LinkedIn a été déconnecté",
    });
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Jamais';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <Card className="premium-card">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-slate-900 flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">💼</span>
          </div>
          <span>Connexion LinkedIn</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {!isConfigured ? (
          // État non configuré - Mode démonstration
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">🎭</span>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Mode Démonstration
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                LinkedIn n'est pas configuré. L'application fonctionne avec des données simulées réalistes pour la démonstration.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-left">
              <h4 className="font-semibold text-purple-900 text-sm mb-2">
                🎯 Fonctionnalités disponibles en mode démo :
              </h4>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Métriques simulées réalistes</li>
                <li>• Interface complète et fonctionnelle</li>
                <li>• Tous les widgets et graphiques</li>
                <li>• Expérience utilisateur authentique</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
              <h4 className="font-semibold text-blue-900 text-sm mb-2">
                🔧 Pour activer LinkedIn :
              </h4>
              <ol className="text-blue-700 text-sm space-y-1">
                <li>1. Créez un fichier <code className="bg-blue-100 px-1 rounded">.env</code> à la racine</li>
                <li>2. Ajoutez <code className="bg-blue-100 px-1 rounded">VITE_LINKEDIN_CLIENT_SECRET=...</code></li>
                <li>3. Redémarrez l'application</li>
              </ol>
            </div>

            <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30">
              Mode Démo Actif
            </Badge>
          </div>
        ) : !isAuthenticated ? (
          // État non connecté
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Connectez votre compte LinkedIn
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                Accédez à vos vraies métriques de performance et obtenez des insights personnalisés basés sur vos données réelles.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
              <h4 className="font-semibold text-blue-900 text-sm mb-2">
                Données que nous récupérerons :
              </h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Métriques de vos posts (impressions, engagement)</li>
                <li>• Statistiques de votre page/profil</li>
                <li>• Données d'audience et de portée</li>
                <li>• Historique de performance</li>
              </ul>
            </div>

            <Button 
              onClick={authenticate}
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700 w-full"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Connexion...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Se connecter avec LinkedIn
                </>
              )}
            </Button>

            <p className="text-xs text-slate-500">
              Sécurisé par OAuth 2.0 • Vos données restent privées
            </p>
          </div>
        ) : (
          // État connecté
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">LinkedIn connecté</h3>
                  <p className="text-slate-600 text-sm">
                    Dernière sync : {formatLastSync(lastSync)}
                  </p>
                </div>
              </div>
              
              <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                Actif
              </Badge>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-semibold text-green-900 text-sm mb-2">
                ✅ Fonctionnalités activées :
              </h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Métriques en temps réel</li>
                <li>• Insights personnalisés</li>
                <li>• Rapports authentiques</li>
                <li>• Recommandations IA précises</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={handleTestConnection}
                disabled={isLoading}
                variant="outline"
                className="flex-1 border-slate-200 text-slate-900 hover:bg-slate-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mr-2"></div>
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Tester
              </Button>
              
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnecter
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedInAuth; 