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

const schema = z
  .object({
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Mot de passe ≥ 8 caractères'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirm'],
  });

type FormValues = z.infer<typeof schema>;

export interface SignUpProps {
  onSuccess?: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSuccess }) => {
  const { signUp, isDemoMode } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirm: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setSuccessInfo(null);
    const { error } = await signUp(values.email, values.password);
    if (error) {
      setServerError(error);
      return;
    }
    void logUsage(USAGE_EVENTS.AUTH_SIGNUP_SUCCESS, {
      email_domain: values.email.split('@')[1],
    });
    setSuccessInfo(
      isDemoMode
        ? 'Compte démo actif.'
        : 'Compte créé. Vérifiez votre boîte mail si la confirmation est activée sur le projet Supabase.',
    );
    onSuccess?.();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email professionnel</Label>
        <Input
          id="signup-email"
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
        <Label htmlFor="signup-password">Mot de passe</Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password && (
          <p className="text-sm text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm">Confirmer le mot de passe</Label>
        <Input
          id="signup-confirm"
          type="password"
          autoComplete="new-password"
          {...register('confirm')}
          aria-invalid={Boolean(errors.confirm)}
        />
        {errors.confirm && (
          <p className="text-sm text-red-600" role="alert">
            {errors.confirm.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-red-600" role="alert">
          {serverError}
        </p>
      )}
      {successInfo && <output className="text-sm text-emerald-700 block">{successInfo}</output>}

      {isDemoMode && (
        <p className="text-xs text-amber-700">
          Mode démo actif (Supabase non configuré) — aucun compte réel n&apos;est créé.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Création…
          </>
        ) : (
          'Créer mon compte'
        )}
      </Button>
    </form>
  );
};

export default SignUp;
