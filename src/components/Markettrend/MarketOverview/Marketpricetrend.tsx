"use client";

import type { FC } from "react";
import { useState } from "react";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import ProtectedBlurWrapper from "@/components/Markettrend/ProtectedBlurWrapper";
import { formatUnderscoreString } from "@/utils/Capitalize";
type CropTrend = {
  cropName: string;
  variety: string;
  data: {
    historical: {
      date: string;
      market_band: { min: number; max: number };
      market_value: number;
      confidence?: { min: number; max: number };
    }[];
    current: {
      date: string;
      market_band: { min: number; max: number };
      market_value: number;
      confidence: { min: number; max: number };
    };
    forecast: {
      date: string;
      market_band: { min: number; max: number };
      market_value: number;
      confidence: { min: number; max: number };
    }[];
  };
};

interface Props {
  data: {
    cropType?: string;
    data?: CropTrend[];
    title?: string;
    description?: string;
  } | CropTrend[] | null | undefined;
}

const MarketPriceTrend: FC<Props> = ({ data }) => {
  const marketPricetrendData: CropTrend[] = Array.isArray(data) 
    ? data 
    : (data?.data && Array.isArray(data.data) ? data.data : []);
  const isDataObject = data && typeof data === 'object' && !Array.isArray(data);
  const title = (isDataObject && 'title' in data && data.title) ? data.title : "Market Price Trends";
  const description = (isDataObject && 'description' in data && data.description) 
    ? data.description 
    : "Historical and forecasted price trends for selected crops";

  if (marketPricetrendData.length === 0) {
      return (
        <Box
          sx={{
            width: "88.5%",
            backgroundColor: "#fff",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            padding: "1.5rem",
            borderRadius: "8px",
            textAlign: "center",
            color: "rgba(0,0,0,0.6)",
          }}
        >
          No data available
        </Box>
      );
    }
   
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const { currency, weight } = useSelector((state: RootState) => state.locationMeta);
  const selectedCropFilter = useSelector((state: RootState) => state.selectedCropTypetab);
  const isMicrogreens = selectedCropFilter?.toLowerCase() === "microgreens";
  const isAuthenticated = Boolean(userInfo?.user_id);
  const ismarkettrendsubscribed = Boolean(userInfo?.markettrendsubscribed);
  const shouldRestrict = !isAuthenticated || !ismarkettrendsubscribed;
  const formatMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", { month: "short" });
  };

  // Helper function to filter and process forecast data by unique months
  const processForecastData = (allForecast: any[], currentMonthDate: Date | null, getDate: (item: any) => Date, range: 1 | 2 | 3) => {
    const validForecast = allForecast.filter(item => item && getDate(item));
    const sortedForecast = validForecast.sort((a, b) => {
      const dateA = getDate(a).getTime();
      const dateB = getDate(b).getTime();
      return dateA - dateB;
    });
    
    const forecastExcludingCurrent = currentMonthDate
      ? sortedForecast.filter(item => {
          const itemDate = getDate(item);
          return itemDate.getFullYear() !== currentMonthDate.getFullYear() || 
                 itemDate.getMonth() !== currentMonthDate.getMonth();
        })
      : sortedForecast;
    
    const monthMap = new Map<string, any>();
    forecastExcludingCurrent.forEach(item => {
      const itemDate = getDate(item);
      const monthKey = `${itemDate.getFullYear()}-${itemDate.getMonth()}`;
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, item);
      }
    });
    
    const uniqueMonthForecast = Array.from(monthMap.values()).sort((a, b) => {
      const dateA = getDate(a).getTime();
      const dateB = getDate(b).getTime();
      return dateA - dateB;
    });
    
    return range === 3 ? uniqueMonthForecast : uniqueMonthForecast.slice(0, range);
  };

  const cropOptions = marketPricetrendData.map((item) => ({
    id: `${item.cropName.toLowerCase()}-${(item.variety || 'general').toLowerCase()}`,
    cropName: item.cropName,
    variety: item.variety || 'general',
  }));
  const hasLettuce = cropOptions.some(opt => opt.cropName.toLowerCase() === "lettuce");

  const [selectedCrop, setSelectedCrop] = useState<string>(() => {
    if (shouldRestrict && hasLettuce) {
      return cropOptions.find(opt => opt.cropName.toLowerCase() === "lettuce")?.id || cropOptions[0]?.id || "";
    }
    return cropOptions[0]?.id || "";
  });
  const [forecastRange, setForecastRange] = useState<1 | 2 | 3>(3);
  const cropData = marketPricetrendData.find(item => 
    `${item.cropName.toLowerCase()}-${(item.variety || 'general').toLowerCase()}` === selectedCrop
  );

  const isNewFormat = cropData?.data?.current && 'market_band' in cropData.data.current;

  // Build chart data - different logic for new format (leafy greens) vs old format (microgreens)
  const buildChartData = () => {
    if (isMicrogreens || !isNewFormat) {
      // Old format for microgreens
      return buildOldFormatChartData();
    } else {
      // New format for leafy greens
      return buildNewFormatChartData();
    }
  };

  const buildOldFormatChartData = () => {
    const data: any[] = [];
    const historical = (cropData?.data as any)?.historical || [];
    const current = (cropData?.data as any)?.current;
    const allForecast = (cropData?.data as any)?.forecast || [];
    const currentMonthDate = current && (current.month || current.date)
      ? new Date(current.month || current.date)
      : null;
    
    const forecast = processForecastData(
      allForecast,
      currentMonthDate,
      (item: any) => new Date(item.month || item.date),
      forecastRange
    );

    // Add historical data
    historical.forEach((item: any) => {
      const month = item.month ? formatMonth(item.month) : '';
      if (month) {
        data.push({
          month: month,
          price: item.price_monthly_avg || 0,
        });
      }
    });

    // Add current month
    if (current && (current.month || current.date)) {
      const month = current.month ? formatMonth(current.month) : formatMonth(current.date);
      if (month) {
        data.push({
          month: month,
          price: current.price_monthly_avg || 0,
        });
      }
    }

    // Add forecast
    forecast.forEach((item: any) => {
      const month = item.month ? formatMonth(item.month) : (item.date ? formatMonth(item.date) : '');
      if (month) {
        data.push({
          month: month,
          price: item.forecast_normal || 0,
          forecast_best: item.forecast_best,
          forecast_worst: item.forecast_worst,
        });
      }
    });

    return data;
  };

  const buildNewFormatChartData = () => {
    const data: any[] = [];
    const seenMonths = new Set<string>();

    // Get only the last month from historical data
    const lastHistoricalMonth = cropData?.data.historical && cropData.data.historical.length > 0
      ? cropData.data.historical[cropData.data.historical.length - 1]
      : null;

    const currentMonthData = cropData?.data.current;
    const currentMonth = currentMonthData ? formatMonth(currentMonthData.date) : "";
    const currentMonthDate = currentMonthData ? new Date(currentMonthData.date) : null;
    const allForecast = cropData?.data.forecast || [];
    
    const slicedForecast = processForecastData(
      allForecast,
      currentMonthDate,
      (item) => new Date(item.date),
      forecastRange
    );

    // Add historical (only last month) - only market_band and market_value
    if (lastHistoricalMonth) {
      const month = formatMonth(lastHistoricalMonth.date);
      if (!seenMonths.has(month)) {
        data.push({
          month: month,
          market_band_min: lastHistoricalMonth.market_band.min,
          market_band_max: lastHistoricalMonth.market_band.max,
          market_value: lastHistoricalMonth.market_value,
          market_value_solid: lastHistoricalMonth.market_value, // Solid line for historical
          market_value_dotted: null, // Not part of dotted line
          confidence_min: null, // No confidence for historical
          confidence_max: null, // No confidence for historical
          type: 'historical',
        });
        seenMonths.add(month);
      }
    }

    // Add current month
    if (currentMonthData && currentMonth) {
      if (!seenMonths.has(currentMonth)) {
        data.push({
          month: currentMonth,
          market_band_min: currentMonthData.market_band.min,
          market_band_max: currentMonthData.market_band.max,
          confidence_min: currentMonthData.confidence.min,
          confidence_max: currentMonthData.confidence.max,
          market_value: currentMonthData.market_value,
          market_value_solid: lastHistoricalMonth ? currentMonthData.market_value : null, // Connect from historical if exists
          market_value_dotted: currentMonthData.market_value, // Part of dotted line
          // Helper field for white mask below the minimum of market_band_min or confidence_min
          market_band_min_mask: Math.min(currentMonthData.market_band.min, currentMonthData.confidence.min),
          type: 'current',
        });
        seenMonths.add(currentMonth);
      }
    }

    // Add forecast - ensure all sliced forecast items are added
    slicedForecast.forEach((item) => {
      if (!item || !item.date) return; // Skip invalid items
      const month = formatMonth(item.date);
      if (month && !seenMonths.has(month)) {
        data.push({
          month: month,
          market_band_min: item.market_band?.min,
          market_band_max: item.market_band?.max,
          confidence_min: item.confidence?.min,
          confidence_max: item.confidence?.max,
          market_value: item.market_value,
          market_value_solid: null, // Not part of solid line
          market_value_dotted: item.market_value, // Part of dotted line
          // Helper field for white mask below the minimum of market_band_min or confidence_min
          market_band_min_mask: Math.min(item.market_band?.min ?? 0, item.confidence?.min ?? 0),
          type: 'forecast',
        });
        seenMonths.add(month);
      }
    });

    return data;
  };

  const chartData = buildChartData();
  
  // BaseLine for restoring light green market band between market_band_min and confidence_min
  const marketBandRestoreBaseLine = isMicrogreens || !isNewFormat ? [] : chartData.map((d: any) => {
    return d.confidence_min != null ? (d.market_band_min ?? 0) : 0;
  });

  const shouldBlur = shouldRestrict && !selectedCrop.startsWith("lettuce-");

  // Custom tooltip for new format (leafy greens)
  const customTooltipNew = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const point = payload[0]?.payload as any;
    if (!point) return null;

    return (
      <Box sx={{ bgcolor: "#fff", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 2, p: 1.5, minWidth: 180, zIndex: 20 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.8)", mb: 1 }}>{label}</Typography>
        {point.market_value != null && typeof point.market_value === 'number' && !isNaN(point.market_value) && (
          <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.7)", mb: 0.5 }}>
            Market Value: {currency} {point.market_value.toFixed(2)} /{weight}
          </Typography>
        )}
        {point.market_band_min != null && typeof point.market_band_min === 'number' && !isNaN(point.market_band_min) && 
         point.market_band_max != null && typeof point.market_band_max === 'number' && !isNaN(point.market_band_max) && (
          <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.7)", mb: 0.5 }}>
            Market Band: {currency} {point.market_band_min.toFixed(2)} - {point.market_band_max.toFixed(2)} /{weight}
          </Typography>
        )}
        {point.confidence_min != null && typeof point.confidence_min === 'number' && !isNaN(point.confidence_min) && 
         point.confidence_max != null && typeof point.confidence_max === 'number' && !isNaN(point.confidence_max) && (
          <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.7)" }}>
            Confidence: {currency} {point.confidence_min.toFixed(2)} - {point.confidence_max.toFixed(2)} /{weight}
          </Typography>
        )}
      </Box>
    );
  };

  // Custom tooltip for old format (microgreens)
  const customTooltipOld = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const point = payload[0]?.payload as any;
    if (!point) return null;

    return (
      <Box sx={{ bgcolor: "#fff", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 2, p: 1.5, minWidth: 180, zIndex: 20 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.8)", mb: 1 }}>{label}</Typography>
        {point.price != null && typeof point.price === 'number' && !isNaN(point.price) && (
          <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.7)", mb: 0.5 }}>
            Price: {currency} {point.price.toFixed(2)} /punnet
          </Typography>
        )}
        {point.forecast_best != null && typeof point.forecast_best === 'number' && !isNaN(point.forecast_best) && 
         point.forecast_worst != null && typeof point.forecast_worst === 'number' && !isNaN(point.forecast_worst) && (
          <>
            <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.7)", mb: 0.5 }}>
              Best Case: {currency} {point.forecast_best.toFixed(2)} /punnet
            </Typography>
            <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.7)" }}>
              Worst Case: {currency} {point.forecast_worst.toFixed(2)} /punnet
            </Typography>
          </>
        )}
      </Box>
    );
  };

  // Chart component
  const renderChart = () => {
    if (isMicrogreens || !isNewFormat) {
      // Old format chart for microgreens
      return renderOldFormatChart();
    } else {
      // New format chart for leafy greens
      return renderNewFormatChart();
    }
  };

  const renderOldFormatChart = () => {
    const allValues = chartData.flatMap((d) => [
      d.price,
      d.forecast_best,
      d.forecast_worst,
    ].filter(v => v !== undefined && v !== null));
    const maxValue = Math.max(...allValues, 0);
    const minValue = Math.min(...allValues, 0);

    return (
      <Box sx={{ width: "100%", height: 420, position: "relative" }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
            <XAxis
              dataKey="month"
              type="category"
              scale="point"
              interval={0}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(0,0,0,0.6)", fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
              tickMargin={8}
            />
            <YAxis
              tickFormatter={(val) => val.toLocaleString("en-IN")}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(0,0,0,0.6)", fontSize: 12 }}
              domain={[Math.max(0, minValue * 0.9), (dataMax: number) => Math.ceil(dataMax * 1.1)]}
              allowDataOverflow={false}
              label={{
                value: `Price (${currency}/punnet)`,
                angle: -90,
                position: "insideLeft",
                fill: "rgba(0,0,0,0.6)",
                fontSize: 12,
                offset: 15,
              }}
            />
            <Tooltip cursor={false} content={customTooltipOld} wrapperStyle={{ zIndex: 1000 }} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#008756"
              strokeWidth={2}
              dot={{ r: 4, fill: "#008756", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#008756", stroke: "none" }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderNewFormatChart = () => {
    // Calculate domain for Y-axis - show more of the max value
    const allValues = chartData.flatMap((d) => [
      d.market_band_min,
      d.market_band_max,
      d.confidence_min,
      d.confidence_max,
      d.market_value,
    ].filter(v => v !== undefined && v !== null && typeof v === 'number'));
    const maxValue = Math.max(...allValues, 0);
    const minValue = Math.min(...allValues, 0);
    
    // Adjust domain to show more of the max value (less padding at top, more focus on max)
    const yAxisMin = Math.max(0, minValue * 0.95); // Less padding at bottom
    const yAxisMax = maxValue * 1.05; // Less padding at top to show more of max
    
    // Get current month for reference line
    const currentMonthData = cropData?.data.current;
    const currentMonthForRef = currentMonthData ? formatMonth(currentMonthData.date) : null;
    
    return (
      <Box sx={{ width: "100%", height: 420, position: "relative" }}>
        {isNewFormat && currentMonthForRef && (
          <>
            <Typography
              sx={{
                position: "absolute",
                top: 20,
                left: "22%",
                transform: "translateX(-50%)",
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(0,0,0,0.5)",
                zIndex: 2,
              }}
            >
              Historical Market Band
            </Typography>
            <Typography
              sx={{
                position: "absolute",
                top: 20,
                right: "30%",
                transform: "translateX(50%)",
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(0,0,0,0.5)",
                zIndex: 2,
              }}
            >
              Projected Market Band
            </Typography>
          </>
        )}
        {isNewFormat && (
          <Box
            sx={{
              position: "absolute",
              bottom: 65,
              right: 20,
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              alignItems: "flex-start",
            }}
          >

            {/* Forecast Price (Dotted Line) */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 2,
                  background: "repeating-linear-gradient(to right, #008756 0px, #008756 5px, transparent 5px, transparent 10px)",
                }}
              />
              <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.7)" }}>
                Current & Forecast Price
              </Typography>
            </Box>

            {/* Historic Price (Solid Line) */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 2,
                  backgroundColor: "#008756",
                }}
              />
              <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.7)" }}>
                Historic Price
              </Typography>
            </Box>

            {/* Market Band */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 12,
                  backgroundColor: "#C8E6C9",
                  borderRadius: "2px",
                }}
              />
              <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.7)" }}>
                Market Band
              </Typography>
            </Box>

            {/* Confidence Band */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 12,
                  backgroundColor: "#4CAF50",
                  borderRadius: "2px",
                }}
              />
              <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.7)" }}>
                Confidence Band
              </Typography>
            </Box>

          </Box>
        )}
        <ResponsiveContainer>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />

            <XAxis
              dataKey="month"
              type="category"
              scale="point"
              interval={0}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(0,0,0,0.6)", fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
              tickMargin={8}
            />

            <YAxis
              tickFormatter={(val) => val.toLocaleString("en-IN")}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(0,0,0,0.6)", fontSize: 12 }}
              domain={[yAxisMin, yAxisMax]}
              allowDataOverflow={false}
              label={{
                value: `Price (${currency}/${weight})`,
                angle: -90,
                position: "insideLeft",
                fill: "rgba(0,0,0,0.6)",
                fontSize: 12,
                offset: 15,
              }}
            />

            <Tooltip cursor={false} content={customTooltipNew} wrapperStyle={{ zIndex: 1000 }} />

            {/* Market band area (light green) - outer band for all data points */}
            {/* Step 1: Fill from 0 to market_band_max with light green */}
            <Area
              type="monotone"
              dataKey="market_band_max"
              baseLine={0}
              stroke="none"
              fill="#C8E6C9"
              fillOpacity={0.3}
              connectNulls
            />
            {/* Step 2: Fill from 0 to market_band_min with white to mask below min */}
            {/* This creates the light green band from market_band_min to market_band_max */}
            <Area
              type="monotone"
              dataKey="market_band_min"
              baseLine={0}
              stroke="none"
              fill="#fff"
              fillOpacity={1}
              connectNulls
            />

            {/* Confidence area (dark green) - inner band for current and forecast only */}
            {/* Step 1: Fill from 0 to confidence_max with dark green */}
            <Area
              type="monotone"
              dataKey="confidence_max"
              baseLine={0}
              stroke="none"
              fill="#4CAF50"
              fillOpacity={0.5}
              connectNulls
            />
            {/* Step 2: Fill from 0 to confidence_min with white to mask below confidence min */}
            {/* This creates the dark green band from confidence_min to confidence_max */}
            <Area
              type="monotone"
              dataKey="confidence_min"
              baseLine={0}
              stroke="none"
              fill="#fff"
              fillOpacity={1}
              connectNulls
            />
            {/* Step 3: Restore light green market band between market_band_min and confidence_min */}
            {/* Render light green from market_band_min to confidence_min to show market band in that region */}
            <Area
              type="monotone"
              dataKey="confidence_min"
              baseLine={marketBandRestoreBaseLine}
              stroke="none"
              fill="#C8E6C9"
              fillOpacity={0.3}
              connectNulls
            />
            {/* Step 4: Cover area below market_band_min with white for current and forecast only */}
            {/* This masks the area from 0 to market_band_min with white color */}
            <Area
              type="monotone"
              dataKey="market_band_min_mask"
              baseLine={0}
              stroke="none"
              fill="#fff"
              fillOpacity={1}
              connectNulls
            />

            {/* Market value line - solid for historical, connects to current */}
            <Line
              type="monotone"
              dataKey="market_value_solid"
              stroke="#008756"
              strokeWidth={2}
              strokeDasharray="0"
              dot={{ r: 4, fill: "#008756", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#008756", stroke: "none" }}
              connectNulls
            />
            {/* Market value line - dotted for current and forecast */}
            <Line
              type="monotone"
              dataKey="market_value_dotted"
              stroke="#008756"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: "#008756", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#008756", stroke: "none" }}
              connectNulls
            />

            {/* Reference line for current month */}
            {currentMonthForRef && (
              <ReferenceLine
                x={currentMonthForRef}
                stroke="rgba(0,0,0,0.3)"
                strokeDasharray="4 4"
                label={{ value: "Current", position: "top", fontSize: 10 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 2,
        py: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        height: "34.2rem",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", px: 2, mb: 4 }}>
        <Box>
          <Typography fontWeight={600} fontSize="1rem">{title}</Typography>
          <Typography fontSize="0.75rem" color="rgba(0,18,25,0.6)">
            {description}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
        <Select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          size="small"
          sx={{ width: 110, fontSize: 14 }}
          renderValue={(value) => {
            const selected = cropOptions.find(opt => opt.id === value);
            return selected ? selected.cropName : value;
          }}
        >
          {cropOptions.map((crop) => (
            <MenuItem key={crop.id} value={crop.id}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  {crop.cropName}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "rgba(0, 18, 25, 0.6)", mt: 0.25 }}>
                  {formatUnderscoreString(crop.variety)}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
        <Select
          value={forecastRange}
          onChange={(e) => setForecastRange(Number(e.target.value) as 1 | 2 | 3)}
          size="small"
          sx={{ width: 110, fontSize: 14}}
        >
          <MenuItem value={3}>3 Months</MenuItem>
          <MenuItem value={2}>2 Months</MenuItem>
          <MenuItem value={1}>1 Month</MenuItem>
        </Select>
        </Box>
      </Box>

      <Box>
        {shouldBlur ? (
          <ProtectedBlurWrapper>
            {renderChart()}
          </ProtectedBlurWrapper>
        ) : (
          renderChart()
        )}
      </Box>

    </Box>
  );
};

export default MarketPriceTrend;
