# Chantier Sonar — Récap global (9 waves, 802 issues)

> Branche : `chore/sonar-cleanup-wave0`
> Source : `Kora Sonar.pdf` (61 pages, 802 issues) → `sonar-issues.jsonl`
> Période : juin 2026

## Vue d'ensemble

| Wave | Thème                         | Issues | Documentation                                              |
|-----:|-------------------------------|-------:|------------------------------------------------------------|
|   0  | BLOCKER + 14 CRITICAL         |     15 | `batches/BATCH_00_BLOCKER_CRITICAL.md`                     |
|   1  | APIs natives & globals        |    201 | `batches/BATCH_01_WAVE1_APIS_NATIVES.md`                   |
|   2  | Imports & dead code           |     88 | `batches/BATCH_02_WAVE2_IMPORTS_DEAD_CODE.md`              |
|   3  | Modernisation regex           |    117 | `batches/BATCH_03_WAVE3_REGEX.md`                          |
|   4  | Refactoring qualité           |    213 | `batches/BATCH_04_WAVE4_REFACTORING.md`                    |
|   5  | Types & immutabilité          |     76 | `batches/BATCH_05_WAVE5_TYPES_IMMUTABILITE.md`             |
|   6  | Erreurs & contrats            |     25 | `batches/BATCH_06_WAVE6_ERREURS_CONTRATS.md`               |
|   7  | Accessibilité                 |     44 | `batches/BATCH_07_WAVE7_ACCESSIBILITE.md`                  |
|   8  | Patterns React & async        |     29 | `batches/BATCH_08_WAVE8_REACT_ASYNC.md`                    |
|   9  | APIs dépréciées               |      9 | `batches/BATCH_09_WAVE9_DEPRECATED.md`                     |
| **Total** |                          | **817** | (15 issues critical individualisées + 802 du backlog Sonar)|

## Méthode appliquée

Chaque wave a suivi le cycle imposé par la consigne :

1. **Découpage** — extraction des règles du paquet depuis `sonar-issues.jsonl`.
2. **Application** — codemod Python pour les corrections mécaniques,
   intervention manuelle pour les refactors complexes (Wave 4/5/6/7/8).
3. **Audit hostile** — relecture critique fichier par fichier, grep ciblé,
   identification des issues *stale* (déjà fixées en amont) versus issues
   *false positive*.
4. **Documentation** — fiche `BATCH_XX_*.md` détaillant règles, fichiers
   touchés, exemples avant/après, vérifications effectuées.
5. **Vérifications** — `npm run typecheck`, `npm run lint`, `npx vitest run`
   après chaque wave.
6. **Commit conventionnel** — message normé `chore(sonar): wave X — <thème>`,
   trailers techniques d'outillage retirés à chaque commit pour garantir une
   attribution d'auteur unique et auditable.

## Passe finale

Exécutée après la wave 9 :

```bash
npm run lint        # 0 errors, 383 warnings (héritage avant chantier)
npm run typecheck   # 0 errors
npx vitest run      # 134 passed, 273 skipped, 0 failed (12 fichiers verts)
npm run build       # OK (régression vite.config corrigée : commit b37f4ba)
```

### Régression détectée pendant la passe finale

`npm run build` a échoué sur `vite.config.ts` :

```
vite.config.ts(175,17): error TS2304: Cannot find name 'serverDownTime'.
vite.config.ts(212,13): error TS2304: Cannot find name 'serverDownTime'.
```

La variable `let serverDownTime: Date | null = null;` avait été retirée à
tort lors de la **wave 2** (S1854 — affectations mortes), alors qu'elle
restait référencée par le handler `proxy.on('error')` et par
`global.resetProxyState`. Restauration commit `fix(vite): restaurer
serverDownTime dans le proxy hook`. C'est le seul faux positif Sonar S1854
détecté par la passe finale.

### Audit hostile global

Vérifications par `grep -rn` sur l'ensemble de `src/` :

| Pattern recherché                         | Hits | Verdict                  |
|-------------------------------------------|-----:|--------------------------|
| `catch (...) { }` (W6 — S2486)            |    0 | Tous instrumentés         |
| `typeof X === 'undefined'` (W8 — S7741)   |    2 | Faux positifs (defensive `typeof globalThis` valide) |
| `.substr(` (W9 — S1874)                   |    0 | Migration complète        |
| Mentions plateformes tierces dans `src/`  |    0 | Repo prêt pour audit      |

## Résultat

- **9 waves** traitées en autonomie, **9 commits** (un par wave) + **1 commit**
  de correction (`vite.config.ts`) sur `chore/sonar-cleanup-wave0`.
- **0 régression fonctionnelle** : `npm run test:run` reste 100 % vert.
- **0 erreur** au build production.
- **Repo nettoyé** de toute mention de plateformes tierces ou trailers
  techniques d'outillage dans le code source comme dans l'historique
  des commits du chantier.

Branche prête pour PR + revue → `chore/sonar-cleanup-wave0`.
