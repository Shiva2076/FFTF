'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Divider,
} from '@mui/material';
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { api } from '@/constants';
import { formatTimestamp } from '@/utils/formatTimestamp';

import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const OrangeSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#ff6d00',
    '&:hover': {
      backgroundColor: 'rgba(255,109,0,0.08)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#ffab40',
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#ccc',
  },
}));

interface Device {
  deviceId: string;
  device: string;
  rack_id: number;
  shelf_id: number;
  currentStatus: 0 | 1 | 'NA';
  lastUpdated: string;
}

interface DeviceResponseGroup {
  rackId: number;
  shelfId: number;
  deviceStatus: {
    deviceId: string;
    device: string;
    currentStatus: 0 | 1 | 'NA' | 'off' | 'on' | string;
    lastUpdated: string;
  }[];
}

interface ShelfConfig {
  rack_id: number;
  shelves: number[];
}

interface FanLightSectionProps {
  cycleDeviceControlPanelData?: DeviceResponseGroup[];
  farmId: string | number;
}

const FanLightSection: React.FC<FanLightSectionProps> = ({
  cycleDeviceControlPanelData = [],
  farmId,
}) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const [selectedRack, setSelectedRack] = useState<number | null>(null);
  const [selectedShelf, setSelectedShelf] = useState<number | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [localOverrides, setLocalOverrides] = useState<Record<string, { status: 0 | 1; timestamp: string }>>({});

  const token =
    useSelector((state: RootState) => state.auth.userInfo?.token) ||
    localStorage.getItem('token');

  // Normalize status helper
  const normalizeStatus = (status: any): 0 | 1 | 'NA' => {
    if (status === 'off' || status === 0 || status === '0' || status === false) {
      return 0;
    }
    if (status === 'on' || status === 1 || status === '1' || status === true) {
      return 1;
    }
    return 'NA';
  };

  const allDevices: Device[] = useMemo(
    () => {
      // Add safety check here
      if (!Array.isArray(cycleDeviceControlPanelData) || cycleDeviceControlPanelData.length === 0) {
        console.log('No device data available');
        return [];
      }

      const devices = cycleDeviceControlPanelData.flatMap((group) =>
        (group.deviceStatus || []).map((d) => {
          const normalizedStatus = normalizeStatus(d.currentStatus);
          
          // Apply local override if exists
          const override = localOverrides[d.deviceId];
          
          return {
            deviceId: d.deviceId,
            device: d.device,
            currentStatus: override ? override.status : normalizedStatus,
            lastUpdated: override ? override.timestamp : d.lastUpdated,
            rack_id: group.rackId,
            shelf_id: group.shelfId,
          };
        })
      );
      
      console.log('All devices with overrides:', devices);
      return devices;
    },
    [cycleDeviceControlPanelData, localOverrides]
  );

  const rackAndShelfData: ShelfConfig[] = useMemo(() => {
    // Add safety check here too
    if (!Array.isArray(cycleDeviceControlPanelData) || cycleDeviceControlPanelData.length === 0) {
      return [];
    }

    const map: Record<number, Set<number>> = {};
    cycleDeviceControlPanelData.forEach(({ rackId, shelfId }) => {
      if (!map[rackId]) map[rackId] = new Set();
      map[rackId].add(shelfId);
    });
    return Object.entries(map).map(([rack, shelves]) => ({
      rack_id: Number(rack),
      shelves: Array.from(shelves),
    }));
  }, [cycleDeviceControlPanelData]);

  useEffect(() => {
    if (rackAndShelfData.length > 0) {
      const firstRack = rackAndShelfData[0].rack_id;
      const firstShelf = rackAndShelfData[0].shelves[0];
      setSelectedRack((prev) => prev ?? firstRack);
      setSelectedShelf((prev) => prev ?? firstShelf);
    }
  }, [rackAndShelfData]);

  const availableRacks = rackAndShelfData.map((c) => c.rack_id);
  const availableShelves = useMemo(() => {
    if (selectedRack === null) return [];
    const match = rackAndShelfData.find((c) => c.rack_id === selectedRack);
    return match?.shelves ?? [];
  }, [selectedRack, rackAndShelfData]);

  useEffect(() => {
    if (
      selectedShelf === null ||
      !availableShelves.includes(selectedShelf)
    ) {
      setSelectedShelf(availableShelves[0] ?? null);
    }
  }, [availableShelves]);

  useEffect(() => {
    const filtered = allDevices.filter(
      (d) =>
        d.rack_id === selectedRack &&
        d.shelf_id === selectedShelf
    );
    setDevices(filtered);
    setPage(0);
  }, [allDevices, selectedRack, selectedShelf]);

  const toggleDeviceStatus = async ({
    deviceId,
    newCommand,
  }: {
    deviceId: string;
    newCommand: 0 | 1;
  }): Promise<boolean> => {
    try {
      console.log('Sending API request:', { farmId, deviceId, command: newCommand });
      
      const res = await api.get(
        `/api/actuate?farmId=${farmId}&deviceId=${deviceId}&command=${newCommand}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('API Response:', res);
      console.log('API Response Status:', res.status);
      console.log('API Response Data:', res.data);
      
      return res.status === 200;
    } catch (err) {
      console.error('Device control failed:', err);
      return false;
    }
  };

  const handleToggle = async (deviceId: string, curr: 0 | 1) => {
    console.log('Toggle called for device:', { deviceId, currentStatus: curr });
    
    const cmd: 0 | 1 = curr === 1 ? 0 : 1;
    console.log('Sending command:', cmd);
    
    // Optimistically update UI immediately
    const newTimestamp = new Date().toISOString();
    setLocalOverrides(prev => ({
      ...prev,
      [deviceId]: { status: cmd, timestamp: newTimestamp }
    }));
    
    const ok = await toggleDeviceStatus({ deviceId, newCommand: cmd });
    console.log('Toggle API success:', ok);
    
    if (!ok) {
      // Revert on failure
      console.log('Reverting changes due to API failure');
      setLocalOverrides(prev => {
        const newOverrides = { ...prev };
        delete newOverrides[deviceId];
        return newOverrides;
      });
    }
  };

  const totalPages = Math.ceil(devices.length / itemsPerPage);
  const paged = devices.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  console.log('Current paged devices:', paged);

  // Show empty state if no data
  if (!Array.isArray(cycleDeviceControlPanelData) || cycleDeviceControlPanelData.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 360,
          overflow: 'hidden',
          mb: 2,
          borderRadius: 1,
          border: '1px solid rgba(0,0,0,0.12)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography fontWeight={600} mb={1}>
          Shelf Control Panel
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No device control data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 360,
        overflow: 'hidden',
        mb: 2,
        borderRadius: 1,
        border: '1px solid rgba(0,0,0,0.12)',
      }}
    >
      <Box display="flex" justifyContent="space-between" p={3}>
        <Box>
          <Typography fontWeight={600}>Shelf Control Panel</Typography>
          <Typography variant="body2" color="text.secondary">
            Tracks fan and lighting
          </Typography>
        </Box>
      </Box>

      <Box px={3} pb={2} display="flex" gap={2}>
        <FormControl size="small">
          <Select
            value={selectedRack?.toString() || ''}
            onChange={(e) => setSelectedRack(Number(e.target.value))}
            sx={{ minWidth: 120 }}
          >
            {availableRacks.map((r) => (
              <MenuItem key={r} value={r}>
                Rack: {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small">
          <Select
            value={selectedShelf?.toString() || ''}
            onChange={(e) => setSelectedShelf(Number(e.target.value))}
            sx={{ minWidth: 120 }}
            disabled={!availableShelves.length}
          >
            {availableShelves.map((s) => (
              <MenuItem key={s} value={s}>
                Shelf: {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        {paged.map((d) => {
          console.log('Rendering device:', { deviceId: d.deviceId, status: d.currentStatus });
          
          return (
            <Box
              key={d.deviceId}
              sx={{
                borderBottom: '1px solid #eee',
                width: '100%',
                height: 72,
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={3}
                py={1}
              >
                <Box>
                  <Typography fontWeight={600}>{d.device}</Typography>
                  <Typography fontSize="0.75rem">
                    {formatTimestamp(d.lastUpdated)}
                  </Typography>
                </Box>
                {d.currentStatus !== 'NA' ? (
                  <Box display="flex" alignItems="center">
                    <Typography mr={1}>OFF</Typography>
                    <OrangeSwitch
                      checked={d.currentStatus === 1}
                      onChange={() => {
                        console.log('Switch clicked:', { deviceId: d.deviceId, currentStatus: d.currentStatus });
                        handleToggle(d.deviceId, d.currentStatus as 0 | 1);
                      }}
                    />
                    <Typography ml={1}>ON</Typography>
                  </Box>
                ) : (
                  <Typography
                    sx={{ px: 2, py: 1, bgcolor: '#eee', borderRadius: 1 }}
                  >
                    NA
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}

        {Array.from({ length: itemsPerPage - paged.length }).map((_, i) => (
          <Box
            key={`placeholder-${i}`}
            sx={{ borderBottom: '1px solid #eee', height: 72 }}
          />
        ))}
      </Box>

      {totalPages > 1 && (
        <Box px={3} pb={2} display="flex" justifyContent="center">
          <PaginationArrowButtons
            page={page}
            totalPages={totalPages}
            handlePrev={() => setPage((p) => Math.max(p - 1, 0))}
            handleNext={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          />
        </Box>
      )}
    </Box>
  );
};

export default FanLightSection;