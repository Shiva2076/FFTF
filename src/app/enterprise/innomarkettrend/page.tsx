// src/app/enterprise/innomarkettrend/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Alert,
  AlertTitle,
  Button,
  IconButton,
  Slide,
  Typography,
} from "@mui/material";
import { FaRocket, FaTimes, FaArrowRight, FaDownload } from "react-icons/fa";

// Import the shared Content component from the public markettrend route
import Content from "../../markettrend/page";

export default function EnterpriseInnoMarketTrendPage() {
  const router = useRouter();
  const openReportModalRef = useRef<(() => void) | null>(null);

  // ─── Banner (one-time per session teaser) ────────────────────────────────
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if banner was already dismissed in this browser session
    const dismissed = sessionStorage.getItem(
      "enterprise-intelligence-banner-dismissed"
    );

    if (!dismissed) {
      // Show banner after short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissBanner = () => {
    setShowBanner(false);
    // Remember dismissal for this session
    sessionStorage.setItem("enterprise-intelligence-banner-dismissed", "true");
  };

  // ─── Navigation to activation / enterprise intelligence page ─────────────
  const goToEnterpriseActivation = () => {
    router.push("/enterprise/activation");
  };

  // ─── Open download crop summary modal ───────────────────────────────────
  const handleOpenDownloadModal = () => {
    if (openReportModalRef.current) {
      openReportModalRef.current();
    }
  };

  return (
    <>
      {/* ─── Promotional Banner (shows once per session) ───────────────────── */}
      <Slide direction="down" in={showBanner} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            top: { xs: 60, md: 70 },
            left: { xs: 8, md: "50%" },
             right: { xs: 8, md: "auto" },
             transform: { xs: "none", md: "translateX(-50%)" },
            zIndex: 1200,
            maxWidth: { xs: "100%", md: 600 },
             width: { xs: "calc(100% - 16px)", md: "auto" },
          }}
        >
          <Alert
            severity="info"
            icon={<FaRocket color="#ff5e00" size={28} />}
            sx={{
              backgroundColor: "#ffffff",
              border: "2px solid #ff5e00",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.20)",
              "& .MuiAlert-message": { width: "100%" },
            }}
            action={
              <IconButton
                size="small"
                onClick={handleDismissBanner}
                sx={{
                  color: "text.secondary",
                }}
              >
                <FaTimes />
              </IconButton>
            }
          >
            <AlertTitle
              sx={{
                fontWeight: 700,
                color: "#ff5e00",
                mb: 0.75,
               
              }}
            >
              Unlock Enterprise Intelligence
            </AlertTitle>

            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                color: "text.secondary",
                
              }}
            >
              Connect supplier farms • real-time supply visibility • risk alerts •
              advanced demand forecasting.
            </Typography>

            <Button
              variant="contained"
              size="small"
              onClick={goToEnterpriseActivation}
              endIcon={<FaArrowRight />}
              sx={{
                backgroundColor: "#ff5e00",
                "&:hover": { backgroundColor: "#e65000" },
                fontWeight: 600,
                textTransform: "none",
                px: 3,
                py: 1,
              }}
            >
              Get Started Free
            </Button>
          </Alert>
        </Box>
      </Slide>

      {/* ─── Download Crop Summary Floating Action Button ─────────────────── */}
      <Box
        onClick={handleOpenDownloadModal}
        sx={{
          position: "fixed",
          bottom: { xs: 80, md: 88 }, // Positioned above the rocket button
          right: { xs: 16, md: 24 },
          zIndex: 1100,
          backgroundColor: "#008756",
          color: "#ffffff",
          borderRadius: { xs: "50%", md: 50 },
          padding: { xs: 1.5, md: "12px 20px" },
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0, 135, 86, 0.4)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 6px 24px rgba(0, 135, 86, 0.5)",
            backgroundColor: "#009966",
          },
          "&:active": {
            transform: "scale(0.94)",
          },
        }}
      >
        <FaDownload size={20} />
      </Box>

      {/* Optional: tooltip label for download button on desktop */}
      {/* <Box
        sx={{
          position: "fixed",
          bottom: { xs: "unset", md: 88 },
          right: { xs: "unset", md: 96 },
          zIndex: 1290,
          backgroundColor: "rgba(15,15,15,0.88)",
          color: "#ffffff",
          px: 2,
          py: 0.8,
          borderRadius: 16,
          fontSize: "0.82rem",
          fontWeight: 500,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
        }}
      >
        Download Market Demand Snapshot
      </Box> */}

      {/* ─── Always-visible Floating Action Button ─────────────────────────── */}
      <Box
        onClick={goToEnterpriseActivation}
        sx={{
          position: "fixed",
          bottom: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          zIndex: 1100,
          backgroundColor: "#ff5e00",
          color: "#ffffff",
          borderRadius:  { xs: "50%", md: 50 },
         padding: { xs: 1.5, md: "12px 20px" },
          display: "flex",
          alignItems: "center",
          gap:1,
         
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(255, 94, 0, 0.4)",
           transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 6px 24px rgba(255, 94, 0, 0.5)",
            backgroundColor: "#ff6e1a",
          },
          "&:active": {
            transform: "scale(0.94)",
          },
        }}
      >
        <FaRocket size={20} />
      </Box>

      {/* Optional: small tooltip-like label on desktop */}
      {/* <Box
        sx={{
          position: "fixed",
          bottom: { xs: "unset", md: 24 },
          right: { xs: "unset", md: 96 }, // Positioned just to the left of rocket icon (24px right + ~60px button width + 12px spacing)
          zIndex: 1290,
          backgroundColor: "rgba(15,15,15,0.88)",
          color: "#ffffff",
          px: 2,
          py: 0.8,
          borderRadius: 16,
          fontSize: "0.82rem",
          fontWeight: 500,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
        }}
      >
        Enterprise Intelligence
      </Box> */}

      {/* ─── Main shared market trend content ──────────────────────────────── */}
      <Content enableReportModal={true} onOpenReportModalRef={openReportModalRef} />
    </>
  );
}