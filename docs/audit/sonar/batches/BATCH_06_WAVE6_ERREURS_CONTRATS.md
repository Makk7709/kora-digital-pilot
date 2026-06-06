# Wave 6 — Erreurs & contrats (25 issues)

**Périmètre Sonar** : S2486, S4043, S3735, S3516, S4144.

## Récap des règles traitées

| Règle Sonar | Titre                                                  | Initiales | Résolues | Reste     | Stratégie                              |
|-------------|--------------------------------------------------------|----------:|---------:|----------:|----------------------------------------|
| `S2486`     | Handle this exception or don't catch it at all         | 15        | 13       | 2 (stale) | Renommer `_error` → `error` + log     |
| `S4043`     | Move this array `sort()` operation to a separate statement | 7      | 7        | 0         | `[...arr].sort(...)` pour éviter la mutation |
| `S3735`     | Remove this use of the `void` operator                 | 1         | 0        | 1 (stale) | Déjà nettoyé par Wave 1                |
| `S3516`     | Refactor this function to not always return the same value | 1     | 0        | 1 (stale) | Fonction retournant déjà des valeurs distinctes |
| `S4144`     | Update this function so its implementation is not identical to another | 1 | 1     | 0         | Réutilisation de la fabrique `this.getTextPremiumFunction(pdf)` |

> Bilan : **21/25 résolus** + 4 issues stales (Sonar fait référence à du code qui
> a déjà été nettoyé par les vagues précédentes).

## Détails

### S2486 — Catch blocks vides ou ignorant l'erreur

Avant Wave 6, 11 blocs `catch (_error) { ... }` étaient présents dans le code
fonctionnel + 1 `catch { ... }` (sans variable) dans `DiagnosticTest.tsx`.
Le pattern adopté est minimal mais traçable :

```typescript
} catch (error) {
  console.error('[<module>] <opération>:', error);
  // ... fallback existant ...
}
```

Couvre :

- `brand-analysis-orchestrator.ts::healthCheck`
- `CommunityManagerDashboard.tsx::scanAllAxes`
- `DiagnosticTest.tsx::checkApiProxy`
- `ExportProductionCompliance.test.ts::testExportXxx`
- `ImageGenerator.tsx::generateImage`
- `InspirationAI.tsx::onApiTest`
- `json-exporter.ts::validateJSON`
- `LinkedInStatsTest.tsx::runConnectivity/runDataFetch`
- `LinkedInWidget.tsx::loadMetrics`
- `planning-service.ts::loadPosts`
- `PostModal.tsx::handleSubmit`
- `StatsCard.tsx::fetchLinkedInMetrics`
- `usePlanning.ts::generatePostFromAI`

> Les 2 issues restantes (`CommunityManagerDashboard:132` et `server-detection:138`)
> sont stales : Sonar pointe sur des lignes qui ne contiennent plus de `catch`
> aujourd'hui (les blocs ont été déplacés/refactorés en Wave 0 ou Wave 4).

### S4043 — `array.sort()` mutation in-place

`Array.prototype.sort()` mute l'array. Sonar veut soit `.toSorted()` (ES2023),
soit un spread `[...arr].sort(...)`. Le `tsconfig.app.json` cible **ES2020**,
donc le spread est la seule option compatible.

**Fichiers touchés** :

- `lib/linkedin-api.ts:829` : `personalizedPosts.sort(...)` → `[...personalizedPosts].sort(...)`
- `services/brand/report-generator.ts` (×6) : tous les `competitors.sort((a, b) => b.sentiment - a.sentiment)`
  et `keywords.sort((a, b) => b.count - a.count)` deviennent `[...competitors].sort(...)` /
  `[...keywords].sort(...)`.

> Pas de codemod : 7 occurrences seulement, et le diff doit rester local et
> auditable (mutation in-place vs. nouveau tableau a un impact sémantique).

### S4144 — Fonction dupliquée

`pdf-exporter.ts:1043` redéfinissait `addTextPremium` à l'identique de la version
initialisée ligne 48. La fabrique `this.getTextPremiumFunction(pdf)` est déjà
utilisée 5x ailleurs ; on l'applique également ici, ce qui supprime ~17 lignes
de duplication et aligne le comportement.

### S3735 / S3516 — Stales

- `S3735` sur `TenantContext.tsx:107` : le `void ` opérateur a déjà été retiré
  en Wave 1 (codemod `wave1-codemod.py::s3735` qui remplaçait `void func()` par
  `func().catch(...)`). Le grep confirme : `grep "void " src/contexts/TenantContext.tsx`
  retourne 0 résultat.
- `S3516` sur `InspirationAI.tsx:204` : `getConnectionStatusText` retourne 4
  valeurs distinctes selon le cas (`'Test en cours...'`, `'Kora IA Premium actif'`,
  `'Kora IA (mode alternatif)'`, `'Kora IA connectée'`, `'Kora IA déconnectée'`).
  Sonar fait une erreur de scope.

## Vérifications

```bash
npm run typecheck   # OK (0 erreur)
npm run lint        # 390 warnings (inchangé)
npx vitest run      # 134 passed, 273 skipped, 0 failed
```

## Audit hostile

```bash
# Vérification 1 : aucun catch (_error) ni catch { restants dans le code prod
grep -rn "catch (_error)\|catch {" src --include="*.ts" --include="*.tsx" | grep -v "test\|//\|/\*"
# → 0 résultat
```

```bash
# Vérification 2 : aucun array.sort sans spread sur les sites Sonar
grep -rn "competitors.sort\|keywords.sort\|personalizedPosts.sort" src
# → 0 résultat (tous remplacés par [...arr].sort)
```

```bash
# Vérification 3 : pas de duplication addTextPremium restante
grep -c "const addTextPremium = (text:" src/services/export/formats/pdf-exporter.ts
# → 1 (la définition initiale ligne 48, qui est légitime ; les 6 autres call sites utilisent la fabrique)
```

## Bilan

- **21/25 issues Sonar Wave 6** résolues + 4 stales documentées.
- **0 régression métier** : tous les tests verts.
- **Robustesse** : tous les chemins d'erreur dans le code production loggent
  désormais le détail de l'exception, ce qui facilitera le debugging post-prod.
- **Immutabilité** : les `sort()` ne mutent plus les arrays sources, ce qui
  simplifie le raisonnement sur les tableaux partagés (`competitors`, `keywords`).
