/**
 * Wrapper de logging minimal pour Kora.
 *
 * Objectif: fournir une surface stable à substituer aux ~500 appels `console.*`
 * disséminés dans le codebase. Pour le sprint "quick wins" la migration n'est
 * PAS faite (volume trop important); voir TECH_DEBT.md. Toute logique de log
 * NOUVELLE doit utiliser ce module.
 *
 * Comportement:
 * - En production (`import.meta.env.PROD === true`): `debug` et `info` deviennent
 *   no-op. `warn` et `error` continuent de remonter.
 * - En dev: tout est routé vers `console.*` correspondant.
 * - En test: silencieux par défaut (les tests peuvent monkey-patcher).
 *
 * Aucune information sensible (email, token, clé API) ne doit jamais être passée
 * à ce logger. Préférer `{ hasEmail: !!email }` à `{ email }`.
 */

type LogFn = (message: string, ...args: unknown[]) => void;

// S7741 : `import.meta` est toujours défini par Vite/ESM ; on lit directement les flags.
const IS_PROD = Boolean(import.meta.env?.PROD);
const IS_TEST = import.meta.env?.MODE === 'test' || Boolean(import.meta.env?.VITEST);

const noop: LogFn = () => undefined;

const wrap = (fn: LogFn, level: 'debug' | 'info' | 'warn' | 'error'): LogFn => {
  if (IS_TEST) return noop;
  if (IS_PROD && (level === 'debug' || level === 'info')) return noop;
  return fn;
};

export const logger = {
  debug: wrap((...args) => console.debug(...args), 'debug'),
  info: wrap((...args) => console.info(...args), 'info'),
  warn: wrap((...args) => console.warn(...args), 'warn'),
  error: wrap((...args) => console.error(...args), 'error'),
};

export default logger;
