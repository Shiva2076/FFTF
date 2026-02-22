'use client';

import React from 'react';
import { Grid, Box } from '@mui/material';
import CropCycleTimeline from '@/components/dashboard/FarmOverview/Cropgrowthyield/CropCycleTimeline';
import YieldInsights from '@/components/dashboard/FarmOverview/Cropgrowthyield/YieldInsights';
import CropHealthStatus from '@/components/dashboard/FarmOverview/Cropgrowthyield/CropHealthStatus';
import HarvestSchedule from '@/components/dashboard/FarmOverview/Cropgrowthyield/HarvestSchedule';

interface CropStatus {
  status: string;
  percentage: number;
}

interface CropGrowthCycle {
  growth_cycle: string;
  cropCycleStatus: CropStatus[];
}

interface YieldData {
  actual_yield: number;
  month?: string;
}
interface CropYieldData {
  crop_name: string;
  crop_variety: string;
  data: YieldData[];
}

interface HarvestScheduleItem {
  cycleId: number;
  daysLeft: number;
  totalDays: number;
  daysDone: number;
  expectedHarvestDate: string;
}

interface CropGrowthYieldTab {
  cropGrowthYieldTimeline: CropGrowthCycle[];
  yieldInsights: CropYieldData[];
  overallCropHealthStatus: {
    healthy: number;
    stressed: number;
  } | null;
  harvestSchedule: HarvestScheduleItem[];
}

interface Props {
  data: CropGrowthYieldTab;
  onGrowCycleClick?: (growCycleId: number) => void;
  onCropCycleClick?: (cycleId: number) => void;
}

const CropGrowthYield: React.FC<Props> = ({ data, onGrowCycleClick, onCropCycleClick }) => {
  const {
    cropGrowthYieldTimeline = [],
    yieldInsights = [],
    overallCropHealthStatus = null,
    harvestSchedule = [],
  } = data || {};

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}> 
            <CropCycleTimeline cropGrowthYieldTimeline={cropGrowthYieldTimeline} onGrowCycleClick={onGrowCycleClick} />
            <YieldInsights yieldInsights={yieldInsights} />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <CropHealthStatus overallCropHealthStatus={overallCropHealthStatus || undefined} />
          <HarvestSchedule harvestSchedule={harvestSchedule } 
          onCropCycleClick={onCropCycleClick} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CropGrowthYield;