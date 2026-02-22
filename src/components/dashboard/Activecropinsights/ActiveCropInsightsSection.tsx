"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import capitalize from 'lodash/capitalize';
import LoadingSpinner from '@/components/LoadingSpinner';
import ActiveCropOverviewPanel from '@/app/farmsxos/tabs/Activecropinsightsoverview';
import ActiveCropInsightsRealtimeActivity from '@/app/farmsxos/tabs/Activecropinsightsrealtimeactivity';
import DeleteCropModal from '@/components/dashboard/Activecropinsights/Overview/DeleteCrop';
import EditCropCycleModal, { CropCycleData } from '@/components/dashboard/Activecropinsights/Overview/EditCropCycle';
import { formatUnderscoreString } from "@/utils/Capitalize";

interface GrowthCycle {
  growth_cycle: number;
  cropCycles: CropCycle[];
}

interface CropCycle {
  cycle_id: number;
  crop_name: string;
  crop_variety: string;
  crop_type?: string;
  status?: string;
}

interface ActiveInsightData {
  list?: GrowthCycle[];
  chosenCycle?: {
    crop_name: string;
    crop_variety: string;
    crop_type?: string;
    cycle_id?: number;
    growth_cycle?: number;
    status?: string;
  } | null;
  overviewData: any;
  realtimeActivityData: any;
}

interface Props {
  farmId: string | number;
  loading: boolean;
  panelLoading: boolean;
  selectedGrowthCycle: number | null;
  selectedCropCycle: number;
  activeInsightData: ActiveInsightData;
  activeCropInsightsTab: 'Overview' | 'RealTime';
  setActiveCropInsightsTab: (tab: 'Overview' | 'RealTime') => void;
  handleGrowCycleChange: (growCycleId: number) => void;
  handleCropCycleChange: (cropCycleId: number) => void;
  setActiveMainTab: (tab: 'FarmOverview' | 'GrowCycle') => void;
  setGrowcycleValue: (growthCycleId: number | 'all') => void;
  realtimeActivityData: any;
  iot?: boolean;
}

const ActiveCropInsightsSection: React.FC<Props> = ({
  farmId,
  loading,
  panelLoading,
  selectedGrowthCycle,
  selectedCropCycle,
  activeInsightData,
  activeCropInsightsTab,
  setActiveCropInsightsTab,
  handleGrowCycleChange,
  handleCropCycleChange,
  setActiveMainTab, 
  setGrowcycleValue,
  iot = true,
}) => {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cropDataToEdit, setCropDataToEdit] = useState<CropCycleData | null>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  const hasFullDataStructure = Boolean(activeInsightData?.list);
  
  // Helper function to get current crop cycle from list (for immediate display)
  const getCurrentCropCycleFromList = (): CropCycle | null => {
    if (!hasFullDataStructure || selectedGrowthCycle == null || selectedCropCycle == null || !activeInsightData.list) return null;
    const growthCycle = activeInsightData.list.find((g) => g.growth_cycle === selectedGrowthCycle);
    if (!growthCycle) return null;
    const cropCycle = growthCycle.cropCycles.find((c) => c.cycle_id === selectedCropCycle);
    return cropCycle || null;
  };

  // Get current crop cycle data - prefer list data for immediate updates, fallback to chosenCycle
  const currentCropCycleFromList = getCurrentCropCycleFromList();
  const currentCropCycle = currentCropCycleFromList || activeInsightData?.chosenCycle;
  
  // Check if current cycle is queued - check both list data and chosenCycle
  const isQueuedCycle = (currentCropCycleFromList?.status?.toUpperCase() === 'PENDING') || 
                        (activeInsightData?.chosenCycle?.status?.toUpperCase() === 'PENDING');

  // Helper function to compare status values
  const compareStatus = (status1: string, status2: string): number => {
    const statusOrder = ["INITIALIZED", "SEEDING", "TRANSPLANT", "VEGETATIVE", "HARVEST", "COMPLETED"];
    const index1 = statusOrder.indexOf(status1.toUpperCase());
    const index2 = statusOrder.indexOf(status2.toUpperCase());
    if (index1 === -1 || index2 === -1) return 0;
    return index1 - index2;
  };

  const getCurrentCropData = (): CropCycleData | null => {
    if (!hasFullDataStructure || selectedGrowthCycle == null || selectedCropCycle == null || !activeInsightData.list) return null;
    const growthCycle = activeInsightData.list.find((g) => g.growth_cycle === selectedGrowthCycle);
    if (!growthCycle) return null;
    const cropCycle = growthCycle.cropCycles.find((c) => c.cycle_id === selectedCropCycle);
    return (cropCycle as CropCycleData) || null;
  };

  // Helper function to check if required fields are filled
  const areRequiredFieldsFilled = (cropData: CropCycleData | null): boolean => {
    if (!cropData) return false;
    const seedSownQty = String(cropData.seed_sown_quantity || '').trim();
    const plantsTransplantedQty = String(cropData.plants_transplanted_quantity || '').trim();
    return seedSownQty !== '' && plantsTransplantedQty !== '';
  };

  // Auto-open Edit Crop Cycle modal when status >= 'TRANSPLANT' and required fields are not filled
  useEffect(() => {
    if (!hasAutoOpened && activeInsightData?.chosenCycle?.status && hasFullDataStructure && selectedCropCycle != null && !loading && !panelLoading) {
      const currentStatus = activeInsightData.chosenCycle.status.toUpperCase();
      const transplantStatus = 'TRANSPLANT';
      
      if (compareStatus(currentStatus, transplantStatus) >= 0) {
        const cropData = getCurrentCropData();
        if (cropData && !areRequiredFieldsFilled(cropData)) {
          setCropDataToEdit(cropData);
          setEditModalOpen(true);
          setHasAutoOpened(true);
        }
      }
    }
  }, [activeInsightData?.chosenCycle?.status, hasFullDataStructure, selectedCropCycle, loading, panelLoading, hasAutoOpened]);

  // Reset auto-open flag when crop cycle changes
  useEffect(() => {
    setHasAutoOpened(false);
  }, [selectedCropCycle]);

  const openEditModal = (data?: CropCycleData) => {
    let cropData = data ?? null;
    if (!cropData && hasFullDataStructure) {
      cropData = getCurrentCropData();
    }
    if (cropData) {
      setCropDataToEdit(cropData);
      setEditModalOpen(true);
    }
  };

  const handleUpdateCycle = (updatedData: CropCycleData) => {
    if (selectedCropCycle != null) handleCropCycleChange(selectedCropCycle);
    setEditModalOpen(false);
    setCropDataToEdit(null);
  };

  const handleDeleteCompleted = (deletedId: number) => {
    if (!activeInsightData.list) {
      setActiveMainTab('FarmOverview');
      return;
    }

    const currentGrowthCycle = activeInsightData.list.find(g => g.growth_cycle === selectedGrowthCycle);
    const remainingInCurrentGrowth = currentGrowthCycle?.cropCycles.filter(c => c.cycle_id !== deletedId) || [];

    setDeleteModalOpen(false);
    
    if (remainingInCurrentGrowth && remainingInCurrentGrowth.length > 0) {
      handleCropCycleChange(remainingInCurrentGrowth[remainingInCurrentGrowth.length - 1].cycle_id);
    } else {
      const otherGrowthWithCycles = activeInsightData.list
        .filter(g => g.growth_cycle !== selectedGrowthCycle && g.cropCycles.length > 0)
        .sort((a, b) => b.growth_cycle - a.growth_cycle); 
      if (otherGrowthWithCycles.length > 0) {
        const newestGrowth = otherGrowthWithCycles[0];
        handleGrowCycleChange(newestGrowth.growth_cycle);
        handleCropCycleChange(newestGrowth.cropCycles[newestGrowth.cropCycles.length - 1].cycle_id);
      } else {
        setActiveMainTab('FarmOverview');
      }
    }
  };

  const handleGrowCycleClickFromOverview = (growthCycleId: number) => {
    setActiveMainTab("GrowCycle");
    setGrowcycleValue(growthCycleId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <LoadingSpinner />
        </Box>
      ) : (
        <>
          {hasFullDataStructure && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ fontSize: '1.25rem', color: '#001219' }}
                >
                  {selectedCropCycle != null && currentCropCycle
                    ? `${selectedCropCycle} | ${formatUnderscoreString(currentCropCycle.crop_name ?? '')} - ${formatUnderscoreString(currentCropCycle.crop_variety ?? '')}${currentCropCycle.crop_type ? ` | ${formatUnderscoreString(currentCropCycle.crop_type)}` : ''}`
                    : 'Active Crop Insights'}
                </Typography>
                {isQueuedCycle && (
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      bgcolor: '#fff3e0',
                      color: '#e65100',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 1,
                      textTransform: 'uppercase',
                      border: '1px solid #ffb74d',
                    }}
                  >
                    Queued Cycle
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Select
                  value={selectedGrowthCycle ?? ''}
                  onChange={(e) => handleGrowCycleChange(Number(e.target.value))}
                  displayEmpty
                  sx={{ width: 200, bgcolor: '#f5fdf8', border: '1px solid #008756', borderRadius: '6px', fontWeight: 500, fontSize: '0.875rem' }}
                >
                  <MenuItem value="" disabled>Select Growth Cycle</MenuItem>
                  {activeInsightData.list?.map((g) => (
                    <MenuItem key={g.growth_cycle} value={g.growth_cycle}>Grow Cycle: {g.growth_cycle}</MenuItem>
                  ))}
                </Select>
                <Select
                  value={selectedCropCycle ?? ''}
                  onChange={(e) => handleCropCycleChange(Number(e.target.value))}
                  displayEmpty
                  disabled={!selectedGrowthCycle}
                  sx={{
                    width: 250,
                    bgcolor: '#f5fdf8',
                    border: '1px solid #008756',
                    borderRadius: '6px',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  <MenuItem value="" disabled>Select Crop Cycle</MenuItem>
                  {activeInsightData.list
                    ?.find((g) => g.growth_cycle === selectedGrowthCycle)
                    ?.cropCycles.map((c) => (
                      <MenuItem key={c.cycle_id} value={c.cycle_id}>
                        {c.cycle_id} | {formatUnderscoreString(c.crop_name)} {formatUnderscoreString(c.crop_variety)}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {hasFullDataStructure ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {(['Overview', 'RealTime'] as const).map((tab) => (
                  <Box
                    key={tab}
                    onClick={() => setActiveCropInsightsTab(tab)}
                    sx={{ 
                      cursor: 'pointer',
                      px: 2,
                      py: 1,
                      fontWeight: activeCropInsightsTab === tab ? 600 : 400,
                      border: `1px solid ${activeCropInsightsTab === tab ? '#008756' : 'rgba(0,0,0,0.12)'}`,
                      borderRadius: 1,
                      bgcolor: activeCropInsightsTab === tab ? 'rgba(0,135,86,0.08)' : '#fff',
                      color: activeCropInsightsTab === tab ? '#008756' : 'inherit',
                      transition: 'all 0.2s ease-in-out', 
                      '&:hover': { bgcolor: activeCropInsightsTab === tab ? 'rgba(0,135,86,0.12)' : 'rgba(0,0,0,0.04)' } 
                    }}
                  >
                    {tab === 'Overview' ? 'Overview' : 'Real-Time Activity'}
                  </Box>
                ))}
              </Box>
            ) : (
              <Select fullWidth value={activeCropInsightsTab} onChange={(e) => setActiveCropInsightsTab(e.target.value as any)}>
                <MenuItem value="Overview">Overview</MenuItem>
                <MenuItem value="RealTime">Real Time</MenuItem>
              </Select>
            )}
            {hasFullDataStructure && selectedCropCycle != null && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box 
                  onClick={() => openEditModal()} 
                  sx={{ 
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 18, 25, 0.87)',
                    px: 2,
                    py: 1,
                    cursor: 'pointer',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    color: 'rgba(0, 18, 25, 0.87)',
                    transition: 'all 0.2s ease-in-out', 
                    '&:hover': { bgcolor: 'rgba(0, 18, 25, 0.04)' } 
                  }}
                >
                  Edit Crop Cycle
                </Box>
                <Box 
                  onClick={() => setDeleteModalOpen(false)} // make here true when to enable delete
                  sx={{ 
                    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)', 
                    borderRadius: '4px', 
                    backgroundColor: '#d32f2f', 
                    px: 2, 
                    py: 1, 
                    cursor: 'pointer', 
                    fontWeight: 500, 
                    textTransform: 'uppercase', 
                    color: '#fff', 
                    transition: 'all 0.2s ease-in-out', 
                    '&:hover': { backgroundColor: '#b71c1c' } 
                  }}
                >
                  Delete Crop
                </Box>
              </Box>
            )}
          </Box>

          {panelLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', mt: 2 }}>
              <LoadingSpinner />
            </Box>
          ) : (
            <>
              {activeCropInsightsTab === 'Overview' ? (
                <ActiveCropOverviewPanel 
                  overviewData={activeInsightData.overviewData}  
                  onGrowCycleClick={handleGrowCycleClickFromOverview}
                  isQueued={isQueuedCycle}
                  iot={iot}
                />
              ) : (
                <ActiveCropInsightsRealtimeActivity
                  realtimeActivityData={activeInsightData?.realtimeActivityData}
                  selectedCropCycle={selectedCropCycle}
                  farmId={farmId}
                  isQueued={isQueuedCycle}
                  iot={iot}
                />
              )}
            </>
          )}

          <DeleteCropModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            cropInfo={{ 
              cropCycleId: selectedCropCycle ?? '', 
              cropName: activeInsightData?.chosenCycle?.crop_name, 
              cropVariety: activeInsightData?.chosenCycle?.crop_variety 
            }}
            onDeleteSuccess={handleDeleteCompleted}
          />

          <EditCropCycleModal
            open={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setCropDataToEdit(null);
            }}
            cropData={cropDataToEdit ?? undefined}
            onUpdate={handleUpdateCycle}
          />
        </>
      )}
    </Box>
  );
};

export default ActiveCropInsightsSection;