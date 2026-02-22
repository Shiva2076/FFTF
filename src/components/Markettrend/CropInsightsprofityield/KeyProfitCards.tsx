"use client";
import { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

interface KeyProfitCardsProps {
  cropName: string;
  cropVariety: string;
}

export const KeyProfitCards: FC<KeyProfitCardsProps> = ({ cropName, cropVariety }) => {
  const cropProfitYieldTopCardsData = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropProfitYieldTopCardsData.data
  );
  const { currency, weight } = useSelector((state: RootState) => state.locationMeta);

  const selectedCropData = useMemo(() => {
    return cropProfitYieldTopCardsData?.find(
      (entry: any) =>
        entry.crop?.toLowerCase().trim() === cropName.toLowerCase().trim() &&
        entry.variety?.toLowerCase().trim() === cropVariety.toLowerCase().trim()
    );
  }, [cropName, cropVariety, cropProfitYieldTopCardsData]);

  // 🟢 Build cardData dynamically based on type
  const cardData = useMemo(() => {
    if (!selectedCropData) return [];

    // Detect microgreens (annual_boxes present) vs leafy greens (roi present)
    if ("annual_boxes" in selectedCropData || "annual_profit_aed" in selectedCropData) {
      // Microgreens fields
      return [
        {
          label: "Annual Revenue",
          value: selectedCropData.annual_revenue != null
            ? `${currency} ${selectedCropData.annual_revenue.toLocaleString()}`
            : "-",
          icon: "/apps/annualrevenue.svg",
          bgColor: "#009688",
        },
        {
          label: "Annual Profit",
          value: selectedCropData.annual_profit_aed != null
            ? `${currency} ${selectedCropData.annual_profit_aed.toLocaleString()}`
            : "-",
          icon: "/apps/roi.svg",
          bgColor: "#4CAF50",
        },
        {
          label: "Annual Boxes",
          value: selectedCropData.annual_boxes != null
            ? selectedCropData.annual_boxes.toLocaleString()
            : "-",
          icon: "/apps/breakeven.svg",
          bgColor: "#26A69A",
        },
        {
          label: "Price / Box",
          value: selectedCropData.price_per_box_aed != null
            ? `${currency} ${selectedCropData.price_per_box_aed}`
            : "-",
          icon: "/apps/growthpotential.svg",
          bgColor: "#FFA726",
        },
        {
          label: "Profit Margin",
          value: selectedCropData.profit_margin_pct != null
            ? `${selectedCropData.profit_margin_pct}%`
            : "-",
          icon: "/apps/marketstability.svg",
          bgColor: "#FF7043",
        },
      ];
    } else {
      // Leafy greens fields
      return [
        {
          label: "Annual Revenue",
          value: selectedCropData.annual_revenue != null
            ? `${currency} ${selectedCropData.annual_revenue.toLocaleString()}`
            : "-",
          icon: "/apps/annualrevenue.svg",
          bgColor: "#009688",
        },
        {
          label: "ROI",
          value: selectedCropData.roi != null ? `${selectedCropData.roi}%` : "-",
          icon: "/apps/roi.svg",
          bgColor: "#66BB6A",
        },
        {
          label: "Break-even",
          value:
            selectedCropData.break_even_in_months != null
              ? `${selectedCropData.break_even_in_months} Months`
              : "-",
          icon: "/apps/breakeven.svg",
          bgColor: "#D4E157",
        },
        {
          label: "Growth Potential",
          value: selectedCropData.growth_potential || "-",
          icon: "/apps/growthpotential.svg",
          bgColor: "#FFA726",
        },
        {
          label: "Market Stability",
          value: selectedCropData.market_stability || "-",
          icon: "/apps/marketstability.svg",
          bgColor: "#FF7043",
        },
      ];
    }
  }, [selectedCropData, currency]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        fontSize: "0.75rem",
        color: "rgba(0, 18, 25, 0.6)",
      }}
    >
      {cardData.map((card, index) => (
        <Box
          key={index}
          sx={{
            minWidth: "160px",
            flex: "1 1 160px",
            borderRadius: "6px",
            backgroundColor: "#fff",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            p: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {/* Text */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <Typography
              sx={{
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontSize: "0.7rem",
                color: "rgba(0, 18, 25, 0.6)",
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "rgba(0, 18, 25, 0.87)",
              }}
            >
              {card.value}
            </Typography>
          </Box>

          {/* Icon */}
          <Box
            sx={{
              width: "28px",
              height: "28px",
              backgroundColor: card.bgColor,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Image src={card.icon} alt={card.label} width={16} height={16} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
