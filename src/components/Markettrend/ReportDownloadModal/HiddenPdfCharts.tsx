"use client";

import React, { forwardRef, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import MarketPriceTrend from "@/components/Markettrend/MarketOverview/Marketpricetrend";
import { formatUnderscoreString } from "@/utils/Capitalize";

// Market price trend can have different structures
interface MarketPriceTrendItem {
  cropName?: string;
  crop?: string;
  variety?: string;
  data?: any;
  [key: string]: any;
}

interface YouTubeSentiment {
  channel_name: string;
  basil_count: number;
  spinach_count: number;
  kale_count: number;
  lettuce_count: number;
  arugula_count: number;
  celery_count: number;
  bok_choy_count: number;
}

interface RegionData {
  region: string;
  percentage: number;
}

interface MarketDistributionByRegionData {
  title: string;
  description: string;
  duration: string;
  data: RegionData[];
}

interface ProductTypeData {
  category: string;
  percentage: number;
}

interface DistributionByProductTypeData {
  title?: string;
  description: string;
  duration: string;
  data: ProductTypeData[];
}

interface PlayerCategoryData {
  category: string;
  percentage: number;
}

interface MarketPlayersByCategoryData {
  title: string;
  description: string;
  duration: string;
  data: PlayerCategoryData[];
}

interface HiddenPdfChartsProps {
  selectedCropKeys: string[];
  marketPriceTrends: MarketPriceTrendItem[];
  youtubeSentiments?: YouTubeSentiment[];
  marketDistributionByRegion?: MarketDistributionByRegionData | null;
  distributionByProductType?: DistributionByProductTypeData | null;
  marketPlayersByCategory?: MarketPlayersByCategoryData | null;
}

// Crop colors for heatmap
const CROP_COLORS: Record<string, string> = {
  Arugula: "#008756",
  Basil: "#509e5b",
  Celery: "#81b462",
  Kale: "#b1ca6c",
  Lettuce: "#c8d04f",
  "Pak Choi": "#e7c552",
  Parsley: "#eea92b",
  Spinach: "#ff5e00",
};

const DYNAMIC_BIN_COLORS = ["#67AB85", "#349264", "#007548", "#8FB9EA", "#2E81D3"];

/**
 * Hidden container for rendering charts to capture in PDF
 * Uses forwardRef to pass the ref to the parent component for html2canvas
 */
const HiddenPdfCharts = forwardRef<HTMLDivElement, HiddenPdfChartsProps>(
  ({ selectedCropKeys, marketPriceTrends, youtubeSentiments = [], marketDistributionByRegion, distributionByProductType, marketPlayersByCategory }, ref) => {
    // Helper to normalize variety for comparison (handles underscores, spaces, empty strings)
    // Must match how MarketPriceTrend builds IDs: `${item.cropName.toLowerCase()}-${(item.variety || 'general').toLowerCase()}`
    const normalizeVariety = (variety: string | undefined | null): string => {
      if (!variety || variety.trim() === '') return 'general';
      // Remove all underscores and spaces for comparison
      return variety.toLowerCase().replace(/[_\s]/g, '');
    };

    // Helper to normalize crop name for comparison
    // Removes all underscores and spaces so "garden_cress" matches "gardencress"
    const normalizeCropName = (name: string | undefined | null): string => {
      if (!name) return '';
      // Remove all underscores and spaces for comparison
      return name.toLowerCase().replace(/[_\s]/g, '');
    };

    // Process YouTube sentiments for heatmap
    const crops = ['Arugula', 'Basil', 'Celery', 'Kale', 'Lettuce', 'Pak Choi', 'Spinach'] as const;
    
    const chefCropData = useMemo(() => {
      return youtubeSentiments.map((it) => ({
        chef: it.channel_name,
        Arugula: it.arugula_count,
        Basil: it.basil_count,
        Celery: it.celery_count,
        Kale: it.kale_count,
        Lettuce: it.lettuce_count,
        'Pak Choi': it.bok_choy_count,
        Spinach: it.spinach_count,
      }));
    }, [youtubeSentiments]);

    const chefs = chefCropData.map((row) => row.chef);

    const chefLabelsMap = useMemo(() => {
      return chefs.reduce<Record<string, string>>((acc, chef, idx) => {
        acc[chef] = String.fromCharCode(65 + idx);
        return acc;
      }, {});
    }, [chefs]);

    const heatmapData = useMemo(() => {
      const rows: { x: string; y: string; value: number }[] = [];
      chefCropData.forEach((row) => {
        crops.forEach((crop) =>
          rows.push({ x: row.chef, y: crop, value: Number((row as any)[crop] || 0) })
        );
      });
      return rows;
    }, [chefCropData]);

    const maxValue = useMemo(
      () => Math.max(...heatmapData.map(d => d.value), 0),
      [heatmapData]
    );

    const dynamicBins = useMemo(() => {
      const binSize = Math.ceil(maxValue / 5);
      let step = Math.ceil(binSize / 10) * 10;
      if (step === 0) step = 10;

      const bins = [];
      for (let i = 0; i < 5; i++) {
        const min = i === 0 ? 0 : i * step + 1;
        const max = i < 4 ? (i + 1) * step : Infinity;
        bins.push({ min, max, color: DYNAMIC_BIN_COLORS[i] });
      }
      return bins;
    }, [maxValue]);

    return (
      <Box
        key={`pdf-container-${selectedCropKeys.join('-')}-${marketPriceTrends.length}`}
        ref={ref}
        sx={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '800px',
          backgroundColor: '#fff',
          zIndex: -1,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {selectedCropKeys.map((cropKey, index) => {
          // Find the matching trend data for this crop
          // cropKey format: "crop_name-crop_variety" (e.g., "kale-red_russian")
          const [cropName, ...varietyParts] = cropKey.split('-');
          const variety = varietyParts.join('-'); // Handle varieties with dashes
          
          const trendData = marketPriceTrends.find((trend) => {
            const trendCropName = normalizeCropName(trend.cropName || trend.crop);
            const trendVariety = normalizeVariety(trend.variety);
            const searchCropName = normalizeCropName(cropName);
            const searchVariety = normalizeVariety(variety);
            
            return trendCropName === searchCropName && trendVariety === searchVariety;
          });

          if (!trendData) {
            console.log(`No trend data found for: ${cropKey} (searching: cropName="${cropName}", variety="${variety}")`);
            console.log('Available trends:', marketPriceTrends.map(t => `${t.cropName || t.crop}-${t.variety}`));
            return null;
          }

          // Format crop display name
          const displayName = `${cropName.charAt(0).toUpperCase() + cropName.slice(1)} - ${formatUnderscoreString(variety)}`;

          return (
            <Box
              key={`${cropKey}-${index}`}
              className="pdf-chart-container"
              data-crop-name={displayName}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: '#fff',
                minHeight: '400px',
                width: '100%',
              }}
            >
              <MarketPriceTrend data={[trendData] as any} showTooltipOnCurrent={true} />
            </Box>
          );
        })}

        {/* Social Trends Heatmap */}
        {youtubeSentiments.length > 0 && (
          <Box
            className="pdf-social-trends-container"
            sx={{
              p: 3,
              backgroundColor: '#fff',
              width: '100%',
            }}
          >
            <Typography 
              variant="h6" 
              fontWeight={600} 
              mb={2}
              sx={{
                color: '#008756',
                borderBottom: '2px solid #008756',
                pb: 1,
              }}
            >
              Social Trends: What’s Influencing Consumer Interest?
            </Typography>

            {/* Legend */}
            <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
              <Typography variant="body2" fontWeight={500} mr={2}>
                Mentions:
              </Typography>
              {dynamicBins.map((b, i) => (
                <Box key={i} display="flex" alignItems="center" mr={3} mb={1}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      bgcolor: b.color,
                      borderRadius: 0.5,
                      mr: 0.5,
                    }}
                  />
                  <Typography variant="caption">
                    {b.max !== Infinity ? `${b.min}–${b.max}` : `${b.min - 1}+`}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Heatmap Grid */}
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Box
                sx={{
                  display: "grid",
                  gridAutoRows: "40px",
                  gridTemplateColumns: `100px repeat(${chefs.length}, minmax(80px,1fr))`,
                  gap: "1px",
                  backgroundColor: "#ddd",
                }}
              >
                {crops.map((crop) => (
                  <React.Fragment key={crop}>
                    {/* Crop labels (Y-axis) */}
                    <Box
                      sx={{
                        backgroundColor: "#f9f9f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        pr: 2,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {crop}
                    </Box>

                    {/* Data cells */}
                    {chefs.map((chef) => {
                      const val = heatmapData.find(
                        (d) => d.x === chef && d.y === crop
                      )?.value ?? 0;
                      const bin = dynamicBins.find((b, i) => {
                        const isLast = i === dynamicBins.length - 1;
                        return isLast ? val >= b.min : val >= b.min && val <= b.max;
                      });
                      const color = bin?.color || "#ccc";
                      return (
                        <Box
                          key={`${chef}-${crop}`}
                          sx={{
                            backgroundColor: color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            color: "#fff",
                          }}
                        >
                          {val}
                        </Box>
                      );
                    })}
                  </React.Fragment>
                ))}
              </Box>

              {/* Chef letter labels */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `100px repeat(${chefs.length}, minmax(80px,1fr))`,
                  mt: 1,
                }}
              >
                <Box /> {/* spacer */}
                {chefs.map((chef) => (
                  <Box
                    key={chef}
                    sx={{
                      fontSize: 12,
                      textAlign: "center",
                      px: 1,
                    }}
                  >
                    {chefLabelsMap[chef]}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Chef name legend */}
            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              justifyContent="center"
              mt={2}
            >
              {Object.entries(chefLabelsMap).map(([chefName, letter]) => (
                <Box
                  key={chefName}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {letter}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {chefName}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Market Distribution by Region Pie Chart */}
        {marketDistributionByRegion && marketDistributionByRegion.data && marketDistributionByRegion.data.length > 0 && (
          <Box
            className="pdf-market-distribution-container"
            sx={{
              p: 3,
              backgroundColor: '#fff',
              width: '100%',
            }}
          >
            <Typography 
              variant="h6" 
              fontWeight={600} 
              mb={2}
              sx={{
                color: '#008756',
                borderBottom: '2px solid #008756',
                pb: 1,
              }}
            >
              {marketDistributionByRegion.title || 'Market Distribution by Region'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* Pie Chart */}
              <Box sx={{ width: 220, height: 220 }}>
                <svg viewBox="0 0 200 200" width="100%" height="100%">
                  {(() => {
                    const COLORS = [
                      '#008756', '#c8d04f', '#eea92b', '#ff5e00', '#8a4fff',
                      '#00bcd4', '#f06292', '#4dd0e1', '#ffb74d', '#aed581',
                      '#ba68c8', '#90a4ae'
                    ];
                    const data = marketDistributionByRegion.data;
                    const total = data.reduce((sum, item) => sum + item.percentage, 0);
                    let cumulativeAngle = -90;
                    const centerX = 100;
                    const centerY = 100;
                    const outerRadius = 90;
                    const innerRadius = 50;

                    return data.map((item, index) => {
                      const sliceAngle = (item.percentage / total) * 360;
                      const startAngle = cumulativeAngle;
                      const endAngle = cumulativeAngle + sliceAngle;
                      cumulativeAngle = endAngle;

                      const startRadians = (startAngle * Math.PI) / 180;
                      const endRadians = (endAngle * Math.PI) / 180;

                      const x1Outer = centerX + outerRadius * Math.cos(startRadians);
                      const y1Outer = centerY + outerRadius * Math.sin(startRadians);
                      const x2Outer = centerX + outerRadius * Math.cos(endRadians);
                      const y2Outer = centerY + outerRadius * Math.sin(endRadians);

                      const x1Inner = centerX + innerRadius * Math.cos(endRadians);
                      const y1Inner = centerY + innerRadius * Math.sin(endRadians);
                      const x2Inner = centerX + innerRadius * Math.cos(startRadians);
                      const y2Inner = centerY + innerRadius * Math.sin(startRadians);

                      const largeArcFlag = sliceAngle > 180 ? 1 : 0;

                      const d = [
                        `M ${x1Outer} ${y1Outer}`,
                        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
                        `L ${x1Inner} ${y1Inner}`,
                        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}`,
                        'Z',
                      ].join(' ');

                      return (
                        <path
                          key={index}
                          d={d}
                          fill={COLORS[index % COLORS.length]}
                        />
                      );
                    });
                  })()}
                </svg>
              </Box>

              {/* Legend */}
              <Box sx={{ flex: 1 }}>
                {marketDistributionByRegion.data.map((item, index) => {
                  const COLORS = [
                    '#008756', '#c8d04f', '#eea92b', '#ff5e00', '#8a4fff',
                    '#00bcd4', '#f06292', '#4dd0e1', '#ffb74d', '#aed581',
                    '#ba68c8', '#90a4ae'
                  ];
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 0.75,
                        borderBottom: index !== marketDistributionByRegion.data.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '3px',
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <Typography sx={{ flex: 1, fontSize: 13 }}>
                        {item.region}
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.06)',
                          borderRadius: '12px',
                          px: 1.5,
                          py: 0.25,
                        }}
                      >
                        <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                          {item.percentage}%
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}

        {/* Distribution by Product Type Pie Chart (Microgreens) */}
        {distributionByProductType && distributionByProductType.data && distributionByProductType.data.length > 0 && (
          <Box
            className="pdf-distribution-product-type-container"
            sx={{
              p: 3,
              backgroundColor: '#fff',
              width: '100%',
            }}
          >
            <Typography 
              variant="h6" 
              fontWeight={600} 
              mb={2}
              sx={{
                color: '#008756',
                borderBottom: '2px solid #008756',
                pb: 1,
              }}
            >
              {distributionByProductType.title || 'Distribution by Product Type'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* Pie Chart */}
              <Box sx={{ width: 220, height: 220 }}>
                <svg viewBox="0 0 200 200" width="100%" height="100%">
                  {(() => {
                    const COLORS = [
                      '#008756', '#81b462', '#c8d04f', '#eea92b', '#ff5e00',
                      '#46b2e0', '#d36ba6', '#6a5acd', '#ff69b4', '#20b2aa'
                    ];
                    const data = distributionByProductType.data;
                    const total = data.reduce((sum, item) => sum + item.percentage, 0);
                    let cumulativeAngle = -90;
                    const centerX = 100;
                    const centerY = 100;
                    const outerRadius = 90;
                    const innerRadius = 50;

                    return data.map((item, index) => {
                      const sliceAngle = (item.percentage / total) * 360;
                      const startAngle = cumulativeAngle;
                      const endAngle = cumulativeAngle + sliceAngle;
                      cumulativeAngle = endAngle;

                      const startRadians = (startAngle * Math.PI) / 180;
                      const endRadians = (endAngle * Math.PI) / 180;

                      const x1Outer = centerX + outerRadius * Math.cos(startRadians);
                      const y1Outer = centerY + outerRadius * Math.sin(startRadians);
                      const x2Outer = centerX + outerRadius * Math.cos(endRadians);
                      const y2Outer = centerY + outerRadius * Math.sin(endRadians);

                      const x1Inner = centerX + innerRadius * Math.cos(endRadians);
                      const y1Inner = centerY + innerRadius * Math.sin(endRadians);
                      const x2Inner = centerX + innerRadius * Math.cos(startRadians);
                      const y2Inner = centerY + innerRadius * Math.sin(startRadians);

                      const largeArcFlag = sliceAngle > 180 ? 1 : 0;

                      const d = [
                        `M ${x1Outer} ${y1Outer}`,
                        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
                        `L ${x1Inner} ${y1Inner}`,
                        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}`,
                        'Z',
                      ].join(' ');

                      return (
                        <path
                          key={index}
                          d={d}
                          fill={COLORS[index % COLORS.length]}
                        />
                      );
                    });
                  })()}
                </svg>
              </Box>

              {/* Legend */}
              <Box sx={{ flex: 1 }}>
                {distributionByProductType.data.map((item, index) => {
                  const COLORS = [
                    '#008756', '#81b462', '#c8d04f', '#eea92b', '#ff5e00',
                    '#46b2e0', '#d36ba6', '#6a5acd', '#ff69b4', '#20b2aa'
                  ];
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 0.75,
                        borderBottom: index !== distributionByProductType.data.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '3px',
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <Typography sx={{ flex: 1, fontSize: 13 }}>
                        {item.category}
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.06)',
                          borderRadius: '12px',
                          px: 1.5,
                          py: 0.25,
                        }}
                      >
                        <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                          {item.percentage}%
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}

        {/* Market Players by Category Pie Chart (Leafy Greens) */}
        {marketPlayersByCategory && marketPlayersByCategory.data && marketPlayersByCategory.data.length > 0 && (
          <Box
            className="pdf-market-players-container"
            sx={{
              p: 3,
              backgroundColor: '#fff',
              width: '100%',
            }}
          >
            <Typography 
              variant="h6" 
              fontWeight={600} 
              mb={2}
              sx={{
                color: '#008756',
                borderBottom: '2px solid #008756',
                pb: 1,
              }}
            >
              {marketPlayersByCategory.title || 'Market Players by Category'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* Pie Chart */}
              <Box sx={{ width: 220, height: 220 }}>
                <svg viewBox="0 0 200 200" width="100%" height="100%">
                  {(() => {
                    const COLORS = [
                      '#008756', '#81b462', '#c8d04f', '#eea92b', '#ff5e00',
                      '#46b2e0', '#d36ba6', '#6a5acd', '#ff69b4', '#20b2aa'
                    ];
                    const data = marketPlayersByCategory.data;
                    const total = data.reduce((sum, item) => sum + item.percentage, 0);
                    let cumulativeAngle = -90;
                    const centerX = 100;
                    const centerY = 100;
                    const outerRadius = 90;
                    const innerRadius = 50;

                    return data.map((item, index) => {
                      const sliceAngle = (item.percentage / total) * 360;
                      const startAngle = cumulativeAngle;
                      const endAngle = cumulativeAngle + sliceAngle;
                      cumulativeAngle = endAngle;

                      const startRadians = (startAngle * Math.PI) / 180;
                      const endRadians = (endAngle * Math.PI) / 180;

                      const x1Outer = centerX + outerRadius * Math.cos(startRadians);
                      const y1Outer = centerY + outerRadius * Math.sin(startRadians);
                      const x2Outer = centerX + outerRadius * Math.cos(endRadians);
                      const y2Outer = centerY + outerRadius * Math.sin(endRadians);

                      const x1Inner = centerX + innerRadius * Math.cos(endRadians);
                      const y1Inner = centerY + innerRadius * Math.sin(endRadians);
                      const x2Inner = centerX + innerRadius * Math.cos(startRadians);
                      const y2Inner = centerY + innerRadius * Math.sin(startRadians);

                      const largeArcFlag = sliceAngle > 180 ? 1 : 0;

                      const d = [
                        `M ${x1Outer} ${y1Outer}`,
                        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
                        `L ${x1Inner} ${y1Inner}`,
                        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}`,
                        'Z',
                      ].join(' ');

                      return (
                        <path
                          key={index}
                          d={d}
                          fill={COLORS[index % COLORS.length]}
                        />
                      );
                    });
                  })()}
                </svg>
              </Box>

              {/* Legend */}
              <Box sx={{ flex: 1 }}>
                {marketPlayersByCategory.data.map((item, index) => {
                  const COLORS = [
                    '#008756', '#81b462', '#c8d04f', '#eea92b', '#ff5e00',
                    '#46b2e0', '#d36ba6', '#6a5acd', '#ff69b4', '#20b2aa'
                  ];
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 0.75,
                        borderBottom: index !== marketPlayersByCategory.data.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '3px',
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <Typography sx={{ flex: 1, fontSize: 13 }}>
                        {item.category}
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.06)',
                          borderRadius: '12px',
                          px: 1.5,
                          py: 0.25,
                        }}
                      >
                        <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                          {item.percentage}%
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    );
  }
);

HiddenPdfCharts.displayName = 'HiddenPdfCharts';

export default HiddenPdfCharts;
