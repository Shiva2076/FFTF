"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Tabs, Tab, Button, Dialog } from '@mui/material';
import Login from '@/components/Auth/Signin';
import Register from '@/components/Auth/Register';
import { RootState } from "@/app/store";
import { api } from "@/constants";
import { useDispatch, useSelector } from 'react-redux';
import { setCropGrowingGuide } from '@/app/slices/cropGrowingGuideSlice';
import { setCropsByRegion } from '@/app/slices/cropsByRegionSlice';
import { setCredentials } from '@/app/slices/authSlice';
import { checkMarketTrendSubscription } from '@/utils/utilsfuntions';
import { CircularProgress } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import { setMetaData } from '@/app/slices/locationMetaSlice';
import { setMarketLiveSnapshot } from "@/app/slices/marketLiveSnapshotSlice";
import { setSelectedCropType } from '@/app/slices/selectedCropTypeSlice';

// Import all components used for each tab
import LiveCropMarketUpdates from '../../components/Markettrend/MarketOverview/LiveCropMarketUpdates';
import BannerWithPagination from '../../components/Markettrend/MarketOverview/Bannerwithpagination';

// Market Overview components
import MarketOverviewTopCard from '../../components/Markettrend/MarketOverview/MarketOverviewtopcard';
import Topperformingcrops from '../../components/Markettrend/MarketOverview/Topperformingcrops';
import MarketPriceTrend from '../../components/Markettrend/MarketOverview/Marketpricetrend';
import Socialtrends from '../../components/Markettrend/MarketOverview/Socialtrends';
import AIRecommendedCrops from '../../components/Markettrend/MarketOverview/Airecommendedcrops';
import SmartMarketRecommendations from '../../components/Markettrend/MarketOverview/SmartMarketRecommendations';
import Marketdistributionbyregion from '../../components/Markettrend/MarketOverview/Marketdistributionbyregion';
import Marketplayers from '../../components/Markettrend/MarketOverview/Marketplayers';
import MarketForecast from '../../components/Markettrend/MarketOverview/Marketforecast';
import Operationalcosttrends from '../../components/Markettrend/MarketOverview/Operationalcosttrends';
import Distributionbyproducttype from '../../components/Markettrend/MarketOverview/Distributionbyproducttype';

// Crop Insights components 
import CropInsightsAIRecommendedCrops from '../../components/Markettrend/CropInsights/CropInsightsAIRecommendedCrops';
import HighestDemandCrops from '../../components/Markettrend/CropInsights/HighestDemandCrops';
import MostProfitableCrops from '../../components/Markettrend/CropInsights/MostProfitableCrops';
import LoadingSpinner from '@/components/LoadingSpinner';
import AccountVerifiedNotification from '@/components/AccountSettings/AccountVerifiedNotification';
import AddNewCropModal from '@/components/Markettrend/AddNewCropModal/AddNewCropModal';
import { FaPlus } from 'react-icons/fa';
const Content: React.FC = () => {
  const selectedCroptypetab = useSelector((state: RootState) => state.selectedCropTypetab);  
  const skipAutoFetchRef = useRef(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromURL = searchParams.get("tab") || "market-overview";
  const [activeTab, setActiveTab] = useState<'market-overview' | 'crop-insights'>(tabFromURL as any);
  
  // Set page title
  useEffect(() => {
    document.title = 'INNOFarms.AI Markettrend';
  }, []);
  
  useEffect(() => {
    setActiveTab(tabFromURL as any);
  }, [tabFromURL]);
  const handleTabClick = (tab: 'market-overview' | 'crop-insights') => {
    setActiveTab(tab);
    router.push(`/markettrend?tab=${tab}`);
  };
  const [marketData, setMarketData] = useState<any>(null);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = Boolean(userInfo?.user_id);
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [lockMicrogreens, setLockMicrogreens] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>(
    () => sessionStorage.getItem('selected-country') || 'United Arab Emirates'
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    () => sessionStorage.getItem('selected-city') || 'Abu-Dhabi'
  );
  const [isAddNewCropModalOpen, setAddNewCropModalOpen] = useState<boolean>(false);
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [openRegister, setOpenRegister] = useState<boolean>(false);
  useEffect(() => {
    sessionStorage.setItem('selected-country', selectedCountry);
  }, [selectedCountry]);
  
  useEffect(() => {
    sessionStorage.setItem('selected-city', selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    const selectedLoc = locations.find(loc => loc.city === selectedCity);
    if (selectedLoc?.meta_data) {
      dispatch(setMetaData(selectedLoc.meta_data));
    }
  }, [selectedCity, locations, dispatch]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get('/api/crop/getactivelocations');
        const locs: Array<{ country: string; city: string; meta_data?: any }> = res.data.locations || [];
        setLocations(locs);

        const storedCountry = sessionStorage.getItem('selected-country');
        const storedCity = sessionStorage.getItem('selected-city');

        if (!storedCountry || !storedCity) {
          if (locs.length > 0) {
          setSelectedCountry(locs[0].country);
          setSelectedCity(locs[0].city);
            if (locs[0].meta_data) {
              dispatch(setMetaData(locs[0].meta_data));
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch locations', err);
      }
    };
    fetchLocations();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const SelectedCropType = selectedCroptypetab;
        const [marketRes, guideRes] = await Promise.all([
          api.get('/api/marketstatistics', {  params: { 
              region: selectedCity,
              crop_type: SelectedCropType 
            } 
          }),
          api.get('/api/marketstatistics/cropgrowingguide', {
            params: { 
              region: selectedCity,
              cropType: SelectedCropType 
            }
          }),
        ]);
        setMarketData(marketRes.data);
        if (marketRes.data?.lockMicrogreens !== undefined) {
          setLockMicrogreens(marketRes.data.lockMicrogreens);
        }
        dispatch(setCropsByRegion(
          marketRes.data.cropsByRegion.map(({ price_trend, ...rest }: any) => rest)
        ));
        dispatch(setCropGrowingGuide(guideRes.data));
        dispatch(setMarketLiveSnapshot(marketRes.data?.marketLiveSnapshot ?? []));
        if (userInfo?.user_id) {
          try {
            const subRes = await api.get('/api/payments/usersubscriptions');
            const subscriptions = subRes.data?.usersubscriptions || [];
            const markettrendsubscription = checkMarketTrendSubscription(subscriptions);

            const updatedUserInfo = {
              ...userInfo,
              markettrendsubscribed: markettrendsubscription,
            };
            dispatch(setCredentials(updatedUserInfo));
          } catch (err) {
            console.warn("Subscription fetch skipped or failed:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching market data or crop guide:", err);
      }
      finally {
      setIsLoadingData(false);
    }
    };
    fetchData();
  }, [userInfo?.user_id, selectedCity, selectedCroptypetab, dispatch]);

    if (isLoadingData || !marketData) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <AccountVerifiedNotification>
      <Box style={{ marginBottom: '16px' }}>
        <LiveCropMarketUpdates />
      </Box>
      <Box style={{ marginLeft: '16px', marginRight: '8px' }}>
        <BannerWithPagination />
      </Box>

      {/* Outer Container */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          p: '2rem',
          boxSizing: 'border-box',
          gap: '1rem',
          textAlign: 'left',
          fontSize: '2.125rem',
          color: 'rgba(0, 18, 25, 0.87)',
          fontFamily: 'Poppins',
        }}
      >
        {/* INNOMarketTrend Title & Subtitle */}
        <Box
          sx={{
            width: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            gap: "0.5rem",
            textAlign: "left",
            fontSize: "0.875rem",
            color: "rgba(0, 18, 25, 0.87)",
            fontFamily: "Poppins",
            flexWrap: "wrap"
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              fontSize: "3rem"
            }}
          >
            <b>INNOMarketTrend</b>
            <Typography
              sx={{
                fontSize: "1rem",
                letterSpacing: "0.15px",
                lineHeight: "200%",
                color: "rgba(0, 18, 25, 0.6)"
              }}
            >
              Optimize your yields with real-time market trends and forecasts.
            </Typography>
          </Box>

          {/* Country Dropdown */}
          <Box
            sx={{
              width: "10rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              border: "1px solid rgba(0, 0, 0, 0.12)",
              borderRadius: "4px",
              px: 1,
              backgroundColor: "#fff"
            }}
          >
            <select
              style={{ width: "100%", border: "none", outline: "none", fontFamily: 'Poppins' }}
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                const firstCity = locations.find(l => l.country === e.target.value)?.city;
                if (firstCity) setSelectedCity(firstCity);
              }}
            >
              {[...new Set(locations.map(loc => loc.country))].map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </Box>
          <Box
            sx={{
              width: "8.5rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              border: "1px solid rgba(0, 0, 0, 0.12)",
              borderRadius: "4px",
              px: 1,
              backgroundColor: "#fff"
            }}
          >
            <select
              style={{ width: "100%", border: "none", outline: "none", fontFamily: 'Poppins' }}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {locations
                .filter(loc => loc.country === selectedCountry)
                .map(loc => (
                  <option key={loc.city} value={loc.city}>{loc.city}</option>
                ))}
            </select>
          </Box>
        </Box>
        {/* Crop Type Selection Buttons */}
        <Box sx={{ display: 'flex', gap: '1rem', mb: '1rem', alignSelf: 'flex-start' }}>
          <Box
            onClick={() => {
              dispatch(setSelectedCropType('Leafy-Greens'));
            }}
            sx={{
              cursor: 'pointer',
              px: 3.75,
              py: 1.25,
              fontSize: '0.875rem',
              fontWeight: selectedCroptypetab === 'Leafy-Greens' ? 800 : 600,
              border: `1px solid ${selectedCroptypetab === 'Leafy-Greens' ? '#008756' : 'rgba(0,0,0,0.12)'}`,
              borderRadius: 1,
              bgcolor: selectedCroptypetab === 'Leafy-Greens' ? 'rgba(0,135,86,0.08)' : '#fff',
              color: selectedCroptypetab === 'Leafy-Greens' ? '#008756' : 'inherit',
              transition: 'all 0.2s ease-in-out',
              width: 'fit-content',
              '&:hover': {
                bgcolor: selectedCroptypetab === 'Leafy-Greens' ? 'rgba(0,135,86,0.12)' : 'rgba(0,0,0,0.04)'
              }
            }}
          >
            Leafy Greens
          </Box>

          {/* <Box
            onClick={() => {
              if (!lockMicrogreens) {
                dispatch(setSelectedCropType('Microgreens'));
              }
            }}
            sx={{
              cursor: lockMicrogreens ? 'not-allowed' : 'pointer',
              px: 3.75,
              py: 1.25,
              fontSize: '0.875rem',
              fontWeight: selectedCroptypetab === 'Microgreens' ? 800 : 600,
              border: `1px solid ${
                selectedCroptypetab === 'Microgreens' ? '#008756' : 
                lockMicrogreens ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.12)'
              }`,
              borderRadius: 1,
              bgcolor: selectedCroptypetab === 'Microgreens' ? 'rgba(0,135,86,0.08)' :
                        lockMicrogreens ? 'rgba(0,0,0,0.02)' : '#fff',
              color: selectedCroptypetab === 'Microgreens' ? '#008756' :
                      lockMicrogreens ? 'rgba(0,0,0,0.3)' : 'inherit',
              transition: 'all 0.2s ease-in-out',
              width: 'fit-content',
              '&:hover': {
                bgcolor: lockMicrogreens ? 'rgba(0,0,0,0.02)' :
                          selectedCroptypetab === 'Microgreens' ? 'rgba(0,135,86,0.12)' : 'rgba(0,0,0,0.04)'
              },
              opacity: lockMicrogreens ? 0.6 : 1
            }}
          >
            Microgreens
          </Box> */}
        </Box>

        {/* TABS: Market Overview / Crop Insights */}
        <Box
          sx={{
            width: '100%',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.875rem',
            color: '#ff5e00',
            boxSizing: 'border-box',
            overflow: 'hidden',
            mb: '1.5rem',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          {/* MARKET OVERVIEW TAB */}
          <Box
            sx={{
              position: 'relative',
              cursor: 'pointer',
              color: activeTab === 'market-overview' ? '#ff5e00' : 'rgba(0, 18, 25, 0.6)'
            }}
            onClick={() => handleTabClick('market-overview')}
          >
            <Box sx={{ p: '0.562rem 1rem' }}>
              <Typography
                component="div"
                sx={{
                  letterSpacing: '0.4px',
                  lineHeight: '1.5rem',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                Market Overview
              </Typography>
            </Box>
            {activeTab === 'market-overview' && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  borderTop: '2px solid #ff5e00',
                }}
              />
            )}
          </Box>

          {/* CROP INSIGHTS TAB */}
          <Box
            sx={{
              position: 'relative',
              cursor: 'pointer',
              color: activeTab === 'crop-insights' ? '#ff5e00' : 'rgba(0, 18, 25, 0.6)',
            }}
            onClick={() => handleTabClick('crop-insights')}
          >
            <Box sx={{ p: '0.562rem 1rem' }}>
              <Typography
                component="div"
                sx={{
                  letterSpacing: '0.4px',
                  lineHeight: '1.5rem',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                Crop Insights
              </Typography>
            </Box>
            {activeTab === 'crop-insights' && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  borderTop: '2px solid #ff5e00',
                }}
              />
            )}
          </Box>
          </Box>

          <Button
            sx={{
              backgroundColor: '#e65000',
              color: '#fff',
              padding: '6px 16px',
              textTransform: 'uppercase',
              fontWeight: 500,
              ml: 'auto',
            }}
            onClick={() => {
              if (isAuthenticated) {
                setAddNewCropModalOpen(true);
              } else {
                setOpenLogin(true);
              }
            }}
          >
            <FaPlus style={{ marginRight: '8px' }} /> Add New Crop to Track
          </Button>
        </Box>
        
        {/** 
         * Market Overview Content 
         * Render these components IF activeTab === 'market-overview'
         */}
        {activeTab === 'market-overview' && (
          <>
            {/* Summary Cards */}
            <MarketOverviewTopCard data={marketData.currentSnapshot} />
            {/* Top Performing Crops and Market Price Trend */}
            <Grid container spacing={2} padding={2} sx={{ alignItems: 'stretch' }}>
              {/* AI Recommended Crops - Full Width */}
              <Grid item xs={12}>
                <AIRecommendedCrops 
                  data={marketData.cropsByRegion} 
                  onSeeMore={() => handleTabClick('crop-insights')}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <Topperformingcrops data={marketData.topPerformingCrops } />
              </Grid>
              <Grid item xs={12} md={7}>
                <MarketPriceTrend data={marketData.marketPriceTrends} />
              </Grid>
              {/* Social Trends */}
              <Grid item xs={12}>
                <Socialtrends
                  youtubeSentiments={Array.isArray(marketData.youtubeSentiments) ? marketData.youtubeSentiments : []}
                  googleSearchTrends={Array.isArray(marketData.googleSearchTrends) ? marketData.googleSearchTrends : []}
                  restaurantMenu={Array.isArray(marketData.restaurantMenu) ? marketData.restaurantMenu : []}
                />
              </Grid>
              
              <Grid item xs={12}>
                <SmartMarketRecommendations data={marketData.smartMarketRecommendations} />
              </Grid>
              {/* Market Distribution by Region and Market Players */}
              <Grid item xs={12} md={6}>
                <Marketdistributionbyregion data={marketData.marketDistributionByRegion} />
              </Grid>
             <Grid item xs={12} md={6}>
                {selectedCroptypetab === 'Microgreens' ? (
                  <Distributionbyproducttype data={marketData.distributionByProductType} />
                ) : (
                  <Marketplayers data={marketData.marketPlayersByCategory} />
                )}
              </Grid>
              {/* Market Forecast and Operational Cost Trends */}
              <Grid item xs={12} md={6}>
                <MarketForecast data={marketData.marketForecast} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Operationalcosttrends data={marketData.operationalCostsTrends} />
              </Grid>
            </Grid>
          </>
        )}

        {/** 
         * Crop Insights Content 
         */}
        {activeTab === 'crop-insights' && (
          <>
            <Grid container spacing={2}>
              {/* Top row: 2 columns side by side */}
               <Grid item xs={12}>
                <CropInsightsAIRecommendedCrops data={marketData.cropsByRegion} />
              </Grid>
              {/* Second row: single column spanning full width */}
              <Grid item xs={12} md={6}>
                <MostProfitableCrops data={marketData.cropsByRegion} />
              </Grid>
              <Grid item xs={12} md={6}>
                <HighestDemandCrops data={marketData.cropsByRegion} />
              </Grid>
            </Grid>
          </>
        )}
      </Box>
      </AccountVerifiedNotification>
      
      {/* Add New Crop Modal */}
      <AddNewCropModal
        open={isAddNewCropModalOpen}
        onClose={() => setAddNewCropModalOpen(false)}
        region={selectedCity}
      />

      {/* Login Modal */}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
        <Login onClose={() => setOpenLogin(false)} onSwitch={() => { setOpenLogin(false); setOpenRegister(true); }} />
      </Dialog>
      <Dialog open={openRegister} onClose={() => setOpenRegister(false)}>
        <Register open={openRegister} onClose={() => setOpenRegister(false)} onSwitch={() => { setOpenRegister(false); setOpenLogin(true); }} />
      </Dialog>
    </>
  );
};

export default Content;