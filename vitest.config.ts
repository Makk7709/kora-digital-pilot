/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // Timeouts CI-friendly. Les tests de production (Perplexity réel) qui
    // nécessitent plus de temps doivent surcharger ces valeurs au cas par
    // cas via `vi.setConfig` ou en ligne de commande.
    testTimeout: 15000,
    hookTimeout: 10000,

    environment: 'jsdom',

    // Inclusion des fichiers de test
    include: [
      'src/test/**/*.test.ts',
      'src/test/**/*.test.tsx', // Ajout support TSX
      'src/**/*.test.ts',
      'src/**/*.test.tsx', // Ajout support TSX
    ],

    // Exclusion des tests de production qui font des appels API réels (heures de
    // run, non-CI-friendly). Lancer manuellement avec `vitest run src/test/production`.
    exclude: ['node_modules/**', 'dist/**', 'src/test/production/**'],

    // Variables d'environnement pour tests.
    // - NODE_ENV indique le mode "test" pour le code applicatif.
    // - VITE_PERPLEXITY_API_KEY est intentionnellement renseigné avec une
    //   valeur factice : il permet à RealBrandIntelligenceService de
    //   s'instancier sans throw. Les appels réseau réels doivent toujours
    //   être mockés au niveau des tests (vi.mock(...)) ; les tests de
    //   production (src/test/production) qui veulent une vraie clé doivent
    //   être lancés via le script `test:production` avec une vraie clé.
    env: {
      NODE_ENV: 'test',
      VITE_PERPLEXITY_API_KEY: 'test-fake-key-not-real',
      VITE_PERPLEXITY_MODEL: 'sonar-pro',
      VITE_CHATGPT_API_KEY: 'sk-test-chatgpt-fake-key',
      VITE_CHATGPT_MODEL: 'gpt-4-turbo',
      VITE_OPENAI_API_KEY: 'sk-test-openai-fake-key',
    },

    // Configuration globale
    globals: true,

    // Reporters compacts par défaut. CI ajoute `--reporter=verbose` si besoin.
    reporters: ['default'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/services/**/*.ts', 'src/lib/**/*.ts', 'src/components/**/*.tsx'],
      exclude: [
        'src/test/**',
        'src/**/*.test.ts',
        'src/**/*.test.tsx', // Exclusion TSX test files
        'src/**/*.spec.ts',
        'node_modules/**',
      ],
      // Realistic thresholds for the quick-wins sprint: lock in the floor we
      // actually have today, ratchet up afterwards (see docs/TECH_DEBT.md).
      thresholds: {
        lines: 30,
        functions: 30,
        branches: 25,
        statements: 30,
      },
    },

    // Pas de retry par défaut : on veut un signal CI déterministe.
    // Les tests qui dépendent d'APIs externes (production tests) peuvent
    // surcharger ce comportement avec `vi.setConfig({ retry: N })`.
    retry: 0,

    setupFiles: ['./src/test/setup.ts'],
  },

  define: {
    // Variables pour tests
    __TEST_MODE__: true,
  },
});
