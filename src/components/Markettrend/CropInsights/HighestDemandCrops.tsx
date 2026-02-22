
'use client';
import React, { useMemo, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { addCrop } from '@/app/slices/growBasketSlice';
import ProtectedBlurWrapper from '@/components/Markettrend/ProtectedBlurWrapper';
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
  crop_popularscore: number;
  price_trend: string;
  rank: number;
  social_score?: number;
  // Leafy greens specific fields
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
const HighestDemandCrops: React.FC<Props> = ({ data }) => {
  // const [selected, setSelected] = useState<number[]>([]);
  const selectedCrops = useSelector((state: RootState) => state.cropSelection.selectedCrops);
  const selectedCropFilter = useSelector((state: RootState) => state.selectedCropTypetab); // Get selected crop type
  const dispatch = useDispatch();
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const isAuthenticated = Boolean(userInfo?.user_id);
  const ismarkettrendsubscribed = Boolean(userInfo?.markettrendsubscribed);
  const shouldRestrict = !isAuthenticated || !ismarkettrendsubscribed;
  const { currency, weight } = useSelector((state: RootState) => state.locationMeta);
  const isMicrogreens = selectedCropFilter?.toLowerCase() === "microgreens";
  const getLatestPrice = (priceTrendStr: string): number => {
    try {
      const parsed: PricePoint[] = JSON.parse(priceTrendStr);
      return parsed?.at?.(-1)?.avg_price ?? 0;
    } catch {
      return 0;
    }
  };
  const top5Crops = useMemo(() => {
    return [...data]
      .sort((a, b) => b.crop_popularscore - a.crop_popularscore)
      .slice(0, 5);
  }, [data]);
  const handleAddToGrowBasket = () => {
    // const selectedCrops = top5Crops.filter((crop) => selected.includes(crop.id));
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
  const cropsFromThisSection = top5Crops.filter(crop =>
    selectedCrops.some(selected => selected.id === crop.id)
  );
  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={600}>
            Highest Demand Crops
          </Typography>
        }
        subheader={
          <Box sx={{ lineHeight: 1.2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              component="span"
            >
              Highlights crops with the highest market demand&nbsp;•&nbsp;
            </Typography>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Image src="/apps/Vector.svg" alt="calendar" width={12} height={12} />
              <Typography variant="body2" color="text.secondary" component="span">
                14d
              </Typography>
            </Box>
          </Box>
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
            <TableHead sx={{ maxheight: 30 }}>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>
                <TableCell padding="checkbox" />
                <TableCell>Crop</TableCell>
                <TableCell>Variety</TableCell>
                <TableCell align="right" sx={{
                  whiteSpace: {
                    md: 'normal',
                    lg: 'nowrap',
                  },
                }}>Demand<br/> Score</TableCell>
                 {isMicrogreens && (
                  <TableCell align="right" sx={{
                    whiteSpace: {
                      md: 'normal',
                      lg: 'nowrap',
                    },
                  }}>Social<br/> Demand</TableCell>
                )}
                <TableCell align="right" sx={{
                  whiteSpace: {
                    md: 'normal',
                    lg: 'nowrap',
                  },
                }}>
                  {isMicrogreens ? (
                    <Box component="span">
                      Latest <br/>Price
                    </Box>
                  ) : (
                    "Price Range"
                  )}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {top5Crops.map((item) => {
                const imageName =
                  item.crop_name?.charAt(0).toUpperCase() + item.crop_name?.slice(1) || 'Default';
                const latestPrice = getLatestPrice(item.price_trend);
                const isSelected = selectedCrops.some(c => c.id === item.id);
                return (
                  <TableRow
                    key={item.id}
                    sx={{
                      '& td': {
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                      },
                      '&:last-child td': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <TableCell padding="checkbox" sx={{ py: 1.5 }}>
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
                          style={{
                            borderRadius: '50%',
                            objectFit: 'cover',
                            display: 'block',
                            maxHeight: 40,
                          }}
                        />
                        <Link
                          href={`/markettrend/${item.crop_name}-${item.crop_variety}-${item.crop_type.toLowerCase().replace(/-/g, "_")}`} >
                          <Typography
                            sx={{
                              textDecoration: 'underline', cursor: 'pointer', color: '#ff5e00',
                            }}
                          >
                            {_.capitalize(item.crop_name)}
                          </Typography>
                        </Link>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>{formatUnderscoreString(item.crop_variety)}</TableCell>
                    <TableCell align="right" sx={{ py: 1.5 }}>{item.crop_popularscore.toFixed(2)}</TableCell>
                    {/* Conditionally render social_demand value for microgreens */}
                    {isMicrogreens && (
                      <TableCell align="right" sx={{ py: 1.5 }}>
                        {item.social_score ? item.social_score.toFixed(2) : 'N/A'}
                      </TableCell>
                    )}
                    <TableCell align="right" sx={{ py: 1.5 }}>
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
export default HighestDemandCrops;
