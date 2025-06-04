// Export History Manager Service
// Extracted from monolithic ReportExportService.ts for better organization

export interface ExportHistoryItem {
  timestamp: Date;
  fileName: string;
  format: string;
  fileSize: number;
  brandName: string;
}

export class ExportHistoryManager {
  private history: ExportHistoryItem[] = [];
  private readonly STORAGE_KEY = 'kora_export_history';
  private readonly MAX_HISTORY_ITEMS = 100;

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Ajoute un item à l'historique
   */
  addItem(item: ExportHistoryItem): void {
    this.history.unshift(item);
    
    // Limiter la taille de l'historique
    if (this.history.length > this.MAX_HISTORY_ITEMS) {
      this.history = this.history.slice(0, this.MAX_HISTORY_ITEMS);
    }
    
    this.saveToStorage();
  }

  /**
   * Récupère l'historique complet
   */
  getHistory(): ExportHistoryItem[] {
    return [...this.history].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  /**
   * Récupère l'historique filtré par marque
   */
  getHistoryByBrand(brandName: string): ExportHistoryItem[] {
    return this.history
      .filter(item => item.brandName.toLowerCase().includes(brandName.toLowerCase()))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Récupère l'historique filtré par format
   */
  getHistoryByFormat(format: string): ExportHistoryItem[] {
    return this.history
      .filter(item => item.format === format)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Nettoie les anciens exports (plus de X heures)
   */
  async cleanupOldExports(hoursOld: number = 24): Promise<number> {
    const cutoffDate = new Date(Date.now() - (hoursOld * 60 * 60 * 1000));
    const initialLength = this.history.length;
    
    this.history = this.history.filter(item => 
      item.timestamp.getTime() > cutoffDate.getTime()
    );
    
    const deletedCount = initialLength - this.history.length;
    
    if (deletedCount > 0) {
      this.saveToStorage();
      console.log(`🧹 Nettoyage historique: ${deletedCount} entrées supprimées`);
    }
    
    return deletedCount;
  }

  /**
   * Vide complètement l'historique
   */
  clearHistory(): void {
    this.history = [];
    this.saveToStorage();
  }

  /**
   * Statistiques de l'historique
   */
  getStats(): {
    totalExports: number;
    formatBreakdown: Record<string, number>;
    brandBreakdown: Record<string, number>;
    totalFileSize: number;
  } {
    const formatBreakdown: Record<string, number> = {};
    const brandBreakdown: Record<string, number> = {};
    let totalFileSize = 0;

    this.history.forEach(item => {
      // Formats
      formatBreakdown[item.format] = (formatBreakdown[item.format] || 0) + 1;
      
      // Marques
      brandBreakdown[item.brandName] = (brandBreakdown[item.brandName] || 0) + 1;
      
      // Taille totale
      totalFileSize += item.fileSize;
    });

    return {
      totalExports: this.history.length,
      formatBreakdown,
      brandBreakdown,
      totalFileSize
    };
  }

  /**
   * Charge l'historique depuis le localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.history = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Erreur chargement historique export:', error);
      this.history = [];
    }
  }

  /**
   * Sauvegarde l'historique dans le localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.history));
    } catch (error) {
      console.warn('Erreur sauvegarde historique export:', error);
    }
  }
} 