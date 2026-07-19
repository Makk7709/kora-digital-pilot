import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Link2, LogOut, Loader2, Linkedin } from 'lucide-react';

type Account = {
  id: string;
  account_name: string | null;
  account_handle: string | null;
  avatar_url: string | null;
  last_synced_at: string | null;
};

const LinkedInConnect: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const loadAccount = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('social_accounts')
      .select('id, account_name, account_handle, avatar_url, last_synced_at')
      .eq('user_id', user.id)
      .eq('provider', 'linkedin')
      .eq('is_active', true)
      .maybeSingle();
    if (!error) setAccount(data as Account | null);
    setLoading(false);
  };

  useEffect(() => {
    loadAccount();
     
  }, [user?.id]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const state = crypto.randomUUID();
      localStorage.setItem('linkedin_oauth_state', state);
      const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
      const { data, error } = await supabase.functions.invoke('linkedin-oauth-url', {
        body: { redirect_uri: redirectUri, state },
      });
      if (error || !data?.url) {
        throw new Error(error?.message ?? data?.error ?? 'URL manquante');
      }
      window.location.href = data.url as string;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur inconnue';
      toast({ title: 'Erreur', description: msg, variant: 'destructive' });
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!account) return;
    const { error } = await supabase
      .from('social_accounts')
      .update({ is_active: false })
      .eq('id', account.id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Déconnecté', description: 'Compte LinkedIn dissocié.' });
    setAccount(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Linkedin className="w-5 h-5 text-primary" />
          <span>Connexion LinkedIn</span>
          {account && (
            <Badge variant="secondary" className="ml-2">
              <CheckCircle className="w-3 h-3 mr-1" /> Connecté
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Chargement...
          </div>
        ) : account ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {account.avatar_url && (
                <img
                  src={account.avatar_url}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-medium">{account.account_name ?? 'Compte LinkedIn'}</div>
                {account.account_handle && (
                  <div className="text-xs text-muted-foreground">{account.account_handle}</div>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              <LogOut className="w-4 h-4 mr-1" /> Déconnecter
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Liez votre compte LinkedIn pour synchroniser votre profil et vos futures
              publications.
            </p>
            <Button onClick={handleConnect} disabled={connecting}>
              {connecting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Link2 className="w-4 h-4 mr-2" />
              )}
              Se connecter avec LinkedIn
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedInConnect;