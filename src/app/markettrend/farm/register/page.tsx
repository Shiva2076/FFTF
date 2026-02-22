"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Paper } from "@mui/material";
import Image from "next/image";
import { NextPage } from "next";

const allSteps = ["SUBMITTED", "REPRESENTATIVE CALL", "PROPOSED FARM DETAILS", "PROPOSED SUBSCRIPTION DETAILS", "WORK IN PROGRESS", "SETUP DONE"];

const getStepsWithStatus = (status: string) => {
  const currentIndex = allSteps.indexOf(status.toUpperCase());
  return allSteps.map((step, idx) => ({
    step,
    active: idx <= currentIndex,
  }));
};

const FarmRegisterSuccess: NextPage = () => {
  const router = useRouter();
  const [farm, setFarm] = useState<any>(null);
  const [steps, setSteps] = useState<{ step: string; active: boolean }[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedFarm");
    if (stored) {
      try {
        // parse the raw farm object
        const parsed = JSON.parse(stored);
        setFarm(parsed);

        // If there's no status yet, treat it as SUBMITTED
        const stepsWithStatus = getStepsWithStatus(parsed.status || "SUBMITTED");
        setSteps(stepsWithStatus);
      } catch (e) {
        console.error("Failed to parse farm from sessionStorage", e);
      }
    }
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 8,
        fontFamily: "Poppins",
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="#008756" mb={1} textAlign="center">
        Your Farm Registration is in Progress
      </Typography>

      <Typography variant="body2" textAlign="center" color="rgba(0, 0, 0, 0.6)" mb={4}>
        Our team is reviewing your submission. You’ll be notified at each stage of the process.
      </Typography>

      {/* Stepper */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={6}
        sx={{ width: "100%", maxWidth: 1100, px: 2 }}
      >
        {steps.map(({ step, active }, idx) => (
          <Box
            key={step}
            sx={{
              flex: 1,
              textAlign: "center",
              position: "relative",
              '&::after': idx < steps.length - 1 ? {
                content: '""',
                position: "absolute",
                top: "12px", // center aligned with circle (24px / 2)
                left: "calc(50% + 16px)", // start a little after the circle
                width: "calc(100% - 32px)", // stop a little before next circle
                
                height: "2px",
                borderTop: "2px dotted #ccc",
                zIndex: 0,
              } : {},
            }}
          >
            {/* Circle with Dot */}
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: `2px solid ${active ? "#ff5e00" : "#ccc"}`,
                backgroundColor: "#fff",
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: active ? "#ff5e00" : "#ccc",
                }}
              />
            </Box>
            {/* Step Name */}
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  display: "block",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  fontSize: "0.65rem",
                  color: active ? "#ff5e00" : "rgba(0, 0, 0, 0.4)",
                  maxWidth: 100,
                  mx: "auto",
                }}
              >
                {step}
              </Typography>
          </Box>
        ))}
      </Box>

      {/* Farm Info */}
      <Paper
        sx={{
          width: "26rem",
          borderRadius: 1,
          backgroundColor: "#f7f7f7",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          p: 3,
          textAlign: "left",
          mb: 4,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {farm?.farm_name || "Farm Name"}
        </Typography>
        <Typography variant="body2" color="rgba(0, 18, 25, 0.6)" mb={2}>
          {farm ? `${farm.country} (${farm.state}, ${farm.city})` : "Location Unknown"}
        </Typography>

        {/* Or display more fields if you have them */}
        <Typography variant="body2" color="rgba(0, 18, 25, 0.6)">
          Status: {farm?.status || "SUBMITTED"}
        </Typography>
      </Paper>

      <Button
        onClick={() => router.push("/markettrend")}
        variant="contained"
        sx={{
          backgroundColor: "#ff5e00",
          color: "#fff",
          textTransform: "uppercase",
          fontWeight: 600,
          px: 4,
          py: 1.2,
          borderRadius: 1,
          letterSpacing: "0.6px",
          "&:hover": { backgroundColor: "#e65500" },
        }}
      >
        Back to Market Trend
      </Button>
    </Box>
  );
};

export default FarmRegisterSuccess;
