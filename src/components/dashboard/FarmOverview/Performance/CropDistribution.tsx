"use client";

import { FC, useState } from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import PaginationArrowButtons from "@/utils/PaginationArrowButtons";
import { formatUnderscoreString } from "@/utils/Capitalize";
import BlurWrapper from '@/components/common/BlurWrapper';

interface CropData {
  crop_name: string;
  crop_variety: string;
  cycles: number;
  percentage: number;
}

interface CropDistributionProps {
  cropDistributionData: CropData[];
  ai?: boolean;
}

const COLORS = [
  "#008756",
  "#81b462",
  "#c8d04f",
  "#eea92b",
  "#ff5e00",
  "#00695c",
  "#43a047",
  "#c0ca33",
  "#ffb300",
  "#fb8c00",
  "#8e24aa",
  "#5e35b1",
  "#1e88e5",
  "#00acc1",
  "#6d4c41",
];

const ITEMS_PER_PAGE = 5;

const CropDistribution: FC<CropDistributionProps> = ({ cropDistributionData, ai = true }) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(cropDistributionData.length / ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

  const currentData = cropDistributionData.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 2,
        border: "1px solid #E0E0E0",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: "1.4rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.12)",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#001219" }}>
            Crop Distribution
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "rgba(0, 18, 25, 0.6)",
              mt: "0.25rem",
            }}
          >
            Tracks crop allocation within the selected farm
          </Typography>
        </Box>
        <PaginationArrowButtons
          page={page}
          totalPages={totalPages}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      </Box>

      {/* Main Content */}
      <BlurWrapper isBlurred={!ai} messageType="ai">
      <Box sx={{ display: "flex", gap: "1.5rem", p: "1.5 rem", flexWrap: "wrap" }}>
        {/* Donut Chart */}
        <Box sx={{ width: 175, height: 175 , py: 2}}>
          <ResponsiveContainer width={175} height={175}>
            <PieChart>
              <Pie
                data={cropDistributionData.length > 0 ? cropDistributionData : [{ name: "empty", value: 100 }]}
                dataKey={cropDistributionData.length > 0 ? "percentage" : "value"}
                innerRadius={50}
                outerRadius={80}
                paddingAngle={0}
                stroke="none"
              >
                {cropDistributionData.length > 0 ? (
                  cropDistributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))
                ) : (
                  <Cell fill="#F8F9FB" />
                )}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <Box
                        sx={{
                          background: "#fff",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          padding: "0.5rem",
                          boxShadow: 2,
                        }}
                      >
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
                          {formatUnderscoreString(data.crop_name)} {formatUnderscoreString(data.crop_variety)}: {data.percentage}%
                        </Typography>
                      </Box>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Table */}
        <Box flex={1} minWidth="300px">
          {/* Table Header */}
          <Box
            display="flex"
            alignItems="center"
            fontWeight={600}
            fontSize="0.875rem"
            pt="0.5rem"
            pb="0.5rem"
            borderBottom="1px solid rgba(0,0,0,0.12)"
          >
            <Box flex={1}>Crop</Box>
            <Box flex={1}>Variety</Box>
            <Box flex={0.8}>Grow Cycles</Box>
            <Box flex={1} display="flex" justifyContent="center">Distribution</Box>
          </Box>

          {/* Table Body */}
          {currentData.map((crop, index) => {
            const globalIndex = page * ITEMS_PER_PAGE + index;
            return (
              <Box
                key={`${crop.crop_name}-${crop.crop_variety}`}
                display="flex"
                alignItems="center"
                fontSize="0.875rem"
                sx={{
                  paddingY: "0.75rem",
                  borderBottom: index !== currentData.length - 1 ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
                }}
              >
              {/* Crop Name */}
              <Box flex={1} display="flex" alignItems="center" gap="0.5rem">
                <Box
                  sx={{
                    width: "0.875rem",
                    height: "0.875rem",
                    backgroundColor: COLORS[globalIndex % COLORS.length],
                    borderRadius: "3px",
                  }}
                />
                <Typography fontWeight={500}>
                  {crop.crop_name.charAt(0).toUpperCase() + crop.crop_name.slice(1)}
                </Typography>
              </Box>
                
              {/* Variety */}
              <Box flex={1}>
                <Typography fontWeight={500}>
                  {formatUnderscoreString(crop.crop_variety)}
                </Typography>
              </Box>
                
              {/* Grow Cycles */}
              <Box flex={0.8} justifyContent="center">
                <Typography>{crop.cycles} {crop.cycles > 1 ? "Cycles" : "Cycle"}</Typography>
              </Box>
                
              {/* Distribution */}
              <Box flex={1} display="flex" justifyContent="center">
                <Box
                  sx={{
                    backgroundColor: "rgba(0,0,0,0.08)",
                    borderRadius: "100px",
                    padding: "0.25rem 0.75rem",
                    fontWeight: 500,
                  }}
                >
                  {crop.percentage}%
                </Box>
              </Box>
            </Box>
            );
          })}
        </Box>
      </Box>
      </BlurWrapper>
    </Box>
  );
};

export default CropDistribution;