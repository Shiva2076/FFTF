"use client";

import React, { FC, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useSelector } from "react-redux";
import ProtectedBlurWrapper from "@/components/Markettrend/ProtectedBlurWrapper";
import Image from "next/image";

type ChartKey = "Restaurant Trends" | "Search Popularity" | "Chef’s Choice";
type CropName =
  | "Arugula"
  | "Basil"
  | "Celery"
  | "Kale"
  | "Lettuce"
  | "Pak Choi"
  | "Parsley"
  | "Spinach";

const CROP_COLORS: Record<CropName, string> = {
  Arugula: "#008756",
  Basil: "#509e5b",
  Celery: "#81b462",
  Kale: "#b1ca6c",
  Lettuce: "#c8d04f",
  "Pak Choi": "#e7c552",
  Parsley: "#eea92b",
  Spinach: "#ff5e00",
};

const DYNAMIC_BIN_COLORS =["#67AB85", "#349264", "#007548","#8FB9EA","#2E81D3"];
const BAR_COLORS = [
  "#82ca9d",
  "#a5d6a7",
  "#c8e6c9",
  "#66bb6a",
  "#43a047",
  "#2e7d32",
  "#00c853",
  "#009688",
];

type YouTubeSentiment = {
  channel_name: string;
  basil_count: number;
  spinach_count: number;
  kale_count: number;
  lettuce_count: number;
  arugula_count: number;
  celery_count: number;
  bok_choy_count: number;
};

type GoogleTrend = {
  crop: string;
  total_results: string;
};

type RestaurantItem = {
  crop_name: string;
  count: number;
};

type Props = {
  youtubeSentiments: YouTubeSentiment[];
  googleSearchTrends: GoogleTrend[];
  restaurantMenu: RestaurantItem[];
};

const Socialtrends: FC<Props> = ({
  youtubeSentiments,
  googleSearchTrends,
  restaurantMenu,
}) => {
  /* auth */
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const shouldRestrict =
    !Boolean(userInfo?.user_id) || !Boolean(userInfo?.markettrendsubscribed);

  const [selectedCategory, setSelectedCategory] =
    useState<ChartKey>("Chef’s Choice");
  const handleChange = (e: SelectChangeEvent) =>
    setSelectedCategory(e.target.value as ChartKey);

  const restaurantTrends = restaurantMenu.map((it) => ({
    name: it.crop_name,
    mentions: it.count,
  }));
  const searchTrends = googleSearchTrends.map((it) => ({
    name: it.crop,
    mentions: parseInt(it.total_results.replace(/,/g, ""), 10),
  }));

  const chefCropData = youtubeSentiments.map((it) => ({
    chef: it.channel_name,
    Arugula: it.arugula_count,
    Basil: it.basil_count,
    Celery: it.celery_count,
    Kale: it.kale_count,
    Lettuce: it.lettuce_count,
    "Pak Choi": it.bok_choy_count,
    Parsley: 0,
    Spinach: it.spinach_count,
  }));

  const crops = Object.keys(CROP_COLORS) as CropName[];
  const chefs = chefCropData.map((row) => row.chef);

  const chefLabelsMap = useMemo(() => {
    return chefs.reduce<Record<string, string>>((acc, chef, idx) => {
      acc[chef] = String.fromCharCode(65 + idx);
      return acc;
    }, {});
  }, [chefs]);

  const heatmapData = useMemo(() => {
    const rows: { x: string; y: CropName; value: number }[] = [];
    chefCropData.forEach((row) => {
      crops.forEach((crop) =>
        rows.push({ x: row.chef, y: crop, value: Number(row[crop] || 0) })
      );
    });
    return rows;
  }, [chefCropData, crops]);

  const allValues = useMemo(
    () => heatmapData.map(d => d.value),
    [heatmapData]
  );

  const maxValue = useMemo(
    () => Math.max(...allValues, 0),
    [allValues]
  );

  const dynamicBins = useMemo(() => {
    const binSize = Math.ceil(maxValue / 5);
    let step = Math.ceil(binSize / 10) * 10;
    if (step === 0) step = 10;

    const bins = [];
    for (let i = 0; i < 5; i++) {
      const min = i === 0 ? 0 : i * step + 1;
      const max = i < 4 ? (i + 1) * step : Infinity;
      bins.push({ min, max, color: DYNAMIC_BIN_COLORS[i] });
    }
    return bins;
  }, [maxValue]);

  const renderBarChart = (data: any[]) => (
    <BarChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 5 }}>
      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
      <YAxis
        tick={{ fontSize: 12 }}
        label={{
          value:
            selectedCategory === "Search Popularity"
              ? "Total Search Results"
              : "Mentions",
          angle: -90,
          position: "insideLeft",
          offset: -20,
          style: { textAnchor: "middle", fontSize: 12 },
        }}
      />
      <Tooltip
        cursor={false}
        contentStyle={{ fontSize: 12 }}
        formatter={(v: number) =>
          selectedCategory === "Search Popularity"
            ? [`${v.toLocaleString()} Searches`]
            : [`${v} Mentions`]
        }
      />
      <Bar dataKey="mentions">
        {data.map((_, idx) => (
          <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  );

  return (
    <Box
      sx={{
        width: "95.5%",
        backgroundColor: "#fff",
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.12)",
        p: 3,
        paddingBottom: 8,
      }}
    >
      {/* header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Social Trends: What’s Influencing Consumer Interest?
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="gray">
              Analyzes factors driving consumer demand
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Image src="/apps/Vector.svg" alt="calendar" width={10} height={10} />
              <Typography variant="body2" color="gray">
                7d
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* selector */}
        <Select
          value={selectedCategory}
          onChange={handleChange}
          sx={{ minWidth: 200, height: 40, borderRadius: 2 }}
        >
          {(["Restaurant Trends", "Search Popularity", "Chef’s Choice"] as ChartKey[]).map(
            (cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            )
          )}
        </Select>
      </Box>

      {/* main visual */}
      <Box sx={{ width: "100%", height: 420 }}>
        {selectedCategory === "Chef’s Choice" ? (
          <>
            {/* value‑bin legend */}
            <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
              <Typography variant="body2" fontWeight={500} mr={2}>
                Mentions:
              </Typography>
               {dynamicBins.map((b, i) => (
                 <Box key={i} display="flex" alignItems="center" mr={3} mb={1}>
                   <Box
                     sx={{
                       width: 14,
                       height: 14,
                       bgcolor: b.color,
                       borderRadius: 0.5,
                       mr: 0.5,
                     }}
                   />
                   <Typography variant="caption">
                     {b.max !== Infinity ? `${b.min}–${b.max}` : `${b.min - 1}+`}
                   </Typography>
                 </Box>
               ))}
            </Box>

            {/* heat‑map grid */}
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Box
                sx={{
                  display: "grid",
                  gridAutoRows: "40px",
                  gridTemplateColumns: `100px repeat(${chefs.length}, minmax(80px,1fr))`,
                  gap: "1px",
                  backgroundColor: "#ddd",
                }}
              >
                {crops.map((crop) => (
                  <React.Fragment key={crop}>
                    {/* crop labels (Y‑axis) */}
                    <Box
                      sx={{
                        backgroundColor: "#f9f9f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        pr: 2,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {crop}
                    </Box>

                    {/* data cells */}
                    {chefs.map((chef) => {
                      const val =
                        heatmapData.find(
                          (d) => d.x === chef && d.y === crop
                        )?.value ?? 0;
                      const bin = dynamicBins.find((b, i) => {
                      const isLast = i === dynamicBins.length - 1;
                        return isLast ? val >= b.min : val >= b.min && val <= b.max;
                      });
                      const color = bin?.color || "#ccc";
                      return (
                        <Box
                          key={`${chef}-${crop}`}
                          sx={{
                            backgroundColor: color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                          }}
                        >
                          {val}
                        </Box>
                      );
                    })}
                  </React.Fragment>
                ))}
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `100px repeat(${chefs.length}, minmax(80px,1fr))`,
                  mt: 1,
                }}
              >
                <Box /> {/* spacer */}
                {chefs.map((chef) => (
                  <Box
                    key={chef}
                    sx={{
                      fontSize: 12,
                      textAlign: "center",
                      px: 1,
                    }}
                  >
                    {chefLabelsMap[chef]}
                  </Box>
                ))}
              </Box>
            </Box>

            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              justifyContent="center"
              mt={1}
              mb={5} 
              paddingBottom={2}
            >
              {Object.entries(chefLabelsMap).map(([chefName, letter]) => (
                <Box
                  key={chefName}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  paddingBottom="2px"
                >
                  <Typography variant="body2" fontWeight={600}>
                    {letter}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {chefName}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        ) : shouldRestrict ? (
          <ProtectedBlurWrapper>
            <Box sx={{ width: "100%", height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              {renderBarChart(
                selectedCategory === "Restaurant Trends"
                  ? restaurantTrends
                  : searchTrends
              )}
            </ResponsiveContainer>
            </Box>
          </ProtectedBlurWrapper>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderBarChart(
              selectedCategory === "Restaurant Trends"
                ? restaurantTrends
                : searchTrends
            )}
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default Socialtrends;
