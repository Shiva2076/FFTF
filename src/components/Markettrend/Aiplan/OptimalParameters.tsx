"use client";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import _ from "lodash";
import { formatUnderscoreString } from "@/utils/Capitalize";
import React, { useMemo } from 'react';

// Local types
type CropInfo = {
  name: string;
  variety: string;
  crop_type?: string;
  growthCycle: string;
  yieldPotential: string;
};

type CropGrowingParameter = {
  parameter_id: string | number;
  crop_name: string;
  crop_variety_name: string;
  crop_type?: string;
  stage_id: string;
  temperature_min?: number;
  temperature_max?: number;
  humidity_min?: number;
  humidity_max?: number;
  ph_min?: number;
  ph_max?: number;
  ec_min?: number;
  ec_max?: number;
};

type Props = {
  cropName?: string;
  cropVariety?: string;
  cropType?: string;
  showAllCrops?: boolean;
};

const OptimalParameters: React.FC<Props> = ({ cropName, cropVariety, cropType, showAllCrops = false }) => {
  const basket = useSelector((state: RootState) => state.growBasket.basket) as CropInfo[];
  
  // SIMPLIFIED crops selection logic - show all crops when showAllCrops is true
  const crops = useMemo(() => {
    // If showAllCrops is true, show ALL basket crops regardless of type
    if (showAllCrops) {
      return basket.map(crop => ({
        name: crop.name.toLowerCase(),
        variety: crop.variety.toLowerCase(),
        crop_type: crop.crop_type
      }));
    }
    
    // If specific crop is provided via props, show only that crop
    if (cropName && cropVariety) {
      return [{ 
        name: cropName.toLowerCase(), 
        variety: cropVariety.toLowerCase(),
        crop_type: cropType
      }];
    }
    
    // Default: show all crops from basket
    return basket.map(crop => ({
      name: crop.name.toLowerCase(),
      variety: crop.variety.toLowerCase(),
      crop_type: crop.crop_type
    }));
  }, [cropName, cropVariety, cropType, basket, showAllCrops]);

  const allParams = useSelector(
    ( state: RootState) => state.cropGrowingGuide.data?.cropGrowingParameters
  ) as CropGrowingParameter[] | undefined;

  const cropNames = (crops ?? []).map((crop) => ({
    name: crop.name.toLowerCase(),
    variety: crop.variety?.toLowerCase(),
    crop_type: crop.crop_type
  }));

  // FIXED: Filter params based on crops with crop_type matching
  const filteredParams = (allParams ?? []).filter(
    (param) => {
      const stageMatch = param.stage_id.toLowerCase() === "harvest";
      const cropMatch = cropNames.some(
        (crop) =>
          crop.name === param.crop_name.toLowerCase() &&
          crop.variety === param.crop_variety_name.toLowerCase() &&
          crop.crop_type === param.crop_type // ADDED THIS LINE - match crop_type exactly
      );
      
      return stageMatch && cropMatch;
    }
  );
// TEMPORARY DEBUG - Add after the filteredParams definition
console.log('=== OPTIMAL PARAMETERS DEBUG ===');
console.log('Basket crops:', basket);
console.log('Crops to match:', cropNames);
console.log('All params from Redux:', allParams);
console.log('Filtered params:', filteredParams);
console.log('================================');

  const formatRange = (min?: number, max?: number, unit?: string) => {
    if (min == null || max == null) return "N/A";
    return `${min} - ${max}${unit ?? ""}`;
  };

  return (
    <Box sx={{width:'100%'}}>
      <Box sx={{ minWidth: '720px' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Optimal Parameters
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        AI-recommended settings for ideal crop growth.
      </Typography>
      <TableContainer component={Paper} sx={{ width: '100%', overflowY: 'auto', minHeight: '261px' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Crop</strong></TableCell>
              <TableCell><strong>Temperature (℃)</strong></TableCell>
              <TableCell><strong>Humidity (%)</strong></TableCell>
              <TableCell><strong>pH Level</strong></TableCell>
              <TableCell><strong>EC (mS/cm)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredParams?.map((param, index) => (
              <TableRow key={index}>
                <TableCell>
                  {_.capitalize(param.crop_name)} - {formatUnderscoreString(param.crop_variety_name)} ({param.crop_type})
                </TableCell>
                <TableCell>
                  {formatRange(param.temperature_min, param.temperature_max, "℃")}
                </TableCell>
                <TableCell>
                  {formatRange(param.humidity_min, param.humidity_max, "%")}
                </TableCell>
                <TableCell>
                  {formatRange(param.ph_min, param.ph_max)}
                </TableCell>
                <TableCell>
                  {formatRange(param.ec_min, param.ec_max, " mS/cm")}
                </TableCell>
              </TableRow>
            ))}
            {filteredParams?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No matching crop data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </Box>
  );
};

export default OptimalParameters;