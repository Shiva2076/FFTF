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
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

interface Props {
  cropName: string;
  cropVariety: string;
}

const COLORS = ["#80cbc4", "#4db6ac", "#00897b", "#26a69a", "#b2dfdb", "#a5d6a7"];

export const CostBreakdownChart: FC<Props> = ({ cropName, cropVariety }) => {
  const { title, description } = useSelector(
    (state: RootState) =>
      state.cropGrowingGuide.data?.cropSpecificCostBreakdown || {
        title: "",
        description: "",
      }
  );

  const cropSpecificCostBreakdown = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropSpecificCostBreakdown.data
  );

  const { currency } = useSelector((state: RootState) => state.locationMeta);

  const selectedCropData = useMemo(() => {
    return cropSpecificCostBreakdown?.find((entry: any) => {
      return (
        entry.crop?.toLowerCase().trim() === cropName?.toLowerCase().trim() &&
        entry.variety?.toLowerCase().trim() === cropVariety?.toLowerCase().trim()
      );
    });
  }, [cropName, cropVariety, cropSpecificCostBreakdown]);

  const chartData = useMemo(() => {
    if (!selectedCropData) return [];

    const toNumber = (val: any) => {
      if (val === undefined || val === null) return 0;
      if (typeof val === "string") {
        return Number(val.replace(/,/g, "")) || 0;
      }
      return Number(val) || 0;
    };
    
    // Check if it's microgreens or leafy greens by field presence
    const isMicrogreens = "Seeds_annual" in selectedCropData || "Media_annual" in selectedCropData;

    if (isMicrogreens) {
      return [
        { name: "Initial Setup", value: toNumber(selectedCropData.Initial_setup) || 0 },
        { name: "Labour (annual)", value: Number(selectedCropData.Labour_annual) || 0 },
        { name: "Media (annual)", value: Number(selectedCropData.Media_annual) || 0 },
        { name: "Seeds (annual)", value: Number(selectedCropData.Seeds_annual) || 0 },
        { name: "Utilities (annual)", value: Number(selectedCropData.Utilities_annual) || 0 },
      ];
    } else {
      return [
        { name: "Initial Setup", value: Number(selectedCropData.initial_setup) || 0 },
        { name: "Labor (annual)", value: Number(selectedCropData.labor_annual) || 0 },
        { name: "Fertilizers (annual)", value: Number(selectedCropData.fertilizers_annual) || 0 },
        { name: "Utilities (annual)", value: Number(selectedCropData.utilities_annual) || 0 },
        { name: "Misc. (annual)", value: Number(selectedCropData.misc_annual) || 0 },
        { name: "Logistics (annual)", value: Number(selectedCropData.logistics_annual) || 0 },
      ];
    }
  }, [selectedCropData]);

  return (
    <Box
      sx={{
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
        </Box>
      </Box>

      {/* Divider */}
      <Box 
        sx={{ 
          height: "1px", 
          backgroundColor: "rgba(0, 0, 0, 0.12)", 
          width: "100%", 
          marginTop: "-8px", 
          marginBottom: "8px" 
        }} 
      />

      {/* Chart */}
      <Box sx={{ flex: 1, p: "1.5rem", display: "flex" }}>
        {chartData.length > 0 ? (
          <Box sx={{ width: "100%", height: 290 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 0, right: 30, left: -10, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  tickFormatter={(val) =>
                    `${currency} ${Math.round(val).toLocaleString()}`
                  }
                  fontSize={12}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={160}
                  fontSize={12}
                  tickMargin={6}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${currency} ${Math.round(value).toLocaleString()}`,
                    name,
                  ]}
                  contentStyle={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                  }}
                />
                <Bar dataKey="value" barSize={20} radius={[4, 4, 4, 4]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 224,
              width: '100%',
            }}
          >
            <Typography sx={{ fontSize: 14 }}>
              No cost breakdown available for this crop variety.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};