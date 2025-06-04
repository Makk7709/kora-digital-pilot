// Brand Analysis Module - Public Exports
// Replaces the monolithic BrandAnalysisService.ts (42KB, 1109+ lines)

// 🎯 Types and Interfaces
export * from '../../types/brand-analysis';

// 🔧 Core Services
export { BrandAnalysisOrchestrator } from './brand-analysis-orchestrator';
export { BrandAnalysisAPIService } from './api-service';
export { BrandReportGenerator } from './report-generator';
export { PerplexityResponseParser } from './parsers';

// 📝 Query Templates
export { BRAND_ANALYSIS_QUERIES, getQueryWithConfig } from './queries';

// 🏭 Factory Functions
export { createBrandAnalysisService } from './brand-analysis-orchestrator';

// 🔄 Compatibility Exports (for legacy code)
export { BrandAnalysisOrchestrator as BrandAnalysisService } from './brand-analysis-orchestrator';
export { BrandAnalysisOrchestrator as BrandAnalysisServiceImpl } from './brand-analysis-orchestrator';

/**
 * 📊 ARCHITECTURE OVERVIEW
 * 
 * This modular architecture replaces the 42KB monolithic BrandAnalysisService.ts
 * 
 * MODULES:
 * - types/brand-analysis.ts: All TypeScript interfaces and types
 * - api-service.ts: Perplexity API integration and calls
 * - parsers.ts: Response parsing and data extraction  
 * - report-generator.ts: Report formatting and generation
 * - queries.ts: Query templates and configurations
 * - brand-analysis-orchestrator.ts: Main coordinator service
 * 
 * BENEFITS:
 * ✅ Modular and maintainable code
 * ✅ Clear separation of concerns
 * ✅ Better testability
 * ✅ Easier debugging and updates
 * ✅ Backward compatibility maintained
 */ 