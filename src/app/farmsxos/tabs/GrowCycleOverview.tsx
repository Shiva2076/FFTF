"use client";
import React from 'react';
import { Grid, Box } from '@mui/material';
import SnapshotSection from '@/components/dashboard/Growcycle/SnapshotSection';
import CropGrowthTimeline from '@/components/dashboard/Growcycle/Cropgrowthtimeline';
import TaskList from '@/components/dashboard/Growcycle/Tasklist';
import CompletedCycleSummary from '@/components/dashboard/Growcycle/Completecyclesummary';
import EnvironmentalMonitoring from '@/components/dashboard/Growcycle/Environmentmonitoring';
import CropHealthStatus from '@/components/dashboard/Growcycle/Crophealthstatus';
// Add props type
interface GrowCycleOverviewProps {
  growcycleapidata: any;
  onTimelineSelect: (info: {
    growthCycle: number;
    cycleId: number;
    cropName: string;
    cropVariety: string;
  }) => void;
  onCycleClick?: (cycleId: number) => void;
  iot?: boolean;
  ai?: boolean;
}
const GrowCycleOverview: React.FC<GrowCycleOverviewProps> = ({ growcycleapidata, onTimelineSelect, onCycleClick, iot = true, ai = true }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <SnapshotSection  growCycleTopCardsData={growcycleapidata?.growCycleTopCardsData} iot={iot} ai={ai} />
      <Box sx={{ mt: 2 }}>
        <CropGrowthTimeline cropGrowthStagesTimelineData={growcycleapidata?.cropGrowthStagesTimelineData} 
          onCycleSelect={onTimelineSelect}
          ai={ai}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mt: 2,
          alignItems: 'stretch',
          minHeight: '1px',
        }}
      >
      <Box
        sx={{
          flex: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: { xs: 'auto', md: '500px' },
        }}
      >
      <TaskList taskListData={growcycleapidata?.taskListData}  onCycleClick={onCycleClick} ai={ai} />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: { xs: 'auto', md: '500px' },
        }}
      > 
      <CropHealthStatus cropHealthData={growcycleapidata?.cropHealthStatusData}
        onCycleClick={onCycleClick}
        ai={ai}
      />
      </Box>
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <EnvironmentalMonitoring environmentalMonitoringData={growcycleapidata?.environmentalMonitoringData} iot={iot} />
        </Grid>
        <Grid item xs={12} md={4}>
          <CompletedCycleSummary completedCycleSummaryData={growcycleapidata?.completedCycleSummaryData} iot={iot} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default GrowCycleOverview;
