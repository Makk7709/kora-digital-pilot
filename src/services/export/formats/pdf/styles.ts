// Constantes de style McKinsey utilisées par le PDFExporter Kora.
// Extraites du module principal pour permettre la réutilisation par les
// helpers (radar, page de garde, etc.).

export const BRAND_COLORS = {
  deepBlue: [10, 22, 40] as const,
  corporateBlue: [27, 41, 81] as const,
  premiumGold: [212, 175, 55] as const,
  accentGold: [184, 148, 31] as const,
  premiumWhite: [250, 251, 252] as const,
  corporateGray: [74, 85, 104] as const,
  subtleGray: [226, 232, 240] as const,
  emerald: [16, 185, 129] as const,
  corporateRed: [220, 38, 38] as const,
  premiumOrange: [234, 88, 12] as const,
  lightBlue: [59, 130, 246] as const,
  darkBlue: [30, 58, 138] as const,
} as const;

export type BrandColor = readonly [number, number, number];

export interface PdfDimensions {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  headerHeight: number;
  footerHeight: number;
  sectionSpacing: number;
  paragraphSpacing: number;
  kpiBoxHeight: number;
  chartHeight: number;
}

export const PDF_DIMENSIONS: PdfDimensions = {
  pageWidth: 210,
  pageHeight: 297,
  margin: 25,
  headerHeight: 35,
  footerHeight: 12,
  sectionSpacing: 18,
  paragraphSpacing: 6,
  kpiBoxHeight: 55,
  chartHeight: 85,
};
