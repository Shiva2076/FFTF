'use client';

import { FC, useState, useEffect } from 'react';
import { Box, Typography, Button, Modal, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import capitalize from 'lodash/capitalize';
import { formatUnderscoreString } from "@/utils/Capitalize";

interface ImmediateCycle {
  cycle_id: number;
  crop_name: string;
  crop_variety: string;
  rack_id: number;
  shelf_id: number;
  status: string;
}

interface QueuedCycle {
  cycle_id: number;
  crop_name: string;
  crop_variety: string;
  rack_id: number;
  shelf_id: number;
  waiting_for_cycle?: number;
  waiting_for_crop?: string;
  status: string;
  scheduled_start?: string;
}

interface GrowCycleStartSuccessResponse {
  message: string;
  data: {
    immediate: ImmediateCycle[];
    queued: QueuedCycle[];
    total: number;
  };
  statusCode: 200;
}

interface GrowCycleStartErrorResponse {
  message: string;
  statusCode: Exclude<number, 200>;
}

type GrowCycleResponse = GrowCycleStartSuccessResponse | GrowCycleStartErrorResponse;

interface GrowCycleStartProps {
  data: GrowCycleResponse;
  onClose?: () => void;
}

const Growcyclestart: FC<GrowCycleStartProps> = ({ data, onClose }) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const isError = data.statusCode !== 200;
  
  console.log('🎨 Frontend - Full data:', data);
  console.log('🎨 Frontend - Status Code:', data.statusCode);
  console.log('🎨 Frontend - Is Error:', isError);
  
  // Extract immediate and queued cycles
  const immediateCycles: ImmediateCycle[] = !isError
    ? (data as GrowCycleStartSuccessResponse).data.immediate || []
    : [];

  const queuedCycles: QueuedCycle[] = !isError
    ? (data as GrowCycleStartSuccessResponse).data.queued || []
    : [];

  const hasQueued = queuedCycles.length > 0;
  const hasImmediate = immediateCycles.length > 0;
  
  console.log('🎨 Frontend - Immediate Cycles:', immediateCycles);
  console.log('🎨 Frontend - Queued Cycles:', queuedCycles);
  console.log('🎨 Frontend - Has Queued:', hasQueued);
  console.log('🎨 Frontend - Has Immediate:', hasImmediate);

  useEffect(() => {
    console.log('🎨 Growcycle data received:', data);
    if (hasQueued) {
      localStorage.setItem('recentlyQueued', 'true');
    }
  }, [data, hasQueued]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const handleDashboardRedirect = () => {
    handleClose();
    if (hasQueued) {
      // Redirect to queue view
      router.push('/farmsxos?tab=queue');
    } else {
      router.push('/farmsxos');
    }
  };

  const getHeaderMessage = () => {
    if (isError) return 'Grow Cycle deployment unsuccessful';
    if (hasQueued && hasImmediate) return 'Crops planted and queued';
    if (hasQueued) return 'Crops added to queue';
    return 'Crop cycle created successfully';
  };

  const getSubMessage = () => {
    if (isError) return data.message || 'Something went wrong during crop cycle deployment.';
    
    if (hasQueued && hasImmediate) {
      return `${immediateCycles.length} crop(s) planted immediately and ${queuedCycles.length} crop(s) queued for available shelves.`;
    }
    
    if (hasQueued) {
      return 'No shelves are currently available. Your crops have been added to the queue and will start automatically when shelves become available.';
    }
    
    return 'Your selected crops have been successfully planted across the assigned farms and racks.';
  };

  const getHeaderColor = () => {
    if (isError) return '#ff4d4f';
    if (hasQueued && !hasImmediate) return '#ff9800'; // Only queued - orange
    if (hasQueued && hasImmediate) return '#1976d2'; // Mixed - blue
    return '#008756'; // Only immediate - green
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 720,
          maxHeight: '90vh',
          bgcolor: '#fff',
          border: '1px solid #d1d9e2',
          borderRadius: '8px',
          p: { xs: 2, md: 4 },
          overflowY: 'auto',
          fontFamily: 'Poppins',
        }}
      >
        {isError && (
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: '#999',
              '&:hover': { color: '#000' },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        <Typography
          variant="h5"
          fontWeight="bold"
          color={getHeaderColor()}
          textAlign="center"
          mb={1}
        >
          {getHeaderMessage()}
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          color="rgba(0, 0, 0, 0.6)"
          mb={4}
        >
          {getSubMessage()}
        </Typography>

        {!isError && (
          <>
            {/* Immediate Cycles Section */}
            {hasImmediate && (
              <Box sx={{ mb: hasQueued ? 3 : 0 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="#008756"
                  mb={1}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <span>✅</span> Planted Immediately ({immediateCycles.length})
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    bgcolor: 'rgba(0, 135, 86, 0.08)',
                    px: 2,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    mb: 1,
                  }}
                >
                  <Box flex={1}>Crop</Box>
                  <Box flex={1}>Variety</Box>
                  <Box flex={1}>Location</Box>
                  <Box width={100} textAlign="center">Action</Box>
                </Box>

                <Box sx={{ maxHeight: 200, overflowY: 'auto', pr: 1, mb: 2 }}>
                  {immediateCycles.map((cycle) => (
                    <Box
                      key={`immediate-${cycle.cycle_id}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        py: 1.5,
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <Box flex={1}>{formatUnderscoreString(cycle.crop_name)}</Box>
                      <Box flex={1}>{formatUnderscoreString(cycle.crop_variety)}</Box>
                      <Box flex={1}>R{cycle.rack_id}S{cycle.shelf_id}</Box>
                      <Box width={100} textAlign="center">
                        <Chip
                          label="Started"
                          size="small"
                          sx={{
                            bgcolor: '#e8f5e9',
                            color: '#2e7d32',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Queued Cycles Section */}
            {hasQueued && (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="#ff9800"
                  mb={1}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <span>⏳</span> Queued for Available Shelves ({queuedCycles.length})
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    bgcolor: 'rgba(255, 152, 0, 0.08)',
                    px: 2,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    mb: 1,
                  }}
                >
                  <Box flex={1}>Crop</Box>
                  <Box flex={1}>Variety</Box>
                  <Box flex={1}>Waiting For</Box>
                  <Box width={100} textAlign="center">Status</Box>
                </Box>

                <Box sx={{ maxHeight: 200, overflowY: 'auto', pr: 1, mb: 2 }}>
                  {queuedCycles.map((cycle, index) => (
                    <Box
                      key={`queued-${cycle.cycle_id}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        py: 1.5,
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <Box flex={1}>{formatUnderscoreString(cycle.crop_name)}</Box>
                      <Box flex={1}>{formatUnderscoreString(cycle.crop_variety)}</Box>
                      <Box flex={1} sx={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.6)' }}>
                        {cycle.waiting_for_crop ? cycle.waiting_for_crop : `R${cycle.rack_id}S${cycle.shelf_id}`}
                      </Box>
                      <Box width={100} textAlign="center">
                        <Chip
                          label={`Queue #${index + 1}`}
                          size="small"
                          sx={{
                            bgcolor: '#fff3e0',
                            color: '#ff9800',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}

        <Button
          fullWidth
          onClick={handleDashboardRedirect}
          variant="contained"
          sx={{
            backgroundColor: hasQueued ? '#ff9800' : '#ff5e00',
            color: '#fff',
            fontWeight: 600,
            letterSpacing: '0.8px',
            borderRadius: '6px',
            py: 1.3,
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            mt: isError ? 2 : 0,
            '&:hover': {
              backgroundColor: hasQueued ? '#f57c00' : '#e65500',
            },
          }}
        >
          {hasQueued ? 'View Queue' : 'Go to Dashboard'}
        </Button>
      </Box>
    </Modal>
  );
};

export default Growcyclestart;