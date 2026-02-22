'use client';
 
import type { NextPage } from "next";
import { Box, Typography, IconButton, Modal as MuiModal, CircularProgress } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { removeCrop } from "@/app/slices/growBasketSlice";
import { useEffect, useState } from "react";
import AiplanModal from "./ai-plan/aiplan";
import FarmRegisterModal from "@/components/Markettrend/Farm/FarmRegister";
import FarmDetails from "@/components/Markettrend/Farm/Farmdetails";
import Growcyclestart from "@/components/Markettrend/Growcycle/Growcyclestart";
import RackShelfSelectionModal from "@/components/Markettrend/RackShelfSelection/RackShelfSelectionModal";
import { api } from "@/constants";
import { useSearchParams } from "next/navigation";
import { clearBasket } from "@/app/slices/growBasketSlice";
import { formatUnderscoreString } from "@/utils/Capitalize";

interface CropSelection {
  crop_index: number;
  crop_name: string;
  crop_variety: string;
  crop_type: string;
  selected_shelf?: {
    rack_id: number;
    shelf_id: number;
  };
}

const ContentWithCTA: NextPage = () => {
  const searchParams = useSearchParams();
  const region = searchParams.get("region") || "";
  const source = searchParams.get("source");
  const selectedFarmId = useSelector((state: RootState) => state.growBasket.farmId);
  const crops = useSelector((state: RootState) => state.growBasket.basket);
  const dispatch = useDispatch();
  const router = useRouter();
 
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isFarmRegisterOpen, setFarmRegisterOpen] = useState(false);
  const [isFarmDetailsOpen, setFarmDetailsOpen] = useState(false);
  const [isRackSelectionOpen, setRackSelectionOpen] = useState(false);
  const [userFarms, setUserFarms] = useState<any[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(false);
 
  const [showGrowCycle, setShowGrowCycle] = useState(false);
  const [growCycleData, setGrowCycleData] = useState<any>(null);
 
  const handleDelete = (index: number) => {
    dispatch(removeCrop(index));
  };
 
  const handleOpenAIModal = () => setAIModalOpen(true);
  const handleCloseAIModal = () => setAIModalOpen(false);
 
  const handleConfirmAI = async () => {
    setAIModalOpen(false);
    setLoadingFarms(true);
 
    try {
      const response = await api.get('/api/farm/userfarms');
      const farms = response.data;
      if (farms && farms.length > 0) {
      setUserFarms(farms);
      if (source === "farmsxos") {
          setRackSelectionOpen(true);
      } else {
        setFarmDetailsOpen(true);
      }
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

  const handleRackSelectionConfirm = async (selections: CropSelection[], plantResponse?: any) => {
  
  setRackSelectionOpen(false);
  
  if (plantResponse) {
    setGrowCycleData(plantResponse); 
    setShowGrowCycle(true);            
    dispatch(clearBasket());
  }
};

  const plantCropsWithSelections = async (selections: CropSelection[]) => {
    setLoadingFarms(true);
    try {
      const response = await api.post('/api/cropcycle/plant', {
        farmId: selectedFarmId,
        cropSelections: selections
      });

      dispatch(clearBasket());
      setGrowCycleData(response.data);
      setShowGrowCycle(true);
    } catch (err: any) {
      const status = err.response?.status || 500;
      const message = err.response?.data?.message || "Something went wrong";
      setGrowCycleData({ message, statusCode: status });
      setShowGrowCycle(true);
    } finally {
      setLoadingFarms(false);
    }
  };

  const handleFarmDetailsConfirm = () => {
    setFarmDetailsOpen(false);
    setRackSelectionOpen(true);
  };
 
  const triggerCycleFromDashboard = async () => {
    if (!selectedFarmId) {
      alert("No valid farm selected to start cycle.");
      return;
    }

    setAIModalOpen(false);
    setRackSelectionOpen(true);
  };

  const handleCloseGrowCycle = () => {
    setShowGrowCycle(false);
    setGrowCycleData(null);
    setAIModalOpen(false);
    setFarmDetailsOpen(false);
    setRackSelectionOpen(false);
  };

  // Add useEffect to listen for successful navigation or component unmount
  useEffect(() => {
    // If growCycleData indicates success and user navigates away, reset state
    if (growCycleData && (!growCycleData.statusCode || growCycleData.statusCode < 400)) {
      // For successful grow cycle, we might want to keep it shown
      // until user explicitly navigates away
    }
  }, [growCycleData]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#fff",
        fontFamily: "Poppins",
      }}
    >
      {/* Top Section */}
      <div
        style={{
          width: "90%",
          maxWidth: "80rem",
          padding: "2rem 0",
          textAlign: "left",
          marginBottom: "10%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#ff5e00",
            cursor: "pointer",
          }}
          onClick={() => {
            if (source === "farmsxos") {  
              router.push(`/farmsxos/addcrop?farmId=${selectedFarmId}&region=${region}`);
            } else {  
              router.push("/markettrend?tab=crop-insights");
            }
          }}
        >
          <IconButton>
            <Image src="/apps/back.svg" width={24} height={24} alt="Back" />
          </IconButton>
          Go Back
        </div>
 
        <b style={{ fontSize: "3rem", lineHeight: "116.7%" }}>Grow Basket</b>
 
        <Box sx={{ fontSize: "1.25rem" }}>
          <div
            style={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
              paddingBottom: "0.5rem",
              fontWeight: "600",
            }}
          >
            Crops
          </div>
 
          {crops.map((crop, index) => (
            <div
              key={index}
              style={{
                marginTop: "1rem",
                borderRadius: "8px",
                backgroundColor: "#fff",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* 🥬 Crop Image */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "1px solid #ddd",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={`/apps/crop_icons/${crop.name}_${crop.variety}_${crop.crop_type.toLowerCase().replace(/-/g, "_")}.svg`}
                    alt={crop.name}
                    width={48}
                    height={48}
                    style={{ objectFit: "cover" }}
                  />
                </Box>
 
                {/* Crop Info */}
                <Box>
                  <Box sx={{ fontWeight: 500 }}>
                    {formatUnderscoreString(crop.name)}
                  </Box>
                  <Box sx={{ fontSize: "0.875rem", color: "rgba(0,18,25,0.6)" }}>
                    Variety: {formatUnderscoreString(crop.variety)} | Crop Type: {crop.crop_type} | Growth Cycle: {crop.growthCycle} | Yield Potential: {crop.yieldPotential}
                  </Box>
                </Box>
              </Box>
 
              <IconButton onClick={() => handleDelete(index)}>
                <Image src="/apps/growbasketdelete.svg" width={24} height={24} alt="Delete" />
              </IconButton>
            </div>
          ))}
        </Box>
      </div>
 
      {/* Bottom CTA */}
      {(!showGrowCycle || growCycleData == null) && crops.length > 0 && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "1rem 0",
            position: "fixed",
            bottom: 0,
            backgroundColor: "#fff",
            boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            onClick={handleOpenAIModal}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ff5e00",
              borderRadius: "4px",
              padding: "0.75rem 1.5rem",
              color: "white",
              fontWeight: "500",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            GET AI Driven Plan
          </div>
        </div>
      )}

      {/* AI Plan Modal */}
      <MuiModal open={isAIModalOpen} onClose={handleCloseAIModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", outline: "none" }}>
          <AiplanModal
            onClose={handleCloseAIModal}
            onConfirm={handleConfirmAI}
            source={source}
            onDashboardCycleStart={triggerCycleFromDashboard}
            cropName={crops[0]?.name}
            cropVariety={crops[0]?.variety}
            cropType={crops[0]?.crop_type}
          />
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
              setTimeout(() => {
                setAIModalOpen(true);
              }, 200);
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
            selectedCrops={crops}
            onClose={() => setFarmDetailsOpen(false)}
            onConfirm={(farm) => {
              console.log("✅ Confirmed Farm:", farm);
              handleFarmDetailsConfirm();
            }}
            onGrowCycleStart={(data) => {
              setFarmDetailsOpen(false);
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

      {/* Rack & Shelf Selection Modal */}
      <RackShelfSelectionModal
        open={isRackSelectionOpen}
        onClose={() => setRackSelectionOpen(false)}
        farmId={Number(selectedFarmId) || 0}
        crops={crops.map(crop => ({
          name: crop.name,
          variety: crop.variety,
          crop_type: crop.crop_type
        }))}
        onConfirm={handleRackSelectionConfirm}
      />
 
      {/* Grow Cycle Success Screen */}
      {showGrowCycle && growCycleData && (
        <Growcyclestart data={growCycleData} onClose={handleCloseGrowCycle} />
      )}
 
      {/* Loading Spinner */}
      {loadingFarms && (
        <MuiModal open={true}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress />
          </Box>
        </MuiModal>
      )}
    </div>
  );
};
 
export default ContentWithCTA;