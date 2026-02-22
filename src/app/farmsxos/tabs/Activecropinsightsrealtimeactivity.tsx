'use client';

import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import AnomaliesSection from '@/components/dashboard/Activecropinsights/Realtimeactivity/AnomaliesSection';
import AlertSection from '@/components/dashboard/Activecropinsights/Realtimeactivity/AlertsSection';
import IrrigationScheduleSection from '@/components/dashboard/Activecropinsights/Realtimeactivity/IrrigationSchedule';
import FanLightSection from '@/components/dashboard/Activecropinsights/Realtimeactivity/FanLightSection';
import BlurWrapper from '@/components/common/BlurWrapper';

export interface IrrigationEvent {
  event_id: number;
  irrigation_meta_id: number;
  created_at: string;
  updated_at: string;
  cycle_id: number;
  rack_id: number;
  shelf_id: number;
  event_type: 'irrigate' | 'drain';
  start_time: string;
  end_time: string;
  duration: number;
  crop_name: string;
  crop_variety: string;
  ec_min?: number;
  ec_max?: number;
  ph_min?: number;
  ph_max?: number;
  do_min?: number;
  do_max?: number;
  nutrient_temp_min?: number;
  nutrient_temp_max?: number;
  status: 'PENDING' | 'COMPLETED';
  value: {
    drain_pump: 0 | 1;
    inlet: 0 | 1;
    outlet: 0 | 1;
    main_pump: 0 | 1;
  };
}

export interface IrrigationSchedulePayload {
  irrigationSchedule: IrrigationEvent[];
}

export interface DeviceResponseGroup {
  rackId: number;
  shelfId: number;
  deviceStatus: {
    deviceId: string;
    device: string;
    currentStatus: 0 | 1 | 'NA';
    lastUpdated: string;
  }[];
}

interface Props {
  realtimeActivityData?: {
    anomalyData?: Record<string, any> | any[];
    alertData?: Record<string, any> | any[];
    irrigationScheduleData?: IrrigationSchedulePayload;
    cycleDeviceControlPanelData?: DeviceResponseGroup[];
  };
  selectedCropCycle?: number;
  farmId: string | number;
  isQueued?: boolean;
  iot?: boolean;
}

const RealtimeInsightsView: React.FC<Props> = ({
  realtimeActivityData,
  selectedCropCycle,
  farmId,
  isQueued = false,
  iot = true,
}) => {
  // Safe destructuring with proper fallbacks and type checking
  const anomalyData = realtimeActivityData?.anomalyData ?? [];
  const alertData = realtimeActivityData?.alertData ?? [];
  const irrigationScheduleData = realtimeActivityData?.irrigationScheduleData ?? { irrigationSchedule: [] };
  
  // Ensure cycleDeviceControlPanelData is always an array
  const cycleDeviceControlPanelData = Array.isArray(realtimeActivityData?.cycleDeviceControlPanelData)
    ? realtimeActivityData.cycleDeviceControlPanelData
    : [];

  // Safe check for irrigation events
  const hasIrrigationEvents = 
    irrigationScheduleData?.irrigationSchedule && 
    Array.isArray(irrigationScheduleData.irrigationSchedule) && 
    irrigationScheduleData.irrigationSchedule.length > 0;

  // Blur styles for queued cycles
  const blurStyle = isQueued ? {
    filter: 'blur(4px)',
    pointerEvents: 'none',
    opacity: 0.6,
    userSelect: 'none',
  } : {};

  // If no data is available at all, show a message
  if (!realtimeActivityData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '300px',
        p: 3,
        bgcolor: '#fff',
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.12)'
      }}>
        <Typography color="text.secondary">
          No real-time activity data available for this cycle.
        </Typography>
      </Box>
    );
  }

  return (
    <BlurWrapper isBlurred={!iot} messageType="iot">
      <Grid container spacing={3} sx={blurStyle}>
        <Grid item xs={12} md={6}>
          <AnomaliesSection anomalyData={Array.isArray(anomalyData) ? anomalyData : null} />
        </Grid>
        <Grid item xs={12} md={6}>
          <AlertSection alertData={Array.isArray(alertData) ? alertData : null} />
        </Grid>
        {/* <Grid item xs={12}>
          <IrrigationScheduleSection
            irrigationScheduleData={hasIrrigationEvents ? irrigationScheduleData : null}
            selectedCropCycle={selectedCropCycle}
          />
        </Grid> */}
        <Grid item xs={12} md={6}>
          <FanLightSection
            cycleDeviceControlPanelData={cycleDeviceControlPanelData}
            farmId={farmId}
          />
        </Grid>
      </Grid>
    </BlurWrapper>
  );
};

export default RealtimeInsightsView;