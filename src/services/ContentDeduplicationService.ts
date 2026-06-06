/**
 * 🧹 SERVICE DE DÉDUPLICATION DE CONTENU
 * Service intelligent pour détecter et supprimer les contenus répétés
 * dans les rapports d'intelligence business
 */

export interface ContentDuplication {
  originalIndex: number;
  duplicateIndex: number;
  similarity: number;
  contentType: 'section' | 'paragraph' | 'sentence';
  recommendation: 'remove' | 'merge' | 'keep_original';
}

export interface DeduplicationResult {
  originalContentLength: number;
  cleanedContentLength: number;
  duplicationsFound: ContentDuplication[];
  duplicationsRemoved: number;
  qualityScore: number;
  cleanedContent: string;
}

export class ContentDeduplicationService {
  private readonly SIMILARITY_THRESHOLD = 0.85; // 85% de similitude = duplication
  private readonly MIN_LENGTH_FOR_COMPARISON = 50; // Minimum 50 caractères pour comparer

  /**
   * Déduplication principale du contenu de rapport
   */
  async deduplicateReportContent(report: any): Promise<any> {
    console.log('🧹 Démarrage déduplication contenu rapport...');

    try {
      const cleanedReport = { ...report };

      // Déduplication des sections principales
      if (report.rawData) {
        cleanedReport.rawData = this.deduplicateRawData(report.rawData);
      }

      // Déduplication des analyses
      if (report.objectiveAnalysis) {
        cleanedReport.objectiveAnalysis = this.deduplicateObjectiveAnalysis(
          report.objectiveAnalysis,
        );
      }

      if (report.strategicAnalysis) {
        cleanedReport.strategicAnalysis = this.deduplicateStrategicAnalysis(
          report.strategicAnalysis,
        );
      }

      // Déduplication des listes (recommandations, alertes)
      if (report.recommendations) {
        cleanedReport.recommendations = this.deduplicateArray(report.recommendations, 'title');
      }

      if (report.alerts?.critical) {
        cleanedReport.alerts.critical = this.deduplicateArray(report.alerts.critical, 'metric');
      }

      if (report.alerts?.warning) {
        cleanedReport.alerts.warning = this.deduplicateArray(report.alerts.warning, 'metric');
      }

      console.log('✅ Déduplication terminée avec succès');
      return cleanedReport;
    } catch (error) {
      console.error('❌ Erreur déduplication:', error);
      return report; // Retourner l'original en cas d'erreur
    }
  }

  /**
   * Analyse détaillée de la déduplication avec rapport
   */
  analyzeContentDuplication(content: string): DeduplicationResult {
    const originalLength = content.length;
    const paragraphs = this.splitIntoParagraphs(content);
    const duplications: ContentDuplication[] = [];

    // Détecter les paragraphes dupliqués
    for (let i = 0; i < paragraphs.length; i++) {
      for (let j = i + 1; j < paragraphs.length; j++) {
        const similarity = this.calculateSimilarity(paragraphs[i], paragraphs[j]);

        if (
          similarity >= this.SIMILARITY_THRESHOLD &&
          paragraphs[i].length >= this.MIN_LENGTH_FOR_COMPARISON
        ) {
          duplications.push({
            originalIndex: i,
            duplicateIndex: j,
            similarity,
            contentType: 'paragraph',
            recommendation: similarity > 0.95 ? 'remove' : 'merge',
          });
        }
      }
    }

    // Nettoyer le contenu
    const cleanedParagraphs = this.removeDuplicatedParagraphs(paragraphs, duplications);
    const cleanedContent = cleanedParagraphs.join('\n\n');

    // Calculer le score de qualité
    const qualityScore = this.calculateQualityScore(
      originalLength,
      cleanedContent.length,
      duplications.length,
    );

    return {
      originalContentLength: originalLength,
      cleanedContentLength: cleanedContent.length,
      duplicationsFound: duplications,
      duplicationsRemoved: duplications.filter((d) => d.recommendation === 'remove').length,
      qualityScore,
      cleanedContent,
    };
  }

  /**
   * Déduplication des données brutes
   */
  private deduplicateRawData(rawData: any): any {
    const cleaned = { ...rawData };

    // Déduplication entre les différentes analyses
    const analyses = [
      'objectiveAnalysis',
      'strategicAnalysis',
      'competitiveAnalysis',
      'trendAnalysis',
    ];

    const processedContents = new Map<string, string>();

    analyses.forEach((key) => {
      if (cleaned[key]) {
        const deduplicationResult = this.analyzeContentDuplication(cleaned[key]);

        // Vérifier la similitude avec d'autres analyses déjà traitées
        let isDuplicate = false;
        for (const [existingKey, existingContent] of processedContents) {
          const similarity = this.calculateSimilarity(cleaned[key], existingContent);
          if (similarity > 0.7) {
            console.log(
              `⚠️ Contenu similaire détecté entre ${key} et ${existingKey} (${(similarity * 100).toFixed(1)}%)`,
            );
            // Merger intelligemment les contenus
            cleaned[key] = this.mergeSmartContent(cleaned[key], existingContent);
            isDuplicate = true;
            break;
          }
        }

        if (!isDuplicate) {
          cleaned[key] = deduplicationResult.cleanedContent;
          processedContents.set(key, cleaned[key]);
        }
      }
    });

    return cleaned;
  }

  /**
   * Déduplication des analyses objectives
   */
  private deduplicateObjectiveAnalysis(analysis: any): any {
    const cleaned = { ...analysis };

    // Déduplication des textes narratifs
    if (cleaned.brandHistory) {
      cleaned.brandHistory = this.analyzeContentDuplication(cleaned.brandHistory).cleanedContent;
    }

    if (cleaned.marketPosition) {
      cleaned.marketPosition = this.analyzeContentDuplication(
        cleaned.marketPosition,
      ).cleanedContent;
    }

    // Éviter la duplication entre brandHistory et marketPosition
    if (cleaned.brandHistory && cleaned.marketPosition) {
      const similarity = this.calculateSimilarity(cleaned.brandHistory, cleaned.marketPosition);
      if (similarity > 0.6) {
        console.log(
          `⚠️ Similitude détectée entre brandHistory et marketPosition (${(similarity * 100).toFixed(1)}%)`,
        );
        cleaned.marketPosition = this.extractUniqueContent(
          cleaned.marketPosition,
          cleaned.brandHistory,
        );
      }
    }

    return cleaned;
  }

  /**
   * Déduplication des analyses stratégiques
   */
  private deduplicateStrategicAnalysis(analysis: any): any {
    const cleaned = { ...analysis };

    // Déduplication des priorités
    if (cleaned.priorities && Array.isArray(cleaned.priorities)) {
      cleaned.priorities = this.deduplicateArray(cleaned.priorities, 'area');
    }

    // Déduplication des avantages et risques
    if (cleaned.competitiveAdvantages && Array.isArray(cleaned.competitiveAdvantages)) {
      cleaned.competitiveAdvantages = [...new Set(cleaned.competitiveAdvantages)];
    }

    if (cleaned.strategicRisks && Array.isArray(cleaned.strategicRisks)) {
      cleaned.strategicRisks = [...new Set(cleaned.strategicRisks)];
    }

    return cleaned;
  }

  /**
   * Déduplication des tableaux d'objets
   */
  private deduplicateArray<T extends Record<string, any>>(array: T[], keyField: string): T[] {
    if (!Array.isArray(array)) return array;

    const seen = new Set<string>();
    const result: T[] = [];

    for (const item of array) {
      const key = item[keyField]?.toString().toLowerCase() || JSON.stringify(item);

      if (!seen.has(key)) {
        seen.add(key);
        result.push(item);
      } else {
        console.log(`🔄 Doublon supprimé dans array: ${key}`);
      }
    }

    return result;
  }

  /**
   * Calcul de similitude entre deux textes (Cosine Similarity approximée)
   */
  private calculateSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0;

    // Normalisation
    const normalize = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const norm1 = normalize(text1);
    const norm2 = normalize(text2);

    if (norm1 === norm2) return 1;

    // Jaccard Similarity pour une approximation rapide
    const words1 = new Set(norm1.split(' '));
    const words2 = new Set(norm2.split(' '));

    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  /**
   * Division du texte en paragraphes intelligente
   */
  private splitIntoParagraphs(content: string): string[] {
    return content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 10); // Ignorer les paragraphes trop courts
  }

  /**
   * Suppression des paragraphes dupliqués
   */
  private removeDuplicatedParagraphs(
    paragraphs: string[],
    duplications: ContentDuplication[],
  ): string[] {
    const indicesToRemove = new Set(
      duplications.filter((d) => d.recommendation === 'remove').map((d) => d.duplicateIndex),
    );

    return paragraphs.filter((_, index) => !indicesToRemove.has(index));
  }

  /**
   * Fusion intelligente de contenus similaires
   */
  private findBestMatchIndex(
    candidate: string,
    pool: string[],
    used: Set<number>,
    threshold = 0.7,
  ): number {
    let bestIndex = -1;
    let bestSimilarity = threshold;
    for (let i = 0; i < pool.length; i++) {
      if (used.has(i)) continue;
      const similarity = this.calculateSimilarity(candidate, pool[i]);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestIndex = i;
      }
    }
    return bestIndex;
  }

  private mergeSmartContent(content1: string, content2: string): string {
    const paragraphs1 = this.splitIntoParagraphs(content1);
    const paragraphs2 = this.splitIntoParagraphs(content2);

    const mergedParagraphs: string[] = [];
    const used2 = new Set<number>();

    for (const p1 of paragraphs1) {
      const bestMatch = this.findBestMatchIndex(p1, paragraphs2, used2);
      if (bestMatch >= 0) {
        mergedParagraphs.push(this.mergeTwoParagraphs(p1, paragraphs2[bestMatch]));
        used2.add(bestMatch);
      } else {
        mergedParagraphs.push(p1);
      }
    }

    paragraphs2.forEach((p2, i) => {
      if (!used2.has(i)) {
        mergedParagraphs.push(p2);
      }
    });

    return mergedParagraphs.join('\n\n');
  }

  /**
   * Fusion de deux paragraphes similaires
   */
  private mergeTwoParagraphs(p1: string, p2: string): string {
    // Prendre le paragraphe le plus long/détaillé
    if (p2.length > p1.length * 1.2) {
      return p2;
    }
    return p1;
  }

  /**
   * Extraction du contenu unique d'un texte par rapport à un autre
   */
  private extractUniqueContent(mainText: string, referenceText: string): string {
    const mainParagraphs = this.splitIntoParagraphs(mainText);
    const referenceParagraphs = this.splitIntoParagraphs(referenceText);

    const uniqueParagraphs = mainParagraphs.filter((mainP) => {
      return !referenceParagraphs.some((refP) => this.calculateSimilarity(mainP, refP) > 0.7);
    });

    return uniqueParagraphs.length > 0 ? uniqueParagraphs.join('\n\n') : mainText; // Fallback si tout est considéré comme similaire
  }

  /**
   * Calcul du score de qualité après déduplication
   */
  private calculateQualityScore(
    originalLength: number,
    cleanedLength: number,
    duplicationsCount: number,
  ): number {
    if (originalLength === 0) return 0;

    const reductionRatio = (originalLength - cleanedLength) / originalLength;
    let score = 85; // Score de base

    // Bonus pour la réduction des duplications
    if (duplicationsCount > 0) {
      score += Math.min(10, duplicationsCount * 2); // Bonus pour chaque duplication supprimée
    }

    // Pénalité si trop de contenu supprimé
    if (reductionRatio > 0.3) {
      score -= (reductionRatio - 0.3) * 50; // Pénalité si plus de 30% supprimé
    }

    return Math.max(50, Math.min(100, Math.round(score)));
  }

  /**
   * Utilitaire : Statistiques de déduplication
   */
  getDeduplicationStats(content: string): {
    duplications: number;
    uniqueWords: number;
    repetitionRate: number;
  } {
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = new Set(words).size;
    const repetitionRate = uniqueWords > 0 ? (words.length - uniqueWords) / words.length : 0;

    const result = this.analyzeContentDuplication(content);

    return {
      duplications: result.duplicationsFound.length,
      uniqueWords,
      repetitionRate: Math.round(repetitionRate * 100) / 100,
    };
  }
}

// Instance singleton
export const contentDeduplicationService = new ContentDeduplicationService();
