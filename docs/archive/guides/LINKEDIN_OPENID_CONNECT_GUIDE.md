# 🆔 Guide LinkedIn OpenID Connect - Validation ID Token

## ✅ **Configuration mise à jour :**

Votre code a été mis à jour pour utiliser la **configuration OpenID Connect standard** de LinkedIn.

### **📋 Configuration OpenID Connect LinkedIn :**

```json
{
 "issuer": "https://www.linkedin.com",
 "authorization_endpoint": "https://www.linkedin.com/oauth/v2/authorization",
 "token_endpoint": "https://www.linkedin.com/oauth/v2/accessToken",
 "userinfo_endpoint": "https://api.linkedin.com/v2/userinfo",
 "jwks_uri": "https://www.linkedin.com/oauth/openid/jwks",
 "response_types_supported": ["code"],
 "subject_types_supported": ["pairwise"],
 "id_token_signing_alg_values_supported": ["RS256"],
 "scopes_supported": ["openid", "profile", "email"],
 "claims_supported": [
 "iss", "aud", "iat", "exp", "sub", "name", "given_name",
 "family_name", "picture", "email", "email_verified", "locale"
 ]
}
```

## 🚀 **Nouvelles fonctionnalités ajoutées :**

### **1. Scopes OpenID Connect Standard**
- ✅ `openid` - Identification de base
- ✅ `profile` - Profil utilisateur complet
- ✅ `email` - Email utilisateur

### **2. Validation ID Token JWT**
- ✅ Décodage automatique des JWT
- ✅ Validation de l'issuer (`https://www.linkedin.com`)
- ✅ Validation de l'audience (votre Client ID)
- ✅ Validation de l'expiration
- ✅ Validation de l'algorithme (RS256)

### **3. Endpoint userinfo OpenID Connect**
- ✅ Utilisation directe de `/v2/userinfo` - ✅ Claims standardisés OpenID Connect
- ✅ Compatibilité maximale

## 🧪 **Test de votre configuration :**

### **Étape 1 : Démarrer les serveurs**
```bash
./start-linkedin-test.sh
```

### **Étape 2 : Tester l'authentification**
1. Aller sur http://localhost:8088/linkedin-test
2. Cliquer sur "Se connecter avec LinkedIn"
3. Observer les logs dans la console du navigateur

### **Étape 3 : Vérifier les tokens reçus**

Après authentification, vérifiez dans la console :

```javascript
// Access Token
console.log('Access Token:', localStorage.getItem('linkedin_access_token'));

// ID Token (nouveau)
console.log('ID Token:', localStorage.getItem('linkedin_id_token'));

// Informations utilisateur depuis ID Token
const idTokenInfo = linkedinAPI.getUserInfoFromIDToken();
console.log('User Info depuis ID Token:', idTokenInfo);
```

### **Étape 4 : Valider l'ID Token**

```javascript
// Validation complète de l'ID Token
const validation = await linkedinAPI.getValidatedIDToken();
console.log('Validation ID Token:', validation);
```

## 📊 **Claims disponibles dans l'ID Token :**

| Claim | Description | Exemple |
| ------- |-------------| --------- |
| `sub` | Identifiant unique utilisateur | `"12345678"` |
| `name` | Nom complet | `"John Doe"` |
| `given_name` | Prénom | `"John"` |
| `family_name` | Nom de famille | `"Doe"` |
| `email` | Email | `"john@example.com"` |
| `picture` | Photo de profil | `"https://..."` |
| `locale` | Langue | `"en-US"` |
| `iss` | Émetteur | `"https://www.linkedin.com"` |
| `aud` | Audience | Votre Client ID |
| `exp` | Expiration | Timestamp Unix |
| `iat` | Émis à | Timestamp Unix |

## 🔧 **Configuration requise dans LinkedIn Developer Portal :**

### **Endpoints à configurer :**

| Resource | Method | OAuth Scopes | Permission Types |   |----------| -------- |--------------| ------------------ |
| `/v2/userinfo` | GET | `openid` | Member (3-legged) |   | `/v2/emailAddress` | GET | `email` | Member (3-legged) |
| `/v2/people/(id)` | GET | `profile` | Member (3-legged) |

### **URLs importantes :**
- **Redirect URI** : `http://localhost:8088/auth/linkedin/callback` - **Scopes requis** : `openid profile email` ## ⚠️ **Points importants :**

### **1. Validation de signature (Production)**
En production, vous devriez :
- Récupérer les clés publiques depuis `jwks_uri` - Valider la signature RS256 du JWT
- Implémenter une validation complète

### **2. Gestion des erreurs**
- ✅ Gestion des tokens expirés
- ✅ Fallback en cas d'erreur
- ✅ Logs détaillés pour le debugging

### **3. Sécurité**
- ✅ Validation du state OAuth
- ✅ Nettoyage des tokens à la déconnexion
- ✅ Vérification de l'expiration

## 🚨 **Dépannage :**

### **Problème : "invalid_scope" error**
- ✅ **Solution** : Votre app utilise maintenant les scopes standard

### **Problème : ID Token manquant**
- ✅ **Vérification** : L'ID Token est optionnel, l'access token suffit

### **Problème : Claims manquants**
- ✅ **Solution** : Utilisation de `/v2/userinfo` avec fallback

## 🎯 **Prochaines étapes :**

1. **Tester l'authentification** avec la nouvelle configuration
2. **Vérifier les endpoints** dans le LinkedIn Developer Portal
3. **Migrer vers l'application approuvée** (`226379168`) si souhaité
4. **Implémenter la validation de signature** pour la production

- --

* *📝 Note** : Cette configuration respecte les standards OpenID Connect et devrait fonctionner avec votre application actuelle et la nouvelle application approuvée.