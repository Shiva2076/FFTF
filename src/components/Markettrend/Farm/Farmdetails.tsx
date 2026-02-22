'use client';

import { FC, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  IconButton,
  CircularProgress,
  Modal,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import { api } from "@/constants";
import { useDispatch, useSelector} from 'react-redux';
import { clearBasket } from "@/app/slices/growBasketSlice";
import { setFarmId } from "@/app/slices/growBasketSlice";
import { RootState } from "@/app/store";
import RackShelfSelectionModal from "@/components/Markettrend/RackShelfSelection/RackShelfSelectionModal";

interface Farm {
  farm_id: number | string;
  farm_name: string;
  country: string;
  state: string;
  city: string;
  location: string;
  pincode: string | null;
  racks: number;
  shelves_per_rack: number;
  plugs_per_channel: number;
  channels_per_shelf: number;
  status: string;
  created_date: string;
  last_modified_date: string;
}

interface Crop {
  name: string;
  variety: string;
  rank?: number;
  [key: string]: any;
}

interface FarmDetailsModalProps {
  open: boolean;
  farms: Farm[];
  selectedCrops: Crop[];
  onClose: () => void;
  onConfirm: (selectedFarm: Farm) => void;
  onGrowCycleStart: (data: any) => void;
  onBackToAI: () => void;
  onRegisterNewFarm: () => void;
}

const FarmDetails: FC<FarmDetailsModalProps> = ({
  open,
  farms,
  selectedCrops,
  onClose,
  onConfirm,
  onGrowCycleStart,
  onBackToAI,
  onRegisterNewFarm
}) => {
  const router = useRouter();
  const [allFarms, setAllFarms] = useState<Farm[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [filteredFarms, setFilteredFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isRackSelectionOpen, setRackSelectionOpen] = useState(false);
  const [selectedFarmForRackSelection, setSelectedFarmForRackSelection] = useState<Farm | null>(null);
  const dispatch = useDispatch();
  const { basket, farmId } = useSelector((state: RootState) => state.growBasket);

  useEffect(() => {
    if (!open || !farms || farms.length === 0) return;

    setAllFarms(farms);
    const uniqueCountries = Array.from(new Set(farms.map((f) => f.country)));
    setCountries(uniqueCountries);
    const defaultCountry = uniqueCountries[0];
    setSelectedCountry(defaultCountry);

    const farmsInCountry = farms.filter((f) => f.country === defaultCountry);
    setFilteredFarms(farmsInCountry);

    const firstSetupDone = farmsInCountry.find(f => f.status === "SETUP DONE");
    if (firstSetupDone) {
      const id = Number(firstSetupDone.farm_id);
      setSelectedFarmId(id);
      dispatch(setFarmId(String(id)));
    } else {
      setSelectedFarmId(null);
      dispatch(setFarmId(""));
    }
    setFetching(false);
  }, [open, farms, dispatch]);

  useEffect(() => {
    console.log('🔍 Rack Selection Modal State:', {
      isRackSelectionOpen,
      selectedFarmId,
      farmId,
      cropsCount: (selectedCrops && selectedCrops.length > 0) ? selectedCrops.length : basket.length
    });
  }, [isRackSelectionOpen, selectedFarmId, farmId, selectedCrops, basket]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    const farmsInCountry = allFarms.filter((f) => f.country === country);
    setFilteredFarms(farmsInCountry);
    const firstSetupDone = farmsInCountry.find(f => f.status === "SETUP DONE");
    if (firstSetupDone) {
    const id = Number(firstSetupDone.farm_id);
    setSelectedFarmId(id);
    dispatch(setFarmId(String(id)));
  } else {
    setSelectedFarmId(null);
    dispatch(setFarmId(""));
   }
  };

  const handleConfirm = () => {
    console.log('🔍 handleConfirm called');
    
    if (selectedFarmId == null) {
      console.log('❌ No farm selected');
      alert('Please select a farm');
      return;
    }

    const selectedFarm = allFarms.find((farm) => Number(farm.farm_id) === selectedFarmId);
    if (!selectedFarm) {
      console.log('❌ Selected farm not found');
      alert('Selected farm not found');
      return;
    }

    if (selectedFarm.status !== "SETUP DONE") {
      alert("Farm status must be 'SETUP DONE' before proceeding.");
      return;
    }

    // Debug console logs
    const cropList = (selectedCrops && selectedCrops.length > 0)
      ? selectedCrops
      : basket;

    if (!cropList || cropList.length === 0) {
      console.log('❌ No crops selected');
      alert('Please add crops to your basket first');
      return;
    }

    // Store selected farm and open rack selection modal
    setSelectedFarmForRackSelection(selectedFarm);
    
    // Open rack selection modal - don't close farm details modal yet
    console.log('✅ Setting isRackSelectionOpen to true');
    setRackSelectionOpen(true);
    console.log('✅ Rack selection modal should now be open');
  };

  const handleRackSelectionConfirm = async (selections: any[], plantResponse?: any) => {
    console.log('🔍 handleRackSelectionConfirm called:', { selections, plantResponse });
    setRackSelectionOpen(false);
    
    // Close farm details modal now
    onClose();
    
    if (plantResponse && selectedFarmForRackSelection) {
      // Success - show grow cycle start message
      onGrowCycleStart(plantResponse);
      dispatch(clearBasket()); // ✅ Remove all crops
      onConfirm(selectedFarmForRackSelection);
    } else if (!plantResponse && selectedFarmForRackSelection) {
      // No response but we still want to close
      onConfirm(selectedFarmForRackSelection);
    }
  };

  const handleRackSelectionClose = () => {
    setRackSelectionOpen(false);
    // Don't close farm details modal if user cancels rack selection
  };
  

  return (
    <>
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          mt: '20vh',
          bgcolor: '#fff',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          fontFamily: 'Poppins',
        }}
      >
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16 }}>
          <CloseIcon />
        </IconButton>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="#008756">
                Farm Details
              </Typography>
              <Typography variant="body2" color="rgba(0, 18, 25, 0.6)">
                Please select the farm where you want to plant your crop.
              </Typography>
            </Box>
          </Box>
        </Box>

        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : allFarms.length === 0 ? (
          <Typography>No farms found. Please register one first.</Typography>
        ) : (
          <>
            <Box>
              <Typography variant="caption" color="rgba(0, 18, 25, 0.6)" mb={0.5}>
                Country
              </Typography>
              <Select
                fullWidth
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                IconComponent={ExpandMoreIcon}
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="rgba(0, 18, 25, 0.6)"
                mb={0.5}
                display="block"
              >
                Farm
              </Typography>
              <Select
                fullWidth
                value={selectedFarmId ?? ""}
                onChange={(e) => {
                  const farmId = Number(e.target.value);
                  const farm = filteredFarms.find(f => Number(f.farm_id) === farmId);
                
                  if (farm?.status !== "SETUP DONE") {
                    // prevent selection
                    return;
                  }
                
                  setSelectedFarmId(farmId);
                  dispatch(setFarmId(String(farmId)));
                }}
                IconComponent={ExpandMoreIcon}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
              >
                {filteredFarms.map((farm) => {
                  const isSetupDone = farm.status === "SETUP DONE";
                
                  return (
                    <MenuItem
                      key={farm.farm_id}
                      value={farm.farm_id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                        opacity: isSetupDone ? 1 : 0.5,
                        cursor: "default", // prevent hover selection
                      }}
                    >
                      {/* Left: Name & Icon */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography>{farm.farm_name}</Typography>
                        {isSetupDone && <CheckCircleIcon sx={{ color: "green", fontSize: 18 }} />}
                      </Box>
                    
                      {/* Right: See Status (if not setup) */}
                      {!isSetupDone && (
                        <Typography
                          onClick={(e) => {
                            e.stopPropagation();
                            sessionStorage.setItem("selectedFarm", JSON.stringify(farm));
                            router.push(`/markettrend/farm/register`);
                          }}
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            color: "#ff9c6e",
                            textDecoration: "underline",
                            cursor: "pointer",
                            "&:hover": {
                              color: "#ff5e00",
                            },
                          }}
                        >
                          See Status
                        </Typography>
                      )}
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>
          </>
        )}
        <Button
          variant="contained"
          onClick={onRegisterNewFarm}
          sx={{
            backgroundColor: '#ff5e00',
            color: '#fff',
            textTransform: 'uppercase',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#e65500',
            },
          }}
        >
          + Register New Farm
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onBackToAI}
            sx={{ textTransform: 'uppercase', fontWeight: 500 }}
          >
            Back to AI Driven Plan
          </Button>
          <Button
            variant="contained"
            fullWidth
            disabled={loading || !selectedFarmId}
            onClick={handleConfirm}
            sx={{
              textTransform: 'uppercase',
              fontWeight: 500,
              backgroundColor: '#ff5e00',
              color: '#f7f7f7',
              '&:hover': { backgroundColor: '#e65500' },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Confirm & Plants'}
          </Button>
        </Box>
      </Box>
    </Modal>
    
    {/* Rack & Shelf Selection Modal */}
    <RackShelfSelectionModal
      open={isRackSelectionOpen && (Number(selectedFarmId) || Number(farmId)) > 0}
      onClose={handleRackSelectionClose}
      farmId={Number(selectedFarmId) || Number(farmId) || 0}
      crops={(selectedCrops && selectedCrops.length > 0)
        ? selectedCrops.map(crop => ({
            name: crop.name,
            variety: crop.variety,
            crop_type: crop.crop_type
          }))
        : basket.length > 0
          ? basket.map(crop => ({
              name: crop.name,
              variety: crop.variety,
              crop_type: crop.crop_type
            }))
          : []
      }
      onConfirm={handleRackSelectionConfirm}
    />
    </>
  );
};

export default FarmDetails;
