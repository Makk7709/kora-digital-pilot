import React from 'react';
import { WifiOff, Plug } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  platform?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  onConnect?: () => void;
  className?: string;
}

/**
 * Bloc générique « Non connecté » affiché à la place de métriques simulées
 * lorsque l'application tourne en mode réel et qu'aucune source n'est
 * branchée pour la plateforme demandée. Volontairement neutre et sobre.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  platform,
  title,
  description,
  ctaLabel = 'Configurer la connexion',
  onConnect,
  className,
}) => {
  const resolvedTitle = title ?? (platform ? `${platform} non connecté` : 'Source non connectée');
  const resolvedDescription =
    description ??
    (platform
      ? `Aucune source de données réelle n'est branchée pour ${platform}. Connectez l'API pour afficher des métriques.`
      : "Aucune source de données réelle n'est branchée. Connectez une API pour afficher des métriques.");

  return (
    <Card
      data-testid="empty-state"
      data-platform={platform}
      className={cn('border-dashed border-slate-300 bg-slate-50/50', className)}
    >
      <CardContent className="flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <WifiOff className="h-6 w-6 text-slate-400" aria-hidden="true" />
        </div>
        <Badge variant="outline" className="border-slate-300 bg-white text-slate-600">
          Aucune donnée réelle
        </Badge>
        <h4 className="text-sm font-semibold text-slate-900">{resolvedTitle}</h4>
        <p className="max-w-md text-sm text-slate-500">{resolvedDescription}</p>
        {onConnect && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-1 border-slate-300 text-slate-700 hover:bg-slate-100"
            onClick={onConnect}
          >
            <Plug className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
            {ctaLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
