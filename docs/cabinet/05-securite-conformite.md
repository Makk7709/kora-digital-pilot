# 05 — Sécurité et conformité

Synthèse opposable à destination d'un cabinet d'évaluation. Les éléments détaillés sont dans [`docs/SECURITY.md`](../SECURITY.md) et [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](../audit/SECURITY_REMEDIATION_REPORT.md).

## 5.1 Modèle de menaces

Synthèse de [`docs/SECURITY.md`](../SECURITY.md) §1. Périmètre actuel : application interne déployée en local sur les postes des collaborateurs Korev AI ou sur un serveur privé interne. Le proxy `server.cjs` n'expose pas d'authentification utilisateur et n'est pas destiné à être publié sur internet en l'état.

| Menace | Exposition actuelle | Mitigation effective | Référence |
| --- | --- | --- | --- |
| Fuite clés Perplexity / OpenAI | Élevée — clés `VITE_*` embarquées dans le bundle | Rotation régulière + plafond budgétaire + blocker anti-spam | [`docs/SECURITY.md`](../SECURITY.md) §2.2 |
| Fuite client secret LinkedIn / clé Anthropic | Faible — confinés côté proxy | Variables d'environnement, jamais loggées | [`docs/SECURITY.md`](../SECURITY.md) §2.3 |
| Vol token LinkedIn utilisateur | Faible — tokens en mémoire serveur, cookie `HttpOnly` + `SameSite=Lax` | Scope `/api/auth`, `Secure` en prod, expiration alignée sur `expires_in` | [`docs/SECURITY.md`](../SECURITY.md) §3.2 |
| Spam d'appels Perplexity | Maîtrisée | `global-api-blocker.ts`, middleware Perplexity, plafonds quotidiens, backoff exponentiel | [`docs/SECURITY.md`](../SECURITY.md) §5 |
| Accès non autorisé au proxy | Faible en local, élevée si exposé en réseau | Proxy à n'exposer qu'en localhost ou réseau privé | [`docs/SECURITY.md`](../SECURITY.md) §1 |
| Exfiltration tokens via XSS | Très faible — plus aucun token LinkedIn accessible aux scripts | CSP renforcée (`script-src 'self'`, `script-src-attr 'none'`), cookie `HttpOnly` | [`docs/SECURITY.md`](../SECURITY.md) §5 |

**Constaté** par croisement avec [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](../audit/SECURITY_REMEDIATION_REPORT.md) §2 (état avant/après).

## 5.2 Migration session LinkedIn — cookie `HttpOnly` (Wave 1 — Agent 1)

### Avant Wave 1

- `linkedin_access_token` et `linkedin_id_token` stockés en clair dans `localStorage`.
- Endpoint `/api/linkedin/token` retournait le bundle complet `access_token` + `id_token` au navigateur.
- Lecture profil LinkedIn : le navigateur posait l'access token au proxy `/api/linkedin/profile`.

### Après Wave 1

- Tokens stockés exclusivement dans une `Map<sessionId, …>` côté `server.cjs`.
- Cookie `kora_linkedin_session` posé : `HttpOnly`, `SameSite=Lax`, `Secure` en production, `Path=/api/auth`, `Max-Age = expires_in` LinkedIn.
- Endpoints :
  - `POST /api/auth/linkedin/session` — création de session (201) ;
  - `GET /api/auth/linkedin/me` — lecture du profil côté serveur (cookie en entrée) ;
  - `POST /api/auth/linkedin/logout` — invalidation locale + purge du cookie (204).
- Smoke test exécuté et documenté dans [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](../audit/SECURITY_REMEDIATION_REPORT.md) §6b.

**Constaté** par lecture directe de `server.cjs` et de [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts) ; reproductible par smoke test local.

## 5.3 Durcissement proxy

| Mesure | Statut | Référence dans le code |
| --- | --- | --- |
| `trust proxy` activé | ✅ | `server.cjs` `app.set('trust proxy', 1)` |
| `cookie-parser` monté | ✅ | `server.cjs` (import + `app.use(cookieParser())`) |
| Logger structuré sans body ni token | ✅ | `server.cjs` (format `method path status ip durationMs`) |
| CSP renforcée | ✅ | `helmet` dans `server.cjs` — `default-src 'self'`, `script-src 'self'`, `script-src-attr 'none'`, `frame-ancestors 'none'` |
| Helmet HSTS en production | ✅ | `server.cjs` |
| Erreurs génériques en production | ✅ | Stack trace en DEV uniquement |
| Rate limiting multi-fenêtres | ✅ | `/api/auth/linkedin/session` 30/min, `/me` 120/min, `/logout` 60/min, global 300/min |
| Body limit JSON 1 Mo strict | ✅ | `server.cjs` |

**Constaté** par lecture directe de `server.cjs` et croisement avec [`docs/audit/PROJECT_AUDIT_NOTES.md`](../audit/PROJECT_AUDIT_NOTES.md) §5.

## 5.4 Bump `jspdf` — résolution de la vulnérabilité critique

Détail dans [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](../audit/SECURITY_REMEDIATION_REPORT.md) §6.

| Avant | Après |
| --- | --- |
| `jspdf ^3.0.1` | `jspdf ^4.2.1` |
| 1 critical + 4 high + 2 moderate (CVEs jspdf) | 0 critical + 0 high + 0 moderate (jspdf) |
| Total `npm audit` : 10 vulnérabilités | Total `npm audit` : 9 vulnérabilités (toutes modérées, toutes en `devDependencies`) |

**CVEs résolues** : `GHSA-f8cm-6447-x5h2` (LFI/Path Traversal, critical), `GHSA-pqxr-3g65-p328` (PDF Injection AcroFormChoiceField), `GHSA-95fx-jjr5-f39c` (DoS BMPDecoder), `GHSA-9vjf-qc39-jprp` (PDF Object Injection addJS), `GHSA-vm32-vv63-w422` (XMP Metadata Injection), `GHSA-cjw8-79x6-5cj4` (addJS Race Condition).

**Vulnérabilités résiduelles** : 9 modérées dans `devDependencies` (vitest 2.x, vite, esbuild, brace-expansion, lovable-tagger). Aucune ne touche le bundle livré. Traitement prévu en Wave 3 (bump Vitest 3.x — ownership Agent 2 / dépendances).

**Constaté** par exécution `npm audit --json` et croisement avec [`docs/audit/npm-audit.json`](../audit/npm-audit.json).

## 5.5 Gestion des secrets

### 5.5.1 Inventaire des variables sensibles

| Variable | Côté | Sensibilité | Statut post Wave 1 |
| --- | --- | --- | --- |
| `VITE_PERPLEXITY_API_KEY` | Client (bundle) | Publique de fait | Acceptée — rotation + plafond |
| `VITE_OPENAI_API_KEY` | Client (bundle) | Publique de fait | Acceptée — rotation + plafond |
| `VITE_CHATGPT_API_KEY` | Client (bundle) | Publique de fait | Acceptée — rotation + plafond |
| `VITE_ANTHROPIC_API_KEY` | Client (bundle) | Sensible — à supprimer | 🟡 Appels Anthropic transitent déjà via proxy ; retrait formel à finaliser |
| `VITE_LINKEDIN_CLIENT_ID` | Client | Publique par conception OAuth | OK |
| `VITE_LINKEDIN_CLIENT_SECRET` | Client | Sensible — ne doit jamais être en `VITE_*` | 🟡 Échange token exécuté server-side depuis Wave 1 ; retrait du `VITE_*` à finaliser |
| `ANTHROPIC_API_KEY` (sans préfixe) | Proxy | Sensible | OK — confinée côté serveur |
| `LINKEDIN_CLIENT_SECRET` (sans préfixe) | Proxy | Sensible | OK — confinée côté serveur |

**Constaté** par lecture de [`.env.local.example`](../../.env.local.example) et de [`docs/SECURITY.md`](../SECURITY.md) §2.

### 5.5.2 Architecture des clés (schéma)

Documentée dans [`docs/SECURITY.md`](../SECURITY.md) §2.3 (diagramme Mermaid). Synthèse :

- Le bundle JS appelle directement Perplexity et OpenAI (clés `VITE_*`).
- Le bundle JS appelle le proxy pour Anthropic et LinkedIn ; aucun secret serveur n'est transmis dans le bundle.

## 5.6 Historique Git — purge en attente

| État | Détail |
| --- | --- |
| Patterns de redaction | [`scripts/filter-repo-patterns.txt`](../../scripts/filter-repo-patterns.txt) prêt |
| Procédure | [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](../audit/SECURITY_REMEDIATION_REPORT.md) §5 (6 étapes) |
| Préalable | **Rotation effective des 4 clés providers par le porteur** (Perplexity, OpenAI, Anthropic, LinkedIn `CLIENT_SECRET`) |
| Exécution `git filter-repo` | À déclencher par le coordinator après rotation |
| Push coordonné `--force-with-lease` | À planifier après réécriture |

**Statut** : 🟡 préparé, en attente d'action humaine. Tant que les anciennes clés ne sont pas révoquées chez les fournisseurs, la réécriture d'historique est sans effet sur le risque de compromission.

**Constaté** par lecture de `scripts/filter-repo-patterns.txt` et de la procédure détaillée.

## 5.7 RGPD et données personnelles

Synthèse — éléments **constatés** et **à confirmer par le porteur** :

| Élément | Constat | Statut |
| --- | --- | --- |
| Base de données serveur | Aucune (cf. [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) §2) | ✅ Pas de stockage centralisé de données personnelles côté éditeur |
| Persistance des données utilisateur | Exclusivement `localStorage` côté navigateur (planning, exports, paramètres) | ✅ Localisée sur le poste utilisateur |
| Données LinkedIn (profil, claims OIDC) | Cachées en mémoire serveur dans la session, purgées à expiration ou logout | ✅ Volatile, pas de persistance disque |
| Logs serveur | Format `method path status ip durationMs`, **jamais de body ni de token** | ✅ Minimisation respectée |
| Analyse d'impact (AIPD / DPIA) | Non formalisée à ce snapshot | 🟡 À conduire avant exposition multi-utilisateurs |
| Mention légale / politique de confidentialité | Non présente dans le repo | 🟡 À fournir par le porteur si exposition utilisateur final |

**À confirmer par le porteur** : statut de la communication des données (par les utilisateurs Korev AI eux-mêmes) à Perplexity, OpenAI, Anthropic et LinkedIn ; conformité contractuelle avec les ToS des fournisseurs.

## 5.8 AI Act

Aucune analyse d'impact AI Act formalisée à ce snapshot. À conduire par un cabinet juridique avant déploiement étendu.

**À confirmer par le porteur** : classification du système d'IA selon AI Act (article 6 et annexes), périmètre d'usage cible (interne vs production grand public).

## 5.9 Conformité licence

| Élément | Statut | Référence |
| --- | --- | --- |
| Licence du projet | MIT — [`LICENSE`](../../LICENSE) | © 2024-2026 Korev AI |
| Licences des dépendances | Inventaire `npx license-checker --json` dans [`docs/audit/licenses.json`](../audit/licenses.json) | Non rejouée dans le cabinet — pointeur direct |
| Compatibilité licence | MIT-compatible (Apache 2.0, BSD, ISC, MIT, …) | À vérifier formellement par un cabinet juridique |
| Dépendance « lovable-tagger » | devDependency, Vite plugin développement uniquement | Sans impact runtime, retrait recommandé par [`docs/audit/PROJECT_AUDIT_NOTES.md`](../audit/PROJECT_AUDIT_NOTES.md) §6 |

**Constaté** par lecture de `LICENSE`, `package.json` et de `docs/audit/licenses.json`.

## 5.10 Risques résiduels assumés

Repris de [`docs/SECURITY.md`](../SECURITY.md) §4 et de [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](../audit/SECURITY_REMEDIATION_REPORT.md) §7 :

| # | Risque | Sévérité actuelle | Mitigation |
| --- | --- | --- | --- |
| R1 | Sessions LinkedIn en mémoire mono-instance | Faible (local) — modérée (multi-instance) | Documenté ; roadmap Redis / store chiffré |
| R2 | Anciens secrets dans l'historique Git | Élevée tant que `filter-repo` non exécuté ET rotation non faite | Patterns prêts ; action humaine requise |
| R3 | Clés `VITE_*` (Perplexity, OpenAI) dans le bundle | Modérée (publiques de fait, plafond budgétaire) | Documentée ; roadmap proxy |
| R4 | Pas d'authentification applicative sur le proxy | Faible en local | Documentée ; à durcir pour exposition réseau |
| R5 | CSP encore tolérante (`'unsafe-inline'` pour `style-src`) | Modérée | Justifiée par Tailwind/shadcn ; à retirer après audit DOM |
| R6 | Pas de révocation upstream LinkedIn lors du logout | Modérée | Cookie invalidé côté serveur ; roadmap : appel `revoke` |

**Constaté** par croisement des deux documents source.

## 5.11 Synthèse pour le cabinet d'évaluation

| Question | Réponse opposable |
| --- | --- |
| Y a-t-il des secrets en clair dans le code source courant ? | Non. Scan effectué : 0 match (Wave 1, [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](../audit/SECURITY_REMEDIATION_REPORT.md) §2). |
| Y a-t-il des secrets dans l'historique Git ? | Oui, dans des commits anciens. Patterns de purge prêts, exécution déléguée au porteur après rotation. |
| Les tokens utilisateur sont-ils protégés ? | Oui, depuis Wave 1 : cookie `HttpOnly` + `SameSite` + `Secure` (prod), pas d'accès JS. |
| Y a-t-il une vulnérabilité critique active ? | Non. `jspdf` bumpé en 4.2.1 (Wave 1) ; `npm audit` : 0 critical / 0 high / 9 moderate (toutes en `devDependencies`). |
| L'application est-elle prête pour une exposition réseau ? | Non. Pas d'auth applicative, store de session mono-instance. Documenté comme limite assumée. |
| La conformité RGPD est-elle formalisée ? | Non. Pas de DPIA à ce snapshot. À conduire par un cabinet juridique. |

---

Dernière mise à jour : 2026-05-22.
