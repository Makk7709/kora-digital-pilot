# 🔗 Guide de Configuration LinkedIn

## Problème actuel
Erreur 401 "invalid_client" car les credentials LinkedIn ne sont pas configurés.

## Solution rapide

### 1. Créer le fichier `.env` Créez un fichier `.env` à la racine du projet :

```env
# LinkedIn API Configuration
VITE_LINKEDIN_CLIENT_ID=[REDACTED_CLIENT_ID]
VITE_LINKEDIN_CLIENT_SECRET=VOTRE_CLIENT_SECRET_ICI
VITE_LINKEDIN_REDIRECT_URI=http://localhost:8088/auth/linkedin/callback
```

### 2. Récupérer le Client Secret
1. Allez sur votre [console LinkedIn Developer](https://www.linkedin.com/developers/apps/226372790/auth)
2. Dans la section "Primary Client Secret", cliquez sur l'icône 👁️
3. Copiez la valeur révélée
4. Remplacez `VOTRE_CLIENT_SECRET_ICI` dans le fichier `.env` ### 3. Redémarrer l'application
```bash
# Arrêter les serveurs (Ctrl+C)
# Puis redémarrer
npm run dev:full
```

## Vérification
- ✅ Le Client ID est déjà correct : `[REDACTED_CLIENT_ID]` - ✅ L'URL de redirection est configurée : `http://localhost:8088/auth/linkedin/callback` - ❌ Il manque seulement le Client Secret dans le fichier `.env` ## Mode démonstration
Si vous ne configurez pas LinkedIn, l'application fonctionne parfaitement en mode démonstration avec des données simulées réalistes.

## Support
L'application détecte automatiquement si LinkedIn est configuré et bascule entre :
- **Mode réel** : Avec credentials → Données LinkedIn authentiques
- **Mode démo** : Sans credentials → Données simulées professionnelles