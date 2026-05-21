/**
 * 🎯 BRAND ANALYSIS CORE SERVICE
 * Service central pour les analyses de marque - Extraction du monolithe
 * Responsabilité : Analyses objectives, actions récentes, stratégiques
 */

import { PerplexityService, createPerplexityService } from '../../lib/perplexity-service';
import type {
  ObjectiveAnalysis,
  RecentAction,
  StrategicAnalysis,
  TrendAnalysis,
  SectorEvolution,
} from '../../types/BrandIntelligenceTypes';

export class BrandAnalysisCore {
  private perplexityService: PerplexityService;
  private isInitialized = false;

  constructor() {
    // Initialisation avec clé API réelle
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_PERPLEXITY_API_KEY manquante dans .env');
    }

    this.perplexityService = createPerplexityService({
      apiKey,
      model: import.meta.env.VITE_PERPLEXITY_MODEL || 'llama-3.1-sonar-large-128k-online',
      maxTokens: parseInt(import.meta.env.VITE_PERPLEXITY_MAX_TOKENS) || 8000,
      temperature: parseFloat(import.meta.env.VITE_PERPLEXITY_TEMPERATURE) || 0.2,
    });

    this.isInitialized = true;
  }

  /**
   * 📊 ANALYSE OBJECTIVE RÉELLE - Perplexity Search
   */
  async generateRealObjectiveAnalysis(brandName: string): Promise<ObjectiveAnalysis> {
    await this.ensureInitialized();

    const query = `ANALYSE OBJECTIVE COMPLÈTE - ${brandName}

Fournis une analyse factuelle et détaillée incluant:

1. HISTOIRE DE LA MARQUE:
   - Année de fondation et fondateurs
   - Évolution historique et jalons clés
   - Transformations majeures

2. POSITION MARCHÉ ACTUELLE:
   - Secteur d'activité et segments
   - Part de marché et rang concurrentiel
   - Présence géographique

3. SANTÉ FINANCIÈRE:
   - Chiffre d'affaires récent (dernier exercice)
   - Rentabilité et croissance
   - Valorisation si publique

4. MÉTRIQUES QUANTIFIÉES:
   - Index innovation (score 0-100 basé sur brevets, R&D, lancements)
   - Score réputation (0-100 basé sur études, sondages, médias)
   - Nombre d'employés approximatif

Utilise uniquement des données vérifiables et récentes (2023-2024). 
Structure ta réponse avec des sections claires et des chiffres précis.`;

    const response = await this.perplexityService.getBusinessInsights({
      query,
      context: 'Analyse factuelle et objective',
      industry: 'business',
      depth: 'comprehensive',
      language: 'fr',
    });

    return this.parseRealObjectiveAnalysis(response.content, brandName);
  }

  /**
   * 📅 ACTIONS RÉCENTES RÉELLES - 6 derniers mois
   */
  async analyzeRealRecentActions(brandName: string): Promise<RecentAction[]> {
    await this.ensureInitialized();

    const query = `ACTIONS STRATÉGIQUES RÉCENTES - ${brandName} (6 DERNIERS MOIS)

Identifie et documente les actions stratégiques récentes avec:

1. LANCEMENTS PRODUITS/SERVICES:
   - Nouveaux produits depuis juin 2024
   - Mises à jour majeures
   - Innovations importantes

2. PARTENARIATS ET ACQUISITIONS:
   - Nouveaux partenariats stratégiques
   - Acquisitions ou rachats
   - Joint-ventures annoncées

3. EXPANSIONS MARCHÉ:
   - Nouveaux marchés géographiques
   - Nouveaux segments clients
   - Canaux de distribution

4. COMMUNICATIONS CORPORATE:
   - Annonces stratégiques majeures
   - Changements direction/gouvernance
   - Restructurations organisationnelles

5. RÉACTIONS AUX CRISES:
   - Gestion de crises sectorielles
   - Adaptations réglementaires
   - Réponses aux défis marché

Fournis des dates précises et des détails factuels pour chaque action.`;

    const response = await this.perplexityService.getBusinessInsights({
      query,
      context: 'Actions récentes documentées',
      industry: 'business',
      depth: 'comprehensive',
      language: 'fr',
    });

    return this.parseRealRecentActions(response.content, brandName);
  }

  /**
   * 🎯 ANALYSE STRATÉGIQUE APPROFONDIE
   */
  async performRealStrategicAnalysis(brandName: string): Promise<StrategicAnalysis> {
    await this.ensureInitialized();

    const query = `ANALYSE STRATÉGIQUE APPROFONDIE - ${brandName}

Analyse la stratégie actuelle de l'entreprise:

1. STRATÉGIE PRINCIPALE:
   - Mission et vision déclarées
   - Positionnement concurrentiel
   - Avantages concurrentiels clés

2. MARCHÉS CIBLES:
   - Segments clients prioritaires
   - Marchés géographiques
   - Canaux de distribution

3. MODÈLE ÉCONOMIQUE:
   - Sources de revenus principales
   - Structure de coûts
   - Leviers de rentabilité

4. DIRECTION FUTURE:
   - Plans de développement annoncés
   - Investissements prioritaires
   - Objectifs déclarés

5. DÉFIS ET RISQUES:
   - Défis concurrentiels actuels
   - Risques sectoriels
   - Vulnérabilités identifiées

Base ton analyse sur des communications officielles récentes (rapports annuels, conférences, interviews dirigeants).`;

    const response = await this.perplexityService.getBusinessInsights({
      query,
      context: 'Analyse stratégique approfondie',
      industry: 'business',
      depth: 'comprehensive',
      language: 'fr',
    });

    return this.parseRealStrategicAnalysis(response.content, brandName);
  }

  /**
   * 📈 DÉTECTION TENDANCES ET SIGNAUX RÉELS
   */
  async detectRealTrendsAndSignals(brandName: string): Promise<TrendAnalysis> {
    await this.ensureInitialized();

    // D'abord, identifier le secteur d'activité
    const sectorQuery = `Identifie en 2-3 mots clés le secteur d'activité principal de ${brandName} (exemples: automobile électrique, technologie logicielle, pharmaceutique, retail mode, banque numérique, etc.)`;

    const sectorResponse = await this.perplexityService.getBusinessInsights({
      query: sectorQuery,
      context: 'Identification secteur',
      industry: 'business',
      depth: 'quick',
      language: 'fr',
    });

    const sectorKeywords = this.extractSectorKeywords(sectorResponse.content);
    const sectorContext =
      sectorKeywords.length > 0 ? sectorKeywords.join(', ') : 'business général';

    // Puis, requête spécifique au secteur identifié
    const query = `TENDANCES ET SIGNAUX FAIBLES SECTORIELS - ${brandName}

CONTEXTE SECTORIEL: ${brandName} opère dans le secteur: ${sectorContext}

1. TENDANCES SECTORIELLES SPÉCIFIQUES (${sectorContext}):
   - Évolutions technologiques spécifiques à ce secteur
   - Nouvelles réglementations affectant ${sectorContext}
   - Changements dans les pratiques du secteur ${sectorContext}
   - Consolidation/fragmentation spécifique à ce marché
   - Nouveaux standards émergents dans ${sectorContext}

2. SIGNAUX FAIBLES SECTORIELS (${sectorContext}):
   - Innovations disruptives émergentes dans ${sectorContext}
   - Nouveaux business models dans ce secteur
   - Startups innovantes dans ${sectorContext}
   - Changements dans la chaîne de valeur sectorielle
   - Shifts clients spécifiques à ${sectorContext}

3. OPPORTUNITÉS SECTORIELLES (${sectorContext}):
   - Segments en expansion dans ${sectorContext}
   - Technologies prometteuses pour ${sectorContext}
   - Nouveaux marchés géographiques pour ce secteur
   - Partenariats stratégiques sectoriels
   - Niches inexploitées dans ${sectorContext}

4. MENACES DISRUPTIVES SECTORIELLES (${sectorContext}):
   - Substituts technologiques pour ${sectorContext}
   - Nouveaux entrants disruptifs dans ce secteur
   - Changements réglementaires spécifiques à ${sectorContext}
   - Pressions ESG particulières à ce secteur
   - Crises potentielles du secteur ${sectorContext}

FOCUS: Analyse uniquement les tendances pertinentes pour ${brandName} dans le contexte de ${sectorContext}.
EXCLUSION: Évite les tendances génériques business non applicables à ce secteur spécifique.
PÉRIODE: Focus sur les 12 derniers mois avec impact potentiel sur ${brandName}.`;

    const response = await this.perplexityService.getBusinessInsights({
      query,
      context: `Détection tendances sectorielles - ${sectorContext}`,
      industry: 'business',
      depth: 'comprehensive',
      language: 'fr',
    });

    return this.parseRealTrendAnalysis(response.content, brandName);
  }

  // === MÉTHODES UTILITAIRES PRIVÉES ===

  private extractSectorKeywords(content: string): string[] {
    const keywords: string[] = [];

    // Patterns pour extraire les mots-clés sectoriels
    const sectorPatterns = [
      /secteur\s+([a-zA-ZÀ-ÿ\s]+)/gi,
      /domaine\s+([a-zA-ZÀ-ÿ\s]+)/gi,
      /industrie\s+([a-zA-ZÀ-ÿ\s]+)/gi,
      /marché\s+([a-zA-ZÀ-ÿ\s]+)/gi,
      /spécialisé\s+dans\s+([a-zA-ZÀ-ÿ\s]+)/gi,
      /actif\s+dans\s+([a-zA-ZÀ-ÿ\s]+)/gi,
    ];

    sectorPatterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const keyword = match[1].trim();
        if (keyword.length > 3 && keyword.length < 30) {
          keywords.push(keyword);
        }
      }
    });

    // Fallback: recherche de mots-clés communs
    const commonSectors = [
      'automobile',
      'technologie',
      'pharmaceutique',
      'finance',
      'retail',
      'énergie',
      'télécommunications',
      'aéronautique',
      'construction',
      'alimentaire',
      'logistique',
      'santé',
      'éducation',
      'immobilier',
      'luxe',
    ];

    commonSectors.forEach((sector) => {
      if (content.toLowerCase().includes(sector)) {
        keywords.push(sector);
      }
    });

    return [...new Set(keywords)].slice(0, 3); // Dédupliquer et limiter
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('BrandAnalysisCore non initialisé');
    }
  }

  // === MÉTHODES DE PARSING ===

  private parseRealObjectiveAnalysis(content: string, _brandName?: string): ObjectiveAnalysis {
    const cleanedContent = this.cleanRawContent(content);

    return {
      brandHistory: {
        foundingYear: this.extractFoundingYear(cleanedContent),
        founders: this.extractFounders(cleanedContent),
        keyMilestones: this.extractMilestones(cleanedContent).map((milestone) => ({
          year: milestone.year,
          event: milestone.event,
          impact: 'moderate' as const,
        })),
        evolution: this.extractEvolution(cleanedContent),
      },
      marketPosition: {
        sector: [this.extractSection(cleanedContent, 'secteur', 'Non spécifié')],
        markets: this.extractMarkets(cleanedContent),
        globalRank: this.extractGlobalRank(cleanedContent),
        marketCap: this.extractMarketCap(cleanedContent),
        employeeCount: this.extractEmployeeCount(cleanedContent),
      },
      financialHealth: {
        revenue: this.extractRevenue(cleanedContent),
        profitability: this.extractProfitability(cleanedContent),
        growth: this.extractScore(cleanedContent, 'croissance', 5),
        valuation: this.extractValuation(cleanedContent),
      },
      metrics: {
        innovationIndex: this.extractScore(cleanedContent, 'innovation', 50),
        reputationScore: this.extractScore(cleanedContent, 'réputation', 50),
        marketShare: this.extractScore(cleanedContent, 'part de marché', 10),
      },
    };
  }

  private parseRealRecentActions(content: string, _brandName?: string): RecentAction[] {
    const cleanedContent = this.cleanRawContent(content);
    const actions: RecentAction[] = [];

    // Diviser le contenu en sections d'actions
    const sections = cleanedContent.split(/\n(?=\d+\.|-|\*)/);

    sections.forEach((section) => {
      if (section.trim().length > 50) {
        // Ignorer les sections trop courtes
        const actionText = section.trim();

        // Extraire la date si présente
        const dateMatch = actionText.match(
          /(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4})/i,
        );

        const action: RecentAction = {
          date: dateMatch ? this.parseDate(dateMatch[0]) : new Date(),
          title: this.extractSection(
            actionText,
            '',
            actionText.split('.')[0] || actionText.substring(0, 100),
          ),
          description: actionText,
          type: this.classifyActionType(actionText),
          impact: this.estimateImpact(actionText),
          stakeholders: this.identifyStakeholders(actionText),
          scope: this.determineScope(actionText),
          source: 'Perplexity Search',
        };

        actions.push(action);
      }
    });

    return actions.slice(0, 10); // Limiter à 10 actions les plus récentes
  }

  private parseRealStrategicAnalysis(content: string, _brandName?: string): StrategicAnalysis {
    const cleanedContent = this.cleanRawContent(content);

    return {
      businessModel: {
        type: this.extractSection(cleanedContent, 'modèle économique', 'B2B/B2C'),
        revenueStreams: [this.extractSection(cleanedContent, 'revenus', 'Diversifiés')],
        keyPartners: this.extractMarkets(cleanedContent),
        valueProposition: this.extractSection(cleanedContent, 'valeur', 'Innovation et qualité'),
        costStructure: this.extractSection(cleanedContent, 'coûts', 'Optimisée'),
      },
      competitiveAdvantages: this.extractAdvantages(cleanedContent),
      strategicRisks: this.extractRisks(cleanedContent),
      priorities: this.extractPriorities(cleanedContent).map((priority) => ({
        priority: priority.description,
        timeline: priority.timeframe || '2024-2025',
        importance: 'high' as const,
      })),
    };
  }

  private parseRealTrendAnalysis(content: string, _brandName?: string): TrendAnalysis {
    const cleanedContent = this.cleanRawContent(content);

    return {
      sectorEvolution: this.extractSectorEvolution(cleanedContent),
      emergingTrends: this.extractEmergingTrends(cleanedContent).map((trend) => ({
        trend: trend.description,
        relevance: 75,
        timeline: trend.timeframe || '6-18 mois',
        impact: 'evolutionary' as const,
      })),
      weakSignals: this.extractWeakSignals(cleanedContent).map((signal) => ({
        signal: signal.description,
        strength: 60,
        implications: [signal.description],
      })),
      disruptiveThreats: this.extractDisruptiveThreats(cleanedContent).map((threat) => ({
        threat: threat.description,
        probability: 50,
        timeframe: threat.timeframe || '12-36 mois',
        mitigation: ['Surveillance continue', 'Adaptation stratégique'],
      })),
      opportunities: this.extractOpportunities(cleanedContent).map((opp) => ({
        opportunity: opp.description,
        potential: 70,
        requirements: [opp.requirements],
        risks: ['Investissement nécessaire'],
      })),
    };
  }

  // === MÉTHODES D'EXTRACTION UTILITAIRES ===

  private cleanRawContent(content: string): string {
    if (!content) return content;

    const cleanupPatterns = [
      /Tu es Perplexity, un assistant de recherche utile formé par Perplexity AI\.[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      /Ta tâche est de rédiger une réponse précise[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      /Suis ces instructions pour formuler ta réponse[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      /KORA[\s]*$/gm,
      /===== ENRICHISSEMENT CONTEXTUEL =====[\s\S]*?(?=\n\n|\n[^=])/gi,
      /SYNTHÈSE STRATÉGIQUE:[\s\S]*$/gi,
      /RECOMMANDATIONS OPÉRATIONNELLES:[\s\S]*$/gi,
      /selon les instructions|conformément aux directives|comme demandé/gi,
      /^\s*[=-]{3,}\s*$/gm,
    ];

    let cleanedContent = content;
    cleanupPatterns.forEach((pattern) => {
      cleanedContent = cleanedContent.replace(pattern, '');
    });

    return cleanedContent
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{3,}/g, ' ')
      .trim();
  }

  private extractSection(content: string, keyword: string, fallback: string): string {
    if (!keyword) return content.substring(0, 100);

    const regex = new RegExp(`(?:${keyword})[:\\s]*([^\\n\\r]*(?:[\\n\\r][^\\n\\r]*){0,2})`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : fallback;
  }

  private extractMilestones(content: string): any[] {
    const milestones: any[] = [];
    const lines = content.split('\n');

    lines.forEach((line) => {
      const yearMatch = line.match(/(\d{4})/);
      if (yearMatch && line.length > 20) {
        milestones.push({
          year: parseInt(yearMatch[1]),
          event: line.replace(/^\d+\.?\s*/, '').trim(),
        });
      }
    });

    return milestones.slice(0, 5);
  }

  private extractMarketCap(content: string): number | undefined {
    const capMatch = content.match(/capitalisation.*?(\d+(?:,\d+)?)\s*(?:milliards?|millions?)/i);
    return capMatch ? parseFloat(capMatch[1].replace(',', '.')) : undefined;
  }

  private extractEmployeeCount(content: string): number | undefined {
    const employeeMatch = content.match(/(\d+(?:,\d+)?)\s*(?:employés?|salariés?)/i);
    return employeeMatch ? parseInt(employeeMatch[1].replace(',', '')) : undefined;
  }

  private extractMarkets(content: string): string[] {
    const markets: string[] = [];
    const patterns = [
      /marchés?\s+([^.]+)/gi,
      /présence\s+(?:géographique|dans)\s+([^.]+)/gi,
      /opère\s+(?:en|dans)\s+([^.]+)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const market = match[1].trim();
        if (market.length > 3 && market.length < 50) {
          markets.push(market);
        }
      }
    });

    return [...new Set(markets)].slice(0, 5);
  }

  private extractAdvantages(content: string): string[] {
    const advantages: string[] = [];
    const patterns = [
      /avantages?\s+(?:concurrentiels?|clés?)\s*:?\s*([^.]+)/gi,
      /forces?\s*:?\s*([^.]+)/gi,
      /atouts?\s*:?\s*([^.]+)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const advantage = match[1].trim();
        if (advantage.length > 10) {
          advantages.push(advantage);
        }
      }
    });

    return advantages.slice(0, 5);
  }

  private extractRisks(content: string): string[] {
    const risks: string[] = [];
    const patterns = [
      /risques?\s*:?\s*([^.]+)/gi,
      /menaces?\s*:?\s*([^.]+)/gi,
      /défis?\s*:?\s*([^.]+)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const risk = match[1].trim();
        if (risk.length > 10) {
          risks.push(risk);
        }
      }
    });

    return risks.slice(0, 5);
  }

  private extractPriorities(content: string): any[] {
    const priorities: any[] = [];
    const lines = content.split('\n');

    lines.forEach((line) => {
      if (
        (line.includes('priorité') || line.includes('objectif') || line.includes('plan')) &&
        line.length > 20
      ) {
        priorities.push({
          description: line.trim(),
          timeframe: '2024-2025',
          importance: 'high',
        });
      }
    });

    return priorities.slice(0, 5);
  }

  private extractSectorEvolution(content: string): SectorEvolution {
    return {
      currentTrends: this.extractCurrentTrends(content),
      futureProjections: this.extractFutureProjections(content),
      disruptionPotential: this.extractDisruptionPotential(content),
      growthRate: this.extractGrowthRate(content),
      maturity: this.determineSectorMaturity(content),
      keyPlayers: this.extractCompetitors(content),
      regulatoryChanges: this.extractRegulatoryChanges(content),
      technologicalDisruptions: this.extractTechnologicalDisruptions(content),
    };
  }

  private extractEmergingTrends(content: string): any[] {
    const trends: any[] = [];
    const patterns = [
      /tendances?\s+émergentes?\s*:?\s*([^.]+)/gi,
      /nouvelles?\s+tendances?\s*:?\s*([^.]+)/gi,
      /évolutions?\s+récentes?\s*:?\s*([^.]+)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        trends.push({
          description: match[1].trim(),
          impact: 'medium',
          timeframe: '6-18 mois',
        });
      }
    });

    return trends.slice(0, 5);
  }

  private extractWeakSignals(content: string): any[] {
    const signals: any[] = [];
    const patterns = [
      /signaux?\s+faibles?\s*:?\s*([^.]+)/gi,
      /innovations?\s+émergentes?\s*:?\s*([^.]+)/gi,
      /nouveaux?\s+entrants?\s*:?\s*([^.]+)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        signals.push({
          description: match[1].trim(),
          probability: 'medium',
          timeframe: '12-24 mois',
        });
      }
    });

    return signals.slice(0, 5);
  }

  private extractDisruptiveThreats(content: string): any[] {
    const threats: any[] = [];
    const patterns = [
      /menaces?\s+disruptives?\s*:?\s*([^.]+)/gi,
      /substituts?\s*:?\s*([^.]+)/gi,
      /disruptions?\s*:?\s*([^.]+)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        threats.push({
          description: match[1].trim(),
          severity: 'medium',
          timeframe: '12-36 mois',
        });
      }
    });

    return threats.slice(0, 5);
  }

  private extractOpportunities(content: string): any[] {
    const opportunities: any[] = [];
    const patterns = [
      /opportunités?\s*:?\s*([^.]+)/gi,
      /potentiel\s+de\s+([^.]+)/gi,
      /nouvelles?\s+niches?\s*:?\s*([^.]+)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        opportunities.push({
          description: match[1].trim(),
          potential: 'high',
          requirements: 'Investment and focus',
        });
      }
    });

    return opportunities.slice(0, 5);
  }

  private extractCurrentTrends(content: string): string[] {
    const trends: string[] = [];
    const patterns = [
      /tendances?\s+actuelles?\s*:?\s*([^.]+)/gi,
      /évolutions?\s+en\s+cours\s*:?\s*([^.]+)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        trends.push(match[1].trim());
      }
    });

    return trends.slice(0, 3);
  }

  private extractFutureProjections(content: string): string[] {
    const projections: string[] = [];
    const patterns = [/projections?\s*:?\s*([^.]+)/gi, /perspectives?\s+d'avenir\s*:?\s*([^.]+)/gi];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        projections.push(match[1].trim());
      }
    });

    return projections.slice(0, 3);
  }

  private extractDisruptionPotential(content: string): 'low' | 'medium' | 'high' {
    if (
      content.toLowerCase().includes('forte disruption') ||
      content.toLowerCase().includes('révolution')
    ) {
      return 'high';
    } else if (
      content.toLowerCase().includes('évolution') ||
      content.toLowerCase().includes('changement')
    ) {
      return 'medium';
    }
    return 'low';
  }

  private extractGrowthRate(content: string): number {
    const growthMatch = content.match(/croissance.*?(\d+(?:\.\d+)?)\s*%/i);
    return growthMatch ? parseFloat(growthMatch[1]) : 5.0;
  }

  private determineSectorMaturity(content: string): 'emerging' | 'growth' | 'mature' | 'declining' {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('émergent') || lowerContent.includes('nouveau')) return 'emerging';
    if (lowerContent.includes('croissance') || lowerContent.includes('expansion')) return 'growth';
    if (lowerContent.includes('mature') || lowerContent.includes('établi')) return 'mature';
    if (lowerContent.includes('déclin') || lowerContent.includes('baisse')) return 'declining';
    return 'mature';
  }

  private extractCompetitors(content: string): any[] {
    const competitors: any[] = [];
    const patterns = [
      /concurrents?\s+principaux?\s*:?\s*([^.]+)/gi,
      /acteurs?\s+clés?\s*:?\s*([^.]+)/gi,
      /leaders?\s+du\s+marché\s*:?\s*([^.]+)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const competitorText = match[1].trim();
        const names = competitorText.split(/,|\s+et\s+/);
        names.forEach((name) => {
          if (name.trim().length > 2) {
            competitors.push({
              name: name.trim(),
              position: 'Competitive',
              marketShare: undefined,
            });
          }
        });
      }
    });

    return competitors.slice(0, 5);
  }

  private extractRegulatoryChanges(content: string): string[] {
    const changes: string[] = [];
    const patterns = [
      /réglementations?\s+nouvelles?\s*:?\s*([^.]+)/gi,
      /changements?\s+réglementaires?\s*:?\s*([^.]+)/gi,
      /nouvelles?\s+lois?\s*:?\s*([^.]+)/gi,
      /régulation\s*:?\s*([^.]+)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const change = match[1].trim();
        if (change.length > 10) {
          changes.push(change);
        }
      }
    });

    return changes.slice(0, 3);
  }

  private extractTechnologicalDisruptions(content: string): string[] {
    const disruptions: string[] = [];
    const patterns = [
      /disruptions?\s+technologiques?\s*:?\s*([^.]+)/gi,
      /innovations?\s+disruptives?\s*:?\s*([^.]+)/gi,
      /nouvelles?\s+technologies?\s*:?\s*([^.]+)/gi,
      /transformation\s+digitale\s*:?\s*([^.]+)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const disruption = match[1].trim();
        if (disruption.length > 10) {
          disruptions.push(disruption);
        }
      }
    });

    return disruptions.slice(0, 3);
  }

  private extractScore(content: string, keyword: string, fallback: number): number {
    const scoreMatch = content.match(new RegExp(`${keyword}.*?(\\d+)`, 'i'));
    return scoreMatch ? parseInt(scoreMatch[1]) : fallback;
  }

  private extractFoundingYear(content: string): number {
    const yearMatch = content.match(/(?:fondée?|créée?|établie?).*?(\d{4})/i);
    return yearMatch ? parseInt(yearMatch[1]) : 2000;
  }

  private extractFounders(content: string): string[] {
    const founders: string[] = [];
    const founderMatch = content.match(/(?:fondateurs?|créateurs?)\s*:?\s*([^.]+)/gi);
    if (founderMatch) {
      founderMatch.forEach((match) => {
        const names = match.replace(/fondateurs?|créateurs?/gi, '').trim();
        if (names.length > 3) {
          founders.push(names);
        }
      });
    }
    return founders.slice(0, 3);
  }

  private extractEvolution(content: string): string[] {
    const evolution: string[] = [];
    const patterns = [
      /évolution\s*:?\s*([^.]+)/gi,
      /jalons?\s*:?\s*([^.]+)/gi,
      /transformations?\s*:?\s*([^.]+)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        evolution.push(match[1].trim());
      }
    });

    return evolution.slice(0, 5);
  }

  private extractGlobalRank(content: string): number | undefined {
    const rankMatch = content.match(/rang\s+(?:mondial|global)\s*:?\s*(\d+)/i);
    return rankMatch ? parseInt(rankMatch[1]) : undefined;
  }

  private extractRevenue(content: string): number | undefined {
    const revenueMatch = content.match(
      /chiffre\s+d'affaires.*?(\d+(?:,\d+)?)\s*(?:milliards?|millions?)/i,
    );
    return revenueMatch ? parseFloat(revenueMatch[1].replace(',', '.')) : undefined;
  }

  private extractProfitability(content: string): string {
    if (
      content.toLowerCase().includes('bénéfice') ||
      content.toLowerCase().includes('profitable')
    ) {
      return 'Profitable';
    } else if (
      content.toLowerCase().includes('perte') ||
      content.toLowerCase().includes('déficit')
    ) {
      return 'En perte';
    }
    return 'Stable';
  }

  private extractValuation(content: string): number | undefined {
    const valuationMatch = content.match(
      /valorisation.*?(\d+(?:,\d+)?)\s*(?:milliards?|millions?)/i,
    );
    return valuationMatch ? parseFloat(valuationMatch[1].replace(',', '.')) : undefined;
  }

  private parseDate(dateStr: string): Date {
    // Essayer de parser différents formats de date
    const formats = [
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      /(\d{4})-(\d{2})-(\d{2})/,
      /(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i,
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        if (format === formats[0]) {
          // DD/MM/YYYY
          return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
        } else if (format === formats[1]) {
          // YYYY-MM-DD
          return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        } else if (format === formats[2]) {
          // DD mois YYYY
          const months = [
            'janvier',
            'février',
            'mars',
            'avril',
            'mai',
            'juin',
            'juillet',
            'août',
            'septembre',
            'octobre',
            'novembre',
            'décembre',
          ];
          const monthIndex = months.indexOf(match[2].toLowerCase());
          return new Date(parseInt(match[3]), monthIndex, parseInt(match[1]));
        }
      }
    }

    return new Date(); // Fallback to current date
  }

  private classifyActionType(
    text: string,
  ):
    | 'product'
    | 'partnership'
    | 'acquisition'
    | 'strategy'
    | 'marketing'
    | 'crisis'
    | 'regulation' {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('produit') || lowerText.includes('lancement')) return 'product';
    if (lowerText.includes('partenariat') || lowerText.includes('alliance')) return 'partnership';
    if (lowerText.includes('acquisition') || lowerText.includes('rachat')) return 'acquisition';
    if (lowerText.includes('stratégie') || lowerText.includes('restructuration')) return 'strategy';
    if (lowerText.includes('marketing') || lowerText.includes('communication')) return 'marketing';
    if (lowerText.includes('crise') || lowerText.includes('problème')) return 'crisis';
    if (lowerText.includes('réglementation') || lowerText.includes('loi')) return 'regulation';
    return 'strategy';
  }

  private estimateImpact(text: string): number {
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes('majeur') ||
      lowerText.includes('important') ||
      lowerText.includes('révolutionnaire')
    )
      return 80;
    if (lowerText.includes('significatif') || lowerText.includes('notable')) return 65;
    if (lowerText.includes('mineur') || lowerText.includes('petit')) return 30;
    return 50; // Impact moyen par défaut
  }

  private identifyStakeholders(text: string): string[] {
    const stakeholders: string[] = [];
    const lowerText = text.toLowerCase();

    if (lowerText.includes('client') || lowerText.includes('consommateur'))
      stakeholders.push('Clients');
    if (lowerText.includes('employé') || lowerText.includes('personnel'))
      stakeholders.push('Employés');
    if (lowerText.includes('actionnaire') || lowerText.includes('investisseur'))
      stakeholders.push('Actionnaires');
    if (lowerText.includes('partenaire')) stakeholders.push('Partenaires');
    if (lowerText.includes('régulateur') || lowerText.includes('autorité'))
      stakeholders.push('Régulateurs');

    return stakeholders.length > 0 ? stakeholders : ['Parties prenantes générales'];
  }

  private determineScope(text: string): 'local' | 'national' | 'regional' | 'global' {
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes('mondial') ||
      lowerText.includes('global') ||
      lowerText.includes('international')
    )
      return 'global';
    if (lowerText.includes('européen') || lowerText.includes('régional')) return 'regional';
    if (lowerText.includes('national') || lowerText.includes('france')) return 'national';
    return 'local';
  }

  private categorizeActionType(
    text: string,
  ):
    | 'product'
    | 'partnership'
    | 'acquisition'
    | 'strategy'
    | 'marketing'
    | 'crisis'
    | 'regulation' {
    return this.classifyActionType(text);
  }
}

export const brandAnalysisCore = new BrandAnalysisCore();
