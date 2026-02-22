"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, MenuItem, Select, Container, Modal, IconButton, Paper, Chip, Alert, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import BannerWithPagination from '../../components/Markettrend/MarketOverview/Bannerwithpagination';
import FarmUserRegister from '@/components/dashboard/Farm/FarmUserRegister';
import Currentdatetime from '@/components/dashboard/helper/Currentdatetime';
import Performance from '@/app/farmsxos/tabs/Performance';
import CropGrowthYield from '@/app/farmsxos/tabs/Cropgrowthyield';
import MonitoringEnvironment from '@/app/farmsxos/tabs/Monitoringenvironment';
import FarmRegisterModal from '@/components/dashboard/Farm/FarmRegister';
import Farmregisterprogress from '@/components/dashboard/Farm/Farmregisterprogress';
import GrowCycleOverview from '@/app/farmsxos/tabs/GrowCycleOverview';
import { api } from '@/constants';
import LoadingSpinner from '@/components/LoadingSpinner';
import ActiveCropInsightsSection from '@/components/dashboard/Activecropinsights/ActiveCropInsightsSection';
import RackShelfAllocator from '@/components/dashboard/FarmOverview/RackShelfAllocator';
import { Tooltip } from '@mui/material';
import updateFarmLocationMeta from '@/utils/functions';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function formatUnderscoreString(input?: string): string {
  if (!input) return '';
  return input
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const Maindashboard: React.FC = () => {
    // Set page title
    useEffect(() => {
      document.title = 'INNOFarms.AI FarmsXOS';
    }, []);
    
  const skipAutoFetchRef = useRef(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const isAuthenticated = Boolean(userInfo?.user_id);
  const [loading, setLoading] = useState<boolean>(false);
  const [panelLoading, setPanelLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [userFarms, setUserFarms] = useState<any[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [showTimeline, setShowTimeline] = useState<boolean>(false);
  const [openRegisterFarmModal, setOpenRegisterFarmModal] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<
    'FarmOverview' | 'GrowCycle' | 'ActiveCropInsights' | 'SmartRobotics'
  >('FarmOverview');
  const [activeSubTab, setActiveSubTab] = useState<
    'Performance' | 'CropGrowthYield' | 'MonitoringEnvironment'
  >('Performance');
  const [activeCropInsightsTab, setActiveCropInsightsTab] = useState<'Overview' | 'RealTime'>(
    'Overview'
  );
  const [smartRoboticsTab, setSmartRoboticsTab] = useState<'AIRobot' | 'Drone'>('AIRobot');
  const [growcycleValue, setGrowcycleValue] = useState<number | 'all'>('all');
  const [growcycleapidata, setGrowcycleapidata] = useState<any>({});
  const [openAllocatorModal, setOpenAllocatorModal] = useState(false);
  const [allocationforfarm, setAllocationforfarm] = useState<any>({});
  const [openQueueModal, setOpenQueueModal] = useState(false);
  const [queuedCyclesData, setQueuedCyclesData] = useState<any[]>([]);
  const [loadingQueue, setLoadingQueue] = useState(false);

  const cropcycles = Array.isArray(allocationforfarm?.cropcycles) ? allocationforfarm.cropcycles : [];
  
  const fetchQueuedCycles = async () => {
    if (!selectedFarm?.farm_id) return;
    
    try {
      setLoadingQueue(true);
      const response = await api.get(`/api/cropcycle/pending?farmId=${selectedFarm.farm_id}`);
      setQueuedCyclesData(response.data.data || []);
      setOpenQueueModal(true);
    } catch (error) {
      console.error('Error fetching queued cycles:', error);
      setQueuedCyclesData([]);
    } finally {
      setLoadingQueue(false);
    }
  };
  
  const handlePerformanceGrowthCycleClick = (growthCycle: number) => {
    setActiveMainTab('GrowCycle');
    const parsed = growthCycle = Number(growthCycle);
    setGrowcycleValue(parsed);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerformanceAlertMetricClick = (metricType: string) => {
    switch(metricType) {
      case "cropLevelAnomalies":
        skipAutoFetchRef.current = false;
        setActiveMainTab('ActiveCropInsights');
        setActiveCropInsightsTab('RealTime');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      
      case "cropLevelAlerts":
        skipAutoFetchRef.current = false;
        setActiveMainTab('ActiveCropInsights');
        setActiveCropInsightsTab('RealTime');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      
      case "farmLevelAnomalies":
      case "farmLevelAlerts":
        setActiveSubTab('MonitoringEnvironment');
        setTimeout(() => {
          const el = document.getElementById('monitoring-environment-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
        break;
      
      case "roboticsAnomalies":
      case "roboticsAlerts":
        setActiveMainTab('SmartRobotics');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      
      default:
        console.log("Metric clicked:", metricType);
    }
  };

  const handleCropYieldGrowCycleClick = (cycleId: number) => {
    setActiveMainTab("GrowCycle");
    setGrowcycleValue(Number(cycleId));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCropYieldCropCycleClick = (cropCycleId: number) => {
    skipAutoFetchRef.current = true;
    setActiveMainTab('ActiveCropInsights');
    setSelectedCropCycle(cropCycleId);
    handleCycleChange(cropCycleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCycleClick = (cycleId: number) => {
    skipAutoFetchRef.current = true;
    setActiveMainTab('ActiveCropInsights');
    setSelectedCropCycle(cycleId);
    fetchInsights(cycleId);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };  

  const seedingtoTransplantCycles = cropcycles
    .filter((c: any) => ['SEEDING', 'INITIALIZED', 'TRANSPLANT'].includes(c.status))
    .map((cycle: any) => ({
      ...cycle,
      allocatedShelves: cycle.shelves?.length || 0,
    }));
  
  const seedingtoTransplantShelves = seedingtoTransplantCycles.reduce(
    (acc: number, c: any) => acc + (c?.shelves?.length || 0),
    0
  );

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setInitialLoading(true);
        const res = await api.get('/api/farm/userfarms');
        const allFarms = res.data;
        setUserFarms(allFarms);

        if (allFarms.length > 0) {
          const firstFarm = allFarms[0];
          setSelectedFarm(firstFarm);
          updateFarmLocationMeta(firstFarm.country, dispatch);
        }
      } catch (error) {
        console.error('Error fetching user farms or dashboard data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFarms();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeMainTab !== 'FarmOverview') return;
    if (!selectedFarm?.farm_id) return;
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setLockActiveCropInsightTab(true);
        setLockGrowCycleTab(true);
        const response = await api.get(
          `/api/xos/dashboard?farmId=${selectedFarm.farm_id}&type=farmoverview`
        );
        const data = response.data.data;
        const combinedData = {
          ...data,
          farm: selectedFarm,
        };
        // console.log("FULL API RESPONSE of Farm Overview:", combinedData);
        setDashboardData(combinedData);
        setShowTimeline(data?.showTimeline ?? false);
        setLockActiveCropInsightTab(data?.lockActiveCropInsightTab ?? false);
        setLockGrowCycleTab(data?.lockGrowCycleTab ?? false);
      } catch (error) {
        console.error('Error fetching dashboard data for selected farm:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [selectedFarm?.farm_id, activeMainTab]);
  
  useEffect(() => {
    if (!selectedFarm?.farm_id || activeMainTab !== 'GrowCycle') return;

    const fetchGrowCycleData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/xos/dashboard?farmId=${selectedFarm.farm_id}&type=growcycle&growcycle=${growcycleValue}`);
        setGrowcycleapidata(data?.data);
      } catch (error) {
        console.error('Error fetching Grow Cycle data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrowCycleData();
  }, [selectedFarm?.farm_id, growcycleValue, activeMainTab]);

  type ActiveInsight = {
    list: {
      growth_cycle: number;
      cropCycles: {
        cycle_id: number;
        crop_name: string;
        crop_variety: string;
        status: string;
      }[];
    }[];
    chosenCycle: {
      cycle_id: number;
      crop_name: string;
      crop_variety: string;
      growth_cycle: number;
      status: string;
    } | null;
    overviewData: {
      environmentMetrics?: any[];
      keyMilestones?: any;
      rackShelfData?: any;
    };
    realtimeActivityData: any;
  };

  const [activeInsightData, setActiveInsightData] = useState<ActiveInsight>({
    list: [],
    chosenCycle: null,
    overviewData: {},
    realtimeActivityData: {},
  });

 const fetchInsights = async (cycleId?: number) => {
  try {
    const isLoadingFromTabChange = cycleId === undefined;
    isLoadingFromTabChange ? setLoading(true) : setPanelLoading(true);
    
    // ✅ First, fetch the list to find cycle 770
    let url = `/api/xos/dashboard?farmId=${selectedFarm?.farm_id}&type=activecropinsights`;
    if (cycleId) url += `&cropcycle=${cycleId}`;
    
    const res = await api.get(url);
    const { growCyclesList, chosenCycle, overviewData, realtimeActivityData } = res.data?.data ?? {};

    setActiveInsightData({
      list: growCyclesList,
      chosenCycle,
      overviewData,
      realtimeActivityData
    });

    // Set selected cycle based on API response
    if (chosenCycle) {
      setSelectedGrowthCycle(chosenCycle.growth_cycle);
      setSelectedCropCycle(chosenCycle.cycle_id);
    } else if (growCyclesList && growCyclesList.length > 0) {
      // Fallback to first cycle if chosenCycle is not provided
      const firstGrowCycle = growCyclesList[0];
      setSelectedGrowthCycle(firstGrowCycle.growth_cycle);
      const firstCrop = firstGrowCycle.cropCycles[0];
      if (firstCrop) setSelectedCropCycle(firstCrop.cycle_id);
    }
  } catch (err) {
    console.error('Error loading Active Crop Insights', err);
  } finally {
    setLoading(false);
    setPanelLoading(false);
  }
};

  const [lockActiveCropInsightTab, setLockActiveCropInsightTab] = useState(true);
  const [lockGrowCycleTab, setLockGrowCycleTab] = useState(true);
  
  const handleCycleChange = (cid: number) => {
    fetchInsights(cid);
  };

  useEffect(() => {
    if (activeMainTab === 'ActiveCropInsights' && selectedFarm?.farm_id) {
      if (skipAutoFetchRef.current) {
        skipAutoFetchRef.current = false;
        return;
      }
      fetchInsights();
    }
  }, [activeMainTab, selectedFarm?.farm_id]);

  const [selectedGrowthCycle, setSelectedGrowthCycle] = useState<number | null>(null);
  const [selectedCropCycle, setSelectedCropCycle] = useState<number | null>(null);

  const handleGrowCycleChange = (growCycleId: number) => {
    setPanelLoading(true);
    setSelectedGrowthCycle(growCycleId);
    const cropCycles = activeInsightData.list.find(g => g.growth_cycle === growCycleId)?.cropCycles || [];
    const firstCrop = cropCycles[0];
    if (firstCrop) {
      setSelectedCropCycle(firstCrop.cycle_id);
      handleCycleChange(firstCrop.cycle_id);
    }
  };

  const handleCropCycleChange = (cropCycleId: number) => {
    setPanelLoading(true);
    setSelectedCropCycle(cropCycleId);
    handleCycleChange(cropCycleId);
  };

  const handleTimelineSelect = ({
    growthCycle,
    cycleId,
  }: {
    growthCycle: number;
    cycleId: number;
  }) => {
    skipAutoFetchRef.current = true;
    setActiveMainTab("ActiveCropInsights");
    setSelectedGrowthCycle(growthCycle);
    setSelectedCropCycle(cycleId);
    handleCycleChange(cycleId);
  };

  return (
    <Box sx={{ position: 'relative', overflowY: 'hidden' }}>
      <Box
        sx={{
          filter: isAuthenticated ? 'none' : 'blur(4px)',
          pointerEvents: isAuthenticated ? 'auto' : 'none',
          transition: 'filter 0.3s ease-in-out',
          maxWidth: '100%',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
          <BannerWithPagination />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              pt: 4,
              pb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  fontFamily: 'Poppins',
                  color: 'rgba(0, 18, 25, 0.87)',
                }}
              >
                Welcome back, {userInfo?.username || 'John Doe'}!
              </Typography>
              <Box
                sx={{
                  fontSize: '1rem',
                  fontFamily: 'Poppins',
                  lineHeight: '200%',
                  letterSpacing: '0.15px',
                  color: 'rgba(0, 18, 25, 0.6)',
                }}
              >
                <Currentdatetime />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!initialLoading && (
                <>
                  {userFarms.length > 0 ? (
                    <>
                      <Button
                        sx={{
                          backgroundColor: '#e65000',
                          color: '#fff',
                          padding: '6px 16px',
                          textTransform: 'uppercase',
                          fontWeight: 500,
                          opacity: selectedFarm?.status !== "SETUP DONE" ? 0.8 : 1,
                          pointerEvents: selectedFarm?.status !== "SETUP DONE" ? 'none' : 'auto',
                          boxShadow:
                            '0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)',
                          '&:hover': {
                            backgroundColor: selectedFarm?.status === "SETUP DONE" ? '#cc4500' : '#e65000',
                          },
                        }}
                        disabled={selectedFarm?.status !== "SETUP DONE"}
                        onClick={() => {
                          const region = selectedFarm.country === 'India' ? 'Delhi-NCR' : 'Abu-Dhabi';
                          router.push(
                            `/farmsxos/addcrop?farmId=${selectedFarm.farm_id}&region=${region}`
                          );
                        }}
                      >
                        Add Crop
                      </Button>
                      <Select
                        value={selectedFarm?.farm_name || ''}
                        onChange={(e) => {
                          const farm = userFarms.find(
                            (f: any) => f.farm_name === e.target.value
                          );
                          if (farm) {
                            setSelectedFarm(farm);
                            setActiveMainTab('FarmOverview');
                            setActiveSubTab('Performance');
                            updateFarmLocationMeta(farm.country, dispatch);
                          }
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Farm selector' }}
                        sx={{
                          height: '40px',
                          fontFamily: 'Poppins',
                          fontSize: '0.875rem',
                          border: '1px solid rgba(0, 0, 0, 0.12)',
                          borderRadius: '4px',
                          padding: '0 10px',
                          minWidth: '250px',
                          boxShadow: 'none',
                        }}
                        IconComponent={() => (
                          <Image src="/apps/dashboard/downarrow.svg" width={20} height={20} alt="" />
                        )}
                      >
                        {userFarms.map((farm: any) => (
                          <MenuItem key={farm.farm_id} value={farm.farm_name}>
                            {farm.farm_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  ) : (
                    <Button
                      sx={{
                        backgroundColor: '#e65000',
                        color: '#fff',
                        padding: '6px 16px',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        boxShadow:
                          '0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)',
                        '&:hover': { backgroundColor: '#cc4500' },
                      }}
                      onClick={() => {
                        console.log('Opening farm register modal...');
                        setOpenRegisterFarmModal(true);
                      }}
                    >
                      Register Your Farm
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Box>
          
          {showTimeline && dashboardData && (
            <Box >
              <Farmregisterprogress response={dashboardData} />
            </Box>
          )}

          {initialLoading ? (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 8,
              mt: 4
            }}>
              <LoadingSpinner />
            </Box>
          ) : userFarms.length > 0 ? (
            !showTimeline ? (
              <>
                {/* Main Tabs */}
                <Box
                  sx={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    fontFamily: 'Poppins',
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    {[
                      { label: 'Farm Overview', key: 'FarmOverview' },
                      {
                        label: 'Grow Cycle',
                        key: 'GrowCycle',
                        disabled: lockGrowCycleTab,
                        tooltip: lockGrowCycleTab ? "Create Grow Cycle to unlock this tab" : ""
                      },
                      {
                        label: 'Active Crop Insights',
                        key: 'ActiveCropInsights',
                        disabled: lockActiveCropInsightTab,
                        tooltip: lockActiveCropInsightTab ? "Create Active Crop Insights to unlock this tab" : ""
                      },
                      { label: 'Smart Robotics', key: 'SmartRobotics' },
                    ].map((tab) => (
                      <Tooltip
                        key={tab.key}
                        title={tab.tooltip}
                        arrow
                        placement="bottom"
                        disableHoverListener={!tab.disabled}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            color: activeMainTab === tab.key
                              ? '#ff5e00'
                              : tab.disabled
                                ? 'rgba(0, 18, 25, 0.3)'
                                : 'rgba(0, 18, 25, 0.6)',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            fontSize: '0.875rem',
                            letterSpacing: '0.4px',
                            py: '0.562rem',
                            cursor: tab.disabled ? 'not-allowed' : 'pointer',
                            '&:hover': {
                              color: tab.disabled ? 'rgba(0, 18, 25, 0.3)' : '#ff5e00'
                            },
                          }}
                          onClick={() => !tab.disabled && setActiveMainTab(tab.key as any)}
                        >
                          {tab.label}
                          {activeMainTab === tab.key && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '2px',
                                backgroundColor: '#ff5e00',
                              }}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    ))}
                  </Box>
                </Box>

                {/* Farm Overview Tab */}
                {activeMainTab === 'FarmOverview' && (
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5" fontWeight={600}>Farm Overview</Typography>
                        <Box
                          onClick={async () => {
                            try {
                              const res = await api.get(`/api/cropcycle?farmId=${selectedFarm?.farm_id}`);
                              const allocationforfarm = res.data.farms[0];
                              console.log('cropcycleforfarm:', allocationforfarm);
                              setAllocationforfarm(allocationforfarm);
                              setOpenAllocatorModal(true);
                            } catch (err) {
                              console.error('Error fetching crop cycle data:', err);
                            }
                          }}
                          sx={{
                            borderRadius: '4px',
                            px: 2,
                            py: 0.5,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            backgroundColor: '#e65000',
                            color: '#fff',
                            boxShadow:
                            '0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)',
                            '&:hover': {
                              backgroundColor: '#cc4500',
                            },
                          }}
                        >
                          Rack & Shelves Allocation
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Provides a snapshot of the farm&apos;s key metrics and status.
                      </Typography>
                    </Box>

                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2, mt: 1 }}>
                        <LoadingSpinner />
                      </Box>
                    ) : (<>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {[
                          { label: 'Performance', key: 'Performance' },
                          {
                            label: 'Crop Growth & Yield',
                            key: 'CropGrowthYield',
                          },
                          {
                            label: 'Monitor & Control',
                            key: 'MonitoringEnvironment',
                          },
                        ].map((sub) => {
                          const isActive = activeSubTab === sub.key;
                          return (
                            <Box
                              key={sub.key}
                              sx={{
                                px: 2,
                                py: 1,
                                fontWeight: isActive ? 500 : 400,
                                cursor: 'pointer',
                                border: isActive
                                  ? '1px solid #008756'
                                  : '1px solid rgba(0,0,0,0.12)',
                                borderRadius: '4px',
                                backgroundColor: isActive
                                  ? 'rgba(0,135,86,0.08)'
                                  : '#FFF',
                                color: isActive ? '#008756' : 'inherit',
                                '&:hover': {
                                  borderColor: '#008756',
                                  color: '#008756',
                                },
                              }}
                              onClick={() => setActiveSubTab(sub.key as any)}
                            >
                              {sub.label}
                            </Box>
                          );
                        })}
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        {activeSubTab === 'Performance' && dashboardData && (
                          <Performance
                            data={dashboardData}
                            onGrowthCycleClick={handlePerformanceGrowthCycleClick}
                            onAlertMetricClick={handlePerformanceAlertMetricClick}
                            iot={selectedFarm?.iot ?? true}
                            ai={selectedFarm?.ai ?? true}
                          />
                        )}
                        {activeSubTab === 'CropGrowthYield' && (
                          <CropGrowthYield
                            data={dashboardData?.cropGrowthAndYieldTab}
                            onGrowCycleClick={handleCropYieldGrowCycleClick}
                            onCropCycleClick={handleCropYieldCropCycleClick}
                          />
                        )}
                        {activeSubTab === 'MonitoringEnvironment' && (
                          <MonitoringEnvironment 
                            data={dashboardData?.monitoringAndEnvironment} 
                            farmId={selectedFarm.farm_id}
                            iot={selectedFarm?.iot ?? true}
                            ai={selectedFarm?.ai ?? true}
                          />
                        )}
                      </Box>
                    </>
                    )}
                  </Box>
                )}

                {/* Grow Cycle Tab */}
                {activeMainTab === 'GrowCycle' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box>
                        <Typography variant="h5" fontWeight={600}>
                          Grow Cycle
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tracks the progress of crops through their growth cycle.
                        </Typography>
                      </Box>

                      {/* Buttons Container */}
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* ✅ Queue Cycles Button - Fetches and Opens Modal */}
                        <Button
                          onClick={fetchQueuedCycles}
                          disabled={loadingQueue}
                          sx={{
                            minWidth: 180,
                            height: '40px',
                            backgroundColor: '#f5fdf8',
                            border: '1px solid #4caf50',
                            borderRadius: '8px',
                            fontWeight: 500,
                            color: '#008756',
                            textTransform: 'none',
                            '&:hover': {
                              borderColor: '#4caf50',
                            },
                            '&:disabled': {
                              opacity: 0.6,
                            },
                          }}
                        >
                          {loadingQueue ? (
                            <CircularProgress size={20} sx={{ color: '#008756' }} />
                          ) : (
                            'View All Queue Cycles'
                          )}
                        </Button>

                        {/* Grow Cycles Dropdown */}
                        <Select
                          value={growcycleValue}
                          onChange={(e) => {
                            const val = e.target.value;
                            setGrowcycleValue(val === 'all' ? 'all' : Number(val));
                          }}
                          displayEmpty
                          sx={{
                            minWidth: 180,
                            height: '40px',
                            backgroundColor: '#f5fdf8',
                            border: '1px solid #4caf50',
                            borderRadius: '8px',
                            fontWeight: 500,
                            color: '#008756',
                            '& .MuiSelect-icon': {
                              color: '#008756',
                            },
                            '& fieldset': { border: 'none' },
                          }}
                        >
                          <MenuItem value="all">All Grow Cycles</MenuItem>
                          {selectedFarm?.growth_cycles?.map((id: number) => (
                            <MenuItem key={id} value={id}>Grow Cycle {id}</MenuItem>
                          ))}
                        </Select>
                      </Box>
                    </Box>

                    {/* Grow Cycle Content - NO inline CropQueueDisplay */}
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2, mt: 1 }}>
                        <LoadingSpinner />
                      </Box>
                    ) : (
                      <GrowCycleOverview
                        growcycleapidata={growcycleapidata}
                        onTimelineSelect={handleTimelineSelect}
                        onCycleClick={handleCycleClick}
                        iot={selectedFarm?.iot ?? true}
                        ai={selectedFarm?.ai ?? true}
                      />
                    )}
                  </Box>
                )}

                {/* Smart Robotics Placeholder */}
                {['SmartRobotics'].includes(activeMainTab) && (
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      px: 2,
                      mt: "10rem",
                      minHeight: '75vh',
                      overflowY: 'auto',
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: '#e65000',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '1rem 2rem',
                        minWidth: '200px',
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '1rem',
                        boxShadow:
                          '0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      COMING SOON
                    </Box>
                  </Box>
                )}

                {/* Active Crop Insights */}
                {activeMainTab === 'ActiveCropInsights' && (
                  <ActiveCropInsightsSection
                    farmId={selectedFarm.farm_id}
                    loading={loading}
                    panelLoading={panelLoading}
                    selectedGrowthCycle={selectedGrowthCycle}
                    selectedCropCycle={selectedCropCycle as number}
                    activeInsightData={activeInsightData}
                    activeCropInsightsTab={activeCropInsightsTab}
                    setActiveCropInsightsTab={setActiveCropInsightsTab}
                    handleGrowCycleChange={handleGrowCycleChange}
                    handleCropCycleChange={handleCropCycleChange}
                    setActiveMainTab={setActiveMainTab}
                    setGrowcycleValue={setGrowcycleValue}
                    realtimeActivityData={activeInsightData?.realtimeActivityData??{}}
                    iot={selectedFarm?.iot ?? true}
                  />
                )}
                 {/* 4) Smart Robotics */}
                {/*{activeMainTab === 'SmartRobotics' && <Typography>coming soon...</Typography>} {/*(
                <Box>
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    Smart Robotics
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    AI-powered robots for automated farming tasks.
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    {[
                      { label: 'AI Robot', key: 'AIRobot' },
                      { label: 'Drone', key: 'Drone' },
                    ].map((sub) => (
                      <Box
                        key={sub.key}
                        sx={{
                          px: 2,
                          py: 1,
                          fontWeight: smartRoboticsTab === sub.key ? 500 : 400,
                          cursor: 'pointer',
                          border:
                            smartRoboticsTab === sub.key
                              ? '1px solid #008756'
                              : '1px solid rgba(0,0,0,0.12)',
                          borderRadius: '4px',
                          backgroundColor:
                            smartRoboticsTab === sub.key
                              ? 'rgba(0,135,86,0.08)'
                              : '#FFF',
                          color:
                            smartRoboticsTab === sub.key
                              ? '#008756'
                              : 'inherit',
                          '&:hover': {
                            borderColor: '#008756',
                            color: '#008756',
                          },
                        }}
                        onClick={() => setSmartRoboticsTab(sub.key as any)}
                      >
                        {sub.label}
                      </Box>
                    ))}
                  </Box>

                  {smartRoboticsTab === 'AIRobot' && (
                    <SmartRoboticsDashboard />
                  )}
                  {smartRoboticsTab === 'Drone' && <SmartDroneDashboard />}
                </Box>
              )}*/}
              </>
            ) : null
          ) : (
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={600} color="text.secondary">
                Please register your farm to view insights.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {!isAuthenticated && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <FarmUserRegister />
        </Box>
      )}

      <FarmRegisterModal
        open={openRegisterFarmModal}
        onClose={() => setOpenRegisterFarmModal(false)}
        onBack={() => { }}
        onSubmit={async (data) => {
          setOpenRegisterFarmModal(false);
          const { farm, showTimeline, timelineData } = data.data;

          setShowTimeline(showTimeline);

          setUserFarms((prev) => {
            const exists = prev.some((f) => f.farm_id === farm.farm_id);
            return exists ? prev : [...prev, farm];
          });

          setDashboardData({
            showTimeline,
            timelineData,
            farm,
          });

          try {
            const dashboardRes = await api.get(
              `/api/xos/dashboard?farmId=${farm.farm_id}&type=farmoverview`
            );
            const fetchedData = dashboardRes.data.data;
            setDashboardData({
              ...fetchedData,
              farm,
            });
            setShowTimeline(fetchedData?.showTimeline || false);
          } catch (err) {
            console.error("Error loading dashboard for new farm:", err);
          }
        }}
      />
      <RackShelfAllocator
        open={openAllocatorModal}
        onClose={() => setOpenAllocatorModal(false)}
        selectedFarmId={selectedFarm?.farm_id}
        totalShelves={allocationforfarm?.totalShelves ?? 0}
        allocationforfarm={allocationforfarm}
        onSaveComplete={() => {
          setOpenAllocatorModal(false);
        }}
      />

      <Modal
        open={openQueueModal}
        onClose={() => setOpenQueueModal(false)}
        aria-labelledby="queue-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '1000px',
            maxHeight: '85vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: 'rgba(255, 152, 0, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AccessTimeIcon sx={{ color: '#ff9800', fontSize: 32 }} />
              <Box>
                <Typography id="queue-modal-title" variant="h5" fontWeight={600}>
                  All Queued Crop Cycles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {loadingQueue 
                    ? 'Loading...' 
                    : queuedCyclesData.length === 0
                    ? 'No crops waiting for shelf availability'
                    : `${queuedCyclesData.length} crop${queuedCyclesData.length === 1 ? '' : 's'} waiting for shelf availability`
                  }
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setOpenQueueModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content - Display Individual Crop Cards */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
            {loadingQueue && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress size={40} />
              </Box>
            )}

            {!loadingQueue && queuedCyclesData.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 6,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Queued Cycles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All your crops are either active or no cycles are waiting in queue.
                </Typography>
              </Box>
            )}

            {!loadingQueue && queuedCyclesData.length > 0 && (
              <>
                {/* Info Alert */}
                <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 3 }}>
                  These crops are queued and will automatically start from the TRANSPLANT stage when their assigned shelves become available.
                </Alert>

                {/* Queued Cycle Cards */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {queuedCyclesData.map((cycle, index) => {
                    const waitingShelf = cycle.waiting_for_shelf;
                    const hasSpecificShelf = waitingShelf?.rack_id && waitingShelf?.shelf_id;

                    return (
                      <Paper
                        key={cycle.cycle_id}
                        elevation={2}
                        sx={{
                          p: 2.5,
                          border: '1px solid rgba(255, 152, 0, 0.3)',
                          borderRadius: 2,
                          bgcolor: 'rgba(255, 152, 0, 0.05)',
                        }}
                      >
                        {/* Crop Header */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '2px solid #ff9800',
                              }}
                            >
                              <Image
                                src={`/apps/crop_icons/${cycle.crop_name.toLowerCase()}_${cycle.crop_variety.toLowerCase()}_${cycle.crop_type.toLowerCase().replace(/-/g, '_')}.svg`}
                                alt={cycle.crop_name}
                                width={48}
                                height={48}
                              />
                            </Box>
                            <Box>
                              <Typography variant="h6" fontWeight={600}>
                                {formatUnderscoreString(cycle.crop_name)} - {formatUnderscoreString(cycle.crop_variety)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Type: {cycle.crop_type} | Cycle ID: {cycle.cycle_id}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={`Position #${cycle.queue_position || index + 1}`}
                            size="small"
                            sx={{
                              bgcolor: '#fff3e0',
                              color: '#ff9800',
                              fontWeight: 600,
                            }}
                          />
                        </Box>

                        {/* Queue Details */}
                        {hasSpecificShelf && waitingShelf ? (
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2, 1fr)',
                              gap: 2,
                              pt: 2,
                              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                            }}
                          >
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Waiting for Shelf
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                Rack {waitingShelf.rack_id}, Shelf {waitingShelf.shelf_id}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Currently Occupied by
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {waitingShelf.current_crop || 'Unknown'}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Days Until Available
                              </Typography>
                              <Chip
                                label={`${waitingShelf.days_until_available} day${waitingShelf.days_until_available === 1 ? '' : 's'}`}
                                size="small"
                                color={waitingShelf.days_until_available <= 3 ? 'success' : 'default'}
                                sx={{ mt: 0.5 }}
                              />
                            </Box>

                            {waitingShelf.expected_available_date && (
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Expected Start Date
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {new Date(waitingShelf.expected_available_date).toLocaleDateString()}
                                </Typography>
                              </Box>
                            )}

                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Will Start From
                              </Typography>
                              <Chip
                                label={cycle.will_start_from}
                                size="small"
                                color="info"
                                sx={{ mt: 0.5 }}
                              />
                            </Box>

                            {cycle.queued_at && (
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Queued Since
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(cycle.queued_at).toLocaleDateString()}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        ) : (
                          <Alert severity="info" sx={{ mt: 2 }}>
                            Waiting for shelf assignment...
                          </Alert>
                        )}

                        {/* Success Alerts */}
                        {waitingShelf && waitingShelf.days_until_available <= 3 && waitingShelf.days_until_available > 0 && (
                          <Alert severity="success" sx={{ mt: 2 }}>
                            <Typography variant="caption">
                              🔥 This shelf will be available very soon! Your crop will auto-start.
                            </Typography>
                          </Alert>
                        )}

                        {waitingShelf && waitingShelf.days_until_available === 0 && (
                          <Alert severity="success" sx={{ mt: 2 }}>
                            <Typography variant="caption">
                              ✅ Shelf is available now! This cycle should start automatically.
                            </Typography>
                          </Alert>
                        )}
                      </Paper>
                    );
                  })}
                </Box>
              </>
            )}
          </Box>

          {/* Modal Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              display: 'flex',
              justifyContent: 'flex-end',
              bgcolor: '#fafafa',
            }}
          >
            <Button
              variant="contained"
              onClick={() => setOpenQueueModal(false)}
              sx={{
                bgcolor: '#ff9800',
                '&:hover': { bgcolor: '#f57c00' },
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Maindashboard;