# Contribuer à Kora Digital Pilot

Merci de votre intérêt pour Kora Digital Pilot. Ce guide décrit le processus de contribution attendu sur le dépôt.

## 1. Environnement de développement

Prérequis et installation : voir [`docs/OPERATIONS.md`](./docs/OPERATIONS.md).

Architecture et conventions du code : voir [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## 2. Workflow

1. Créer une branche depuis `main`. Convention : `feature/<sujet>`, `fix/<sujet>`, `chore/<sujet>`, `docs/<sujet>`, `refactor/<sujet>`.
2. Itérer en commits atomiques au format Conventional Commits (voir section 4).
3. S'assurer que la branche reste à jour avec `main` via rebase plutôt que merge.
4. Ouvrir une pull request en utilisant le gabarit [`.github/pull_request_template.md`](./.github/pull_request_template.md).
5. La pull request doit être revue par au moins un mainteneur avant fusion.

## 3. Critères d'acceptation

Toute pull request doit satisfaire les critères suivants avant fusion :

- `npm run lint` passe sans erreur.
- `npm run test:run` passe sans erreur ; la couverture des nouvelles lignes est tenue (Vitest + V8).
- `npm run build` passe sans erreur.
- Aucune régression visible sur les parcours documentés dans [`docs/DEMO.md`](./docs/DEMO.md).
- Documentation mise à jour : ajout ou modification dans `docs/` quand le changement impacte l'architecture, le modèle de données, la sécurité, l'exploitation ou les fonctionnalités.
- `CHANGELOG.md` mis à jour dans la section `Unreleased`.
- Aucun secret commit en clair. Les nouvelles variables d'environnement sont déclarées dans `.env.local.example`.

## 4. Conventional Commits

Format : `<type>(<scope optionnel>): <description courte impérative>`.

Types autorisés : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Exemples :

```
feat(planning): allow drag-and-drop reordering within a week
fix(linkedin): retry token exchange on transient 5xx
docs(security): document key rotation procedure
refactor(brand-intelligence): split metrics extractor from orchestrator
test(perplexity): cover fallback path when API returns 429
chore(deps): bump vitest to 2.1.10
```

Les commits multi-lignes sont encouragés pour le contexte ; la première ligne reste courte (idéalement < 72 caractères).

## 5. Tests

- Framework : Vitest + Testing Library.
- Emplacement : `src/tests/` (tests métier) et `src/test/` (utilitaires de test) ; cohabitent les tests unitaires et d'intégration.
- Préférer des tests décrivant un comportement (et non une implémentation) ; utiliser `describe` / `it` (`it.only` interdit en commit).
- Pour les hooks et composants : utiliser `@testing-library/react` et éviter les mocks intrusifs lorsqu'un test d'intégration léger est possible.
- Pour les services dépendants de Perplexity / OpenAI / Anthropic : mocker la couche `fetch` ou `node-fetch` à la frontière du service, ne pas appeler les APIs réelles depuis les tests.

## 6. Style et qualité

- TypeScript : éviter `any` ; préférer `unknown` puis narrowing. Les nouveaux modules doivent passer un futur mode strict (cf. `docs/TECH_DEBT.md` pour la trajectoire).
- Composants React : préférer les fonctions et hooks ; respecter la séparation présentation / logique métier.
- Logs : utiliser `src/lib/logger.ts` (centralisé) plutôt que `console.*` direct.
- UI : suivre les primitives shadcn/ui dans `src/components/ui/`, ne pas dupliquer.
- Aucune image lourde, binaire ou hash long n'est versionné directement.

## 7. Documentation

- Documents canoniques : modifier les fichiers existants dans `docs/`.
- Nouveaux documents : ne créer un nouveau fichier que si aucun document existant ne couvre le sujet. Préférer enrichir.
- Documents temporaires (post-mortem, audit ponctuel) : déposer dans `docs/archive/<catégorie>/` avec date d'archivage en en-tête.
- Pas de duplication entre `README.md` racine et `docs/`. Le `README` reste un point d'entrée court qui pointe vers `docs/`.

## 8. Signalement et discussion

- Bugs : utiliser le gabarit [`.github/ISSUE_TEMPLATE/bug_report.md`](./.github/ISSUE_TEMPLATE/bug_report.md).
- Évolutions : utiliser le gabarit [`.github/ISSUE_TEMPLATE/feature_request.md`](./.github/ISSUE_TEMPLATE/feature_request.md).
- Vulnérabilités : pas de signalement public, voir [`SECURITY.md`](./SECURITY.md).

## 9. Licence des contributions

En proposant une contribution sur ce dépôt, vous acceptez que votre code soit distribué sous licence MIT, identique au reste du projet (voir [`LICENSE`](./LICENSE)).
