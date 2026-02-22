"use client";
import { FC, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Image from 'next/image';

interface Props {
  cropName: string;
  cropVariety: string;
}

const COLORS = ["#008756", "#cddc39", "#ffa726", "#ff5722"];

export const YieldDistribution: FC<Props> = ({ cropName, cropVariety }) => {
  const {title,description, duration} = useSelector((state:RootState)=>state.cropGrowingGuide.data?.cropYieldDistribution || {title:"",description:""});
  const yieldData = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropYieldDistribution.data
  );

  const selectedCrop = useMemo(() => {
    return yieldData?.find((entry: any) =>
      entry.crop?.toLowerCase().trim() === cropName.toLowerCase().trim() &&
      entry.variety?.toLowerCase().trim() === cropVariety.toLowerCase().trim()
    );
  }, [cropName, cropVariety, yieldData]);

  const chartData = useMemo(() => {
    if (!selectedCrop) return [];

    return [
      {
        name: "Healthy Yield",
        value: selectedCrop.healthy_yield_percent ?? 0,
      },
      {
        name: "Loss from Sorting and Grading",
        value: selectedCrop.loss_from_sorting_and_grading_percent ?? 0,
      },
      {
        name: "Loss from Environmental Factors",
        value: selectedCrop.loss_from_environmental_factors_percent ?? 0,
      },
      {
        name: "Unharvested Waste",
        value: selectedCrop.unharvested_waste_percent ?? 0,
      },
    ];
  }, [selectedCrop]);

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

      {/* Chart + Legend */}
      <Box
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "0 0 4px 4px",
          borderTop: "none",
          p: "0.9rem",
          display: "flex",
          gap: "1.5rem",
          backgroundColor: "#fff",
          height: 380,
          overflow: "hidden",
        }}
      >
        {/* Donut Chart */}
        {chartData.length > 0 ? (
          <>
            <Box sx={{ width: 240, height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={0}
                    stroke="none"
                    strokeWidth={0}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number, name: string) => [`${val}%`, name]}
                    contentStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Legend */}
            <Box sx={{ flex: 1 }}>
              {chartData.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    height: "5rem",
                  }}
                >
                  <Box
                    sx={{
                      width: "1rem",
                      height: "1rem",
                      backgroundColor: COLORS[index % COLORS.length],
                      mr: "0.5rem",
                    }}
                  />
                  <Typography sx={{ flex: 1, fontSize: "0.75rem" }}>{item.name}</Typography>
                  <Box
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                      borderRadius: "100px",
                      px: "0.5rem",
                      fontSize: "0.75rem"
                    }}
                  >
                    {item.value}%
                  </Box>
                </Box>
              ))}
            </Box>
          </>
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