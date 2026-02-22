"use client";

import { FC, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import _ from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useParams } from "next/navigation";

interface ConditionsProps {
  cropName: string;
  cropVariety: string;
}

export const Conditions: FC<ConditionsProps> = ({ cropName, cropVariety }) => {
  const params = useParams();
  const slug = params?.id as string;

  // Check if the crop type is microgreens
  const isMicrogreens = useMemo(() => {
    if (!slug) return false;
    const parts = slug.split("-");
    const crop_type = parts[2];
    return crop_type?.toLowerCase().replace(/_/g, "-") === "microgreens";
  }, [slug]);

  const growingConditions = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropSummary.data
  );

  const selectedCropData = useMemo(() => {
    return growingConditions?.find((entry: any) => {
      return (
        entry.cropName?.toLowerCase().trim() === cropName?.toLowerCase().trim()
      );
    });
  }, [cropName, growingConditions]);

  if (!selectedCropData) return null;

  const conditionsData = [
    {
      label: "Temperature",
      value: selectedCropData?.temperatureRange ?? '-',
      bgColor: "#008756",
      icon: "/apps/temperature.svg",
    },
    {
      label: "Watering",
      value: _.capitalize(selectedCropData?.watering ?? '-'),
      bgColor: "#81b462",
      icon: "/apps/watering.svg",
    },
    {
      label: "Light Intensity",
      value: selectedCropData?.lightIntensity ?? '-',
      bgColor: "#c8d04f",
      icon: "/apps/lightintensity.svg",
    },
    {
      label: "Nutrition",
      value: _.capitalize(selectedCropData?.nutrition ?? '-'),
      bgColor: "#eea92b",
      icon: "/apps/nutrition.svg",
      showForMicrogreens: false, // Hide this for microgreens
    },
    {
      label: "Humidity",
      value: selectedCropData?.humidityRange ?? '-',
      bgColor: "#ff5e00",
      icon: "/apps/humidity.svg",
    },
  ];

  // Filter out Nutrition card if microgreens
  const filteredConditions = isMicrogreens
    ? conditionsData.filter(item => item.showForMicrogreens !== false)
    : conditionsData;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "space-between",
      }}
    >
      {filteredConditions.map((item, index) => (
        <Box
          key={index}
          sx={{
            flex: "1 1 auto",
            minWidth: "200px", // Increased from 140px
            maxWidth: "300px", // Increased from 240px
            borderRadius: "6px",
            backgroundColor: "#fff",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            p: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Typography
              sx={{
                textTransform: "uppercase",
                fontSize: "0.65rem",
                letterSpacing: "1px",
                color: "#444",
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "rgba(0, 18, 25, 0.87)",
              }}
            >
              {item.value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: "2rem",
              height: "2rem",
              borderRadius: "6px",
              backgroundColor: item.bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={16}
              height={16}
              style={{ width: "1rem", height: "1rem", objectFit: "contain" }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};