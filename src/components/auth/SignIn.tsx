import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { logUsage, USAGE_EVENTS } from '@/lib/usage-logger';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe ≥ 8 caractères'),
});

type FormValues = z.infer<typeof schema>;

export interface SignInProps {
  onSuccess?: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSuccess }) => {
  const { signIn, isDemoMode } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const { error } = await signIn(values.email, values.password);
    if (error) {
      setServerError(error);
      return;
    }
    void logUsage(USAGE_EVENTS.AUTH_LOGIN_SUCCESS, { email_domain: values.email.split('@')[1] });
    onSuccess?.();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          autoComplete="email"
          {...register('email')}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && (
          <p className="text-sm text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signin-password">Mot de passe</Label>
        <Input
          id="signin-password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password && (
          <p className="text-sm text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-red-600" role="alert">
          {serverError}
        </p>
      )}

      {isDemoMode && (
        <p className="text-xs text-amber-700">
          Mode démo actif (Supabase non configuré) — n&apos;importe quelles informations
          ouvriront une session locale.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Connexion…
          </>
        ) : (
          'Se connecter'
        )}
      </Button>
    </form>
  );
};

export default SignIn;
