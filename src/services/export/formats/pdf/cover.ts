// Page de garde McKinsey premium pour le PDFExporter Kora.
// Extraite du module principal pour réduire sa taille.

import type jsPDF from 'jspdf';
import { BRAND_COLORS } from './styles';
import { addGradientToPDF } from './utils';

interface CoverReport {
  brandName?: string;
}

export function addPageDeGarde(pdf: jsPDF, report: CoverReport): void {
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  let currentY = 50;

  addGradientToPDF(
    pdf,
    0,
    0,
    pageWidth,
    pageHeight,
    BRAND_COLORS.deepBlue,
    BRAND_COLORS.corporateBlue,
  );

  const logoBoxSize = 80;
  const logoX = (pageWidth - logoBoxSize) / 2;

  pdf.setFillColor(
    BRAND_COLORS.premiumWhite[0],
    BRAND_COLORS.premiumWhite[1],
    BRAND_COLORS.premiumWhite[2],
    0.95,
  );
  pdf.rect(logoX, currentY, logoBoxSize, logoBoxSize, 'F');

  pdf.setDrawColor(
    BRAND_COLORS.premiumGold[0],
    BRAND_COLORS.premiumGold[1],
    BRAND_COLORS.premiumGold[2],
  );
  pdf.setLineWidth(3);
  pdf.rect(logoX, currentY, logoBoxSize, logoBoxSize, 'S');

  pdf.setFontSize(36);
  pdf.setTextColor(
    BRAND_COLORS.corporateBlue[0],
    BRAND_COLORS.corporateBlue[1],
    BRAND_COLORS.corporateBlue[2],
  );
  pdf.setFont('helvetica', 'bold');
  pdf.text('KORA', logoX + 15, currentY + 35);

  pdf.setFontSize(16);
  pdf.setTextColor(
    BRAND_COLORS.premiumGold[0],
    BRAND_COLORS.premiumGold[1],
    BRAND_COLORS.premiumGold[2],
  );
  pdf.text('P.R.I.S.M', logoX + 20, currentY + 50);

  pdf.setFontSize(12);
  pdf.setTextColor(
    BRAND_COLORS.corporateGray[0],
    BRAND_COLORS.corporateGray[1],
    BRAND_COLORS.corporateGray[2],
  );
  pdf.text('AI Analytics', logoX + 18, currentY + 65);

  currentY += 120;

  pdf.setFontSize(28);
  pdf.setTextColor(
    BRAND_COLORS.premiumGold[0],
    BRAND_COLORS.premiumGold[1],
    BRAND_COLORS.premiumGold[2],
  );
  pdf.setFont('helvetica', 'bold');
  pdf.text('ANALYSE P.R.I.S.M', pageWidth / 2, currentY, { align: 'center' });

  currentY += 25;
  pdf.setFontSize(18);
  pdf.setTextColor(
    BRAND_COLORS.premiumWhite[0],
    BRAND_COLORS.premiumWhite[1],
    BRAND_COLORS.premiumWhite[2],
  );
  pdf.text('by Korev AI', pageWidth / 2, currentY, { align: 'center' });

  currentY += 40;

  const titleBoxWidth = pageWidth * 0.7;
  const titleBoxX = (pageWidth - titleBoxWidth) / 2;

  pdf.setFillColor(
    BRAND_COLORS.premiumWhite[0],
    BRAND_COLORS.premiumWhite[1],
    BRAND_COLORS.premiumWhite[2],
    0.1,
  );
  pdf.rect(titleBoxX, currentY, titleBoxWidth, 50, 'F');

  pdf.setDrawColor(
    BRAND_COLORS.premiumGold[0],
    BRAND_COLORS.premiumGold[1],
    BRAND_COLORS.premiumGold[2],
  );
  pdf.setLineWidth(2);
  pdf.rect(titleBoxX, currentY, titleBoxWidth, 50, 'S');

  pdf.setFontSize(24);
  pdf.setTextColor(
    BRAND_COLORS.premiumGold[0],
    BRAND_COLORS.premiumGold[1],
    BRAND_COLORS.premiumGold[2],
  );
  pdf.setFont('helvetica', 'bold');
  const brandName = report.brandName || 'BRAND ANALYSIS';
  pdf.text(brandName.toUpperCase(), pageWidth / 2, currentY + 20, { align: 'center' });

  pdf.setFontSize(14);
  pdf.setTextColor(
    BRAND_COLORS.premiumWhite[0],
    BRAND_COLORS.premiumWhite[1],
    BRAND_COLORS.premiumWhite[2],
  );
  pdf.setFont('helvetica', 'normal');
  pdf.text('Strategic Intelligence & Market Assessment', pageWidth / 2, currentY + 35, {
    align: 'center',
  });

  currentY += 80;

  pdf.setFontSize(12);
  pdf.setTextColor(
    BRAND_COLORS.premiumWhite[0],
    BRAND_COLORS.premiumWhite[1],
    BRAND_COLORS.premiumWhite[2],
    0.8,
  );
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, currentY, {
    align: 'center',
  });

  currentY += 15;
  pdf.text(
    `Référence: KRA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    pageWidth / 2,
    currentY,
    { align: 'center' },
  );

  currentY += 15;
  pdf.text('Classification: PROPRIETARY & CONFIDENTIAL', pageWidth / 2, currentY, {
    align: 'center',
  });

  pdf.setFontSize(72);
  pdf.setTextColor(
    BRAND_COLORS.subtleGray[0],
    BRAND_COLORS.subtleGray[1],
    BRAND_COLORS.subtleGray[2],
    0.02,
  );
  pdf.text('KORA P.R.I.S.M', pageWidth / 2, pageHeight * 0.7, {
    angle: -45,
    align: 'center',
  });
}
