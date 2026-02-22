'use client';
 
import { useState } from "react";
import { Box, Tab, Tabs, Button, Typography, Paper } from "@mui/material";
import CropGrowthTimeline from "../../../../components/Markettrend/Aiplan/CropGrowthTimeline";
import OptimalParameters from "../../../../components/Markettrend/Aiplan/OptimalParameters";
import RequiredMaterials from "../../../../components/Markettrend/Aiplan/RequiredMaterials";
 
type Props = {
  onClose: () => void;
  onConfirm: () => void;
  source?: string | null;
  onDashboardCycleStart?: () => void;
  cropName?: string;
  cropVariety?: string;
  cropType?: string;
};
 
 
const AiplanModal: React.FC<Props> = ({ onClose, onConfirm, source, onDashboardCycleStart, cropName, cropVariety, cropType }) => {
  const [activeTab, setActiveTab] = useState(0);
 
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
 
  return (
    <Paper
      sx={{
        width: "720px",       
        height: "600px",      
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        boxShadow: 3,
        overflow: "hidden" 
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: "1.5rem 2rem 0.5rem 2rem",
          flexShrink: 0
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 600, color: "#00AA66", marginBottom: "0.5rem" }}
        >
          AI Driven Plan
        </Typography>
 
        <Typography variant="body2" align="center" color="text.secondary">
          AI-optimized growth plan for maximizing yield, efficiency, and resource use.
        </Typography>
      </Box>
 
      {/* Tabs */}
      <Box
        sx={{
          flexShrink: 0,
          mt: "1rem",
          px: "2rem",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleChange}
          centered
          variant="fullWidth"
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: "#FF6600" } }}
        >
          <Tab label="CROP GROWTH TIMELINE" sx={{ fontWeight: 600 }} />
          <Tab label="OPTIMAL PARAMETERS" sx={{ fontWeight: 600 }} />
          <Tab label="REQUIRED MATERIALS" sx={{ fontWeight: 600 }} />
        </Tabs>
      </Box>
 
      {/* Scrollable Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "1rem 2rem"
        }}
      >
        {activeTab === 0 && <CropGrowthTimeline showAllCrops={true} />}
        {activeTab === 1 && <OptimalParameters showAllCrops={true} />}
        {activeTab === 2 && <RequiredMaterials showAllCrops={true} />}
      </Box>
 
      {/* Footer (Buttons) */}
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          borderTop: "1px solid rgba(0, 0, 0, 0.12)"
        }}
      >
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FF6600",
            color: "#fff",
            "&:hover": { backgroundColor: "#e65c00" }
          }}
          onClick={() => {
            if (source === "farmxos" && onDashboardCycleStart) {
              onDashboardCycleStart();
            } else {
              onConfirm();
            }
          }}
        >
          Confirm & Plant
        </Button>
      </Box>
    </Paper>
  );
};
 
export default AiplanModal;