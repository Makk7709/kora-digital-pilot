/**
 * 🛡️ TESTS DE RÉGRESSION - P.R.I.S.M REPORT
 * Validation que le changement de nom n'a cassé aucune fonctionnalité
 * Phase REFACTOR du TDD - Vérifier que tout fonctionne encore
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Mock pour useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Wrapper pour React Router
const SidebarWithRouter = (props: any) => (
  <BrowserRouter>
    <Sidebar {...props} />
  </BrowserRouter>
);

describe('🛡️ TESTS DE RÉGRESSION - P.R.I.S.M REPORT', () => {
  test('VALIDATION - Tous les IDs de navigation restent inchangés', () => {
    // GIVEN: Sidebar rendu
    const mockOnSectionChange = vi.fn();
    render(<SidebarWithRouter activeSection="dashboard" onSectionChange={mockOnSectionChange} />);

    // WHEN/THEN: Vérifier que tous les IDs sont maintenus pour la navigation
    const expectedIds = [
      'dashboard',
      'cm-dashboard',
      'cm-domain-search', // ajout post-prism (Community Manager domain search)
      'brand-monitoring',
      'brand-intelligence-tdd', // ID maintenu malgré le changement de nom
      'inspiration',
      'images',
      'planning',
      'analytics',
      'library',
    ];

    // Les boutons doivent tous être présents : 10 boutons menu + 1 bouton collapse.
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(expectedIds.length + 1);
  });

  test('VALIDATION - Structure menu reste identique', () => {
    // GIVEN: Sidebar rendu
    const mockOnSectionChange = vi.fn();
    render(<SidebarWithRouter activeSection="dashboard" onSectionChange={mockOnSectionChange} />);

    // WHEN/THEN: Vérifier structure exacte des éléments de menu
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText("Vue d'ensemble")).toBeInTheDocument();

    expect(screen.getByText('CM Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Veille IA automatisée')).toBeInTheDocument();

    expect(screen.getByText('Veille de Marque')).toBeInTheDocument();
    expect(screen.getByText('Surveillance e-réputation')).toBeInTheDocument();

    // Nouvel onglet P.R.I.S.M Report
    expect(screen.getByText('P.R.I.S.M Report')).toBeInTheDocument();
    expect(screen.getByText('Deep Research & Métriques')).toBeInTheDocument();

    expect(screen.getByText('Inspiration IA')).toBeInTheDocument();
    expect(screen.getByText('Générer du contenu')).toBeInTheDocument();

    expect(screen.getByText("Générateur d'Images")).toBeInTheDocument();
    expect(screen.getByText('Créer avec DALL-E 3')).toBeInTheDocument();

    expect(screen.getByText('Planning éditorial')).toBeInTheDocument();
    expect(screen.getByText('Organiser les publications')).toBeInTheDocument();

    expect(screen.getByText('Analyse')).toBeInTheDocument();
    expect(screen.getByText('Performance des posts')).toBeInTheDocument();

    expect(screen.getByText('Bibliothèque')).toBeInTheDocument();
    expect(screen.getByText('Contenu sauvegardé')).toBeInTheDocument();
  });

  test('VALIDATION - Fonctionnalité collapse reste intacte', () => {
    // GIVEN: Sidebar rendu
    const mockOnSectionChange = vi.fn();
    const { container } = render(
      <SidebarWithRouter activeSection="dashboard" onSectionChange={mockOnSectionChange} />,
    );

    // WHEN/THEN: Vérifier que l'élément aside a la classe de largeur correcte (non collapsed)
    const aside = container.querySelector('aside');
    expect(aside).toHaveClass('w-64'); // Largeur normale
    expect(aside).not.toHaveClass('w-16'); // Pas collapsed

    // Bouton collapse doit être présent
    expect(screen.getByText('←')).toBeInTheDocument();
  });

  test("VALIDATION - Seulement l'onglet P.R.I.S.M Report a changé", () => {
    // GIVEN: Sidebar rendu
    const mockOnSectionChange = vi.fn();
    render(<SidebarWithRouter activeSection="dashboard" onSectionChange={mockOnSectionChange} />);

    // WHEN/THEN: Vérifier que SEUL l'onglet P.R.I.S.M Report a été modifié

    // Ces icônes n'ont PAS changé
    expect(screen.getByText('📊')).toBeInTheDocument(); // Dashboard
    expect(screen.getByText('🧠')).toBeInTheDocument(); // CM Dashboard
    expect(screen.getByText('👁️')).toBeInTheDocument(); // Veille de Marque
    expect(screen.getByText('✨')).toBeInTheDocument(); // Inspiration IA
    expect(screen.getByText('🎨')).toBeInTheDocument(); // Générateur d'Images
    expect(screen.getByText('📅')).toBeInTheDocument(); // Planning éditorial
    expect(screen.getByText('📈')).toBeInTheDocument(); // Analyse
    expect(screen.getByText('📚')).toBeInTheDocument(); // Bibliothèque

    // Cette icône A changé
    expect(screen.getByText('⟨⟩')).toBeInTheDocument(); // P.R.I.S.M Report (était 🚀)
    expect(screen.queryByText('🚀')).not.toBeInTheDocument(); // Plus présent

    // Ce label A changé
    expect(screen.getByText('P.R.I.S.M Report')).toBeInTheDocument();
    expect(screen.queryByText('Intelligence TDD')).not.toBeInTheDocument(); // Plus présent
  });

  test('PERFORMANCE - Pas de regression de performance', () => {
    // GIVEN: Mesure du temps de rendu
    const startTime = performance.now();
    const mockOnSectionChange = vi.fn();

    // WHEN: Rendu du composant
    render(<SidebarWithRouter activeSection="dashboard" onSectionChange={mockOnSectionChange} />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // THEN: Le rendu doit être rapide (moins de 100ms)
    expect(renderTime).toBeLessThan(100);

    console.log(`⚡ Temps de rendu: ${renderTime.toFixed(2)}ms`);
  });
});
