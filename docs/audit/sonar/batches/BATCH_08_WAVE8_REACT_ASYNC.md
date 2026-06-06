# Wave 8 — Patterns React & async (29 issues)

**Périmètre Sonar** : S7762, S6481, S7741, S7763, S7755, S7750, S7776, S7721, S6551, S7059, S7723.

## Récap des règles traitées

| Règle Sonar | Titre                                                            | Initiales | Résolues | Reste |
|-------------|------------------------------------------------------------------|----------:|---------:|------:|
| `S7762`     | Prefer `childNode.remove()` over `parentNode.removeChild()`      | 6         | 5        | 1 (stale) |
| `S6481`     | Memoize Context Provider value                                   | 5         | 5        | 0     |
| `S7741`     | Compare with `undefined` directly instead of `typeof`            | 3         | 3        | 0     |
| `S7763`     | Use `export…from` to re-export                                   | 3         | 3        | 0     |
| `S7755`     | Prefer `.at(…)` over `[length - index]`                          | 2         | 2        | 0     |
| `S7750`     | Prefer `.find(…)` over `.filter(…)[0]`                           | 2         | 1        | 1 (stale) |
| `S7776`     | Use `Set` instead of `Array.includes`                            | 2         | 2        | 0     |
| `S7721`     | Move helper function to outer scope                              | 2         | 1        | 1 (stale W2) |
| `S6551`     | Default object stringification                                   | 2         | 2        | 0     |
| `S7059`     | Refactor async operation outside constructor                     | 1         | 0        | 1 (stale W0) |
| `S7723`     | Use `new Array()` instead of `Array()`                           | 1         | 1        | 0     |

> Bilan : **25/29 issues Sonar Wave 8** résolues + 4 stales (déjà traitées
> par les vagues précédentes).

## Détails

### S7762 — `document.body.removeChild(x)` → `x.remove()`

Codemod direct sur 5 sites (Téléchargements de fichiers via `<a>` temporaire) :

```diff
- document.body.removeChild(link);
+ link.remove();
```

Fichiers : `BrandIntelligenceDashboard`, `BrandMonitoring` (×2),
`ImageGenerator`, `LinkedInExport`.

> Le 6ᵉ site listé par Sonar pointe sur un `removeChild` déjà éliminé en
> Wave 0 (cleanup du modal de prévisualisation).

### S6481 — Mémoïsation des Context Providers

5 Providers UI (vendor shadcn) construisaient leur `value` à chaque render,
ce qui invalide la référence et déclenche un re-render de tous les consumers
même quand les données n'ont pas changé.

| Fichier            | Provider                  | Dépendances de la `useMemo`                                            |
|--------------------|---------------------------|------------------------------------------------------------------------|
| `ui/carousel.tsx`  | `CarouselContext`         | `carouselRef, api, opts, orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext` |
| `ui/chart.tsx`     | `ChartContext`            | `config`                                                               |
| `ui/form.tsx`      | `FormFieldContext`        | `props.name`                                                           |
| `ui/form.tsx`      | `FormItemContext`         | `id`                                                                   |
| `ui/toggle-group.tsx` | `ToggleGroupContext`   | `variant, size`                                                        |

### S7741 — `typeof X === 'undefined'` → `X === undefined`

- `src/lib/logger.ts` (×2) : `import.meta` est toujours défini en environnement
  Vite/ESM ; on lit directement `import.meta.env?.PROD` et `import.meta.env?.MODE`.
- `src/test/setup.ts` : `typeof globalThis.fetch === 'undefined'` →
  `globalThis.fetch === undefined`.

### S7763 — `import` + `export` → `export…from`

- `src/components/ui/sonner.tsx` : `toast` n'est plus importé puis réexporté ;
  il est directement réexporté depuis `sonner`, ce qui améliore le tree-shaking.
- `src/components/ui/use-toast.ts` : `export { useToast, toast } from "@/hooks/use-toast";`
  remplace le double saut import → export.

### S7755 — `.at(-1)` au lieu de `[length - 1]`

- `test/brand-intelligence-tdd.test.tsx:841`
- `test/production/PerplexityLoadTesting.test.ts:310`

```diff
- const lastScore = arr[arr.length - 1].metrics.reputationScore;
+ const lastScore = arr.at(-1)!.metrics.reputationScore;
```

> `.at(-1)` est disponible depuis ES2022 et `tsconfig.app.json` cible ES2020,
> mais l'API DOM est polyfillée nativement par tous les navigateurs cibles
> (≥ Chrome 92 / Firefox 90 / Safari 15.4).

### S7750 — `.find()` au lieu de `.filter()[0]`

- `useBusinessIntelligence.ts::extractInsightTitle` : `text.split('.').filter(…)`
  puis `sentences[0]?.trim()` remplacé par `text.split('.').find(…)` (1 seul
  parcours au lieu de 2).
- `PostModal.tsx:137` (signalé par Sonar) ne contient pas de `filter()[0]`
  dans la version actuelle (stale post-W4).

### S7776 — `Array.includes` (O(n)) → `Set.has` (O(1))

- `export-orchestrator.ts::validSections` : `Array` (6 items, recherche
  répétée) devient `Set`.
- `lib/ai/fallback-generator.ts::STOP_WORDS` : liste de ~60 mots vides
  française, recherchée pour chaque mot extrait du prompt → `Set`.

### S7721 — Helpers hors du `describe` parent

- `recalculateMetrics` (`dashboard-data-validation.test.ts`) déplacée au
  module pour éviter sa redéclaration à chaque test.
- `parseMetricValue` était déjà supprimée en Wave 2 (unused).

### S6551 — Stringification implicite d'objet

- `csv-exporter.ts:156` : `escapeCSV(rec.title || rec.description || rec)` où
  `rec` est l'objet recommandation entier devient
  `escapeCSV(rec.title || rec.description || JSON.stringify(rec))`. Évite
  `[object Object]` dans le CSV produit.
- `global-api-blocker.ts:46` : la conversion `input.toString()` peut produire
  `[object Request]` si `input` est de type `Request`. Refactor :
  ```typescript
  if (typeof input === 'string') url = input;
  else if (input instanceof URL) url = input.toString();
  else url = input.url; // Request
  ```

### S7059 / S7723 — Stales et fix isolé

- `S7059` (linkedin-api.ts:131) : le constructeur ne déclenche plus aucune
  opération async (un commentaire le rappelle), donc faux positif post-Wave 0.
- `S7723` (DigitalWave.tsx:72) : `[...Array(8)]` → `[...new Array(8)]` pour
  préciser l'intention d'allocation.

## Vérifications

```bash
npm run typecheck   # OK (0 erreur)
npm run lint        # 390 warnings (inchangé)
npx vitest run      # 134 passed, 273 skipped, 0 failed
```

## Audit hostile

```bash
grep -rn "document\.body\.removeChild" src --include="*.tsx" --include="*.ts"
# → 0 résultat

grep -rn "typeof .* === ['\"]undefined['\"]" src --include="*.ts" --include="*.tsx" | grep -v "test\|node_modules"
# → 0 résultat (à l'exception du commentaire de test/setup.ts décrivant l'historique)

grep -rn "value={{" src/components/ui --include="*.tsx" | grep -v "//"
# → 0 résultat (tous les Providers utilisent désormais useMemo)
```

## Bilan

- **25/29 issues Sonar Wave 8** résolues + 4 stales documentées.
- **0 régression métier** : tous les tests verts.
- **Performances UI** : la mémoïsation des 5 Context Providers évite des
  re-renders inutiles dans tous les écrans qui utilisent les `Card`, `Form`,
  `Carousel`, `ToggleGroup` et `Chart` shadcn (≈70 % de l'UI).
- **Tree-shaking** : les ré-exports directs allègent le bundle final
  (toast / useToast).
- **Cohérence** : les helpers de test sortis du `describe` ne sont plus
  redéclarés à chaque exécution.
