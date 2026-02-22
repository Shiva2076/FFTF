"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  Tooltip,
  IconButton,
  Dialog,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Image from 'next/image';
import Link from "next/link";
import { RootState } from "@/app/store";
import { useSelector } from 'react-redux';
import { formatUnderscoreString } from "@/utils/Capitalize";
import Login from '@/components/Auth/Signin';
import Register from '@/components/Auth/Register';
import PriceModal from '@/components/Markettrend/Email/PriceModel';
import Primemember from '@/components/Markettrend/Email/Primemember';
import _ from "lodash";
type CropTrendPoint = {
  date: string;
  avg_price: number;
};

type CropData = {
  id: number;
  city: string;
  crop_name: string;
  crop_variety: string;
  crop_type: string;
  crop_profit: number;
  crop_sustain: number;
  crop_popularscore: number;
  nutrient_score?: number;
  rank: number;
  price_trend: string;
  profitability_market_band_low_pct?: number;
  profitability_market_band_high_pct?: number;
  profitability_observed_high_pct?: number;
  profitability_observed_low_pct?: number;
  market_band_low?: number;
  market_band_high?: number;
  observed_low?: number;
  observed_high?: number;
};

type Props = {
  data: CropData[];
  onSeeMore?: () => void;
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const cropImages: Record<string, string> = {
  spinach: "/spinach.png",
  celery: "/celery.png",
  lettuce: "/lettuce.png",
  basil: "/basil.png",
  arugula: "/arugula.png",
  "cherry tomatoes": "/cherry_tomatoes.png",
  microgreens: "/microgreens.png",
};

type Order = "asc" | "desc";

const AIRecommendedCrops: React.FC<Props> = ({ data, onSeeMore }) => {
  const { currency, weight } = useSelector((state: RootState) => state.locationMeta);
  const selectedCropFilter = useSelector((state: RootState) => state.selectedCropTypetab);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const isMicrogreens = selectedCropFilter?.toLowerCase() === "microgreens";
  const isAuthenticated = Boolean(userInfo?.user_id);
  const ismarkettrendsubscribed = Boolean(userInfo?.markettrendsubscribed);
  const shouldBlur = !isAuthenticated || !ismarkettrendsubscribed;
  const [orderBy, setOrderBy] = useState<keyof CropData | "latest_price" | "nutrient_score">("crop_profit");
  const [order, setOrder] = useState<Order>("desc");
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [openPrime, setOpenPrime] = useState(false);
  
  // Reset sort order when switching between microgreens and other crop types
  useEffect(() => {
    if ((orderBy === "nutrient_score" && !isMicrogreens) || (orderBy === "crop_sustain" && isMicrogreens)) {
      setOrderBy("crop_profit");
      setOrder("desc");
    }
  }, [isMicrogreens, orderBy]);
  
  const handleSeeMore = () => {
    if (onSeeMore) {
      onSeeMore(); // Navigate to crop-insights tab
    }
  }

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

  const renderButton = () => {
    if (!isAuthenticated) {
      return (
        <Button onClick={handleOpenLogin} sx={{
          backgroundColor: '#ff5e00',
          color: '#fff',
          fontWeight: 600,
          textTransform: 'uppercase',
          padding: '0.75rem 1.5rem',
          '&:hover': {
            backgroundColor: '#e65500',
          },
        }}>
          Sign In
        </Button>
      );
    }
    if (!ismarkettrendsubscribed) {
      return (
        <Button onClick={handleOpenPriceModal} sx={{
          backgroundColor: '#ff5e00',
          color: '#fff',
          fontWeight: 600,
          textTransform: 'uppercase',
          padding: '0.75rem 1.5rem',
          '&:hover': {
            backgroundColor: '#e65500',
          },
        }}>
          Get Full Access
        </Button>
      );
    }
    return null;
  };

  // Helper to get latest price
  const getLatestPrice = (trendString: string): number => {
    try {
      const parsed: CropTrendPoint[] = JSON.parse(trendString);
      return parsed?.at?.(-1)?.avg_price ?? 0;
    } catch {
      return 0;
    }
  };

  const sortOptions = [
    { value: "crop_profit", label: "Profitability %" },
    { value: "crop_popularscore", label: "Demand Score" },
    { value: isMicrogreens ? "nutrient_score" : "crop_sustain", label: isMicrogreens ? "Nutrient Score" : "Sustainability Score" },
    { value: "latest_price", label: "Price" }
  ];

  // Sorting handler - always default to descending (highest first) when selecting a column
  const handleSort = (property: keyof CropData | "latest_price" | "nutrient_score") => {
    const propertyKey = property as keyof CropData | "latest_price" | "nutrient_score";
    
    // Always set to descending when selecting (highest values first)
    setOrderBy(propertyKey as keyof CropData | "latest_price");
    setOrder("desc");
  };

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...data];
    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      if (orderBy === "latest_price") {
        aValue = getLatestPrice(a.price_trend);
        bValue = getLatestPrice(b.price_trend);
      } else if (orderBy === "nutrient_score") {
        aValue = a.nutrient_score ?? 0;
        bValue = b.nutrient_score ?? 0;
      } else {
        aValue = a[orderBy] as number;
        bValue = b[orderBy] as number;
      }

      if (typeof aValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
    return sorted;
  }, [data, orderBy, order]);

  // Show only top 5
  const displayData = sortedData.slice(0, 5);

  return (
    <Paper elevation={0} sx={{ width: "100%", minHeight: "388px", boxShadow: "none", border: "1px solid rgba(0, 0, 0, 0.12)", borderRadius: "8px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AI Recommended Crops
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", fontSize: "0.875rem", color: "rgba(0, 18, 25, 0.6)", mt: 0.5 }}>
            <Typography variant="body2">Suggests best crops based on AI analysis</Typography>
            <Box sx={{ mx: 1 }}>•</Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Image
                src="/apps/Vector.svg"
                alt="calendar"
                width={10}
                height={10}
                priority
              />
              <Typography variant="body2">14d</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ ml: 2 }}>
          <TextField
            select
            label="Sort by"
            value={orderBy}
            onChange={(e) => handleSort(e.target.value as any)}
            size="small"
            sx={{ width: 200 }}
          >
            {sortOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      {/* Content: Always show table format */}
      <Box sx={{ p: 2, flex: 1, width: "100%", overflowX: "auto", overflowY: "hidden", position: "relative" }}>
        <Table sx={{ width: "100%", tableLayout: "auto", borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.08)" }}>
              <TableCell align="center" sx={{ borderRight: "none" }}>Crop</TableCell>
              <TableCell align="center" sx={{ borderRight: "none" }}>Variety</TableCell>
              <TableCell align="center" sx={{ borderRight: "none" }}>Profitability (%)</TableCell>
              <TableCell align="center" sx={{ borderRight: "none" }}>Demand Score</TableCell>
              <TableCell align="center" sx={{ borderRight: "none" }}>{isMicrogreens ? "Nutrient Score" : "Sustainability Score"}</TableCell>
              <TableCell align="center" sx={{ borderRight: "none" }}>{isMicrogreens ? "Price" : "Price Range"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* First 3 crops - always visible */}
            {displayData?.slice(0, 3).map((item) => {
              const latestPrice = getLatestPrice(item.price_trend);
              return (
                <TableRow key={item.id} sx={{ "&:not(:last-child) td": { borderBottom: "1px solid rgba(0, 0, 0, 0.12)" } }}>
                  <TableCell align="center" sx={{ borderRight: "none" }}>
                    <Box display="flex" alignItems="center" gap={2} justifyContent="center">
                      <Image
                        src={`/apps/crop_icons/${item.crop_name}_${item.crop_variety}_${item.crop_type.toLowerCase().replace(/-/g, "_")}.svg`}
                        alt={item.crop_name}
                        width={40}
                        height={40}
                        style={{ borderRadius: "50%" }}
                      />
                      <Link
                        href={`/markettrend/${item.crop_name}-${item.crop_variety}-${item.crop_type.toLowerCase().replace(/-/g, "_")}`}
                      >
                        <Typography
                          sx={{ textDecoration: "underline", cursor: "pointer", color: "#ff5e00" }}
                        >
                          {_.capitalize(item.crop_name)}
                        </Typography>
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: "none" }}>
                    {formatUnderscoreString(item.crop_variety)}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: "none" }}>
                    {isMicrogreens ? (
                      item.crop_profit !== null && item.crop_profit !== undefined
                        ? `${item.crop_profit.toFixed(2)}` : '-'
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                        {item.profitability_market_band_low_pct !== undefined && item.profitability_market_band_high_pct !== undefined ? (
                          <>
                            <Box component="span">
                              {item.profitability_market_band_low_pct?.toFixed(2)} - {item.profitability_market_band_high_pct?.toFixed(2)}
                            </Box>
                            {item.profitability_observed_low_pct !== undefined && item.profitability_observed_high_pct !== undefined && (
                              <Tooltip
                                title={
                                  <Box sx={{ p: 0.5 }}>
                                    <Typography sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                                      Profitability Observed Low: {item.profitability_observed_low_pct?.toFixed(2)}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.875rem" }}>
                                      Profitability Observed High: {item.profitability_observed_high_pct?.toFixed(2)}
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
                        ) : '-'}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: "none" }}>
                    {item.crop_popularscore !== null && item.crop_popularscore !== undefined
                      ? `${item.crop_popularscore.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: "none" }}>
                    {isMicrogreens 
                      ? (item.nutrient_score !== null && item.nutrient_score !== undefined
                          ? `${item.nutrient_score.toFixed(2)}` : '-')
                      : (item.crop_sustain !== null && item.crop_sustain !== undefined
                          ? `${item.crop_sustain.toFixed(2)}` : '-')
                    }
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: "none" }}>
                    {isMicrogreens ? (
                      `${currency} ${latestPrice.toFixed(2)} /punnet`
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                        {item.market_band_low !== undefined && item.market_band_high !== undefined ? (
                          <>
                            <Box component="span">
                              {item.market_band_low} - {item.market_band_high} AED/kg
                            </Box>
                            {item.observed_low !== undefined && item.observed_high !== undefined && (
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
            
            {/* Remaining crops - with blur protection */}
            {displayData && displayData.length > 3 && displayData.slice(3).map((item, index) => {
              const latestPrice = getLatestPrice(item.price_trend);
              const actualIndex = index + 3;
              return (
                <TableRow 
                  key={item.id} 
                  sx={{ 
                    position: "relative",
                    "&:not(:last-child) td": { borderBottom: "1px solid rgba(0, 0, 0, 0.12)" },
                    ...(shouldBlur && {
                      filter: "blur(6px)",
                      pointerEvents: "none",
                    })
                  }}
                >
                      <TableCell align="center" sx={{ borderRight: "none" }}>
                        <Box display="flex" alignItems="center" gap={2} justifyContent="center">
                          <Image
                            src={`/apps/crop_icons/${item.crop_name}_${item.crop_variety}_${item.crop_type.toLowerCase().replace(/-/g, "_")}.svg`}
                            alt={item.crop_name}
                            width={40}
                            height={40}
                            style={{ borderRadius: "50%" }}
                          />
                          <Link
                            href={`/markettrend/${item.crop_name}-${item.crop_variety}-${item.crop_type.toLowerCase().replace(/-/g, "_")}`}
                          >
                            <Typography
                              sx={{ textDecoration: "underline", cursor: "pointer", color: "#ff5e00" }}
                            >
                              {_.capitalize(item.crop_name)}
                            </Typography>
                          </Link>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ borderRight: "none" }}>
                        {formatUnderscoreString(item.crop_variety)}
                      </TableCell>
                      <TableCell align="center" sx={{ borderRight: "none" }}>
                        {isMicrogreens ? (
                          item.crop_profit !== null && item.crop_profit !== undefined
                            ? `${item.crop_profit.toFixed(2)}` : '-'
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                            {item.profitability_market_band_low_pct !== undefined && item.profitability_market_band_high_pct !== undefined ? (
                              <>
                                <Box component="span">
                                  {item.profitability_market_band_low_pct?.toFixed(2)} - {item.profitability_market_band_high_pct?.toFixed(2)}
                                </Box>
                                {item.profitability_observed_low_pct !== undefined && item.profitability_observed_high_pct !== undefined && (
                                  <Tooltip
                                    title={
                                      <Box sx={{ p: 0.5 }}>
                                        <Typography sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                                          Profitability Observed Low: {item.profitability_observed_low_pct?.toFixed(2)}
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.875rem" }}>
                                          Profitability Observed High: {item.profitability_observed_high_pct?.toFixed(2)}
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
                            ) : '-'}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ borderRight: "none" }}>
                        {item.crop_popularscore !== null && item.crop_popularscore !== undefined
                          ? `${item.crop_popularscore.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell align="center" sx={{ borderRight: "none" }}>
                        {isMicrogreens 
                          ? (item.nutrient_score !== null && item.nutrient_score !== undefined
                              ? `${item.nutrient_score.toFixed(2)}` : '-')
                          : (item.crop_sustain !== null && item.crop_sustain !== undefined
                              ? `${item.crop_sustain.toFixed(2)}` : '-')
                        }
                      </TableCell>
                      <TableCell align="center" sx={{ borderRight: "none" }}>
                        {isMicrogreens ? (
                          `${currency} ${latestPrice.toFixed(2)} /punnet`
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                            {item.market_band_low !== undefined && item.market_band_high !== undefined ? (
                              <>
                                <Box component="span">
                                  {item.market_band_low} - {item.market_band_high} AED/kg
                                </Box>
                                {item.observed_low !== undefined && item.observed_high !== undefined && (
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
        </Table>
        
        {/* Overlay for blurred rows */}
        {shouldBlur && displayData && displayData.length > 3 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40%", // Approximate height for 2 rows
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              pointerEvents: "auto",
            }}
          >
            {renderButton()}
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 1.5,
        }}
      >
        <Button
          variant="text"
          onClick={handleSeeMore}
          sx={{
            color: "#ff5e00",
            fontWeight: 500,
            textTransform: "uppercase",
            fontSize: "0.813rem",
          }}
        >
          See more
        </Button>
      </Box>

      {/* Modals */}
      <Dialog open={openLogin} onClose={handleCloseAll}>
        <Login onClose={handleCloseAll} onSwitch={handleOpenRegister} />
      </Dialog>

      <Dialog open={openRegister} onClose={handleCloseAll}>
        <Register open={openRegister} onClose={handleCloseAll} onSwitch={handleOpenLogin} />
      </Dialog>

      <PriceModal
        open={openPrice}
        onClose={handleCloseAll}
        onSubscribeSuccess={handleSubscribeSuccess}
      />

      <Dialog open={openPrime} onClose={handleCloseAll}>
        <Primemember onClose={handleCloseAll} />
      </Dialog>
    </Paper>
  );
};

export default AIRecommendedCrops;

