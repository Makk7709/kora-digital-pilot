// Export Services Module - Public Exports
// Replaces the monolithic ReportExportService.ts (37KB, 992+ lines)

// 🎯 Core Export Service
export { ReportExportOrchestrator } from './export-orchestrator';
export type { ExportHistoryItem, ReportExportServiceInterface } from './export-orchestrator';

// 🔧 Format-Specific Generators  
export { JSONExporter } from './formats/json-exporter';
export { CSVExporter } from './formats/csv-exporter';
export { ExcelExporter } from './formats/excel-exporter';
export { PDFExporter } from './formats/pdf-exporter';

// 🧹 Quality Enhancement Services
export { QualityEnhancementService } from './quality-enhancement';
export { CompressionService } from './compression';

// 📝 Metadata and History
export { MetadataGenerator } from './metadata-generator';
export { ExportHistoryManager } from './history-manager';

// 🏭 Factory Functions
export { createReportExportService } from './export-orchestrator';

// 🔄 Compatibility Exports (for legacy code)
export { ReportExportOrchestrator as ReportExportService } from './export-orchestrator';

/**
 * 📊 EXPORT ARCHITECTURE OVERVIEW
 * 
 * This modular architecture replaces the 37KB monolithic ReportExportService.ts
 * 
 * MODULES:
 * - export-orchestrator.ts: Main coordinator service
 * - formats/: Format-specific exporters (JSON, CSV, Excel, PDF)
 * - quality-enhancement.ts: Content quality improvement  
 * - compression.ts: Content compression utilities
 * - metadata-generator.ts: Export metadata generation
 * - history-manager.ts: Export history tracking
 * 
 * BENEFITS:
 * ✅ Modular format support
 * ✅ Specialized quality enhancement
 * ✅ Better maintainability
 * ✅ Easier format addition
 * ✅ Clear separation of concerns
 */ 