# Security Remediation Report — Agent 1

| Item | Value |
| --- | --- |
| Date | 2026-05-21 |
| Wave | 1 |
| Branche | `feat/security-hardening` |
| Tag de bascule pré-travail | `pre-agent1-snapshot` |
| Owner | Agent 1 — Sécurité / Secrets / Conformité |
| Scope | Cookie httpOnly, durcissement proxy, bump jspdf, préparation purge historique |

## 1. Résumé exécutif

L'objectif de ce passage est de protéger la valorisation de Kora contre toute décote liée à des secrets compromis ou à un proxy peu durci. Trois axes ont été menés en parallèle :

1. **Vérification résiduelle des secrets** dans l'arborescence : 0 chaîne sensible restante après redaction du dernier identifiant LinkedIn littéral.
2. **Migration des tokens LinkedIn vers un cookie `HttpOnly`** posé et lu par `server.cjs`. Le bundle JS ne manipule plus de tokens d'accès et `localStorage` ne conserve plus que l'état OAuth non sensible.
3. **Durcissement du proxy** (`trust proxy`, logger structuré sans body ni token, erreurs génériques en production, `cookie-parser` monté, CSP révisée) + **bump `jspdf`** pour résoudre les vulnérabilités critiques recensées dans `docs/audit/npm-audit.json`.

La purge réelle de l'historique git via `git filter-repo` n'est **pas exécutée** par Agent 1. Les patterns sont préparés et la procédure est documentée pour le coordinator ; l'utilisateur doit avoir effectué la rotation des 4 clés providers avant que le coordinator ne lance la commande.

## 2. État avant / après

| Volet | Avant | Après |
| --- | --- | --- |
| Scan secrets dans le tree | 1 match (LinkedIn client ID en dur) | 0 match |
| Tokens LinkedIn côté client | `localStorage.setItem('linkedin_access_token', …)` lisible par tout XSS | Cookie `kora_linkedin_session` `HttpOnly` + `SameSite=Lax` + `Secure` (prod), tokens stockés en mémoire serveur |
| Endpoint d'échange OAuth | `/api/linkedin/token` retourne le bundle complet `access_token` + `id_token` au navigateur | `/api/auth/linkedin/session` consomme la réponse côté serveur et ne renvoie qu'un identifiant de session |
| Lecture profil LinkedIn | Le navigateur poste l'access token au proxy `/api/linkedin/profile` | `GET /api/auth/linkedin/me` lit le token côté serveur via le cookie de session |
| Logout LinkedIn | Suppression locale des clés `localStorage` | Appel `POST /api/auth/linkedin/logout` qui invalide la session serveur et purge le cookie |
| Logger HTTP | `console.log` en DEV uniquement, format ad-hoc | JSON-style structuré : `method path status ip durationMs`, jamais de body ni de token, actif dans tous les ENV |
| Gestion erreurs | Stack trace renvoyée tel quel en JSON dans certains chemins | Stack trace réservée au log serveur en `DEV`, message générique uniformisé en production |
| `trust proxy` | Non défini | `app.set('trust proxy', 1)` pour respecter `X-Forwarded-For` derrière un reverse proxy |
| Vulnérabilités jspdf | 1× critique au niveau package (composé de 1 critical + 3 high + 2 moderate advisories internes) | Bump `^3.0.1` → `^4.2.1` ; toutes les CVEs jspdf résolues. Audit total : 10 → 9 (uniquement modérées devDeps) |
| Historique git | `pre-quickwins-snapshot`, `pre-docs-cleanup-snapshot`, `pre-merge-snapshot` contiennent encore les secrets historiques | Patterns `git filter-repo` prêts dans `scripts/filter-repo-patterns.txt` ; procédure documentée (§5) ; exécution déléguée |

## 3. Actions effectuées dans cette PR (Agent 1)

| # | Action | Fichier(s) impacté(s) | Commit |
| --- | --- | --- | --- |
| 1 | Redaction du client ID LinkedIn littéral | `src/lib/linkedin-api.ts` | `chore(security): redact residual LinkedIn client ID literal` |
| 2 | Préparation patterns purge historique | `scripts/filter-repo-patterns.txt` (nouveau) | `chore(security): add filter-repo replace-text patterns` |
| 3 | Durcissement proxy (cookie-parser, trust proxy, logger structuré, CSP) | `server.cjs`, `package.json` | `feat(security): harden proxy logging, error envelope and trust proxy` |
| 4 | Endpoints session httpOnly + refactor client | `server.cjs`, `src/lib/linkedin-api.ts`, `src/hooks/useLinkedInAnalytics.ts` | `feat(security): migrate LinkedIn tokens to httpOnly cookie session` |
| 5 | Bump `jspdf` pour patcher les CVE | `package.json`, `package-lock.json` (aucune adaptation de `pdf-exporter.ts` requise) | `chore(deps): bump jspdf to 4.2.1 to patch critical CVEs` |
| 6 | Régénération audit transitif + licences | `docs/audit/npm-audit.json`, `docs/audit/licenses.json` | `chore(audit): refresh npm-audit and license inventory after jspdf bump` |
| 7 | Mise à jour documentation sécurité | `docs/SECURITY.md`, `docs/audit/SECURITY_REMEDIATION_REPORT.md` | `docs(security): document httpOnly session and remediation status` |

## 4. Actions volontairement reportées

| Action | Pourquoi reportée | Responsable |
| --- | --- | --- |
| Rotation effective des 4 clés providers (Perplexity, OpenAI, Anthropic, LinkedIn client secret) | Geste à effectuer par l'humain dans les consoles fournisseur, hors capacité d'un agent code | Utilisateur / DevSecOps |
| Exécution de `git filter-repo` sur le repo principal | Réécrit l'historique → doit être suivi d'un `push --force-with-lease` coordonné avec toute personne ayant un clone local | Coordinator Wave 1 |
| Push de la branche `feat/security-hardening` | Le brief impose explicitement de ne pas pousser. À déclencher après validation des Agents 2 & 4 | Coordinator |
| Bascule du stockage de session vers Redis / chiffré | Acceptable pour un usage local mono-instance, à industrialiser avant exposition réseau | Roadmap post-valorisation |
| Désactivation totale de `VITE_LINKEDIN_CLIENT_SECRET` côté bundle | Touche à la configuration utilisateur et doit être synchronisée avec la doc de déploiement | Roadmap post-valorisation |
| Audit des cookies tiers / SameSite=Strict | Nécessite un travail UX (popups d'auth en cross-tab) | Roadmap post-valorisation |

## 5. Procédure de purge historique (à exécuter par le coordinator)

> ⚠️ **Ne lancer ces commandes qu'une fois la rotation des clés effectuée chez les fournisseurs**, sinon les anciens secrets restent valides même après réécriture de l'historique.

### Étape 1 — Rotation des clés (utilisateur)

Régénérer **toutes** les clés suivantes dans la console fournisseur, puis mettre à jour `.env` / `.env.local` locaux :

- Perplexity (`VITE_PERPLEXITY_API_KEY`)
- OpenAI (`VITE_OPENAI_API_KEY`, `VITE_CHATGPT_API_KEY`)
- Anthropic (`ANTHROPIC_API_KEY` côté proxy)
- LinkedIn (`VITE_LINKEDIN_CLIENT_SECRET` côté proxy une fois la migration complète)

Révoquer immédiatement les anciennes valeurs après vérification que les nouvelles fonctionnent.

### Étape 2 — Installation de `git-filter-repo`

```bash
# macOS (recommandé)
brew install git-filter-repo

# Alternative cross-OS
pip install git-filter-repo
```

### Étape 3 — Tag de sécurité avant réécriture

Depuis le repo principal `/Users/aminemohamed/Desktop/APP/kora` :

```bash
git checkout main
git tag pre-filter-repo
```

Optionnel mais conseillé : faire un clone miroir de sauvegarde sur disque externe avant de continuer.

### Étape 4 — Réécriture de l'historique

```bash
cd /Users/aminemohamed/Desktop/APP/kora
git filter-repo --replace-text scripts/filter-repo-patterns.txt --force
```

`git filter-repo` réécrit chaque commit où un pattern matche en substituant la valeur par `[REDACTED-…]`. Toutes les références (branches, tags) sont mises à jour. Le repo perd son `origin` par sécurité — il faudra le rajouter :

```bash
git remote add origin <url-du-remote>
```

### Étape 5 — Push coordonné

À effectuer **après confirmation** que :
- tous les contributeurs ont communiqué l'état de leurs clones locaux,
- la rotation des clés est terminée,
- les forks éventuels sont prévenus.

```bash
git push --force-with-lease origin main
git push --force-with-lease origin --tags
```

Demander à chaque contributeur de re-cloner ou de réaligner son clone via :

```bash
git fetch origin
git reset --hard origin/main
```

### Étape 6 — Audit post-purge

- Relancer le scan : `grep -rEn 'pplx-…|sk-proj-…|sk-ant-api…|WPL_AP1\.' …` doit retourner 0 résultat.
- Vérifier que les tags `pre-quickwins-snapshot`, `pre-docs-cleanup-snapshot`, `pre-merge-snapshot`, `valuation-prep-merged` ont eux aussi été réécrits.
- Mettre à jour ce rapport avec la date d'exécution.

## 6. Détail vulnérabilité jspdf

`npm-audit.json` avant action listait pour `jspdf@3.0.1` :

| Sévérité | CVE / Advisory | Range affectée | Fix dans |
| --- | --- | --- | --- |
| critical | GHSA-f8cm-6447-x5h2 — Local File Inclusion / Path Traversal | `<=3.0.4` | `>3.0.4` |
| high | GHSA-pqxr-3g65-p328 — PDF Injection via AcroFormChoiceField | `<=4.0.0` | `>4.0.0` |
| high | GHSA-95fx-jjr5-f39c — DoS BMPDecoder | `<=4.0.0` | `>4.0.0` |
| high | GHSA-9vjf-qc39-jprp — PDF Object Injection via addJS | `<=4.0.0` | `>4.0.0` |
| moderate | GHSA-vm32-vv63-w422 — XMP Metadata Injection | `<=4.0.0` | `>4.0.0` |
| moderate | GHSA-cjw8-79x6-5cj4 — addJS Race Condition | `<=4.0.0` | `>4.0.0` |

APIs `jspdf` utilisées par `src/services/export/formats/pdf-exporter.ts` :

`text`, `setFontSize`, `setTextColor`, `setFont`, `setFillColor`, `rect`, `circle`, `line`, `setDrawColor`, `setLineWidth`, `addPage`, `splitTextToSize`, `internal.pageSize`, `getCurrentPageInfo`, `getTextWidth`, `getNumberOfPages`, `setPage`, `output('arraybuffer')`.

Toutes sont stables depuis jspdf 2.x. Bump effectif : **`^3.0.1` → `^4.2.1`** (au-dessus du range `<=4.0.0` affecté). Le `npm run build` et `npx tsc --noEmit -p tsconfig.app.json` passent sans modification de `pdf-exporter.ts`. Aucun `autoTable` ni plugin externe n'est utilisé.

État `npm audit` post-bump :

| | Critical | High | Moderate | Total |
| --- | --- | --- | --- | --- |
| Avant | 1 | 0 | 9 | 10 |
| Après | 0 | 0 | 9 | 9 |

Les 8 vulnérabilités modérées restantes (après retrait de l'outillage tiers de tagging composant en post-traitement) sont toutes dans la branche `devDependencies` (vitest 2.x et son écosystème, brace-expansion). Elles sont hors scope sécurité immédiat et seront traitées lors du bump `@vitest/*` 2.x → 3.x, puisqu'elles ne touchent pas le bundle livré.

## 6b. Smoke test des endpoints session

Exécuté sur un proxy lancé en local sur le port 3099 :

```text
GET  /api/health                                        -> 200 { status: "OK", ... }
GET  /api/auth/linkedin/me           (sans cookie)      -> 401 { authenticated: false }
POST /api/auth/linkedin/session      (token factice)    -> 201 + Set-Cookie kora_linkedin_session
GET  /api/auth/linkedin/me           (avec cookie)      -> 401 + cookie purgé
                                                           (LinkedIn upstream rejette le token factice,
                                                            la session locale est invalidée comme attendu)
POST /api/auth/linkedin/logout       (avec cookie)      -> 204 + Set-Cookie Max-Age=0
```

Le contrat d'API est conforme à la spec :

- cookie posé httpOnly + SameSite=Lax + path `/api/auth`,
- expiration calée sur `expires_in`,
- destruction locale + purge cookie sur `401` upstream LinkedIn.

## 7. Risques résiduels assumés à l'issue d'Agent 1

| # | Risque | Sévérité actuelle | Mitigation |
| --- | --- | --- | --- |
| R1 | Stockage en mémoire des sessions LinkedIn (`Map` côté `server.cjs`) | Faible pour usage local mono-instance ; modéré dès qu'on scale horizontalement ou qu'on `restart` souvent | Documenté §3 du `docs/SECURITY.md`. Roadmap : Redis ou store chiffré disque pour la prod. |
| R2 | Anciens secrets toujours présents dans l'historique git | Élevé tant que `git filter-repo` n'est pas exécuté ET que la rotation n'est pas faite | Patterns + procédure prêts ; **action humaine requise**. |
| R3 | Clés `VITE_*` (Perplexity, OpenAI) toujours embarquées dans le bundle | Modérée (clés publiques de fait avec plafond budgétaire) | Documentée `docs/SECURITY.md`. Roadmap : faire transiter ces appels via le proxy. |
| R4 | Pas d'authentification applicative sur le proxy | Faible en local | Documentée. À durcir avant toute exposition réseau (mTLS, JWT serveur-à-serveur). |
| R5 | CSP encore tolérante (`'unsafe-inline'` pour `style-src`) | Modérée | Tolérée pour le moment côté Tailwind / shadcn. À retirer après audit du DOM. |
| R6 | Aucune révocation côté LinkedIn lors du logout local | Modérée | Le cookie est invalidé côté serveur, mais le token reste valide chez LinkedIn jusqu'à `expires_in`. Roadmap : appel `revoke` LinkedIn. |

## 8. Recommandations restantes pour le coordinator

1. Faire valider Agent 2 (CI/tests) que les tests `linkedin-api.ts` couvrent la nouvelle API serveur.
2. Faire valider Agent 4 (vérité données) que la chaîne `useLinkedInAnalytics` continue de cracher des métriques cohérentes après refactor.
3. Programmer la fenêtre de maintenance pour : rotation des 4 clés → `git filter-repo` → `push --force-with-lease`.
4. Ajouter `kora-security` worktree dans `.gitignore` global du dev pour éviter les commits parasites.
5. Considérer un test E2E (Playwright) qui clique sur "Connecter LinkedIn" et vérifie que ni `access_token` ni `id_token` n'apparaissent dans `localStorage` post-OAuth.

## 9. Annexes

- Tag de bascule : `pre-agent1-snapshot` (posé sur `main` avant le worktree).
- Branche de travail : `feat/security-hardening` (non poussée).
- Worktree de travail : `/Users/aminemohamed/Desktop/APP/kora-security` (à supprimer avec `git worktree remove` une fois la branche mergée).
- Inventaire commits : `git log --oneline pre-agent1-snapshot..feat/security-hardening` depuis le repo principal.
- `npm audit --json` post-bump : voir `docs/audit/npm-audit.json`.
- `license-checker --json --production --excludePrivatePackages` : voir `docs/audit/licenses.json`.
