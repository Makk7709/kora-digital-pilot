/**
 * 🔍 DEBUG VARIABLES ENVIRONNEMENT CÔTÉ CLIENT
 */

console.log('🔍 DEBUG VARIABLES ENVIRONNEMENT CÔTÉ CLIENT\n');

// Variables LinkedIn côté client
console.log('📋 Variables LinkedIn (import.meta.env):');
console.log('VITE_LINKEDIN_CLIENT_ID:', import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'NON DÉFINIE');
console.log('VITE_LINKEDIN_CLIENT_SECRET:', import.meta.env.VITE_LINKEDIN_CLIENT_SECRET ? 
  import.meta.env.VITE_LINKEDIN_CLIENT_SECRET.substring(0, 10) + '...' : 'NON DÉFINIE');
console.log('VITE_LINKEDIN_REDIRECT_URI:', import.meta.env.VITE_LINKEDIN_REDIRECT_URI || 'NON DÉFINIE');

// Toutes les variables VITE_
console.log('\n📋 Toutes les variables VITE_:');
Object.keys(import.meta.env).forEach(key => {
  if (key.startsWith('VITE_')) {
    const value = import.meta.env[key];
    console.log(`${key}:`, key.includes('SECRET') || key.includes('KEY') ? 
      (value ? value.substring(0, 10) + '...' : 'NON DÉFINIE') : value);
  }
});

// Mode et environnement
console.log('\n📋 Environnement:');
console.log('MODE:', import.meta.env.MODE);
console.log('DEV:', import.meta.env.DEV);
console.log('PROD:', import.meta.env.PROD);

// URL actuelle
console.log('\n📋 URL actuelle:');
console.log('Origin:', window.location.origin);
console.log('Port:', window.location.port);
console.log('Callback URL:', `${window.location.origin}/auth/linkedin/callback`);

export {}; 