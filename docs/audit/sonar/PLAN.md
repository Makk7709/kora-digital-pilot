# Plan de remédiation Sonar — 802 issues

> **Source** : `Kora Sonar.pdf` (export SonarQube/SonarCloud, 61 pages, 802 issues)
> **Branche pilote** : `chore/sonar-cleanup-wave0`
> **Inventaire structuré** : `sonar-issues.jsonl` (1 ligne JSON par issue : `rule`, `title`, `severity`, `file`, `line`, `message`)

## 1. Inventaire global

| Sévérité   | Nombre |
|------------|-------:|
| BLOCKER    |      1 |
| CRITICAL   |     14 |
| MAJOR      |    311 |
| MINOR      |    441 |
| INFO       |     35 |
| **Total**  | **802** |

- **125 fichiers** concernés
- **57 règles** TypeScript distinctes (top 5 : `S7773`×108, `S7764`×83, `S3358`×70, `S6594`×69, `S6479`×50)
- **Top 5 fichiers** : `services/core/BrandAnalysisCore.ts` (44), `services/brand/real/extractors.ts` (42), `services/brand/DataAggregationService.ts` (38), `services/export/formats/excel-exporter.ts` (27), `services/brand/parsers.ts` (25)

## 2. Méthode de traitement

Chaque paquet suit un cycle reproductible :

1. **Cartographie** — extraction des issues du paquet depuis `sonar-issues.jsonl`
2. **Correction** — application des fixes (mécaniques ou refactor)
3. **Vérification automatique** — `npm run lint`, `npm run typecheck`, tests ciblés
4. **Audit hostile** — relecture critique : pas de régression, fix conforme à la règle Sonar, pas de simplification artificielle
5. **Documentation** — fiche `docs/audit/sonar/batches/BATCH_XX_<règle>.md` détaillant fichiers touchés, diff résumé, contre-exemples
6. **Commit** — message normé `fix(sonar): WAVE-X BATCH-XX <règle> (n issues)`

Une **passe finale** à la fin de chaque wave relance la suite complète : `npm run check` + revue diff agrégé + comparaison avec l'inventaire restant.

## 3. Découpage en waves thématiques

### WAVE 0 — Sévérités élevées (15 issues, prioritaire)
1 BLOCKER + 14 CRITICAL traités individuellement avec test ciblé. Voir `BATCH_00_BLOCKER_CRITICAL.md`.

### WAVE 1 — APIs natives & globals (201 issues, mécaniques)
| Règle | N | Description |
|-------|---:|-------------|
| S7773 | 108 | `Number.parseInt`/`parseFloat` au lieu des globaux |
| S7764 | 83 | `globalThis` au lieu de `window`/`self`/`global` |
| S7748 | 6 | Pas de décimales/zéros inutiles |
| S7772 | 2 | Imports Node avec préfixe `node:` |
| S7781 | 1 | `String.replaceAll` au lieu de `replace(/g/)` |
| S7759 | 1 | `Date.now()` au lieu de `new Date().getTime()` |

### WAVE 2 — Imports & dead code (88 issues)
| Règle | N | Description |
|-------|---:|-------------|
| S1135 | 35 | Suivi explicite des `TODO` |
| S1128 | 29 | Imports inutilisés |
| S1854 | 19 | Affectations mortes |
| S4165 | 3 | Affectations redondantes |
| S125  | 2 | Code commenté |

### WAVE 3 — Modernisation regex (117 issues)
| Règle | N | Description |
|-------|---:|-------------|
| S6594 | 69 | `RegExp.exec()` au lieu de `String.match()` |
| S5869 | 16 | Caractères dupliqués dans classes |
| S6397 | 11 | Classes à un seul caractère |
| S5843 | 9 | Regex trop complexes |
| S7780 | 9 | `String.raw` pour backslashes |
| S6535 | 3 | Échappements inutiles |

### WAVE 4 — Refactoring qualité (213 issues)
| Règle | N | Description |
|-------|---:|-------------|
| S3358 | 70 | Ternaires imbriqués (extraire) |
| S6479 | 50 | Clés JSX = index tableau |
| S7778 | 43 | Appels consécutifs à fusionner |
| S6478 | 20 | Composants React imbriqués |
| S3776 | 11 | Complexité cognitive |
| S6582 | 10 | Optional chaining |
| S7735 | 8 | Conditions négatives + `else` |
| S2004 | 1 | Imbrication > 4 niveaux |

### WAVE 5 — Types & immutabilité (76 issues)
| Règle | N | Description |
|-------|---:|-------------|
| S2933 | 31 | Champs `readonly` |
| S4325 | 26 | Casts redondants |
| S4323 | 7 | Type aliases manquants |
| S6571 | 5 | Constituents redondants |
| S6754 | 4 | Destructurer `useState` |
| S4624 | 2 | Template literals imbriqués |
| S6564 | 1 | Type alias redondant |

### WAVE 6 — Erreurs & contrats (25 issues)
| Règle | N | Description |
|-------|---:|-------------|
| S2486 | 15 | Exceptions ignorées |
| S4043 | 7 | Méthodes mutantes utilisées trompeusement |
| S3735 | 1 | Usage de `void` |
| S3516 | 1 | Retour invariant |
| S4144 | 1 | Fonctions identiques |

### WAVE 7 — Accessibilité (44 issues)
| Règle | N | Description |
|-------|---:|-------------|
| S6853 | 30 | Label + control associé |
| S6819 | 6 | Tag HTML > ARIA role |
| S6850 | 2 | Headings avec contenu |
| S6851 | 2 | `alt` non redondant |
| S6767 | 1 | Props PropTypes inutilisées |
| S6772 | 1 | Espacement inline explicite |
| S6747 | 1 | Attribut JSX inconnu |
| S6848 | 1 | Handler interactif sur DOM non interactif |

### WAVE 8 — Patterns React & async (29 issues)
| Règle | N | Description |
|-------|---:|-------------|
| S7762 | 6 | `.remove()` au lieu de `.removeChild()` |
| S6481 | 5 | Identités stables des Providers |
| S7741 | 3 | `typeof === 'undefined'` |
| S7763 | 3 | `export ... from` |
| S7755 | 2 | `.at()` pour index complexes |
| S7750 | 2 | `.find()` au lieu de `.filter()[0]` |
| S7776 | 2 | `Set` pour existence checks |
| S7721 | 2 | Hisser les fonctions |
| S6551 | 2 | `toString()` explicite |
| S7059 | 1 | Pas d'async dans constructor |
| S7723 | 1 | Constructeurs cohérents |

### WAVE 9 — APIs dépréciées (9 issues)
| Règle | N | Description |
|-------|---:|-------------|
| S1874 | 9 | Migration APIs dépréciées |

## 4. Passe finale (après wave 9)

1. Reparser le PDF si l'utilisateur fournit un export post-correction → comparer avec `sonar-issues.jsonl`
2. `npm run check` complet (typecheck + lint + tests + build)
3. Audit hostile global : random sample 30 issues, vérifier qu'elles sont absentes du code actuel
4. Mise à jour `docs/audit/PROJECT_DOCUMENTATION_STANDARD.md` (section dette technique)
5. `git push origin chore/sonar-cleanup-wave0` + ouverture PR

## 5. Reproduction de l'inventaire

```bash
pdftotext -bbox "Kora Sonar.pdf" /tmp/kora-sonar.html
python3 docs/audit/sonar/parse-sonar.py
```
