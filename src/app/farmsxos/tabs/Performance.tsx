'use client';

import React from 'react';
import { Grid, Box } from '@mui/material';

import FarmSummaryCards from "@/components/dashboard/FarmOverview/Performance/FarmSummaryCards";
import FarmDetails from "@/components/dashboard/FarmOverview/Performance/FarmDetails";
import CropDistribution from "@/components/dashboard/FarmOverview/Performance/CropDistribution";
import UpcomingEvents from "@/components/dashboard/FarmOverview/Performance/UpcomingEvents";
import AlertsAndAnomalies from "@/components/dashboard/FarmOverview/Performance/AlertsAndAnomalies";
import ResourcesCharts from "@/components/dashboard/FarmOverview/Performance/ResourcesCharts";
import LiveImpactSnapshot from "@/components/dashboard/FarmOverview/Performance/LiveImpactSnapshot";

const FarmOverviewDashboard: React.FC<{ 
  data: any; 
  onGrowthCycleClick?: (growthCycle: number) => void;
  onAlertMetricClick?: (metricType: string) => void;
  iot?: boolean;
  ai?: boolean;
}> = ({ data, onGrowthCycleClick, onAlertMetricClick, iot = true, ai = true }) => {
  const topCardsFarmSummary = data?.performanceTab?.topCardsData;
  const farmDetails = data?.performanceTab?.farmDetails;
  const cropDistributionData = data?.performanceTab?.cropDistributionData;
  const farmResourcesData = data?.performanceTab?.farmResourcesData;
  const alertsAndAnomaliesData = data?.performanceTab?.anomalyAndAlertsCountData;
  const upcomingEventsData = data?.performanceTab?.upcomingEventsData;
  const liveImpactSnapshotData = data?.performanceTab?.liveImpactSnapshotsData;
  
  return (
    <Box sx={{ width: '100%', mt: 1, p: 2, overflowX: "hidden", boxSizing: 'border-box'}}>
      <Grid container spacing={2}>
        {/* Row 1: Farm Summary */}
        <Grid item xs={12}>
          <FarmSummaryCards topCardsFarmSummary={topCardsFarmSummary} iot={iot} ai={ai} />
        </Grid>

        {/* Row 2: Farm Details | Live Impact | Alerts */}
        <Grid item xs={12} md={4} alignItems="stretch">
          <FarmDetails farmDetails={farmDetails} ai={ai} />
        </Grid>
        <Grid item xs={12} md={4}>
          <LiveImpactSnapshot
            liveImpactSnapshotsData={liveImpactSnapshotData}
            iot={iot}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <AlertsAndAnomalies 
            alertsAndAnomaliesData={alertsAndAnomaliesData} 
            onMetricClick={onAlertMetricClick}
            ai={ai}
          />
        </Grid>

        {/* Row 3: Upcoming Events (Left), Crop & Resources (Right) */}
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
          <UpcomingEvents upcomingEventsData={upcomingEventsData} onGrowthCycleClick={onGrowthCycleClick} ai={ai} />
        </Grid>

        <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={2} direction="column" sx={{ flexGrow: 1 }}>
            <Grid item sx={{ flexGrow: 1 }}>
              <CropDistribution cropDistributionData={cropDistributionData} ai={ai} />
            </Grid>
            <Grid item sx={{ flexGrow: 1 }}> 
              <ResourcesCharts farmResourcesData={farmResourcesData} iot={iot} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FarmOverviewDashboard;