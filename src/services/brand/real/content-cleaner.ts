// Nettoyage du contenu Perplexity. Extrait depuis
// `RealBrandIntelligenceService.ts` pour réduire la taille du module
// principal (>2300 lignes).

import { logger } from '../../../lib/logger';

const CLEANUP_PATTERNS: RegExp[] = [
  /Tu es Perplexity, un assistant de recherche utile formé par Perplexity AI\.[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
  /Ta tâche est de rédiger une réponse précise[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
  /Suis ces instructions pour formuler ta réponse[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
  /KORA\s*$/gm,
  /===== ENRICHISSEMENT CONTEXTUEL =====[\s\S]*?(?=\n\n|\n[^=])/gi,
  /SYNTHÈSE STRATÉGIQUE:[\s\S]*$/gi,
  /RECOMMANDATIONS OPÉRATIONNELLES:[\s\S]*$/gi,
  /selon les instructions|conformément aux directives|comme demandé/gi,
  /^\s*[=-]{3,}\s*$/gm,
];

export function cleanRawContent(content: string): string {
  if (!content) return content;

  let cleanedContent = content;

  CLEANUP_PATTERNS.forEach((pattern) => {
    cleanedContent = cleanedContent.replace(pattern, '');
  });

  cleanedContent = cleanedContent
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{3,}/g, ' ')
    .trim();

  if (cleanedContent.length < content.length * 0.4) {
    logger.warn(
      '⚠️ [RealBrandIntelligence] Nettoyage trop agressif détecté, conservation du contenu',
    );
    return content
      .replace(/Tu es Perplexity, un assistant de recherche utile[\s\S]*?(?=\n\n)/gi, '')
      .replace(/KORA\s*$/gm, '')
      .trim();
  }

  if (cleanedContent !== content) {
    logger.debug(
      `🧹 [RealBrandIntelligence] Contenu nettoyé: ${content.length} → ${cleanedContent.length} chars`,
    );
  }

  return cleanedContent;
}
