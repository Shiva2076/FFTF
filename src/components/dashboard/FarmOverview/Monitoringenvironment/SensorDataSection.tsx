'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { api } from '@/constants';
import BlurWrapper from '@/components/common/BlurWrapper';

interface Device {
  deviceId: string;
  device: string;
  currentStatus: 0 | 1 | "on" | "off" | "NA";  // ✅ Updated to handle both string and number
  lastUpdated: string;
}

interface SensorDataSectionProps {
  sensorData: Device[];
  farmId: string | number;
  iot?: boolean;
}

const SensorDataSection: React.FC<SensorDataSectionProps> = ({ sensorData, farmId, iot = true }) => {

  const [page, setPage] = useState(0);
  const [devices, setDevices] = useState<Device[]>([]);
  const [automateDevicesEnabled, setAutomateDevicesEnabled] = useState(false);
  const itemsPerPage = 4;

  const handleDeviceToggle = async (deviceIndex: number, checked: boolean) => {
    const globalIndex = page * itemsPerPage + deviceIndex;
    const device = devices[globalIndex];

    if (!device || device.currentStatus === "NA") return;
    const newCommand = checked ? 1 : 0;
    
    try {
      const response = await api.get(
       `/api/actuate?farmId=${farmId}&deviceId=${device.deviceId}&command=${newCommand}`
      );

      if (response.status === 200) {
        const updatedDevices = devices.map((d, index) =>
          index === globalIndex
            ? {
                ...d,
                currentStatus: (newCommand === 1 ? "on" : "off") as "on" | "off",  // ✅ Keep consistent with backend
                lastUpdated: new Date().toISOString(),
              }
            : d
        );

        setDevices(updatedDevices);
        localStorage.setItem(`devices_${farmId}`, JSON.stringify(updatedDevices));
      } else {
        console.error("Failed to update device status");
      }
    } catch (error) {
      console.error("Error calling actuate API:", error);
    }
  };

  useEffect(() => {
    const savedAutomateStatus = localStorage.getItem(`automate_devices_${farmId}`);
    if (savedAutomateStatus) {
      setAutomateDevicesEnabled(JSON.parse(savedAutomateStatus));
    }
  
    if (sensorData && sensorData.length > 0) {
      setDevices(sensorData); // backend is source of truth
      localStorage.setItem(`devices_${farmId}`, JSON.stringify(sensorData));
    } else {
      const fallback = localStorage.getItem(`devices_${farmId}`);
      if (fallback) {
        setDevices(JSON.parse(fallback));
      }
    }
  }, [sensorData, farmId]);

  useEffect(() => {
    if (devices.length > 0) {
      localStorage.setItem(`devices_${farmId}`, JSON.stringify(devices));
    }
  }, [devices, farmId]);

  const getCurrentPageData = () => {
    const start = page * itemsPerPage;
    return devices.slice(start, start + itemsPerPage);
  };

  const getTotalPages = () => {
    return Math.ceil(devices.length / itemsPerPage);
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, getTotalPages() - 1));

  // Handle automate devices toggle
  const handleAutomateToggle = (checked: boolean) => {
    setAutomateDevicesEnabled(checked);
    localStorage.setItem(`automate_devices_${farmId}`, JSON.stringify(checked));
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    if (timestamp === "NA") {
      return "Status: NA";
    }
    
    try {
      const date = new Date(timestamp);
      return `Last Ran ${date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })} ${date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })}`;
    } catch {
      return 'Last Ran 24-02-2025 16:23';
    }
  };

  const paginatedDevices = getCurrentPageData();
  const isEmpty = paginatedDevices.length === 0;

  return (
    <Box sx={{ width: '100%', fontFamily: 'Poppins' }}>
      {/* Header */}
      <Paper
        variant="outlined"
        sx={{
          padding: '1rem',
          borderRadius: '8px 8px 0 0',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',height:"100%",gap:"0.25rem",pt:"1rem" }}>
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#001219' }}>
              Sensor Data
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: 'rgba(0, 18, 25, 0.6)',
                letterSpacing: '0.3px',
                lineHeight: '166%',
              }}
            >
              Shows real-time sensor readings.
            </Typography>
          </Box>
        </Box>
      </Paper>
      
     

      {/* Body */}
      <BlurWrapper isBlurred={!iot} messageType="iot">
         {/* Subheader with Automate Devices and Toggle */}
      <Box display="flex" px={3} py={2} bgcolor="rgba(0, 18, 25, 0.08)" fontWeight={500}>
        <Box flex={1}>Automate Devices</Box>
        <Box flex={1} textAlign="right">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#777' }}>
              OFF
            </Typography>
            <Switch
              checked={automateDevicesEnabled}
              onChange={(e) => handleAutomateToggle(e.target.checked)}
              disabled={!iot}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#ff6b35',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#ff6b35',
                },
              }}
            />
            <Typography sx={{ fontSize: '0.875rem', color: '#777' }}>
              ON
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          backgroundColor: '#fff',
          minHeight: `${itemsPerPage * 4}rem`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        {isEmpty ? (
          <Box
            sx={{
              height: `${itemsPerPage * 4}rem`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#001219', opacity: 0.8, fontWeight: 500 }}>
              No Data Found
            </Typography>
          </Box>
        ) : (
          <>
            {paginatedDevices.map((device, index) => (
              <Box
                key={device.deviceId}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom: index < paginatedDevices.length - 1 ? '1px solid #eee' : 'none',
                  height: '4rem',
                }}
              >
                <Box>
                  {/* Device name */}
                  <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#001219' }}>
                    {device.device}
                  </Typography>
                  {/* Timestamp */}
                  <Typography sx={{ fontSize: '0.75rem', color: '#777', mt: 0.5 }}>
                    {formatTimestamp(device.lastUpdated)}
                  </Typography>
                </Box>

                {/* Toggle Switch Section or NA Display */}
                {device.currentStatus === "NA" ? (
                  <Box>
                    <Typography sx={{ 
                      fontSize: '0.875rem', 
                      color: '#777',
                      fontWeight: 500,
                      padding: '8px 16px',
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      borderRadius: '4px'
                    }}>
                      NA
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ 
                      fontSize: '0.875rem', 
                      color: automateDevicesEnabled ? 'rgba(119, 119, 119, 0.5)' : '#777' 
                    }}>
                      OFF
                    </Typography>
                    <Switch
                      checked={device.currentStatus === 1 || device.currentStatus === "on"}  // ✅ Handle both number and string
                      onChange={(e) => handleDeviceToggle(index, e.target.checked)}
                      disabled={automateDevicesEnabled}  // ✅ Disabled when automation is ON
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#ff6b35',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#ff6b35',
                        },
                        '& .Mui-disabled': {
                          opacity: 0.5,  // ✅ Faded when disabled
                        },
                      }}
                    />
                    <Typography sx={{ 
                      fontSize: '0.875rem', 
                      color: automateDevicesEnabled ? 'rgba(119, 119, 119, 0.5)' : '#777' 
                    }}>
                      ON
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}

            {/* Fill remaining rows to keep consistent spacing */}
            {Array.from({ length: itemsPerPage - paginatedDevices.length }).map((_, idx) => (
              <Box
                key={`empty-${idx}`}
                sx={{
                  height: '4rem',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  visibility: 'hidden',
                }}
              />
            ))}
          </>
        )}
      </Box>
      </BlurWrapper>
    </Box>
  );
};

export default SensorDataSection;