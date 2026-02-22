// components/MetricsRow.tsx
"use client";

import { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import Image from "next/image";
import InfoIcon from "@mui/icons-material/Info";

interface MetricsRowProps {
  cropName: string;
  cropVariety: string;
}

export const MetricsRow: FC<MetricsRowProps> = ({ cropName, cropVariety }) => {
  const cropMarketDataTopCardsData = useSelector(
    (state: RootState) =>
      state.cropGrowingGuide.data?.cropMarketDataTopCardsData?.data ?? []
  );

  const { currency = "₹", weight = "kg" } = useSelector(
    (state: RootState) => state.locationMeta || {}
  );

  // ✅ Find the matching crop (or undefined if not found)
  const selectedCropData = useMemo(() => {
    if (!cropMarketDataTopCardsData?.length) return undefined;

    const matchedCrop = cropMarketDataTopCardsData.find(
      (entry: any) =>
        entry.crop_name?.toLowerCase().trim() === cropName.toLowerCase().trim() &&
        entry.variety?.toLowerCase().trim() === cropVariety.toLowerCase().trim()
    );
    // console.log("🔍 Matched Crop Data:", matchedCrop);
    return matchedCrop;
  }, [cropName, cropVariety, cropMarketDataTopCardsData]);

  if (!selectedCropData) {
    return <Typography>No market data available</Typography>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: "1.5rem",
      }}
    >
      {/* Current Market Price */}
      <Box
        sx={{
          flex: 1,
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "4px",
          p: "1.5rem",
        }}
      >
        <Box display="flex" flexDirection="row" alignItems="center" gap="0.75rem">
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap="0.5rem">
              <Typography
                sx={{ textTransform: "uppercase", fontSize: "0.75rem" }}
                color="text.secondary"
              >
                Current Market Price
              </Typography>
              {selectedCropData["Market Band Low"] !== undefined && selectedCropData["Market Band High"] !== undefined && (
                <Tooltip
                  title={
                    <Box>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Market Value: {selectedCropData["Market Value"] !== undefined && selectedCropData["Market Value"] !== null ? `${Number(selectedCropData["Market Value"]).toFixed(2)} ${currency}/${weight}` : "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Observed Low: {selectedCropData["Observed Low"] !== undefined && selectedCropData["Observed Low"] !== null ? `${Number(selectedCropData["Observed Low"]).toFixed(2)} ${currency}/${weight}` : "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        Observed High: {selectedCropData["Observed High"] !== undefined && selectedCropData["Observed High"] !== null ? `${Number(selectedCropData["Observed High"]).toFixed(2)} ${currency}/${weight}` : "N/A"}
                      </Typography>
                    </Box>
                  }
                  arrow
                  placement="top"
                >
                  <IconButton
                    size="small"
                    sx={{
                      p: 0.25,
                      color: "rgba(0, 0, 0, 0.54)",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <InfoIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 600 }}>
              {selectedCropData["Market Band Low"] !== undefined && selectedCropData["Market Band High"] !== undefined ? (
                `${Number(selectedCropData["Market Band Low"]).toFixed(2)} - ${Number(selectedCropData["Market Band High"]).toFixed(2)} ${currency} / ${weight}`
              ) : selectedCropData.latest_price ? (
                typeof selectedCropData.latest_price === 'object' && selectedCropData.latest_price.min && selectedCropData.latest_price.max ? (
                  `${Number(selectedCropData.latest_price.min).toFixed(2)} - ${Number(selectedCropData.latest_price.max).toFixed(2)} ${currency} / ${weight}`
                ) : (
                  `${Number(selectedCropData.latest_price).toFixed(2)} ${currency} / ${weight}`
                )
              ) : (
                "No data available"
              )}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "4px",
              backgroundColor: "#008756",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src="/apps/currentmarketprice.svg" alt="" width={24} height={24} />
          </Box>
        </Box>
      </Box>

      {/* Price Trend (30 Days) */}
      <Box
        sx={{
          flex: 1,
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "4px",
          p: "1.5rem",
        }}
      >
        <Box display="flex" flexDirection="row" alignItems="center" gap="0.75rem">
          <Box flex={1}>
            <Typography
              sx={{ textTransform: "uppercase", fontSize: "0.75rem" }}
              color="text.secondary"
            >
              Historic Price Variation (30 Days)
            </Typography>
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 600 }}>
              {selectedCropData["30d_price_change"] !== undefined
                ? (() => {
                    const priceChange = selectedCropData["30d_price_change"];
                    const priceChangeStr = String(priceChange).trim();
                    // Check if the value already contains % sign
                    const hasPercent = priceChangeStr.includes("%");
                    const numericValue = hasPercent 
                      ? parseFloat(priceChangeStr.replace(/%/g, "")) 
                      : Number(priceChange);
                    if (isNaN(numericValue)) return "No data available";
                    const sign = numericValue > 0 ? "+" : "";
                    return `${sign}${numericValue.toFixed(2)}%`;
                  })()
                : "No data available"}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "4px",
              backgroundColor: "#81b462",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src="/apps/pricetrend.svg" alt="" width={24} height={24} />
          </Box>
        </Box>
      </Box>

      {/* Demand Level */}
      <Box
        sx={{
          flex: 1,
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "4px",
          p: "1.5rem",
        }}
      >
        <Box display="flex" flexDirection="row" alignItems="center" gap="0.75rem">
          <Box flex={1}>
            <Typography
              sx={{ textTransform: "uppercase", fontSize: "0.75rem" }}
              color="text.secondary"
            >
              Demand Level
            </Typography>
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 600 }}>
              {selectedCropData.demand_indicator || "No data available"}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "4px",
              backgroundColor: "#c8d04f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src="/apps/demandlevel.svg" alt="" width={24} height={24} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
