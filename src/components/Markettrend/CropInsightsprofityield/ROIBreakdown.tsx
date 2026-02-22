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
  ReferenceLine,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Image from "next/image";

interface Props {
  cropName: string;
  cropVariety: string;
}

const COLORS = ["#a5d6a7", "#26a69a", "#81c784", "#66bb6a", "#4caf50"];

export const ROIBreakdown: FC<Props> = ({ cropName, cropVariety }) => {
  const { title, description, duration } = useSelector(
    (state: RootState) =>
      state.cropGrowingGuide.data?.cropRoiBreakdown || {
        title: "",
        description: "",
      }
  );

  const roiData = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropRoiBreakdown.data
  );

  const selectedCrop = useMemo(() => {
    return roiData?.find((entry: any) => {
      return (
        entry.crop?.toLowerCase().trim() ===
          cropName.toLowerCase().trim() &&
        entry.variety?.toLowerCase().trim() ===
          cropVariety.toLowerCase().trim()
      );
    });
  }, [roiData, cropName, cropVariety]);

  const chartData = useMemo(() => {
    if (!selectedCrop) return [];

    // Check if new year-based format exists (roi_2026, roi_2027, etc.)
    if (selectedCrop.roi_2026 !== undefined || selectedCrop.roi_2027 !== undefined) {
      return [
        { name: "2026", value: selectedCrop.roi_2026 ?? 0 },
        { name: "2027", value: selectedCrop.roi_2027 ?? 0 },
        { name: "2028", value: selectedCrop.roi_2028 ?? 0 },
        { name: "2029", value: selectedCrop.roi_2029 ?? 0 },
        { name: "2030", value: selectedCrop.roi_2030 ?? 0 },
      ];
    }

    // Fallback to old month-based format for backward compatibility
    return [
      { name: "3 Months", value: selectedCrop.roi_3_months ?? 0 },
      { name: "6 Months", value: selectedCrop.roi_6_months ?? 0 },
      { name: "9 Months", value: selectedCrop.roi_9_months ?? 0 },
      { name: "12 Months", value: selectedCrop.roi_12_months ?? 0 },
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
          <Typography
            sx={{ fontSize: "0.75rem", color: "rgba(0, 18, 25, 0.6)" }}
          >
            {description}
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: "rgba(0, 18, 25, 0.6)",
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
              <Typography
                variant="body2"
                sx={{ color: "rgba(0, 18, 25, 0.6)" }}
              >
                {duration}
              </Typography>
            </Box>
          </Box>
        </Box>

      </Box>

      {/* Chart */}
      <Box
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderTop: "none",
          borderRadius: " 0 0 4px 4px",
          overflow: "hidden",
          p: "1.5rem",
          height: 320,
          backgroundColor: "#fff",
        }}
      >
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
            >
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />

              <YAxis
                tickFormatter={(val) => `${val}%`}
                tick={{ fontSize: 12 }}
                domain={["auto", "auto"]} // Auto scale for positive & negative values
                label={{
                  value: "ROI (%)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  dx: -10,
                  style: { fontSize: 12, fill: "#666" },
                }}
              />

              {/* Zero line */}
              <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />

              <Tooltip
                cursor={false}
                formatter={(val: number, name: string) => [`${val}%`, name]}
                contentStyle={{ fontSize: "12px" }}
              />

              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Typography sx={{ fontSize: 14 }}>
              No ROI data available for this crop.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};