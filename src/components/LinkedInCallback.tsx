import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { linkedinAPI } from '@/lib/linkedin-api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { logUsage, USAGE_EVENTS } from '@/lib/usage-logger';

const LinkedInCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Authentification en cours...');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Éviter le double traitement
    if (isProcessing) return;

    const handleCallback = async () => {
      setIsProcessing(true);
      try {
        console.log('🔄 Début traitement callback LinkedIn');
        console.log('📍 URL actuelle:', globalThis.location.href);
        console.log('🔍 Paramètres URL:', Object.fromEntries(searchParams.entries()));

        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const state = searchParams.get('state');
        const storedState = localStorage.getItem('linkedin_oauth_state');

        console.log('📋 Paramètres OAuth reçus:', {
          hasCode: !!code,
          codeLength: code?.length,
          error: error,
          errorDescription: errorDescription,
          state: state,
          storedState: storedState,
          stateMatch: state === storedState,
        });

        if (error) {
          console.error('❌ Erreur OAuth LinkedIn:', { error, errorDescription });
          throw new Error(
            `Erreur LinkedIn: ${error} - ${errorDescription || 'Aucune description'}`,
          );
        }

        if (!code) {
          console.error("❌ Code d'autorisation manquant");
          throw new Error("Code d'autorisation manquant dans la réponse LinkedIn");
        }

        // Validation du state (optionnel mais recommandé)
        if (state && storedState && state !== storedState) {
          console.error('❌ State OAuth invalide:', { received: state, stored: storedState });
          throw new Error('State OAuth invalide - possible attaque CSRF');
        }

        setMessage("Échange du code d'autorisation...");
        console.log('🔄 Début échange code pour token');

        // Échanger le code contre un token
        const token = await linkedinAPI.exchangeCodeForToken(code);
        console.log('✅ Token obtenu avec succès');

        setMessage('Récupération du profil utilisateur...');
        console.log('🔄 Récupération profil utilisateur');

        // Tester la connexion
        const profile = await linkedinAPI.getUserProfile();
        console.log('✅ Profil utilisateur récupéré:', {
          id: profile.id,
          firstName: profile.firstName?.localized,
          lastName: profile.lastName?.localized,
        });

        setStatus('success');
        const userName =
          profile.firstName?.localized?.['en_US'] ||
          Object.values(profile.firstName?.localized || {})[0] ||
          'Utilisateur';
        setMessage(`Connexion réussie ! Bienvenue ${userName}`);

        toast({
          title: '✅ LinkedIn connecté !',
          description: 'Votre compte LinkedIn a été connecté avec succès',
        });

        // Nettoyer le state stocké
        localStorage.removeItem('linkedin_oauth_state');

        void logUsage(USAGE_EVENTS.LINKEDIN_CONNECT_SUCCESS, {
          hasProfile: Boolean(profile?.id),
        });

        console.log('🎉 Authentification LinkedIn terminée avec succès');

        // Rediriger vers l'app principale après 2 secondes
        setTimeout(() => {
          console.log('🔄 Redirection vers /app');
          navigate('/app');
        }, 2000);
      } catch (error) {
        console.error('💥 Erreur callback LinkedIn:', error);
        setStatus('error');
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        setMessage(errorMessage);

        toast({
          title: '❌ Erreur de connexion',
          description: errorMessage,
          variant: 'destructive',
        });

        // Rediriger vers l'app principale après 3 secondes
        setTimeout(() => {
          console.log('🔄 Redirection vers /app après erreur');
          navigate('/app');
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, toast, isProcessing]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-8 h-8 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-8 h-8 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-md ${getStatusColor()} border-2`}>
        <CardContent className="p-8 text-center">
          <div className="mb-6">{getStatusIcon()}</div>

          <h1 className="text-xl font-bold text-slate-900 mb-4">Authentification LinkedIn</h1>

          <p className="text-slate-600 mb-6">{message}</p>

          {status === 'loading' && (
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
          )}

          {status === 'success' && (
            <p className="text-sm text-green-600">Redirection vers la page de test...</p>
          )}

          {status === 'error' && (
            <p className="text-sm text-red-600">Redirection vers la page de test...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInCallback;
