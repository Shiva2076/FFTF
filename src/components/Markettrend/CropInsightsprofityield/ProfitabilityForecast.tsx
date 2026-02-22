"use client";
import { FC, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Image from "next/image";

interface Props {
  cropName: string;
  cropVariety: string;
}

export const ProfitabilityForecast: FC<Props> = ({ cropName, cropVariety }) => {
  // ✅ safe defaults for title/description/duration
  const { title = "", description = "", duration = "" } = useSelector(
    (state: RootState) =>
      state.cropGrowingGuide.data?.cropProfitabilityForecast ?? {}
  );

  // ✅ safe fallback array for chart data
  const forecastData = useSelector(
    (state: RootState) =>
      state.cropGrowingGuide.data?.cropProfitabilityForecast?.data ?? []
  );

  // ✅ safe fallback for meta
  const { currency = "₹", weight = "kg" } = useSelector(
    (state: RootState) => state.locationMeta || {}
  );

  const selectedCrop = useMemo(() => {
    return forecastData.find(
      (entry: any) =>
        entry.crop?.toLowerCase().trim() === cropName.toLowerCase().trim() &&
        entry.variety?.toLowerCase().trim() === cropVariety.toLowerCase().trim()
    );
  }, [cropName, cropVariety, forecastData]);

  const chartData = useMemo(() => {
    if (!selectedCrop) return [];

    return [
      {
        period: "2026",
        Revenue: selectedCrop.annual_revenue_2026 ?? 0,
        Costs: selectedCrop.annual_costs_2026 ?? 0,
        Profit: selectedCrop.annual_profit_2026 ?? 0,
      },
      {
        period: "2027",
        Revenue: selectedCrop.annual_revenue_2027 ?? 0,
        Costs: selectedCrop.annual_costs_2027 ?? 0,
        Profit: selectedCrop.annual_profit_2027 ?? 0,
      },
      {
        period: "2028",
        Revenue: selectedCrop.annual_revenue_2028 ?? 0,
        Costs: selectedCrop.annual_costs_2028 ?? 0,
        Profit: selectedCrop.annual_profit_2028 ?? 0,
      },
      {
        period: "2029",
        Revenue: selectedCrop.annual_revenue_2029 ?? 0,
        Costs: selectedCrop.annual_costs_2029 ?? 0,
        Profit: selectedCrop.annual_profit_2029 ?? 0,
      },
      {
        period: "2030",
        Revenue: selectedCrop.annual_revenue_2030 ?? 0,
        Costs: selectedCrop.annual_costs_2030 ?? 0,
        Profit: selectedCrop.annual_profit_2030 ?? 0,
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
        <Typography sx={{ fontWeight: 600 }}>
          {title || "Profitability Forecast"}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Typography
            sx={{ fontSize: "0.75rem", color: "rgba(0, 18, 25, 0.6)" }}
          >
            {description || "No description available"}
          </Typography>
          {duration && (
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
          )}
        </Box>
      </Box>

      {/* Bar Chart */}
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
              margin={{ top: 20, right: 10, left: 30, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(val) =>
                  `${currency} ${val?.toLocaleString("en-IN")}`
                }
                tick={{ fontSize: 12 }}
                label={{
                  value: `Price (${currency})`,
                  angle: -90,
                  position: "insideLeft",
                  dx: -30,
                  style: {
                    fill: "#444",
                    fontSize: 12,
                    fontWeight: 0,
                  },
                }}
              />
              <Tooltip
                cursor={false}
                formatter={(value: number, name: string) => [
                  `${currency} ${value?.toLocaleString("en-IN")}`,
                  name,
                ]}
                contentStyle={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                }}
                itemStyle={{
                  fontSize: "10px",
                  marginBottom: "2px",
                }}
                labelStyle={{
                  fontSize: "10px",
                  marginBottom: "2px",
                }}
              />
              <Legend
                iconType="circle"
                verticalAlign="bottom"
                align="center"
                content={({ payload }) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 16,
                      marginLeft: "50px",
                    }}
                  >
                    <ul
                      style={{
                        display: "flex",
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        gap: "1.5rem",
                      }}
                    >
                      {payload?.map((entry, index) => (
                        <li
                          key={`item-${index}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: entry.color,
                            }}
                          />
                          <span
                            style={{ color: "#5F6D7E", fontSize: 14 }}
                          >
                            {entry.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              />
              <Bar dataKey="Revenue" fill="#2e7d32" barSize={20} />
              <Bar dataKey="Costs" fill="#cddc39" barSize={20} />
              <Bar dataKey="Profit" fill="#fbc02d" barSize={20} />
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
              minHeight: "150px",
            }}
          >
            <Typography sx={{ fontSize: 14 }}>
              No forecast data available for this crop.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
