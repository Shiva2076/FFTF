"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import TopperformingcropsSubscribe from "@/components/Markettrend/TopperformingSubscribe";
import ProtectedBlurWrapper from "@/components/Markettrend/ProtectedBlurWrapper";
import { formatUnderscoreString } from "@/utils/Capitalize";

interface Crop {
  cropId: number;
  cropName: string;
  variety?: string;
  salesTons?: number;
  pricePerKg: number | { min: number; max: number };
  pricePerPunnet?: number | string;
  priceUnit: string;
  priceChangePercentage: number | string;
  market_band_low?: number;
  market_band_high?: number;
  observed_high?: number;
  observed_low?: number;
}

interface Props {
  data?: {
    title: string;
    description: string;
    duration: string;
    data: Crop[];
  };
};

const TopPerformingCrops: React.FC<Props> = ({ data }) => {
  if (!data || !data.data || data.data.length === 0) {
    return (
      <Box
        sx={{
          width: "88.5%",
          backgroundColor: "#fff",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          padding: "1.5rem",
          borderRadius: "8px",
          textAlign: "center",
          color: "rgba(0,0,0,0.6)",
        }}
      >
        No data available
      </Box>
    );
  }
  const { title, description, duration, data: topPerformingData } = data;
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const selectedCropType = useSelector((state: RootState) => state.selectedCropTypetab);
  const isMicrogreens = selectedCropType?.toLowerCase() === "microgreens";
  const isAuthenticated = Boolean(userInfo?.user_id);
  const ismarkettrendsubscribed = Boolean(userInfo?.markettrendsubscribed);
  const [subscribeFlowOpen, setSubscribeFlowOpen] = useState(false);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);

  const handleSeeMoreClick = () => {
    setShowPriceModal(true);
    setSubscribeFlowOpen(true);
  };

  const handleCloseFlow = () => {
    setSubscribeFlowOpen(false);
  };

  // Safeguard for missing data
  const visibleCrops = topPerformingData;
  const formatTons = (tons: number) => `${tons} Tons`;
  const formatPrice = (price: number | { min: number; max: number }, priceUnit: string) => {
    if (typeof price === 'object' && price !== null && 'min' in price && 'max' in price) {
      // New format: { min, max }
      return `${price.min} - ${price.max} ${priceUnit}`;
    }
    // Old format: single number
    return `${price} ${priceUnit}`;
  };
  const formatChange = (change: number | string) => {
    const numChange = Number(change) || 0;
    return `${numChange > 0 ? "+" : ""}${numChange.toFixed(2)}%`;
  };
  const getChangeColor = (change: number | string) => {
    const numChange = Number(change) || 0;
    return numChange >= 0 ? "#10ab6f" : "#ef5350";
  };
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const getImageSrc = (cropName: string, variety?: string, isMicrogreens?: boolean) => {
    if (isMicrogreens && variety) {
      return `/apps/crop_icons/${cropName.toLowerCase()}_${variety.toLowerCase()}_microgreens.svg`;
    }
    return `/apps/crop_icons/${cropName.toLowerCase()}.svg`;
  };
  const subtitle = description;
  const timeframe = duration;

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          width: "88.5%",
          alignSelf: "stretch",
          backgroundColor: "#fff",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          padding: "1.5rem",
          borderRadius: "8px",
          fontSize: "0.875rem",
          boxShadow: "none",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          height: "34.2rem",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
          }}
        >
          <Box sx={{ fontWeight: 600, fontSize: "1rem" }}>{title}</Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: "0.75rem",
              color: "rgba(0, 18, 25, 0.6)",
            }}
          >
            <Box>{subtitle}</Box>
            <Box sx={{ margin: "0 0.5rem" }}>•</Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Image width={7} height={8} alt=" " aria-hidden="true" src="/apps/Vector.svg" />
              <Box>{timeframe}</Box>
            </Box>
          </Box>
          {/* Divider */}
          <Box
            component="hr"
            sx={{
              border: 0,
              borderTop: "1px solid rgba(0, 0, 0, 0.08)",
              width: "calc(100% + 1rem)",
              marginLeft: "-0.5rem",
              marginTop: "0.25rem",
              marginBottom: "0.1rem",
            }}
          />
          {/* Content */}
          <Box sx={{ display: "flex", flexDirection: "column", position: "relative" }}>
            {/* First 2 crops - always visible */}
            {visibleCrops.slice(0, 2).map((crop, index) => {
              const imageSrc = getImageSrc(crop.cropName, crop.variety, isMicrogreens);
              const changeColor = getChangeColor(crop.priceChangePercentage);
              
              return (
                <Box
                  key={crop.cropId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: "0.5rem",
                    py: index === 0 ? "0.4rem" : "0.6rem",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  {/* Left column: Image */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Image
                      width={48}
                      height={48}
                      alt={crop.cropName}
                      src={imageSrc}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                  </Box>
                  
                  {/* Middle column: Three rows */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, ml: "1rem" }}>
                    {/* Row 1: Crop Name - Variety */}
                    <Link
                      href={`/markettrend/${crop.cropName.toLowerCase()}-${(crop.variety || 'general').toLowerCase()}-${selectedCropType?.toLowerCase().replace(/-/g, "_") || "leafy_greens"}`}
                    >
                      <Typography
                        sx={{ 
                          fontWeight: 600, 
                          textDecoration: "underline", 
                          cursor: "pointer", 
                          color: "#ff5e00",
                          fontSize: "0.875rem",
                          "&:hover": {
                            color: "#e65000"
                          }
                        }}
                      >
                        {isMicrogreens ? capitalizeFirstLetter(crop.cropName) : crop.cropName}{crop.variety ? ` - ${formatUnderscoreString(crop.variety)}` : ''}
                      </Typography>
                    </Link>
                    
                    {/* Row 2: Price (only for Microgreens) */}
                    {isMicrogreens && crop.pricePerPunnet !== undefined && (
                      <Typography sx={{ color: "rgba(0, 18, 25, 0.9)", fontWeight: 500, fontSize: "0.875rem" }}>
                        {typeof crop.pricePerPunnet === 'string' ? crop.pricePerPunnet : crop.pricePerPunnet} {crop.priceUnit}
                      </Typography>
                    )}
                    
                      {/* Row 3: Market Band Width */}
                      {crop.market_band_low !== undefined && crop.market_band_high !== undefined && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <Typography sx={{ color: "#10ab6f", fontWeight: 500, fontSize: "0.75rem" }}>
                            Market Band:
                          </Typography>
                          <Typography sx={{ color: "rgba(0, 18, 25, 0.9)", fontWeight: 600, fontSize: "0.75rem" }}>
                            {crop.market_band_low} - {crop.market_band_high} AED/kg
                          </Typography>
                        </Box>
                      )}
                    
                    {/* Row 4: Observed market Range */}
                    {crop.observed_low !== undefined && crop.observed_high !== undefined && (
                      <Tooltip
                        title={
                          <Box sx={{ p: 1 }}>
                            <Box sx={{ mb: 0.5, fontSize: "0.875rem", fontWeight: 500 }}>
                              Observed Market Low: <Box component="span" sx={{ fontWeight: 600, ml: 0.5 }}>{crop.observed_low} AED/kg</Box>
                            </Box>
                            <Box sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
                              Observed Market High: <Box component="span" sx={{ fontWeight: 600, ml: 0.5 }}>{crop.observed_high} AED/kg</Box>
                            </Box>
                          </Box>
                        }
                        arrow
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: '#fff',
                              color: 'rgba(0, 18, 25, 0.9)',
                              fontSize: '0.875rem',
                              padding: '0.75rem',
                              borderRadius: '8px',
                              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                              border: '1px solid rgba(0, 0, 0, 0.1)',
                            }
                          }
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.25rem 0.5rem",
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            borderRadius: "8px",
                            backgroundColor: "rgba(0, 0, 0, 0.02)",
                            width: "fit-content",
                            cursor: "pointer",
                            "@keyframes blink": {
                              "0%, 100%": { opacity: 1 },
                              "50%": { opacity: 0.3 },
                            },
                            animation: "blink 2s infinite",
                          }}
                        >
                          <Box
                            sx={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "100%",
                              backgroundColor: "#10ab6f",
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              color: "rgba(0, 18, 25, 0.6)",
                            }}
                          >
                            Observed market range
                          </Typography>
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                  
                  {/* Right column: Price change */}
                  <Box
                    sx={{
                      backgroundColor: changeColor,
                      color: "#fff",
                      borderRadius: "1rem",
                      padding: "0.25rem 0.5rem",
                      fontWeight: 500,
                      minWidth: "4.5rem",
                      textAlign: "center",
                      ml: "1rem",
                    }}
                  >
                    {formatChange(crop.priceChangePercentage)}
                  </Box>
                </Box>
              );
            })}
            
            {/* Remaining crops - wrapped with ProtectedBlurWrapper */}
            {visibleCrops.length > 2 && (
              <ProtectedBlurWrapper>
                {visibleCrops.slice(2).map((crop, index) => {
                  const actualIndex = index + 2;
                  const imageSrc = getImageSrc(crop.cropName, crop.variety, isMicrogreens);
                  const changeColor = getChangeColor(crop.priceChangePercentage);
                  
                  return (
                    <Box
                      key={crop.cropId}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: "0.5rem",
                        py: actualIndex === visibleCrops.length - 1 ? "0.5rem" : "0.6rem",
                        borderBottom:
                          actualIndex !== visibleCrops.length - 1
                            ? "1px solid rgba(0, 0, 0, 0.08)"
                            : "none",
                      }}
                    >
                      {/* Left column: Image */}
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Image
                          width={48}
                          height={48}
                          alt={crop.cropName}
                          src={imageSrc}
                          style={{ borderRadius: "50%", objectFit: "cover" }}
                        />
                      </Box>
                      
                      {/* Middle column: Three rows */}
                      <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, ml: "1rem" }}>
                        {/* Row 1: Crop Name - Variety */}
                        <Link
                          href={`/markettrend/${crop.cropName.toLowerCase()}-${(crop.variety || 'general').toLowerCase()}-${selectedCropType?.toLowerCase().replace(/-/g, "_") || "leafy_greens"}`}
                        >
                          <Typography
                            sx={{ 
                              fontWeight: 600, 
                              textDecoration: "underline", 
                              cursor: "pointer", 
                              color: "#ff5e00",
                              fontSize: "0.875rem",
                              "&:hover": {
                                color: "#e65000"
                              }
                            }}
                          >
                            {isMicrogreens ? capitalizeFirstLetter(crop.cropName) : crop.cropName}{crop.variety ? ` - ${formatUnderscoreString(crop.variety)}` : ''}
                          </Typography>
                        </Link>
                        
                        {/* Row 2: Price (only for Microgreens) */}
                        {isMicrogreens && crop.pricePerPunnet !== undefined && (
                          <Typography sx={{ color: "rgba(0, 18, 25, 0.9)", fontWeight: 500, fontSize: "0.875rem" }}>
                            {typeof crop.pricePerPunnet === 'string' ? crop.pricePerPunnet : crop.pricePerPunnet} {crop.priceUnit}
                          </Typography>
                        )}
                        
                          {/* Row 3: Market Band Width */}
                          {crop.market_band_low !== undefined && crop.market_band_high !== undefined && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <Typography sx={{ color: "#10ab6f", fontWeight: 500, fontSize: "0.75rem" }}>
                                Market Band:
                              </Typography>
                              <Typography sx={{ color: "rgba(0, 18, 25, 0.9)", fontWeight: 600, fontSize: "0.75rem" }}>
                                {crop.market_band_low} - {crop.market_band_high} AED/kg
                              </Typography>
                            </Box>
                          )}
                        
                        {/* Row 4: Observed market Range */}
                        {crop.observed_low !== undefined && crop.observed_high !== undefined && (
                          <Tooltip
                            title={
                              <Box sx={{ p: 1 }}>
                                <Box sx={{ mb: 0.5, fontSize: "0.875rem", fontWeight: 500 }}>
                                  Observed Market Low: <Box component="span" sx={{ fontWeight: 600, ml: 0.5 }}>{crop.observed_low} AED/kg</Box>
                                </Box>
                                <Box sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
                                  Observed Market High: <Box component="span" sx={{ fontWeight: 600, ml: 0.5 }}>{crop.observed_high} AED/kg</Box>
                                </Box>
                              </Box>
                            }
                            arrow
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  backgroundColor: '#fff',
                                  color: 'rgba(0, 18, 25, 0.9)',
                                  fontSize: '0.875rem',
                                  padding: '0.75rem',
                                  borderRadius: '8px',
                                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                  border: '1px solid rgba(0, 0, 0, 0.1)',
                                }
                              }
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.25rem 0.5rem",
                                border: "1px solid rgba(0, 0, 0, 0.12)",
                                borderRadius: "8px",
                                backgroundColor: "rgba(0, 0, 0, 0.02)",
                                width: "fit-content",
                                cursor: "pointer",
                                "@keyframes blink": {
                                  "0%, 100%": { opacity: 1 },
                                  "50%": { opacity: 0.3 },
                                },
                                animation: "blink 2s infinite",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "100%",
                                  backgroundColor: "#10ab6f",
                                  flexShrink: 0,
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: "0.75rem",
                                  color: "rgba(0, 18, 25, 0.6)",
                                }}
                              >
                                Observed market range
                              </Typography>
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                      
                      {/* Right column: Price change */}
                      <Box
                        sx={{
                          backgroundColor: changeColor,
                          color: "#fff",
                          borderRadius: "1rem",
                          padding: "0.25rem 0.5rem",
                          fontWeight: 500,
                          minWidth: "4.5rem",
                          textAlign: "center",
                          ml: "1rem",
                        }}
                      >
                        {formatChange(crop.priceChangePercentage)}
                      </Box>
                    </Box>
                  );
                })}
              </ProtectedBlurWrapper>
            )}
          </Box>
        </Box>
        {/* Modal Flow */}
        <TopperformingcropsSubscribe
          open={subscribeFlowOpen}
          onClose={() => {
            setSubscribeFlowOpen(false);
            setShowPriceModal(false);
          }}
          showPriceModal={showPriceModal}
        />
      </Box>
    </Box>
  );
};

export default TopPerformingCrops;
