"use client";

import React from 'react';
import { Box } from '@mui/material';
import MetricsSection from '@/components/dashboard/Activecropinsights/Overview/MetricsSection';
import MarketPriceSection from '@/components/dashboard/Activecropinsights/Overview/MarketPriceSection';
import FarmEnvironment from '@/components/dashboard/Activecropinsights/Overview/FarmEnvironment';
import CropMetricsGraph from '@/components/dashboard/Activecropinsights/Overview/EnergyConsumptionChart';
import ScannedCropImages from '@/components/dashboard/Activecropinsights/Overview/ScannedCropImages';
import TaskList from '@/components/dashboard/Activecropinsights/Overview/TaskList';
import KeyCropMilestones from '@/components/dashboard/Activecropinsights/Overview/KeyCropMilestones';
import RackShelfData from '@/components/dashboard/Activecropinsights/Overview/RackShelfData';

interface Task {
  task_id: number;
  description: string;
  notification_description: string;
  notification_frequency: string;
  completed_at?: string | null;
  done: boolean;
  cycle_id?: number;
  growth_cycle?: number;
  shelves_allocated?: number;
  crop_name?: string;
  crop_variety?: string;
  status?: string;
}

interface SensorReading {
  enqueuedTime: string;
  value: number;
}

interface SensorData {
  asset_name: string;
  farm_id: number;
  rack_id: number;
  shelf_id: number;
  device_id: string;
  events: SensorReading[];
}

interface Props {
  overviewData: {
    topCardsData?: any;
    minimumMarketPriceData?: string;
    maximumMarketPriceData?: string;
    keyCropMilestonesData?: {
      sowingDate: string;
      transplantDate: string;
      expectedHarvestDate: string;
    };
    rackAndShelfData?: {
      rack_id: number;
      shelves: number[];
    }[];
    cropMetricsData?: {
      shelfConfig: {
        rack_id: number;
        shelves: number[];
      }[];
      data: SensorData[];
    };
    farmEnvironmentData?: {
      [key: string]: {
        min: number;
        max: number;
        value: number | string | null;
      };
    };
    taskListData?: {
      cycle_id: number;
      crop_name: string;
      crop_variety: string;
      growth_cycle: number;
      status: string;
      shelves_allocated: number;
      pendingActionableTasks: Task[];
      completedActionableTasks: Task[];
      nonactionableTasks: Task[];
    }[];
    scannedcropimages?: Record<string, any>;
  };
  onGrowCycleClick?: (growthCycleId: number) => void;
  isQueued?: boolean;
  iot?: boolean;
}

const ActiveCropOverviewPanel: React.FC<Props> = ({ 
  overviewData, 
  onGrowCycleClick,
  isQueued = false,
  iot = true,
}) => {
  const milestones = overviewData?.keyCropMilestonesData
    ? [
        { label: 'SOWING', date: overviewData.keyCropMilestonesData.sowingDate },
        { label: 'PREDICTED TRANSPLANT', date: overviewData.keyCropMilestonesData.transplantDate },
        { label: 'AI PREDICTED HARVEST', date: overviewData.keyCropMilestonesData.expectedHarvestDate },
      ]
    : null;

  const transformedRackShelfData: Record<string, string[]> = Array.isArray(overviewData.rackAndShelfData)
    ? overviewData.rackAndShelfData.reduce((acc, item) => {
        acc[item.rack_id.toString()] = item.shelves.map(String);
        return acc;
      }, {} as Record<string, string[]>)
    : {};

  const enrichedTaskListData = overviewData.taskListData?.[0];

  const spreadMetaIntoTasks = (taskList: Task[], meta: Partial<Task>) =>
    taskList.map((task) => ({ ...task, ...meta }));

  const finalTaskList = enrichedTaskListData
    ? {
        pendingActionableTasks: spreadMetaIntoTasks(enrichedTaskListData.pendingActionableTasks, enrichedTaskListData),
        completedActionableTasks: spreadMetaIntoTasks(enrichedTaskListData.completedActionableTasks, enrichedTaskListData),
        nonactionableTasks: spreadMetaIntoTasks(enrichedTaskListData.nonactionableTasks, enrichedTaskListData),
      }
    : {
        pendingActionableTasks: [],
        completedActionableTasks: [],
        nonactionableTasks: [],
      };

  // Blur styles for queued cycles
  const blurStyle = isQueued ? {
    filter: 'blur(4px)',
    pointerEvents: 'none' as const,
    opacity: 0.6,
    userSelect: 'none' as const,
  } : {};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', backgroundColor: '#fff' }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', ...blurStyle }}>
        <MetricsSection topCardsData={overviewData?.topCardsData} cycleId={770}/>
        {/* only render once overviewData exists */}
        {overviewData && (
          <MarketPriceSection
            minimumMarketPriceData={overviewData.minimumMarketPriceData}
            maximumMarketPriceData={overviewData.maximumMarketPriceData}
          />
        )}
      </Box>

      <Box sx={{ width: '100%', display: 'flex', gap: '1.5rem', ...blurStyle }}>
        <KeyCropMilestones milestones={milestones} />
        <RackShelfData data={{ shelves: transformedRackShelfData }} />
      </Box>

      <Box sx={{ width: '100%', display: 'flex', gap: '1.5rem', ...blurStyle }}>
        <FarmEnvironment farmEnvironmentData={overviewData?.farmEnvironmentData} iot={iot} />
        <CropMetricsGraph
          rackAndShelfData={overviewData.cropMetricsData?.shelfConfig || []}
          sensorData={overviewData.cropMetricsData?.data || []}
          iot={iot}
        />
      </Box>

      <Box sx={{ width: '100%', display: 'flex', gap: '1.5rem', ...blurStyle }}>
        <ScannedCropImages scannedcropimages={overviewData?.scannedcropimages} />
        <TaskList taskListData={finalTaskList} onGrowCycleClick={onGrowCycleClick}/>
      </Box>
    </Box>
  );
};

export default ActiveCropOverviewPanel;