"use client";
import { FC, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import CustomTooltip from "../Custom/CustomTooltip";

interface CostBreakdownProps {
  cropName: string;
  cropVariety: string;
}

const COLORS = ["#008756", "#c8d04f", "#eea92b", "#ff5e00"];

export const CostBreakdown: FC<CostBreakdownProps> = ({ cropName, cropVariety }) => {
  const isMicrogreens = cropName?.toLowerCase().trim() === "microgreens";

  const { title, description } = useSelector((state: RootState) =>
    isMicrogreens
      ? state.cropGrowingGuide.data?.cropDiseaseprobabilities || { title: "", description: "" }
      : state.cropGrowingGuide.data?.cropCostBreakdown || { title: "", description: "" }
  );

  const dataList = useSelector((state: RootState) =>
    isMicrogreens
      ? state.cropGrowingGuide.data?.cropDiseaseprobabilities?.data
      : state.cropGrowingGuide.data?.cropCostBreakdown?.data
  );

  const selectedCropData = useMemo(() => {
    return dataList?.find((entry: any) => {
      return (
        entry.crop?.toLowerCase().trim() === cropName?.toLowerCase().trim() &&
        entry.variety?.toLowerCase().trim() === cropVariety?.toLowerCase().trim()
      );
    });
  }, [cropName, cropVariety, dataList]);

  if (!selectedCropData || !dataList) {
    return (
      <Box
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "4px",
          backgroundColor: "#fff",
          p: 2,
          textAlign: "center",
          fontSize: "0.875rem",
          color: "rgba(0,0,0,0.6)",
        }}
      >
        No {isMicrogreens ? "nutrient distribution" : "cost breakdown"} data available for this crop.
      </Box>
    );
  }

  // ✅ Pick fields dynamically
  const data = isMicrogreens
    ? [
        { name: "Protein", value: selectedCropData?.proteinPercent ?? 0, color: COLORS[0] },
        { name: "Vitamins", value: selectedCropData?.vitaminsPercent ?? 0, color: COLORS[1] },
        { name: "Minerals", value: selectedCropData?.mineralsPercent ?? 0, color: COLORS[2] },
        { name: "Other Nutrients", value: selectedCropData?.otherNutrientsPercent ?? 0, color: COLORS[3] },
      ]
    : [
        { name: "Labor", value: selectedCropData?.laborPercent ?? 0, color: COLORS[0] },
        { name: "Materials", value: selectedCropData?.materialsPercent ?? 0, color: COLORS[1] },
        { name: "Utilities", value: selectedCropData?.utilitiesPercent ?? 0, color: COLORS[2] },
        { name: "Other Cost", value: selectedCropData?.otherCostPercent ?? 0, color: COLORS[3] },
      ];

  return (
    <Box
      sx={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: "4px",
        overflow: "hidden",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "390px",
      }}
    >
      <Box sx={{ padding: "1.5rem", paddingBottom: "1rem" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Typography sx={{ fontWeight: 600, letterSpacing: "0.15px", lineHeight: "200%" }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "rgba(0, 18, 25, 0.6)", letterSpacing: "0.4px" }}>
            {description}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: "1px", backgroundColor: "rgba(0, 0, 0, 0.12)" }} />

      <Box
        sx={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "row",
          gap: "1.5rem",
        }}
      >
        {/* Pie Chart */}
        <Box sx={{ width: "200px", height: "200px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={0}
                stroke="none"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Labels */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {data.map((item, index) => (
            <Box
              key={index}
              sx={{
                height: "3rem",
                display: "flex",
                alignItems: "center",
                borderBottom: index !== data.length - 1
                  ? "1px solid rgba(0, 0, 0, 0.12)"
                  : "none",
                gap: "0.5rem",
              }}
            >
              <Box
                sx={{
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "3px",
                  backgroundColor: item.color,
                }}
              />
              <Box sx={{ flex: 1, fontSize: "0.75rem" }}>{item.name}</Box>
              <Box
                sx={{
                  borderRadius: "100px",
                  backgroundColor: "rgba(0, 0, 0, 0.08)",
                  px: "0.5rem",
                  py: "0.25rem",
                  minHeight: "1.5rem",
                  fontSize: "0.75rem",
                }}
              >
                {item.value}%
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
