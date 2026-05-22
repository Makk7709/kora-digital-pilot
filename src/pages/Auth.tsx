import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignIn from '@/components/auth/SignIn';
import SignUp from '@/components/auth/SignUp';
import { useAuth } from '@/contexts/AuthContext';

interface LocationState {
  from?: string;
}

const Auth: React.FC = () => {
  const { isAuthenticated, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? null) as LocationState | null;
  const redirectTo = state?.from && state.from !== '/auth' ? state.from : '/app';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

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
