import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Link2, LogOut, Loader2, Facebook, Instagram } from 'lucide-react';

type Account = {
  id: string;
  provider: 'facebook' | 'instagram';
  account_name: string | null;
  account_handle: string | null;
  avatar_url: string | null;
};

type Provider = 'facebook' | 'instagram';

const PROVIDERS: {
  id: Provider;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  { id: 'facebook', label: 'Facebook', Icon: Facebook, color: 'text-[#1877F2]' },
  { id: 'instagram', label: 'Instagram', Icon: Instagram, color: 'text-[#E4405F]' },
];

const MetaConnect: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<Provider | null>(null);

  const loadAccounts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('social_accounts')
      .select('id, provider, account_name, account_handle, avatar_url')
      .eq('user_id', user.id)
      .in('provider', ['facebook', 'instagram'])
      .eq('is_active', true);
    if (!error) setAccounts((data ?? []) as Account[]);
    setLoading(false);
  };

  useEffect(() => {
    loadAccounts();
     
  }, [user?.id]);

  const handleConnect = async (provider: Provider) => {
    setConnecting(provider);
    try {
      const state = crypto.randomUUID();
      localStorage.setItem('meta_oauth_state', state);
      localStorage.setItem('meta_oauth_provider', provider);
      const redirectUri = `${window.location.origin}/auth/meta/callback`;
      const { data, error } = await supabase.functions.invoke('meta-oauth-url', {
        body: { redirect_uri: redirectUri, state, provider },
      });
      if (error || !data?.url) {
        throw new Error(error?.message ?? data?.error ?? 'URL manquante');
      }
      window.location.href = data.url as string;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur inconnue';
      toast({ title: 'Erreur', description: msg, variant: 'destructive' });
      setConnecting(null);
    }
  };

  const handleDisconnect = async (account: Account) => {
    const { error } = await supabase
      .from('social_accounts')
      .update({ is_active: false })
      .eq('id', account.id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Déconnecté', description: `Compte ${account.provider} dissocié.` });
    setAccounts((prev) => prev.filter((a) => a.id !== account.id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Facebook className="w-5 h-5 text-primary" />
          <span>Connexion Facebook & Instagram</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Chargement...
          </div>
        ) : (
          PROVIDERS.map(({ id, label, Icon, color }) => {
            const account = accounts.find((a) => a.provider === id);
            return (
              <div
                key={id}
                className="flex items-center justify-between gap-4 rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  {account?.avatar_url ? (
                    <img
                      src={account.avatar_url}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                  )}
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {label}
                      {account && (
                        <Badge variant="secondary">
                          <CheckCircle className="w-3 h-3 mr-1" /> Connecté
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {account
                        ? (account.account_handle ?? account.account_name ?? 'Compte lié')
                        : id === 'instagram'
                          ? 'Compte Business/Creator lié à une Page Facebook requis'
                          : 'Accès à vos Pages et à leurs statistiques'}
                    </div>
                  </div>
                </div>
                {account ? (
                  <Button variant="outline" size="sm" onClick={() => handleDisconnect(account)}>
                    <LogOut className="w-4 h-4 mr-1" /> Déconnecter
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleConnect(id)}
                    disabled={connecting !== null}
                  >
                    {connecting === id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Link2 className="w-4 h-4 mr-2" />
                    )}
                    Se connecter
                  </Button>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default MetaConnect;