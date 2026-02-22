"use client";

import React, { useMemo, useState, useRef } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  Checkbox,
  TablePagination,
  TableSortLabel,
  TextField,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Dialog } from '@mui/material';
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { addCrop } from "@/app/slices/growBasketSlice";
import { useRouter } from "next/navigation";
import Login from "@/components/Auth/Signin";
import Register from "@/components/Auth/Register";
import PriceModal from "@/components/Markettrend/Email/PriceModel";
import Primemember from "@/components/Markettrend/Email/Primemember";

import _ from "lodash";
import { toggleCropSelection } from "@/app/slices/cropSelectionSlice";
import { formatUnderscoreString } from "@/utils/Capitalize";

interface PricePoint {
  date: string;
  avg_price: number;
}

interface CropData {
  id: number;
  rank: number;
  city: string;
  crop_name: string;
  crop_variety: string;
  crop_type: string;
  crop_profit: number;
  crop_popularscore: number;
  crop_sustain: number;
  price_trend: string; // stored as JSON
  // Microgreens specific fields
  ease_of_growth?: number;
  nutrient_score?: number;
  // Leafy greens specific fields
  profitability_market_band_low_pct?: number;
  profitability_market_band_high_pct?: number;
  profitability_observed_high_pct?: number;
  profitability_observed_low_pct?: number;
  market_band_low?: number;
  market_band_high?: number;
  observed_low?: number;
  observed_high?: number;
}

interface Props {
  data: CropData[];
  selectedCropFilter?: string;
}

type Order = "asc" | "desc";

export default function CropInsightsAIRecommendedCrops({ data }: Props) {
  const topRef = useRef<HTMLDivElement>(null);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const { currency, weight } = useSelector((state: RootState) => state.locationMeta);
  const selectedCropFilter = useSelector((state: RootState) => state.selectedCropTypetab); 
  const isAuthenticated = Boolean(userInfo?.user_id);
  const ismarkettrendsubscribed = Boolean(userInfo?.markettrendsubscribed);
  const shouldRestrict = !isAuthenticated || !ismarkettrendsubscribed;
  const selectedCrops = useSelector((state: RootState) => state.cropSelection.selectedCrops);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<"rank" | keyof CropData | "latest_price">("rank");
  const [order, setOrder] = useState<Order>("asc"); // "asc" for rank (rank 1 is best)
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const isMicrogreens = selectedCropFilter?.toLowerCase() === "microgreens";

  const sortOptions = useMemo(() => {
    const baseOptions = [
      { value: "rank", label: "Rank" },
      { value: "crop_profit", label: "Profitability %" },
      { value: "crop_popularscore", label: "Demand Score" },
    ];

    if (isMicrogreens) {
      return [
        ...baseOptions,
        { value: "ease_of_growth", label: "Ease of Growth" },
        { value: "nutrient_score", label: "Nutrient Scores" },
        { value: "latest_price", label: "Price" }
      ];
    } else {
      return [
        ...baseOptions,
        { value: "crop_sustain", label: "Sustainability Score" },
        { value: "latest_price", label: "Price" }
      ];
    }
  }, [isMicrogreens]);

  // Pagination handlers
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 0);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Sorting handler
  const handleSort = (property: "rank" | keyof CropData | "latest_price") => {
    // If restricted, only allow sorting by rank
    if (shouldRestrict && property !== "rank") return;

    // For rank, use ascending (rank 1 is best)
    // For all other columns, use descending (highest values first)
    if (property === "rank") {
      setOrderBy(property);
      setOrder("asc");
    } else {
      setOrderBy(property);
      setOrder("desc");
    }
  };

  // Helpers
  const getLatestPrice = (trendString: string): number => {
    try {
      const parsed: PricePoint[] = JSON.parse(trendString);
      // console.log('parsed', parsed);
      return parsed?.at?.(-1)?.avg_price ?? 0;
    } catch {
      return 0;
    }
  };

  // 1) Filter
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return data.filter((item) =>
      `${item.crop_name} ${item.crop_variety}`.toLowerCase().includes(term)
    );
  }, [searchTerm, data]);

  // 2) Sort
  const sortedData = useMemo(() => {
  const sorted = [...filteredData];
  sorted.sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    if (orderBy === "rank") {
      aValue = a.rank;
      bValue = b.rank;
    } else if (orderBy === "latest_price") {
      aValue = isMicrogreens
        ? typeof a.price_trend === "string" ? getLatestPrice(a.price_trend) : 0
        : getLatestPrice(a.price_trend);
      bValue = isMicrogreens
        ? typeof b.price_trend === "string" ? getLatestPrice(b.price_trend) : 0
        : getLatestPrice(b.price_trend);
    } else if (orderBy === "crop_variety") {
      // Add variety sorting
      aValue = a.crop_variety?.toLowerCase() || '';
      bValue = b.crop_variety?.toLowerCase() || '';
    } else {
      aValue = a[orderBy] as number;
      bValue = b[orderBy] as number;
    }

    if (orderBy === "rank" || typeof aValue === "number") {
      return order === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    } else {
      // For string sorting (like variety)
      return order === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });
  return sorted;
}, [filteredData, orderBy, order, isMicrogreens]);

  // 3) Pagination
  const currentPageData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  // 4) Split visible vs hidden
  //    show top 3 rows unblurred, rest behind blur if restricted
  const visibleRows = shouldRestrict ? currentPageData.slice(0, 3) : currentPageData;
  const hiddenRows = shouldRestrict ? currentPageData.slice(3) : [];

  // For adding crops to grow basket
  const cropDataMap: Record<string, { growthCycle: string; yieldPotential: string }> = {
    lettuce: { growthCycle: "45-60 days", yieldPotential: "High" },
    arugula: { growthCycle: "30-40 days", yieldPotential: "Medium" },
    basil: { growthCycle: "50-60 days", yieldPotential: "Medium" },
    spinach: { growthCycle: "35-45 days", yieldPotential: "High" },
    pakchoi: { growthCycle: "30-40 days", yieldPotential: "Medium" },
    celery: { growthCycle: "80-100 days", yieldPotential: "Medium" },
    kale: { growthCycle: "50-65 days", yieldPotential: "High" },
    parsley: { growthCycle: "60-70 days", yieldPotential: "Medium" }
  };

  const handleAddToGrowBasket = () => {
    const selectedCropsFromSection = cropsFromThisSection;
    selectedCropsFromSection.forEach((crop) => {
      const cropKey = crop.crop_name.toLowerCase();
      const mappedData = cropDataMap[cropKey] || {
        growthCycle: "N/A",
        yieldPotential: "Medium"
      };

      const cropInfo = {
        name: crop.crop_name,
        variety: crop.crop_variety,
        crop_type: crop.crop_type,
        growthCycle: mappedData.growthCycle,
        yieldPotential: mappedData.yieldPotential,
        rank: crop.rank
      };

      dispatch(addCrop(cropInfo));
    });
    router.push("/markettrend/grow-basket");
  };
  const cropsFromThisSection = filteredData.filter(crop =>
    selectedCrops.some(selected => selected.id === crop.id)
  );
  const allCurrentPageIds = visibleRows.map((crop) => crop.id);
  const allSelectedOnPage = allCurrentPageIds.every(id => selectedCrops.some(c => c.id === id));
  const anySelectedOnPage = allCurrentPageIds.some(id => selectedCrops.some(c => c.id === id));
  return (
    <Card variant="outlined" ref={topRef}>
      <CardHeader
        title={<Typography variant="h6" fontWeight={600}>
          {isMicrogreens ? 'AI Recommended Microgreens' : 'AI Recommended Crops'}
        </Typography>}
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
            <Typography variant="body2" color="text.secondary">
              {isMicrogreens 
                ? 'Suggests best microgreens based on AI analysis' 
                : 'Suggests best crops based on AI analysis'
              } •
            </Typography>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Image src="/apps/Vector.svg" alt="calendar" width={12} height={12} />
              <Typography variant="body2" color="text.secondary">14d</Typography>
            </Box>
          </Box>
        }

        action={
          <Button
            variant="contained"
            size="small"
            onClick={handleAddToGrowBasket}
            disabled={cropsFromThisSection.length === 0 || shouldRestrict}
            sx={{
              backgroundColor: "#ff5e00",
              "&:hover": { backgroundColor: "#e65300" },
              color: "#fff"
            }}
          >
            Add to Grow Basket ({cropsFromThisSection.length})
          </Button>
        }
      />
      <CardContent sx={{ p: 2 }}>
        {/* Search and Sort */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ width: 300 }}
            disabled={shouldRestrict}
          />
          <TextField
            select
            label="Sort by"
            value={orderBy}
            onChange={(e) => handleSort(e.target.value as any)}
            size="small"
            sx={{ width: 200 }}
            disabled={shouldRestrict}
          >
            {sortOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Table sx={{ fontSize: "0.813rem" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.08)" }}>
              <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>
                <Checkbox
                  indeterminate={!allSelectedOnPage && anySelectedOnPage}
                  checked={allSelectedOnPage}
                  onChange={() => {
                    allSelectedOnPage
                      ? visibleRows.forEach((item) =>
                        dispatch(toggleCropSelection({ id: item.id, name: item.crop_name, variety: item.crop_variety, crop_type: item.crop_type }))
                      )
                      : visibleRows.forEach((item) => {
                        const exists = selectedCrops.some(c => c.id === item.id);
                        if (!exists) {
                          dispatch(toggleCropSelection({ id: item.id, name: item.crop_name, variety: item.crop_variety, crop_type: item.crop_type }));
                        }
                      });
                  }}
                />
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>
                <TableSortLabel
                active={orderBy === "rank"}
                direction={orderBy === "rank" ? order : "asc"}
                onClick={() => handleSort("rank")}
                disabled={shouldRestrict}
                >
                  Rank
                </TableSortLabel>               
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>Crop</TableCell>
              <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>Variety</TableCell>
              <TableCell align="center" sx={{ fontSize: "0.813rem", px: 0.75, minWidth: "120px" }}>
                <TableSortLabel
                  active={orderBy === "crop_profit"}
                  direction={orderBy === "crop_profit" ? order : "asc"}
                  onClick={() => !shouldRestrict && handleSort("crop_profit")}
                  disabled={shouldRestrict}
                >
                  Profitability (%)
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>
                <TableSortLabel
                  active={orderBy === "crop_popularscore"}
                  direction={orderBy === "crop_popularscore" ? order : "asc"}
                  onClick={() => !shouldRestrict && handleSort("crop_popularscore")}
                  disabled={shouldRestrict}
                >
                  Demand Score
                </TableSortLabel>
              </TableCell>
              
              {/* Microgreens specific columns */}
              {isMicrogreens ? (
                <>
                  <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>
                    <TableSortLabel
                      active={orderBy === "ease_of_growth"}
                      direction={orderBy === "ease_of_growth" ? order : "asc"}
                      onClick={() => !shouldRestrict && handleSort("ease_of_growth")}
                      disabled={shouldRestrict}
                    >
                      Ease of Growth
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>
                    <TableSortLabel
                      active={orderBy === "nutrient_score"}
                      direction={orderBy === "nutrient_score" ? order : "asc"}
                      onClick={() => !shouldRestrict && handleSort("nutrient_score")}
                      disabled={shouldRestrict}
                    >
                      Nutrient Score
                    </TableSortLabel>
                  </TableCell>
                </>
              ) : (
              <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>
                <TableSortLabel
                  active={orderBy === "crop_sustain"}
                  direction={orderBy === "crop_sustain" ? order : "asc"}
                  onClick={() => !shouldRestrict && handleSort("crop_sustain")}
                  disabled={shouldRestrict}
                >
                  Sustainability Score
                </TableSortLabel>
              </TableCell>
              )}
              
              <TableCell align="center" sx={{ fontSize: "0.813rem", px: 0.75, minWidth: "120px" }}>
                <TableSortLabel
                  active={orderBy === "latest_price"}
                  direction={orderBy === "latest_price" ? order : "asc"}
                  onClick={() => !shouldRestrict && handleSort("latest_price")}
                  disabled={shouldRestrict}
                >
                  {isMicrogreens ? "Price" : "Price Range"}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          {/* 1) Visible (unblurred) rows */}
          <TableBody>
            {visibleRows.map((item) => {
              const latestPrice = isMicrogreens
                ? (typeof item.price_trend === 'string' ? getLatestPrice(item.price_trend) : 0)
                : getLatestPrice(item.price_trend);
              const isSelected = selectedCrops.some(c => c.id === item.id);
              return (
                <TableRow key={item.id}>
                  <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>
                    <Checkbox
                      checked={isSelected}
                      onChange={() =>
                        dispatch(toggleCropSelection({
                          id: item.id,
                          name: item.crop_name,
                          variety: item.crop_variety,
                          crop_type: item.crop_type
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>
                    <Typography variant="body2">{item.rank}</Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Image
                        src={`/apps/crop_icons/${item.crop_name}_${item.crop_variety}_${item.crop_type.toLowerCase().replace(/-/g, "_")}.svg`}
                        alt={item.crop_name}
                        width={40}
                        height={40}
                        style={{ borderRadius: "50%" }}
                      />
                      <Link
                        href={`/markettrend/${item.crop_name}-${item.crop_variety}-${item.crop_type.toLowerCase().replace(/-/g, "_")}`} >
                        <Typography
                          sx={{ textDecoration: "underline", cursor: "pointer", color: "#ff5e00" }}
                        >
                          {_.capitalize(item.crop_name)}
                        </Typography>
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>{formatUnderscoreString(item.crop_variety)}</TableCell>
                  <TableCell align="center" sx={{ fontSize: "0.813rem", px: 0.75 }}>
                    {isMicrogreens ? (
                      item.crop_profit !== null && item.crop_profit !== undefined
                        ? `${item.crop_profit.toFixed(2)}` : '-'
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, whiteSpace: "nowrap" }}>
                        {item.profitability_market_band_low_pct != null && item.profitability_market_band_high_pct != null && 
                         typeof item.profitability_market_band_low_pct === 'number' && typeof item.profitability_market_band_high_pct === 'number' ? (
                          <>
                            <Box component="span" sx={{ whiteSpace: "nowrap" }}>
                              {item.profitability_market_band_low_pct.toFixed(2)} - {item.profitability_market_band_high_pct.toFixed(2)}
                            </Box>
                            {item.profitability_observed_low_pct != null && item.profitability_observed_high_pct != null &&
                             typeof item.profitability_observed_low_pct === 'number' && typeof item.profitability_observed_high_pct === 'number' && (
                              <Tooltip
                                title={
                                  <Box sx={{ p: 0.5 }}>
                                    <Typography sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                                      Profitability Observed Low: {item.profitability_observed_low_pct.toFixed(2)}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.875rem" }}>
                                      Profitability Observed High: {item.profitability_observed_high_pct.toFixed(2)}
                                    </Typography>
                                  </Box>
                                }
                                arrow
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      backgroundColor: '#fff',
                                      color: 'rgba(0, 18, 25, 0.9)',
                                      fontSize: '0.875rem',
                                      padding: '0.75rem',
                                      borderRadius: '8px',
                                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                      border: '1px solid rgba(0, 0, 0, 0.1)',
                                    }
                                  }
                                }}
                              >
                                <IconButton size="small" sx={{ p: 0.25 }}>
                                  <InfoOutlinedIcon sx={{ fontSize: "1rem", color: "rgba(0, 18, 25, 0.6)" }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        ) : (
                          item.crop_profit !== null && item.crop_profit !== undefined
                            ? `${item.crop_profit.toFixed(2)}` : '-'
                        )}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>
                    {item.crop_popularscore !== null && item.crop_popularscore !== undefined
                      ? `${item.crop_popularscore.toFixed(2)}` : '-'}
                  </TableCell>
                  
                  {/* Microgreens specific columns */}
                  {isMicrogreens ? (
                    <>
                      <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>
                        {item.ease_of_growth !== null && item.ease_of_growth !== undefined
                          ? `${item.ease_of_growth.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>
                        {item.nutrient_score !== null && item.nutrient_score !== undefined
                          ? `${item.nutrient_score.toFixed(2)}` : '-'}
                      </TableCell>
                    </>
                  ) : (
                    <TableCell align="center" sx={{ fontSize: "0.813rem", px: 1 }}>
                    {item.crop_sustain !== null && item.crop_sustain !== undefined
                      ? `${item.crop_sustain.toFixed(2)}` : '-'}
                  </TableCell>
                  )}
                  <TableCell align="center" sx={{ fontSize: "0.813rem", px: 0.75 }}>
                    {isMicrogreens ? (
                      `${currency} ${latestPrice.toFixed(2)} /punnet`
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, whiteSpace: "nowrap" }}>
                        {item.market_band_low != null && item.market_band_high != null &&
                         typeof item.market_band_low === 'number' && typeof item.market_band_high === 'number' ? (
                          <>
                            <Box component="span" sx={{ whiteSpace: "nowrap" }}>
                              {item.market_band_low} - {item.market_band_high} AED/kg
                            </Box>
                            {item.observed_low != null && item.observed_high != null &&
                             typeof item.observed_low === 'number' && typeof item.observed_high === 'number' && (
                              <Tooltip
                                title={
                                  <Box sx={{ p: 0.5 }}>
                                    <Typography sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                                      Observed Low: {item.observed_low} AED/kg
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.875rem" }}>
                                      Observed High: {item.observed_high} AED/kg
                                    </Typography>
                                  </Box>
                                }
                                arrow
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      backgroundColor: '#fff',
                                      color: 'rgba(0, 18, 25, 0.9)',
                                      fontSize: '0.875rem',
                                      padding: '0.75rem',
                                      borderRadius: '8px',
                                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                      border: '1px solid rgba(0, 0, 0, 0.1)',
                                    }
                                  }
                                }}
                              >
                                <IconButton size="small" sx={{ p: 0.25 }}>
                                  <InfoOutlinedIcon sx={{ fontSize: "1rem", color: "rgba(0, 18, 25, 0.6)" }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        ) : (
                          `${currency} ${latestPrice.toFixed(2)} /${weight}`
                        )}
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          {/* 2) Blurred / locked rows */}
          <ProtectedBlurTBody rows={hiddenRows} isMicrogreens={isMicrogreens} />
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          disabled={shouldRestrict}
        />
      </CardContent>
    </Card>
  );
}

function ProtectedBlurTBody({ rows, isMicrogreens = false }: { rows: CropData[], isMicrogreens?: boolean }) {
  // If there are no hidden rows, just return null to keep markup clean
  if (rows.length === 0) return null;

  // We'll get user state to decide whether to show overlay
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const { currency, weight } = useSelector((state: RootState) => state.locationMeta);
  const isAuthenticated = Boolean(userInfo?.user_id);
  const ismarkettrendsubscribed = Boolean(userInfo?.markettrendsubscribed);
  const shouldBlur = !isAuthenticated || !ismarkettrendsubscribed;

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [openPrime, setOpenPrime] = useState(false);

  const handleOpenLogin = () => {
    setOpenRegister(false);
    setOpenLogin(true);
  };

  const handleOpenRegister = () => {
    setOpenLogin(false);
    setOpenRegister(true);
  };

  const handleCloseAll = () => {
    setOpenLogin(false);
    setOpenRegister(false);
    setOpenPrice(false);
    setOpenPrime(false);
  };

  const handleOpenPriceModal = () => {
    setOpenLogin(false);
    setOpenRegister(false);
    setOpenPrice(true);
  };

  const handleSubscribeSuccess = () => {
    setOpenPrice(false);
    setOpenPrime(true);
  };

  // For the blurred rows, we still need the latest price, etc.
  const getLatestPrice = (trendString: string): number => {
    try {
      const parsed: PricePoint[] = JSON.parse(trendString);
      return parsed?.at?.(-1)?.avg_price ?? 0;
    } catch {
      return 0;
    }
  };

  // If user has full access, just render them as normal
  if (!shouldBlur) {
    return (
      <TableBody>
        {rows.map((item) => {
          const latestPrice = isMicrogreens
            ? (typeof item.price_trend === 'string' ? getLatestPrice(item.price_trend) : 0)
            : getLatestPrice(item.price_trend);
          return (
            <TableRow key={item.id}>
              <TableCell><Checkbox disabled /></TableCell>
              <TableCell align="center">
                    <Typography variant="body2">{item.rank}</Typography>
                  </TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" gap={2}>
                  <Image
                    src={`/apps/crop_icons/${item.crop_name}_${item.crop_variety}_${item.crop_type.toLowerCase().replace(/-/g, "_")}.svg`}
                    alt={item.crop_name}
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%" }}
                  />
                  <Typography component="b" sx={{ color: "text.secondary" }}>
                    {_.capitalize(item.crop_name)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center">{formatUnderscoreString(item.crop_variety)}</TableCell>
              <TableCell align="center">
                {isMicrogreens ? (
                  item.crop_profit?.toFixed(2) || '-'
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                    {item.profitability_market_band_low_pct != null && item.profitability_market_band_high_pct != null && 
                     typeof item.profitability_market_band_low_pct === 'number' && typeof item.profitability_market_band_high_pct === 'number' ? (
                      <>
                        <Box component="span">
                          {item.profitability_market_band_low_pct.toFixed(2)} - {item.profitability_market_band_high_pct.toFixed(2)}
                        </Box>
                        {item.profitability_observed_low_pct != null && item.profitability_observed_high_pct != null &&
                         typeof item.profitability_observed_low_pct === 'number' && typeof item.profitability_observed_high_pct === 'number' && (
                          <Tooltip
                            title={
                              <Box sx={{ p: 0.5 }}>
                                <Typography sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                                  Profitability Observed Low: {item.profitability_observed_low_pct.toFixed(2)}
                                </Typography>
                                <Typography sx={{ fontSize: "0.875rem" }}>
                                  Profitability Observed High: {item.profitability_observed_high_pct.toFixed(2)}
                                </Typography>
                              </Box>
                            }
                            arrow
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  backgroundColor: '#fff',
                                  color: 'rgba(0, 18, 25, 0.9)',
                                  fontSize: '0.875rem',
                                  padding: '0.75rem',
                                  borderRadius: '8px',
                                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                  border: '1px solid rgba(0, 0, 0, 0.1)',
                                }
                              }
                            }}
                          >
                            <IconButton size="small" sx={{ p: 0.25 }}>
                              <InfoOutlinedIcon sx={{ fontSize: "1rem", color: "rgba(0, 18, 25, 0.6)" }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </>
                    ) : (
                      item.crop_profit?.toFixed(2) || '-'
                    )}
                  </Box>
                )}
              </TableCell>
              <TableCell align="center">{item.crop_popularscore?.toFixed(2) || '-'}</TableCell>
              
              {/* Microgreens specific columns */}
              {isMicrogreens ? (
                <>
                  <TableCell align="center">
                    {item.ease_of_growth?.toFixed(2) || '-'}
                  </TableCell>
                  <TableCell align="center">
                    {item.nutrient_score?.toFixed(2) || '-'}
                  </TableCell>
                </>
              ) : (
                <TableCell align="center">{item.crop_sustain?.toFixed(2) || '-'}</TableCell>
              )}
              
              <TableCell align="center">
                {isMicrogreens ? (
                  `${currency} ${latestPrice.toFixed(2)} /punnet`
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                    {item.market_band_low != null && item.market_band_high != null &&
                     typeof item.market_band_low === 'number' && typeof item.market_band_high === 'number' ? (
                      <>
                        <Box component="span">
                          {item.market_band_low} - {item.market_band_high} AED/kg
                        </Box>
                        {item.observed_low != null && item.observed_high != null &&
                         typeof item.observed_low === 'number' && typeof item.observed_high === 'number' && (
                          <Tooltip
                            title={
                              <Box sx={{ p: 0.5 }}>
                                <Typography sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                                  Observed Low: {item.observed_low} AED/kg
                                </Typography>
                                <Typography sx={{ fontSize: "0.875rem" }}>
                                  Observed High: {item.observed_high} AED/kg
                                </Typography>
                              </Box>
                            }
                            arrow
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  backgroundColor: '#fff',
                                  color: 'rgba(0, 18, 25, 0.9)',
                                  fontSize: '0.875rem',
                                  padding: '0.75rem',
                                  borderRadius: '8px',
                                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                  border: '1px solid rgba(0, 0, 0, 0.1)',
                                }
                              }
                            }}
                          >
                            <IconButton size="small" sx={{ p: 0.25 }}>
                              <InfoOutlinedIcon sx={{ fontSize: "1rem", color: "rgba(0, 18, 25, 0.6)" }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </>
                    ) : (
                      `${currency} ${latestPrice.toFixed(2)} /${weight}`
                    )}
                  </Box>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  }

  // Otherwise: they are restricted → show the blurred version + overlay
  return (
    <>
      <TableBody>
        {/* We'll do a single <tr><td colSpan> that spans all columns */}
        <TableRow>
          <TableCell colSpan={isMicrogreens ? 9 : 8} sx={{ p: 0, position: "relative" }}>
            {/* The blurred table with hidden rows */}
            <Box sx={{ filter: "blur(4px)", pointerEvents: "none" }}>
              <Table>
                <TableBody>
                  {rows.map((item) => {
             const latestPrice = isMicrogreens
               ? (typeof item.price_trend === 'string' ? getLatestPrice(item.price_trend) : 0)
               : getLatestPrice(item.price_trend);
                    return (
                      <TableRow key={item.id}>
                        <TableCell align="center">
                          <Checkbox disabled />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">{item.rank}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" gap={2}>
                            <Image
                              src={`/apps/crop_icons/${item.crop_name}_${item.crop_variety}_${item.crop_type.toLowerCase().replace(/-/g, "_")}.svg`}
                              alt={item.crop_name}
                              width={40}
                              height={40}
                              style={{ borderRadius: "50%" }}
                            />
                            <Typography component="b" sx={{ color: "text.secondary" }}>
                              {_.capitalize(item.crop_name)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">{formatUnderscoreString(item.crop_variety)}</TableCell>
                        <TableCell align="center">
                          {isMicrogreens ? (
                            item.crop_profit?.toFixed(2) || '-'
                          ) : (
                            item.profitability_market_band_low_pct != null && item.profitability_market_band_high_pct != null &&
                            typeof item.profitability_market_band_low_pct === 'number' && typeof item.profitability_market_band_high_pct === 'number'
                              ? `${item.profitability_market_band_low_pct.toFixed(2)} - ${item.profitability_market_band_high_pct.toFixed(2)}`
                              : (item.crop_profit?.toFixed(2) || '-')
                          )}
                        </TableCell>
                        <TableCell align="center">{item.crop_popularscore?.toFixed(2) || '-'}</TableCell>
                        
                        {/* Microgreens specific columns */}
                        {isMicrogreens ? (
                          <>
                            <TableCell align="center">
                              {item.ease_of_growth?.toFixed(2) || '-'}
                            </TableCell>
                            <TableCell align="center">
                              {item.nutrient_score?.toFixed(2) || '-'}
                            </TableCell>
                          </>
                        ) : (
                          <TableCell align="center">{item.crop_sustain?.toFixed(2) || '-'}</TableCell>
                        )}
                        
                        <TableCell align="center">
                          {isMicrogreens ? (
                            `${currency} ${latestPrice.toFixed(2)} /punnet`
                          ) : (
                            item.market_band_low != null && item.market_band_high != null &&
                            typeof item.market_band_low === 'number' && typeof item.market_band_high === 'number'
                              ? `${item.market_band_low} - ${item.market_band_high} AED/kg`
                              : `${currency} ${latestPrice.toFixed(2)} /${weight}`
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>

            {/* Overlay with sign in or subscribe button */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(2px)",
                zIndex: 2
              }}
            >
              {!isAuthenticated ? (
                <Button sx={buttonStyle} onClick={handleOpenLogin}>
                  Sign In
                </Button>
              ) : (
                <Button sx={buttonStyle} onClick={handleOpenPriceModal}>
                  Get Full Access
                </Button>
              )}
            </Box>
          </TableCell>
        </TableRow>
      </TableBody>

      {/* Modals: Login, Register, Price, Prime */}
      <LoginDialog open={openLogin} onClose={handleCloseAll} onSwitch={handleOpenRegister} />
      <RegisterDialog open={openRegister} onClose={handleCloseAll} onSwitch={handleOpenLogin} />
      <PriceModal open={openPrice} onClose={handleCloseAll} onSubscribeSuccess={handleSubscribeSuccess} />
      <PrimememberDialog open={openPrime} onClose={handleCloseAll} />
    </>
  );
}

// SMALL WRAPPER FOR EACH MODAL (to avoid duplicates in the code)
function LoginDialog({
  open,
  onClose,
  onSwitch
}: {
  open: boolean;
  onClose: () => void;
  onSwitch: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Login onClose={onClose} onSwitch={onSwitch} />
    </Dialog>
  );
}

function RegisterDialog({
  open,
  onClose,
  onSwitch
}: {
  open: boolean;
  onClose: () => void;
  onSwitch: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Register open={open} onClose={onClose} onSwitch={onSwitch} />
    </Dialog>
  );
}

function PrimememberDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Primemember onClose={onClose} />
    </Dialog>
  );
}

const buttonStyle = {
  backgroundColor: "#ff5e00",
  color: "#fff",
  fontWeight: 600,
  textTransform: "uppercase",
  padding: "0.75rem 1.5rem",
  "&:hover": {
    backgroundColor: "#e65500"
  }
};