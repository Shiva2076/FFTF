"use client";
import { FC, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Image from 'next/image';

interface Props {
  cropName: string;
  cropVariety: string;
}

export const RevenueGrowthProjection: FC<Props> = ({ cropName, cropVariety }) => {
  const { title, description, duration } = useSelector((state: RootState) => state.cropGrowingGuide.data?.cropRevenueProjection || { title: "", description: "" });
  const revenueData = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropRevenueProjection.data
  );
  const { currency, weight } = useSelector((state: RootState) => state.locationMeta);
  
  const selectedData = useMemo(() => {
    return revenueData
      ?.filter(
        (entry: any) =>
          entry.crop?.toLowerCase().trim() === cropName.toLowerCase().trim() &&
          entry.variety?.toLowerCase().trim() === cropVariety.toLowerCase().trim()
      )
      .sort((a: any, b: any) => a.year - b.year); // ensure years are sorted
  }, [cropName, cropVariety, revenueData]);
  
  const now = new Date();
  const year = now.getFullYear();
  const currentYear = year;
  const chartData = selectedData?.map((entry: any) => ({
    year: entry.year,
    price: entry.price_per_kg,
  }));

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "4px 4px 0 0",
          p: "1.5rem",
          backgroundColor: "#fff",
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Typography sx={{ fontSize: "0.75rem", color: "rgba(0, 18, 25, 0.6)" }}>
            {description}
          </Typography>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "rgba(0, 18, 25, 0.6)", fontSize: "0.75rem" }}>
            <Box component="span" sx={{ mx: 0.5 }}>•</Box>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Image src="/apps/Vector.svg" alt="calendar" width={12} height={12} />
              <Typography variant="body2" sx={{ color: "rgba(0, 18, 25, 0.6)" }}>{duration}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Chart */}
      <Box
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderTop: "none",
          borderRadius: "0 0 4px 4px",
          overflow: "hidden",
          height: 380,
          p: "0.9rem",
          backgroundColor: "#fff",
        }}
      >
        {chartData?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2e7d32" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2e7d32" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v) => `${currency} ${v}`}
                tick={{ fontSize: 12 }}
                domain={['auto', 'auto']}
                label={{
                  value: `Price (${currency} / ${weight})`,
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                  dx: -10,
                  style: { fontSize: 12, fill: "#666" },
                }}
              />
              <Tooltip
                cursor={false}
                formatter={(value: number, name: string) => [`${currency} ${value.toLocaleString()} / ${weight}`, name]}
                contentStyle={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                }}
                itemStyle={{
                  fontSize: '10px',
                  marginBottom: '2px',
                }}
                labelStyle={{
                  fontSize: '10px',
                  marginBottom: '2px',
                }}
              />
              <ReferenceLine
                x={currentYear}
                stroke="#000"
                strokeDasharray="3 3"
                label={{
                  position: "top",
                  value: "Current Year",
                  fontSize: 10,
                  fill: "#333",
                  dy: 7,
                  offset: 10,
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#2e7d32"
                fill="url(#colorPrice)"
                strokeWidth={2}
                dot={{ r: 4, stroke: "#2e7d32", fill: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: 280,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "0.875rem",
            }}
          >
            No data available for this crop.
          </Box>
        )}
      </Box>
    </Box>
  );
};