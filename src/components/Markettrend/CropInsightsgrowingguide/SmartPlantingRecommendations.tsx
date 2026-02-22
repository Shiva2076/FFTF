"use client";

import { FC, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

interface SmartPlantingRecommendationsProps {
  cropName: string;
  cropVariety: string;
}

const iconMap: { [key: string]: { icon: string; bgColor: string } } = {
  "Temperature & Humidity": {
    icon: "/apps/temperaturehumidity.svg",
    bgColor: "#008756",
  },
  "Lighting & Photoperiod": {
    icon: "/apps/lightingphotoperiod.svg",
    bgColor: "#81b462",
  },
  "Water & Nutrient Management": {
    icon: "/apps/waternutrientmanagement.svg",
    bgColor: "#c8d04f",
  },
  "Growth Stages & Cycle Timing": {
    icon: "/apps/growthstagescycletiming.svg",
    bgColor: "#eea92b",
  },
  "Common Issues & Prevention": {
    icon: "/apps/commonissuesprevention.svg",
    bgColor: "#ff5e00",
  },
};

export const SmartPlantingRecommendations: FC<SmartPlantingRecommendationsProps> = ({
  cropName,
  cropVariety,
}) => {
  const {title,description, duration} = useSelector((state:RootState)=>state.cropGrowingGuide.data?.cropSmartRecommendations || {title:"",description:""});
  const recommendationsList = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropSmartRecommendations.data
  );

  const recommendations = useMemo(() => {
    return recommendationsList?.find(
      (entry: any) =>
        entry.cropName?.toLowerCase().trim() === cropName.toLowerCase().trim()
    )?.recommendations;
  }, [cropName, recommendationsList]);

  if (!recommendations || !recommendationsList|| recommendations.length === 0) {
    return (
      <Box
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "4px", 
          backgroundColor: "#fff",
          p: 2,
          textAlign: "center",
          fontSize: "0.875rem",
          color: "rgba(0,0,0,0.6)",
        }}
      >
        No smart planting recommendations available for this crop.
      </Box>
    );
  }

  return (
    <Box
      sx={{
        alignSelf: "stretch",
        display: "flex",
        flexDirection: "column",
        gap: "0rem",
        height: "400px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderRadius: "4px 4px 0px 0px",
          backgroundColor: "#fff",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          px: "1.5rem",
          py: "1.25rem",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <Typography sx={{ fontWeight: 600, letterSpacing: "0.15px", lineHeight: "200%" }}>
            {title}
          </Typography>
          <Typography
            sx={{ fontSize: "0.75rem", color: "rgba(0, 18, 25, 0.6)", letterSpacing: "0.4px" }}
          >
           {description}
          </Typography>
        </Box>
      </Box>

      {/* Recommendation Cards */}
      <Box
        sx={{
          borderRadius: "0px 0px 4px 4px",
          backgroundColor: "#fff",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          p: "1rem",
        }}
      >
        {recommendations.map((item: any, index: number) => {
          const iconInfo = iconMap[item.card] || {
            icon: "/default.svg",
            bgColor: "#ccc",
          };

          return (
            <Box
              key={index}
              sx={{
                borderRadius: "4px",
                backgroundColor: "rgba(0, 18, 25, 0.04)",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                p: "0.97rem",
              }}
            >
              <Box
                sx={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "4px",
                  backgroundColor: iconInfo.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={iconInfo.icon}
                  alt={item.card}
                  width={22}
                  height={22}
                  style={{
                    objectFit: "contain",
                    width: "1.5rem",
                    height: "1.5rem",
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Typography sx={{ fontWeight: 500, letterSpacing: "0.1px" }}>
                  {item.card}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "rgba(0, 18, 25, 0.6)",
                    letterSpacing: "0.4px",
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
