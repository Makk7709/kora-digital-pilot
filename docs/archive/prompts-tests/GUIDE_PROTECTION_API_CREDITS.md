# 🛡️ GUIDE PROTECTION API CREDITS - PERPLEXITY

## 🚨 **INCIDENT RÉSOLU** - Consommation Excessive de Crédits

### **Problème Identifié**
L'application faisait des appels en boucle qui ont vidé le compte de crédits Perplexity. Les principales sources étaient :

1. **Polling `/api/health`** - Appels toutes les 10 secondes
2. **Auto-refresh cache** - Actualisations toutes les 30 secondes
3. **Scans automatiques** - Community Manager Dashboard toutes les 12h
4. **Marketing insights** - Auto-refresh toutes les heures

- --

## ✅ **CORRECTIONS APPLIQUÉES**

### **1. Hook LinkedIn Analytics**
```typescript
// AVANT: setInterval(..., 10000) - Toutes les 10 secondes
// APRÈS: setInterval(..., 5 * 60 * 1000) - Toutes les 5 minutes
```

### **2. Hook Perplexity**
```typescript
// AVANT: setInterval(refreshCacheStats, 30000) - Toutes les 30 secondes
// APRÈS: Actualisation manuelle uniquement
```

### **3. Community Manager Dashboard**
```typescript
// AVANT: autoScanEnabled = true (scan automatique)
// APRÈS: autoScanEnabled = false (scan manuel)
```

### **4. Marketing Insights Hook**
```typescript
// AVANT: Auto-refresh activé avec logs
// APRÈS: Auto-refresh avec warnings explicites
```

- --

## 🛡️ **PROTECTION IMPLÉMENTÉE**

### **A. Middleware de Protection**
- **Fichier**: `src/lib/perplexity-protection-middleware.ts` - **Limites par défaut**:
 - 2 appels/minute (anti-boucle)
 - 10 appels/heure
 - $5.00/jour maximum
- **Fonctionnalités**:
 - Blocage automatique des appels excessifs
 - Historique persistant (localStorage)
 - Wrapper `protectedFetch()` pour tous les appels API

### **B. Composant de Monitoring**
- **Fichier**: `src/components/APIUsageProtection.tsx` - **Interface utilisateur** pour:
 - Visualiser la consommation en temps réel
 - Activer/désactiver la protection
 - Réinitialiser les statistiques
 - Alertes visuelles

- --

## 📊 **UTILISATION**

### **1. Protection Automatique**
```typescript
import { perplexityProtection } from '@/lib/perplexity-protection-middleware';

// Utiliser le fetch protégé
const response = await perplexityProtection.protectedFetch('https://api.perplexity.ai/...', options);
```

### **2. Vérification Manuelle**
```typescript
const { allowed, reason } = perplexityProtection.canMakeCall('endpoint');
if (!allowed) {
 console.error('Appel bloqué:', reason);
 return;
}
```

### **3. Hook React**
```typescript
import { usePerplexityProtection } from '@/lib/perplexity-protection-middleware';

const { canMakeCall, getStats, protectedFetch } = usePerplexityProtection();
```

- --

## 🔍 **DIAGNOSTIC**

### **Vérifier la Consommation Actuelle**
1. Aller dans **Vue d'ensemble** → **Protection API**
2. Vérifier les métriques:
 - Appels 24h
 - Coût 24h
 - Status de protection

### **Analyser les Logs**
```bash
# Rechercher les appels suspects
grep -r "Protection.*Appel" src/
grep -r "Auto-refresh\|Auto-scan" src/
```

### **Identifier les Boucles**
- Chercher `setInterval` dans le code
- Vérifier les `useEffect` avec dependencies qui changent
- Monitoring des requêtes réseau (DevTools)

- --

## ⚙️ **CONFIGURATION RECOMMANDÉE**

### **Variables d'Environnement**
```bash
# .env
VITE_PERPLEXITY_API_KEY=pplx-your-key
VITE_PROTECTION_MAX_CALLS_HOUR=10
VITE_PROTECTION_MAX_COST_DAY=5.00
VITE_PROTECTION_ENABLED=true
```

### **Limites de Sécurité**
- **Développement**: 5 appels/heure, $2/jour
- **Staging**: 10 appels/heure, $5/jour
- **Production**: 20 appels/heure, $10/jour

- --

## 🚀 **BONNES PRATIQUES**

### **1. Éviter les Appels Automatiques**
❌ **À éviter**:
```typescript
useEffect(() => {
 const interval = setInterval(callAPI, 1000); // Trop fréquent !
 return () => clearInterval(interval);
}, []);
```

✅ **Recommandé**:
```typescript
const handleUserAction = async () => {
 const { allowed } = await canMakeCall();
 if (allowed) {
 await callAPI();
 }
};
```

### **2. Utiliser le Cache Intelligemment**
```typescript
// Cache avec TTL approprié
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const cachedData = getCachedData(cacheKey, CACHE_TTL);
```

### **3. Debouncing pour les Interactions**
```typescript
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query) => {
 await searchAPI(query);
}, 1000); // 1 seconde de debounce
```

### **4. Monitoring Continu**
```typescript
// Logger tous les appels API
console.log(`🔍 API Call: ${endpoint} - ${new Date().toISOString()}`);
```

- --

## 🆘 **EN CAS DE PROBLÈME**

### **Urgence - Arrêt Immédiat**
```typescript
// Dans la console du navigateur
window.perplexityProtectionMiddleware.setProtectionActive(true);
window.perplexityProtectionMiddleware.reset();
```

### **Diagnostic Rapide**
```typescript
// Vérifier les stats actuelles
console.log(window.perplexityProtectionMiddleware.getStats());
```

### **Reset Complet**
```bash
# Supprimer le cache et relancer
localStorage.removeItem('perplexity_protection_history');
localStorage.removeItem('perplexity_usage_stats');
```

- --

## 📝 **CHECKLIST AVANT DEPLOY**

- [ ] ✅ Protection activée par défaut
- [ ] ✅ Tous les `setInterval` ont des intervalles > 5 minutes
- [ ] ✅ Auto-refresh désactivé par défaut
- [ ] ✅ Middleware de protection intégré
- [ ] ✅ Tests de charge avec limites
- [ ] ✅ Monitoring et alertes configurés
- [ ] ✅ Documentation mise à jour

- --

## 🎯 **OBJECTIFS ATTEINTS**

✅ **Protection Active**: Middleware automatique
✅ **Monitoring**: Interface utilisateur complète
✅ **Prévention**: Tous les appels automatiques contrôlés
✅ **Récupération**: Guide de diagnostic et résolution
✅ **Documentation**: Guide complet pour l'équipe

* *Garantie**: Plus jamais de consommation excessive involontaire ! 🛡️