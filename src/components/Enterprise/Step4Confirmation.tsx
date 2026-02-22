"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { useGetActivationStatusQuery } from "@/app/slices/enterpriseApiSlice";
import ActivationStatusBar from "./ActivationStatusBar";

interface Props {
  activationId: string;
  activationMethod: string | null;
  onReset: () => void;
  onActivationComplete?: () => void;
}

export default function Step4Confirmation({
  activationId,
  activationMethod,
  onReset,
  onActivationComplete,
}: Props) {
  // ────────────────────────────────────────────────
  // ALL HOOKS MUST COME FIRST – no returns before this
  // ────────────────────────────────────────────────
  const { data, isLoading, error, refetch } = useGetActivationStatusQuery(activationId, {
    pollingInterval: 15000,
  });

  const activation = data?.data;

  // Auto-complete effect – always called
  React.useEffect(() => {
    if (activation && ["invitations_sent", "pilot_requested", "completed"].includes(activation.status)) {
      onActivationComplete?.();
    }
  }, [activation?.status, onActivationComplete]);

  // ────────────────────────────────────────────────
  // Now safe to do conditional rendering / early returns
  // ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !activation) {
    return (
      <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
        Failed to load activation status. Please try refreshing the page.
      </Alert>
    );
  }

  const isAssistedPilot = activationMethod === "AssistedPilot";

  const getCurrentStatus = (): "completed" | "review" | "starting" => {
    const status = activation.status?.toLowerCase() || "";
    if (status === "completed" || status === "invitations_sent") {
      return "completed";
    }
    if (status.includes("review") || status.includes("processing")) {
      return "review";
    }
    return "starting";
  };

  const currentStatus = getCurrentStatus();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 3,
        maxWidth: 880,
        mx: "auto",
        background: "linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Box
          sx={{
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            color: "#4caf50",
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        >
          STEP 4 OF 4 - COMPLETE ✓
        </Box>
      </Box>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <CheckCircleIcon sx={{ fontSize: 90, color: "success.main", mb: 2 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isAssistedPilot ? "Pilot Request Submitted!" : "Activation Submitted Successfully!"}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 620, mx: "auto" }}>
          {isAssistedPilot
            ? "Our team will contact you shortly to set up your assisted pilot program."
            : "Your farm invitations have been prepared. Farms will receive instructions soon."}
        </Typography>
      </Box>

      <ActivationStatusBar activation={activation} />
      {currentStatus === "starting" && (
        <Box sx={{ mt: 5, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            You can safely close this page. We'll notify you when your setup is ready.
          </Typography>
        </Box>
      )}

    </Paper>
  );
}