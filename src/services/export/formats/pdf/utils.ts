// Helpers de bas niveau pour le PDFExporter Kora.
// Extraits du module principal afin de centraliser le rendu de gradients,
// boîtes premium et texte nettoyé.

import type jsPDF from 'jspdf';
import { logger } from '../../../../lib/logger';
import { BRAND_COLORS, type BrandColor } from './styles';

export interface TextOptions {
  shadow?: boolean;
  align?: 'left' | 'center' | 'right' | 'justify';
  angle?: number;
  baseline?: string;
  rotationDirection?: number;
  charSpace?: number;
  lineHeightFactor?: number;
  maxWidth?: number;
  renderingMode?:
    | 'fill'
    | 'stroke'
    | 'fillThenStroke'
    | 'invisible'
    | 'fillAndAddForClipping'
    | 'strokeAndAddPathForClipping'
    | 'fillThenStrokeAndAddToPathForClipping'
    | 'addToPathForClipping';
}

export interface PremiumBoxOptions {
  shadow?: boolean;
  shadowOffset?: number;
  gradient?: { from: BrandColor; to: BrandColor };
  fillColor?: readonly number[];
  border?: boolean;
  borderColor?: readonly number[];
  borderWidth?: number;
  topBorder?: boolean;
}

export function addGradientToPDF(
  pdf: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  color1: readonly number[],
  color2: readonly number[],
): void {
  const steps = 25;
  const stepHeight = height / steps;

  for (let i = 0; i < steps; i++) {
    const ratio = i / steps;
    const r = Math.round(color1[0] + (color2[0] - color1[0]) * ratio);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * ratio);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * ratio);

    pdf.setFillColor(r, g, b);
    pdf.rect(x, y + i * stepHeight, width, stepHeight, 'F');
  }
}

export function getTextPremiumFunction(pdf: jsPDF) {
  return (text: string, x: number, y: number, options: TextOptions = {}) => {
    try {
      const cleanText = String(text || '')
        .replace(/[^\x20-\x7E\u00C0-\u00FF\u0100-\u017F\u0180-\u024F]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (options.shadow) {
        pdf.setTextColor(0, 0, 0, 0.1);
        pdf.text(cleanText, x + 0.2, y + 0.2, options as never);
      }

      pdf.text(cleanText, x, y, options as never);
    } catch (error) {
      logger.warn('Erreur encodage texte premium:', error);
      pdf.text('Contenu indisponible', x, y, options as never);
    }
  };
}

export function getPremiumBoxFunction(pdf: jsPDF) {
  return (x: number, y: number, width: number, height: number, options: PremiumBoxOptions = {}) => {
    if (options.shadow !== false) {
      pdf.setFillColor(10, 22, 40, 0.08);
      pdf.rect(x + 1.5, y + 1.5, width, height, 'F');
    }

    if (options.gradient) {
      addGradientToPDF(pdf, x, y, width, height, options.gradient.from, options.gradient.to);
    } else {
      const fillColor = options.fillColor || BRAND_COLORS.premiumWhite;
      pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
      pdf.rect(x, y, width, height, 'F');
    }

    if (options.border) {
      const borderColor = options.borderColor || BRAND_COLORS.premiumGold;
      pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      pdf.setLineWidth(options.borderWidth || 1);
      pdf.rect(x, y, width, height, 'S');
    }

    if (options.topBorder) {
      pdf.setDrawColor(
        BRAND_COLORS.premiumGold[0],
        BRAND_COLORS.premiumGold[1],
        BRAND_COLORS.premiumGold[2],
      );
      pdf.setLineWidth(2.5);
      pdf.line(x, y, x + width, y);
    }
  };
}

export function getPremiumGradientFunction(pdf: jsPDF) {
  return (
    x: number,
    y: number,
    width: number,
    height: number,
    color1: readonly number[],
    color2: readonly number[],
  ) => addGradientToPDF(pdf, x, y, width, height, color1, color2);
}
