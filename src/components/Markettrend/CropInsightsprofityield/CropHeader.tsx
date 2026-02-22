"use client";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

export const CropHeader = () => {
  const [activeTab, setActiveTab] = useState("market-data"); // Default active tab

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", p: "2rem" }}>
      {/* Go Back Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ff5e00", cursor: "pointer" }}>
        <Image src="/apps/Vector.svg" alt="Back icon" width={12} height={11} />
        <Typography>Go Back</Typography>
      </Box>

      {/* Crop Image & Name */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Image src="/apps/Icon.png" alt="Lettuce Icon" width={88} height={88} style={{ borderRadius: "50px", objectFit: "cover" }} />
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "2rem" }}>LETTUCE</Typography>
          <Box sx={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "rgba(0, 18, 25, 0.6)" }}>
            <Box>
              <Typography sx={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "bold" }}>Variety</Typography>
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 600, color: "#008756" }}>Butterhead</Typography>
            </Box>
            <Box>
              <Typography sx={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "bold" }}>Growth Cycle</Typography>
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 600, color: "#008756" }}>45-60 days</Typography>
            </Box>
            <Box>
              <Typography sx={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "bold" }}>Yield Potential</Typography>
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 600, color: "#008756" }}>High</Typography>
            </Box>
          </Box>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Box sx={{ border: "1px solid rgba(0, 18, 25, 0.87)", borderRadius: "4px", py: "0.5rem", px: "1.375rem", cursor: "pointer" }}>
            Add to Grow Basket
          </Box>
          <Box sx={{ backgroundColor: "#ff5e00", color: "#fff", borderRadius: "4px", py: "0.5rem", px: "1.375rem", cursor: "pointer" }}>
            Plant Now
          </Box>
        </Box>
      </Box>

      {/* Tab Navigation */}
      <Box
        sx={{
          display: "flex",
          gap: "2rem",
          fontSize: "0.875rem",
          color: "rgba(0, 18, 25, 0.6)",
          cursor: "pointer",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          width: "100%",
        }}
      >
        {["market-data", "profit-yield", "growing-guide"].map((tab) => (
          <Box
            key={tab}
            onClick={() => setActiveTab(tab)}
            sx={{
              position: "relative",
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? "#ff5e00" : "rgba(0, 18, 25, 0.6)",
              pb: "0.5rem",
            }}
          >
            {tab === "market-data" && "Market Data"}
            {tab === "profit-yield" && "Profit & Yield"}
            {tab === "growing-guide" && "Growing Guide"}

            {/* Active tab underline */}
            {activeTab === tab && (
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: "100%",
                  borderTop: "2px solid #ff5e00",
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      {/* Content Section */}
      <Box sx={{ p: "1rem", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
        {activeTab === "market-data" && <Typography>📊 Market Data Content</Typography>}
        {activeTab === "profit-yield" && <Typography>💰 Profit & Yield Content</Typography>}
        {activeTab === "growing-guide" && <Typography>🌱 Growing Guide Content</Typography>}
      </Box>
    </Box>
  );
};
