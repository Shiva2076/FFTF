"use client";
import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        position: "relative",
        top: 0,
        left: 0,
        zIndex: 10,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        // alignItems: "center",
      }}
    >
      <CircularProgress size={110} thickness={1.5} sx={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#e65000" }} />
    </Box>
  );
};

export default LoadingSpinner;
