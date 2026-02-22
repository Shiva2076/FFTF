"use client";

import { FC, useRef, useLayoutEffect, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { MarketLiveSnapshotItem } from "@/app/slices/marketLiveSnapshotSlice";
import { formatUnderscoreString } from "@/utils/Capitalize";

const SCROLL_SPEED = 100; // px per second

const demandColour = (demand: MarketLiveSnapshotItem["demand"]) => {
  // Normalize demand to handle both "Low" and "Low Demand" formats
  const normalizedDemand = typeof demand === 'string' ? demand.toLowerCase() : '';
  
  if (normalizedDemand.includes('high')) {
    return "#008756";
  } else if (normalizedDemand.includes('low')) {
    return "#ef5350";
  } else {
    return "#ff5e00"; // Medium demand or default
  }
};

const LiveCropMarketUpdates: FC = () => {
  const marketData = useSelector((s: RootState) => s.marketLiveSnapshot);
  const { currency } = useSelector((s: RootState) => s.locationMeta);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [scrollPx, setScrollPx] = useState(0);
  const [duration, setDuration] = useState(0);

  const recalc = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    // total width of both copies
    const fullWidth = el.scrollWidth;
    // width of one copy
    const singleWidth = fullWidth / 2;

    setScrollPx(singleWidth);
    setDuration(singleWidth / SCROLL_SPEED);
  }, []);

  // Recalculate on data change / mount
  useLayoutEffect(() => {
    recalc();
  }, [marketData, recalc]);

  // Recalculate on window resize
  useLayoutEffect(() => {
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [recalc]);

  // Build a pixel-based keyframes for exactly one copy scroll
  const scrollAnim = keyframes`
    from { transform: translateX(0px); }
    to   { transform: translateX(-${scrollPx}px); }
  `;
    
  const marketItems = marketData?.data || [];
  const isMicrogreens = marketData?.cropType?.toLowerCase() === 'microgreens';
  // console.log('marketItems:', marketItems);
  // console.log('marketData:', marketData);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: "100%",
        height: "2.5rem",
        overflow: "hidden",
        borderBottom: "1px solid rgba(0,0,0,0.12)",
        backgroundColor: "#f7f7f7",
        fontSize: "0.75rem",
        fontFamily: "Poppins",
      }}
    >
      <Box
        ref={contentRef}
        sx={{
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          animation:
            scrollPx && duration
              ? `${scrollAnim} ${duration}s linear infinite`
              : "none",
        }}
      >
        {/* duplicate so it loops seamlessly */}
        {[...marketItems, ...marketItems].map(
          (
            { cropName, variety, pricePerKg, pricePerPunnet, priceChangePercentage, demand },
            idx
          ) => {
            const colour = demandColour(demand);
            const unit = isMicrogreens ? 'punnet' : 'kg';
            
            // Get the price value: for microgreens use pricePerPunnet, otherwise use pricePerKg
            const priceValue = isMicrogreens 
              ? (pricePerPunnet ?? pricePerKg ?? '0') 
              : (pricePerKg ?? '0');
            
            // Format price: handle both number and range string (e.g., "39.94-49.5")
            const formatPrice = (price: number | string): string => {
              if (typeof price === 'string') {
                // Check if it's a range string (contains "-")
                if (price.includes('-')) {
                  // Format range: "39.94-49.5" -> "39.94 - 49.5"
                  const [min, max] = price.split('-').map(p => {
                    const num = parseFloat(p.trim());
                    return isNaN(num) ? '0.00' : num.toFixed(2);
                  });
                  return `${min} - ${max}`;
                } else {
                  // Single string number
                  const num = parseFloat(price);
                  return isNaN(num) ? '0.00' : num.toFixed(2);
                }
              } else {
                // Number
                return isNaN(price) ? '0.00' : price.toFixed(2);
              }
            };
            
            // Format price change percentage
            const formatChange = (change: number | string): string => {
              const numChange = typeof change === 'string' ? parseFloat(change) : change;
              const safeChange = isNaN(numChange) ? 0 : numChange;
              const sign = safeChange > 0 ? "+" : "";
              return `${sign}${safeChange.toFixed(2)}`;
            };
            
            return (
              <Box
                key={idx + cropName + variety}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  color: colour,
                  px: "1rem",
                }}
              >
                <Box
                  sx={{
                    width: "0.5rem",
                    height: "0.5rem",
                    borderRadius: "10px",
                    backgroundColor: colour,
                  }}
                />
                <Typography
                  component="span"
                  sx={{
                    letterSpacing: "1px",
                    lineHeight: "266%",
                    textTransform: "uppercase",
                  }}
                >
                  <b>
                    {cropName} {formatUnderscoreString(variety)}
                  </b>{" "}
                  – {currency} {formatPrice(priceValue)} /{unit} (
                  {formatChange(priceChangePercentage)}%)
                  <span style={{ color: "rgba(0,18,25,0.6)" }}>
                    {" "}
                    | {demand}
                  </span>
                </Typography>
              </Box>
            );
          }
        )}
      </Box>

      {/* left gradient fade */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "5rem",
          height: "2.5rem",
          background:
            "linear-gradient(to right, #f7f7f7, rgba(247,247,247,0))",
          zIndex: 5,
        }}
      />
      {/* right gradient fade */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "5rem",
          height: "2.5rem",
          background:
            "linear-gradient(to left, #f7f7f7, rgba(247,247,247,0))",
          zIndex: 5,
        }}
      />
    </Box>
  );
};

export default LiveCropMarketUpdates;