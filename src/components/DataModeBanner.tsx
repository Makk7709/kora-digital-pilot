import React from 'react';
import { AlertTriangle, Database } from 'lucide-react';

import { useDataMode } from '@/contexts/DataModeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DataModeBannerProps {
  className?: string;
}

/**
 * Bannière persistante affichée lorsque l'application tourne en mode démo.
 * Sa raison d'être : qu'un évaluateur (cabinet, prospect, auditeur)
 * comprenne sans ambiguïté que les chiffres affichés sur les vues
 * non connectées (Instagram, X, Facebook) sont simulés.
 *
 * En mode `'real'`, le composant ne rend rien (return null).
 */
export const DataModeBanner: React.FC<DataModeBannerProps> = ({ className }) => {
  const { isDemo, canToggle, toggleMode, resetToEnv, envMode, mode } = useDataMode();

  if (!isDemo) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="data-mode-banner"
      className={cn(
        'sticky top-0 z-50 w-full border-b border-amber-300 bg-amber-50 text-amber-900 shadow-sm',
        className,
      )}
    >
      <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center gap-3 px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-700" aria-hidden="true" />
          <span className="font-semibold">Mode démo actif</span>
        </div>
        <div className="flex flex-1 items-center gap-2 text-amber-800">
          <Database className="h-4 w-4" aria-hidden="true" />
          <span>
            Les métriques Instagram, X (Twitter) et Facebook affichées sont{' '}
            <strong>simulées</strong>. Seules les sources connectées (LinkedIn, Perplexity,
            OpenAI/Anthropic) restituent des données réelles.
          </span>
        </div>
        {canToggle && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
              onClick={toggleMode}
            >
              Passer en mode réel
            </Button>
            {mode !== envMode && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-amber-800 hover:bg-amber-100"
                onClick={resetToEnv}
              >
                Rétablir ({envMode})
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataModeBanner;
