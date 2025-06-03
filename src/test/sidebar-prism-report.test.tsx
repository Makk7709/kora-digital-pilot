/**
 * 🧪 TDD TESTS - CHANGEMENT ONGLET INTELLIGENCE TDD → P.R.I.S.M REPORT
 * Méthodologie TDD stricte : RED → GREEN → REFACTOR
 * Couverture 100% - Tests fonctionnels purs
 * 
 * ✅ RÈGLES TDD :
 * 1. RED : Écrire un test qui échoue d'abord
 * 2. GREEN : Écrire le code minimal pour le faire passer
 * 3. REFACTOR : Améliorer le code sans casser les tests
 * 4. Répéter le cycle
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('🔺 TDD - CHANGEMENT ONGLET VERS P.R.I.S.M REPORT', () => {
  
  describe('🔴 PHASE RED - Tests qui échouent d\'abord', () => {
    
    test('DOIT afficher "P.R.I.S.M Report" au lieu de "Intelligence TDD"', () => {
      // GIVEN: Sidebar rendu avec une section par défaut
      const mockOnSectionChange = vi.fn();
      
      render(
        <SidebarWithRouter 
          activeSection="dashboard" 
          onSectionChange={mockOnSectionChange} 
        />
      );
      
      // WHEN: On cherche le nouvel onglet P.R.I.S.M Report
      const prismReportButton = screen.queryByText('P.R.I.S.M Report');
      
      // THEN: L'onglet P.R.I.S.M Report doit être présent
      expect(prismReportButton).toBeInTheDocument();
      expect(prismReportButton).toHaveTextContent('P.R.I.S.M Report');
    });
    
    test('DOIT utiliser l\'emoji pyramide creuse ⟨⟩ pour P.R.I.S.M Report', () => {
      // GIVEN: Sidebar rendu
      const mockOnSectionChange = vi.fn();
      
      render(
        <SidebarWithRouter 
          activeSection="dashboard" 
          onSectionChange={mockOnSectionChange} 
        />
      );
      
      // WHEN: On cherche l'emoji pyramide creuse
      const pyramidIcon = screen.queryByText('⟨⟩');
      
      // THEN: L'emoji pyramide creuse doit être présent
      expect(pyramidIcon).toBeInTheDocument();
    });
    
    test('NE DOIT PLUS afficher "Intelligence TDD" dans la sidebar', () => {
      // GIVEN: Sidebar rendu
      const mockOnSectionChange = vi.fn();
      
      render(
        <SidebarWithRouter 
          activeSection="dashboard" 
          onSectionChange={mockOnSectionChange} 
        />
      );
      
      // WHEN: On cherche l'ancien nom "Intelligence TDD"
      const oldLabel = screen.queryByText('Intelligence TDD');
      
      // THEN: L'ancien nom ne doit plus être présent
      expect(oldLabel).not.toBeInTheDocument();
    });
    
    test('DOIT maintenir la même description "Deep Research & Métriques"', () => {
      // GIVEN: Sidebar rendu
      const mockOnSectionChange = vi.fn();
      
      render(
        <SidebarWithRouter 
          activeSection="dashboard" 
          onSectionChange={mockOnSectionChange} 
        />
      );
      
      // WHEN: On cherche la description
      const description = screen.queryByText('Deep Research & Métriques');
      
      // THEN: La description doit être maintenue
      expect(description).toBeInTheDocument();
    });
    
    test('DOIT maintenir le même ID "brand-intelligence-tdd" pour la navigation', () => {
      // GIVEN: Sidebar rendu avec section P.R.I.S.M Report active
      const mockOnSectionChange = vi.fn();
      
      render(
        <SidebarWithRouter 
          activeSection="brand-intelligence-tdd" 
          onSectionChange={mockOnSectionChange} 
        />
      );
      
      // WHEN: On cherche le bouton P.R.I.S.M Report
      const prismButton = screen.getByText('P.R.I.S.M Report');
      
      // THEN: Le bouton doit avoir la classe active
      expect(prismButton.closest('button')).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-blue-500');
    });
    
    test('DOIT pouvoir cliquer sur P.R.I.S.M Report et déclencher onSectionChange', () => {
      // GIVEN: Sidebar avec callback mock
      const mockOnSectionChange = vi.fn();
      
      render(
        <SidebarWithRouter 
          activeSection="dashboard" 
          onSectionChange={mockOnSectionChange} 
        />
      );
      
      // WHEN: On clique sur P.R.I.S.M Report
      const prismButton = screen.getByText('P.R.I.S.M Report');
      fireEvent.click(prismButton);
      
      // THEN: Le callback doit être appelé avec le bon ID
      expect(mockOnSectionChange).toHaveBeenCalledWith('brand-intelligence-tdd');
    });
  });
  
  describe('📋 VALIDATION STRUCTURE COMPLÈTE', () => {
    
    test('DOIT maintenir tous les autres onglets intacts', () => {
      // GIVEN: Sidebar rendu
      const mockOnSectionChange = vi.fn();
      
      render(
        <SidebarWithRouter 
          activeSection="dashboard" 
          onSectionChange={mockOnSectionChange} 
        />
      );
      
      // WHEN/THEN: Vérifier que tous les autres onglets sont présents
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('CM Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Veille de Marque')).toBeInTheDocument();
      expect(screen.getByText('Inspiration IA')).toBeInTheDocument();
      expect(screen.getByText('Générateur d\'Images')).toBeInTheDocument();
      expect(screen.getByText('Planning éditorial')).toBeInTheDocument();
      expect(screen.getByText('Analyse')).toBeInTheDocument();
      expect(screen.getByText('Bibliothèque')).toBeInTheDocument();
    });
    
    test('DOIT maintenir la structure d\'icônes pour tous les onglets', () => {
      // GIVEN: Sidebar rendu
      const mockOnSectionChange = vi.fn();
      
      render(
        <SidebarWithRouter 
          activeSection="dashboard" 
          onSectionChange={mockOnSectionChange} 
        />
      );
      
      // WHEN/THEN: Vérifier présence des icônes
      expect(screen.getByText('📊')).toBeInTheDocument(); // Dashboard
      expect(screen.getByText('🧠')).toBeInTheDocument(); // CM Dashboard
      expect(screen.getByText('👁️')).toBeInTheDocument(); // Veille de Marque
      expect(screen.getByText('⟨⟩')).toBeInTheDocument(); // P.R.I.S.M Report (nouveau)
      expect(screen.getByText('✨')).toBeInTheDocument(); // Inspiration IA
      expect(screen.getByText('🎨')).toBeInTheDocument(); // Générateur d'Images
      expect(screen.getByText('📅')).toBeInTheDocument(); // Planning éditorial
      expect(screen.getByText('📈')).toBeInTheDocument(); // Analyse
      expect(screen.getByText('📚')).toBeInTheDocument(); // Bibliothèque
    });
  });
}); 