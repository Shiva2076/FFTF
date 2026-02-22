'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  Button,
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';
import BlurWrapper from '@/components/common/BlurWrapper';

interface IrrigationEvent {
  event_id: number;
  cycle_id: number;
  rack_id: number;
  shelf_id: number;
  event_type: 'irrigate' | 'drain';
  start_time: string;
  end_time: string;
  status: 'PENDING' | 'COMPLETED';
  irrigation_meta_id: number;
  created_at: string;
  updated_at: string;
  value: {
    drain_pump: 0 | 1;
    inlet: 0 | 1;
    outlet: 0 | 1;
    main_pump: 0 | 1;
  };
}

interface ScheduleRow {
  event_id: number;
  cycle_id: number;
  rack_id: number;
  shelf_id: number;
  action: 'irrigate' | 'drain';
  motorOnTime: string;
  motorOffTime: string;
  motorIsOn: boolean;
  solenoidOnTime: string;
  solenoidOffTime: string;
  solenoidIsOn: boolean;
  automateDevicesEnabled: boolean;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED';
  lastRunTime: string;
}

interface Props {
  irrigationScheduleData: { irrigationSchedule: IrrigationEvent[] } | IrrigationEvent[] | null;
  selectedCropCycle?: number;
  iot?: boolean;
}

const IrrigationScheduleSection: React.FC<Props> = ({
  irrigationScheduleData,
  selectedCropCycle,
  iot = true,
}) => {
  const [page, setPage] = useState(0);
  const [autoControlEnabled, setAutoControlEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAllSchedules, setShowAllSchedules] = useState(false);
  const [selectedRack, setSelectedRack] = useState<number | 'all'>('all');
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'irrigate' | 'drain'>('all');
  const itemsPerPage = 4;
  const [rows, setRows] = useState<ScheduleRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<ScheduleRow[]>([]);
  const [hasRunningEvents, setHasRunningEvents] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate status based on current time and scheduled times
  const calculateStatus = (startTime: string, endTime: string): 'PENDING' | 'RUNNING' | 'COMPLETED' => {
    const now = currentTime.getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (now < start) {
      return 'PENDING';
    } else if (now >= start && now <= end) {
      return 'RUNNING';
    } else {
      return 'COMPLETED';
    }
  };

  const isWithinSchedule = (startTime: string, endTime: string): boolean => {
    const now = currentTime.getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return now >= start && now <= end;
  };

  useEffect(() => {
    const raw: IrrigationEvent[] = Array.isArray(irrigationScheduleData)
      ? irrigationScheduleData
      : irrigationScheduleData?.irrigationSchedule ?? [];

    if (raw.length === 0) {
      setRows([]);
      setFilteredRows([]);
      setHasRunningEvents(false);
      return;
    }

    // Filter by selectedCropCycle ONLY if showAllSchedules is false
    const filteredEvents = showAllSchedules 
      ? raw 
      : selectedCropCycle 
        ? raw.filter(e => e.cycle_id === selectedCropCycle)
        : raw;

    const formattedRows: ScheduleRow[] = filteredEvents
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .map(e => {
        const value = e.value ?? {
          drain_pump: 0,
          inlet: 0,
          outlet: 0,
          main_pump: 0
        };
        
        const shouldBeOn = isWithinSchedule(e.start_time, e.end_time);
        const calculatedStatus = calculateStatus(e.start_time, e.end_time);
        
        return {
          event_id: e.event_id,
          cycle_id: e.cycle_id,
          rack_id: e.rack_id,
          shelf_id: e.shelf_id,
          action: e.event_type,
          motorOnTime: e.start_time,
          motorOffTime: e.end_time,
          motorIsOn: shouldBeOn,
          solenoidOnTime: e.start_time,
          solenoidOffTime: e.end_time,
          solenoidIsOn: shouldBeOn,
          automateDevicesEnabled: true,
          status: calculatedStatus, // Use calculated status instead of backend status
          lastRunTime: e.end_time
        };
      });

    setRows(formattedRows);
    
    // Check if any events are running
    const anyRunning = formattedRows.some(row => row.status === 'RUNNING');
    setHasRunningEvents(anyRunning);
  }, [irrigationScheduleData, selectedCropCycle, showAllSchedules, currentTime]);

  // Apply filters for rack and schedule type
  useEffect(() => {
    let filtered = [...rows];

    // Filter by rack
    if (selectedRack !== 'all') {
      filtered = filtered.filter(row => row.rack_id === selectedRack);
    }

    // Filter by schedule type
    if (scheduleFilter !== 'all') {
      filtered = filtered.filter(row => row.action === scheduleFilter);
    }

    setFilteredRows(filtered);
    // Only reset page if the filtered results are significantly different
    if (page >= Math.ceil(filtered.length / itemsPerPage)) {
      setPage(0);
    }
  }, [rows, selectedRack, scheduleFilter]);

  const handleDeviceToggle = (eventId: number) => {
    const now = new Date().toISOString();

    const updateRow = (row: ScheduleRow) => {
      if (row.event_id !== eventId) return row;

      const isOn = !row.motorIsOn;
      return {
        ...row,
        motorIsOn: isOn,
        solenoidIsOn: isOn,
        motorOnTime: isOn ? now : row.motorOnTime,
        motorOffTime: !isOn ? now : row.motorOffTime,
        solenoidOnTime: isOn ? now : row.solenoidOnTime,
        solenoidOffTime: !isOn ? now : row.solenoidOffTime,
        lastRunTime: now
      };
    };

    setRows(prev => prev.map(updateRow));
    setFilteredRows(prev => prev.map(updateRow));
  };

  // Get status color and styling
  const getStatusColor = (status: 'PENDING' | 'RUNNING' | 'COMPLETED') => {
    switch (status) {
      case 'PENDING':
        return '#FFA726'; // Orange
      case 'RUNNING':
        return '#2196F3'; // Blue
      case 'COMPLETED':
        return '#4CAF50'; // Green
    }
  };

  // Get unique rack IDs for dropdown
  const uniqueRackIds = Array.from(new Set(rows.map(row => row.rack_id))).sort((a, b) => a - b);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const visibleRows = filteredRows.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handlePrevPage = () => {
    setPage(prev => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  // Get running events info for tooltip
  const getRunningEventsInfo = () => {
    const runningEvents = rows.filter(row => row.status === 'RUNNING');
    if (runningEvents.length === 0) return '';
    
    return `Auto control is locked because ${runningEvents.length} event(s) are currently running:\n${
      runningEvents.map(e => `Rack ${e.rack_id} - ${e.action}`).join('\n')
    }`;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        borderRadius: 1,
        border: '1px solid rgba(0,0,0,0.12)',
        backgroundColor: '#fff',
        fontFamily: 'Poppins',
        fontSize: '0.75rem'
      }}
    >
      {/* Header */}
      <Box p={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" flexDirection="row" gap={2} alignItems="center">
            <Typography fontWeight={600}>Irrigation Schedule (Rack-wise)</Typography>
            <Button
              variant={showAllSchedules ? "contained" : "outlined"}
              size="small"
              onClick={() => {
                setShowAllSchedules(prev => !prev);
                setPage(0);
              }}
              sx={{
                textTransform: 'none',
                borderColor: '#FF6B35',
                color: showAllSchedules ? '#fff' : '#FF6B35',
                backgroundColor: showAllSchedules ? '#FF6B35' : 'transparent',
                '&:hover': {
                  backgroundColor: showAllSchedules ? '#e55a2b' : 'rgba(255, 107, 53, 0.08)',
                  borderColor: '#FF6B35',
                }
              }}
            >
              {showAllSchedules ? 'Show Selected Cycle' : 'View All Schedules'}
            </Button>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip 
              title={hasRunningEvents ? getRunningEventsInfo() : ''} 
              arrow
              placement="top"
            >
              <Box 
                display="flex" 
                alignItems="center" 
                gap={1}
                sx={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  backgroundColor: hasRunningEvents ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
                  border: hasRunningEvents ? '1px solid rgba(33, 150, 243, 0.3)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                <Switch
                  checked={autoControlEnabled}
                  onChange={() => setAutoControlEnabled(prev => !prev)}
                  disabled={hasRunningEvents}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#ff6b35' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#ff6b35',
                    },
                    opacity: hasRunningEvents ? 0.6 : 1,
                  }}
                />
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography 
                    variant="body2" 
                    color={hasRunningEvents ? '#2196F3' : 'text.secondary'}
                    fontWeight={hasRunningEvents ? 600 : 400}
                  >
                    Auto Control
                  </Typography>
                  {hasRunningEvents && (
                    <LockIcon 
                      sx={{ 
                        fontSize: '1rem', 
                        color: '#2196F3',
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.5 },
                        }
                      }} 
                    />
                  )}
                </Box>
              </Box>
            </Tooltip>
            
            {hasRunningEvents && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  padding: '4px 12px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(33, 150, 243, 0.12)',
                  border: '1px solid rgba(33, 150, 243, 0.3)',
                }}
              >
                <Box
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#2196F3',
                    animation: 'blink 1.5s ease-in-out infinite',
                    '@keyframes blink': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.3 },
                    }
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#2196F3',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                >
                  {rows.filter(r => r.status === 'RUNNING').length} Event(s) Running
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Filters and Pagination */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Schedule Type Filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={scheduleFilter}
              onChange={(e: SelectChangeEvent) => {
                setScheduleFilter(e.target.value as 'all' | 'irrigate' | 'drain');
                setPage(0);
              }}
              sx={{
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0,0,0,0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF6B35',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF6B35',
                }
              }}
            >
              <MenuItem value="all">All Schedules</MenuItem>
              <MenuItem value="irrigate">Irrigate Only</MenuItem>
              <MenuItem value="drain">Drain Only</MenuItem>
            </Select>
          </FormControl>

          {/* Rack Filter */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={selectedRack}
              onChange={(e: SelectChangeEvent<number | 'all'>) => {
                setSelectedRack(e.target.value as number | 'all');
                setPage(0);
              }}
              sx={{
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0,0,0,0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF6B35',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF6B35',
                }
              }}
            >
              <MenuItem value="all">All Racks</MenuItem>
              {uniqueRackIds.map(rackId => (
                <MenuItem key={rackId} value={rackId}>Rack {rackId}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Pagination */}
          <PaginationArrowButtons 
            page={page}
            totalPages={totalPages}
            handlePrev={handlePrevPage}
            handleNext={handleNextPage}
          />
        </Box>
      </Box>

      {/* Table Header */}
      <Box display="flex" py={2} pl={3.5} bgcolor="rgba(0, 18, 25, 0.08)" fontWeight={600} alignItems="center">
        <Box flex={0.8}>Rack</Box>
        <Box flex={1}>Action</Box>
        <Box flex={1.5} pl={4}>Motor & Solenoid</Box>
        <Box flex={2}>Scheduled Time</Box>
        <Box flex={1.5} display="flex" justifyContent="center">Status</Box>
      </Box>

      {/* Table Body */}
      <BlurWrapper isBlurred={!iot} messageType="iot">
      {visibleRows.length > 0 ? (
        visibleRows.map((row) => (
          <Box
            key={row.event_id}
            display="flex"
            px={3.5}
            py={2}
            borderTop="1px solid rgba(0,0,0,0.12)"
            alignItems="center"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.02)',
              },
              backgroundColor: row.status === 'RUNNING' ? 'rgba(33, 150, 243, 0.04)' : 'transparent',
            }}
          >
            <Box flex={0.8} fontWeight={600} color="#FF6B35">
              Rack {row.rack_id}
            </Box>

            <Box flex={1}>
              <Typography
                sx={{
                  fontWeight: 500,
                  color: row.action === 'irrigate' ? '#2196F3' : '#FF9800'
                }}
              >
                {row.action === 'irrigate' ? 'Irrigate' : 'Drain'}
              </Typography>
            </Box>

            <Box flex={1.5} display="flex" alignItems="center">
              <Typography variant="caption" color={row.motorIsOn ? '#FF6B35' : '#999'}>
                OFF
              </Typography>
              <Switch
                checked={row.motorIsOn}
                onChange={() => handleDeviceToggle(row.event_id)}
                disabled={autoControlEnabled || row.status === 'RUNNING'}
                aria-label={`Toggle devices for rack ${row.rack_id}`}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#ff6b35' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#ff6b35' },
                  opacity: (autoControlEnabled || row.status === 'RUNNING') ? 0.5 : 1
                }}
              />
              <Typography variant="caption" color={row.motorIsOn ? '#FF6B35' : '#999'}>
                ON
              </Typography>
            </Box>

            <Box flex={2} display="flex" flexDirection="column" gap={0.5}>
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                <strong>Start:</strong> {new Date(row.motorOnTime).toLocaleString('en-IN', { 
                  dateStyle: 'short',
                  timeStyle: 'short',
                  timeZone: 'Asia/Kolkata' 
                })}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                <strong>End:</strong> {new Date(row.motorOffTime).toLocaleString('en-IN', { 
                  dateStyle: 'short',
                  timeStyle: 'short',
                  timeZone: 'Asia/Kolkata' 
                })}
              </Typography>
            </Box>

            {/* Status with dynamic color */}
            <Box flex={1.5} display="flex" flexDirection="column" alignItems="center" gap={0.5}>
              <Box display="flex" alignItems="center" gap={0.5}>
                {row.status === 'RUNNING' && (
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#2196F3',
                      animation: 'blink 1.5s ease-in-out infinite',
                    }}
                  />
                )}
                <Typography
                  fontWeight={600}
                  sx={{
                    color: getStatusColor(row.status),
                    fontSize: '0.875rem'
                  }}
                >
                  {row.status}
                </Typography>
              </Box>
              {row.status === 'COMPLETED' && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  {new Date(row.lastRunTime).toLocaleString('en-IN', { 
                    dateStyle: 'short',
                    timeStyle: 'short',
                    timeZone: 'Asia/Kolkata' 
                  })}
                </Typography>
              )}
            </Box>
          </Box>
        ))
      ) : (
        <Box
          px={3}
          py={4}
          borderTop="1px solid rgba(0,0,0,0.12)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          minHeight="8rem"
        >
          <Typography variant="body2" color="text.secondary">
            {showAllSchedules 
              ? 'No irrigation schedules available.'
              : 'No irrigation data available for this crop cycle.'
            }
          </Typography>
        </Box>
      )}
      </BlurWrapper>
    </Paper>
  );
};

export default IrrigationScheduleSection;