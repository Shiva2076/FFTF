"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
type CustomTooltipProps = {
  active?: boolean;
  payload?: any;
  label?: string;
};
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          padding: "1rem",
          borderRadius: "4px",
          fontSize: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Typography sx={{ fontSize: "0.65rem" }}>
          {`${payload[0].name} : ${payload[0].value}%`}
        </Typography>
      </Box>
    );
  }

  return null;
};

export default CustomTooltip;
