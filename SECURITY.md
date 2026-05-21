# Sécurité — alias

La documentation de sécurité de référence est dans [`docs/SECURITY.md`](./docs/SECURITY.md) : modèle de menaces, gestion des secrets, architecture des clés API, risques résiduels assumés et procédure de rotation.

## Signalement d'une vulnérabilité

- **Contact** : `security@korev.ai` *(placeholder, à confirmer par Korev AI).*
- **Périmètre** : toute faille technique permettant l'accès à des données, l'usurpation d'identité, l'exécution de code arbitraire ou la compromission des clés d'API.
- **Délai souhaité de réponse** : sous 5 jours ouvrés.
- **Divulgation** : pas de publication avant correction et coordination avec l'éditeur. Une fois la faille corrigée, la rotation des éventuelles clés compromises est documentée dans `docs/SECURITY.md`.

## Versions supportées

Le projet est actuellement en version `0.x` pré-stable. Les correctifs de sécurité sont appliqués uniquement sur `main`. Aucune branche de version antérieure n'est maintenue.
