import { jsPDF } from 'jspdf';
import { formatUnderscoreString } from "@/utils/Capitalize";

// Market price trend can have different structures
export interface MarketPriceTrendItem {
  cropName?: string;
  crop?: string;
  variety?: string;
  data?: any;
  [key: string]: any;
}

// Top Performing Crops interface
export interface TopPerformingCrop {
  cropId: number;
  cropName: string;
  variety?: string;
  salesTons?: number;
  pricePerKg: number | { min: number; max: number };
  pricePerPunnet?: number | string;
  priceUnit: string;
  priceChangePercentage: number | string;
  market_band_low?: number;
  market_band_high?: number;
  observed_high?: number;
  observed_low?: number;
}

export interface TopPerformingCropsData {
  title: string;
  description: string;
  duration: string;
  data: TopPerformingCrop[];
}

// Market Distribution by Region interface
export interface RegionData {
  region: string;
  percentage: number;
}

export interface MarketDistributionByRegionData {
  title: string;
  description: string;
  duration: string;
  data: RegionData[];
}

// Distribution by Product Type interface (Microgreens)
export interface ProductTypeData {
  category: string;
  percentage: number;
}

export interface DistributionByProductTypeData {
  title?: string;
  description: string;
  duration: string;
  data: ProductTypeData[];
}

// Market Players by Category interface (Leafy Greens)
export interface PlayerCategoryData {
  category: string;
  percentage: number;
}

export interface MarketPlayersByCategoryData {
  title: string;
  description: string;
  duration: string;
  data: PlayerCategoryData[];
}

interface DrawMarketTrendTableParams {
  pdf: jsPDF;
  trendData: MarketPriceTrendItem;
  yStart: number;
  margin: number;
  contentWidth: number;
  currency: string;
  weight: string;
}

/**
 * Format date helper - show only Month and Year
 */
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

/**
 * Helper to draw a rounded badge
 */
const drawBadge = (
  pdf: jsPDF,
  text: string,
  x: number,
  yPos: number,
  bgColor: [number, number, number],
  textColor: [number, number, number]
) => {
  const badgeWidth = 22;
  const badgeHeight = 5;
  pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
  pdf.roundedRect(x, yPos - 3.5, badgeWidth, badgeHeight, 1, 1, 'F');
  pdf.setFontSize(7);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text(text, x + 2, yPos);
};

/**
 * Draw market price trend data table (historical, current, forecast)
 */
export const drawMarketTrendTable = ({
  pdf,
  trendData,
  yStart,
  margin,
  contentWidth,
  currency,
  weight,
}: DrawMarketTrendTableParams): number => {
  let y = yStart;

  // Crop name as title with green background
  const cropNameStr = trendData.cropName || trendData.crop || 'Crop';
  const varietyStr = trendData.variety || '';
  const cropDisplayName = `${cropNameStr.charAt(0).toUpperCase() + cropNameStr.slice(1)} - ${formatUnderscoreString(varietyStr)}`;
  pdf.setFillColor(0, 135, 86);
  pdf.rect(margin, y, contentWidth, 10, 'F');
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont(undefined as any, 'bold');
  pdf.text(cropDisplayName, margin + 5, y + 7);
  pdf.setFont(undefined as any, 'normal');
  y += 14;

  // Table headers
  const trendHeaders = ['Period', 'Date', 'Market Value', 'Market Band', 'Confidence Band'];
  const trendColWidths = [32, 38, 38, 42, 40];

  // Draw header row with green background
  pdf.setFillColor(0, 135, 86);
  pdf.rect(margin, y, contentWidth, 8, 'F');
  pdf.setFontSize(9);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont(undefined as any, 'bold');
  let tx = margin + 3;
  trendHeaders.forEach((header, i) => {
    pdf.text(header, tx, y + 5.5);
    tx += trendColWidths[i];
  });
  pdf.setFont(undefined as any, 'normal');
  y += 8;

  const rowHeight = 10;
  let rowIndex = 0;

  // Get current month key to avoid duplicates
  const currentData = trendData.data?.current;
  const currentMonthKey = currentData ? (() => {
    const d = new Date(currentData.date);
    return `${d.getFullYear()}-${d.getMonth()}`;
  })() : null;

  // Historical data - only show the last (most recent) entry that's not the same month as current
  const historicalData = trendData.data?.historical || [];
  const lastHistorical = historicalData.length > 0 ? (() => {
    // Find the last historical entry that's not the same month as current
    for (let i = historicalData.length - 1; i >= 0; i--) {
      const item = historicalData[i];
      const d = new Date(item.date);
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      if (monthKey !== currentMonthKey) {
        return [item];
      }
    }
    return [];
  })() : [];

  lastHistorical.forEach((item: any) => {
    // Alternating row background
    if (rowIndex % 2 === 1) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    tx = margin + 3;
    // Historical badge - orange/red
    drawBadge(pdf, 'Historical', tx, y + 6, [255, 235, 230], [200, 80, 50]);
    tx += trendColWidths[0];

    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    pdf.text(formatDate(item.date), tx, y + 6);
    tx += trendColWidths[1];
    pdf.text(`${item.market_value?.toFixed(0) || '-'} ${currency}/${weight}`, tx, y + 6);
    tx += trendColWidths[2];
    const marketBand = item.market_band ? `${item.market_band.min?.toFixed(1)} - ${item.market_band.max?.toFixed(1)} ${currency}/${weight}` : '-';
    pdf.text(marketBand, tx, y + 6);
    tx += trendColWidths[3];
    const confidence = item.confidence ? `${item.confidence.min?.toFixed(1)} - ${item.confidence.max?.toFixed(1)} ${currency}/${weight}` : '-';
    pdf.text(confidence, tx, y + 6);

    // Draw bottom border
    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.2);
    pdf.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    y += rowHeight;
    rowIndex++;
  });

  // Current data - highlighted green row
  if (currentData) {
    // Light green background for current row
    pdf.setFillColor(220, 245, 230);
    pdf.rect(margin, y, contentWidth, rowHeight, 'F');

    tx = margin + 3;
    // Current badge - green
    drawBadge(pdf, 'Current', tx, y + 6, [200, 240, 210], [0, 130, 80]);
    tx += trendColWidths[0];

    pdf.setFontSize(9);
    pdf.setTextColor(30, 30, 30);
    pdf.setFont(undefined as any, 'bold');
    pdf.text(formatDate(currentData.date), tx, y + 6);
    tx += trendColWidths[1];
    pdf.text(`${currentData.market_value?.toFixed(0) || '-'} ${currency}/${weight}`, tx, y + 6);
    pdf.setFont(undefined as any, 'normal');
    tx += trendColWidths[2];
    const marketBand = currentData.market_band ? `${currentData.market_band.min?.toFixed(0)} - ${currentData.market_band.max?.toFixed(0)} ${currency}/${weight}` : '-';
    pdf.text(marketBand, tx, y + 6);
    tx += trendColWidths[3];
    const confidence = currentData.confidence ? `${currentData.confidence.min?.toFixed(1)} - ${currentData.confidence.max?.toFixed(1)} ${currency}/${weight}` : '-';
    pdf.text(confidence, tx, y + 6);

    // Draw bottom border
    pdf.setDrawColor(200, 230, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    y += rowHeight;
    rowIndex++;
  }

  // Forecast data - show up to 3 unique months (filter out duplicate months and current month)
  const forecastData = trendData.data?.forecast || [];
  const uniqueMonthsForecast: any[] = [];
  const seenMonths = new Set<string>();
  // Add current month to seenMonths to avoid showing it in forecast
  if (currentMonthKey) {
    seenMonths.add(currentMonthKey);
  }

  for (const item of forecastData) {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`; // YYYY-M format for uniqueness
    if (!seenMonths.has(monthKey)) {
      seenMonths.add(monthKey);
      uniqueMonthsForecast.push(item);
      if (uniqueMonthsForecast.length >= 3) break; // Stop after 3 unique months
    }
  }

  uniqueMonthsForecast.forEach((item: any) => {
    // Alternating row background
    if (rowIndex % 2 === 1) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    tx = margin + 3;
    // Forecast badge - yellow/orange
    drawBadge(pdf, 'Forecast', tx, y + 6, [255, 245, 220], [200, 130, 50]);
    tx += trendColWidths[0];

    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    pdf.text(formatDate(item.date), tx, y + 6);
    tx += trendColWidths[1];
    pdf.text(`${item.market_value?.toFixed(0) || '-'} ${currency}/${weight}`, tx, y + 6);
    tx += trendColWidths[2];
    const marketBand = item.market_band ? `${item.market_band.min?.toFixed(1)} - ${item.market_band.max?.toFixed(1)} ${currency}/${weight}` : '-';
    pdf.text(marketBand, tx, y + 6);
    tx += trendColWidths[3];
    const confidence = item.confidence ? `${item.confidence.min?.toFixed(1)} - ${item.confidence.max?.toFixed(1)} ${currency}/${weight}` : '-';
    pdf.text(confidence, tx, y + 6);

    // Draw bottom border
    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.2);
    pdf.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    y += rowHeight;
    rowIndex++;
  });

  return y + 8;
};

interface DrawCropTableParams {
  pdf: jsPDF;
  crop: any;
  yStart: number;
  margin: number;
  pageWidth: number;
  contentWidth: number;
  currency: string;
  weight: string;
  isMicrogreens: boolean;
}

/**
 * Draw crop data table for a single crop
 */
export const drawCropTable = ({
  pdf,
  crop,
  yStart,
  margin,
  pageWidth,
  contentWidth,
  currency,
  weight,
  isMicrogreens,
}: DrawCropTableParams): number => {
  let y = yStart;

  // Crop name as section title
  const cropDisplayName = `${crop.crop_name?.charAt(0).toUpperCase() + crop.crop_name?.slice(1)} - ${formatUnderscoreString(crop.crop_variety)}`;
  pdf.setFontSize(14);
  pdf.setTextColor(0, 135, 86);
  pdf.text(cropDisplayName, margin, y);
  y += 8;

  // Two-column layout for crop details
  const col1X = margin;
  const col2X = pageWidth / 2;
  const rowHeight = 6;

  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);

  // Left column labels
  const leftLabels = ['Profitability Range:', 'Market Band:', 'Observed Range:', 'Price Trend:'];
  const rightLabels = ['Demand Score:', isMicrogreens ? 'Nutrient Score:' : 'Sustainability:', 'Crop Rank:', 'Profit Score:'];

  // Left column values
  const profitability = crop.profitability_market_band_low_pct !== undefined && crop.profitability_market_band_high_pct !== undefined
    ? `${crop.profitability_market_band_low_pct.toFixed(1)}% - ${crop.profitability_market_band_high_pct.toFixed(1)}%`
    : '-';
  const marketBand = crop.market_band_low !== undefined && crop.market_band_high !== undefined
    ? `${crop.market_band_low} - ${crop.market_band_high} ${currency}/${weight}`
    : '-';
  const observedRange = crop.observed_low !== undefined && crop.observed_high !== undefined
    ? `${crop.observed_low} - ${crop.observed_high} ${currency}/${weight}`
    : '-';
  const priceTrend = crop.price_trend || '-';

  const leftValues = [profitability, marketBand, observedRange, priceTrend];

  // Right column values
  const demandScore = crop.crop_popularscore?.toFixed(2) || '-';
  const sustainScore = isMicrogreens ? (crop.nutrient_score?.toFixed(2) || '-') : (crop.crop_sustain?.toFixed(2) || '-');
  const cropRank = crop.rank !== undefined ? `#${crop.rank}` : '-';
  const profitScore = crop.crop_profit?.toFixed(2) || '-';

  const rightValues = [demandScore, sustainScore, cropRank, profitScore];

  // Draw table background
  pdf.setFillColor(248, 250, 252);
  pdf.rect(margin, y, contentWidth, leftLabels.length * rowHeight + 4, 'F');
  pdf.setDrawColor(0, 135, 86);
  pdf.setLineWidth(0.3);
  pdf.rect(margin, y, contentWidth, leftLabels.length * rowHeight + 4, 'S');

  y += 4;

  // Draw data rows
  for (let i = 0; i < leftLabels.length; i++) {
    // Left column
    pdf.setTextColor(100, 100, 100);
    pdf.text(leftLabels[i], col1X + 3, y + 4);
    pdf.setTextColor(0, 0, 0);
    pdf.text(String(leftValues[i]), col1X + 45, y + 4);

    // Right column
    pdf.setTextColor(100, 100, 100);
    pdf.text(rightLabels[i], col2X + 3, y + 4);
    pdf.setTextColor(0, 0, 0);
    pdf.text(String(rightValues[i]), col2X + 45, y + 4);

    y += rowHeight;
  }

  return y + 6;
};

// Types for Social Trends
export interface YouTubeSentiment {
  channel_name: string;
  basil_count: number;
  spinach_count: number;
  kale_count: number;
  lettuce_count: number;
  arugula_count: number;
  celery_count: number;
  bok_choy_count: number;
}

interface DrawSocialTrendsTableParams {
  pdf: jsPDF;
  youtubeSentiments: YouTubeSentiment[];
  yStart: number;
  margin: number;
  contentWidth: number;
}

// Dynamic bin colors for heatmap
const HEATMAP_COLORS: [number, number, number][] = [
  [103, 171, 133], // #67AB85
  [52, 146, 100],  // #349264
  [0, 117, 72],    // #007548
  [143, 185, 234], // #8FB9EA
  [46, 129, 211],  // #2E81D3
];

/**
 * Draw Social Trends (Chef's Choice) heatmap table
 */
export const drawSocialTrendsTable = ({
  pdf,
  youtubeSentiments,
  yStart,
  margin,
  contentWidth,
}: DrawSocialTrendsTableParams): number => {
  let y = yStart;

  // Section title
  pdf.setFillColor(0, 135, 86);
  pdf.rect(margin, y, contentWidth, 10, 'F');
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont(undefined as any, 'bold');
  pdf.text("Social Trends: Chef's Choice (YouTube Mentions)", margin + 5, y + 7);
  pdf.setFont(undefined as any, 'normal');
  y += 14;

  // Process data for heatmap
  const crops = ['Arugula', 'Basil', 'Celery', 'Kale', 'Lettuce', 'Pak Choi', 'Spinach'];
  const chefData = youtubeSentiments.map((it) => ({
    chef: it.channel_name,
    Arugula: it.arugula_count,
    Basil: it.basil_count,
    Celery: it.celery_count,
    Kale: it.kale_count,
    Lettuce: it.lettuce_count,
    'Pak Choi': it.bok_choy_count,
    Spinach: it.spinach_count,
  }));

  // Get max value for binning
  const allValues = chefData.flatMap(row => 
    crops.map(crop => (row as any)[crop] || 0)
  );
  const maxValue = Math.max(...allValues, 1);
  
  // Create dynamic bins
  const binSize = Math.ceil(maxValue / 5);
  let step = Math.ceil(binSize / 10) * 10;
  if (step === 0) step = 10;
  
  const bins: { min: number; max: number; color: [number, number, number] }[] = [];
  for (let i = 0; i < 5; i++) {
    const min = i === 0 ? 0 : i * step + 1;
    const max = i < 4 ? (i + 1) * step : Infinity;
    bins.push({ min, max, color: HEATMAP_COLORS[i] });
  }

  // Draw legend
  pdf.setFontSize(8);
  pdf.setTextColor(60, 60, 60);
  pdf.text('Mentions:', margin, y + 3);
  let legendX = margin + 20;
  bins.forEach((b, i) => {
    const [r, g, bl] = b.color;
    pdf.setFillColor(r, g, bl);
    pdf.rect(legendX, y - 1, 8, 5, 'F');
    pdf.setTextColor(60, 60, 60);
    const label = b.max !== Infinity ? `${b.min}-${b.max}` : `${b.min - 1}+`;
    pdf.text(label, legendX + 10, y + 3);
    legendX += 28;
  });
  y += 10;

  // Table dimensions
  const cropColWidth = 22;
  const chefColWidth = (contentWidth - cropColWidth) / Math.max(chefData.length, 1);
  const rowHeight = 8;

  // Draw header row with chef letters
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, y, contentWidth, rowHeight, 'F');
  pdf.setFontSize(8);
  pdf.setTextColor(60, 60, 60);
  pdf.setFont(undefined as any, 'bold');
  pdf.text('Crop', margin + 2, y + 5.5);
  
  const chefLetters: { [key: string]: string } = {};
  chefData.forEach((row, idx) => {
    const letter = String.fromCharCode(65 + idx);
    chefLetters[row.chef] = letter;
    pdf.text(letter, margin + cropColWidth + (idx * chefColWidth) + (chefColWidth / 2) - 2, y + 5.5);
  });
  pdf.setFont(undefined as any, 'normal');
  y += rowHeight;

  // Draw data rows (one per crop)
  crops.forEach((crop, cropIdx) => {
    // Alternating row background
    if (cropIdx % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    // Crop name
    pdf.setFontSize(8);
    pdf.setTextColor(60, 60, 60);
    pdf.text(crop, margin + 2, y + 5.5);

    // Values for each chef
    chefData.forEach((row, chefIdx) => {
      const val = (row as any)[crop] || 0;
      const bin = bins.find((b, i) => {
        const isLast = i === bins.length - 1;
        return isLast ? val >= b.min : val >= b.min && val <= b.max;
      });
      const [r, g, bl] = bin?.color || [200, 200, 200];
      
      const cellX = margin + cropColWidth + (chefIdx * chefColWidth);
      pdf.setFillColor(r, g, bl);
      pdf.rect(cellX + 1, y + 1, chefColWidth - 2, rowHeight - 2, 'F');
      
      // Value text (white for contrast)
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(7);
      const valStr = String(val);
      pdf.text(valStr, cellX + (chefColWidth / 2) - (valStr.length * 1.2), y + 5.5);
    });

    y += rowHeight;
  });

  // Draw border
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.rect(margin, y - (crops.length * rowHeight) - rowHeight, contentWidth, (crops.length + 1) * rowHeight, 'S');

  y += 5;

  // Chef name legend
  pdf.setFontSize(7);
  pdf.setTextColor(80, 80, 80);
  const legendStartY = y;
  let col = 0;
  const colWidth = contentWidth / 2;
  
  Object.entries(chefLetters).forEach(([chef, letter], idx) => {
    const row = Math.floor(idx / 2);
    col = idx % 2;
    pdf.setFont(undefined as any, 'bold');
    pdf.text(letter, margin + (col * colWidth), legendStartY + (row * 4) + 3);
    pdf.setFont(undefined as any, 'normal');
    pdf.text(` - ${chef}`, margin + (col * colWidth) + 4, legendStartY + (row * 4) + 3);
  });

  const legendRows = Math.ceil(Object.keys(chefLetters).length / 2);
  y = legendStartY + (legendRows * 4) + 8;

  return y;
};

// Types for Top Performing Crops table
interface DrawTopPerformingCropsTableParams {
  pdf: jsPDF;
  topPerformingCrops: TopPerformingCropsData;
  yStart: number;
  margin: number;
  contentWidth: number;
  isMicrogreens: boolean;
}

/**
 * Draw Top Performing Crops table
 */
export const drawTopPerformingCropsTable = ({
  pdf,
  topPerformingCrops,
  yStart,
  margin,
  contentWidth,
  isMicrogreens,
}: DrawTopPerformingCropsTableParams): number => {
  let y = yStart;

  // Section title with green background
  pdf.setFillColor(0, 135, 86);
  pdf.rect(margin, y, contentWidth, 10, 'F');
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont(undefined as any, 'bold');
  pdf.text(topPerformingCrops.title || 'Top Performing Crops', margin + 5, y + 7);
  pdf.setFont(undefined as any, 'normal');
  y += 14;

  // Subtitle
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`${topPerformingCrops.description} • ${topPerformingCrops.duration}`, margin, y);
  y += 6;

  // Table headers - removed Price column
  const priceUnit = isMicrogreens ? 'AED/Punnet' : 'AED/Kg';
  const headers = ['Crop', 'Variety', 'Market Band', 'Observed Range', 'Change %'];
  
  const colWidths = [35, 40, 45, 45, 30];

  // Draw header row
  pdf.setFillColor(0, 135, 86);
  pdf.rect(margin, y, contentWidth, 8, 'F');
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont(undefined as any, 'bold');
  let tx = margin + 2;
  headers.forEach((header, i) => {
    pdf.text(header, tx, y + 5.5);
    tx += colWidths[i];
  });
  pdf.setFont(undefined as any, 'normal');
  y += 8;

  const rowHeight = 9;
  const crops = topPerformingCrops.data || [];

  // Draw data rows
  crops.forEach((crop, rowIndex) => {
    // Alternating row background
    if (rowIndex % 2 === 0) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    tx = margin + 2;
    pdf.setFontSize(8);
    pdf.setTextColor(60, 60, 60);

    // Crop name
    const cropName = crop.cropName?.charAt(0).toUpperCase() + crop.cropName?.slice(1) || '-';
    pdf.text(cropName.substring(0, 15), tx, y + 6);
    tx += colWidths[0];

    // Variety
    const variety = crop.variety ? formatUnderscoreString(crop.variety) : '-';
    pdf.text(variety.substring(0, 18), tx, y + 6);
    tx += colWidths[1];

    // Market Band with unit in value
    const marketBand = (crop.market_band_low !== undefined && crop.market_band_high !== undefined)
      ? `${crop.market_band_low}-${crop.market_band_high} ${priceUnit}`
      : '-';
    pdf.text(marketBand, tx, y + 6);
    tx += colWidths[2];

    // Observed Range with unit in value
    const observedRange = (crop.observed_low !== undefined && crop.observed_high !== undefined)
      ? `${crop.observed_low}-${crop.observed_high} ${priceUnit}`
      : '-';
    pdf.text(observedRange, tx, y + 6);
    tx += colWidths[3];

    // Price Change Percentage with color badge
    const changeNum = Number(crop.priceChangePercentage) || 0;
    const changeStr = `${changeNum > 0 ? '+' : ''}${changeNum.toFixed(2)}%`;
    const isPositive = changeNum >= 0;
    
    // Draw badge background
    const badgeColor: [number, number, number] = isPositive ? [16, 171, 111] : [239, 83, 80];
    pdf.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
    pdf.roundedRect(tx, y + 1.5, 24, 5.5, 1, 1, 'F');
    pdf.setFontSize(7);
    pdf.setTextColor(255, 255, 255);
    pdf.text(changeStr, tx + 2, y + 5.5);

    // Draw bottom border
    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.2);
    pdf.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    y += rowHeight;
  });

  return y + 5;
};

/**
 * Draw Market Distribution by Region table
 */
interface DrawMarketDistributionParams {
  pdf: jsPDF;
  marketDistribution: MarketDistributionByRegionData;
  yStart: number;
  margin: number;
  contentWidth: number;
}

// Color palette matching the component
const REGION_COLORS: [number, number, number][] = [
  [0, 135, 86],      // #008756
  [200, 208, 79],    // #c8d04f
  [238, 169, 43],    // #eea92b
  [255, 94, 0],      // #ff5e00
  [138, 79, 255],    // #8a4fff
  [0, 188, 212],     // #00bcd4
  [240, 98, 146],    // #f06292
  [77, 208, 225],    // #4dd0e1
  [255, 183, 77],    // #ffb74d
  [174, 213, 129],   // #aed581
  [186, 104, 200],   // #ba68c8
  [144, 164, 174],   // #90a4ae
];

export const drawMarketDistributionTable = ({
  pdf,
  marketDistribution,
  yStart,
  margin,
  contentWidth,
}: DrawMarketDistributionParams): number => {
  let y = yStart;

  // Title
  pdf.setFontSize(14);
  pdf.setTextColor(0, 135, 86);
  pdf.setFont(undefined as any, 'bold');
  pdf.text(marketDistribution.title || 'Market Distribution by Region', margin, y);
  pdf.setFont(undefined as any, 'normal');
  y += 6;

  // Subtitle
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`${marketDistribution.description} • ${marketDistribution.duration}`, margin, y);
  y += 8;

  const regions = marketDistribution.data || [];
  
  if (regions.length === 0) {
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('No market distribution data available.', margin, y);
    return y + 10;
  }

  // Table headers
  const headers = ['', 'Region', 'Market Share'];
  const colWidths = [15, 100, 50];

  // Draw header row
  pdf.setFillColor(0, 135, 86);
  pdf.rect(margin, y, contentWidth, 8, 'F');
  pdf.setFontSize(9);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont(undefined as any, 'bold');
  let tx = margin + 2;
  headers.forEach((header, i) => {
    if (header) {
      pdf.text(header, tx + (i === 0 ? 5 : 0), y + 5.5);
    }
    tx += colWidths[i];
  });
  pdf.setFont(undefined as any, 'normal');
  y += 8;

  const rowHeight = 10;

  // Draw data rows
  regions.forEach((region, rowIndex) => {
    // Alternating row background
    if (rowIndex % 2 === 0) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    tx = margin + 2;

    // Color indicator (small rounded rectangle)
    const color = REGION_COLORS[rowIndex % REGION_COLORS.length];
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.roundedRect(tx + 2, y + 3, 10, 5, 1, 1, 'F');
    tx += colWidths[0];

    // Region name
    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    pdf.text(region.region || '-', tx, y + 6.5);
    tx += colWidths[1];

    // Percentage with badge
    const percentage = region.percentage !== undefined ? `${region.percentage}%` : '-';
    pdf.setFillColor(240, 240, 240);
    pdf.roundedRect(tx, y + 2, 25, 6, 2, 2, 'F');
    pdf.setFontSize(8);
    pdf.setTextColor(60, 60, 60);
    pdf.text(percentage, tx + 5, y + 6.5);

    // Draw bottom border
    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.2);
    pdf.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    y += rowHeight;
  });

  return y + 5;
};

/**
 * Draw Distribution by Product Type table (Microgreens)
 */
interface DrawDistributionByProductTypeParams {
  pdf: jsPDF;
  distributionData: DistributionByProductTypeData;
  yStart: number;
  margin: number;
  contentWidth: number;
}

// Color palette for product types
const PRODUCT_TYPE_COLORS: [number, number, number][] = [
  [0, 135, 86],      // #008756
  [129, 180, 98],    // #81b462
  [200, 208, 79],    // #c8d04f
  [238, 169, 43],    // #eea92b
  [255, 94, 0],      // #ff5e00
  [70, 178, 224],    // #46b2e0
  [211, 107, 166],   // #d36ba6
  [106, 90, 205],    // #6a5acd
];

export const drawDistributionByProductTypeTable = ({
  pdf,
  distributionData,
  yStart,
  margin,
  contentWidth,
}: DrawDistributionByProductTypeParams): number => {
  let y = yStart;

  // Title
  pdf.setFontSize(14);
  pdf.setTextColor(0, 135, 86);
  pdf.setFont(undefined as any, 'bold');
  pdf.text(distributionData.title || 'Distribution by Product Type', margin, y);
  pdf.setFont(undefined as any, 'normal');
  y += 6;

  // Subtitle
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`${distributionData.description} \u2022 ${distributionData.duration}`, margin, y);
  y += 8;

  const products = distributionData.data || [];
  
  if (products.length === 0) {
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('No distribution data available.', margin, y);
    return y + 10;
  }

  // Table headers
  const headers = ['', 'Product Type', 'Market Share'];
  const colWidths = [15, 100, 50];

  // Draw header row
  pdf.setFillColor(0, 135, 86);
  pdf.rect(margin, y, contentWidth, 8, 'F');
  pdf.setFontSize(9);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont(undefined as any, 'bold');
  let tx = margin + 2;
  headers.forEach((header, i) => {
    if (header) {
      pdf.text(header, tx + (i === 0 ? 5 : 0), y + 5.5);
    }
    tx += colWidths[i];
  });
  pdf.setFont(undefined as any, 'normal');
  y += 8;

  const rowHeight = 10;

  // Draw data rows
  products.forEach((product, rowIndex) => {
    if (rowIndex % 2 === 0) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    tx = margin + 2;

    // Color indicator
    const color = PRODUCT_TYPE_COLORS[rowIndex % PRODUCT_TYPE_COLORS.length];
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.roundedRect(tx + 2, y + 3, 10, 5, 1, 1, 'F');
    tx += colWidths[0];

    // Category name
    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    pdf.text(product.category || '-', tx, y + 6.5);
    tx += colWidths[1];

    // Percentage with badge
    const percentage = product.percentage !== undefined ? `${product.percentage}%` : '-';
    pdf.setFillColor(240, 240, 240);
    pdf.roundedRect(tx, y + 2, 25, 6, 2, 2, 'F');
    pdf.setFontSize(8);
    pdf.setTextColor(60, 60, 60);
    pdf.text(percentage, tx + 5, y + 6.5);

    // Draw bottom border
    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.2);
    pdf.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    y += rowHeight;
  });

  return y + 5;
};

/**
 * Draw Market Players by Category table (Leafy Greens)
 */
interface DrawMarketPlayersParams {
  pdf: jsPDF;
  marketPlayersData: MarketPlayersByCategoryData;
  yStart: number;
  margin: number;
  contentWidth: number;
}

export const drawMarketPlayersTable = ({
  pdf,
  marketPlayersData,
  yStart,
  margin,
  contentWidth,
}: DrawMarketPlayersParams): number => {
  let y = yStart;

  // Title
  pdf.setFontSize(14);
  pdf.setTextColor(0, 135, 86);
  pdf.setFont(undefined as any, 'bold');
  pdf.text(marketPlayersData.title || 'Market Players by Category', margin, y);
  pdf.setFont(undefined as any, 'normal');
  y += 6;

  // Subtitle
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`${marketPlayersData.description} \u2022 ${marketPlayersData.duration}`, margin, y);
  y += 8;

  const players = marketPlayersData.data || [];
  
  if (players.length === 0) {
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('No market players data available.', margin, y);
    return y + 10;
  }

  // Table headers
  const headers = ['', 'Category', 'Market Share'];
  const colWidths = [15, 100, 50];

  // Draw header row
  pdf.setFillColor(0, 135, 86);
  pdf.rect(margin, y, contentWidth, 8, 'F');
  pdf.setFontSize(9);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont(undefined as any, 'bold');
  let tx = margin + 2;
  headers.forEach((header, i) => {
    if (header) {
      pdf.text(header, tx + (i === 0 ? 5 : 0), y + 5.5);
    }
    tx += colWidths[i];
  });
  pdf.setFont(undefined as any, 'normal');
  y += 8;

  const rowHeight = 10;

  // Draw data rows
  players.forEach((player, rowIndex) => {
    if (rowIndex % 2 === 0) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    tx = margin + 2;

    // Color indicator
    const color = PRODUCT_TYPE_COLORS[rowIndex % PRODUCT_TYPE_COLORS.length];
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.roundedRect(tx + 2, y + 3, 10, 5, 1, 1, 'F');
    tx += colWidths[0];

    // Category name
    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    pdf.text(player.category || '-', tx, y + 6.5);
    tx += colWidths[1];

    // Percentage with badge
    const percentage = player.percentage !== undefined ? `${player.percentage}%` : '-';
    pdf.setFillColor(240, 240, 240);
    pdf.roundedRect(tx, y + 2, 25, 6, 2, 2, 'F');
    pdf.setFontSize(8);
    pdf.setTextColor(60, 60, 60);
    pdf.text(percentage, tx + 5, y + 6.5);

    // Draw bottom border
    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.2);
    pdf.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    y += rowHeight;
  });

  return y + 5;
};
