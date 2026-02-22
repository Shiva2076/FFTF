"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';

interface CropStatus {
  status: string;
  percentage: number;
}

interface CropGrowthCycle {
  growth_cycle: string;
  cropCycleStatus: CropStatus[];
}

interface GrowCycleTimelineProps {
  cropGrowthYieldTimeline: CropGrowthCycle[];
  onGrowCycleClick?: (growCycleId: number) => void;
}

const stageMap: Record<string, string> = {
  INITIALIZED: "Initialized",
  SEEDING: "Seeding",
  TRANSPLANT: "Transplant",
  VEGETATIVE: "Vegetative",
  HARVEST: "Harvest",
  COMPLETED: "Complete",
  PENDING: "Pending"
};
const orderedStages = [
  "Initialized",
  "Seeding",
  "Transplant",
  "Vegetative",
  "Harvest",
  "Complete",
  "Pending"
];

const stageColors: Record<string, string> = {
  Initialized: "#a0a0a0",
  Seeding: "#008756",
  Transplant: "#81b462",
  Vegetative: "#c8d04f",
  Harvest: "#eea92b",
  Complete: "#4c4c4c",
  Pending: "#049183",
};

const ITEMS_PER_PAGE = 5;

const CropCycleTimeline = ({ cropGrowthYieldTimeline, onGrowCycleClick }: GrowCycleTimelineProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  interface CycleData {
    label: string;
    stageProgress: { name: string; percentage: number; }[];
    isCompleted?: boolean;
  }

  const cycles = cropGrowthYieldTimeline?.map((cycle, index) => {
    const stageMapFromAPI: Record<string, number> = {};

    cycle.cropCycleStatus.forEach((s) => {
      const mapped = stageMap[s.status];
      if (mapped) stageMapFromAPI[mapped] = s.percentage;
    });

    const cycleData: CycleData = {
      label: `Grow Cycle ${cycle.growth_cycle || index + 1}`,
      stageProgress: orderedStages.map((stage) => ({
        name: stage,
        percentage: stageMapFromAPI[stage] || 0,
      })),
      isCompleted: false,
    };

    cycleData.stageProgress.forEach(stage => {
      if (stage.name === "Complete" && stage.percentage === 100) {
        cycleData.isCompleted = true;
      }
    });

    return cycleData;
  })
  .sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? 1 : -1;
  });

  const totalPages = Math.ceil(cycles.length / ITEMS_PER_PAGE);
  const paginatedCycles = cycles.slice(
    currentPage * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  return (
    <Box
      sx={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#fff",
        fontFamily: "Poppins",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1.5rem",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
            Crop Grow Cycles Timeline
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "rgba(0, 18, 25, 0.6)" }}>
            Tracks crop growth stages and duration.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <PaginationArrowButtons
            page={currentPage}
            totalPages={totalPages}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        </Box>
      </Box>

      {/* Legend */}
      <Box
        sx={{
          display: "flex",
          gap: "1.5rem",
          padding: "1rem",
          borderBottom: "1px solid rgba(0,0,0,0.12)",
          fontSize: "0.75rem",
        }}
      >
        {Object.entries(stageColors).map(([stage, color]) => (
          <Box key={stage} sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Box
              sx={{
                width: "1rem",
                height: "1rem",
                backgroundColor: color,
                borderRadius: "3px",
              }}
            />
            <Typography>{stage} Stage</Typography>
          </Box>
        ))}
      </Box>

      {/* Grow Cycles */}
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {/* Cycle Labels */}
        <Box
          sx={{
            minWidth: "10rem",
            borderRight: "1px solid #d1d9e2",
          }}
        >
          {paginatedCycles.map((cycle, index) => (
            <Box
              key={index}
              sx={{
                height: "2.5rem",
                display: "flex",
                alignItems: "center",
                paddingLeft: "1rem",
                borderBottom: "1px solid rgba(0,0,0,0.12)",
              }}
            >
              <Typography
              sx={{ fontWeight: 500, textDecoration: "underline", fontSize: "0.875rem",cursor: "pointer" }}
              onClick={() => {
                const cycleId = cycle.label.split(" ").pop();
                if (cycleId) {
                  onGrowCycleClick?.(Number(cycleId));
                }
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              >
                {cycle.label}
              </Typography>
            </Box>
          ))}
          {/* Placeholder labels */}
          {Array.from({ length: ITEMS_PER_PAGE - paginatedCycles.length }).map((_, i) => (
            <Box
              key={`empty-label-${i}`}
              sx={{
                height: "2.5rem",
                borderBottom: "1px solid rgba(0,0,0,0.12)",
              }}
            />
          ))}
        </Box>

        {/* Stage Progress Bars */}
        <Box sx={{ flex: 1 }}>
          {paginatedCycles.map((cycle, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                height: "2.5rem",
                width: "100%",
                borderBottom: "1px solid rgba(0,0,0,0.12)",
              }}
            >
              {cycle.stageProgress
                .filter((stage) => stage.percentage > 0)
                .map((stage, idx) => (
                  <Box
                    key={idx}
                    title={`${stage.name}: ${stage.percentage}%`}
                    sx={{
                      width: `${stage.percentage}%`,
                      backgroundColor: stageColors[stage.name] || "#ccc",
                    }}
                  />
                ))}
            </Box>
          ))}
          {/* Placeholder bars */}
          {Array.from({ length: ITEMS_PER_PAGE - paginatedCycles.length }).map((_, i) => (
            <Box
              key={`empty-bar-${i}`}
              sx={{
                height: "2.5rem",
                width: "100%",
                borderBottom: "1px solid rgba(0,0,0,0.12)",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CropCycleTimeline;
