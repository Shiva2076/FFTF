"use client";

import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { formatUnderscoreString } from "@/utils/Capitalize";

// Basket crop type
type CropInfo = {
  name: string;
  variety: string;
  crop_type?: string;
  growthCycle: string;
  yieldPotential: string;
};

type CropGrowingParameter = {
  parameter_id: string | number;
  crop_name: string;
  crop_variety_name: string;
  crop_type?: string;
  stage_id: string;
  stage_duration_min?: number;
  stage_duration_max?: number;
  temperature_min?: number;
  temperature_max?: number;
  humidity_min?: number;
  humidity_max?: number;
  ph_min?: number;
  ph_max?: number;
  ec_min?: number;
  ec_max?: number;
};

type Props = {
  cropName?: string;
  cropVariety?: string;
  cropType?: string;
  showAllCrops?: boolean; // Added this prop for consistency
};

type Stage = {
  stage: string;
  startDay: number;
  endDay: number;
};

// UI constants
const STAGE_LABELS = ["crop", "seeding", "transplant", "vegetative", "harvest"];
const STAGE_COLORS: Record<string, string> = {
  crop: "#333333",
  seeding: "#006400",
  transplant: "#90EE90",
  vegetative: "#FFA500",
  harvest: "#FF0000",
};
const DAY_WIDTH = 40;

function dayNumberToDate(dayNumber: number): Date {
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);
  const result = new Date(baseDate);
  result.setDate(result.getDate() + (dayNumber - 1));
  return result;
}

function getBarPosition(startDay: number, endDay: number) {
  const leftPx = startDay * DAY_WIDTH;
  const widthPx = (endDay - startDay + 1) * DAY_WIDTH;
  return { leftPx, widthPx };
}

const CropGrowthTimeline: React.FC<Props> = ({ cropName, cropVariety, cropType, showAllCrops = false }) => {
  const { title, description } = { title: "Crop Growth Timeline", description: "Tracks crop growth stages and duration." };

  // Basket fallback
  const basket = useSelector((state: RootState) => state.growBasket.basket) as CropInfo[];
  
  // Include crop_type in the crops array - FIXED to handle showAllCrops prop
  const crops = useMemo(() => {
    // If showAllCrops is true, show ALL basket crops
    if (showAllCrops) {
      return basket.map(crop => ({
        name: crop.name.toLowerCase(),
        variety: crop.variety.toLowerCase(),
        crop_type: crop.crop_type || ''
      }));
    }
    
    // If specific crop is provided via props, show only that crop
    if (cropName && cropVariety && cropType) {
      return [{ 
        name: cropName.toLowerCase(), 
        variety: cropVariety.toLowerCase(),
        crop_type: cropType
      }];
    }
    
    // Default: show all crops from basket
    return basket.map(crop => ({
      name: crop.name.toLowerCase(),
      variety: crop.variety.toLowerCase(),
      crop_type: crop.crop_type || ''
    }));
  }, [cropName, cropVariety, cropType, basket, showAllCrops]);

  // Parameters from Redux
  const allParams = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropGrowingParameters
  ) as CropGrowingParameter[] | undefined;

  // Use crops directly without additional filtering
  const filteredCrops = useMemo(() => {
    return crops;
  }, [crops]);

  // NEW: Group parameters by crop and variety to handle multiple cycles
  const groupedParams = useMemo(() => {
    if (!allParams) return {};
    
    const grouped: Record<string, CropGrowingParameter[]> = {};
    
    allParams.forEach(param => {
      // Normalize the key construction
      const paramKey = `${param.crop_name.toLowerCase()}|${param.crop_variety_name.toLowerCase()}|${param.crop_type || ''}`;
      if (!grouped[paramKey]) {
        grouped[paramKey] = [];
      }
      grouped[paramKey].push(param);
    });
    
    return grouped;
  }, [allParams]);

  // Build calendarMap for EACH crop separately
  const calendarMap: Record<string, Stage[]> = {};
  
  filteredCrops.forEach(crop => {
    const cropKey = `${crop.name}|${crop.variety}|${crop.crop_type || ''}`;
    const cropParams = groupedParams[cropKey] || [];
    
    if (!calendarMap[cropKey]) {
      calendarMap[cropKey] = [];
    }

    cropParams.forEach(p => {
      if (p.stage_duration_min != null && p.stage_duration_max != null) {
        calendarMap[cropKey].push({
          stage: p.stage_id.toLowerCase(),
          startDay: p.stage_duration_min,
          endDay: p.stage_duration_max,
        });
      }
    });

    // Inject "transplant" as 1 day at the start of vegetative for THIS crop
    const stages = calendarMap[cropKey];
    const vegetativeIdx = stages.findIndex((s) => s.stage === "vegetative");
    if (vegetativeIdx !== -1) {
      const vegStage = stages[vegetativeIdx];
      if (vegStage.startDay < vegStage.endDay) {
        const transplantStage: Stage = {
          stage: "transplant",
          startDay: vegStage.startDay,
          endDay: vegStage.startDay,
        };
        stages[vegetativeIdx] = {
          ...vegStage,
          startDay: vegStage.startDay + 1,
        };
        stages.splice(vegetativeIdx, 0, transplantStage);
      }
    }
  });

  // Calculate maxDay across ALL crops
  let maxDay = 0;
  Object.values(calendarMap).forEach((stages) => {
    stages.forEach((s) => {
      if (s.endDay > maxDay) maxDay = s.endDay;
    });
  });
  if (maxDay < 1) maxDay = 30;
  const totalWidth = maxDay * DAY_WIDTH;

  function renderBar(cropKey: string, label: string) {
    const stages = calendarMap[cropKey];
    if (!stages) return null;

    if (label === "crop") {
      let minStart = Number.POSITIVE_INFINITY;
      let maxEnd = Number.NEGATIVE_INFINITY;
      stages.forEach((s) => {
        if (s.startDay < minStart) minStart = s.startDay;
        if (s.endDay > maxEnd) maxEnd = s.endDay;
      });
      if (minStart > maxEnd) return null;
      const { leftPx, widthPx } = getBarPosition(minStart, maxEnd);
      return (
        <Box
          key="cropBar"
          sx={{
            position: "absolute",
            top: 4,
            left: `${leftPx}px`,
            width: `${widthPx}px`,
            height: "20px",
            backgroundColor: STAGE_COLORS[label],
            borderRadius: "4px",
            opacity: 0.8,
          }}
        />
      );
    }

    const data = stages.find((s) => s.stage === label);
    if (!data) return null;
    const { leftPx, widthPx } = getBarPosition(data.startDay, data.endDay);
    return (
      <Box
        key={label}
        sx={{
          position: "absolute",
          top: 4,
          left: `${leftPx}px`,
          width: `${widthPx}px`,
          height: "20px",
          backgroundColor: STAGE_COLORS[label],
          borderRadius: "4px",
        }}
      />
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" gutterBottom>
          {description}
        </Typography>
      )}

      {/* Show message if no crops */}
      {filteredCrops.length === 0 && (
        <Box sx={{ mt: 2, p: 2, border: "1px solid #eee", borderRadius: "8px" }}>
          <Typography variant="body2" color="text.secondary">
            No crops available to display timeline
          </Typography>
        </Box>
      )}

      {/* Outer container for horizontal scrolling */}
      {filteredCrops.length > 0 && (
        <Box
          sx={{
            mt: 2,
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "1rem",
            overflowX: "auto",
          }}
        >
          <Box sx={{ position: "relative", width: `${totalWidth}px`, minWidth: "100%" }}>
            {/* Header Row */}
            <Box sx={{ display: "flex", marginLeft: "140px" }}>
              <Box sx={{ width: 140 }} />
              <Box sx={{ display: "flex" }}>
                {Array.from({ length: maxDay }, (_, i) => i + 1).map((day) => {
                  const realDate = dayNumberToDate(day);
                  const dayNum = realDate.getDate();
                  const monthLabel = realDate.toLocaleString("default", { month: "short" });
                  return (
                    <Box
                      key={day}
                      sx={{
                        width: `${DAY_WIDTH}px`,
                        textAlign: "center",
                        fontSize: "0.8rem",
                        color: "#999",
                        borderLeft: "1px solid #eee",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {day === 1 || dayNum === 1 ? (
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {`${monthLabel} ${realDate.getFullYear()}`}
                        </Typography>
                      ) : null}
                      {dayNum}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Crop Rows */}
            {filteredCrops.map((crop, idx) => {
              const cropKey = `${crop.name}|${crop.variety}|${crop.crop_type || ''}`;
              
              return (
                <Box key={`${cropKey}-${idx}`} sx={{ display: "flex", mt: 2 }}>
                  {/* Left Column: Stage Labels */}
                  <Box sx={{ width: 140, minWidth: 140, borderRight: "1px solid #eee" }}>
                    {STAGE_LABELS.map((label) => (
                      <Box
                        key={label}
                        sx={{
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "4px",
                        }}
                      >
                        <Typography
                          variant={label === "crop" ? "subtitle2" : "body2"}
                          sx={{ fontWeight: label === "crop" ? 600 : 400 }}
                        >
                          {label === "crop"
                            ? `${crop.name.charAt(0).toUpperCase() + crop.name.slice(1)} ${formatUnderscoreString(
                                crop.variety ?? ""
                              )}`
                            : label.charAt(0).toUpperCase() + label.slice(1)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Stage Bars */}
                  <Box
                    sx={{
                      position: "relative",
                      width: `${totalWidth}px`,
                      height: `${STAGE_LABELS.length * 28}px`,
                    }}
                  >
                    {STAGE_LABELS.map((label, barIndex) => {
                      const bar = renderBar(cropKey, label);
                      if (!bar) return null;
                      return (
                        <Box
                          key={label}
                          sx={{
                            position: "absolute",
                            top: `${barIndex * 28}px`,
                            left: 0,
                            right: 0,
                            height: "28px",
                          }}
                        >
                          {bar}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CropGrowthTimeline;