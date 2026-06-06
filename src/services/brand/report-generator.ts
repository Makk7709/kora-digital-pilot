// Brand Analysis Report Generator
// Extracted from monolithic BrandAnalysisService.ts for better organization

import {
  BrandReport,
  PerplexityReport,
  RealMention,
  RealSentiment,
  RealCompetitor,
  RealKeyword,
  RealSWOT,
  RealAlert,
} from '../../types/brand-analysis';

// S3358 : helpers extraits pour éviter les ternaires imbriqués sur tendances.
function trendIndicatorEmoji(trend: 'positive' | 'negative' | string): string {
  if (trend === 'positive') return '📈';
  if (trend === 'negative') return '📉';
  return '📊';
}

function keywordTrendEmoji(trend: 'up' | 'down' | string): string {
  if (trend === 'up') return '📈';
  if (trend === 'down') return '📉';
  return '📊';
}

function formatSentimentTrend(trend: 'positive' | 'negative' | string): string {
  if (trend === 'positive') return '📈 Positive';
  if (trend === 'negative') return '📉 Négative';
  return '📊 Stable';
}

export class BrandReportGenerator {
  async generatePerplexityReport(brandReport: BrandReport): Promise<PerplexityReport> {
    console.log('📝 Génération du rapport Perplexity pour:', brandReport.brandName);

    // Générer un résumé exécutif intelligent
    const executiveSummary = this.generateExecutiveSummary(brandReport);

    // Extraire les insights clés
    const keyInsights = this.extractKeyInsights(brandReport);

    // Analyser la position concurrentielle
    const competitivePosition = this.generateCompetitivePosition(brandReport);

    // Recommandations d'actions
    const recommendedActions = this.generateRecommendedActions(brandReport);

    // Analyses détaillées formatées pour lecture
    const detailedAnalysis = {
      sentiment: this.formatSentimentAnalysis(brandReport.sentiment),
      mentions: this.formatMentionsAnalysis(brandReport.mentions),
      competitors: this.formatCompetitorsAnalysis(brandReport.competitors),
      keywords: this.formatKeywordsAnalysis(brandReport.keywords),
      swot: this.formatSWOTAnalysis(brandReport.swot),
      alerts: this.formatAlertsAnalysis(brandReport.alerts),
    };

    const perplexityReport: PerplexityReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      brandName: brandReport.brandName,
      executiveSummary,
      reputationScore: brandReport.sentiment.overallScore,
      keyInsights,
      competitivePosition,
      recommendedActions,
      detailedAnalysis,
      generatedAt: new Date(),
      isForReading: true,
    };

    console.log('✅ Rapport Perplexity généré avec succès');
    console.log(`📊 Score de réputation: ${perplexityReport.reputationScore}/100`);
    console.log(`💡 ${keyInsights.length} insights clés identifiés`);

    return perplexityReport;
  }

  private generateExecutiveSummary(brandReport: BrandReport): string {
    const { brandName, sentiment, mentions, competitors } = brandReport;

    const sentimentDescription =
      sentiment.overallScore >= 70
        ? 'excellente'
        : sentiment.overallScore >= 50
          ? 'bonne'
          : 'préoccupante';

    const trendDescription =
      sentiment.trend === 'positive'
        ? 'en amélioration'
        : sentiment.trend === 'negative'
          ? 'en dégradation'
          : 'stable';

    const competitiveContext =
      competitors.length > 0
        ? `dans un environnement concurrentiel avec ${competitors.length} acteurs principaux`
        : 'avec une position de marché à clarifier';

    return `
🎯 **Résumé Exécutif - ${brandName}**

La marque ${brandName} présente une réputation ${sentimentDescription} avec un score global de ${sentiment.overallScore}/100, ${trendDescription} ${competitiveContext}.

**Points saillants:**
• ${mentions.length} mentions analysées avec ${sentiment.positive}% de sentiment positif
• Tendance: ${formatSentimentTrend(sentiment.trend)}
• Position concurrentielle: ${competitors.length > 0 ? `Face à ${competitors[0]?.name} et ${competitors.length - 1} autres` : 'À définir'}

**Recommandations immédiates:**
${sentiment.overallScore < 50 ? '🚨 Actions correctives urgentes nécessaires' : '✅ Maintenir et optimiser la stratégie actuelle'}
    `.trim();
  }

  private sentimentInsights(sentiment: BrandReport['sentiment']): string[] {
    if (sentiment.positive > 60) {
      return [`💚 Sentiment très positif (${sentiment.positive}%) - Capital confiance élevé`];
    }
    if (sentiment.negative > 40) {
      return [`⚠️ Sentiment négatif préoccupant (${sentiment.negative}%) - Attention requise`];
    }
    return [];
  }

  private mentionsInsights(mentions: BrandReport['mentions']): string[] {
    if (mentions.length === 0) return [];
    const items: string[] = [];
    const totalReach = mentions.reduce((sum, m) => sum + m.reach, 0);
    const avgReach = Math.round(totalReach / mentions.length);
    if (avgReach > 1000) {
      items.push(
        `📈 Forte visibilité avec une portée moyenne de ${avgReach.toLocaleString()} par mention`,
      );
    }
    const sources = [...new Set(mentions.map((m) => m.source))];
    if (sources.length > 3) {
      items.push(`🌐 Présence diversifiée sur ${sources.length} canaux différents`);
    }
    return items;
  }

  private competitiveInsights(
    competitors: BrandReport['competitors'],
    overallScore: number,
  ): string[] {
    if (competitors.length === 0) return [];
    const topCompetitor = competitors.sort((a, b) => b.sentiment - a.sentiment)[0];
    const brandPosition = competitors.findIndex((c) => c.sentiment < overallScore) + 1;
    if (brandPosition === 1) {
      return [`🏆 Leader en sentiment face à ${competitors.length} concurrents`];
    }
    return [
      `⚔️ Position ${brandPosition}/${competitors.length + 1} derrière ${topCompetitor.name}`,
    ];
  }

  private keywordInsights(keywords: BrandReport['keywords']): string[] {
    const upTrend = keywords.filter((k) => k.trend === 'up');
    if (upTrend.length === 0) return [];
    return [
      `🔥 ${upTrend.length} mots-clés en tendance: ${upTrend
        .slice(0, 3)
        .map((k) => k.word)
        .join(', ')}`,
    ];
  }

  private swotInsights(swot: BrandReport['swot']): string[] {
    const items: string[] = [];
    if (swot.strengths.length > swot.weaknesses.length) {
      items.push(
        `💪 Position forte avec ${swot.strengths.length} forces vs ${swot.weaknesses.length} faiblesses`,
      );
    }
    if (swot.opportunities.length > swot.threats.length) {
      items.push(
        `🌟 Contexte favorable: ${swot.opportunities.length} opportunités vs ${swot.threats.length} menaces`,
      );
    }
    return items;
  }

  private alertInsights(alerts: BrandReport['alerts']): string[] {
    const critical = alerts.filter((a) => a.type === 'critical');
    if (critical.length > 0) {
      return [`🚨 ${critical.length} alerte(s) critique(s) nécessitant une action immédiate`];
    }
    if (alerts.length === 0) {
      return [`✅ Aucune alerte détectée - Situation sous contrôle`];
    }
    return [];
  }

  private extractKeyInsights(brandReport: BrandReport): string[] {
    const { sentiment, mentions, competitors, keywords, swot, alerts } = brandReport;
    const insights: string[] = [
      ...this.sentimentInsights(sentiment),
      ...this.mentionsInsights(mentions),
      ...this.competitiveInsights(competitors, sentiment.overallScore),
      ...this.keywordInsights(keywords),
      ...this.swotInsights(swot),
      ...this.alertInsights(alerts),
    ];

    if (insights.length < 5) {
      const additional = [
        `📊 Analyse basée sur ${mentions.length} sources de données réelles`,
        `🎯 Score de réputation de ${sentiment.overallScore}/100 dans la moyenne du secteur`,
        `🔍 Surveillance continue recommandée pour maintenir cette analyse à jour`,
        `📈 Potentiel d'amélioration identifié dans plusieurs domaines clés`,
      ];
      for (const insight of additional) {
        if (insights.length >= 8) break;
        insights.push(insight);
      }
    }
    return insights.slice(0, 8);
  }

  private generateCompetitivePosition(brandReport: BrandReport): string {
    const { competitors, sentiment, brandName } = brandReport;

    if (competitors.length === 0) {
      return `${brandName} opère dans un secteur où les concurrents directs ne sont pas clairement identifiés, suggérant soit une position de niche, soit un besoin d'analyse concurrentielle approfondie.`;
    }

    const sortedCompetitors = competitors.sort((a, b) => b.sentiment - a.sentiment);
    const brandScore = sentiment.overallScore;

    const betterCompetitors = sortedCompetitors.filter((c) => c.sentiment > brandScore);
    const worseCompetitors = sortedCompetitors.filter((c) => c.sentiment <= brandScore);

    if (betterCompetitors.length === 0) {
      return `🏆 **Position de leader** - ${brandName} surpasse tous les concurrents identifiés avec un score de ${brandScore}/100, devançant ${sortedCompetitors[0]?.name} (${sortedCompetitors[0]?.sentiment}/100). Cette position dominante offre une excellente base pour consolider l'avantage concurrentiel.`;
    }

    if (worseCompetitors.length === 0) {
      return `⚠️ **Position de challenger** - ${brandName} (${brandScore}/100) fait face à des concurrents mieux positionnés, notamment ${sortedCompetitors[0]?.name} (${sortedCompetitors[0]?.sentiment}/100). Des actions stratégiques sont nécessaires pour améliorer la position relative.`;
    }

    return `📊 **Position intermédiaire** - ${brandName} se positionne au milieu du peloton concurrentiel avec ${brandScore}/100, devançant ${worseCompetitors.length} concurrent(s) mais derrière ${betterCompetitors.length} acteur(s). Opportunités d'amélioration identifiées pour progresser vers le leadership.`;
  }

  private sentimentActions(sentiment: BrandReport['sentiment']): string[] {
    if (sentiment.overallScore < 50) {
      return [
        '🚨 Lancer une campagne de gestion de crise pour améliorer la perception',
        '📞 Engager directement avec les détracteurs pour résoudre leurs préoccupations',
      ];
    }
    if (sentiment.positive > 70) {
      return ['🎯 Amplifier les messages positifs via les ambassadeurs satisfaits'];
    }
    return [];
  }

  private mentionsActions(mentions: BrandReport['mentions']): string[] {
    if (mentions.length === 0) return [];
    const items: string[] = [];
    const lowReach = mentions.filter((m) => m.reach < 500);
    if (lowReach.length > mentions.length / 2) {
      items.push('📢 Développer une stratégie de contenu viral pour augmenter la portée');
    }
    if (mentions.some((m) => m.sentiment === 'negative')) {
      items.push('🔧 Analyser et traiter les causes des mentions négatives identifiées');
    }
    return items;
  }

  private competitorsActions(
    competitors: BrandReport['competitors'],
    overallScore: number,
  ): string[] {
    const items: string[] = [];
    if (competitors.length > 0) {
      const top = competitors.sort((a, b) => b.sentiment - a.sentiment)[0];
      if (top.sentiment > overallScore + 10) {
        items.push(
          `🎯 Étudier la stratégie de ${top.name} pour identifier les meilleures pratiques`,
        );
      }
    }
    if (competitors.length > 2) {
      items.push(
        '🔍 Développer une veille concurrentielle systématique pour anticiper les mouvements du marché',
      );
    } else {
      items.push('🕵️ Identifier et analyser de nouveaux concurrents émergents sur le marché');
    }
    return items;
  }

  private socialPresenceActions(mentions: BrandReport['mentions']): string[] {
    const socials = mentions.filter((m) =>
      ['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].includes(m.source),
    );
    return socials.length > 0
      ? ["🤝 Renforcer l'engagement communautaire sur les réseaux sociaux détectés"]
      : ['🌐 Développer une présence sur les réseaux sociaux prioritaires du secteur'];
  }

  private generateRecommendedActions(brandReport: BrandReport): string[] {
    const { sentiment, mentions, competitors, keywords, swot } = brandReport;
    const actions: string[] = [
      ...this.sentimentActions(sentiment),
      ...this.mentionsActions(mentions),
      ...this.competitorsActions(competitors, sentiment.overallScore),
    ];

    const topKeywords = keywords.sort((a, b) => b.count - a.count).slice(0, 3);
    if (topKeywords.length > 0) {
      actions.push(
        `🎯 Renforcer le SEO et le contenu autour des mots-clés performants: ${topKeywords.map((k) => k.word).join(', ')}`,
      );
    }

    if (swot.weaknesses.length > 0) {
      actions.push(`⚡ Adresser la faiblesse prioritaire: ${swot.weaknesses[0]}`);
    }
    if (swot.threats.length > 0) {
      actions.push(`🛡️ Développer une stratégie défensive contre: ${swot.threats[0]}`);
    }

    actions.push(
      "📈 Mettre en place un dashboard de suivi KPI pour monitorer l'évolution du sentiment",
    );

    actions.push(...this.socialPresenceActions(mentions));

    // Actions stratégiques supplémentaires pour atteindre 12+ actions
    const strategicActions = [
      "🎨 Créer un programme d'ambassadeurs de marque pour amplifier les messages positifs",
      "📱 Optimiser l'expérience mobile et développer une app dédiée si pertinent",
      "🔔 Implémenter un système d'alertes en temps réel pour les mentions critiques",
      "📊 Développer des métriques personnalisées pour mesurer l'impact des actions",
      "🎯 Segmenter l'audience pour des campagnes de communication ciblées",
      "💡 Lancer un programme d'innovation ouverte avec les clients",
      "🤖 Utiliser l'IA pour personaliser les interactions client",
      '📝 Créer un content calendar basé sur les tendances identifiées',
      "🔄 Mettre en place un processus d'amélioration continue basé sur les retours",
      '🏢 Développer des partenariats stratégiques pour renforcer la position',
      '📚 Former les équipes aux meilleures pratiques de communication digital',
      '🎪 Organiser des événements pour renforcer la relation client',
    ];

    // Ajouter des actions stratégiques jusqu'à atteindre 12 actions minimum
    let actionIndex = 0;
    while (actions.length < 12 && actionIndex < strategicActions.length) {
      actions.push(strategicActions[actionIndex]);
      actionIndex++;
    }

    // Actions génériques de fallback si vraiment pas assez de données
    if (actions.length < 8) {
      const fallbackActions = [
        '📈 Maintenir la stratégie actuelle et surveiller les évolutions du marché',
        '🔍 Intensifier la veille concurrentielle pour identifier de nouvelles opportunités',
        '💬 Engager proactivement avec la communauté sur les plateformes digitales',
        '📚 Développer une base de connaissances client pour améliorer le service',
      ];

      fallbackActions.forEach((action) => {
        if (actions.length < 12) {
          actions.push(action);
        }
      });
    }

    return actions;
  }

  private formatSentimentAnalysis(sentiment: RealSentiment): string {
    const trendEmoji = trendIndicatorEmoji(sentiment.trend);

    return `${trendEmoji} **Score Global: ${sentiment.overallScore}/100** (Tendance: ${sentiment.trend})
    
🟢 **Positif**: ${sentiment.positive}% - Indique une perception favorable de la marque
🔵 **Neutre**: ${sentiment.neutral}% - Mentions factuelles sans connotation émotionnelle  
🔴 **Négatif**: ${sentiment.negative}% - Points d'amélioration identifiés

*Analyse calculée à partir de données réelles de mentions*`;
  }

  private formatMentionsAnalysis(mentions: RealMention[]): string {
    if (mentions.length === 0) {
      return 'Aucune mention trouvée dans la période analysée.';
    }

    const totalReach = mentions.reduce((sum, m) => sum + m.reach, 0);
    const avgReach = Math.round(totalReach / mentions.length);
    const sources = [...new Set(mentions.map((m) => m.source))];

    const sentimentBreakdown = {
      positive: mentions.filter((m) => m.sentiment === 'positive').length,
      neutral: mentions.filter((m) => m.sentiment === 'neutral').length,
      negative: mentions.filter((m) => m.sentiment === 'negative').length,
    };

    return `📊 **${mentions.length} mentions analysées** - Portée totale: ${totalReach.toLocaleString()}

📈 **Métriques d'engagement**:
- Portée moyenne: ${avgReach.toLocaleString()} par mention
- Sources principales: ${sources.join(', ')}
- Distribution: ${sentimentBreakdown.positive} positives, ${sentimentBreakdown.neutral} neutres, ${sentimentBreakdown.negative} négatives

🔍 **Mentions récentes les plus impactantes**:
${mentions
  .slice(0, 3)
  .map(
    (m, i) =>
      `${i + 1}. [${m.sentiment.toUpperCase()}] "${m.content}" (${m.source}, portée: ${m.reach})`,
  )
  .join('\n')}`;
  }

  private formatCompetitorsAnalysis(competitors: RealCompetitor[]): string {
    if (competitors.length === 0) {
      return "Aucun concurrent direct identifié dans l'analyse actuelle.";
    }

    const sortedCompetitors = competitors.sort((a, b) => b.sentiment - a.sentiment);

    return `⚔️ **${competitors.length} concurrents principaux analysés**

🏆 **Classement par performance**:
${sortedCompetitors
  .map(
    (comp, i) =>
      `${i + 1}. **${comp.name}** - ${comp.sentiment}% de sentiment (${comp.mentions} mentions, ${comp.marketShare}% de part de marché)`,
  )
  .join('\n')}

📊 **Insights concurrentiels**:
- Leader: ${sortedCompetitors[0].name} avec ${sortedCompetitors[0].sentiment}% de sentiment
- Part de voix totale: ${competitors.reduce((sum, c) => sum + c.marketShare, 0)}%
- Moyenne du secteur: ${Math.round(competitors.reduce((sum, c) => sum + c.sentiment, 0) / competitors.length)}%`;
  }

  private formatKeywordsAnalysis(keywords: RealKeyword[]): string {
    if (keywords.length === 0) {
      return 'Aucun mot-clé significatif identifié.';
    }

    const sortedKeywords = keywords.sort((a, b) => b.count - a.count);
    const upTrend = keywords.filter((k) => k.trend === 'up');
    const downTrend = keywords.filter((k) => k.trend === 'down');
    const stable = keywords.filter((k) => k.trend === 'stable');

    return `🔑 **${keywords.length} mots-clés stratégiques identifiés**

📈 **Tendances**:
- 🔥 En hausse (${upTrend.length}): ${upTrend.map((k) => k.word).join(', ') || 'Aucun'}
- 📉 En baisse (${downTrend.length}): ${downTrend.map((k) => k.word).join(', ') || 'Aucun'}  
- 📊 Stables (${stable.length}): ${stable.map((k) => k.word).join(', ') || 'Aucun'}

🎯 **Top mots-clés par volume**:
${sortedKeywords
  .slice(0, 5)
  .map((kw, i) => `${i + 1}. "${kw.word}" - ${kw.count} mentions (${keywordTrendEmoji(kw.trend)})`)
  .join('\n')}`;
  }

  private formatSWOTAnalysis(swot: RealSWOT): string {
    return `🎯 **Analyse SWOT stratégique**

💪 **Forces (${swot.strengths.length})**:
${swot.strengths.map((s) => `• ${s}`).join('\n') || '• Aucune force identifiée'}

⚠️ **Faiblesses (${swot.weaknesses.length})**:
${swot.weaknesses.map((w) => `• ${w}`).join('\n') || '• Aucune faiblesse identifiée'}

🌟 **Opportunités (${swot.opportunities.length})**:
${swot.opportunities.map((o) => `• ${o}`).join('\n') || '• Aucune opportunité identifiée'}

🚨 **Menaces (${swot.threats.length})**:
${swot.threats.map((t) => `• ${t}`).join('\n') || '• Aucune menace identifiée'}

*Analyse générée par IA basée sur les données marché actuelles*`;
  }

  private formatAlertsAnalysis(alerts: RealAlert[]): string {
    if (alerts.length === 0) {
      return '✅ Aucune alerte détectée - Situation sous contrôle.';
    }

    const criticalAlerts = alerts.filter((a) => a.type === 'critical');
    const warningAlerts = alerts.filter((a) => a.type === 'warning');
    const infoAlerts = alerts.filter((a) => a.type === 'info');

    return `🚨 **${alerts.length} alerte(s) détectée(s)**

${
  criticalAlerts.length > 0
    ? `🔴 **Critiques (${criticalAlerts.length})** - Action immédiate requise:
${criticalAlerts.map((a) => `• ${a.message} (${a.source})`).join('\n')}

`
    : ''
}${
      warningAlerts.length > 0
        ? `🟡 **Avertissements (${warningAlerts.length})** - Surveillance recommandée:
${warningAlerts.map((a) => `• ${a.message} (${a.source})`).join('\n')}

`
        : ''
    }${
      infoAlerts.length > 0
        ? `🔵 **Informations (${infoAlerts.length})** - Pour référence:
${infoAlerts.map((a) => `• ${a.message} (${a.source})`).join('\n')}`
        : ''
    }

⏰ **Dernière mise à jour**: ${alerts[0]?.timestamp.toLocaleString('fr-FR') || 'N/A'}`;
  }
}
