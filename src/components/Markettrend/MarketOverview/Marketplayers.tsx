"use client";
import type { FC } from "react";
import { Box, Typography, Stack } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ProtectedBlurWrapper from '@/components/Markettrend/ProtectedBlurWrapper';
import CustomTooltip from "../Custom/CustomTooltip";
import Image from 'next/image';

// Props type
type PlayerCategory = {
  category: string;
  percentage: number;
};

type Props = {
  data: {
    title: string;
    description: string;
    duration: string;
    data: PlayerCategory[] & { tooltip?: string }[];
  };
};

// 🎨 Color palette (cycled)
const COLORS = [
  "#008756", "#81b462", "#c8d04f", "#eea92b", "#ff5e00", "#46b2e0", "#d36ba6", "#008756",
  "#81b462", "#c8d04f", "#eea92b", "#ff5e00", "#46b2e0", "#d36ba6", "#6a5acd", "#ff69b4",
  "#20b2aa", "#ffb347", "#e9967a", "#8fbc8f", "#b0c4de", "#dda0dd", "#f08080", "#b22222",
  "#5f9ea0", "#00ced1", "#778899"
];

const Marketplayers: FC<Props> = ({ data }) => {
   if (!data || !data.data || data.data.length === 0) {
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
   
  const { title, description, duration, data: playerData } = data;
  const chartData = playerData.map((item) => ({
    label: item.category,
    value: item.percentage,
  }));
  const HEADER_TITLE = title;
  const HEADER_SUBTITLE = description;
  const LAST_UPDATED = duration;

  return (
    <Box sx={{
      width: "100%", fontFamily: "Poppins", border: "1px solid rgba(0, 0, 0, 0.12)",
      borderRadius: "8px",
      overflow: "hidden",
    }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: "1.5rem",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Stack spacing={1.5}>
          <Typography
            fontWeight={600}
            fontSize="1rem"
            lineHeight="200%"
            letterSpacing="0.15px"
          >
            {HEADER_TITLE}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            fontSize="0.75rem"
            color="rgba(0, 18, 25, 0.6)"
          >
            <Typography letterSpacing="0.4px" lineHeight="166%">
              {HEADER_SUBTITLE}
            </Typography>
            <Typography>•</Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Image
                src="/apps/Vector.svg"
                alt="calendar"
                width={10}
                height={10}
                priority
              />
              <Typography letterSpacing="0.4px" lineHeight="166%">
                {LAST_UPDATED}
              </Typography>
            </Stack>
          </Stack>

        </Stack>
      </Box>

      {/* Chart Section */}
      <ProtectedBlurWrapper>
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: "1.5rem",
            display: "flex",
            gap: "1.5rem",
          }}
        >
          {/* Pie Chart */}
          <Box sx={{ width: "14rem", height: "14rem" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={0}
                  stroke="none"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Breakdown Labels */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            {chartData.map((player, index) => (
              <Box
                key={index}
                sx={{
                  borderBottom:
                    index !== chartData.length - 1
                      ? "1px solid rgba(0, 0, 0, 0.12)"
                      : "none",
                  height: "3rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Box
                  sx={{
                    width: "1rem",
                    height: "1rem",
                    borderRadius: "3px",
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
                <Typography
                  sx={{
                    flex: 1,
                    letterSpacing: "0.4px",
                    lineHeight: "166%",
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {player.label}
                </Typography>
                <Box
                  sx={{
                    borderRadius: "100px",
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    padding: "0.187rem 0.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "1.5rem",
                    maxHeight: "1.5rem",
                  }}
                >
                  <Typography
                    sx={{
                      padding: "0rem 0.375rem",
                      lineHeight: "0.75rem",
                      fontSize: "0.75rem",
                    }}
                  >
                    {player.value}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </ProtectedBlurWrapper>
    </Box>
  );
};

export default Marketplayers;
