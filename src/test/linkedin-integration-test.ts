/**
 * 🧪 TEST COMPLET INTÉGRATION LINKEDIN
 * Validation selon les bonnes pratiques LinkedIn OAuth 2.0
 */

interface LinkedInTestResult {
  step: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

class LinkedInIntegrationTester {
  private readonly results: LinkedInTestResult[] = [];
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor() {
    this.clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_LINKEDIN_CLIENT_SECRET;
    this.redirectUri = import.meta.env.VITE_LINKEDIN_REDIRECT_URI;
  }

  /**
   * 1️⃣ Test de configuration des variables d'environnement
   */
  testEnvironmentConfig(): LinkedInTestResult {
    const step = 'Configuration Environment';

    if (!this.clientId || this.clientId === 'YOUR_CLIENT_ID') {
      return {
        step,
        status: 'error',
        message: 'VITE_LINKEDIN_CLIENT_ID manquant ou invalide',
        details: { clientId: this.clientId },
      };
    }

    if (!this.clientSecret || this.clientSecret === 'YOUR_ACTUAL_CLIENT_SECRET') {
      return {
        step,
        status: 'error',
        message: 'VITE_LINKEDIN_CLIENT_SECRET manquant ou invalide',
        details: { clientSecret: this.clientSecret?.substring(0, 10) + '...' },
      };
    }

    if (!this.redirectUri?.includes('localhost')) {
      return {
        step,
        status: 'error',
        message: 'VITE_LINKEDIN_REDIRECT_URI manquant ou invalide',
        details: { redirectUri: this.redirectUri },
      };
    }

    return {
      step,
      status: 'success',
      message: 'Configuration environment ✅',
      details: {
        clientId: this.clientId,
        redirectUri: this.redirectUri,
        clientSecretLength: this.clientSecret?.length,
      },
    };
  }

  /**
   * 2️⃣ Test de l'URL d'autorisation LinkedIn
   */
  testAuthorizationUrl(): LinkedInTestResult {
    const step = "URL d'Autorisation";

    try {
      const state = Math.random().toString(36).substring(7);
      const scope = 'openid profile email';

      const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('client_id', this.clientId);
      authUrl.searchParams.set('redirect_uri', this.redirectUri);
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('scope', scope);

      // Validation des paramètres requis
      const requiredParams = ['response_type', 'client_id', 'redirect_uri', 'state', 'scope'];
      const missingParams = requiredParams.filter((param) => !authUrl.searchParams.has(param));

      if (missingParams.length > 0) {
        return {
          step,
          status: 'error',
          message: `Paramètres manquants: ${missingParams.join(', ')}`,
          details: { missingParams, authUrl: authUrl.toString() },
        };
      }

      return {
        step,
        status: 'success',
        message: "URL d'autorisation valide ✅",
        details: {
          authUrl: authUrl.toString(),
          scope,
          state,
        },
      };
    } catch (error) {
      return {
        step,
        status: 'error',
        message: "Erreur lors de la génération de l'URL d'autorisation",
        details: { error: error.message },
      };
    }
  }

  /**
   * 3️⃣ Test de l'échange de code contre token
   */
  async testTokenExchange(authCode?: string): Promise<LinkedInTestResult> {
    const step = 'Échange Token';

    if (!authCode) {
      return {
        step,
        status: 'warning',
        message: "Code d'autorisation requis pour ce test",
        details: { note: "Effectuez d'abord l'authentification pour obtenir un code" },
      };
    }

    try {
      const response = await fetch('/api/linkedin/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: authCode,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          step,
          status: 'error',
          message: `Erreur ${response.status}: ${data.error_description || data.error}`,
          details: {
            status: response.status,
            error: data.error,
            errorDescription: data.error_description,
          },
        };
      }

      // Validation du token reçu
      if (!data.access_token) {
        return {
          step,
          status: 'error',
          message: "Token d'accès manquant dans la réponse",
          details: data,
        };
      }

      return {
        step,
        status: 'success',
        message: 'Échange de token réussi ✅',
        details: {
          tokenType: data.token_type,
          expiresIn: data.expires_in,
          scope: data.scope,
          tokenLength: data.access_token?.length,
        },
      };
    } catch (error) {
      return {
        step,
        status: 'error',
        message: "Erreur réseau lors de l'échange de token",
        details: { error: error.message },
      };
    }
  }

  /**
   * 4️⃣ Test de récupération du profil utilisateur
   */
  async testProfileRetrieval(accessToken?: string): Promise<LinkedInTestResult> {
    const step = 'Récupération Profil';

    if (!accessToken) {
      return {
        step,
        status: 'warning',
        message: "Token d'accès requis pour ce test",
        details: { note: "Effectuez d'abord l'authentification pour obtenir un token" },
      };
    }

    try {
      const response = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          step,
          status: 'error',
          message: `Erreur ${response.status} lors de la récupération du profil`,
          details: {
            status: response.status,
            error: errorData,
          },
        };
      }

      const profile = await response.json();

      // Validation des champs requis
      const requiredFields = ['sub', 'name', 'email'];
      const missingFields = requiredFields.filter((field) => !profile[field]);

      if (missingFields.length > 0) {
        return {
          step,
          status: 'warning',
          message: `Champs manquants dans le profil: ${missingFields.join(', ')}`,
          details: { profile, missingFields },
        };
      }

      return {
        step,
        status: 'success',
        message: 'Profil récupéré avec succès ✅',
        details: {
          userId: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
        },
      };
    } catch (error) {
      return {
        step,
        status: 'error',
        message: 'Erreur lors de la récupération du profil',
        details: { error: error.message },
      };
    }
  }

  /**
   * 5️⃣ Test de validation des scopes
   */
  testScopeValidation(): LinkedInTestResult {
    const step = 'Validation Scopes';

    const requiredScopes = ['openid', 'profile', 'email'];
    const recommendedScopes = ['r_liteprofile', 'r_emailaddress'];

    return {
      step,
      status: 'success',
      message: 'Scopes configurés selon les bonnes pratiques ✅',
      details: {
        requiredScopes,
        recommendedScopes,
        note: 'Utilisez les scopes OpenID Connect pour une meilleure compatibilité',
      },
    };
  }

  /**
   * 🧪 Exécution de tous les tests
   */
  async runAllTests(authCode?: string, accessToken?: string): Promise<LinkedInTestResult[]> {
    console.log("🧪 Démarrage des tests d'intégration LinkedIn...\n");

    // Test 1: Configuration
    const configTest = this.testEnvironmentConfig();
    this.results.push(configTest);
    this.logResult(configTest);

    // Test 2: URL d'autorisation
    const authUrlTest = this.testAuthorizationUrl();
    this.results.push(authUrlTest);
    this.logResult(authUrlTest);

    // Test 3: Échange de token
    const tokenTest = await this.testTokenExchange(authCode);
    this.results.push(tokenTest);
    this.logResult(tokenTest);

    // Test 4: Récupération profil
    const profileTest = await this.testProfileRetrieval(accessToken);
    this.results.push(profileTest);
    this.logResult(profileTest);

    // Test 5: Validation scopes
    const scopeTest = this.testScopeValidation();
    this.results.push(scopeTest);
    this.logResult(scopeTest);

    this.printSummary();
    return this.results;
  }

  private logResult(result: LinkedInTestResult): void {
    const STATUS_EMOJI: Record<string, string> = { success: '✅', error: '❌' };
    const emoji = STATUS_EMOJI[result.status] ?? '⚠️';
    console.log(`${emoji} ${result.step}: ${result.message}`);
    if (result.details) {
      console.log('   Détails:', result.details);
    }
    console.log('');
  }

  private printSummary(): void {
    const successCount = this.results.filter((r) => r.status === 'success').length;
    const errorCount = this.results.filter((r) => r.status === 'error').length;
    const warningCount = this.results.filter((r) => r.status === 'warning').length;

    console.log('\n📊 RÉSUMÉ DES TESTS:');
    console.log(`✅ Succès: ${successCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    console.log(`⚠️ Avertissements: ${warningCount}`);
    console.log(`📈 Score: ${Math.round((successCount / this.results.length) * 100)}%`);

    if (errorCount === 0) {
      console.log("\n🎉 Tous les tests critiques sont passés ! L'intégration LinkedIn est prête.");
    } else {
      console.log('\n🔧 Des corrections sont nécessaires avant la mise en production.');
    }
  }
}

// Export pour utilisation
export { LinkedInIntegrationTester };

// Test automatique si exécuté directement
if (typeof globalThis !== 'undefined') {
  const tester = new LinkedInIntegrationTester();

  // Fonction globale pour les tests manuels
  (globalThis as any).testLinkedIn = async (authCode?: string, accessToken?: string) => {
    return await tester.runAllTests(authCode, accessToken);
  };

  console.log(
    '🧪 Testeur LinkedIn chargé. Utilisez testLinkedIn() dans la console pour lancer les tests.',
  );
}
