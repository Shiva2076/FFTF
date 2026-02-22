import { jsPDF } from 'jspdf';
import { formatUnderscoreString } from "@/utils/Capitalize";
import { drawMarketTrendTable, drawSocialTrendsTable, drawTopPerformingCropsTable, drawMarketDistributionTable, drawDistributionByProductTypeTable, drawMarketPlayersTable, MarketPriceTrendItem, YouTubeSentiment, TopPerformingCropsData, MarketDistributionByRegionData, DistributionByProductTypeData, MarketPlayersByCategoryData } from "./pdfHelpers";
import { CropByRegion } from "@/app/slices/cropsByRegionSlice";

// Types
export interface PdfGeneratorConfig {
  country: string;
  city: string;
  cropType: string;
  currency: string;
  weight: string;
}

export interface PdfGeneratorData {
  filteredCrops: CropByRegion[];
  filteredTrends: MarketPriceTrendItem[];
  selectedCropKeys: string[];
  youtubeSentiments: YouTubeSentiment[];
  topPerformingCrops?: TopPerformingCropsData;
  marketDistributionByRegion?: MarketDistributionByRegionData;
  distributionByProductType?: DistributionByProductTypeData;
  marketPlayersByCategory?: MarketPlayersByCategoryData;
}

interface PdfContext {
  pdf: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  config: PdfGeneratorConfig;
}

// Helper to normalize variety for comparison
export const normalizeVariety = (variety: string | undefined | null): string => {
  if (!variety || variety.trim() === '') return 'general';
  return variety.toLowerCase().replace(/[_\s]/g, '');
};

// Helper to normalize crop name for comparison
export const normalizeCropName = (name: string | undefined | null): string => {
  if (!name) return '';
  return name.toLowerCase().replace(/[_\s]/g, '');
};

/**
 * Add header to PDF page
 */
const addHeader = (ctx: PdfContext, title: string, subtitle: string) => {
  const { pdf, pageWidth, margin } = ctx;
  pdf.setFontSize(24);
  pdf.setTextColor(0, 135, 86);
  pdf.text(title, pageWidth / 2, 20, { align: 'center' });
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  pdf.text(subtitle, pageWidth / 2, 28, { align: 'center' });
  pdf.setDrawColor(0, 135, 86);
  pdf.setLineWidth(0.5);
  pdf.line(margin, 32, pageWidth - margin, 32);
};

/**
 * Add report info section - Styled card design
 */
const addReportInfo = (ctx: PdfContext, yPos: number): number => {
  const { pdf, margin, contentWidth, config } = ctx;
  
  const cardHeight = 28;
  const cardPadding = 8;
  const itemWidth = contentWidth / 4;
  
  // Draw card background with rounded corners effect
  pdf.setFillColor(248, 250, 252); // Light gray background
  pdf.setDrawColor(0, 135, 86); // Green border
  pdf.setLineWidth(0.8);
  pdf.roundedRect(margin, yPos, contentWidth, cardHeight, 3, 3, 'FD');
  
  // Draw vertical separators
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  for (let i = 1; i < 4; i++) {
    const xPos = margin + (itemWidth * i);
    pdf.line(xPos, yPos + 5, xPos, yPos + cardHeight - 5);
  }
  
  // Define info items
  const items = [
    { label: 'Country', value: config.country || 'N/A', icon: '🌍' },
    { label: 'City', value: config.city || 'N/A', icon: '📍' },
    { label: 'Crop Type', value: config.cropType || 'N/A', icon: '🌱' },
    { label: 'Generated', value: new Date().toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }), icon: '📅' }
  ];
  
  // Draw each info item
  items.forEach((item, index) => {
    const xPos = margin + (itemWidth * index) + cardPadding;
    const centerX = margin + (itemWidth * index) + (itemWidth / 2);
    
    // Label (smaller, gray, centered)
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text(item.label.toUpperCase(), centerX, yPos + 9, { align: 'center' });
    
    // Value (larger, dark, bold, centered)
    pdf.setFontSize(10);
    pdf.setTextColor(30, 30, 30);
    pdf.setFont('helvetica', 'bold');
    pdf.text(item.value, centerX, yPos + 19, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
  });
  
  return yPos + cardHeight + 8;
};

/**
 * Add watermark logo to all pages in header
 */
const addWatermarkLogoToAllPages = async (ctx: PdfContext): Promise<void> => {
  const { pdf, pageWidth } = ctx;
  const totalPages = pdf.getNumberOfPages();
  
  try {
    // Load the watermark logo SVG and convert to image
    const logoPath = '/apps/enterprise-intelligence/watermarklogo.svg';
    
    // Fetch the SVG file
    const response = await fetch(logoPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch logo: ${response.statusText}`);
    }
    
    const svgText = await response.text();
    
    // Create an image from the SVG
    const logoImage = await new Promise<string>((resolve, reject) => {
      const img = new Image();
      
      // Create a blob URL from the SVG
      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Use the SVG's viewBox dimensions (239x61)
        canvas.width = 239;
        canvas.height = 61;
        const canvasCtx = canvas.getContext('2d');
        if (canvasCtx) {
          canvasCtx.drawImage(img, 0, 0, 239, 61);
          const dataUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(url);
          resolve(dataUrl);
        } else {
          URL.revokeObjectURL(url);
          reject(new Error('Could not get canvas context'));
        }
      };
      
      img.onerror = (e) => {
        console.error('Image load error:', e);
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load watermark logo'));
      };
      
      img.src = url;
    });

    // Add logo to all pages in the header (top right corner)
    const logoWidth = 30; // mm
    const logoHeight = (logoWidth * 61) / 239; // Maintain aspect ratio (239x61 from SVG)
    const logoX = pageWidth - logoWidth - 10; // Right margin
    const logoY = 5; // Top margin

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
    }
  } catch (error) {
    console.warn('Failed to add watermark logo to PDF:', error);
    // Continue without logo if loading fails
  }
};

/**
 * Add footer to all pages
 */
const addFooterToAllPages = (ctx: PdfContext) => {
  const { pdf, pageWidth, pageHeight } = ctx;
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${i} of ${totalPages} | INNOFarms.AI MarketTrend Report`, pageWidth / 2, pageHeight - 5, { align: 'center' });
  }
};

/**
 * Generate Page 1: Summary with all crops table and Top Performing Crops
 */
export const generateSummaryPage = (ctx: PdfContext, data: PdfGeneratorData): void => {
  const { pdf, margin, contentWidth, pageHeight, config } = ctx;
  const { filteredCrops, topPerformingCrops } = data;
  const isMicrogreens = config.cropType?.toLowerCase() === 'microgreens';

  addHeader(ctx, 'INNO MarketTrend Report', ' Market Demand Summary');
  let yPos = addReportInfo(ctx, 40);

  // Summary table with all selected crops
  pdf.setFontSize(12);
  pdf.setTextColor(0, 135, 86);
  pdf.text('Selected Crops Overview', margin, yPos);
  yPos += 8;

  // Table headers
  const headers = ['Crop', 'Variety', 'Profitability %', 'Demand', isMicrogreens ? 'Nutrient' : 'Sustain', 'Price Range'];
  const colWidths = [30, 30, 30, 25, 25, 40];

  pdf.setFillColor(0, 135, 86);
  pdf.rect(margin, yPos, contentWidth, 8, 'F');
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  let xPos = margin + 2;
  headers.forEach((header, i) => {
    pdf.text(header, xPos, yPos + 5.5);
    xPos += colWidths[i];
  });
  yPos += 8;

  // Table rows
  pdf.setTextColor(0, 0, 0);
  filteredCrops.forEach((crop: any, index: number) => {
    if (index % 2 === 0) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, yPos, contentWidth, 7, 'F');
    }

    xPos = margin + 2;
    const cropName = crop.crop_name?.charAt(0).toUpperCase() + crop.crop_name?.slice(1) || '-';
    const variety = formatUnderscoreString(crop.crop_variety) || '-';
    const profitability = crop.profitability_market_band_low_pct !== undefined && crop.profitability_market_band_high_pct !== undefined
      ? `${crop.profitability_market_band_low_pct.toFixed(1)} - ${crop.profitability_market_band_high_pct.toFixed(1)}`
      : '-';
    const demand = crop.crop_popularscore?.toFixed(2) || '-';
    const score = isMicrogreens ? (crop.nutrient_score?.toFixed(2) || '-') : (crop.crop_sustain?.toFixed(2) || '-');
    const price = crop.market_band_low !== undefined && crop.market_band_high !== undefined
      ? `${crop.market_band_low} - ${crop.market_band_high} ${config.currency}/${config.weight}`
      : '-';

    const rowData = [cropName, variety, profitability, demand, score, price];
    rowData.forEach((rowItem, i) => {
      pdf.text(String(rowItem).substring(0, 15), xPos, yPos + 5);
      xPos += colWidths[i];
    });
    yPos += 7;
  });

  // Add Top Performing Crops table on the same page if data available
  if (topPerformingCrops && topPerformingCrops.data && topPerformingCrops.data.length > 0) {
    yPos += 10; // Add some spacing

    // Check if we have enough space, if not add a new page
    const estimatedTableHeight = 20 + (topPerformingCrops.data.length * 9);
    if (yPos + estimatedTableHeight > pageHeight - 20) {
      pdf.addPage();
      yPos = margin + 10;
    }

    // Draw the top performing crops table
    yPos = drawTopPerformingCropsTable({
      pdf,
      topPerformingCrops,
      yStart: yPos,
      margin,
      contentWidth,
      isMicrogreens,
    });
  }
};

/**
 * Generate Market Price Trend page for a single crop
 */
export const generateMarketTrendPage = async (
  ctx: PdfContext,
  cropKey: string,
  cropIndex: number,
  filteredTrends: MarketPriceTrendItem[],
  pdfContentRef: React.RefObject<HTMLDivElement>,
  html2canvas: any
): Promise<void> => {
  const { pdf, margin, contentWidth, pageHeight, config } = ctx;

  // Parse crop key
  const [cropName, ...varietyParts] = cropKey.split('-');
  const variety = varietyParts.join('-');

  // Find trend data
  const trendData = filteredTrends.find((trend: any) => {
    const trendCropName = normalizeCropName(trend.cropName || trend.crop);
    const trendVariety = normalizeVariety(trend.variety);
    const searchCropName = normalizeCropName(cropName);
    const searchVariety = normalizeVariety(variety);
    return trendCropName === searchCropName && trendVariety === searchVariety;
  });

  console.log(`Processing crop ${cropIndex + 1}: ${cropKey}, trend found:`, !!trendData);

  // Add new page
  pdf.addPage();
  addHeader(ctx, 'INNO MarketTrend Report', 'Market Price Trends');
  let yPos = 40;

  // Draw market price trend data table
  if (trendData && trendData.data) {
    yPos = drawMarketTrendTable({
      pdf,
      trendData,
      yStart: yPos,
      margin,
      contentWidth,
      currency: config.currency,
      weight: config.weight,
    });
  } else {
    // Fallback if no trend data
    const displayName = `${cropName.charAt(0).toUpperCase() + cropName.slice(1)} - ${formatUnderscoreString(variety)}`;
    pdf.setFillColor(0, 135, 86);
    pdf.rect(margin, yPos, contentWidth, 10, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text(displayName, margin + 5, yPos + 7);
    yPos += 14;

    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Market price trend data not available for this crop.', margin, yPos + 5);
    yPos += 15;
  }

  // Capture chart from hidden container
  if (pdfContentRef.current) {
    const chartContainers = pdfContentRef.current.querySelectorAll('.pdf-chart-container');
    const container = chartContainers[cropIndex] as HTMLElement;

    if (container) {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const scaleFactor = 0.9;
      const imgWidth = contentWidth * scaleFactor;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xOffset = margin + (contentWidth - imgWidth) / 2;

      // Check if image fits on current page
      if (yPos + imgHeight + 10 > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.addImage(imgData, 'PNG', xOffset, yPos, imgWidth, imgHeight);
    }
  }
};

/**
 * Generate Top Performing Crops page
 */
export const generateTopPerformingCropsPage = (
  ctx: PdfContext,
  topPerformingCrops: TopPerformingCropsData
): void => {
  const { pdf, margin, contentWidth, config } = ctx;
  const isMicrogreens = config.cropType?.toLowerCase() === 'microgreens';

  pdf.addPage();
  addHeader(ctx, 'INNO MarketTrend Report', 'Top Performing Crops');
  let yPos = 40;

  // Draw the top performing crops table
  yPos = drawTopPerformingCropsTable({
    pdf,
    topPerformingCrops,
    yStart: yPos,
    margin,
    contentWidth,
    isMicrogreens,
  });
};

/**
 * Generate Market By Region page (combined: Market Distribution + Product Type/Market Players)
 */
export const generateMarketByRegionPage = async (
  ctx: PdfContext,
  marketDistributionByRegion: MarketDistributionByRegionData | undefined,
  distributionByProductType: DistributionByProductTypeData | undefined,
  marketPlayersByCategory: MarketPlayersByCategoryData | undefined,
  pdfContentRef: React.RefObject<HTMLDivElement>,
  html2canvas: any
): Promise<void> => {
  const { pdf, margin, contentWidth, pageHeight, config } = ctx;
  const isMicrogreens = config.cropType?.toLowerCase() === 'microgreens';

  pdf.addPage();
  addHeader(ctx, 'INNO MarketTrend Report', 'Market By Region');
  let yPos = 40;

  // Calculate available space for charts (leaving bottom margin)
  const bottomMargin = 25; // Space from bottom for footer
  const spacingBetweenCharts = 15;
  const availableHeight = pageHeight - yPos - bottomMargin;
  
  // Determine if we have two charts or one
  const hasFirstChart = marketDistributionByRegion && marketDistributionByRegion.data && marketDistributionByRegion.data.length > 0;
  const hasSecondChart = isMicrogreens 
    ? (distributionByProductType && distributionByProductType.data && distributionByProductType.data.length > 0)
    : (marketPlayersByCategory && marketPlayersByCategory.data && marketPlayersByCategory.data.length > 0);
  
  const chartCount = (hasFirstChart ? 1 : 0) + (hasSecondChart ? 1 : 0);
  const totalSpacing = chartCount > 1 ? spacingBetweenCharts : 0;
  const availableHeightPerChart = chartCount > 0 ? (availableHeight - totalSpacing) / chartCount : availableHeight;

  // Show Market Distribution by Region pie chart
  if (hasFirstChart) {
    // Capture the pie chart visualization
    if (pdfContentRef.current) {
      const chartContainer = pdfContentRef.current.querySelector('.pdf-market-distribution-container') as HTMLElement;

      if (chartContainer) {
        const canvas = await html2canvas(chartContainer, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        
        // Calculate optimal size to fit available height while maintaining aspect ratio
        const aspectRatio = canvas.width / canvas.height;
        let imgHeight = availableHeightPerChart;
        let imgWidth = imgHeight * aspectRatio;
        
        // If width exceeds content width, scale down based on width instead
        if (imgWidth > contentWidth) {
          imgWidth = contentWidth * 0.95; // Use 95% of content width
          imgHeight = imgWidth / aspectRatio;
        }
        
        const xOffset = margin + (contentWidth - imgWidth) / 2;

        pdf.addImage(imgData, 'PNG', xOffset, yPos, imgWidth, imgHeight);
        yPos += imgHeight + spacingBetweenCharts;
      }
    }
  }

  // Show either Distribution by Product Type (Microgreens) OR Market Players (Leafy Greens) pie chart
  if (hasSecondChart) {
    // Capture the pie chart visualization
    if (pdfContentRef.current) {
      const chartContainer = isMicrogreens
        ? pdfContentRef.current.querySelector('.pdf-distribution-product-type-container') as HTMLElement
        : pdfContentRef.current.querySelector('.pdf-market-players-container') as HTMLElement;

      if (chartContainer) {
        const canvas = await html2canvas(chartContainer, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        
        // Calculate optimal size to fit remaining available height while maintaining aspect ratio
        const remainingHeight = pageHeight - yPos - bottomMargin;
        const aspectRatio = canvas.width / canvas.height;
        let imgHeight = Math.min(remainingHeight, availableHeightPerChart);
        let imgWidth = imgHeight * aspectRatio;
        
        // If width exceeds content width, scale down based on width instead
        if (imgWidth > contentWidth) {
          imgWidth = contentWidth * 0.95; // Use 95% of content width
          imgHeight = imgWidth / aspectRatio;
        }
        
        const xOffset = margin + (contentWidth - imgWidth) / 2;

        pdf.addImage(imgData, 'PNG', xOffset, yPos, imgWidth, imgHeight);
      }
    }
  }
};

/**
 * Generate Social Trends page (Chef's Choice)
 */
export const generateSocialTrendsPage = async (
  ctx: PdfContext,
  youtubeSentiments: YouTubeSentiment[],
  pdfContentRef: React.RefObject<HTMLDivElement>,
  html2canvas: any
): Promise<void> => {
  const { pdf, margin, contentWidth, pageHeight } = ctx;

  if (youtubeSentiments.length === 0) return;

  pdf.addPage();
  addHeader(ctx, 'INNO MarketTrend Report', 'Social Trends: Chef\'s Choice');
  let yPos = 40;

  // Capture the hidden social trends visualization (heatmap only, no table)
  if (pdfContentRef.current) {
    const socialTrendsContainer = pdfContentRef.current.querySelector('.pdf-social-trends-container') as HTMLElement;

    if (socialTrendsContainer) {
      const canvas = await html2canvas(socialTrendsContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const scaleFactor = 0.95;
      const imgWidth = contentWidth * scaleFactor;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xOffset = margin + (contentWidth - imgWidth) / 2;

      // Check if image fits on current page
      if (yPos + imgHeight + 10 > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.addImage(imgData, 'PNG', xOffset, yPos, imgWidth, imgHeight);
    }
  }
};

/**
 * Main PDF generation function
 */
export const generateMarketTrendPdf = async (
  config: PdfGeneratorConfig,
  data: PdfGeneratorData,
  pdfContentRef: React.RefObject<HTMLDivElement>
): Promise<string> => {
  // Import html2canvas dynamically
  const html2canvas = (await import('html2canvas')).default;

  // Create PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;

  const ctx: PdfContext = {
    pdf,
    pageWidth,
    pageHeight,
    margin,
    contentWidth,
    config,
  };

  // Page 1: Summary (includes Top Performing Crops)
  generateSummaryPage(ctx, data);

  // Market Trend pages for each crop
  for (let i = 0; i < data.selectedCropKeys.length; i++) {
    await generateMarketTrendPage(
      ctx,
      data.selectedCropKeys[i],
      i,
      data.filteredTrends,
      pdfContentRef,
      html2canvas
    );
  }

  // Market By Region page (combined: Market Distribution + Product Type/Market Players) - after Market Price Trends
  if (data.marketDistributionByRegion || data.distributionByProductType || data.marketPlayersByCategory) {
    await generateMarketByRegionPage(
      ctx,
      data.marketDistributionByRegion,
      data.distributionByProductType,
      data.marketPlayersByCategory,
      pdfContentRef,
      html2canvas
    );
  }

  // Social Trends page
  await generateSocialTrendsPage(ctx, data.youtubeSentiments, pdfContentRef, html2canvas);

  // Add watermark logo to all pages
  await addWatermarkLogoToAllPages(ctx);

  // Add footer to all pages
  addFooterToAllPages(ctx);

  // Generate filename
  const fileName = `MarketTrend_${config.city}_${config.cropType}_${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '');

  // Save PDF
  pdf.save(`${fileName}.pdf`);

  return fileName;
};
