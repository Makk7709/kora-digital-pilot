/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // Configuration pour tests production avec APIs réelles
    testTimeout: 120000, // 2 minutes timeout global
    hookTimeout: 30000,
    
    // Environnement
    environment: 'jsdom', // Changé pour supporter React/JSX
    
    // Inclusion des fichiers de test
    include: [
      'src/test/**/*.test.ts',
      'src/test/**/*.test.tsx', // Ajout support TSX
      'src/**/*.test.ts',
      'src/**/*.test.tsx' // Ajout support TSX
    ],
    
    // Variables d'environnement pour tests
    env: {
      NODE_ENV: 'test'
    },
    
    // Configuration globale
    globals: true,
    
    // Reporters pour CI/CD et développement
    reporters: ['verbose', 'json'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/services/**/*.ts',
        'src/lib/**/*.ts',
        'src/components/**/*.tsx'
      ],
      exclude: [
        'src/test/**',
        'src/**/*.test.ts',
        'src/**/*.test.tsx', // Exclusion TSX test files
        'src/**/*.spec.ts',
        'node_modules/**'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    
    // Retry pour tests avec APIs externes
    retry: 2,
    
    // Setup files
    setupFiles: [
      './src/test/setup.ts'
    ]
  },
  
  define: {
    // Variables pour tests
    __TEST_MODE__: true
  }
}) 