"use client";

import { FC, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

interface CropGrowthTimelineProps {
  cropName: string;
  cropVariety: string;
}

const COLORS = [
  "#008756", "#4CAF50", "#81C784", "#FBE7A1",
  "#F9C851", "#FFA726", "#FB8C00", "#F4511E",
];

const totalWeeks = 13;
const daysPerWeek = 7;

export const CropGrowthTimeline: FC<CropGrowthTimelineProps> = ({
  cropName,
  cropVariety,
}) => {
  const {title,description, duration} = useSelector((state:RootState)=>state.cropGrowingGuide.data?.cropGrowthTimeline || {title:"",description:""});
  const growthTimelineList = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropGrowthTimeline.data
  );

  const timelineData = useMemo(() => {
    return growthTimelineList?.find(
      (entry: any) =>
        entry.cropName?.toLowerCase().trim() === cropName.toLowerCase().trim() 
    )?.timeline;
  }, [cropName, growthTimelineList]);

  if (!timelineData || !growthTimelineList || timelineData.length === 0) {
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
        No growth timeline data available for this crop.
      </Box>
    );
  }

  const getWeekRange = (startDay: number, endDay: number) => {
    const startWeek = Math.floor(startDay / daysPerWeek);
    const endWeek = Math.ceil(endDay / daysPerWeek);
    return [startWeek, endWeek];
  };

  return (
    <Box
      sx={{
        borderRadius: "4px",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        color: "rgba(0, 18, 25, 0.87)",
        border: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* Header */}
      <Box sx={{ padding: "1.5rem", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
        <Typography sx={{ fontWeight: 600, fontSize: "1rem", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "rgba(0, 18, 25, 0.6)" }}>
          {description}
        </Typography>
      </Box>

      {/* Table Layout */}
      <Box sx={{ display: "flex" }}>
        {/* Left Column (Stage Names) */}
        <Box sx={{ width: "220px", borderRight: "1px solid #d1d9e2" }}>
          <Box sx={{ height: "2.5rem", borderBottom: "1px solid rgba(0,0,0,0.12)" }} />
          {timelineData.map((item: any, idx: number) => (
            <Box
              key={idx}
              sx={{
                height: "2.5rem",
                borderBottom: "1px solid rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                px: "1rem",
                fontSize: "0.875rem",
              }}
            >
              {item?.stage}
            </Box>
          ))}
        </Box>

        {/* Right Grid (Timeline Weeks) */}
        <Box sx={{ flex: 1, overflowX: "auto" }}>
          {/* Week Header Row */}
          <Box sx={{ display: "flex", height: "2.5rem" }}>
            {Array.from({ length: totalWeeks }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  flex: "0 0 60px",
                  minWidth: "60px",
                  borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  color: "rgba(0, 18, 25, 0.6)",
                }}
              >
                W{i + 1}
              </Box>
            ))}
          </Box>

          {/* Stage Rows */}
          {timelineData?.map((item: any, idx: number) => {
            const [startWeek, endWeek] = getWeekRange(item.startDay, item.endDay);
            return (
              <Box key={idx} sx={{ display: "flex", height: "2.5rem" }}>
                {Array.from({ length: totalWeeks }).map((_, weekIndex) => {
                  const isActive = weekIndex >= startWeek && weekIndex < endWeek;
                  return (
                    <Box
                      key={weekIndex}
                      sx={{
                        flex: "0 0 60px",
                        minWidth: "60px",
                        borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                        backgroundColor: isActive ? COLORS[idx % COLORS.length] : "transparent",
                      }}
                    />
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
