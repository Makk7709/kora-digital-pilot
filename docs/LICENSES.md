# Licences

Récapitulatif des licences applicables au projet Kora Digital Pilot et à ses dépendances directes.

## 1. Licence du projet

- **Licence** : MIT.
- **Titulaire** : Korev AI — Kora Digital Pilot.
- **Période** : 2024–2026.
- **Fichier** : `LICENSE` à la racine du dépôt.

## 2. Licences des dépendances directes

Inventaire bâti à partir de `package.json` et des conventions publiques de chaque éditeur. À reconfirmer automatiquement à chaque audit via `npx license-checker --json` (cf. `docs/audit/` lorsque l'artefact est généré).

### 2.1 Dépendances de production

| Dépendance | Version (sélecteur) | Licence |
| --- | --- | --- |
| `@hookform/resolvers` | ^3.9.0 | MIT |
| `@radix-ui/react-*` (accordion, alert-dialog, aspect-ratio, avatar, checkbox, collapsible, context-menu, dialog, dropdown-menu, hover-card, icons, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, slot, switch, tabs, toast, toggle, toggle-group, tooltip) | divers ^1.x / ^2.x | MIT |
| `@tanstack/react-query` | ^5.56.2 | MIT |
| `@types/node-fetch` | ^2.6.12 | MIT |
| `class-variance-authority` | ^0.7.0 | Apache-2.0 |
| `clsx` | ^2.1.1 | MIT |
| `cmdk` | 1.0.0 | MIT |
| `concurrently` | ^9.1.2 | MIT |
| `cors` | ^2.8.5 | MIT |
| `date-fns` | ^3.6.0 | MIT |
| `dotenv` | ^16.5.0 | BSD-2-Clause |
| `embla-carousel-react` | ^8.3.0 | MIT |
| `express` | ^4.21.2 | MIT |
| `input-otp` | ^1.2.4 | MIT |
| `jspdf` | ^3.0.1 | MIT |
| `lucide-react` | ^0.462.0 | ISC |
| `next-themes` | ^0.3.0 | MIT |
| `node-fetch` | ^2.7.0 | MIT |
| `react` | ^18.3.1 | MIT |
| `react-day-picker` | ^8.10.1 | MIT |
| `react-dom` | ^18.3.1 | MIT |
| `react-hook-form` | ^7.53.0 | MIT |
| `react-resizable-panels` | ^2.1.3 | MIT |
| `react-router-dom` | ^6.28.0 | MIT |
| `recharts` | ^2.15.0 | MIT |
| `sonner` | ^1.5.0 | MIT |
| `tailwind-merge` | ^2.5.4 | MIT |
| `tailwindcss-animate` | ^1.0.7 | MIT |
| `vaul` | ^0.9.3 | MIT |
| `zod` | ^3.23.8 | MIT |

### 2.2 Dépendances de développement

| Dépendance | Version (sélecteur) | Licence |
| --- | --- | --- |
| `@eslint/js` | ^9.13.0 | MIT |
| `@tailwindcss/typography` | ^0.5.15 | MIT |
| `@testing-library/jest-dom` | ^6.6.3 | MIT |
| `@testing-library/react` | ^16.3.0 | MIT |
| `@testing-library/user-event` | ^14.6.1 | MIT |
| `@types/node` | ^22.10.1 | MIT |
| `@types/react`, `@types/react-dom` | ^18.3.x | MIT |
| `@vitejs/plugin-react` | ^4.3.3 | MIT |
| `@vitest/coverage-v8` | ^2.1.9 | MIT |
| `@vitest/ui` | ^2.1.9 | MIT |
| `autoprefixer` | ^10.4.20 | MIT |
| `eslint` | ^9.13.0 | MIT |
| `eslint-plugin-react-hooks` | ^5.0.0 | MIT |
| `eslint-plugin-react-refresh` | ^0.4.14 | MIT |
| `globals` | ^15.11.0 | MIT |
| `jsdom` | ^26.1.0 | MIT |
| `postcss` | ^8.4.49 | MIT |
| `tailwindcss` | ^3.4.14 | MIT |
| `typescript` | ~5.6.2 | Apache-2.0 |
| `vite` | ^5.4.10 | MIT |
| `vitest` | ^2.1.9 | MIT |

### 2.3 Synthèse

| Licence | Nombre approximatif | Compatibilité distribution MIT |
| --- | --- | --- |
| MIT | ≈ 55 | Oui |
| Apache-2.0 | 2 (`class-variance-authority`, `typescript`) | Oui |
| BSD-2-Clause | 1 (`dotenv`) | Oui |
| ISC | 1 (`lucide-react`) | Oui |

Aucune dépendance directe identifiée sous licence copyleft forte (GPL/AGPL). Les licences transitives doivent toutefois être contrôlées via l'audit automatique.

## 3. Audit automatique

Pour produire un inventaire exhaustif (dépendances directes et transitives) :

```bash
npx license-checker --json > docs/audit/licenses.json
npx license-checker --summary > docs/audit/licenses-summary.txt
```

Le dossier `docs/audit/` est tenu à jour par le worker code/sécurité.

## 4. Marques et identité

« Korev AI » et « Kora Digital Pilot » sont des dénominations utilisées par Korev AI. Les marques tierces citées (LinkedIn, Perplexity, OpenAI, Anthropic, Instagram, etc.) appartiennent à leurs détenteurs respectifs et sont mentionnées à titre informatif.

---

Dernière mise à jour : 2026-05-21.
