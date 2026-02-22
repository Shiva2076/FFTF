'use client';

import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import _ from 'lodash';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatUnderscoreString } from "@/utils/Capitalize";

type Crop = {
  name: string;
  variety: string;
  crop_type?: string;
  growthCycle: string;
  yieldPotential: string;
};

type CropRequiredMaterial = {
  crop: string;
  seeds: string;
  cube: string;
  nutrients: string;
  phSolutions: string;
  testKit: string;
  growingTrays: string;
  netPots: string;
};

type Props = {
  cropName?: string;
  cropVariety?: string;
  cropType?: string;
  showAllCrops?: boolean; // Add this prop to control behavior
};

const RequiredMaterials: React.FC<Props> = ({ cropName, cropVariety, cropType, showAllCrops = false }) => {
  const {title, description, duration} = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropRequiredMaterials || {title: "", description: ""}
  );
  const basket = useSelector((state: RootState) => state.growBasket.basket) as Crop[];

  const crops = useMemo(() => {
    if (showAllCrops) {
      return basket.map(crop => ({
        name: crop.name.toLowerCase(),
        variety: crop.variety.toLowerCase(),
        crop_type: crop.crop_type
      }));
    }
    
    if (cropName && cropVariety) {
      return [{ 
        name: cropName.toLowerCase(), 
        variety: cropVariety.toLowerCase(),
        crop_type: cropType
      }];
    }
    
    return basket.map(crop => ({
      name: crop.name.toLowerCase(),
      variety: crop.variety.toLowerCase(),
      crop_type: crop.crop_type
    }));
  }, [cropName, cropVariety, cropType, basket, showAllCrops]);

   const cropMaterials = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropRequiredMaterials.data
  ) as CropRequiredMaterial[] | undefined;

  const getMaterialForCrop = (cropName: string) => {
    if (!cropMaterials) return undefined;
    return cropMaterials.find(material => 
      material.crop.toLowerCase() === cropName.toLowerCase()
    );
  };

  return (
    <Box sx={{ minWidth: '720px' }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2">
        {description}
      </Typography>

      {!cropMaterials ? (
        <Typography variant="body2" mt={2}>
          No materials data found.
        </Typography>
      ) : (
        <Box mt={2}>
          {crops.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No crops selected in basket
            </Typography>
          )}
          
          {crops.map((crop, index) => {
            const matched = getMaterialForCrop(crop.name);

           
            if (!matched) {
              return (
                <Box key={`${crop.name}-${crop.variety}-${index}`} mt={2}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {_.capitalize(crop.name)} - {formatUnderscoreString(crop.variety ?? '')}
                  </Typography>
                  <Typography variant="body2" color="error">
                    No materials found for this crop.
                  </Typography>
                </Box>
              );
            }

            return (
              <Box key={`${crop.name}-${crop.variety}-${index}`} mt={2} mb={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {_.capitalize(crop.name)} - {formatUnderscoreString(crop.variety ?? '')}
                </Typography>
                {[
                  ['Seeds', matched.seeds],
                  ['Cube', matched.cube],
                  ['Nutrients', matched.nutrients],
                  ['pH Solutions', matched.phSolutions],
                  ['Test Kit', matched.testKit],
                  ['Growing Trays', matched.growingTrays],
                  ['Net Pots', matched.netPots],
                ].map(([label, value], i) => (
                  <Box key={i} display="flex" alignItems="center" gap={1} mt={0.5}>
                    <CheckCircleIcon
                      sx={{
                        color: 'white',
                        backgroundColor: 'orange',
                        borderRadius: '50%',
                        fontSize: '18px',
                        padding: '2px',
                      }}
                    />
                    <Typography variant="body2">{`${label}: ${value}`}</Typography>
                  </Box>
                ))}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default RequiredMaterials;