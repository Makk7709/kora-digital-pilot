import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist", "coverage", "dossier-valorisation", "node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Quick-wins sprint: tolerate existing technical debt as warnings.
      // Tightening to "error" is tracked in docs/TECH_DEBT.md.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "no-useless-escape": "warn",
      "prefer-const": "warn",
      "no-var": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  // Config files (Vite / Tailwind / Vitest) can keep loose typings.
  {
    files: ["vite.config.ts", "tailwind.config.ts", "vitest.config.ts", "postcss.config.js"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-console": "off",
    },
  },
  // Allow console.* in tests, scripts and the proxy server.
  {
    files: [
      "src/test/**",
      "src/tests/**",
      "**/*.test.ts",
      "**/*.test.tsx",
      "scripts/**",
      "server.cjs",
    ],
    rules: {
      "no-console": "off",
    },
  },
  // Prettier must come last to disable stylistic ESLint rules.
  prettier
);
