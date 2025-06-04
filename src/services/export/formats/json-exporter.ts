// JSON Export Service
// Extracted from monolithic ReportExportService.ts for better organization

import type { ExportOptions } from '../../../types/BrandIntelligenceTypes';

export class JSONExporter {
  
  generate(report: any, options: ExportOptions): string {
    console.log('📝 Génération export JSON...');
    
    try {
      // 1. Sélection des sections à exporter
      let dataToExport = report;
      
      if (options.sections && options.sections.length > 0) {
        dataToExport = this.filterSections(report, options.sections);
      }

      // 2. Application des options de formatage
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          format: 'json',
          brandName: report.brandName || 'Unknown',
          version: '1.0'
        },
        data: dataToExport
      };

      // 3. Formatage selon les préférences
      const jsonString = JSON.stringify(exportData, null, 2);

      console.log(`✅ Export JSON généré - Taille: ${jsonString.length} caractères`);
      return jsonString;

    } catch (error) {
      console.error('❌ Erreur génération JSON:', error);
      throw new Error(`Erreur génération JSON: ${error.message}`);
    }
  }

  private filterSections(report: any, sections: string[]): any {
    const filtered: any = {};
    
    sections.forEach(section => {
      if (report[section] !== undefined) {
        filtered[section] = report[section];
      }
    });

    return filtered;
  }

  validateContent(report: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Vérifier que l'objet est sérialisable en JSON
    try {
      JSON.stringify(report);
    } catch (error) {
      errors.push('Contenu non sérialisable en JSON');
    }

    // Vérifier la taille (limite navigateur ~256MB)
    const approximateSize = JSON.stringify(report).length;
    if (approximateSize > 200 * 1024 * 1024) { // 200MB de sécurité
      errors.push('Contenu trop volumineux pour export JSON');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 