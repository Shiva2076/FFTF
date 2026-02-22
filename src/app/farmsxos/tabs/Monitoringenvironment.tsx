"use client";
import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

import SensorCards from '@/components/dashboard/FarmOverview/Monitoringenvironment/SensorCards';
import LiveMonitoringSection from '@/components/dashboard/FarmOverview/Monitoringenvironment/LiveMonitoringSection';
import SensorDataSection from '@/components/dashboard/FarmOverview/Monitoringenvironment/SensorDataSection';
import IrrigationSystemSection from '@/components/dashboard/FarmOverview/Monitoringenvironment/IrrigationSystemSection';
import { updateFarmLevelSensor, selectFarmSensorData } from '@/app/slices/sensorFarmLevelSlice';
import Anomalies from '@/components/dashboard/FarmOverview/Monitoringenvironment/Anomalies';
import Alerts from '@/components/dashboard/FarmOverview/Monitoringenvironment/Alerts';
import IrrigationScheduleSection from '@/components/dashboard/Activecropinsights/Realtimeactivity/IrrigationSchedule';

interface MonitoringEnvironmentProps {
  data: any; 
  farmId: string;
  selectedCropCycle?: number;
  iot?: boolean;
  ai?: boolean;
}

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
    anomalyData?: Record<string, any>;
    alertData?: Record<string, any>;
    irrigationScheduleData?: IrrigationSchedulePayload;
    cycleDeviceControlPanelData?: DeviceResponseGroup[];
  };
  selectedCropCycle?: number;
  farmId: string | number;
}


const MonitoringEnvironment = ({ data, farmId, selectedCropCycle, iot = true, ai = true }: MonitoringEnvironmentProps) => {
  const dispatch = useDispatch();
  const sensorDataTopCard=data?.topCards;
  const liveMonitoring=data?.liveMonitoring;
  const sensorData=data?.sensorData;
  const irrigationScheduleData = data?.irrigationScheduleData || { irrigationSchedule: [] };
  const irrigationSystemInfo=data?.irrigationSystemInfo;
  const anomalies = data?.anomalies;
  const alerts = data?.alerts ;

  useEffect(() => {
    if (data && sensorDataTopCard) {
      const initialSensorData = {
        temperature: sensorDataTopCard?.Etemp?.data?.value || null,
        indicatorTemp:sensorDataTopCard?.Etemp?.indicator || null,
        lastUpdatedTemp: sensorDataTopCard?.Etemp?.data?.EventProcessedUtcTime || null,
        humidity: sensorDataTopCard?.Humidity?.data?.value || null,
        indicatorHumidity:sensorDataTopCard?.Humidity?.indicator || null,
        lastUpdatedHumidity: sensorDataTopCard?.Humidity?.data?.EventProcessedUtcTime || null,
        co2: sensorDataTopCard?.CO2?.data?.value || null,
        indicatorCO2:sensorDataTopCard?.CO2?.indicator || null,
        lastUpdatedCO2: sensorDataTopCard?.CO2?.data?.EventProcessedUtcTime || null,
      };
  
      dispatch(updateFarmLevelSensor({
        farm_id: farmId,
        reading: initialSensorData,
      }));
    }
  }, [sensorDataTopCard, farmId, dispatch]);
  
 {/*
  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedData = {
        temperature: Math.floor(Math.random() * 5 + 20), 
        humidity: Math.floor(Math.random() * 50 + 30),    
        co2: Math.floor(Math.random() * 300 + 300),         
      };
      dispatch(updateFarmLevelSensor({ farm_id: farmId, reading: simulatedData }));
    }, 15000);
    return () => clearInterval(interval);
  }, [dispatch, farmId]); */}

  const sensorReadings = useSelector((state: any) => selectFarmSensorData(state, farmId)) || {
    temperature: null,
    humidity: null,
    co2: null,
  };

   const hasIrrigationEvents =
    irrigationScheduleData.irrigationSchedule.length > 0;

  return (
  <Box sx={{ mt: 2, px: 2 }}>
    <Grid container spacing={2}>

      {/* 🔸 Row 1: Two Side-by-Side Components */}
      <Grid item xs={12}>
        <SensorCards sensorData={sensorReadings} iot={iot} />
      </Grid>
  

      {/* 🔹 Row 2: One Full-Width Component */}
      <Grid item xs={12}>
        <LiveMonitoringSection liveMonitoring={liveMonitoring} ai={ai} />
      </Grid>

       <Grid item xs={12}>
              <IrrigationScheduleSection
                irrigationScheduleData={hasIrrigationEvents ? irrigationScheduleData : null}
                iot={iot}
              />
            </Grid>

      {/* 🔹 Row 3: Two Side-by-Side Components */}
      <Grid item xs={12} md={6}>
        <SensorDataSection sensorData={sensorData} farmId={farmId} iot={iot} />
      </Grid>
      <Grid item xs={12} md={6}>
        <IrrigationSystemSection 
  irrigationSystemInfo={irrigationSystemInfo}
  irrigationScheduleData={irrigationScheduleData}
  iot={iot}
/>
      </Grid>

      {/* 🔹 Row 4: Two Side-by-Side Components */}
      <Grid item xs={12} md={12} id="monitoring-environment-section">
         <Anomalies anomalies={anomalies} iot={iot} />
      </Grid>
      <Grid item xs={12} md={12}>
        {/* <Alerts alerts={alerts} ai={ai} /> */}
      </Grid>
    </Grid>
  </Box>
);
};

export default MonitoringEnvironment;
