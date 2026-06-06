# Wave 9 — APIs dépréciées (9 issues)

**Périmètre Sonar** : S1874 uniquement.

## Récap

| Règle Sonar | Titre                                                       | Issues | Résolues |
|-------------|-------------------------------------------------------------|-------:|---------:|
| `S1874`     | `String.prototype.substr` est déprécié — utiliser `slice` ou `substring` | 9 | 9 |

## Détails

Toutes les occurrences signalées par Sonar suivent le pattern de génération
d'identifiants aléatoires :

```typescript
Math.random().toString(36).substr(2, 9);
```

`String.prototype.substr` est marqué deprecated dans la spécification MDN.
Conversion appliquée en utilisant `.slice(start, end)` :

| Pattern initial            | Remplacement       | Sites                                                |
|----------------------------|--------------------|------------------------------------------------------|
| `.substr(2, 9)`            | `.slice(2, 11)`    | CommunityManagerDashboard (×2), usePerplexity, parsers, report-generator |
| `.substr(2, 6)`            | `.slice(2, 8)`     | pdf-exporter, pdf/cover                              |
| `.substr(2, 5)`            | `.slice(2, 7)`     | ReportGenerationService                              |
| `.substr(2)`               | `.slice(2)`        | planning-service                                     |

> Le comportement est strictement équivalent : `substr(start, length)` et
> `slice(start, start + length)` renvoient la même sous-chaîne pour `start ≥ 0`.

## Codemod

Inline Python dans `wave9-codemod.py` (ou à reproduire au besoin) :

```python
import re
def repl(m):
    start = int(m.group(1))
    length = m.group(2)
    if length is None:
        return f".slice({start})"
    end = start + int(length)
    return f".slice({start}, {end})"

src = re.sub(r"\.substr\((\d+)(?:,\s*(\d+))?\)", repl, src)
```

## Vérifications

```bash
npm run typecheck   # OK (0 erreur)
npm run lint        # 390 warnings (inchangé)
npx vitest run      # 134 passed, 273 skipped, 0 failed
grep -rn "\.substr(" src --include="*.ts" --include="*.tsx"  # → 0 résultat
```

## Bilan

- **9/9 issues Sonar Wave 9** résolues, **0 régression**.
- Tous les identifiants aléatoires (alertes, rapports, références PDF, etc.)
  utilisent désormais une API non-dépréciée.
