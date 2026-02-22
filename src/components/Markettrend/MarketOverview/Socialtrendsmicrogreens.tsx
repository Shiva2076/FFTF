"use client";

import React, { FC, useMemo, useState, useEffect } from "react";
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

/* ---------------------------------- Types --------------------------------- */

type MGChartKey = "Farms Growing" | "Website Sellings" | "YouTube Mentions";

type WebsiteSellingMG = { crop: string; websites_selling: number };
type FarmsGrowingMG = { crop: string; count: number };
type YouTubeRowMG = { restaurant: string } & Record<string, number>;

type Props = {
  WebsiteSellingsMicrogreens: { data?: WebsiteSellingMG[] };
  FarmsGrowingMicrogreens: { data?: FarmsGrowingMG[] };
  youtubeSentimentsMicrogreens?: { data?: YouTubeRowMG[] };
};

/* --------------------------------- Colors --------------------------------- */

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

const DYNAMIC_BIN_COLORS = [
  "#67AB85",
  "#349264",
  "#007548",
  "#8FB9EA",
  "#2E81D3",
];

/* -------------------------------- Component -------------------------------- */

const Socialtrendsmicrogreens: FC<Props> = ({
  WebsiteSellingsMicrogreens,
  FarmsGrowingMicrogreens,
  youtubeSentimentsMicrogreens,
}) => {
  /* auth */
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const shouldRestrict =
    !Boolean(userInfo?.user_id) || !Boolean(userInfo?.markettrendsubscribed);

  /* tab */
  const [selectedCategory, setSelectedCategory] =
    useState<MGChartKey>("Farms Growing");
  const handleChange = (e: SelectChangeEvent) =>
    setSelectedCategory(e.target.value as MGChartKey);

  /* ------------------------------ Data mapping ----------------------------- */
  const farmsGrowing = useMemo(() => {
    const raw = FarmsGrowingMicrogreens?.data ?? [];
    return Array.isArray(raw)
      ? raw
          .map((it) => ({
            name: it.crop ?? "Unknown",
            mentions: Number(it.count) || 0,
          }))
          .sort((a, b) => b.mentions - a.mentions)
          .slice(0, 8)
      : [];
  }, [FarmsGrowingMicrogreens]);

  const websiteSellings = useMemo(() => {
    const raw = WebsiteSellingsMicrogreens?.data ?? [];
    return Array.isArray(raw)
      ? raw
          .map((it) => ({
            name: it.crop ?? "Unknown",
            mentions: Number(it.websites_selling) || 0,
          }))
          .sort((a, b) => b.mentions - a.mentions)
          .slice(0, 8)
      : [];
  }, [WebsiteSellingsMicrogreens]);

  const youtubeData = useMemo(() => {
    return youtubeSentimentsMicrogreens?.data || [];
  }, [youtubeSentimentsMicrogreens]);

  /* ------------------------------ Heatmap prep ----------------------------- */

  const crops = useMemo(() => {
    if (!youtubeData.length) return [] as string[];
    return Object.keys(youtubeData[0]).filter((k) => k !== "restaurant");
  }, [youtubeData]);

  const chefs = youtubeData.map((row) => row.restaurant);

  const chefLabelsMap = useMemo(() => {
    return chefs.reduce<Record<string, string>>((acc, chef, idx) => {
      acc[chef] = String.fromCharCode(65 + idx);
      return acc;
    }, {});
  }, [chefs]);

  const heatmapData = useMemo(() => {
    const rows: { x: string; y: string; value: number }[] = [];
    youtubeData.forEach((row) => {
      crops.forEach((crop) =>
        rows.push({ x: row.restaurant, y: crop, value: Number(row[crop] || 0) })
      );
    });
    return rows;
  }, [youtubeData, crops]);

  const allValues = heatmapData.map((d) => d.value);
  const maxValue = Math.max(...allValues, 0);

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

  /* ------------------------------ Chart renderers --------------------------- */

  const renderBarChart = (
    data: Array<{ name: string; mentions: number }>,
    yLabel = "Count"
  ) => (
    <BarChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 5 }}>
      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
      <YAxis
        tick={{ fontSize: 12 }}
        label={{
          value: yLabel,
          angle: -90,
          position: "insideLeft",
          offset: -20,
          style: { textAnchor: "middle", fontSize: 12 },
        }}
      />
      <Tooltip
        cursor={false}
        contentStyle={{ fontSize: 12 }}
        formatter={(v: number) => [`${v.toLocaleString()}`]}
      />
      <Bar dataKey="mentions">
        {data.map((_, idx) => (
          <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  );

  /* --------------------------- Available categories -------------------------- */

  const availableCategories = useMemo(() => {
    const cats: MGChartKey[] = [];
    if (farmsGrowing.length > 0) cats.push("Farms Growing");
    if (websiteSellings.length > 0) cats.push("Website Sellings");
    if (youtubeData.length > 0) cats.push("YouTube Mentions");
    return cats;
  }, [farmsGrowing, websiteSellings, youtubeData]);

  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [availableCategories, selectedCategory]);

  /* ---------------------------------- JSX ---------------------------------- */

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Microgreens Social Trends
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="gray">
              Analyzes factors driving microgreens demand
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Image src="/apps/Vector.svg" alt="calendar" width={10} height={10} />
              <Typography variant="body2" color="gray">7d</Typography>
            </Box>
          </Box>
        </Box>

        {/* selector */}
        {availableCategories.length > 0 && (
          <Select
            value={selectedCategory}
            onChange={handleChange}
            sx={{ minWidth: 200, height: 40, borderRadius: 2 }}
          >
            {availableCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        )}
      </Box>

      {/* main visual */}
      <Box sx={{ width: "100%", height: selectedCategory === "YouTube Mentions" ? 620 : 320 }}>
        {selectedCategory === "YouTube Mentions" ? (
          <>
            {/* value-bin legend */}
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

            {/* heatmap */}
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
                    {chefs.map((chef) => {
                      const val =
                        heatmapData.find((d) => d.x === chef && d.y === crop)?.value ?? 0;
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

            {/* chef legend */}
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
                <Box key={chefName} display="flex" alignItems="center" gap={1}>
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
            <Box sx={{ width: "100%", height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                {renderBarChart(
                  selectedCategory === "Farms Growing"
                    ? farmsGrowing
                    : websiteSellings,
                  selectedCategory === "Farms Growing" ? "Farms Count" : "Websites Selling"
                )}
              </ResponsiveContainer>
            </Box>
          </ProtectedBlurWrapper>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderBarChart(
              selectedCategory === "Farms Growing"
                ? farmsGrowing
                : websiteSellings,
              selectedCategory === "Farms Growing" ? "Farms Count" : "Websites Selling"
            )}
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default Socialtrendsmicrogreens;
