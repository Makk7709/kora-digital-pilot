# Wave 10 — Issues complémentaires (scan live SonarCloud)

> Source : capture d'écran d'un scan SonarCloud/SonarQube **live** (non présent
> dans les exports PDF/xlsx du dossier). Ces règles **n'étaient pas** dans
> l'inventaire initial `sonar-issues.jsonl` (801 issues parsées du PDF
> `Kora Sonar.pdf`).

## Vérification des 7 règles signalées

| Règle | Titre | Verdict sur le code Kora actuel | Action |
|-------|-------|----------------------------------|--------|
| `S2871` | `sort()`/`toSorted()` doit avoir un comparateur | **RÉEL** (CRITICAL) — `Dashboard.tsx:98` triait un tableau **numérique** avec `.sort()` (ordre lexicographique → `10` avant `3`) | Corrigé |
| `S6959` | `reduce()` doit avoir une valeur initiale | **RÉEL** — `Dashboard.tsx:141` (`bestPlatform`) | Corrigé |
| `S5254` | `<html>` doit avoir un attribut `lang` | **RÉEL** — `public/api/linkedin/posts/index.html` (mock proxy) | Corrigé |
| `S5850` | Alternances ancrées doivent être groupées | **RÉEL ×2** — `compression.ts:40`, `export-orchestrator.ts:335` (patterns trim) | Corrigé |
| `S1082` | Événements souris ↔ clavier | **RÉEL ×4** — `Card`/`Badge` cliquables (rendent un `<div>`) sans gestion clavier | Corrigé |
| `S3923` | Branches conditionnelles identiques | **RÉEL ×2** — `Dashboard.tsx` (`case 'LinkedIn'` = `default`), `Index.tsx` (`case 'dashboard'` = `default`) | Corrigé |
| `S6544` | Promesses mal utilisées | **RÉEL ×1** — `useLinkedInAnalytics.ts` (`setTimeout(async …)` en position `void`) | Corrigé |

> Les regex de test `/^(a|b|c)$/` (ex. `real-brand-intelligence-tdd.test.tsx`)
> sont **déjà groupées** → pas de violation S5850. `index.html` et
> `diagnostic-simple.html` ont **déjà** un attribut `lang` → pas de violation
> S5254 sur ces fichiers.

## Détail des corrections

### S2871 — tri numérique (vrai bug)

```diff
-  ].sort();
+  ].sort((a, b) => a - b);
```

`timeOffsets` (valeurs 1→10) était trié lexicographiquement puis indexé pour
`formatTimeAgo(timeOffsets[index])`. Le tri par défaut plaçait `10` avant `3`.

### S6959 — valeur initiale de reduce

```diff
-  const bestPlatform = platforms.reduce((best, current) =>
-    current.engagement > best.engagement ? current : best,
-  );
+  const bestPlatform = platforms.reduce(
+    (best, current) => (current.engagement > best.engagement ? current : best),
+    platforms[0],
+  );
```

### S5254 — attribut lang

```diff
-<html>
+<html lang="en">
```

### S5850 — groupement des alternances ancrées

```diff
-compressed.replace(/^\s+|\s+$/gm, '');
+compressed.replace(/(?:^\s+)|(?:\s+$)/gm, '');

-.replace(/^[^\w]+|[^\w.!?]+$/g, '')
+.replace(/(?:^[^\w]+)|(?:[^\w.!?]+$)/g, '')
```

## Vérifications

```bash
npm run typecheck   # OK
npm run lint        # 0 errors, 382 warnings (inchangé)
npx vitest run      # 134 passed, 273 skipped, 0 failed
npm run build       # OK
```

> **Bilan final** : les 7 règles du scan live ont été vérifiées sur le code réel.
> 4 corrigées au premier passage (S2871, S6959, S5254, S5850), 3 corrigées
> après recherche exhaustive (S1082, S3923, S6544). 0 issue restante.

### S1082 — événements souris ↔ clavier (4 sites)

Recherche exhaustive (script AST-léger sur tout `src/**/*.tsx`) : aucun élément
natif (`div`, `span`, …) avec `onClick` sans gestion clavier, mais **4
composants** `Card`/`Badge` (qui rendent un `<div>`) cliquables sans support
clavier :

- `EnhancedBrandMonitoring.tsx` — `<Card>` sélecteur de mode d'analyse
- `CompanyAnalysisWidget.tsx` — `<Card>` mode d'analyse + `<Badge>` historique
- `PerplexityInsights.tsx` — `<Badge>` retrait de la liste de veille

Helper réutilisable ajouté dans `src/lib/utils.ts` :

```typescript
export function handleActivateKey<T extends Element>(onActivate: () => void) {
  return (event: KeyboardEvent<T>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate();
    }
  };
}
```

Chaque site reçoit `role="button"`, `tabIndex={0}` et
`onKeyDown={handleActivateKey(...)}` (pattern WAI-ARIA "button").

### S3923 — branches conditionnelles identiques (2 sites)

Un `case` explicite dupliquait exactement le `default` ; suppression du `case`
redondant (comportement strictement identique via le `default`) :

```diff
// Dashboard.tsx — formatEngagementLabel
   switch (platform) {
-    case 'LinkedIn':
-      return `${engagement} interactions`;
     case 'Instagram':
       return `${engagement} likes`;
     ...
     default:
       return `${engagement} interactions`;
   }

// Index.tsx — renderContent
   switch (activeSection) {
-    case 'dashboard':
-      return <Dashboard onSectionChange={setActiveSection} />;
     case 'cm-dashboard':
       ...
     default:
       return <Dashboard onSectionChange={setActiveSection} />;
   }
```

### S6544 — promesses mal utilisées (1 site)

`setTimeout(async () => {…})` passe une fonction renvoyant `Promise<void>` là
où un retour `void` est attendu (les rejets seraient silencieusement perdus).
Correction par IIFE async explicitement « voidée » :

```diff
-      proxyCheckIntervalRef.current = setTimeout(async () => {
-        const isReady = await checkProxyHealth();
-        ...
-      }, interval);
+      proxyCheckIntervalRef.current = setTimeout(() => {
+        void (async () => {
+          const isReady = await checkProxyHealth();
+          ...
+        })();
+      }, interval);
```

> Les `.then()` sans `.catch()` restants (`App.tsx` via `React.lazy`,
> `LinkedInAuth.tsx`, `server-detection.ts`) relèvent de la règle distincte
> *floating promises* et non de S6544 (mauvais usage en position `void`/condition).

## Audit hostile (post-correction)

Script de re-scan sur tout `src/` :

```
S1082 restants : 0
S3923 restants : 0
S6544 (setTimeout/setInterval async) : 0
```
