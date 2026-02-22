"use client";

import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import BlurWrapper from '@/components/common/BlurWrapper';

interface LiveImpactSnapshotsData {
  impact_score: number | string;
  carbon_saved: string;
  water_saved: string;
  energy_saved: string;
  crop_health: number | string;
}

interface LiveImpactSnapshotProps {
  liveImpactSnapshotsData: LiveImpactSnapshotsData;
  iot?: boolean;
}

const LiveImpactSnapshot: React.FC<LiveImpactSnapshotProps> = ({
  liveImpactSnapshotsData,
  iot = true,
}) => {
  const safeData: LiveImpactSnapshotsData = {
    impact_score: liveImpactSnapshotsData?.impact_score ?? "-",
    carbon_saved: liveImpactSnapshotsData?.carbon_saved ?? "-",
    water_saved: liveImpactSnapshotsData?.water_saved ?? "-",
    energy_saved: liveImpactSnapshotsData?.energy_saved ?? "-",
    crop_health: liveImpactSnapshotsData?.crop_health ?? "-",
  };

  // Convert values to absolute numbers and keep units
  const parseValueWithUnit = (val: string | number, unit: string) => {
    if (val === "-" || val === null || val === undefined) return "-";
    const num = parseFloat(String(val).replace(/[^\d.-]/g, ""));
    if (isNaN(num)) return val;
    return `${Math.abs(num).toFixed(2)} ${unit}`;
  };

  const impactScore =
    typeof safeData.impact_score === "number"
      ? Math.abs(safeData.impact_score)
      : Math.abs(parseFloat(safeData.impact_score as string)) || 0;

  const percentage = !isNaN(impactScore)
    ? Math.min(Math.max(impactScore, 0), 100)
    : 0;

  const metrics = [
    {
      label: "Carbon Saved",
      value: parseValueWithUnit(safeData.carbon_saved, "kg CO₂"),
      color: "#008756",
    },
    {
      label: "Water Saved",
      value: parseValueWithUnit(safeData.water_saved, "L"),
      color: "#c8d04f",
    },
    {
      label: "Energy Saved",
      value: parseValueWithUnit(safeData.energy_saved, "kWh"),
      color: "#eea92b",
    },
    {
      label: "Crop Health",
      value:
        safeData.crop_health !== "-"
          ? `${Math.abs(parseFloat(String(safeData.crop_health))).toFixed(1)}%`
          : "-",
      color: "#ff5e00",
    },
  ];

  return (
    <Box
      sx={{
        fontFamily: "Poppins",
        backgroundColor: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #E0E0E0",
        outline: "none",
        boxShadow: "none",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          py: 1,
          p: 3,
          backgroundColor: "white",
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 1.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "rgba(0, 18, 25, 0.87)",
          }}
        >
          Live IMPACT Snapshot
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 400,
            lineHeight: "20px",
            letterSpacing: "0.4px",
            color: "rgba(0, 18, 25, 0.6)",
          }}
        >
          Real-time impact overview.
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.12)" }} />

      {/* Body */}
      <Box sx={{ position: 'relative', minHeight: '300px' }}>
        <BlurWrapper isBlurred={!iot} messageType="iot">
          <Box
            sx={{
              p: 3,
              backgroundColor: "white",
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
              flexGrow: 1,
            }}
          >
        {/* Circle with Progress */}
        <Box
          sx={{
            width: 250,
            aspectRatio: "1 / 1",
            borderRadius: "50%",
            background: `conic-gradient(#2196F3 ${percentage}%, #E6E9EC ${percentage}% 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              width: "70%",
              height: "70%",
              borderRadius: "50%",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 1px #F8F9FB inset",
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                textAlign: "center",
                color: "rgba(0, 18, 25, 0.87)",
                lineHeight: "1",
              }}
            >
              {impactScore}
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                textAlign: "center",
                wordWrap: "break-word",
                color: "rgba(0, 18, 25, 0.87)",
                mt: 1,
              }}
            >
              Impact Score
            </Typography>
          </Box>
        </Box>

        {/* Metric List */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: {
              xs: "center",
              md: "flex-start",
            },
            width: "100%",
            mt: { xs: 2, md: 0 },
          }}
        >
          {metrics.map((metric) => (
            <Box
              key={metric.label}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: "100%",
                justifyContent: {
                  xs: "center",
                  md: "flex-start",
                },
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: metric.color,
                  borderRadius: "4px",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 400,
                    color: "rgba(0, 18, 25, 0.6)",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {metric.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(0, 18, 25, 0.87)",
                    letterSpacing: "0.1px",
                    lineHeight: "22px",
                  }}
                >
                  {metric.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
        </BlurWrapper>
      </Box>
    </Box>
  );
};

export default LiveImpactSnapshot;
