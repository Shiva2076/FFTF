"use client";
import { FC, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Image from "next/image";

const iconBgMap: Record<
  string,
  { icon: string; bg: string }
> = {
  water_efficiency:   { icon: "/apps/waterefficiency.svg",  bg: "#008756" },
  light_efficiency:   { icon: "/apps/soilhealth.svg",      bg: "#66bb6a" },
  carbon_footprint:   { icon: "/apps/carbonfootprint.svg", bg: "#d4e157" },
  biodiversity_impact:{ icon: "/apps/biodiversityimpact.svg", bg: "#ffa726" },
  waste_management:   { icon: "/apps/wastemanangement.svg", bg: "#ef5350" },
};

type SustainabilityMetric = {
  key: keyof typeof iconBgMap;
  metric: string;
  description: string;
};

interface Props {
  cropName: string;
  cropVariety: string;
}

export const SustainabilityScorecard: FC<Props> = ({ cropName, cropVariety }) => {
  // Fix the selector - access the correct path
  const sustainabilityData = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropSustainability || {
      title: "",
      description: "",
      duration: "",
      metrics: [],
      data: []
    }
  );

  const selectedCrop = useMemo(() => {
    return sustainabilityData?.data?.find(
      (e: any) => e.crop?.toLowerCase().trim() === cropName.toLowerCase().trim()
    );
  }, [cropName, sustainabilityData]);

  // Handle case where data is not available
  if (!sustainabilityData || !sustainabilityData.metrics || !selectedCrop) {
    return (
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: "4px 4px 0 0",
            p: "1.25rem",
            backgroundColor: "#fff",
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>
            Sustainability Scorecard
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "rgba(0,18,25,0.6)", mt: 0.5 }}>
            Environmental impact metrics for this crop
          </Typography>
        </Box>
        <Box
          sx={{
            border: "1px solid rgba(0,0,0,0.12)",
            borderTop: "none",
            borderRadius: "0 0 4px 4px",
            p: "2rem",
            backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <Typography>No sustainability data available for {cropName} {cropVariety}</Typography>
        </Box>
      </Box>
    );
  }

  const { title, description, metrics } = sustainabilityData;

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: "4px 4px 0 0",
          p: "1.25rem",
          backgroundColor: "#fff",
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "rgba(0,18,25,0.6)", mt: 0.5 }}>
          {description}     
        </Typography>
      </Box>

      <Box
        sx={{
          border: "1px solid rgba(0,0,0,0.12)",
          borderTop: "none",
          borderRadius: "0 0 4px 4px",
          overflow: "hidden",
          p: "1rem",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {metrics.map((m: SustainabilityMetric, idx: number) => {
          const value = selectedCrop[m.key] ?? 0;
          const { icon, bg } = iconBgMap[m.key] ?? {
            icon: "/apps/default.svg",
            bg: "#ccc",
          };

          return (
            <Box
              key={idx}
              sx={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "center",
                border: "1px solid rgba(0,0,0,0.12)",
                backgroundColor: "#f9f9f9",
                p: "0.75rem",
                borderRadius: "6px",
              }}
            >
              <Box
                sx={{
                  width: "2.25rem",
                  height: "2.25rem",
                  backgroundColor: bg,
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image src={icon} alt={m.metric} width={18} height={18} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
                  {m.metric}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.7rem", color: "rgba(0,18,25,0.6)", mt: "2px" }}
                >
                  {m.description}
                </Typography>
              </Box>

              <Box
                sx={{
                  position: "relative",
                  width: "3.5rem",
                  height: "3.5rem",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: `conic-gradient(${bg} ${value * 36}deg, #eee 0deg)`,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    width: "2.5rem",
                    height: "2.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 2px rgba(0,0,0,0.1)",
                    fontSize: "0.65rem",
                  }}
                >
                  {value}/10
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};