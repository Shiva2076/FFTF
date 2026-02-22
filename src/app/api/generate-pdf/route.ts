import { NextRequest, NextResponse } from 'next/server';

// CropData interface matching the AIRecommendedCrops component
interface CropData {
  id?: number;
  city?: string;
  crop_name: string;
  crop_variety: string;
  crop_type?: string;
  crop_profit?: number;
  crop_sustain?: number;
  crop_popularscore?: number;
  nutrient_score?: number;
  rank?: number;
  price_trend?: string;
  profitability_market_band_low_pct?: number;
  profitability_market_band_high_pct?: number;
  profitability_observed_high_pct?: number;
  profitability_observed_low_pct?: number;
  market_band_low?: number;
  market_band_high?: number;
  observed_low?: number;
  observed_high?: number;
}

interface MarketPriceTrendData {
  cropName?: string;
  crop?: string;
  variety?: string;
  data?: any;
  [key: string]: any;
}

interface PDFGenerationRequest {
  country: string;
  city: string;
  cropType: string;
  cropsByRegion: CropData[];
  marketPriceTrends: MarketPriceTrendData[];
  currency: string;
  weight: string;
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const formatVariety = (variety: string) => {
  return variety.replace(/_/g, ' ').charAt(0).toUpperCase() + variety.replace(/_/g, ' ').slice(1).toLowerCase();
};

const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

const formatNumber = (value: unknown, suffix = "") => {
  const asNumber = Number(value);
  if (!Number.isFinite(asNumber)) return "N/A";
  return `${asNumber.toLocaleString("en-US", { maximumFractionDigits: 2 })}${suffix}`;
};

// Generate QuickChart URL for market price trend
const generateChartUrl = (
  trend: MarketPriceTrendData,
  currency: string,
  weight: string
): string | null => {
  try {
    const trendData = trend.data as {
      historical?: Array<{ date: string; market_band: { min: number; max: number }; market_value: number }>;
      current?: { date: string; market_band: { min: number; max: number }; market_value: number };
      forecast?: Array<{ date: string; market_band: { min: number; max: number }; market_value: number }>;
    };

    if (!trendData || (!trendData.historical && !trendData.current && !trendData.forecast)) {
      return null;
    }

    const formatMonth = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        return date.toLocaleString("en-US", { month: "short" });
      } catch {
        return dateStr;
      }
    };

    const labels: string[] = [];
    const marketValues: (number | null)[] = [];
    const marketBandMin: (number | null)[] = [];
    const marketBandMax: (number | null)[] = [];

    // Add last 2 historical points
    if (trendData.historical && trendData.historical.length > 0) {
      const recentHistorical = trendData.historical.slice(-2);
      recentHistorical.forEach((item) => {
        labels.push(formatMonth(item.date));
        marketValues.push(item.market_value);
        marketBandMin.push(item.market_band?.min ?? null);
        marketBandMax.push(item.market_band?.max ?? null);
      });
    }

    // Add current
    if (trendData.current) {
      labels.push(formatMonth(trendData.current.date) + ' (Now)');
      marketValues.push(trendData.current.market_value);
      marketBandMin.push(trendData.current.market_band?.min ?? null);
      marketBandMax.push(trendData.current.market_band?.max ?? null);
    }

    // Add next 3 forecast points
    if (trendData.forecast && trendData.forecast.length > 0) {
      const nextForecast = trendData.forecast.slice(0, 3);
      nextForecast.forEach((item) => {
        labels.push(formatMonth(item.date));
        marketValues.push(item.market_value);
        marketBandMin.push(item.market_band?.min ?? null);
        marketBandMax.push(item.market_band?.max ?? null);
      });
    }

    if (labels.length === 0) return null;

    const chartConfig = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Market Band Max',
            data: marketBandMax,
            borderColor: 'rgba(76, 175, 80, 0.3)',
            backgroundColor: 'rgba(200, 230, 201, 0.3)',
            fill: '+1',
            borderWidth: 1,
            pointRadius: 0,
            tension: 0.3,
          },
          {
            label: 'Market Band Min',
            data: marketBandMin,
            borderColor: 'rgba(76, 175, 80, 0.3)',
            backgroundColor: 'rgba(200, 230, 201, 0.3)',
            fill: false,
            borderWidth: 1,
            pointRadius: 0,
            tension: 0.3,
          },
          {
            label: `Market Value (${currency}/${weight})`,
            data: marketValues,
            borderColor: '#008756',
            backgroundColor: '#008756',
            fill: false,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#008756',
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { size: 10 },
            },
          },
          title: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: `Price (${currency}/${weight})`,
              font: { size: 10 },
            },
            ticks: { font: { size: 9 } },
          },
          x: {
            ticks: { font: { size: 9 } },
          },
        },
      },
    };

    const chartConfigStr = encodeURIComponent(JSON.stringify(chartConfig));
    return `https://quickchart.io/chart?c=${chartConfigStr}&w=500&h=250&bkg=white`;
  } catch (error) {
    console.error('Error generating chart URL:', error);
    return null;
  }
};

const generateHTMLContent = (
  country: string,
  city: string,
  cropType: string,
  cropsByRegion: CropData[],
  marketPriceTrends: MarketPriceTrendData[],
  currency: string,
  weight: string
): string => {
  const now = new Date();
  const isMicrogreens = cropType?.toLowerCase() === 'microgreens';

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          background: white;
        }
        .page {
          page-break-after: always;
          padding: 40px;
          background: white;
          min-height: 100vh;
        }
        .page:last-child {
          page-break-after: avoid;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #008756;
          padding-bottom: 20px;
        }
        .header h1 {
          font-size: 28px;
          color: #008756;
          margin-bottom: 5px;
          font-weight: 700;
        }
        .header h2 {
          font-size: 18px;
          color: #666;
          font-weight: 500;
        }
        .report-info {
          background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
          padding: 15px 20px;
          border-radius: 6px;
          margin-bottom: 30px;
          font-size: 13px;
          line-height: 1.9;
          border-left: 4px solid #008756;
        }
        .report-info div {
          margin: 4px 0;
        }
        .report-info strong {
          color: #008756;
          font-weight: 600;
        }
        .section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: white;
          background-color: #008756;
          padding: 12px 15px;
          margin-bottom: 0;
          border-radius: 4px 4px 0 0;
        }
        .section-content {
          background: #fafafa;
          padding: 15px;
          border-radius: 0 0 4px 4px;
          font-size: 12px;
          line-height: 1.8;
          border: 1px solid #e0e0e0;
          border-top: none;
        }
        .crop-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .crop-table th, .crop-table td {
          padding: 10px 8px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
          font-size: 11px;
        }
        .crop-table th {
          background: #008756;
          color: white;
          font-weight: 600;
        }
        .crop-table tr:nth-child(even) {
          background: #f9f9f9;
        }
        .crop-table tr:hover {
          background: #f0f0f0;
        }
        .score-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 10px;
        }
        .score-high { background: #e8f5e9; color: #2e7d32; }
        .score-medium { background: #fff3e0; color: #ef6c00; }
        .score-low { background: #ffebee; color: #c62828; }
        .trend-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .trend-item:last-child {
          border-bottom: none;
        }
        .footer {
          text-align: center;
          font-size: 11px;
          color: #999;
          margin-top: 40px;
          padding-top: 12px;
          border-top: 1px solid #ddd;
        }
        .chart-container {
          text-align: center;
          margin: 15px 0;
          padding: 10px;
          background: white;
          border-radius: 4px;
        }
        .chart-container img {
          max-width: 100%;
          height: auto;
        }
        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 10px;
          font-size: 10px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
      </style>
    </head>
    <body>
  `;

  // Page 1: AI Recommended Crops
  html += `
    <div class="page">
      <div class="header">
        <h1>INNO MarketTrend Report</h1>
        <h2>AI Recommended Crops</h2>
      </div>
      
      <div class="report-info">
        <div><strong>Country:</strong> ${escapeHtml(country || '-')}</div>
        <div><strong>City:</strong> ${escapeHtml(city || '-')}</div>
        <div><strong>Crop Type:</strong> ${escapeHtml(cropType || '-')}</div>
        <div><strong>Generated:</strong> ${now.toLocaleString()}</div>
      </div>

      <div class="section">
        <div class="section-title">AI Recommended Crops for ${escapeHtml(city)}</div>
        <div class="section-content">
          <table class="crop-table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Variety</th>
                <th>Profitability (%)</th>
                <th>Demand Score</th>
                <th>${isMicrogreens ? 'Nutrient Score' : 'Sustainability Score'}</th>
                <th>${isMicrogreens ? 'Price' : 'Price Range'}</th>
              </tr>
            </thead>
            <tbody>
  `;

  // Sort crops by rank or profit (ascending rank = higher priority)
  const sortedCrops = [...cropsByRegion].sort((a, b) => (a.rank || 999) - (b.rank || 999));
  
  sortedCrops.forEach((crop) => {
    // Profitability display
    let profitabilityDisplay = '-';
    if (crop.profitability_market_band_low_pct !== undefined && crop.profitability_market_band_high_pct !== undefined) {
      profitabilityDisplay = `${crop.profitability_market_band_low_pct.toFixed(2)} - ${crop.profitability_market_band_high_pct.toFixed(2)}`;
    }

    // Demand score
    const demandScore = crop.crop_popularscore !== undefined && crop.crop_popularscore !== null
      ? crop.crop_popularscore.toFixed(2)
      : '-';

    // Sustainability or Nutrient score based on crop type
    let scoreDisplay = '-';
    if (isMicrogreens) {
      scoreDisplay = crop.nutrient_score !== undefined && crop.nutrient_score !== null
        ? crop.nutrient_score.toFixed(2)
        : '-';
    } else {
      scoreDisplay = crop.crop_sustain !== undefined && crop.crop_sustain !== null
        ? crop.crop_sustain.toFixed(2)
        : '-';
    }

    // Price display
    let priceDisplay = '-';
    if (crop.market_band_low !== undefined && crop.market_band_high !== undefined) {
      priceDisplay = `${crop.market_band_low} - ${crop.market_band_high} ${currency}/${weight}`;
    } else if (crop.price_trend) {
      try {
        const priceTrend = JSON.parse(crop.price_trend);
        const latestPrice = priceTrend?.at?.(-1)?.avg_price;
        if (latestPrice !== undefined) {
          priceDisplay = `${currency} ${latestPrice.toFixed(2)} /${weight}`;
        }
      } catch {
        // Ignore parse errors
      }
    }

    html += `
      <tr>
        <td>${escapeHtml(capitalize(crop.crop_name))}</td>
        <td>${escapeHtml(formatVariety(crop.crop_variety))}</td>
        <td>${profitabilityDisplay}</td>
        <td>${demandScore}</td>
        <td>${scoreDisplay}</td>
        <td>${priceDisplay}</td>
      </tr>
    `;
  });

  html += `
            </tbody>
          </table>
        </div>
      </div>

      <div class="footer">
        Page 1 | INNOFarms.AI MarketTrend Report
      </div>
    </div>
  `;

  // Page 2: Market Price Trends
  html += `
    <div class="page">
      <div class="header">
        <h1>INNO MarketTrend Report</h1>
        <h2>Market Price Trends</h2>
      </div>
      
      <div class="report-info">
        <div><strong>Country:</strong> ${escapeHtml(country || '-')}</div>
        <div><strong>City:</strong> ${escapeHtml(city || '-')}</div>
        <div><strong>Crop Type:</strong> ${escapeHtml(cropType || '-')}</div>
        <div><strong>Generated:</strong> ${now.toLocaleString()}</div>
      </div>
  `;

  if (marketPriceTrends && marketPriceTrends.length > 0) {
    marketPriceTrends.slice(0, 6).forEach((trend) => {
      const cropName = trend.cropName || trend.crop || '';
      const variety = trend.variety || '';
      
      html += `
        <div class="section">
          <div class="section-title">${escapeHtml(capitalize(cropName))} - ${escapeHtml(formatVariety(variety))}</div>
          <div class="section-content">
      `;

      // Handle new CropTrend format with historical, current, forecast data
      if (trend.data && typeof trend.data === 'object' && ('historical' in trend.data || 'current' in trend.data || 'forecast' in trend.data)) {
        const trendData = trend.data as {
          historical?: Array<{ date: string; market_band: { min: number; max: number }; market_value: number; confidence?: { min: number; max: number } }>;
          current?: { date: string; market_band: { min: number; max: number }; market_value: number; confidence: { min: number; max: number } };
          forecast?: Array<{ date: string; market_band: { min: number; max: number }; market_value: number; confidence: { min: number; max: number } }>;
        };

        // Helper to format date with day, month and year
        const formatMonth = (dateStr: string) => {
          try {
            const date = new Date(dateStr);
            return date.toLocaleString("en-US", { day: "numeric", month: "short", year: "numeric" });
          } catch {
            return dateStr;
          }
        };

        html += `<table class="crop-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Date</th>
              <th>Market Value</th>
              <th>Market Band</th>
              <th>Confidence Band</th>
            </tr>
          </thead>
          <tbody>`;

        // Historical data (last 2 entries)
        if (trendData.historical && trendData.historical.length > 0) {
          const recentHistorical = trendData.historical.slice(-2);
          recentHistorical.forEach((item) => {
            html += `
              <tr>
                <td><span class="score-badge score-medium">Historical</span></td>
                <td>${escapeHtml(formatMonth(item.date))}</td>
                <td>${formatNumber(item.market_value)} ${currency}/${weight}</td>
                <td>${formatNumber(item.market_band?.min)} - ${formatNumber(item.market_band?.max)} ${currency}/${weight}</td>
                <td>${item.confidence ? `${formatNumber(item.confidence.min)} - ${formatNumber(item.confidence.max)} ${currency}/${weight}` : '-'}</td>
              </tr>
            `;
          });
        }

        // Current data
        if (trendData.current) {
          html += `
            <tr style="background: rgba(0,135,86,0.1);">
              <td><span class="score-badge score-high">Current</span></td>
              <td>${escapeHtml(formatMonth(trendData.current.date))}</td>
              <td><strong>${formatNumber(trendData.current.market_value)} ${currency}/${weight}</strong></td>
              <td>${formatNumber(trendData.current.market_band?.min)} - ${formatNumber(trendData.current.market_band?.max)} ${currency}/${weight}</td>
              <td>${trendData.current.confidence ? `${formatNumber(trendData.current.confidence.min)} - ${formatNumber(trendData.current.confidence.max)} ${currency}/${weight}` : '-'}</td>
            </tr>
          `;
        }

        // Forecast data (next 3 entries)
        if (trendData.forecast && trendData.forecast.length > 0) {
          const nextForecast = trendData.forecast.slice(0, 3);
          nextForecast.forEach((item) => {
            html += `
              <tr>
                <td><span class="score-badge score-low">Forecast</span></td>
                <td>${escapeHtml(formatMonth(item.date))}</td>
                <td>${formatNumber(item.market_value)} ${currency}/${weight}</td>
                <td>${formatNumber(item.market_band?.min)} - ${formatNumber(item.market_band?.max)} ${currency}/${weight}</td>
                <td>${item.confidence ? `${formatNumber(item.confidence.min)} - ${formatNumber(item.confidence.max)} ${currency}/${weight}` : '-'}</td>
              </tr>
            `;
          });
        }

        html += `</tbody></table>`;

        // Generate and add chart
        const chartUrl = generateChartUrl(trend, currency, weight);
        if (chartUrl) {
          html += `
            <div class="chart-container">
              <img src="${chartUrl}" alt="Price Trend Chart for ${escapeHtml(capitalize(cropName))}" />
            </div>
          `;
        }
      } else if (trend.data && Array.isArray(trend.data)) {
        // Handle simple array format
        trend.data.forEach((point: any) => {
          html += `
            <div class="trend-item">
              <span>${escapeHtml(point.month || point.date || '')}</span>
              <span>${formatNumber(point.min || point.market_value)} - ${formatNumber(point.max || point.market_value)} ${currency}/${weight}</span>
            </div>
          `;
        });
      } else {
        html += `<p>No detailed price trend data available</p>`;
      }

      html += `
          </div>
        </div>
      `;
    });
  } else {
    html += `
      <div class="section">
        <div class="section-title">Market Price Trends</div>
        <div class="section-content">
          <p>No market price trend data available for this selection.</p>
        </div>
      </div>
    `;
  }

  html += `
      <div class="footer">
        Page 2 | INNOFarms.AI MarketTrend Report
      </div>
    </div>
  `;

  html += `
    </body>
    </html>
  `;

  return html;
};

export async function POST(request: NextRequest) {
  try {
    const body: PDFGenerationRequest = await request.json();
    const { country, city, cropType, cropsByRegion, marketPriceTrends, currency, weight } = body;

    // Validate input
    if (!cropsByRegion || cropsByRegion.length === 0) {
      return NextResponse.json(
        { error: 'No crop data provided' },
        { status: 400 }
      );
    }

    // Generate HTML content
    const htmlContent = generateHTMLContent(
      country,
      city,
      cropType,
      cropsByRegion,
      marketPriceTrends || [],
      currency || 'AED',
      weight || 'kg'
    );

    const fileName = `MarketTrend_${city || 'city'}_${cropType || 'crops'}_${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '');

    // Return HTML content to be converted to PDF on client-side using html2pdf
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    return NextResponse.json(
      {
        html: htmlContent,
        fileName: fileName,
      },
      { status: 200, headers }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('HTML generation error:', errorMsg, error);
    return NextResponse.json(
      { error: `Failed to generate HTML: ${errorMsg}` },
      { status: 500 }
    );
  }
}
