'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Alert,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { api } from '@/constants';

// ✅ Updated interface with proper nullable types
interface QueuedCycle {
  cycle_id: number;
  crop_name: string;
  crop_variety: string;
  crop_type: string;
  status: string;
  waiting_for_shelf: {
    rack_id: number | null;
    shelf_id: number | null;
    current_cycle_id: number | null;
    current_crop: string;
    expected_available_date: string | null;
    days_until_available: number;
    current_status?: string | null;
  } | null;
  queued_at: string;
  will_start_from: string;
  queue_position?: number;
}

interface Props {
  farmId: number;
}

const CropQueueDisplay: React.FC<Props> = ({ farmId }) => {
  const [queuedCycles, setQueuedCycles] = useState<QueuedCycle[]>([]);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (farmId) {
      fetchQueuedCycles();
    }
  }, [farmId]);

  const fetchQueuedCycles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/cropcycle/pending?farmId=${farmId}`);
      setQueuedCycles(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching queued cycles:', error);
      setError(error.response?.data?.error || 'Failed to load queue');
    } finally {
      setLoading(false);
    }
  };

  // Don't show anything if no queued cycles
  if (queuedCycles.length === 0 && !loading && !error) return null;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 3,
        border: '1px solid rgba(255, 152, 0, 0.3)',
        bgcolor: 'rgba(255, 152, 0, 0.05)'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon sx={{ color: '#ff9800' }} />
          <Typography variant="h6" fontWeight={600}>
            Crop Queue
          </Typography>
          {queuedCycles.length > 0 && (
            <Chip
              label={`${queuedCycles.length} Waiting`}
              size="small"
              color="warning"
            />
          )}
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Queue Info */}
      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={32} />
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Info Alert */}
          {!loading && !error && queuedCycles.length > 0 && (
            <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
              These crops are queued and will automatically start from the TRANSPLANT stage when their assigned shelves become available.
            </Alert>
          )}

          {/* Queued Cycles List */}
          {!loading && !error && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {queuedCycles.map((cycle, index) => {
                // ✅ Safe access to waiting_for_shelf
                const waitingShelf = cycle.waiting_for_shelf;
                const hasSpecificShelf = waitingShelf?.rack_id && waitingShelf?.shelf_id;
                
                return (
                  <Paper
                    key={cycle.cycle_id}
                    elevation={1}
                    sx={{
                      p: 2,
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      bgcolor: 'white'
                    }}
                  >
                    {/* Crop Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {cycle.crop_name} - {cycle.crop_variety}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Type: {cycle.crop_type} | Queue Position: #{cycle.queue_position || index + 1}
                        </Typography>
                      </Box>
                      <Chip label="PENDING" size="small" color="warning" />
                    </Box>

                    {/* Queue Details - Only if we have shelf info */}
                    {hasSpecificShelf && waitingShelf && (
                      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Waiting for Shelf:</Typography>
                          <Typography variant="body2" fontWeight={500}>
                            Rack {waitingShelf.rack_id}, Shelf {waitingShelf.shelf_id}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Currently Occupied by:</Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {waitingShelf.current_crop || 'Unknown'}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Days Until Available:</Typography>
                          <Chip
                            label={`${waitingShelf.days_until_available} day${waitingShelf.days_until_available === 1 ? '' : 's'}`}
                            size="small"
                            color={waitingShelf.days_until_available <= 3 ? 'success' : 'default'}
                          />
                        </Box>

                        {waitingShelf.expected_available_date && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Expected Start Date:</Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {new Date(waitingShelf.expected_available_date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Will Start From:</Typography>
                          <Chip label={cycle.will_start_from} size="small" color="info" />
                        </Box>

                        {cycle.queued_at && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Queued Since:</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(cycle.queued_at).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* Generic waiting message if no specific shelf */}
                    {!hasSpecificShelf && waitingShelf && (
                      <Box sx={{ mt: 2 }}>
                        <Alert severity="info">
                          <Typography variant="body2">
                            {waitingShelf.current_crop}
                          </Typography>
                          {waitingShelf.days_until_available > 0 && (
                            <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                              Estimated wait: {waitingShelf.days_until_available} day{waitingShelf.days_until_available === 1 ? '' : 's'}
                            </Typography>
                          )}
                        </Alert>
                      </Box>
                    )}

                    {/* No shelf info available */}
                    {!waitingShelf && (
                      <Box sx={{ mt: 2 }}>
                        <Alert severity="warning">
                          <Typography variant="body2">
                            Waiting for shelf assignment...
                          </Typography>
                        </Alert>
                      </Box>
                    )}

                    {/* Success alert for soon-available shelves */}
                    {waitingShelf && waitingShelf.days_until_available <= 3 && waitingShelf.days_until_available > 0 && (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        <Typography variant="caption">
                          🔥 This shelf will be available very soon! Your crop will auto-start.
                        </Typography>
                      </Alert>
                    )}

                    {/* Available now alert */}
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
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default CropQueueDisplay;