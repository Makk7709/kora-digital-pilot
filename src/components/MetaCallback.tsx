import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

const MetaCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Authentification Meta en cours...');
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription =
        searchParams.get('error_description') ?? searchParams.get('error_reason');
      const state = searchParams.get('state');
      const storedState = localStorage.getItem('meta_oauth_state');
      const provider = localStorage.getItem('meta_oauth_provider') ?? 'facebook';

      if (error) {
        setStatus('error');
        setMessage(`${error}: ${errorDescription ?? ''}`);
        return;
      }
      if (!code) {
        setStatus('error');
        setMessage("Code d'autorisation manquant.");
        return;
      }
      if (state && storedState && state !== storedState) {
        setStatus('error');
        setMessage('State OAuth invalide (CSRF).');
        return;
      }
      localStorage.removeItem('meta_oauth_state');
      localStorage.removeItem('meta_oauth_provider');

      const redirectUri = `${window.location.origin}/auth/meta/callback`;

      try {
        const { data, error: fnError } = await supabase.functions.invoke('meta-oauth-exchange', {
          body: { code, redirect_uri: redirectUri, provider },
        });
        if (fnError) throw fnError;
        if (!data?.success) throw new Error(data?.error ?? 'Échange échoué');

        setStatus('success');
        setMessage(`Compte ${provider} connecté : ${data.profile?.name ?? 'OK'}`);
        toast({ title: 'Meta connecté', description: 'Votre compte est lié.' });
        setTimeout(() => navigate('/settings'), 1500);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erreur inconnue';
        setStatus('error');
        setMessage(msg);
        toast({ title: 'Erreur Meta', description: msg, variant: 'destructive' });
        setTimeout(() => navigate('/settings'), 3000);
      }
    })();
  }, [searchParams, navigate, toast]);

  const icon =
    status === 'loading' ? (
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    ) : status === 'success' ? (
      <CheckCircle2 className="w-8 h-8 text-green-500" />
    ) : (
      <AlertTriangle className="w-8 h-8 text-red-500" />
    );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex justify-center">{icon}</div>
          <h1 className="text-xl font-semibold">Authentification Meta</h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetaCallback;