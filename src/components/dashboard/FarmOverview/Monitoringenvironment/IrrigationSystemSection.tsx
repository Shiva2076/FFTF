"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PaginationArrowButtons from "@/utils/PaginationArrowButtons";
import { formatEventTime } from "@/utils/functions";
import BlurWrapper from '@/components/common/BlurWrapper';

interface DeviceStatus {
  outlet: number;
  event_id: number | null;
  inlet: number;
  main_pump: number;
  drain_pump: number;
}

interface IrrigationDevice {
  packet_type: string;
  farm_id: number;
  device_id: string;
  device_type: string;
  EventProcessedUtcTime: string;
  shelf_id: number; 
  value?: DeviceStatus; 
}

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
}

interface RackDevice {
  rack_id: number;
  irrigationValve: boolean;
  drainValve: boolean;
  drainPump: boolean;
  irrigationPump: boolean;
  lastUpdated: string;
  currentAction: 'irrigate' | 'drain' | 'idle';
}

interface IrrigationSystemSectionProps {
  irrigationSystemInfo?: IrrigationDevice[];
  irrigationScheduleData?: { irrigationSchedule: IrrigationEvent[] } | IrrigationEvent[] | null;
  iot?: boolean;
}

const ITEMS_PER_PAGE = 7;

const IrrigationSystemSection: React.FC<IrrigationSystemSectionProps> = ({
  irrigationSystemInfo,
  irrigationScheduleData,
  iot = true,
}) => {
  const devices = Array.isArray(irrigationSystemInfo)
    ? [...irrigationSystemInfo].sort((a, b) => (a.shelf_id ?? 0) - (b.shelf_id ?? 0))
    : [];

  const formatEventTimeLocal = (utc: string) =>
    new Date(utc).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const [page, setPage] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper function to check if event is currently running
  const isEventRunning = (event: IrrigationEvent): boolean => {
    const now = currentTime.getTime();
    const start = new Date(event.start_time).getTime();
    const end = new Date(event.end_time).getTime();
    return now >= start && now <= end;
  };

  // Get running events grouped by rack
  const getRunningEventsByRack = (): Map<number, 'irrigate' | 'drain'> => {
    const runningEvents = new Map<number, 'irrigate' | 'drain'>();
    
    const events: IrrigationEvent[] = Array.isArray(irrigationScheduleData)
      ? irrigationScheduleData
      : irrigationScheduleData?.irrigationSchedule ?? [];

    events.forEach(event => {
      if (isEventRunning(event)) {
        runningEvents.set(event.rack_id, event.event_type);
      }
    });

    return runningEvents;
  };

  // Transform to rack-based structure - using rack_id from schedule
  const getRackDevices = (): RackDevice[] => {
    const runningEvents = getRunningEventsByRack();
    
    // Get unique rack IDs from schedule data
    const events: IrrigationEvent[] = Array.isArray(irrigationScheduleData)
      ? irrigationScheduleData
      : irrigationScheduleData?.irrigationSchedule ?? [];
    
    const uniqueRackIds = Array.from(new Set(events.map(e => e.rack_id))).sort((a, b) => a - b);
    
    // If no schedule data, return empty array
    if (uniqueRackIds.length === 0) {
      return [];
    }

    // Create rack devices based on unique rack IDs from schedule
    const rackDevices: RackDevice[] = uniqueRackIds.map(rackId => {
      // Get shelves that belong to this rack from the schedule
      const rackShelves = events
        .filter(e => e.rack_id === rackId)
        .map(e => e.shelf_id);
      
      const uniqueShelves = Array.from(new Set(rackShelves));

      // Find the latest device update from any shelf in this rack
      const rackDevices = devices.filter(d => uniqueShelves.includes(d.shelf_id));
      const latestDevice = rackDevices.length > 0
        ? rackDevices.sort((a, b) => 
            new Date(b.EventProcessedUtcTime).getTime() - new Date(a.EventProcessedUtcTime).getTime()
          )[0]
        : null;

      const currentAction = runningEvents.get(rackId) || 'idle';
      
      return {
        rack_id: rackId,
        irrigationValve: currentAction === 'irrigate',
        drainValve: currentAction === 'drain',
        drainPump: currentAction === 'drain',
        irrigationPump: currentAction === 'irrigate',
        lastUpdated: latestDevice?.EventProcessedUtcTime || new Date().toISOString(),
        currentAction: currentAction,
      };
    });

    return rackDevices;
  };

  const rackDevices = getRackDevices();
  const totalPages = Math.ceil(rackDevices.length / ITEMS_PER_PAGE);

  const paginatedDevices = rackDevices.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setPage((prev) => Math.min(prev + 1, totalPages - 1));

  const createStatusTooltip = (rack: RackDevice): React.ReactNode => {
    const statusItems = [
      { label: 'Irrigation Valve', active: rack.irrigationValve, key: 'irrigation_valve' },
      { label: 'Drain Valve', active: rack.drainValve, key: 'drain_valve' },
      { label: 'Drain Pump', active: rack.drainPump, key: 'drain_pump' },
      { label: 'Irrigation Pump', active: rack.irrigationPump, key: 'irrigation_pump' }
    ];

    return (
      <Box
        sx={{
          p: 2,
          backgroundColor: '#ffffff',
          borderRadius: 1,
          minWidth: 220,
          maxWidth: 280
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            color: '#333',
            borderBottom: '1px solid #f0f0f0',
            pb: 1
          }}
        >
          Rack {rack.rack_id} - Device Status
        </Typography>

        {statusItems.map((item, index) => (
          <Box
            key={item.key}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: index < statusItems.length - 1 ? 1 : 0,
              p: 1,
              borderRadius: 1,
              transition: 'all 0.2s ease'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: 'black',
                fontSize: '0.875rem'
              }}
            >
              {item.label}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {item.active ? (
                <CheckCircleIcon
                  sx={{
                    fontSize: 16,
                    color: '#10b981'
                  }}
                />
              ) : (
                <CancelIcon
                  sx={{
                    fontSize: 16,
                    color: '#ef4444'
                  }}
                />
              )}
            </Box>
          </Box>
        ))}

        {rack.currentAction !== 'idle' && (
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: '1px solid #f0f0f0'
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: rack.currentAction === 'irrigate' ? '#2196F3' : '#FF9800',
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            >
              Currently {rack.currentAction === 'irrigate' ? 'Irrigating' : 'Draining'}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const isRackActive = (rack: RackDevice): boolean => {
    return rack.currentAction !== 'idle';
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        fontFamily: "Poppins",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: "8px 8px 0 0",
          backgroundColor: "#fff",
          border: "1px solid #E0E0E0",
          px: 2,
          py: 3.1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography fontSize="1rem" fontWeight={600}>
            Irrigation System Info (Rack-wise)
          </Typography>
          <Typography fontSize="0.75rem" color="rgba(0, 18, 25, 0.6)">
            Shows real-time irrigation status for each rack.
          </Typography>
        </Box>
        {totalPages > 1 && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              mt: "auto",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <PaginationArrowButtons
              page={page}
              totalPages={totalPages}
              handlePrev={handlePrev}
              handleNext={handleNext}
            />
          </Box>
        )}
      </Paper>

      {/* Body */}
      <BlurWrapper isBlurred={!iot} messageType="iot">
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          border: "1px solid #E0E0E0",
          display: "flex",
          flexDirection: "column",
          justifyContent: rackDevices.length === 0 ? "center" : "flex-start",
          alignItems: rackDevices.length === 0 ? "center" : "stretch",
          overflow: "hidden",
        }}
      >
        {rackDevices.length === 0 ? (
          <Typography color="text.secondary" fontSize="0.875rem">
            Devices will be activated post transplantation
          </Typography>
        ) : (
          <Box sx={{ width: "100%" }}>
            {paginatedDevices.map((rack, idx) => {
              const rackActive = isRackActive(rack);

              return (
                <Box
                  key={rack.rack_id}
                  sx={{
                    borderTop: idx !== 0 ? "1px solid #E0E0E0" : "none",
                    px: 2,
                    py: 1.25,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: rackActive ? 'rgba(33, 150, 243, 0.04)' : 'transparent',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Typography fontSize="0.875rem" fontWeight={500}>
                        Irrigation Rack {rack.rack_id}
                      </Typography>
                      <Tooltip
                        title={createStatusTooltip(rack)}
                        arrow
                        placement="top"
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: "transparent",
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              padding: 0,
                            },
                          },
                        }}
                      >
                        <InfoOutlinedIcon
                          sx={{ fontSize: 14, color: "#FF5E00", cursor: "pointer" }}
                        />
                      </Tooltip>
                      {rackActive && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: rack.currentAction === 'irrigate' 
                              ? 'rgba(33, 150, 243, 0.12)' 
                              : 'rgba(255, 152, 0, 0.12)',
                            border: rack.currentAction === 'irrigate'
                              ? '1px solid rgba(33, 150, 243, 0.3)'
                              : '1px solid rgba(255, 152, 0, 0.3)',
                          }}
                        >
                          <Box
                            sx={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: rack.currentAction === 'irrigate' ? '#2196F3' : '#FF9800',
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
                              color: rack.currentAction === 'irrigate' ? '#2196F3' : '#FF9800',
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          >
                            {rack.currentAction === 'irrigate' ? 'Irrigating' : 'Draining'}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Typography
                      fontSize="0.75rem"
                      color="rgba(0, 18, 25, 0.6)"
                    >
                      Last Updated{" "}
                      {formatEventTimeLocal(rack.lastUpdated)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {rackActive ? (
                      <CheckCircleIcon
                        sx={{
                          fontSize: 20,
                          color: "#008756",
                        }}
                      />
                    ) : (
                      <CancelIcon
                        sx={{
                          fontSize: 20,
                          color: "#999999",
                        }}
                      />
                    )}
                    <Typography
                      fontSize="0.875rem"
                      fontWeight={500}
                      pr={4}
                      sx={{ color: rackActive ? "#008756" : "#999999" }}
                    >
                      {rackActive ? "Active" : "Inactive"}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>
      </BlurWrapper>
    </Box>
  );
};

export default IrrigationSystemSection;