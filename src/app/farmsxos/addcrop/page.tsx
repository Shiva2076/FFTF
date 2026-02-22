"use client";
import { useEffect, useState, useMemo } from "react";
import type { NextPage } from "next";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Stack,
  OutlinedInput
} from "@mui/material";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import { api } from "@/constants";
import { useDispatch } from "react-redux";
import { addCrop, setFarmId } from "../../slices/growBasketSlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatUnderscoreString } from "@/utils/Capitalize";

interface CropData {
  crop: string;
  variety: string;
  crop_type: string;
  growth_time: string;
  harvest_time: string;
  average_yield: string;
  ideal_temp: string;
  ideal_humidity: string;
}

const Addcrop: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [crops, setCrops] = useState<CropData[]>([]);
  const [selectedCrops, setSelectedCrops] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  
  // -- Filter State --
  const [filters, setFilters] = useState({
    crop: "",
    variety: "",
    crop_type: ""
  });

  const searchParams = useSearchParams();
  const selectedFarmId = searchParams.get("farmId") || "";
  const region = searchParams.get("region") || "";

  useEffect(() => {
    const fetchCropData = async () => {
      try {
        const response = await api.get(`/api/sop/getcalculatedparams?region=${region}`);
        console.log(response.data.data);
        setCrops(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch crops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCropData();
  }, [region]);

  const toggleCropSelection = (id: number) => {
    setSelectedCrops(prev =>
      prev.includes(id)
        ? prev.filter(cropId => cropId !== id)
        : [...prev, id]
    );
  };

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({ crop: "", variety: "", crop_type: "" });
  };

  // -- Derived Data for Dropdowns (Unique Values) --
  const filterOptions = useMemo(() => {
    const uniqueCrops = Array.from(new Set(crops.map(c => c.crop))).filter(Boolean);
    const uniqueVarieties = Array.from(new Set(crops.map(c => c.variety))).filter(Boolean);
    const uniqueTypes = Array.from(new Set(crops.map(c => c.crop_type))).filter(Boolean);
    return { uniqueCrops, uniqueVarieties, uniqueTypes };
  }, [crops]);

  // -- Filtering Logic --
  // We map originalIndex here so that even when the list is filtered, 
  // clicking an item selects the correct index in the master 'crops' array.
  const filteredCrops = useMemo(() => {
    return crops
      .map((crop, index) => ({ ...crop, originalIndex: index }))
      .filter(item => {
        const matchCrop = !filters.crop || item.crop === filters.crop;
        const matchVariety = !filters.variety || item.variety === filters.variety;
        const matchType = !filters.crop_type || item.crop_type === filters.crop_type;
        return matchCrop && matchVariety && matchType;
      });
  }, [crops, filters]);

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

  const handleAddToGrowBasket = () => {
    dispatch(setFarmId(selectedFarmId));
    const selectedCropData = selectedCrops.map(index => crops[index]);

    selectedCropData.forEach(crop => {
      const cropKey = crop.crop.toLowerCase();
      const growthInfo = cropDataMap[cropKey] || {
        growthCycle: crop.growth_time || "N/A",
        yieldPotential: crop.average_yield || "N/A",
      };

      const cropInfo = {
        name: crop.crop,
        variety: crop.variety,
        crop_type: crop.crop_type,
        growthCycle: crop.growth_time,
        yieldPotential: growthInfo.yieldPotential,
      };

      dispatch(addCrop(cropInfo));
    });

    router.push(`/markettrend/grow-basket?source=farmsxos&region=${region}`);
  };

  // Helper to style placeholder text
  const renderPlaceholder = (selected: string, placeholder: string) => {
    if (!selected) {
      return <Typography component="span" sx={{ color: "text.secondary", opacity: 0.7 }}>{placeholder}</Typography>;
    }
    return formatUnderscoreString(selected);
  };

  return (
    <div style={{
      width: "100%",
      padding: "2rem",
      paddingBottom: "6rem",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      fontFamily: "Poppins"
    }}>
      {/* Header */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <Box
          component={Link}
          href="/farmsxos"
          sx={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
        >
          <ChevronLeftRoundedIcon sx={{ fontSize: "2.5rem", color: "#FF5E00" }} />
          <Typography variant="h6" sx={{ color: "#FF5E00", fontWeight: 500 }}>
            Go Back
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#001219", marginTop: "0.25rem" }}>
          Crop Selection
        </Typography>
      </Box>

      {/* -- FILTERS SECTION -- */}
      {!loading && (
        <Box 
          sx={{ 
            backgroundColor: "#fff", 
            p: 2, 
            borderRadius: 2, 
            boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid rgba(0,0,0,0.08)"
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
            
            {/* CROP NAME FILTER */}
            <FormControl size="small" sx={{ minWidth: 200, width: { xs: "100%", md: "auto" } }}>
              <InputLabel shrink>Crop Name</InputLabel> 
              <Select
                value={filters.crop}
                onChange={(e) => handleFilterChange("crop", e.target.value)}
                displayEmpty
                renderValue={(selected) => renderPlaceholder(selected, "Select Crop Name")}
                input={<OutlinedInput label="Crop Name" notched />}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {filterOptions.uniqueCrops.map((c) => (
                  <MenuItem key={c} value={c}>{formatUnderscoreString(c)}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* VARIETY FILTER */}
            <FormControl size="small" sx={{ minWidth: 200, width: { xs: "100%", md: "auto" } }}>
              <InputLabel shrink>Variety</InputLabel>
              <Select
                value={filters.variety}
                onChange={(e) => handleFilterChange("variety", e.target.value)}
                displayEmpty
                renderValue={(selected) => renderPlaceholder(selected, "Select Variety")}
                input={<OutlinedInput label="Variety" notched />}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {filterOptions.uniqueVarieties.map((v) => (
                  <MenuItem key={v} value={v}>{formatUnderscoreString(v)}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* CROP TYPE FILTER */}
            <FormControl size="small" sx={{ minWidth: 200, width: { xs: "100%", md: "auto" } }}>
              <InputLabel shrink>Crop Type</InputLabel>
              <Select
                value={filters.crop_type}
                onChange={(e) => handleFilterChange("crop_type", e.target.value)}
                displayEmpty
                renderValue={(selected) => renderPlaceholder(selected, "Select Crop Type")}
                input={<OutlinedInput label="Crop Type" notched />}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {filterOptions.uniqueTypes.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* CLEAR FILTERS BUTTON */}
            {(filters.crop || filters.variety || filters.crop_type) && (
              <Button 
                variant="text" 
                startIcon={<FilterAltOffOutlinedIcon />}
                onClick={clearFilters}
                sx={{ color: "#FF5E00", fontWeight: 500, textTransform: "none" }}
              >
                Clear Filters
              </Button>
            )}

            <Typography variant="body2" sx={{ ml: "auto !important", color: "text.secondary" }}>
              Showing {filteredCrops.length} results
            </Typography>
          </Stack>
        </Box>
      )}

      {/* Crop Cards */}
      {loading ? (
         <LoadingSpinner />
      ) : (
        <Box sx={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)"
          },
          gap: "1rem",
          padding: "1rem"
        }}>
          {filteredCrops.length > 0 ? (
            filteredCrops.map((crop) => {
              const isSelected = selectedCrops.includes(crop.originalIndex);
              return (
                <Box
                  key={crop.originalIndex}
                  sx={{
                    width: "100%",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    position: "relative",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }
                  }}
                  onClick={() => toggleCropSelection(crop.originalIndex)}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "0.75rem",
                      left: "0.75rem",
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "4px",
                      backgroundColor: isSelected ? "#001219" : "#fff",
                      border: "2px solid rgba(0, 18, 25, 0.87)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 2,
                      transition: "background-color 0.2s"
                    }}
                  >
                    {isSelected && (
                      <CheckOutlinedIcon sx={{ fontSize: "1.2rem", color: "#fff" }} />
                    )}
                  </Box>
                  <Box
                    sx={{
                      height: "12.5rem",
                      backgroundImage: `url('/apps/crop_icons/${crop.crop.toLowerCase()}_${crop.variety.toLowerCase()}_${crop.crop_type.toLowerCase().replace(/-/g, "_")}.svg')`,
                      backgroundSize: "80%",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center"
                    }}
                  />
                  <Box sx={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem", flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#001219" }}>
                      {formatUnderscoreString(crop.crop)}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Variety</Typography>
                      <Typography variant="body2" fontWeight={500}>{formatUnderscoreString(crop.variety)}</Typography>
                    </Box>
                     <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Type</Typography>
                      <Typography variant="body2" fontWeight={500}>{crop.crop_type}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Growth</Typography>
                      <Typography variant="body2">{crop.growth_time}</Typography>
                    </Box> 
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No crops match your filters.
              </Typography>
              <Button onClick={clearFilters} sx={{ mt: 2, color: "#FF5E00" }}>
                Reset Filters
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Grow Basket Footer */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        fontFamily: "Poppins, sans-serif",
        zIndex: 999,
        padding: "0.75rem 1rem",
      }}>
        <div style={{
          maxWidth: "720px",
          margin: "0 2rem 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "1rem",
        }}>
          <span style={{
            color: "#001219",
            fontWeight: 500,
            fontSize: "0.875rem",
          }}>
            {selectedCrops.length} Crop{selectedCrops.length !== 1 && "s"} Selected
          </span>
          <button
            onClick={selectedCrops.length > 0 ? handleAddToGrowBasket : undefined}
            disabled={selectedCrops.length === 0}
            style={{
              backgroundColor: selectedCrops.length > 0 ? "#FF5E00" : "#ccc",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.75rem",
              padding: "0.5rem 1.5rem",
              border: "none",
              borderRadius: "6px",
              boxShadow: selectedCrops.length > 0 ? "0px 2px 4px rgba(0, 0, 0, 0.15)" : "none",
              cursor: selectedCrops.length > 0 ? "pointer" : "not-allowed",
              textTransform: "uppercase",
            }}
          >
            Add to Grow Basket
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addcrop;