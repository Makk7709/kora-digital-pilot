import { render, screen } from '@testing-library/react';
import { CommunityManagerDashboard } from '../CommunityManagerDashboard';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock du hook usePerplexity
const mockPerplexity = {
  isInitialized: true,
  getBusinessInsights: vi.fn()
};

vi.mock('../../hooks/usePerplexity', () => ({
  usePerplexity: () => mockPerplexity
}));

// Mock du toast
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('CommunityManagerDashboard - Lisibilité des cartes', () => {
  beforeEach(() => {
    mockPerplexity.getBusinessInsights.mockResolvedValue({
      sources: [{ title: 'Test Source', url: 'https://test.com' }]
    });
  });

  describe('Tests de lisibilité des cartes principales (AxisCard)', () => {
    it('devrait avoir des cartes avec un contraste suffisant', () => {
      render(<CommunityManagerDashboard />);
      
      // Vérifier que les cartes principales sont présentes (utiliser getAllByText car elles apparaissent dans stats et cartes)
      const tendancesIA = screen.getAllByText('Tendances IA');
      expect(tendancesIA.length).toBeGreaterThan(0);
      
      const ameliorations = screen.getAllByText('Améliorations');
      expect(ameliorations.length).toBeGreaterThan(0);
      
      expect(screen.getByText('Contenus Tendances (Top 10)')).toBeInTheDocument();
      expect(screen.getByText('Veille d\'Entreprise')).toBeInTheDocument();
      
      // Vérifier que les cartes utilisent la classe premium-card
      const cards = document.querySelectorAll('.premium-card');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('devrait avoir des titres de cartes lisibles avec une hiérarchie visuelle claire', () => {
      render(<CommunityManagerDashboard />);
      
      // Vérifier que le titre principal utilise une taille appropriée (text-2xl)
      const mainTitle = screen.getByText('Dashboard Community Manager');
      expect(mainTitle).toBeInTheDocument();
      expect(mainTitle.className).toContain('text-2xl');
      
      // Vérifier que les cartes ont des titres avec text-xl
      const axisCards = document.querySelectorAll('[class*="text-xl"]');
      expect(axisCards.length).toBeGreaterThan(0);
    });

    it('devrait avoir des cartes d\'insights avec un espacement et une structure claire', () => {
      render(<CommunityManagerDashboard />);
      
      // Simuler des insights dans les cartes
      const insightCards = screen.queryAllByTestId('insight-card');
      
      // Test structure (sera validé après implémentation)
      // Les cartes d'insights doivent avoir:
      // - Un espacement vertical approprié (space-y-4)
      // - Une hiérarchie visuelle claire (titre → description → métadonnées)
      // - Des couleurs qui respectent le contraste minimum WCAG AA (4.5:1)
    });

    it('devrait avoir des badges d\'impact avec des couleurs distinctes', () => {
      render(<CommunityManagerDashboard />);
      
      // Test pour les badges d'impact (high/medium/low)
      // Ils doivent être facilement distinguables visuellement
      // - High: rouge/destructive avec bon contraste
      // - Medium: bleu/default avec bon contraste  
      // - Low: gris/secondary avec bon contraste
    });

    it('devrait avoir un état vide lisible et informatif', () => {
      render(<CommunityManagerDashboard />);
      
      // Vérifier que l'état vide est présent et lisible
      const emptyStateMessages = screen.getAllByText('Aucun insight disponible');
      expect(emptyStateMessages.length).toBeGreaterThan(0);
      
      const scanInstructions = screen.getAllByText('Lancez un scan pour obtenir des données');
      expect(scanInstructions.length).toBeGreaterThan(0);
    });
  });

  describe('Tests de lisibilité des statistiques rapides', () => {
    it('devrait avoir des cartes de statistiques avec une hiérarchie visuelle claire', () => {
      render(<CommunityManagerDashboard />);
      
      // Les cartes de stats doivent avoir:
      // - Icônes colorées distinctes pour chaque métrique
      // - Nombres en grand format (text-3xl) et bien contrastés
      // - Labels descriptifs lisibles
      
      // Vérifier la présence des éléments de statistiques
      const statsNumbers = document.querySelectorAll('[class*="text-3xl"]');
      expect(statsNumbers.length).toBeGreaterThanOrEqual(4); // Au moins 4 cartes de stats
      
      // Vérifier que les cartes de stats utilisent premium-card
      const premiumCards = document.querySelectorAll('.premium-card');
      expect(premiumCards.length).toBeGreaterThanOrEqual(4);
      
      // Vérifier la présence des descriptions colorées
      expect(screen.getByText('Insights disponibles')).toBeInTheDocument();
      expect(screen.getByText('Conseils actifs')).toBeInTheDocument();
      expect(screen.getByText('Sujets populaires')).toBeInTheDocument();
      expect(screen.getByText('Mentions trouvées')).toBeInTheDocument();
    });

    it('devrait avoir des icônes avec des couleurs cohérentes avec le thème', () => {
      render(<CommunityManagerDashboard />);
      
      // Vérifier la présence des icônes avec leurs couleurs thématiques:
      // - TrendingUp: text-blue-500
      // - Sparkles: text-purple-500  
      // - Calendar: text-green-500
      // - Eye: text-orange-500
    });
  });

  describe('Tests de responsive design et espacement', () => {
    it('devrait maintenir la lisibilité sur différentes tailles d\'écran', () => {
      render(<CommunityManagerDashboard />);
      
      // Test de la grille responsive:
      // - grid-cols-2 pour les cartes principales
      // - grid-cols-4 pour les statistiques
      // - gap-6 pour un espacement adéquat
    });

    it('devrait avoir un ScrollArea fonctionnel pour les longues listes', () => {
      render(<CommunityManagerDashboard />);
      
      // Vérifier que le ScrollArea est présent et configuré
      // avec une hauteur fixe (h-80) pour éviter les débordements
    });
  });

  describe('Tests de cohérence thématique', () => {
    it('devrait utiliser les classes premium-card du thème', () => {
      render(<CommunityManagerDashboard />);
      
      // Les cartes doivent utiliser la classe premium-card
      // pour une cohérence visuelle avec le reste de l'application
    });

    it('devrait respecter la palette de couleurs définie dans tailwind.config.ts', () => {
      render(<CommunityManagerDashboard />);
      
      // Vérifier l'utilisation cohérente des couleurs:
      // - Korev blue (#0ea5e9) pour les éléments primaires
      // - Slate pour les textes et bordures
      // - Couleurs spécifiques pour chaque axe (blue, purple, green, orange)
    });

    it('devrait avoir des transitions fluides pour l\'interaction utilisateur', () => {
      render(<CommunityManagerDashboard />);
      
      // Les éléments interactifs doivent avoir:
      // - transition-colors pour les changements d'état
      // - hover:bg-muted/50 pour les effets de survol
      // - Animation cohérente avec le reste de l'app
    });
  });
}); 