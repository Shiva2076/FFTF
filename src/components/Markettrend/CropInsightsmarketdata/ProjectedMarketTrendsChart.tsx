"use client";
import { FC, useMemo, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";

interface Props {
  cropName: string;
  cropVariety: string;
}

export const ProjectedMarketTrendsChart: FC<Props> = ({ cropName, cropVariety }) => {
  const { title, description, duration } =
    useSelector(
      (state: RootState) =>
        state.cropGrowingGuide.data?.cropProjectPriceTrends || {
          title: "",
          description: "",
        }
    );

  const cropProjectPriceTrends = useSelector(
    (state: RootState) =>
      state.cropGrowingGuide.data?.cropProjectPriceTrends.data
  );

  const { currency, weight } = useSelector(
    (state: RootState) => state.locationMeta
  );

  const selectedCropData = useMemo(() => {
    return cropProjectPriceTrends?.find(
      (entry: any) =>
        (entry.crop_name?.toLowerCase().trim() === cropName?.toLowerCase().trim() || 
         entry.crop?.toLowerCase().trim() === cropName?.toLowerCase().trim()) &&
        entry.variety?.toLowerCase().trim() === cropVariety?.toLowerCase().trim()
    );
  }, [cropName, cropVariety, cropProjectPriceTrends]);

  const chartData = useMemo(() => {
    if (!selectedCropData) return [];

    return Object.entries(selectedCropData)
      .filter(([key]) => key !== "crop" && key !== "variety" && key !== "crop_name")
      .map(([timeKey, priceValue]) => {
        // Handle new format: priceValue is { market_band_low, market_band_high } object
        let minPrice: number;
        let maxPrice: number;
        
        if (typeof priceValue === 'object' && priceValue !== null) {
          // New format with market_band_low and market_band_high
          const priceObj = priceValue as { market_band_low?: number; market_band_high?: number };
          minPrice = Number(priceObj.market_band_low) || 0;
          maxPrice = Number(priceObj.market_band_high) || 0;
        } else {
          // Fallback for old format
          const singlePrice = Number(priceValue);
          minPrice = singlePrice;
          maxPrice = singlePrice;
        }

        // Parse "2026-01" format (YYYY-MM) or "January 2026" format
        let monthName = "";
        let year = "";
        let orderKey = 0;

        // Try YYYY-MM format first (e.g., "2026-01")
        const yearMonthMatch = timeKey.match(/^(\d{4})-(\d{2})$/);
        if (yearMonthMatch) {
          const [, yearStr, monthStr] = yearMonthMatch;
          year = yearStr;
          const monthIndex = parseInt(monthStr, 10) - 1;
          const monthNames = ["January", "February", "March", "April", "May", "June", 
                             "July", "August", "September", "October", "November", "December"];
          monthName = monthNames[monthIndex] || "";
          const date = new Date(parseInt(yearStr), monthIndex, 1);
          if (!isNaN(date.getTime())) {
            orderKey = date.getTime();
          }
        } else {
          // Try "January 2026" format
          const monthYearMatch = timeKey.match(/^(\w+)\s+(\d{4})$/i);
          if (monthYearMatch) {
            const [, month, yearStr] = monthYearMatch;
            monthName = month;
            year = yearStr;
            const date = new Date(`${month} 1, ${yearStr}`);
            if (!isNaN(date.getTime())) {
              orderKey = date.getTime();
            }
          }
        }

        // Calculate range (difference between max and min) for area filling
        const range = maxPrice - minPrice;

        return {
          monthName: monthName ? monthName.slice(0, 3) : "", // "Jan", "Feb", "Mar"
          fullMonthName: monthName, // "January", "February", "March"
          year: year || "", // "2026"
          min: minPrice,
          max: maxPrice,
          range: range, // For stacked area between min and max
          orderKey,
          rawKey: timeKey,
        };
      })
      .filter(item => item.orderKey > 0 && !isNaN(item.min) && !isNaN(item.max))
      .sort((a, b) => a.orderKey - b.orderKey);
  }, [selectedCropData]);

  // Calculate Y-axis domain: slightly greater than max of all max values
  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100];
    
    const maxValue = Math.max(...chartData.map(d => d.max));
    // Add 10% padding to the top
    const maxDomain = maxValue * 1.1;
    
    return [0, maxDomain];
  }, [chartData]);

  // Custom X-axis tick to show month names and year
  const CustomXAxisTick = (props: any) => {
    const { x, y, index } = props;

    // Safety check for index
    if (index === undefined || !chartData[index]) {
      return null;
    }

    const data = chartData[index];
    const displayText = data.year ? `${data.monthName} ${data.year}` : data.monthName;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#666"
          fontSize={12}
          fontWeight={500}
        >
          {displayText}
        </text>
      </g>
    );
  };

  return (
    <Box
      sx={{
        height: 500,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: "4px",
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "none",
      }}
    >
      {/* Header */}
      <Box sx={{ p: "1.5rem" }}>
        <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
            {description}
          </Typography>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: "text.secondary",
              fontSize: "0.75rem",
            }}
          >
            <Box component="span" sx={{ mx: 0.5 }}>
              •
            </Box>
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Image
                src="/apps/Vector.svg"
                alt="calendar"
                width={12}
                height={12}
              />
              <Typography variant="body2" color="text.secondary">
                {duration}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          height: "1px",
          backgroundColor: "rgba(0, 0, 0, 0.12)",
          width: "100%",
          marginTop: "-8px",
          marginBottom: "8px",
        }}
      />

      {/* Chart */}
      <Box sx={{ px: "1.5rem", pb: "1.5rem", flex: 1, minHeight: 0 }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ 
                top: 10, 
                right: 40, 
                left: 20, 
                bottom: 30 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => {
                  if (value === 'max') return 'Max Price';
                  if (value === 'min') return 'Min Price';
                  return null; // Hide range from legend
                }}
              />
              <XAxis 
                dataKey="monthName" 
                tick={<CustomXAxisTick />} 
                interval={0}
                height={50}
              />
              <YAxis
                domain={yAxisDomain}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${currency} ${value.toFixed(2)}`}
                width={60}
                label={{
                  value: `Price (${currency} / ${weight})`,
                  angle: -90,
                  position: "insideLeft",
                  offset: -5,
                  dx: -10,
                  style: { fontSize: 12, fill: "#666" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  fontSize: "12px",
                }}
                content={({ active, payload, label }: any) => {
                  if (!active || !payload || payload.length === 0) return null;
                  
                  // Filter out range items (empty name or dataKey === 'range')
                  const filteredPayload = payload.filter((item: any) => 
                    item.dataKey !== 'range' && item.name !== 'range' && item.name !== ''
                  );
                  
                  if (filteredPayload.length === 0) return null;
                  
                  // Sort so max comes first, then min
                  const sortedPayload = filteredPayload.sort((a: any, b: any) => {
                    if (a.name === 'max') return -1;
                    if (b.name === 'max') return 1;
                    return 0;
                  });
                  
                  const item = sortedPayload[0].payload;
                  const monthName = item ? item.fullMonthName : label;
                  
                  return (
                    <Box
                      sx={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "6px 10px",
                      }}
                    >
                      <Typography sx={{ fontWeight: 500, marginBottom: "2px", fontSize: "14px" }}>
                        {monthName}
                      </Typography>
                      {sortedPayload.map((entry: any, index: number) => {
                        const label = entry.name === 'max' ? 'Max Price' : 'Min Price';
                        return (
                          <Typography key={index} sx={{ color: entry.color, fontSize: "14px" }}>
                            {label}: {currency} {Number(entry.value).toFixed(2)} / {weight}
                          </Typography>
                        );
                      })}
                    </Box>
                  );
                }}
              />
              {/* Min line - blue, with area fill from 0 to min */}
              <Area
                type="monotone"
                dataKey="min"
                stroke="#42a5f5"
                fill="url(#colorMin)"
                strokeWidth={2}
                dot={{ r: 4, stroke: "#42a5f5", strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 6 }}
                name="min"
                stackId="stack"
              />
              {/* Range area - fills between min and max with red color */}
              <Area
                type="monotone"
                dataKey="range"
                stroke="none"
                fill="url(#colorMax)"
                strokeWidth={0}
                name=""
                stackId="stack"
                isAnimationActive={false}
              />
              {/* Max line - red, appears on top */}
              <Area
                type="monotone"
                dataKey="max"
                stroke="#ef5350"
                fill="transparent"
                strokeWidth={2}
                dot={{ r: 4, stroke: "#ef5350", strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 6 }}
                name="max"
              />
              <defs>
                {/* Min gradient - blue, fills from 0 to min */}
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#42a5f5" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#42a5f5" stopOpacity={0.2} />
                </linearGradient>
                {/* Max gradient - red, fills the area between min and max */}
                <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef5350" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#ef5350" stopOpacity={0.2} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography sx={{ fontSize: 14 }}>
              No data available for this crop.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};