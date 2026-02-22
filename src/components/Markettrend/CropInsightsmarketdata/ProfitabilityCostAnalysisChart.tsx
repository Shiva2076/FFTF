"use client";
import { FC, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Image from 'next/image';

interface Props {
  cropName: string;
  cropVariety: string;
}

const COLORS = ["#008756", "#8BC34A", "#CDDC39", "#FFC107", "#FF5722"];

const LABELS = [
  "Production Costs",
  "Labor Costs",
  "Logistics & Distribution",
  "Other Costs",
  "Net Profit",
];

export const ProfitabilityCostAnalysisChart: FC<Props> = ({ cropName, cropVariety }) => {
  const {title,description, duration} = useSelector((state:RootState)=>state.cropGrowingGuide.data?.cropProfitabilityCost || {title:"",description:""});
  
  const cropProfitabilityCost = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropProfitabilityCost.data
  );

  const selectedCropData = useMemo(() => {
    return cropProfitabilityCost?.find((entry: any) => {
      return (
        entry.crop?.toLowerCase().trim() === cropName?.toLowerCase().trim() &&
        entry.variety?.toLowerCase().trim() === cropVariety?.toLowerCase().trim()
      );
    });
  }, [cropName, cropVariety, cropProfitabilityCost]);

  const chartData = useMemo(() => {
    if (!selectedCropData) return [];

    return [
      {
        name: "Production Costs",
        value: selectedCropData.production_costs ?? 0,
      },
      {
        name: "Labor Costs",
        value: selectedCropData.labor_costs ?? 0,
      },
      {
        name: "Logistics & Distribution",
        value: selectedCropData.logistics_distribution ?? 0,
      },
      {
        name: "Other Costs",
        value: selectedCropData.other_costs ?? 0,
      },
      {
        name: "Net Profit",
        value: selectedCropData.net_profit ?? 0,
      },
    ];
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
        <Typography sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
            {description}
          </Typography>
          {/* <Box sx={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "text.secondary", fontSize: "0.75rem" }}>
            <Box component="span" sx={{ mx: 0.5 }}>•</Box>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Image src="/Vector.svg" alt="calendar" width={12} height={12} />
              <Typography variant="body2" color="text.secondary">14d</Typography>
            </Box>
          </Box> */}
        </Box>
      </Box>
      {/* {Divider} */}
      <Box sx={{ height: "1px", backgroundColor: "rgba(0, 0, 0, 0.12)", width: "100%", marginTop: "-8px", marginBottom: "8px" }} />
      {/* Chart + Legend */}
      <Box sx={{ flex: 1, p: "1.5rem", display: "flex", gap: "1.5rem" }}>
        {chartData.length > 0 ? (<>
          <Box sx={{ width: 224, height: 224 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={0}
                  stroke="none"
                  strokeWidth={0}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  contentStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Legend */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {chartData.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                  height: "3rem",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Box
                    sx={{
                      width: "1rem",
                      height: "1rem",
                      backgroundColor: COLORS[index % COLORS.length],
                      borderRadius: "2px",
                    }}
                  />
                  <Typography>{item.name}</Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    borderRadius: "100px",
                    px: "0.5rem",
                  }}
                >
                  <Typography>{item.value}%</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </>
        ) : (<Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 290,
            width: '100%',
          }}
        >
          <Typography sx={{ fontSize: 14 }}>
            No data available for this crop.
          </Typography>
        </Box>)}
      </Box>
    </Box>
  );
};
