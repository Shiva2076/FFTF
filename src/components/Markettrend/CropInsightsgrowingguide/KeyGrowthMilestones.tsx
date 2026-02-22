"use client";
import { FC, useMemo, useState } from "react";
import { Box, Typography, Button, List, ListItem } from "@mui/material";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

interface KeyGrowthMilestonesProps {
  cropName: string;
  cropVariety: string;
}

export const KeyGrowthMilestones: FC<KeyGrowthMilestonesProps> = ({
  cropName,
  cropVariety,
}) => {
  const { title, description } = useSelector(
    (state: RootState) =>
      state.cropGrowingGuide.data?.cropKeyMilestones || {
        title: "",
        description: "",
      }
  );

  const milestonesList = useSelector(
    (state: RootState) =>
      state.cropGrowingGuide.data?.cropKeyMilestones.data
  );

  const selectedEntry = useMemo(() => {
    return milestonesList?.find(
      (entry: any) =>
        entry.cropName?.toLowerCase().trim() === cropName.toLowerCase().trim() ||
        entry.crop?.toLowerCase().trim() === cropName.toLowerCase().trim()
    );
  }, [cropName, milestonesList]);

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex < (selectedEntry?.stages?.length || 0) - 1)
      setActiveIndex(activeIndex + 1);
  };

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  if (!selectedEntry) {
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
        No key growth milestones data available for this crop.
      </Box>
    );
  }

  // If it's leafy greens (stages exist)
  if (selectedEntry.stages) {
    const currentMilestone = selectedEntry.stages[activeIndex];
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "39.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <Box
          sx={{
            borderRadius: "4px",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            height: "18.7rem",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
              padding: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Typography sx={{ fontWeight: 600, lineHeight: "200%" }}>
                {title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "rgba(0, 18, 25, 0.6)",
                  letterSpacing: "0.4px",
                }}
              >
                {description}
              </Typography>
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                variant="contained"
                sx={{
                  minWidth: "2rem",
                  borderRadius: "100px",
                  backgroundColor: "#ff5e00",
                  transform: "rotate(180deg)",
                  boxShadow: "none",
                  opacity: activeIndex === 0 ? 0.5 : 1,
                  pointerEvents: activeIndex === 0 ? "none" : "auto",
                  "&:hover": { backgroundColor: "#e65100" },
                }}
              >
                <Image
                  src="/apps/leftarrow.svg"
                  alt="Previous"
                  width={12}
                  height={12}
                  style={{ transform: "rotate(-180deg)" }}
                />
              </Button>
              <Button
                onClick={handleNext}
                disabled={activeIndex === selectedEntry.stages.length - 1}
                variant="contained"
                sx={{
                  minWidth: "2rem",
                  borderRadius: "100px",
                  backgroundColor: "#ff5e00",
                  boxShadow: "none",
                  opacity:
                    activeIndex === selectedEntry.stages.length - 1 ? 0.5 : 1,
                  pointerEvents:
                    activeIndex === selectedEntry.stages.length - 1
                      ? "none"
                      : "auto",
                  "&:hover": { backgroundColor: "#e65100" },
                }}
              >
                <Image src="/apps/rightarrow.svg" alt="Next" width={12} height={12} />
              </Button>
            </Box>
          </Box>

          {/* Current Milestone Display */}
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Box
              sx={{
                backgroundColor: "#f7f7f7",
                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                height: "2.5rem",
                display: "flex",
                alignItems: "center",
                px: "1.5rem",
                fontWeight: 500,
                letterSpacing: "0.1px",
              }}
            >
              {capitalize(currentMilestone?.stage)}
            </Box>
            <Box
              sx={{
                flex: 1,
                backgroundColor: "#fff",
                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                px: "1.5rem",
                py: "1rem",
                fontSize: "0.875rem",
                color: "rgba(0, 18, 25, 0.6)",
              }}
            >
              {currentMilestone?.description}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // If it's microgreens (preventions exist)
  if (selectedEntry.preventions) {
    return (
      <Box
        sx={{
          borderRadius: "4px",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          backgroundColor: "#fff",
          p: "1.5rem",
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 2 }}>{title}</Typography>
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "rgba(0, 18, 25, 0.6)",
            mb: 2,
          }}
        >
          {description}
        </Typography>
        <List dense>
          {selectedEntry.preventions.map((item: string, idx: number) => (
            <ListItem
              key={idx}
              sx={{ fontSize: "0.875rem", color: "rgba(0,0,0,0.7)", py: 0.5 }}
            >
              • {item}
            </ListItem>
          ))}
        </List>
      </Box>
    );
  }

  return null;
};
