/**
 * Mode de données globalement appliqué à l'application :
 *  - `'real'` : par défaut. Les composants doivent récupérer leurs métriques
 *    via une source réelle (LinkedIn API, Perplexity, OpenAI, Anthropic).
 *    Si la source n'est pas connectée, ils doivent afficher un `EmptyState`
 *    plutôt que des données simulées.
 *  - `'demo'` : explicitement activé via `VITE_DATA_MODE=demo` (`.env.example`)
 *    ou via le toggle développeur (`DataModeContext`). Les composants peuvent
 *    alors consommer `src/lib/demo-data.ts` à condition d'afficher la bannière
 *    `DataModeBanner` et un badge « Données simulées » à proximité.
 */

export type DataMode = 'demo' | 'real';

const DEMO_MODE_STORAGE_KEY = 'kora_data_mode_override';
const VALID_MODES: readonly DataMode[] = ['demo', 'real'];

const isDataMode = (value: unknown): value is DataMode =>
  typeof value === 'string' && (VALID_MODES as readonly string[]).includes(value);

/**
 * Mode dérivé des variables d'environnement Vite (immutable au runtime).
 * Fallback : `'real'` (politique « pas de chiffre maquillé par défaut »).
 */
export const getEnvDataMode = (): DataMode => {
  const raw = (import.meta.env?.VITE_DATA_MODE ?? '').toString().toLowerCase();
  return isDataMode(raw) ? raw : 'real';
};

/**
 * Lit un éventuel override local (utile pour les démonstrations live sans
 * redéployer). N'est consulté qu'en environnement DEV pour éviter qu'un
 * utilisateur de production puisse forcer le mode démo via la console.
 */
const readLocalOverride = (): DataMode | null => {
  if (!import.meta.env?.DEV) return null;
  if (typeof globalThis === 'undefined') return null;
  try {
    const stored = globalThis.localStorage.getItem(DEMO_MODE_STORAGE_KEY);
    return isDataMode(stored) ? stored : null;
  } catch {
    return null;
  }
};

export const getDataMode = (): DataMode => readLocalOverride() ?? getEnvDataMode();

export const isDemoMode = (): boolean => getDataMode() === 'demo';

export const isRealMode = (): boolean => getDataMode() === 'real';

/**
 * Sert au toggle développeur exposé dans `DataModeContext`. Refuse
 * silencieusement en production (la valeur d'environnement reste seule
 * source de vérité).
 */
export const setDataModeOverride = (mode: DataMode | null): void => {
  if (!import.meta.env?.DEV) return;
  if (typeof globalThis === 'undefined') return;
  try {
    if (mode === null) {
      globalThis.localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
    } else if (isDataMode(mode)) {
      globalThis.localStorage.setItem(DEMO_MODE_STORAGE_KEY, mode);
    }
  } catch {
    // localStorage indisponible (mode navigation privée stricte) : on ignore.
  }
};

export const DATA_MODE_STORAGE_KEY = DEMO_MODE_STORAGE_KEY;
