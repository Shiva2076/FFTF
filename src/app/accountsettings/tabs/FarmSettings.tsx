'use client';
 
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Tooltip,
} from '@mui/material';
import { useSelector } from 'react-redux';
import FarmRegisterModal from '@/components/dashboard/Farm/FarmRegister';
import { api } from '@/constants';
import type { RootState } from '../../store';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import LoadingSpinner from '@/components/LoadingSpinner';
import Farmregisterprogress from '@/components/dashboard/Farm/Farmregisterprogress';
 
interface FarmApi {
  farm_id: number;
  farm_name: string;
  city: string;
  country: string;
  status: 'SUBMITTED' | 'REPRESENTATIVE CALL' | 'PROPOSED FARM DETAILS' | 'PROPOSED SUBSCRIPTION DETAILS' | 'WORK IN PROGRESS' | 'SETUP DONE';
  location?: string;
  racks?: number;
  shelves_per_rack?: number;
  channels_per_shelf?: number;
  plugs_per_channel?: number;
}
 
interface FarmSettingProps {
  onFarmSelected?: (selected: boolean) => void;
}
 
export default function FarmSetting({ onFarmSelected }: FarmSettingProps) {
  const user = useSelector((state: RootState) => state.auth.userInfo);
  const isAuthenticated = Boolean(user);
  const userId = user?.user_id;
  const isUserVerified = Boolean(user?.verified);
 
  const [userFarms, setUserFarms] = useState<FarmApi[]>([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<FarmApi | null>(null);

  const fetchFarms = async () => {
    if (!isAuthenticated) return;
    
    setInitialLoading(true);
    try {
      const route = `/api/farm/userFarms`;
      const res = await api.get<FarmApi[]>(route);
      setUserFarms(res.data);
    } catch (err) {
      console.error('Error fetching user farms:', err);
    } finally {
      setInitialLoading(false);
    }
  };
 
  useEffect(() => {
    fetchFarms();
  }, [isAuthenticated, userId]);
 
  const handleOpen = () => {
    if (isUserVerified) {
      setOpenRegisterModal(true);
    }
  };
 
  const handleClose = () => setOpenRegisterModal(false);
 
  const handleFarmClick = (farm: FarmApi) => {
    setSelectedFarm(farm);
    if (onFarmSelected) onFarmSelected(true);
  };
 
  const handleBackToList = () => {
    setSelectedFarm(null);
    if (onFarmSelected) onFarmSelected(false);
  };

  const handleFarmSubmit = async (data: any) => {
    try {
      setOpenRegisterModal(false);
      await fetchFarms();
    } catch (error) {
      console.error('Error after farm registration:', error);
    }
  };
 
  const getProgressData = (farm: FarmApi) => {
    return {
      farm: {
        id: farm.farm_id,
        farm_id: farm.farm_id,
        farm_name: farm.farm_name,
        city: farm.city,
        country: farm.country,
        location: farm.location || '',
        racks: farm.racks || 0,
        shelves_per_rack: farm.shelves_per_rack || 0,
        channels_per_shelf: farm.channels_per_shelf || 0,
        plugs_per_channel: farm.plugs_per_channel || 0,
      },
      showTimeline: true,
      timelineData: {
        status: farm.status,
        type: 'farm_registration',
        details: 'Farm registration in progress'
      }
    };
  };
 
  const renderRegisterButton = (isNewFarm: boolean = false) => {
    const buttonText = isNewFarm ? 'Register New Farm' : 'Register Farm';
    const tooltipText = !isUserVerified ? 'Please verify your account to register a farm' : '';
   
    const button = (
      <Button
        variant="contained"
        disabled={!isUserVerified}
        sx={{
          bgcolor: isUserVerified ? '#FF5E00' : '#ccc',
          width: '100%',
          '&:hover': {
            bgcolor: isUserVerified ? '#e65100' : '#ccc'
          },
          '&:disabled': {
            bgcolor: '#ccc',
            color: '#666'
          }
        }}
        onClick={handleOpen}
      >
        {buttonText}
      </Button>
    );
 
    return !isUserVerified ? (
      <Tooltip title={tooltipText} placement="top">
        <span style={{ width: '100%' }}>
          {button}
        </span>
      </Tooltip>
    ) : button;
  };
 
  return (
    <Box sx={{ width: '100%' }}>
      {selectedFarm ? (
        <Box sx={{pl:9}}>
          <Farmregisterprogress response={getProgressData(selectedFarm)} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBackToList}
              startIcon={<ArrowBack />}
              sx={{
                color: '#FF5E00',
                borderColor: '#FF5E00',
                '&:hover': {
                  borderColor: '#FF5E00',
                  backgroundColor: 'rgba(255, 94, 0, 0.04)'
                }
              }}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Paper
                  elevation={0}
                  sx={{
                    border: '1px solid #d1d5db',
                    overflow: 'hidden',
                    borderRadius: '8px 8px 0 0',
                  }}
                >  <Typography variant="h6" fontWeight={600} sx={{ px: 3, py: 2 }}>
              Farm Settings
            </Typography>
          </Paper>
 
          {/* Body */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '0 0 8px 8px',
              border: '1px solid rgba(0,0,0,0.12)',
              borderTop: 'none',
              bgcolor: 'white',
            }}
          >
            {initialLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, marginTop:"20%" }}>
                <LoadingSpinner />
              </Box>
            ) : userFarms.length > 0 ? (
              <>
                {userFarms.map((farm) => (
                  <Paper
                    key={farm.farm_id}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: 'rgba(0, 18, 25, 0.04)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(0, 18, 25, 0.08)'
                      }
                    }}
                    onClick={() => handleFarmClick(farm)}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {farm.farm_name}
                      </Typography>
                      <Typography variant="body2">
                        {farm.city}, {farm.country}
                      </Typography>
                    </Box>
                    <Typography sx={{ alignSelf: 'center', color: '#5F6D7E' }}>
                      <ArrowForward sx={{
                        verticalAlign: 'middle'
                      }} />
                    </Typography>
                  </Paper>
                ))}
                {renderRegisterButton(true)}
              </>
            ) : (
              renderRegisterButton(false)
            )}
          </Paper>
 
          {/* Modal */}
          <FarmRegisterModal
            open={openRegisterModal}
            onClose={handleClose}
            onBack={() => {}}
            onSubmit={handleFarmSubmit}
          />
        </>
      )}
    </Box>
  );
}