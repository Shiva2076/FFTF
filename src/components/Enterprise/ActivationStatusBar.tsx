// components/ActivationStatusBar.tsx
"use client";

import React from "react";
import { Box, Typography, useMediaQuery, useTheme, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface ActivationStatusBarProps {
  activation: {
    status: string;
    enterprise_name?: string;
    created_at?: string;
  };
}

const STATUS_MAPPING = {
  draft: 0,
  details_added: 0,
  method_selected: 0,
  farms_added: 0,
  invitations_sent: 1,
  pilot_requested: 1,
  completed: 2,
} as const;

export default function ActivationStatusBar({ activation }: ActivationStatusBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const currentStatus = activation?.status || "draft";
  const activeStep = STATUS_MAPPING[currentStatus as keyof typeof STATUS_MAPPING] ?? 0;

  const steps = [
    { label: "Sign Up Completed" },
    { label: "Activation in Progress" },
    { label: "Completed" },
  ];

  const startedDate = activation?.created_at
    ? new Date(activation.created_at).toLocaleDateString("en-GB")
    : "23/01/2026"; // fallback as in your example

  const enterpriseName = activation?.enterprise_name || "Enterprise Supply Intelligence";

  return (
    <Box sx={{ width: "100%", py: 5, px: { xs: 2, sm: 4 }, textAlign: "center" }}>
      {/* Header with enterprise name and start date */}
     

      {/* Status Bar */}
      
      {/* Main content */}
      <Box sx={{ maxWidth: 680, mx: "auto", mb: 5 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          You've initiated activation for <strong>Enterprise Supply Intelligence</strong>.
        </Typography>

        <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mt: 3 }}>
          What happens next:
        </Typography>

        <Box component="ul" sx={{ textAlign: "left", pl: 4, mb: 4 }}>
          <Typography component="li">
            Supplier farms receive secure invitations
          </Typography>
          <Typography component="li" sx={{ mt: 1 }}>
            Once farms connect, we:
          </Typography>
          <Box component="ul" sx={{ pl: 4 }}>
            <Typography component="li">Map crop cycles & readiness timelines</Typography>
            <Typography component="li">Surface supply risk & deviation signals</Typography>
            <Typography component="li">Enable traceability & impact views</Typography>
          </Box>
        </Box>
      </Box>
<Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 760,
          mx: "auto",
          my: 6,
        }}
      >
        {/* Gray background line */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: { xs: "32px", sm: "42px" },
            right: { xs: "32px", sm: "42px" },
            height: 4,
            backgroundColor: "#e0e0e0",
            borderRadius: 2,
            zIndex: 0,
            transform: "translateY(-50%)",
          }}
        />

        {/* Green progress line */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: { xs: "32px", sm: "42px" },
            height: 4,
            background: "linear-gradient(to right, #4caf50, #81c784)",
            borderRadius: 2,
            zIndex: 1,
            transform: "translateY(-50%)",
            width:
              activeStep === 0
                ? 0
                : `calc(${(activeStep / (steps.length - 1)) * 100}% - ${isMobile ? "64px" : "84px"})`,
            transition: "width 0.6s ease",
          }}
        />

        {/* Steps */}
        {steps.map((step, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              position: "relative",
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                width: isMobile ? 64 : 84,
                height: isMobile ? 64 : 84,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: index <= activeStep ? "#4caf50" : "#ffffff",
                border: `8px solid ${index <= activeStep ? "#2e7d32" : "#e0e0e0"}`,
                boxShadow:
                  index === activeStep
                    ? "0 0 0 10px rgba(76, 175, 80, 0.25)"
                    : "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.4s ease",
              }}
            >
              {index <= activeStep ? (
                <CheckCircleIcon sx={{ fontSize: isMobile ? 42 : 52, color: "white" }} />
              ) : (
                <RadioButtonUncheckedIcon sx={{ fontSize: isMobile ? 42 : 52, color: "#9e9e9e" }} />
              )}
            </Box>
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                fontWeight: index <= activeStep ? 700 : 500,
                color: index <= activeStep ? "#1b5e20" : "#616161",
                maxWidth: 140,
                lineHeight: 1.3,
                fontSize: isMobile ? "0.8rem" : "0.9rem",
              }}
            >
              {step.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* CTA Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          gap: 3,
          mb: 4,
        }}
      >
        <Button
          variant="contained"
          color="success"
          size="large"
          href="https://calendly.com/brajendra-yadav-innofarms/30min?month=2026-01"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ px: 4, py: 1.5 }}
        >
          BOOK A 30 MIN ACTIVATION CALL
        </Button>

        <Button
          variant="outlined"
          size="large"
          href="https://innofarms.ai/apps/enterprise/innomarkettrend"
          sx={{ px: 4, py: 1.5 }}
        >
          ← RETURN TO MARKET INTELLIGENCE DASHBOARD
        </Button>
      </Box>

      {/* Footer note */}
      <Typography variant="body2" color="text.secondary">
        Questions? Reach out during the email{" "}
        <a href="mailto:business@innofarms.ai">business@innofarms.ai</a>
      </Typography>
    </Box>
  );
}