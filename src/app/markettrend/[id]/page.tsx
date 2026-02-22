"use client";
import type { NextPage } from "next";
import { Box, Typography, Alert } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { formatUnderscoreString } from "@/utils/Capitalize";

// Redux actions
import { addCrop } from "../../slices/growBasketSlice";
import { setSelectedCropType } from "@/app/slices/selectedCropTypeSlice";
import LiveCropMarketUpdates from '@/components/Markettrend/MarketOverview/LiveCropMarketUpdates';

// COMPONENT IMPORTS
// Market-Data
import { MetricsRow } from "../../../components/Markettrend/CropInsightsmarketdata/MetricsRow";
import { PriceTrendsChart } from "../../../components/Markettrend/CropInsightsmarketdata/PriceTrendsChart";
import { ProjectedMarketTrendsChart } from "../../../components/Markettrend/CropInsightsmarketdata/ProjectedMarketTrendsChart";
import { ProfitabilityCostAnalysisChart } from "../../../components/Markettrend/CropInsightsmarketdata/ProfitabilityCostAnalysisChart";
import { CostBreakdownChart } from "../../../components/Markettrend/CropInsightsmarketdata/CostBreakdownChart";

// Profit & Yield
import { KeyProfitCards } from "../../../components/Markettrend/CropInsightsprofityield/KeyProfitCards";
import { YieldDistribution } from "../../../components/Markettrend/CropInsightsprofityield/YieldDistribution";
import { RevenueGrowthProjection } from "../../../components/Markettrend/CropInsightsprofityield/RevenueGrowthProjection";
import { ProfitabilityForecast } from "../../../components/Markettrend/CropInsightsprofityield/ProfitabilityForecast";
import { ROIBreakdown } from "../../../components/Markettrend/CropInsightsprofityield/ROIBreakdown";
import { BreakEvenAnalysis } from "../../../components/Markettrend/CropInsightsprofityield/BreakEvenAnalysis";
import { SustainabilityScorecard } from "../../../components/Markettrend/CropInsightsprofityield/SustainabilityScorecard";

// Growing Guide
import { Conditions } from "../../../components/Markettrend/CropInsightsgrowingguide/Conditions";
import { CropGrowthTimeline } from "../../../components/Markettrend/CropInsightsgrowingguide/CropGrowthTimeline";
import { KeyGrowthMilestones } from "../../../components/Markettrend/CropInsightsgrowingguide/KeyGrowthMilestones";
import { CostBreakdown } from "../../../components/Markettrend/CropInsightsgrowingguide/CostBreakdown";
import { SmartPlantingRecommendations } from "../../../components/Markettrend/CropInsightsgrowingguide/SmartPlantingRecommendations";

// Example: set your API base URL in an environment variable for security/config
import { api } from "@/constants";
import _ from "lodash";
//Plant now
import { Modal as MuiModal, CircularProgress } from "@mui/material";
import AiplanModal from "@/app/markettrend/grow-basket/ai-plan/aiplan";
import FarmRegisterModal from "@/components/Markettrend/Farm/FarmRegister";
import FarmDetails from "@/components/Markettrend/Farm/Farmdetails";
import Growcyclestart from "@/components/Markettrend/Growcycle/Growcyclestart";

const CropData: NextPage = () => {
  const [activeTab, setActiveTab] = useState("market-data");
  const dispatch = useDispatch();
  const params = useParams();
  // "slug" might be something like "parsley_general"
  const slug = params?.id as string;
  const router = useRouter();

  // We'll parse out the cropName and variety from the slug
  const [cropName, cropVariety, crop_type] = useMemo(() => {
    if (!slug) return ["", "",""];
    const [name, variety, crop_type] = slug.split("-");
    return [name, variety, crop_type];
  }, [slug]);

  // Check if the crop type is microgreens
  const isMicrogreens = useMemo(() => {
    return crop_type?.toLowerCase().replace(/_/g, "-") === "microgreens";
  }, [crop_type]);

  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const isAuthenticated = Boolean(userInfo?.user_id);
  const ismarkettrendsubscribed = Boolean(userInfo?.markettrendsubscribed);
  const shouldDisable = !isAuthenticated || !ismarkettrendsubscribed;
  
  // Set the crop type in Redux when component mounts or crop type changes
  useEffect(() => {
    if (crop_type) {
      const formattedCropType = crop_type.toLowerCase().replace(/_/g, "-").replace(/(^\w|-\w)/g, (m) => m.toUpperCase());
      dispatch(setSelectedCropType(formattedCropType));
    }
  }, [crop_type, dispatch]);

  //Plant now
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isFarmRegisterOpen, setFarmRegisterOpen] = useState(false);
  const [isFarmDetailsOpen, setFarmDetailsOpen] = useState(false);
  const [userFarms, setUserFarms] = useState<any[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(false);
  const [showGrowCycle, setShowGrowCycle] = useState(false);
  const [growCycleData, setGrowCycleData] = useState<any>(null);

  // Basic info (you might later replace with data from your API once fetched)
  const cropDataMap: Record<string, { growthCycle: string; yieldPotential: string }> = {
    lettuce: { growthCycle: "45-60 days", yieldPotential: "High" },
    arugula: { growthCycle: "30-40 days", yieldPotential: "Medium" },
    basil: { growthCycle: "50-60 days", yieldPotential: "Medium" },
    spinach: { growthCycle: "35-45 days", yieldPotential: "High" },
    pakchoi: { growthCycle: "30-40 days", yieldPotential: "Medium" },
    celery: { growthCycle: "80-100 days", yieldPotential: "Medium" },
    kale: { growthCycle: "50-65 days", yieldPotential: "High" },
    parsley: { growthCycle: "70-90 days", yieldPotential: "Medium" },
  };

  const crops = useSelector((state: any) => state.cropsByRegion.crops);

  const cropInfo = useMemo(() => {
    const data = cropDataMap[cropName?.toLowerCase()] || {
      growthCycle: "N/A",
      yieldPotential: "N/A",
    };
    const matchingCrop = crops.find(
      (crop: any) =>
        crop.crop_name?.toLowerCase() === cropName?.toLowerCase() &&
        crop.crop_variety?.toLowerCase() === cropVariety?.toLowerCase()
    );
    return {
      name: cropName,
      variety: cropVariety,
      growthCycle: data.growthCycle,
      crop_type: crop_type.toLowerCase().replace(/_/g, "-").replace(/(^\w|-\w)/g, (m) => m.toUpperCase()),
      yieldPotential: data.yieldPotential,
      rank: matchingCrop?.rank ?? 20, // fallback if not found
    };
  }, [cropName, cropVariety, crops]);

  const selectedCrop = [cropInfo]; // this is what your modals expect// Plant Now
  const handleOpenAIModal = () => {
  if (!shouldDisable){ 
    setGrowCycleData(null);
    setAIModalOpen(true);
  }
  };

  const handleCloseAIModal = () => {
    setAIModalOpen(false);
  };

  const handleConfirmAI = async () => {
    setAIModalOpen(false);
    setLoadingFarms(true);
    try {
      const response = await api.get("/api/farm/userfarms");
      const farms = response.data;
      if (farms && farms.length > 0) {
        setUserFarms(farms);
        setFarmDetailsOpen(true);
      } else {
        setFarmRegisterOpen(true);
      }
    } catch (error) {
      console.error("❌ Error fetching farms:", error);
      setFarmRegisterOpen(true);
    } finally {
      setLoadingFarms(false);
    }
  };

  const handleFarmSubmit = (data: any) => {
    console.log("🌱 Farm registered:", data);
    setFarmRegisterOpen(false);
  };

  // Handler for "Add to Grow Basket"
  const handleAddToGrowBasket = () => {
    if (!shouldDisable) dispatch(addCrop(cropInfo));
  };
  
  const imagePath = `/apps/crop_icons/${cropName}_${cropVariety}_${crop_type.toLowerCase().replace(/-/g, "_")}.svg`;

  const [alertMessage, setAlertMessage] = useState("");

  const handleGoBack = () => {
    // Simply go back to the market trend page
    // The Redux state will automatically handle the correct tab selection
    router.push("/markettrend?tab=crop-insights#ai-recommended-crops");
  };

  return (
    <>
      <LiveCropMarketUpdates />
      <Box
        sx={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          overflowX: "hidden",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          p: "2rem",
          fontFamily: "Poppins, sans-serif",
          boxSizing: "border-box",
        }}
      >
        {alertMessage && (
          <Alert
            severity="warning"
            onClose={() => setAlertMessage("")}
            sx={{ mb: 2 }}
          >
            {alertMessage}
          </Alert>
        )}
        {/* Go Back */}
        <Box
          onClick={handleGoBack}
          sx={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ff5e00", cursor: "pointer" }}>
          <Image src="/apps/back.svg" alt="Back icon" width={12} height={11} />
          <Typography>Go Back</Typography>
        </Box>

        {/* Top Section */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.5rem",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <Image
              src={imagePath}
              alt={`${cropName} ${cropVariety} Icon`}
              width={88}
              height={88}
              style={{ width: "5.5rem", borderRadius: "50px", objectFit: "cover" }}
            />
            <Box>
              <Typography component="b" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                {cropName?.toUpperCase()}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2rem", mt: 1 }}>
                {[
                  { label: "Variety", value: formatUnderscoreString(cropVariety) },
                  { label: "Growth Cycle", value: cropInfo.growthCycle },
                 ...(isMicrogreens ? [] : [{ label: "Yield Potential", value: cropInfo.yieldPotential }])
  ].map((item) => (
                  <Box key={item.label}>
                    <Typography sx={{ fontSize: "0.75rem", textTransform: "uppercase", color: "rgba(0,0,0,0.6)" }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 600, color: "#008756" }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Buttons */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {!shouldDisable ? (
              <Box
                onClick={() => {
                  handleAddToGrowBasket();
                  router.push("/markettrend/grow-basket");
                }}
                sx={{
                  border: "1px solid rgba(0, 18, 25, 0.87)",
                  borderRadius: "4px",
                  px: "1.375rem",
                  py: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <Typography sx={{ fontWeight: 500, textTransform: "uppercase" }}>
                  Add to Grow Basket
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  border: "1px solid rgba(0, 18, 25, 0.87)",
                  borderRadius: "4px",
                  px: "1.375rem",
                  py: "0.5rem",
                  cursor: "not-allowed",
                  opacity: 0.5,
                }}
              >
                <Typography sx={{ fontWeight: 500, textTransform: "uppercase" }}>
                  Add to Grow Basket
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                backgroundColor: "#ff5e00",
                color: "#fff",
                borderRadius: "4px",
                px: "1.375rem",
                py: "0.5rem",
                cursor: shouldDisable ? "not-allowed" : "pointer",
                opacity: shouldDisable ? 0.5 : 1,
              }}
              onClick={handleOpenAIModal}
            >
              <Typography sx={{ fontWeight: 500, textTransform: "uppercase" }}>Plant Now</Typography>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Box
          sx={{
            display: "flex",
            gap: "2rem",
            fontSize: "0.875rem",
            color: "rgba(0, 18, 25, 0.6)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          {["market-data", "profit-yield", "growing-guide"].map((tab) => {
            const isRestrictedTab = (tab === "profit-yield" || tab === "growing-guide") && shouldDisable;

            return (
              <Box
                key={tab}
                onClick={() => {
                  if (isRestrictedTab) {
                    setAlertMessage("Please sign in and subscribe to access this feature.");
                  } else {
                    setActiveTab(tab);
                  }
                }}
                sx={{
                  pb: "0.5rem",
                  fontWeight: activeTab === tab ? 600 : 400,
                  color: isRestrictedTab
                    ? "rgba(0,0,0,0.3)"
                    : activeTab === tab
                      ? "#ff5e00"
                      : "rgba(0, 18, 25, 0.6)",
                  cursor: isRestrictedTab ? "not-allowed" : "pointer",
                  position: "relative",
                }}
              >
                {tab === "market-data" && "Market Data"}
                {tab === "profit-yield" && "Profit & Yield"}
                {tab === "growing-guide" && "Growing Guide"}

                {activeTab === tab && !isRestrictedTab && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      borderTop: "2px solid #ff5e00",
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>


        {/* MARKET DATA TAB */}
        {activeTab === "market-data" && (
          <>
            <MetricsRow cropName={cropName} cropVariety={cropVariety} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "space-between" }}>
              <Box sx={{ flex: "1 1 48%", minWidth: "300px" }}>
                <PriceTrendsChart cropName={cropName} cropVariety={cropVariety} />
              </Box>
              <Box sx={{ flex: "1 1 48%", minWidth: "300px" }}>
                <ProjectedMarketTrendsChart cropName={cropName} cropVariety={cropVariety} />
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "space-between" }}>
              <Box sx={{ flex: "1 1 48%", minWidth: "300px" }}>
                <ProfitabilityCostAnalysisChart cropName={cropName} cropVariety={cropVariety} />
              </Box>
              <Box sx={{ flex: "1 1 48%", minWidth: "300px" }}>
                <CostBreakdownChart cropName={cropName} cropVariety={cropVariety}/>
              </Box>
            </Box>
          </>
        )}

        {/* PROFIT & YIELD TAB */}
        {activeTab === "profit-yield" && (
          <>
            <KeyProfitCards cropName={cropName} cropVariety={cropVariety} />
            {!isMicrogreens && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.5rem",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ flex: "1 1 48%", minWidth: "300px" }}>
                  <YieldDistribution cropName={cropName} cropVariety={cropVariety} />
                </Box>
                <Box sx={{ flex: "1 1 48%", minWidth: "300px" }}>
                  <RevenueGrowthProjection cropName={cropName} cropVariety={cropVariety} />
                </Box>
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.5rem",
                justifyContent: "space-between",
              }}
            >
              {!isMicrogreens && (
                <Box sx={{ flex: "1 1 48%", minWidth: "300px" }}>
                  <ProfitabilityForecast cropName={cropName} cropVariety={cropVariety} />
                </Box>
              )}
              <Box sx={{ flex: "1 1 48%", minWidth: "300px" }}>
                <ROIBreakdown cropName={cropName} cropVariety={cropVariety} />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.5rem",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ flex: "1 1 48%", minWidth: "300px" }}>
                <BreakEvenAnalysis cropName={cropName} cropVariety={cropVariety} />
              </Box>
               {!isMicrogreens && (
    <Box sx={{ flex: "1 1 48%", minWidth: "300px" }}>
      <SustainabilityScorecard cropName={cropName} cropVariety={cropVariety} />
    </Box>
  )}
            </Box>
          </>
        )}


        {/* GROWING GUIDE TAB */}
        {activeTab === "growing-guide" && (
          <>
            <Conditions cropName={cropName} cropVariety={cropVariety} />

            <CropGrowthTimeline cropName={cropName} cropVariety={cropVariety} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: "1.5rem",
                alignItems: "stretch",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  height: "100%",
                }}
              >
                <KeyGrowthMilestones cropName={cropName} cropVariety={cropVariety} />
                <CostBreakdown cropName={cropName} cropVariety={cropVariety} />
              </Box>
              <Box
                sx={{
                  height: "100%",
                }}
              >
                <SmartPlantingRecommendations
                 cropName={cropName} cropVariety={cropVariety}
                />
              </Box>
            </Box>
          </>
        )}
        {/* Plant Now // AI Plan Modal */}
        <MuiModal open={isAIModalOpen} onClose={handleCloseAIModal}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", outline: "none" }}>
            <AiplanModal onClose={handleCloseAIModal} onConfirm={handleConfirmAI} cropName={cropName} cropVariety={cropVariety} />
          </Box>
        </MuiModal>

        {/* Farm Register Modal */}
        <MuiModal open={isFarmRegisterOpen} onClose={() => setFarmRegisterOpen(false)}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", outline: "none" }}>
            <FarmRegisterModal
              open={isFarmRegisterOpen}
              onClose={() => setFarmRegisterOpen(false)}
              onBack={() => {
                setFarmRegisterOpen(false);
                setTimeout(() => setAIModalOpen(true), 200);
              }}
              onSubmit={handleFarmSubmit}
            />
          </Box>
        </MuiModal>

        {/* Farm Details Modal */}
        <MuiModal open={isFarmDetailsOpen} onClose={() => setFarmDetailsOpen(false)}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", outline: "none" }}>
            <FarmDetails
              open={true}
              farms={userFarms}
              selectedCrops={selectedCrop}
              onClose={() => setFarmDetailsOpen(false)}
              onConfirm={(farm) => {
                console.log("✅ Confirmed Farm:", farm);
                setFarmDetailsOpen(false);
              }}
              onGrowCycleStart={(data) => {
                setGrowCycleData(data);
                setShowGrowCycle(true);
              }}
              onBackToAI={() => {
                setFarmDetailsOpen(false);
                setTimeout(() => setAIModalOpen(true), 200);
              }}
              onRegisterNewFarm={() => {
                setFarmDetailsOpen(false);
                setTimeout(() => setFarmRegisterOpen(true), 200);
              }}
            />
          </Box>
        </MuiModal>

        {/* Grow Cycle Success Screen */}
        {showGrowCycle && growCycleData && (
          <Growcyclestart data={growCycleData} />
        )}

        {/* Loading Spinner */}
        {loadingFarms && (
          <MuiModal open={true}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <CircularProgress />
            </Box>
          </MuiModal>
        )}
      </Box>
    </>
  );
};

export default CropData;