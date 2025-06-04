// Compression Service
// Extracted from monolithic ReportExportService.ts for better organization

export class CompressionService {

  /**
   * Compresse le contenu selon le niveau spécifié
   */
  compress(content: string, level: 'none' | 'low' | 'medium' | 'high' = 'medium'): string {
    if (level === 'none') return content;

    let compressed = content;

    // Compression de base (tous niveaux)
    compressed = this.basicCompression(compressed);

    if (level === 'low') return compressed;

    // Compression moyenne
    compressed = this.mediumCompression(compressed);

    if (level === 'medium') return compressed;

    // Compression élevée
    compressed = this.highCompression(compressed);

    return compressed;
  }

  /**
   * Compression de base - suppression espaces et nettoyage
   */
  private basicCompression(content: string): string {
    let compressed = content;

    // Suppression des espaces multiples
    compressed = compressed.replace(/\s+/g, ' ');

    // Suppression des espaces en début/fin de lignes
    compressed = compressed.replace(/^\s+|\s+$/gm, '');

    // Suppression des lignes vides multiples
    compressed = compressed.replace(/\n\n+/g, '\n\n');

    return compressed;
  }

  /**
   * Compression moyenne - optimisation du formatage JSON
   */
  private mediumCompression(content: string): string {
    let compressed = content;

    try {
      // Si c'est du JSON, le minifier
      const parsed = JSON.parse(compressed);
      compressed = JSON.stringify(parsed);
    } catch {
      // Si ce n'est pas du JSON, appliquer d'autres optimisations
      
      // Suppression des tabulations
      compressed = compressed.replace(/\t/g, '');
      
      // Suppression des espaces avant/après certains caractères
      compressed = compressed.replace(/\s*([{}[\]:,])\s*/g, '$1');
      
      // Optimisation des retours à la ligne
      compressed = compressed.replace(/\n+/g, '\n');
    }

    return compressed;
  }

  /**
   * Compression élevée - minification agressive
   */
  private highCompression(content: string): string {
    let compressed = content;

    try {
      // JSON: minification complète
      const parsed = JSON.parse(compressed);
      compressed = JSON.stringify(parsed, null, 0);
    } catch {
      // Texte: suppression maximale d'espaces
      
      // Suppression de tous les retours à la ligne non essentiels
      compressed = compressed.replace(/\n(?!\n)/g, ' ');
      
      // Suppression des espaces multiples
      compressed = compressed.replace(/\s+/g, ' ');
      
      // Suppression des espaces autour de la ponctuation
      compressed = compressed.replace(/\s*([,.!?;:])\s*/g, '$1 ');
      
      // Nettoyage final
      compressed = compressed.trim();
    }

    return compressed;
  }

  /**
   * Calcule le taux de compression
   */
  getCompressionRatio(original: string, compressed: string): {
    originalSize: number;
    compressedSize: number;
    ratio: number;
    percentageSaved: number;
  } {
    const originalSize = original.length;
    const compressedSize = compressed.length;
    const ratio = compressedSize / originalSize;
    const percentageSaved = ((originalSize - compressedSize) / originalSize) * 100;

    return {
      originalSize,
      compressedSize,
      ratio: Math.round(ratio * 100) / 100,
      percentageSaved: Math.round(percentageSaved * 10) / 10
    };
  }

  /**
   * Estime la taille après compression sans l'appliquer
   */
  estimateCompressedSize(content: string, level: 'none' | 'low' | 'medium' | 'high'): number {
    const sampleSize = Math.min(1000, content.length);
    const sample = content.substring(0, sampleSize);
    const compressedSample = this.compress(sample, level);
    
    const ratio = compressedSample.length / sample.length;
    return Math.round(content.length * ratio);
  }

  /**
   * Optimise spécifiquement pour les formats
   */
  optimizeForFormat(content: string, format: string): string {
    switch (format.toLowerCase()) {
      case 'json':
        return this.optimizeJSON(content);
      case 'csv':
        return this.optimizeCSV(content);
      case 'xml':
        return this.optimizeXML(content);
      default:
        return this.compress(content, 'medium');
    }
  }

  /**
   * Optimisation spécifique JSON
   */
  private optimizeJSON(content: string): string {
    try {
      const parsed = JSON.parse(content);
      
      // Suppression des propriétés nulles/undefined optionnelles
      const cleaned = this.removeEmptyProperties(parsed);
      
      return JSON.stringify(cleaned);
    } catch {
      return content;
    }
  }

  /**
   * Optimisation spécifique CSV
   */
  private optimizeCSV(content: string): string {
    let optimized = content;
    
    // Suppression des espaces autour des virgules
    optimized = optimized.replace(/\s*,\s*/g, ',');
    
    // Suppression des lignes vides
    optimized = optimized.replace(/\n\s*\n/g, '\n');
    
    return optimized.trim();
  }

  /**
   * Optimisation spécifique XML
   */
  private optimizeXML(content: string): string {
    let optimized = content;
    
    // Suppression des espaces entre les balises
    optimized = optimized.replace(/>\s+</g, '><');
    
    // Suppression des espaces en début/fin de balises
    optimized = optimized.replace(/\s*(<[^>]*>)\s*/g, '$1');
    
    return optimized.trim();
  }

  /**
   * Supprime récursivement les propriétés vides d'un objet
   */
  private removeEmptyProperties(obj: any): any {
    if (Array.isArray(obj)) {
      return obj
        .map(item => this.removeEmptyProperties(item))
        .filter(item => item !== null && item !== undefined);
    }
    
    if (obj !== null && typeof obj === 'object') {
      const cleaned: any = {};
      
      Object.keys(obj).forEach(key => {
        const value = this.removeEmptyProperties(obj[key]);
        
        if (value !== null && 
            value !== undefined && 
            value !== '' && 
            !(Array.isArray(value) && value.length === 0) &&
            !(typeof value === 'object' && Object.keys(value).length === 0)
        ) {
          cleaned[key] = value;
        }
      });
      
      return cleaned;
    }
    
    return obj;
  }
} 