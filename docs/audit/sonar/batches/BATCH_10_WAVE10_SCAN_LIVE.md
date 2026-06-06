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
| `S1082` | Événements souris ↔ clavier | **Non localisable** sans le rapport (heuristique grep → 0 candidat évident) | À confirmer |
| `S3923` | Branches conditionnelles identiques | **Non localisable** sans le rapport (heuristique grep → 0 candidat) | À confirmer |
| `S6544` | Promesses mal utilisées | **Non localisable** sans le rapport (nécessite l'analyse de flux Sonar) | À confirmer |

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

## Reste à traiter

`S1082`, `S3923`, `S6544` : transmettre l'export complet du scan live
(fichier + ligne) pour un traitement ciblé. Les corrections « à l'aveugle »
sont volontairement évitées pour ne pas modifier le mauvais emplacement.
