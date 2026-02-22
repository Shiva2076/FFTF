"use client";
 
import type { FC } from "react";
import { Box, Typography, Stack } from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import ProtectedBlurWrapper from '@/components/Markettrend/ProtectedBlurWrapper';
import Image from 'next/image';
type CostTrend = {
  year: number;
  costPerKg: number;
};
 
type Props = {
  data: {
    title: string;
    description: string;
    duration: string;
    xAxisLabel: string;
    yAxisLabel: string;
    yUnit: string;
    data: CostTrend[];
  };
};
 
const OperationalCostChart: FC<Props> = ({ data }) => {
  const { title, description, duration, xAxisLabel, yAxisLabel, yUnit, data: trendData } = data;
  const now = new Date();
  const year  = now.getFullYear().toString()
  const currentYear = year;
  const HEADER_TITLE = title;
  const HEADER_SUBTITLE = description;
  const LAST_UPDATED = duration;
 
  const formattedData = trendData.map((item) => ({
    year: item.year.toString(),
    value: item.costPerKg,
  }));
 
  return (
    <Box
      sx={{
        width: "100%",
        fontFamily: "Poppins",
        borderRadius: "8px",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <Box sx={{ padding: "1.6rem" }}>
        <Typography fontWeight={600} fontSize="1rem" lineHeight="200%" letterSpacing="0.15px">
          {HEADER_TITLE}
        </Typography>
 
        <Box display="flex" justifyContent="space-between">
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: 'rgba(0, 18, 25, 0.6)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '1.5rem',
              minHeight: '3rem',
              pr: 2,
              flex: 1,
            }}
          >
            {HEADER_SUBTITLE}
          </Typography>
 
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography fontSize="0.75rem" color="rgba(0, 18, 25, 0.6)">•</Typography>
            <Image src="/apps/Vector.svg" alt="calendar" width={10} height={10} />
            <Typography fontSize="0.75rem" color="rgba(0, 18, 25, 0.6)">
              {LAST_UPDATED}
            </Typography>
          </Stack>
        </Box>
      </Box>
      {/* Chart */}
      <ProtectedBlurWrapper>
        <Box
          sx={{
            padding: "1.5rem",
            height: 300,
            borderTop: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 30, right: 20, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="year"
                interval={0}
                tick={{ fontSize: 12, dy: 8 }}
                axisLine={false}
                tickLine={false}
                padding={{ left: 0, right: 0 }}
                domain={['dataMin', 'dataMax']}
                type="category"
                label={{
                  value: xAxisLabel,
                  position: 'bottom',
                  dy: 10,
                  style: {
                    fontSize: 14,
                    fill: '#666',
                  },
                }}
              />
              <YAxis
                domain={['dataMin', 'dataMax']}
                ticks={[0, 20, 40, 60, 80, 100]}
                tick={{ fontSize: 12, dx: -6 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => value.toLocaleString()}
                label={{
                 value: `${yAxisLabel} (${yUnit})`,
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: {
                    textAnchor: "middle",
                    fontSize: 14,
                    fill: "#666",
                  },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "0.5rem 0.75rem",
                  width: "fit-content",
                  maxWidth: "160px",
                }}
                itemStyle={{
                  fontSize: "0.75rem",
                  color: "#008756",
                  margin: 0,
                }}
                labelStyle={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  marginBottom: "0.25rem",
                  color: "#001219",
                }}
                formatter={(value: number) => [`${value.toLocaleString()} ${yUnit}`, yAxisLabel]}
                labelFormatter={(label) => `Year: ${label}`}
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
                  dy: -10,
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2e7d32"
                fill="url(#colorFill)"
                strokeWidth={2}
                dot={{ r: 4, stroke: "#2e7d32", strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 6 }}
              />
              <defs>
                <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#008756" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#008756" stopOpacity={0.3} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </ProtectedBlurWrapper>
    </Box>
  );
};
 
export default OperationalCostChart;