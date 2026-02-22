"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import ProtectedBlurWrapper from "@/components/Markettrend/ProtectedBlurWrapper";
import { CropByRegion } from "@/app/slices/cropsByRegionSlice";
import { api } from "@/constants";
import { formatUnderscoreString } from "@/utils/Capitalize";
import { MarketPriceTrendItem, YouTubeSentiment, TopPerformingCropsData, MarketDistributionByRegionData, DistributionByProductTypeData, MarketPlayersByCategoryData } from "./pdfHelpers";
import { generateMarketTrendPdf, normalizeCropName, normalizeVariety } from "./pdfGenerator";
import HiddenPdfCharts from "./HiddenPdfCharts";

interface LocationOption {
  country: string;
  city: string;
  meta_data?: any;
}

type MarketPriceTrendsResponse = MarketPriceTrendItem[] | { data?: MarketPriceTrendItem[]; [key: string]: any } | null | undefined;

interface MarkettrendReportModalProps {
  open: boolean;
  onClose: () => void;
  locations: LocationOption[];
  selectedCountry: string;
  selectedCity: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
  cropOptions: CropByRegion[];
  selectedCropType: string;
  onCropTypeChange: (cropType: string) => void;
  lockMicrogreens: boolean;
}

// Create a unique key for a crop
const getCropKey = (crop: { crop_name: string; crop_variety: string }) => 
  `${crop.crop_name}-${crop.crop_variety}`;

// Helper to normalize marketPriceTrends data to array
const normalizeMarketPriceTrends = (data: MarketPriceTrendsResponse): MarketPriceTrendItem[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
    return data.data;
  }
  return [];
};

const MarkettrendReportModal: React.FC<MarkettrendReportModalProps> = ({
  open,
  onClose,
  locations,
  selectedCountry,
  selectedCity,
  onCountryChange,
  onCityChange,
  cropOptions,
  selectedCropType,
  onCropTypeChange,
  lockMicrogreens,
}) => {
  const { currency = "AED", weight = "kg" } = useSelector((state: RootState) => state.locationMeta || {});
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const isAuthenticated = Boolean(userInfo?.user_id);
  const ismarkettrendsubscribed = Boolean(userInfo?.markettrendsubscribed);

  const [country, setCountry] = useState(selectedCountry);
  const [city, setCity] = useState(selectedCity);
  const [modalCropType, setModalCropType] = useState(selectedCropType);
  const [modalCropOptions, setModalCropOptions] = useState<CropByRegion[]>(cropOptions);
  const [marketPriceTrends, setMarketPriceTrends] = useState<MarketPriceTrendItem[]>([]);
  const [youtubeSentiments, setYoutubeSentiments] = useState<YouTubeSentiment[]>([]);
  const [topPerformingCrops, setTopPerformingCrops] = useState<TopPerformingCropsData | null>(null);
  const [marketDistributionByRegion, setMarketDistributionByRegion] = useState<MarketDistributionByRegionData | null>(null);
  const [distributionByProductType, setDistributionByProductType] = useState<DistributionByProductTypeData | null>(null);
  const [marketPlayersByCategory, setMarketPlayersByCategory] = useState<MarketPlayersByCategoryData | null>(null);
  const [selectedCropKeys, setSelectedCropKeys] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  // Only initialize when modal first opens, not on every prop change
  useEffect(() => {
    if (open && !hasInitialized) {
      setCountry(selectedCountry);
      setCity(selectedCity);
      setModalCropType(selectedCropType);
      setModalCropOptions(cropOptions);
      setSelectedCropKeys([]);
      setError(null);
      setHasInitialized(true);
    } else if (!open) {
      setHasInitialized(false);
      setSelectedCropKeys([]);
    }
  }, [open, hasInitialized, selectedCropType, cropOptions]);

  // Reset selected crops and market trends when crop type or city changes
  useEffect(() => {
    setSelectedCropKeys([]);
    setMarketPriceTrends([]); // Also reset trends to avoid stale data
  }, [modalCropType, city]);

  // Fetch crops and market price trends when city or crop type changes in the modal
  useEffect(() => {
    if (!open || !city || !modalCropType) return;

    const fetchDataForTypeAndCity = async () => {
      setIsFetchingData(true);
      try {
        const response = await api.get("/api/marketstatistics", {
          params: {
            region: city,
            crop_type: modalCropType,
          },
        });

        if (response.data?.cropsByRegion) {
          setModalCropOptions(response.data.cropsByRegion);
        }
        if (response.data?.marketPriceTrends) {
          // Normalize the data to always be an array
          const normalizedTrends = normalizeMarketPriceTrends(response.data.marketPriceTrends);
          console.log(`Loaded ${normalizedTrends.length} market price trends for ${modalCropType}`);
          setMarketPriceTrends(normalizedTrends);
        } else {
          console.log(`No market price trends found for ${modalCropType}`);
          setMarketPriceTrends([]);
        }
        
        // Fetch youtube sentiments for social trends
        if (response.data?.youtubeSentiments && Array.isArray(response.data.youtubeSentiments)) {
          console.log(`Loaded ${response.data.youtubeSentiments.length} youtube sentiments`);
          setYoutubeSentiments(response.data.youtubeSentiments);
        } else {
          setYoutubeSentiments([]);
        }
        
        // Fetch top performing crops
        if (response.data?.topPerformingCrops) {
          console.log(`Loaded top performing crops data`);
          setTopPerformingCrops(response.data.topPerformingCrops);
        } else {
          setTopPerformingCrops(null);
        }
        
        // Fetch market distribution by region
        if (response.data?.marketDistributionByRegion) {
          console.log(`Loaded market distribution by region data`);
          setMarketDistributionByRegion(response.data.marketDistributionByRegion);
        } else {
          setMarketDistributionByRegion(null);
        }
        
        // Fetch distribution by product type (Microgreens)
        if (response.data?.distributionByProductType) {
          console.log(`Loaded distribution by product type data`);
          setDistributionByProductType(response.data.distributionByProductType);
        } else {
          setDistributionByProductType(null);
        }
        
        // Fetch market players by category (Leafy Greens)
        if (response.data?.marketPlayersByCategory) {
          console.log(`Loaded market players by category data`);
          setMarketPlayersByCategory(response.data.marketPlayersByCategory);
        } else {
          setMarketPlayersByCategory(null);
        }
      } catch (error) {
        console.error("Error fetching data for modal:", error);
        setMarketPriceTrends([]);
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchDataForTypeAndCity();
  }, [open, city, modalCropType]);

  const handleCountrySelect = (newCountry: string) => {
    setCountry(newCountry);
    // Only update local state, don't call parent callback
    const firstCity = locations.find((l) => l.country === newCountry)?.city;
    if (firstCity) {
      setCity(firstCity);
    }
  };

  const handleCitySelect = (newCity: string) => {
    setCity(newCity);
    // Only update local state, don't call parent callback
  };

  const availableCountries = useMemo(() => [...new Set(locations.map((l) => l.country))], [locations]);

  const citiesForCountry = useMemo(
    () => locations.filter((l) => l.country === country),
    [locations, country]
  );

  // Handle crop selection (max 3 crops)
  const MAX_CROPS = 3;
  const handleCropToggle = (cropKey: string) => {
    setSelectedCropKeys((prev) => {
      if (prev.includes(cropKey)) {
        return prev.filter((key) => key !== cropKey);
      }
      // Only add if under the limit
      if (prev.length >= MAX_CROPS) {
        return prev;
      }
      return [...prev, cropKey];
    });
  };

  // Filter crops and trends based on selection
  const getFilteredData = () => {
    if (selectedCropKeys.length === 0) {
      return { filteredCrops: [], filteredTrends: [] };
    }

    const filteredCrops = modalCropOptions.filter((crop) =>
      selectedCropKeys.includes(getCropKey(crop))
    );

    // Filter trends - handle both cropName and crop property names
    // selectedCropKeys are in format: "crop_name-crop_variety" (e.g., "kale-red_russian")
    // marketPriceTrends use cropName and variety (e.g., cropName: "kale", variety: "red russian")
    // MarketPriceTrend builds IDs as: `${item.cropName.toLowerCase()}-${(item.variety || 'general').toLowerCase()}`
    const filteredTrends = Array.isArray(marketPriceTrends) 
      ? marketPriceTrends.filter((trend) => {
          const trendCropName = normalizeCropName(trend.cropName || trend.crop);
          const trendVariety = normalizeVariety(trend.variety);
          
          // Check if any selected crop key matches
          const isMatch = selectedCropKeys.some(key => {
            const [cropName, ...varietyParts] = key.split('-');
            const variety = varietyParts.join('-'); // Handle varieties with dashes
            const searchCropName = normalizeCropName(cropName);
            const searchVariety = normalizeVariety(variety);
            const match = trendCropName === searchCropName && trendVariety === searchVariety;
            if (!match) {
              console.log(`Comparing: trend(${trendCropName}, ${trendVariety}) vs search(${searchCropName}, ${searchVariety})`);
            }
            return match;
          });
          return isMatch;
        })
      : [];

    console.log('Selected crop keys:', selectedCropKeys);
    console.log('Market price trends:', marketPriceTrends.map(t => `${t.cropName || t.crop}-${t.variety}`));
    console.log('Filtered trends:', filteredTrends.map(t => `${t.cropName || t.crop}-${t.variety}`));

    return { filteredCrops, filteredTrends };
  };

  const handleDownload = async () => {
    if (selectedCropKeys.length === 0) {
      setError("Please select at least one crop.");
      return;
    }
    
    // Check if we have market price trends data
    if (marketPriceTrends.length === 0) {
      setError("Market price trend data is still loading. Please wait a moment and try again.");
      return;
    }
    
    setError(null);
    setIsGenerating(true);

    // Get filtered data based on selected crops
    const { filteredCrops, filteredTrends } = getFilteredData();
    
    console.log('Generating PDF with:', {
      cropType: modalCropType,
      selectedCrops: selectedCropKeys,
      filteredTrendsCount: filteredTrends.length,
      marketPriceTrendsCount: marketPriceTrends.length
    });

    try {
      // Wait a bit for the hidden content to render
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate PDF using the separate generator module
      await generateMarketTrendPdf(
        {
          country,
          city,
          cropType: modalCropType,
          currency,
          weight,
        },
        {
          filteredCrops,
          filteredTrends,
          selectedCropKeys,
          youtubeSentiments,
          topPerformingCrops: topPerformingCrops || undefined,
          marketDistributionByRegion: marketDistributionByRegion || undefined,
          distributionByProductType: distributionByProductType || undefined,
          marketPlayersByCategory: marketPlayersByCategory || undefined,
        },
        pdfContentRef as React.RefObject<HTMLDivElement>
      );
      // Close modal after successful download
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Failed to generate PDF:", errorMessage);
      setError(`Failed to generate PDF: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>Download MarketTrend PDF</DialogTitle>
      <DialogContent dividers sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography sx={{ mb: 2, color: "rgba(0, 18, 25, 0.6)", fontSize: { xs: "0.85rem", sm: "1rem" } }}>
          Choose a location and crop type to download a PDF report of Crops and Market Price Trends.
        </Typography>

        {/* Crop Type Selection - Full width on mobile */}
        <Box sx={{ 
          display: "flex", 
          gap: { xs: "0.5rem", sm: "0.75rem" }, 
          mb: 2, 
          flexWrap: "wrap",
          "& > *": {
            flex: { xs: "1 1 calc(50% - 0.25rem)", sm: "0 0 auto" },
            minWidth: { xs: "auto", sm: "auto" },
          }
        }}>
          <Box
            onClick={() => setModalCropType("Leafy-Greens")}
            sx={{
              cursor: "pointer",
              px: { xs: 2, sm: 3 },
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: "0.8rem", sm: "0.85rem" },
              fontWeight: modalCropType === "Leafy-Greens" ? 800 : 600,
              border: `1px solid ${modalCropType === "Leafy-Greens" ? "#008756" : "rgba(0,0,0,0.12)"}`,
              borderRadius: 1,
              bgcolor: modalCropType === "Leafy-Greens" ? "rgba(0,135,86,0.08)" : "#fff",
              color: modalCropType === "Leafy-Greens" ? "#008756" : "inherit",
              transition: "all 0.2s ease-in-out",
              textAlign: "center",
            }}
          >
            Leafy Greens
          </Box>

          <Tooltip title={lockMicrogreens ? "Microgreens data is currently only available for Dubai" : ""} arrow>
            <Box
              onClick={() => {
                if (!lockMicrogreens) setModalCropType("Microgreens");
              }}
              sx={{
                cursor: lockMicrogreens ? "not-allowed" : "pointer",
                px: { xs: 2, sm: 3 },
                py: { xs: 0.75, sm: 1 },
                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                fontWeight: modalCropType === "Microgreens" ? 800 : 600,
                border: `1px solid ${
                  modalCropType === "Microgreens"
                    ? "#008756"
                    : lockMicrogreens
                      ? "rgba(0,0,0,0.06)"
                      : "rgba(0,0,0,0.12)"
                }`,
                borderRadius: 1,
                bgcolor:
                  modalCropType === "Microgreens"
                    ? "rgba(0,135,86,0.08)"
                    : lockMicrogreens
                      ? "rgba(0,0,0,0.02)"
                      : "#fff",
                color:
                  modalCropType === "Microgreens"
                    ? "#008756"
                    : lockMicrogreens
                      ? "rgba(0,0,0,0.3)"
                      : "inherit",
                transition: "all 0.2s ease-in-out",
                opacity: lockMicrogreens ? 0.6 : 1,
                textAlign: "center",
              }}
            >
              Microgreens
            </Box>
          </Tooltip>
        </Box>

        {/* Country/City Selection - Stack on mobile */}
        <Box 
          display="grid" 
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} 
          gap={{ xs: 1.5, sm: 2 }} 
          sx={{ mb: 2 }}
        >
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>Country</InputLabel>
            <Select
              label="Country"
              value={country}
              onChange={(e) => {
                const newCountry = String(e.target.value);
                handleCountrySelect(newCountry);
              }}
              sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
            >
              {availableCountries.map((c) => (
                <MenuItem key={c} value={c} sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>City</InputLabel>
            <Select
              label="City"
              value={city}
              onChange={(e) => {
                const newCity = String(e.target.value);
                handleCitySelect(newCity);
              }}
              sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
            >
              {citiesForCountry.map((loc) => (
                <MenuItem key={loc.city} value={loc.city} sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
                  {loc.city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Crop Selection — first 3 crops visible; rest behind blur (Sign In / Get Full Access) */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 600, mb: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
            Select Crops
            <Typography component="span" sx={{ fontWeight: 400, color: selectedCropKeys.length >= MAX_CROPS ? "#ff5e00" : "rgba(0,0,0,0.6)", ml: 1, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
              ({selectedCropKeys.length}/{MAX_CROPS} selected)
            </Typography>
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, color: "rgba(0,0,0,0.6)", mb: 1 }}>
            Select up to {MAX_CROPS} crops to include in the PDF report:
          </Typography>

          {isFetchingData ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <CircularProgress size={24} />
              <Typography sx={{ mt: 1, fontSize: { xs: "0.8rem", sm: "0.875rem" }, color: "rgba(0,0,0,0.6)" }}>
                Loading crops...
              </Typography>
            </Box>
          ) : modalCropOptions.length === 0 ? (
            <Alert severity="info" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
              No crops available for {modalCropType} in {city}
            </Alert>
          ) : (
            <Box sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
              gap: { xs: 0.5, sm: 1 },
              maxHeight: { xs: "180px", sm: "200px" },
              overflowY: "auto",
              p: { xs: 0.75, sm: 1 },
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 1,
            }}>
              {modalCropOptions.slice(0, 3).map((crop) => {
                const cropKey = getCropKey(crop);
                const isSelected = selectedCropKeys.includes(cropKey);
                const isDisabled = !isSelected && selectedCropKeys.length >= MAX_CROPS;
                return (
                  <FormControlLabel
                    key={cropKey}
                    disabled={isDisabled}
                    control={
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleCropToggle(cropKey)}
                        size="small"
                        disabled={isDisabled}
                        sx={{
                          color: isDisabled ? "rgba(0,0,0,0.26)" : "#008756",
                          "&.Mui-checked": { color: "#008756" },
                          "&.Mui-disabled": { color: "rgba(0,0,0,0.26)" },
                          p: { xs: 0.5, sm: 1 },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, lineHeight: 1.3, color: isDisabled ? "rgba(0,0,0,0.38)" : "inherit" }}>
                        {crop.crop_name.charAt(0).toUpperCase() + crop.crop_name.slice(1)} ({formatUnderscoreString(crop.crop_variety)})
                      </Typography>
                    }
                    sx={{
                      m: 0,
                      p: { xs: 0.25, sm: 0.5 },
                      borderRadius: 1,
                      bgcolor: isSelected ? "rgba(0,135,86,0.08)" : "transparent",
                      opacity: isDisabled ? 0.6 : 1,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      "&:hover": { bgcolor: isDisabled ? "transparent" : "rgba(0,0,0,0.04)" },
                    }}
                  />
                );
              })}
              {modalCropOptions.length > 3 && (
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <ProtectedBlurWrapper>
                    <Box sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                      gap: { xs: 0.5, sm: 1 },
                    }}>
                      {modalCropOptions.slice(3).map((crop) => {
                        const cropKey = getCropKey(crop);
                        const isSelected = selectedCropKeys.includes(cropKey);
                        const isDisabled = !isSelected && selectedCropKeys.length >= MAX_CROPS;
                        return (
                          <FormControlLabel
                            key={cropKey}
                            disabled={isDisabled}
                            control={
                              <Checkbox
                                checked={isSelected}
                                onChange={() => handleCropToggle(cropKey)}
                                size="small"
                                disabled={isDisabled}
                                sx={{
                                  color: isDisabled ? "rgba(0,0,0,0.26)" : "#008756",
                                  "&.Mui-checked": { color: "#008756" },
                                  "&.Mui-disabled": { color: "rgba(0,0,0,0.26)" },
                                  p: { xs: 0.5, sm: 1 },
                                }}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, lineHeight: 1.3, color: isDisabled ? "rgba(0,0,0,0.38)" : "inherit" }}>
                                {crop.crop_name.charAt(0).toUpperCase() + crop.crop_name.slice(1)} ({formatUnderscoreString(crop.crop_variety)})
                              </Typography>
                            }
                            sx={{
                              m: 0,
                              p: { xs: 0.25, sm: 0.5 },
                              borderRadius: 1,
                              bgcolor: isSelected ? "rgba(0,135,86,0.08)" : "transparent",
                              opacity: isDisabled ? 0.6 : 1,
                              cursor: isDisabled ? "not-allowed" : "pointer",
                              "&:hover": { bgcolor: isDisabled ? "transparent" : "rgba(0,0,0,0.04)" },
                            }}
                          />
                        );
                      })}
                    </Box>
                  </ProtectedBlurWrapper>
                </Box>
              )}
            </Box>
          )}
        </Box>

        <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 600, mb: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}>Report Contents</Typography>
          <Typography sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, color: "rgba(0,0,0,0.6)", mb: 1 }}>
            The PDF report will include the following sections for selected crops:
          </Typography>
          <Stack 
            direction="row" 
            spacing={{ xs: 0.5, sm: 1 }} 
            flexWrap="wrap" 
            useFlexGap
            sx={{ gap: { xs: 0.5, sm: 1 } }}
          >
            <Chip label="Crops Overview" size="small" sx={{ bgcolor: "rgba(0,135,86,0.1)", color: "#008756", fontSize: { xs: "0.7rem", sm: "0.8rem" } }} />
            <Chip label="Top Performing Crops" size="small" sx={{ bgcolor: "rgba(0,135,86,0.1)", color: "#008756", fontSize: { xs: "0.7rem", sm: "0.8rem" } }} />
            <Chip label="Market Price Trends" size="small" sx={{ bgcolor: "rgba(0,135,86,0.1)", color: "#008756", fontSize: { xs: "0.7rem", sm: "0.8rem" } }} />
            <Chip label="Social Trends (Chef's Choice)" size="small" sx={{ bgcolor: "rgba(0,135,86,0.1)", color: "#008756", fontSize: { xs: "0.7rem", sm: "0.8rem" } }} />
          </Stack>
        </Box>

        {selectedCropKeys.length > 0 && (
          <Alert severity="success" sx={{ mt: 2, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
            {selectedCropKeys.length} crop{selectedCropKeys.length > 1 ? 's' : ''} selected for the report
          </Alert>
        )}

        {selectedCropKeys.length === 0 && !isFetchingData && modalCropOptions.length > 0 && (
          <Alert severity="warning" sx={{ mt: 2, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
            Please select at least one crop to generate the report
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 }, gap: { xs: 1, sm: 0 } }}>
        <Button onClick={onClose} color="inherit" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDownload}
          disabled={(!isAuthenticated ) || isGenerating || isFetchingData || selectedCropKeys.length === 0}
          sx={{ 
            backgroundColor: "#ff5e00", 
            "&:hover": { backgroundColor: "#d54f00" },
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            px: { xs: 2, sm: 3 },
          }}
        >
          {isGenerating ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Download PDF"}
        </Button>
      </DialogActions>

      {/* Hidden container for rendering charts to capture in PDF */}
      <HiddenPdfCharts
        ref={pdfContentRef}
        selectedCropKeys={selectedCropKeys}
        marketPriceTrends={marketPriceTrends}
        youtubeSentiments={youtubeSentiments}
        marketDistributionByRegion={marketDistributionByRegion}
        distributionByProductType={distributionByProductType}
        marketPlayersByCategory={marketPlayersByCategory}
      />

    </Dialog>
  );
};

export default MarkettrendReportModal;
