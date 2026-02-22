
'use client';
import React, { useState, useMemo } from 'react';
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
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Image from 'next/image';
import Link from 'next/link';
import ProtectedBlurWrapper from '@/components/Markettrend/ProtectedBlurWrapper';
import { useSelector, useDispatch } from 'react-redux';
import { addCrop } from '@/app/slices/growBasketSlice';
import { useRouter } from 'next/navigation';
import _ from 'lodash';
import { RootState } from '@/app/store';
import { toggleCropSelection } from '@/app/slices/cropSelectionSlice';
import { formatUnderscoreString } from "@/utils/Capitalize";
interface PricePoint {
  date: string;
  avg_price: number;
}

interface CropData {
  id: number;
  crop_name: string;
  crop_variety: string;
  crop_type: string;
  crop_profit: number;
  price_trend: string; // JSON string
  rank: number;
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
}
const cropDataMap: Record<string, { growthCycle: string; yieldPotential: string }> = {
  lettuce: { growthCycle: '45-60 days', yieldPotential: 'High' },
  arugula: { growthCycle: '30-40 days', yieldPotential: 'Medium' },
  basil: { growthCycle: '50-60 days', yieldPotential: 'Medium' },
  spinach: { growthCycle: '35-45 days', yieldPotential: 'High' },
  pakchoi: { growthCycle: '30-40 days', yieldPotential: 'Medium' },
  celery: { growthCycle: '80-100 days', yieldPotential: 'Medium' },
  kale: { growthCycle: '50-65 days', yieldPotential: 'High' },
  parsley: { growthCycle: '60-70 days', yieldPotential: 'Medium' },
};
const MostProfitableCrops: React.FC<Props> = ({ data }) => {
  const selectedCrops = useSelector((state: RootState) => state.cropSelection.selectedCrops);
  const dispatch = useDispatch();
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const isAuthenticated = Boolean(userInfo?.user_id);
  const ismarkettrendsubscribed = Boolean(userInfo?.markettrendsubscribed);
  const { currency, weight } = useSelector((state: RootState) => state.locationMeta);
  const selectedCropFilter = useSelector((state: RootState) => state.selectedCropTypetab);
  const isMicrogreens = selectedCropFilter?.toLowerCase() === "microgreens";
  const shouldRestrict = !isAuthenticated || !ismarkettrendsubscribed;
  const getLatestPrice = (trendStr: string): number => {
    try {
      const parsed: PricePoint[] = JSON.parse(trendStr);
      return parsed?.at?.(-1)?.avg_price ?? 0;
    } catch {
      return 0;
    }
  };
  const top5Profitable = useMemo(() => {
    return [...data].sort((a, b) => b.crop_profit - a.crop_profit).slice(0, 5);
  }, [data]);
  const handleAddToGrowBasket = () => {
    const selectedCrops = cropsFromThisSection;
    selectedCrops.forEach((crop) => {
      const cropKey = crop.crop_name.toLowerCase();
      const mappedData = cropDataMap[cropKey] || {
        growthCycle: 'N/A',
        yieldPotential: 'Medium',
      };
      const cropInfo = {
        name: crop.crop_name,
        variety: crop.crop_variety,
        crop_type: crop.crop_type,
        growthCycle: mappedData.growthCycle,
        yieldPotential: mappedData.yieldPotential,
        rank: crop.rank,
      };
      dispatch(addCrop(cropInfo));
    });
    router.push('/markettrend/grow-basket');
  };
  const cropsFromThisSection = top5Profitable.filter(crop =>
    selectedCrops.some((selected: { id: number }) => selected.id === crop.id)
  );
  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={600}>
            Most Profitable Crops
          </Typography>
        }
        subheader={
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.4
            }}
          >
            Identifies crops with the highest profit potential&nbsp;•&nbsp;
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Image src="/apps/Vector.svg" alt="calendar" width={12} height={12} />
              14d
            </Box>
          </Typography>
        }
        action={
          <Button
            variant="contained"
            onClick={handleAddToGrowBasket}
            disabled={cropsFromThisSection.length === 0 || shouldRestrict}
            sx={{
              backgroundColor: '#ff5e00',
              '&:hover': {
                backgroundColor: '#e65300', // slightly darker shade for hover
              },
              color: '#fff', // ensures text is white
            }}
          >
            Add to Grow Basket ({cropsFromThisSection.length})
          </Button>
        }
      />
      <CardContent sx={{ p: 0, borderBottom: 'none', overflowX: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ProtectedBlurWrapper>
            <Table sx={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'auto' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>
                  <TableCell
                    padding="checkbox"
                    sx={{
                      whiteSpace: { xs: 'normal', xl: 'nowrap' },
                      wordBreak: { xs: 'break-word', xl: 'normal' },
                    }}
                  />
                  <TableCell
                    sx={{
                      whiteSpace: { xs: 'normal', xl: 'nowrap' },
                      wordBreak: { xs: 'break-word', xl: 'normal' },
                    }}
                  >
                    Crop
                  </TableCell>
                  <TableCell
                    sx={{
                      whiteSpace: { xs: 'normal', xl: 'nowrap' },
                      wordBreak: { xs: 'break-word', xl: 'normal' },
                    }}
                  >
                    Variety
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace: { xs: 'normal', xl: 'nowrap' },
                      wordBreak: { xs: 'break-word', xl: 'normal' },
                      px: 1.5,
                      minWidth: '140px',
                    }}
                  >
                    Profitability (%)
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace: { xs: 'normal', xl: 'nowrap' },
                      wordBreak: { xs: 'break-word', xl: 'normal' },
                      px: 1.5,
                      minWidth: '140px',
                    }}
                  >
                    {isMicrogreens ? "Latest Price" : "Price Range"}
                  </TableCell>
                </TableRow>
              </TableHead>
            <TableBody>
              {top5Profitable.map((item) => {
                const latestPrice = getLatestPrice(item.price_trend);
                const imageName =
                  item.crop_name?.charAt(0).toUpperCase() + item.crop_name?.slice(1) || 'Default';
                const isSelected = selectedCrops.some(c => c.id === item.id);
                return (
                  <TableRow key={item.id} sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}>
                    <TableCell padding="checkbox">
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
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Image
                          src={`/apps/crop_icons/${item.crop_name}_${item.crop_variety}_${item.crop_type.toLowerCase().replace(/-/g, "_")}.svg`}
                          alt={item.crop_name}
                          width={40}
                          height={40}
                          style={{ borderRadius: '50%' }}
                        />
                        <Link
                          href={`/markettrend/${item.crop_name}-${item.crop_variety}-${item.crop_type.toLowerCase().replace(/-/g, "_")}`} >
                          <Typography
                            sx={{
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              color: '#ff5e00', // your orange shade
                            }}
                          >
                            {_.capitalize(item.crop_name)}
                          </Typography>
                        </Link>
                      </Box>
                    </TableCell>
                    <TableCell>{formatUnderscoreString(item.crop_variety)}</TableCell>
                    <TableCell align="right" sx={{ px: 1.5 }}>
                      {isMicrogreens ? (
                        item.crop_profit.toFixed(2)
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5, whiteSpace: "nowrap" }}>
                          {item.profitability_market_band_low_pct !== undefined && item.profitability_market_band_high_pct !== undefined ? (
                            <>
                              <Box component="span" sx={{ whiteSpace: "nowrap" }}>
                                {item.profitability_market_band_low_pct.toFixed(2)} - {item.profitability_market_band_high_pct.toFixed(2)}
                              </Box>
                              {item.profitability_observed_low_pct !== undefined && item.profitability_observed_high_pct !== undefined && (
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
                            item.crop_profit.toFixed(2)
                          )}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ px: 1.5 }}>
                      {isMicrogreens ? (
                        `${currency} ${latestPrice.toFixed(2)}`
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5, whiteSpace: "nowrap" }}>
                          {item.market_band_low !== undefined && item.market_band_high !== undefined ? (
                            <>
                              <Box component="span" sx={{ whiteSpace: "nowrap" }}>
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
                            `${currency} ${latestPrice.toFixed(2)}`
                          )}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </ProtectedBlurWrapper>
        </Box>
      </CardContent>
    </Card>
  );
};
export default MostProfitableCrops;
