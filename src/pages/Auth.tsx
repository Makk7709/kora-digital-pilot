import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import SignIn from '@/components/auth/SignIn';
import SignUp from '@/components/auth/SignUp';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DEMO_EMAIL = 'demo@korev.app';
const DEMO_PASSWORD = 'KorevDemo2026!';

interface LocationState {
  from?: string;
}

const Auth: React.FC = () => {
  const { isAuthenticated, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? null) as LocationState | null;
  const redirectTo = state?.from && state.from !== '/auth' ? state.from : '/app';

  const { toast } = useToast();
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const enterDemo = async () => {
    setDemoLoading(true);
    try {
      let { error } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });
      if (error) {
        const signUpRes = await supabase.auth.signUp({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { first_name: 'Démo', last_name: 'Korev', company_name: 'Korev' },
          },
        });
        if (signUpRes.error) throw signUpRes.error;
        if (!signUpRes.data.session) {
          const retry = await supabase.auth.signInWithPassword({
            email: DEMO_EMAIL,
            password: DEMO_PASSWORD,
          });
          if (retry.error) throw retry.error;
        }
      }
      navigate(redirectTo, { replace: true });
    } catch (e) {
      toast({
        title: 'Accès démo indisponible',
        description: e instanceof Error ? e.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    } finally {
      setDemoLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border border-slate-200/60 shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">Kora Digital Pilot</CardTitle>
          <CardDescription>
            Connectez-vous ou créez votre organisation pour accéder à la plateforme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="pt-4">
              <SignIn onSuccess={() => navigate(redirectTo, { replace: true })} />
            </TabsContent>
            <TabsContent value="signup" className="pt-4">
              <SignUp onSuccess={() => navigate(redirectTo, { replace: true })} />
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-2">
            <div className="relative text-center">
              <span className="relative z-10 bg-card px-3 text-xs uppercase tracking-widest text-muted-foreground">
                ou
              </span>
              <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={enterDemo}
              disabled={demoLoading}
            >
              {demoLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Entrer en démo (accès direct)
            </Button>
          </div>

          {isDemoMode && (
            <p className="mt-6 text-center text-xs text-amber-700">
              Mode démo actif. Aucun backend Supabase configuré : la connexion ouvre une
              session locale en mémoire.
            </p>
          )}

          <p className="mt-6 text-center text-xs text-slate-500">
            <Link to="/" className="hover:underline">
              ← Retour à la landing
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
