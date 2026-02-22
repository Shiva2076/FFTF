"use client";
import { FC, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Image from "next/image";

interface Props {
  cropName: string;
  cropVariety: string;
}

const COLORS = ["#a5d6a7", "#80cbc4", "#4db6ac", "#26a69a", "#00897b", "#00796b"];

export const PriceTrendsChart: FC<Props> = ({ cropName, cropVariety }) => {
  const cropMonthlyPriceTrend = useSelector(
    (state: RootState) =>
      state.cropGrowingGuide.data?.cropMonthlyPriceTrend
  );

  const { title, description, duration } = useSelector(
    (state: RootState) =>
      state.cropGrowingGuide.data?.cropMonthlyPriceTrend || {
        title: "",
        description: "",
      }
  );

  const priceTrendData = useSelector(
    (state: RootState) =>
      state.cropGrowingGuide.data?.cropMonthlyPriceTrend.data
  );
  const { currency, weight } = useSelector(
    (state: RootState) => state.locationMeta
  );

  // Get crop type to determine if it's Leafy-Greens
  const cropType = cropMonthlyPriceTrend?.cropType || "";
  const isLeafyGreens = cropType?.toLowerCase() === "leafy-greens";

  // Find the object that matches the selected crop
  const selectedCropData = useMemo(() => {
    return priceTrendData?.find(
      (entry: any) =>
        entry.crop_name?.toLowerCase().trim() === cropName.toLowerCase().trim() &&
        entry.variety?.toLowerCase().trim() === cropVariety.toLowerCase().trim()
    );
  }, [cropName, cropVariety, priceTrendData]);

  // Transform into chart data
  const chartData = useMemo(() => {
    if (!selectedCropData) return [];

    // Handle Leafy-Greens format: April 2025 to January 2026 with market_band_low and market_band_high
    if (isLeafyGreens) {
      const months = [
        { key: "2025-04", monthName: "Apr", year: "2025" },
        { key: "2025-05", monthName: "May", year: "2025" },
        { key: "2025-06", monthName: "Jun", year: "2025" },
        { key: "2025-07", monthName: "Jul", year: "2025" },
        { key: "2025-08", monthName: "Aug", year: "2025" },
        { key: "2025-09", monthName: "Sep", year: "2025" },
        { key: "2025-10", monthName: "Oct", year: "2025" },
        { key: "2025-11", monthName: "Nov", year: "2025" },
        { key: "2025-12", monthName: "Dec", year: "2025" },
        { key: "2026-01", monthName: "Jan", year: "2026" },
      ];

      return months.map(({ key, monthName, year }) => {
        const monthData = selectedCropData[key];
        let marketBandLow = 0;
        let marketBandHigh = 0;
        let hasData = false;

        if (monthData && typeof monthData === 'object' && monthData !== null) {
          marketBandLow = Number(monthData.market_band_low) || 0;
          marketBandHigh = Number(monthData.market_band_high) || 0;
          hasData = marketBandLow > 0 || marketBandHigh > 0;
        }

        return {
          month: monthName,
          year: year,
          min: marketBandLow,
          max: marketBandHigh,
          displayLabel: monthName,
          orderKey: new Date(key + "-01").getTime(),
          hasData,
        };
      });
    }

    // Original logic for Microgreens and other crop types
    // Find December data (2025-12 format)
    const decData = Object.entries(selectedCropData).find(([key]) => 
      /^2025-12$/.test(key) || /^2026-12$/.test(key)
    );

    let decMin = 0;
    let decMax = 0;
    let decYear = "2025";

    if (decData) {
      const [timeKey, priceValue] = decData;
      // Extract year from timeKey
      const yearMatch = timeKey.match(/^(\d{4})-\d{2}$/);
      if (yearMatch) {
        decYear = yearMatch[1];
      }

      // Handle new format: { min, max } object
      if (typeof priceValue === 'object' && priceValue !== null && 'min' in priceValue && 'max' in priceValue) {
        decMin = Number(priceValue.min);
        decMax = Number(priceValue.max);
      } else {
        // Fallback for old format
        const singlePrice = Number(priceValue);
        decMin = singlePrice;
        decMax = singlePrice;
      }
    }

    // Create chart data with Dec (min/max), Jan, Feb
    return [
      {
        month: "Dec",
        year: decYear,
        min: decMin,
        max: decMax,
        displayLabel: `Dec ${decYear}`,
        orderKey: new Date(`${decYear}-12-01`).getTime(),
        hasData: true,
      },
      {
        month: "Jan",
        year: decYear === "2025" ? "2026" : "2027",
        min: 0,
        max: 0,
        displayLabel: `Jan ${decYear === "2025" ? "2026" : "2027"}`,
        orderKey: new Date(`${decYear === "2025" ? "2026" : "2027"}-01-01`).getTime(),
        hasData: false,
      },
      {
        month: "Feb",
        year: decYear === "2025" ? "2026" : "2027",
        min: 0,
        max: 0,
        displayLabel: `Feb ${decYear === "2025" ? "2026" : "2027"}`,
        orderKey: new Date(`${decYear === "2025" ? "2026" : "2027"}-02-01`).getTime(),
        hasData: false,
      },
    ];
  }, [selectedCropData, isLeafyGreens]);

  // Custom tick component for month labels with "Will be updated soon" text
  const CustomXAxisTick = (props: any) => {
    const { x, y, index } = props;
    
    if (index === undefined || !chartData[index]) {
      return null;
    }

    const data = chartData[index];

    // For Leafy-Greens, show year label below the center month of each year
    let showYearLabel = false;
    let yearLabel = "";
    if (isLeafyGreens) {
      // Show 2025 below the center of months 0-8 (around index 4, which is Aug)
      if (index === 4 && data.year === "2025") {
        showYearLabel = true;
        yearLabel = "2025";
      }
      // Show 2026 below Jan (index 9)
      if (index === 9 && data.year === "2026") {
        showYearLabel = true;
        yearLabel = "2026";
      }
    }

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
          {data.displayLabel}
        </text>
        {showYearLabel && (
          <text
            x={0}
            y={0}
            dy={35}
            textAnchor="middle"
            fill="#666"
            fontSize={11}
            fontWeight={500}
          >
            {yearLabel}
          </text>
        )}
        {!data.hasData && (
          <text
            x={0}
            y={0}
            dy={-80}
            textAnchor="middle"
            fill="#999"
            fontSize={11}
            fontWeight={500}
          >
            Will be updated soon
          </text>
        )}
      </g>
    );
  };


  // Custom label component to show "Will be updated soon" for Jan/Feb
  const CustomBarLabel = (props: any) => {
    const { x, y, width, payload, value } = props;
    
    // Only show label if there's no data (value is 0 and hasData is false)
    if (payload && !payload.hasData && value === 0) {
      return (
        <text
          x={x + width / 2}
          y={y - 10}
          textAnchor="middle"
          fill="#999"
          fontSize={11}
          fontWeight={500}
        >
          Will be updated soon
        </text>
      );
    }
    return null;
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
              sx={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
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
      <Box sx={{ flex: 1, px: "1.5rem", pb: "2rem" }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ 
                top: 10, 
                right: 20, 
                left: 20, 
                bottom: isLeafyGreens ? 35 : 25 
              }}
              barGap={0}
            >
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => {
                  if (isLeafyGreens) {
                    if (value === 'max') return 'Market Band High';
                    if (value === 'min') return 'Market Band Low';
                  } else {
                    if (value === 'max') return 'Max Price';
                    if (value === 'min') return 'Min Price';
                  }
                  return value;
                }}
              />
              <XAxis
                dataKey="displayLabel"
                tick={<CustomXAxisTick />}
                interval={0}
                height={isLeafyGreens ? 55 : 40}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(val) => `${currency} ${val.toFixed(2)}`}
                width={70}
                label={{
                  value: `Price (${currency} / ${weight})`,
                  angle: -90,
                  position: "left",
                  offset: 10,
                  dy: -10,
                  style: { fontSize: 12, fill: "#666" },
                }}
                padding={{ top: 15 }}
              />
              <Tooltip
                cursor={false}
                formatter={(val: number, name: string, props: any) => {
                  if (!props.payload.hasData) return null;
                  const label = isLeafyGreens
                    ? (name === 'max' ? 'Market Band High' : 'Market Band Low')
                    : (name === 'max' ? 'Max Price' : 'Min Price');
                  return [
                    `${currency} ${val.toFixed(2)} / ${weight}`,
                    label,
                  ];
                }}
                labelFormatter={(label) => label}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  fontSize: "12px",
                }}
              />
              {/* Min bar - blue */}
              <Bar 
                dataKey="min" 
                barSize={isLeafyGreens ? 18 : 30} 
                radius={[4, 4, 0, 0]}
                fill="#42a5f5"
                name="min"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-min-${index}`} 
                    fill={entry.hasData ? "#42a5f5" : "transparent"}
                  />
                ))}
              </Bar>
              {/* Max bar - red */}
              <Bar 
                dataKey="max" 
                barSize={isLeafyGreens ? 18 : 30} 
                radius={[4, 4, 0, 0]}
                fill="#ef5350"
                name="max"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-max-${index}`} 
                    fill={entry.hasData ? "#ef5350" : "transparent"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography sx={{ fontSize: 14, textAlign: "center", mt: 4 }}>
            ❌ No price trend data available for this crop.
          </Typography>
        )}
      </Box>
    </Box>
  );
};