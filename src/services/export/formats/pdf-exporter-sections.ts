// PDF Exporter Sections Avancées - Standards McKinsey Premium
// Extensions pour 15-20 pages ultra-exigeantes

import jsPDF from 'jspdf';

export class PDFExporterSections {
  private readonly brandColors = {
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
  };

  private readonly dimensions = {
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

  // === PAGES 4-5: MARKET POSITIONING ===
  addMarketPositioning(
    pdf: jsPDF,
    report: any,
    addTextPremium: Function,
    addPremiumBox: Function,
    addPremiumGradient: Function,
    checkPageBreakPremium: Function,
    addPremiumPageHeader: Function,
  ) {
    const pageWidth = pdf.internal.pageSize.width;
    const margin = this.dimensions.margin;
    const contentWidth = pageWidth - margin * 2;
    let currentY = this.dimensions.margin;

    pdf.addPage();
    currentY = this.dimensions.margin;
    addPremiumPageHeader();

    // Header section avec gradient
    addPremiumBox(margin, currentY, contentWidth, 18, {
      gradient: {
        from: this.brandColors.corporateBlue,
        to: this.brandColors.lightBlue,
      },
    });

    pdf.setFillColor(
      this.brandColors.premiumWhite[0],
      this.brandColors.premiumWhite[1],
      this.brandColors.premiumWhite[2],
    );
    pdf.circle(margin + 12, currentY + 9, 6, 'F');

    pdf.setFontSize(18);
    pdf.setTextColor(
      this.brandColors.premiumWhite[0],
      this.brandColors.premiumWhite[1],
      this.brandColors.premiumWhite[2],
    );
    pdf.setFont('helvetica', 'bold');
    addTextPremium('2. MARKET POSITIONING', margin + 25, currentY + 12);

    currentY += 30;

    // Matrice BCG Premium
    const bcgMatrix = this.generateBCGMatrix(report);
    addPremiumBox(margin, currentY, contentWidth, 100, {
      fillColor: [248, 250, 252],
      border: true,
      borderColor: this.brandColors.premiumGold,
      borderWidth: 1.5,
      shadow: true,
    });

    pdf.setFontSize(14);
    pdf.setTextColor(
      this.brandColors.corporateBlue[0],
      this.brandColors.corporateBlue[1],
      this.brandColors.corporateBlue[2],
    );
    pdf.setFont('helvetica', 'bold');
    addTextPremium('MATRICE BCG - POSITIONNEMENT CONCURRENTIEL', margin + 10, currentY + 15);

    // Quadrants BCG
    const quadrantSize = 35;
    const matrixStartX = margin + 30;
    const matrixStartY = currentY + 25;

    // Axes et labels
    pdf.setDrawColor(
      this.brandColors.corporateGray[0],
      this.brandColors.corporateGray[1],
      this.brandColors.corporateGray[2],
    );
    pdf.setLineWidth(1);
    pdf.line(
      matrixStartX,
      matrixStartY + quadrantSize,
      matrixStartX + quadrantSize * 2,
      matrixStartY + quadrantSize,
    );
    pdf.line(
      matrixStartX + quadrantSize,
      matrixStartY,
      matrixStartX + quadrantSize,
      matrixStartY + quadrantSize * 2,
    );

    // Labels des quadrants
    pdf.setFontSize(10);
    pdf.setTextColor(
      this.brandColors.corporateBlue[0],
      this.brandColors.corporateBlue[1],
      this.brandColors.corporateBlue[2],
    );
    pdf.setFont('helvetica', 'bold');
    addTextPremium('STARS', matrixStartX + 5, matrixStartY + 8);
    addTextPremium('QUESTION MARKS', matrixStartX + quadrantSize + 5, matrixStartY + 8);
    addTextPremium('CASH COWS', matrixStartX + 5, matrixStartY + quadrantSize + 8);
    addTextPremium('DOGS', matrixStartX + quadrantSize + 5, matrixStartY + quadrantSize + 8);

    // Position de la marque
    const brandPosition = bcgMatrix.position;
    pdf.setFillColor(
      this.brandColors.premiumGold[0],
      this.brandColors.premiumGold[1],
      this.brandColors.premiumGold[2],
    );
    pdf.circle(matrixStartX + brandPosition.x, matrixStartY + brandPosition.y, 4, 'F');

    // Axes labels
    pdf.setFontSize(9);
    pdf.setTextColor(
      this.brandColors.corporateGray[0],
      this.brandColors.corporateGray[1],
      this.brandColors.corporateGray[2],
    );
    pdf.text('Market Growth Rate', matrixStartX - 20, matrixStartY + quadrantSize, { angle: 90 });
    addTextPremium(
      'Relative Market Share',
      matrixStartX + quadrantSize - 10,
      matrixStartY + quadrantSize * 2 + 10,
    );

    currentY += 110;

    // Competitive Landscape
    checkPageBreakPremium(80);
    addPremiumBox(margin, currentY, contentWidth, 75, {
      fillColor: [252, 248, 250],
      border: true,
      borderColor: this.brandColors.accentGold,
      borderWidth: 1.5,
    });

    pdf.setFontSize(12);
    pdf.setTextColor(
      this.brandColors.corporateBlue[0],
      this.brandColors.corporateBlue[1],
      this.brandColors.corporateBlue[2],
    );
    pdf.setFont('helvetica', 'bold');
    addTextPremium('COMPETITIVE LANDSCAPE - TOP 5 PLAYERS', margin + 10, currentY + 15);

    const competitors = this.generateCompetitiveLandscape(report);
    competitors.forEach((competitor, index) => {
      const y = currentY + 25 + index * 10;

      // Ranking badge
      pdf.setFillColor(
        this.brandColors.premiumGold[0],
        this.brandColors.premiumGold[1],
        this.brandColors.premiumGold[2],
      );
      pdf.circle(margin + 15, y, 3, 'F');
      pdf.setFontSize(8);
      pdf.setTextColor(
        this.brandColors.premiumWhite[0],
        this.brandColors.premiumWhite[1],
        this.brandColors.premiumWhite[2],
      );
      pdf.setFont('helvetica', 'bold');
      addTextPremium(`${index + 1}`, margin + 13, y + 1);

      // Competitor name
      pdf.setFontSize(10);
      pdf.setTextColor(
        this.brandColors.deepBlue[0],
        this.brandColors.deepBlue[1],
        this.brandColors.deepBlue[2],
      );
      pdf.setFont('helvetica', 'bold');
      addTextPremium(competitor.name, margin + 25, y + 2);

      // Market share bar
      const barWidth = 60;
      const shareWidth = (competitor.marketShare / 100) * barWidth;
      pdf.setFillColor(
        this.brandColors.subtleGray[0],
        this.brandColors.subtleGray[1],
        this.brandColors.subtleGray[2],
      );
      pdf.rect(margin + 80, y - 2, barWidth, 4, 'F');
      pdf.setFillColor(
        this.brandColors.emerald[0],
        this.brandColors.emerald[1],
        this.brandColors.emerald[2],
      );
      pdf.rect(margin + 80, y - 2, shareWidth, 4, 'F');

      // Market share percentage
      pdf.setFontSize(9);
      pdf.setTextColor(
        this.brandColors.corporateGray[0],
        this.brandColors.corporateGray[1],
        this.brandColors.corporateGray[2],
      );
      pdf.setFont('helvetica', 'normal');
      addTextPremium(`${competitor.marketShare}%`, margin + 145, y + 2);
    });
  }

  // === PAGES 6-7: SECTORIAL ANALYSIS ===
  addSectorialAnalysis(
    pdf: jsPDF,
    report: any,
    addTextPremium: Function,
    addPremiumBox: Function,
    addPremiumGradient: Function,
    checkPageBreakPremium: Function,
    addPremiumPageHeader: Function,
  ) {
    const pageWidth = pdf.internal.pageSize.width;
    const margin = this.dimensions.margin;
    const contentWidth = pageWidth - margin * 2;

    pdf.addPage();
    let currentY: number = this.dimensions.margin;
    addPremiumPageHeader();

    // Header section
    addPremiumBox(margin, currentY, contentWidth, 18, {
      gradient: {
        from: this.brandColors.emerald,
        to: this.brandColors.lightBlue,
      },
    });

    pdf.setFontSize(18);
    pdf.setTextColor(
      this.brandColors.premiumWhite[0],
      this.brandColors.premiumWhite[1],
      this.brandColors.premiumWhite[2],
    );
    pdf.setFont('helvetica', 'bold');
    addTextPremium('3. SECTORIAL ANALYSIS', margin + 25, currentY + 12);

    currentY += 30;

    // 5 Forces de Porter
    const porterForces = this.generatePorterForces(report);
    addPremiumBox(margin, currentY, contentWidth, 120, {
      fillColor: [248, 250, 252],
      border: true,
      borderColor: this.brandColors.emerald,
      borderWidth: 2,
      shadow: true,
    });

    pdf.setFontSize(14);
    pdf.setTextColor(
      this.brandColors.corporateBlue[0],
      this.brandColors.corporateBlue[1],
      this.brandColors.corporateBlue[2],
    );
    pdf.setFont('helvetica', 'bold');
    addTextPremium('ANALYSE DES 5 FORCES DE PORTER', margin + 10, currentY + 15);

    // Diagramme centré des 5 forces
    const centerX = margin + contentWidth / 2;
    const centerY = currentY + 60;
    const forceDistance = 35;

    // Force centrale - Intensité concurrentielle
    addPremiumBox(centerX - 25, centerY - 8, 50, 16, {
      fillColor: this.brandColors.corporateBlue,
      border: false,
    });
    pdf.setFontSize(9);
    pdf.setTextColor(
      this.brandColors.premiumWhite[0],
      this.brandColors.premiumWhite[1],
      this.brandColors.premiumWhite[2],
    );
    pdf.setFont('helvetica', 'bold');
    addTextPremium('INTENSITÉ', centerX - 15, centerY - 2);
    addTextPremium('CONCURRENTIELLE', centerX - 22, centerY + 5);

    // Les 4 forces externes avec scores
    const forces = [
      {
        name: 'POUVOIR FOURNISSEURS',
        x: centerX,
        y: centerY - forceDistance,
        score: porterForces.suppliers,
      },
      {
        name: 'POUVOIR CLIENTS',
        x: centerX,
        y: centerY + forceDistance,
        score: porterForces.buyers,
      },
      {
        name: 'MENACE ENTRANTS',
        x: centerX - forceDistance,
        y: centerY,
        score: porterForces.newEntrants,
      },
      {
        name: 'MENACE SUBSTITUTS',
        x: centerX + forceDistance,
        y: centerY,
        score: porterForces.substitutes,
      },
    ];

    forces.forEach((force) => {
      const boxColor =
        force.score >= 7
          ? this.brandColors.corporateRed
          : force.score >= 4
            ? this.brandColors.premiumOrange
            : this.brandColors.emerald;

      addPremiumBox(force.x - 20, force.y - 8, 40, 16, {
        fillColor: boxColor,
        border: false,
      });

      pdf.setFontSize(8);
      pdf.setTextColor(
        this.brandColors.premiumWhite[0],
        this.brandColors.premiumWhite[1],
        this.brandColors.premiumWhite[2],
      );
      pdf.setFont('helvetica', 'bold');
      const words = force.name.split(' ');
      addTextPremium(words[0], force.x - 15, force.y - 2);
      addTextPremium(words[1], force.x - 15, force.y + 5);

      // Score
      pdf.setFontSize(12);
      addTextPremium(`${force.score}/10`, force.x - 8, force.y + 20);
    });

    // Lignes de connexion
    pdf.setDrawColor(
      this.brandColors.corporateGray[0],
      this.brandColors.corporateGray[1],
      this.brandColors.corporateGray[2],
    );
    pdf.setLineWidth(1);
    forces.forEach((force) => {
      pdf.line(centerX, centerY, force.x, force.y);
    });

    currentY += 130;

    // Heat Map sectorielle
    checkPageBreakPremium(90);
    addPremiumBox(margin, currentY, contentWidth, 85, {
      fillColor: [252, 248, 250],
      border: true,
      borderColor: this.brandColors.premiumGold,
      borderWidth: 1.5,
    });

    pdf.setFontSize(12);
    pdf.setTextColor(
      this.brandColors.corporateBlue[0],
      this.brandColors.corporateBlue[1],
      this.brandColors.corporateBlue[2],
    );
    pdf.setFont('helvetica', 'bold');
    addTextPremium(
      'HEAT MAP SECTORIELLE - DYNAMIQUES CONCURRENTIELLES',
      margin + 10,
      currentY + 15,
    );

    const heatMapData = this.generateSectorHeatMap(report);
    const cellSize = 25;
    const startX = margin + 20;
    const startY = currentY + 30;

    // Headers
    pdf.setFontSize(8);
    pdf.setTextColor(
      this.brandColors.corporateGray[0],
      this.brandColors.corporateGray[1],
      this.brandColors.corporateGray[2],
    );
    heatMapData.metrics.forEach((metric, index) => {
      addTextPremium(metric, startX + index * cellSize + 5, startY - 5);
    });

    heatMapData.competitors.forEach((competitor, rowIndex) => {
      addTextPremium(
        competitor.name.substring(0, 10),
        startX - 15,
        startY + rowIndex * cellSize + 12,
      );

      competitor.scores.forEach((score, colIndex) => {
        const intensity = score / 10;
        const red = Math.round(255 * intensity);
        const green = Math.round(255 * (1 - intensity));

        pdf.setFillColor(red, green, 50);
        pdf.rect(
          startX + colIndex * cellSize,
          startY + rowIndex * cellSize,
          cellSize,
          cellSize,
          'F',
        );

        pdf.setDrawColor(
          this.brandColors.corporateGray[0],
          this.brandColors.corporateGray[1],
          this.brandColors.corporateGray[2],
        );
        pdf.rect(
          startX + colIndex * cellSize,
          startY + rowIndex * cellSize,
          cellSize,
          cellSize,
          'S',
        );

        pdf.setFontSize(10);
        pdf.setTextColor(
          intensity > 0.5 ? 255 : 0,
          intensity > 0.5 ? 255 : 0,
          intensity > 0.5 ? 255 : 0,
        );
        pdf.setFont('helvetica', 'bold');
        addTextPremium(
          score.toString(),
          startX + colIndex * cellSize + 8,
          startY + rowIndex * cellSize + 15,
        );
      });
    });
  }

  // === PAGES 8-9: BRAND EQUITY ASSESSMENT ===
  addBrandEquityAssessment(
    pdf: jsPDF,
    report: any,
    addTextPremium: Function,
    addPremiumBox: Function,
    addPremiumGradient: Function,
    checkPageBreakPremium: Function,
    addPremiumPageHeader: Function,
  ) {
    const pageWidth = pdf.internal.pageSize.width;
    const margin = this.dimensions.margin;
    const contentWidth = pageWidth - margin * 2;
    let currentY = this.dimensions.margin;

    pdf.addPage();
    currentY = this.dimensions.margin;
    addPremiumPageHeader();

    // Header section
    addPremiumBox(margin, currentY, contentWidth, 18, {
      gradient: {
        from: this.brandColors.premiumGold,
        to: this.brandColors.accentGold,
      },
    });

    pdf.setFontSize(18);
    pdf.setTextColor(
      this.brandColors.premiumWhite[0],
      this.brandColors.premiumWhite[1],
      this.brandColors.premiumWhite[2],
    );
    pdf.setFont('helvetica', 'bold');
    addTextPremium('4. BRAND EQUITY ASSESSMENT', margin + 25, currentY + 12);

    currentY += 30;

    // Brand Equity Score contextualisé
    const brandEquity = this.generateBrandEquityScore(report);

    // Score principal avec gauge
    addPremiumBox(margin, currentY, contentWidth, 80, {
      gradient: {
        from: this.brandColors.premiumWhite,
        to: this.brandColors.subtleGray,
      },
      border: true,
      borderColor: this.brandColors.premiumGold,
      borderWidth: 2,
      shadow: true,
    });

    pdf.setFontSize(14);
    pdf.setTextColor(
      this.brandColors.corporateBlue[0],
      this.brandColors.corporateBlue[1],
      this.brandColors.corporateBlue[2],
    );
    pdf.setFont('helvetica', 'bold');
    addTextPremium('BRAND EQUITY SCORE CONTEXTUALISE', margin + 10, currentY + 15);

    // Gauge visuel pour le score
    const gaugeX = margin + 30;
    const gaugeY = currentY + 40;
    const gaugeRadius = 20;

    // Background gauge
    pdf.setDrawColor(
      this.brandColors.subtleGray[0],
      this.brandColors.subtleGray[1],
      this.brandColors.subtleGray[2],
    );
    pdf.setLineWidth(8);
    const steps = 20;
    let prevX1 = 0,
      prevY1 = 0,
      prevX2 = 0,
      prevY2 = 0;
    for (let i = 0; i <= steps; i++) {
      const angle = (Math.PI * i) / steps;
      const x1 = gaugeX + Math.cos(angle) * (gaugeRadius - 4);
      const y1 = gaugeY - Math.sin(angle) * (gaugeRadius - 4);
      const x2 = gaugeX + Math.cos(angle) * (gaugeRadius + 4);
      const y2 = gaugeY - Math.sin(angle) * (gaugeRadius + 4);

      if (i > 0) {
        pdf.line(prevX1, prevY1, x1, y1);
        pdf.line(prevX2, prevY2, x2, y2);
      }
      prevX1 = x1;
      prevY1 = y1;
      prevX2 = x2;
      prevY2 = y2;
    }

    // Score gauge
    const scoreAngle = (brandEquity.score / 100) * 180;
    const gaugeColor =
      brandEquity.score >= 80
        ? this.brandColors.emerald
        : brandEquity.score >= 60
          ? this.brandColors.premiumGold
          : this.brandColors.corporateRed;

    pdf.setDrawColor(gaugeColor[0], gaugeColor[1], gaugeColor[2]);
    pdf.setLineWidth(8);
    const scoreSteps = Math.floor((scoreAngle / 180) * 20);
    let prevScoreX1 = 0,
      prevScoreY1 = 0,
      prevScoreX2 = 0,
      prevScoreY2 = 0;
    for (let i = 0; i <= scoreSteps; i++) {
      const angle = (Math.PI * i) / 20;
      const x1 = gaugeX + Math.cos(angle) * (gaugeRadius - 4);
      const y1 = gaugeY - Math.sin(angle) * (gaugeRadius - 4);
      const x2 = gaugeX + Math.cos(angle) * (gaugeRadius + 4);
      const y2 = gaugeY - Math.sin(angle) * (gaugeRadius + 4);

      if (i > 0) {
        pdf.line(prevScoreX1, prevScoreY1, x1, y1);
        pdf.line(prevScoreX2, prevScoreY2, x2, y2);
      }
      prevScoreX1 = x1;
      prevScoreY1 = y1;
      prevScoreX2 = x2;
      prevScoreY2 = y2;
    }

    // Score value
    pdf.setFontSize(24);
    pdf.setTextColor(
      this.brandColors.premiumGold[0],
      this.brandColors.premiumGold[1],
      this.brandColors.premiumGold[2],
    );
    pdf.setFont('helvetica', 'bold');
    addTextPremium(`${brandEquity.score}`, gaugeX - 8, gaugeY + 5);

    // Benchmarks sectoriels
    const benchmarks = [
      { label: 'Moyenne sectorielle', value: brandEquity.sectorAverage, x: margin + 80 },
      { label: 'Leader sectoriel', value: brandEquity.sectorLeader, x: margin + 80 },
      {
        label: 'Performance relative',
        value: `+${brandEquity.score - brandEquity.sectorAverage}pts`,
        x: margin + 80,
      },
    ];

    benchmarks.forEach((benchmark, index) => {
      const y = currentY + 25 + index * 12;

      pdf.setFontSize(10);
      pdf.setTextColor(
        this.brandColors.corporateGray[0],
        this.brandColors.corporateGray[1],
        this.brandColors.corporateGray[2],
      );
      pdf.setFont('helvetica', 'normal');
      addTextPremium(benchmark.label + ':', benchmark.x, y);

      pdf.setTextColor(
        this.brandColors.deepBlue[0],
        this.brandColors.deepBlue[1],
        this.brandColors.deepBlue[2],
      );
      pdf.setFont('helvetica', 'bold');
      addTextPremium(benchmark.value, benchmark.x + 40, y);
    });

    currentY += 90;

    // Composantes du Brand Equity
    checkPageBreakPremium(100);
    addPremiumBox(margin, currentY, contentWidth, 95, {
      fillColor: [248, 250, 252],
      border: true,
      borderColor: this.brandColors.accentGold,
      borderWidth: 1.5,
    });

    pdf.setFontSize(12);
    pdf.setTextColor(
      this.brandColors.corporateBlue[0],
      this.brandColors.corporateBlue[1],
      this.brandColors.corporateBlue[2],
    );
    pdf.setFont('helvetica', 'bold');
    addTextPremium('DECOMPOSITION BRAND EQUITY - 6 DIMENSIONS', margin + 10, currentY + 15);

    const dimensions = brandEquity.dimensions;
    const barWidth = 80;

    dimensions.forEach((dimension, index) => {
      const y = currentY + 30 + index * 12;

      // Label
      pdf.setFontSize(9);
      pdf.setTextColor(
        this.brandColors.corporateGray[0],
        this.brandColors.corporateGray[1],
        this.brandColors.corporateGray[2],
      );
      pdf.setFont('helvetica', 'normal');
      addTextPremium(dimension.name, margin + 10, y);

      // Barre de progression
      const progressWidth = (dimension.score / 100) * barWidth;
      pdf.setFillColor(
        this.brandColors.subtleGray[0],
        this.brandColors.subtleGray[1],
        this.brandColors.subtleGray[2],
      );
      pdf.rect(margin + 60, y - 3, barWidth, 6, 'F');

      const barColor =
        dimension.score >= 80
          ? this.brandColors.emerald
          : dimension.score >= 60
            ? this.brandColors.premiumGold
            : this.brandColors.corporateRed;
      pdf.setFillColor(barColor[0], barColor[1], barColor[2]);
      pdf.rect(margin + 60, y - 3, progressWidth, 6, 'F');

      // Score
      pdf.setFontSize(9);
      pdf.setTextColor(
        this.brandColors.deepBlue[0],
        this.brandColors.deepBlue[1],
        this.brandColors.deepBlue[2],
      );
      pdf.setFont('helvetica', 'bold');
      addTextPremium(`${dimension.score}/100`, margin + 145, y);
    });
  }

  // === MÉTHODES DE GÉNÉRATION DE DONNÉES ===

  private generateBCGMatrix(_report: unknown) {
    return {
      position: { x: 45, y: 25 }, // Position dans la matrice
      quadrant: 'Stars',
      marketGrowth: 8.5,
      relativeMarketShare: 1.3,
    };
  }

  private generateCompetitiveLandscape(report: any) {
    const brandName = (report.brandName || '').toLowerCase();

    if (brandName.includes('apple')) {
      return [
        { name: 'Apple', marketShare: 28.5 },
        { name: 'Samsung', marketShare: 22.1 },
        { name: 'Google', marketShare: 15.3 },
        { name: 'Huawei', marketShare: 12.8 },
        { name: 'Xiaomi', marketShare: 10.2 },
      ];
    } else if (brandName.includes('tesla')) {
      return [
        { name: 'Tesla', marketShare: 18.2 },
        { name: 'BYD', marketShare: 16.8 },
        { name: 'Volkswagen', marketShare: 14.5 },
        { name: 'Stellantis', marketShare: 12.3 },
        { name: 'General Motors', marketShare: 11.7 },
      ];
    } else {
      return [
        { name: report.brandName || 'Brand', marketShare: 18.5 },
        { name: 'Concurrent A', marketShare: 22.1 },
        { name: 'Concurrent B', marketShare: 16.3 },
        { name: 'Concurrent C', marketShare: 14.8 },
        { name: 'Concurrent D', marketShare: 12.2 },
      ];
    }
  }

  private generatePorterForces(_report: unknown) {
    return {
      suppliers: 6.2, // Pouvoir des fournisseurs
      buyers: 7.8, // Pouvoir des clients
      newEntrants: 4.5, // Menace nouveaux entrants
      substitutes: 5.9, // Menace des substituts
      rivalry: 8.1, // Intensité concurrentielle
    };
  }

  private generateSectorHeatMap(report: any) {
    return {
      metrics: ['Innovation', 'Digital', 'Sustainability', 'Brand', 'Finance'],
      competitors: [
        { name: 'Leader A', scores: [9, 8, 7, 9, 8] },
        { name: 'Leader B', scores: [7, 9, 8, 8, 9] },
        { name: report.brandName || 'Brand', scores: [8, 7, 9, 8, 7] },
        { name: 'Challenger A', scores: [6, 7, 6, 7, 8] },
        { name: 'Challenger B', scores: [5, 8, 5, 6, 6] },
      ],
    };
  }

  private generateBrandEquityScore(report: any) {
    const baseScore = report.confidenceScore || 78;
    return {
      score: baseScore,
      sectorAverage: 65,
      sectorLeader: 89,
      dimensions: [
        { name: 'Brand Awareness', score: baseScore + 5 },
        { name: 'Brand Association', score: baseScore - 3 },
        { name: 'Perceived Quality', score: baseScore + 8 },
        { name: 'Brand Loyalty', score: baseScore + 2 },
        { name: 'Brand Differentiation', score: baseScore - 5 },
        { name: 'Brand Trust', score: baseScore + 7 },
      ],
    };
  }
}
