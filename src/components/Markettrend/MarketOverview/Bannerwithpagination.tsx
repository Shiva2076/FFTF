"use client";
import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import FarmRegisterModal from "@/components/Markettrend/Farm/FarmRegister";
import MarketTrendSubscribe from '@/components/Markettrend/MarketTrendSubscribe';
import Head from "next/head";
import { useSelector } from 'react-redux';
import { RootState } from "@/app/store";

const BannerPaginationCombined: NextPage = () => {
  const [openFarmModal, setOpenFarmModal] = useState(false);
  const [openMarketTrendModal, setOpenMarketTrendModal] = useState(false);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const handleFarmSubmit = (data: any) => {
    console.log("Farm submitted:", data);
  };
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if ((window as any).Calendly) {
        setCalendlyLoaded(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval); 
  }, []);

  const rawBanners = [
    {
      id: "accessbanner",
      title: "Boost Your Farm’s Success with INNOMarketTrend!",
      paragraphs: [
        "Stay ahead with INNOMarketTrend! Get 6-month market forecasts,",
        "AI-driven crop recommendations, and real-time alerts to optimize your farm.",
      ],
      buttonLabel: "Get Full Access",
      background: "url('/apps/desktopbanner1.webp')",
      backgroundSize: "auto 100%, auto 100%",
      backgroundPosition: "left center, right center",
      backgroundRepeat: "no-repeat",
    },
    {
      id: "farmregistrationbanner",
      title: "Power Up Your Farm with FarmXOS!",
      paragraphs: [
        "FarmXOS is your AI-powered OS for smarter, more efficient vertical farming. Get real-time insights, automate control, and optimize growth. Register today!",
      ],
      buttonLabel: "Register Your Farm",
      background: "url('/apps/desktopbanner2.webp')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    {
      id: "requestdemobanner",
      title: "Experience AI-Powered Farming",
      paragraphs: [
        "See how INNOFarms.AI can optimize your vertical farm with smart automation, real-time monitoring, and AI-driven insights. Request a demo today and take your farm to the next level!",
      ],
      buttonLabel: "Request Demo",
      background: "url('/apps/desktopbanner3.webp')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
  ];

  const bannerStyles = [
    {
      id: "accessbanner",
      title: {
        letterSpacing: "0.3px",
        lineHeight: "130%",
        fontWeight: "bold",
        fontSize: "2rem",
        color: "#FFF",
      },
      paragraph: {
        fontSize: "1rem",
        letterSpacing: "0.2px",
        lineHeight: "1.6rem",
        color: "#FFF",
      },
      button: {
        backgroundColor: "#FF5733",
        color: "#FFF",
        "&:hover": { backgroundColor: "#FF4500" },
      },
    },
    {
      id: "farmregistrationbanner",
      title: {
        letterSpacing: "0.3px",
        lineHeight: "130%",
        fontWeight: "bold",
        fontSize: "2rem",
        color: "#ffffff",
        textAlign: "left",
      },
      paragraph: {
        fontSize: "1rem",
        letterSpacing: "0.2px",
        lineHeight: "1.6rem",
        color: "#ffffff",
        textAlign: "left",
        maxWidth: "75%",
      },
      button: {
        backgroundColor: "#FF5733",
        color: "#FFF",
        "&:hover": { backgroundColor: "#FF4500" },
      },
    },
    {
      id: "requestdemobanner",
      title: {
        letterSpacing: "0.2px",
        lineHeight: "120%",
        fontWeight: "bold",
        fontSize: "2.3rem",
        color: "#FFF",
      },
      paragraph: {
        fontSize: "1rem",
        letterSpacing: "0.1px",
        lineHeight: "1.5rem",
        color: "#FFF",
      },
      button: {
        backgroundColor: "#FF5733",
        color: "#FFF",
        "&:hover": { backgroundColor: "#FF4500" },
      },
    },
  ];

  const banners = rawBanners.filter(
    (banner) => !(banner.id === "accessbanner" && userInfo?.markettrendsubscribed === true)
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    if (currentIndex >= banners.length) setCurrentIndex(0);
  }, [banners.length, currentIndex]);

  const handleDotClick = (index: number) => setCurrentIndex(index);

  const currentBanner = banners[currentIndex];
  const isLeftAligned = currentBanner?.id === "farmregistrationbanner";
  const currentStyle = bannerStyles.find((style) => style.id === currentBanner?.id);

  if (!currentBanner) return null;

  return (
    <Box sx={{ width: "100%", margin: "0 auto", textAlign: "center" }}>
      <Head>
        <link rel="preload" as="image" href="/desktopbanner1.webp" />
        <link rel="preload" as="image" href="/desktopbanner2.webp" />
        <link rel="preload" as="image" href="/desktopbanner3.webp" />
      </Head>

      <Box
        sx={{
          position: "relative",
          borderRadius: "4px",
          background: currentBanner.background,
          backgroundSize: currentBanner.backgroundSize,
          backgroundPosition: currentBanner.backgroundPosition,
          backgroundRepeat: currentBanner.backgroundRepeat,
          height: "14rem",
          maxWidth: "65rem",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: isLeftAligned ? "flex-start" : "center",
          justifyContent: "center",
          gap: "1.5rem",
          paddingLeft: isLeftAligned ? "1rem" : "4px",
          paddingRight: "10px",
          boxSizing: "border-box",
          color: "#fff",
          fontFamily: "Poppins",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            ...(currentStyle?.title || {}),
            textAlign: isLeftAligned ? "left" : "center",
          }}
        >
          {currentBanner.title}
        </Typography>

        <Box
          sx={{
            maxWidth: "50rem",
            margin: isLeftAligned ? "0 auto 0 0rem" : "0 auto",
            textAlign: isLeftAligned ? "left" : "center",
            alignSelf: isLeftAligned ? "flex-start" : "center",
          }}
        >
          {currentBanner.paragraphs.map((text, idx) => (
            <Typography
              key={idx}
              component="p"
              sx={{
                ...(currentStyle?.paragraph || {}),
                textAlign: isLeftAligned ? "left" : "center",
              }}
            >
              {text}
            </Typography>
          ))}
        </Box>

        <Button
          sx={{
            boxShadow:
              "0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
            borderRadius: "4px",
            padding: "4px 10px",
            fontSize: "0.9rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.46px",
            ...(currentStyle?.button || {}),
          }}
          onClick={() => {
            const label = currentBanner.buttonLabel;
            if (label === "Register Your Farm") setOpenFarmModal(true);
            else if (label === "Get Full Access") setOpenMarketTrendModal(true);
            else if (label === "Request Demo") {
              if ((window as any).Calendly) {
                (window as any).Calendly.initPopupWidget({
                  url: "https://calendly.com/innofarmsai89/30min",
                });
              } else {
                console.warn("Calendly widget not ready yet.");
              }
            }}
          }
        >
          {currentBanner.buttonLabel}
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          marginTop: "1rem",
        }}
      >
        {banners.map((_, index) => (
          <Box
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              width: "0.6rem",
              height: "0.6rem",
              borderRadius: "50%",
              backgroundColor: currentIndex === index ? "#e65000" : "#e0e0e0",
              cursor: "pointer",
            }}
          />
        ))}
      </Box>

      <FarmRegisterModal
        open={openFarmModal}
        onClose={() => setOpenFarmModal(false)}
        onBack={() => setOpenFarmModal(false)}
        onSubmit={handleFarmSubmit}
      />
      <MarketTrendSubscribe
        open={openMarketTrendModal}
        onClose={() => setOpenMarketTrendModal(false)}
      />
    </Box>
  );
};

export default BannerPaginationCombined;
