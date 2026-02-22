'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  Paper,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Tooltip
} from '@mui/material';
import Image from 'next/image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { api } from '@/constants';

interface Shelf {
  rack_id: number;
  shelf_id: number;
  crop_type: string | null;
  status: 'AVAILABLE' | 'ACTIVE';
  isAvailable: boolean;
  queueLength?: number;
  currentCycle?: {
    cycle_id: number;
    crop_name: string;
    crop_variety: string;
    current_stage: string;
    days_until_harvest: number;
    expected_harvest_date: string;
  };
}

interface ShelfAvailabilityData {
  shelves: {
    availableShelves: Shelf[];
    occupiedShelves: Shelf[];
    totalAvailable: number;
    totalOccupied: number;
  };
  completion_suggestions: Array<{
    cycle_id: number;
    crop_name: string;
    crop_variety: string;
    current_stage: string;
    days_until_harvest: number;
    expected_harvest_date: string;
    suggestion: string;
  }>;
  queue_recommendations: {
    action: 'PLANT_NOW' | 'QUEUE_BASED_ON_COMPLETION';
    message: string;
    recommendations?: string[];
    soonest_available?: {
      cycle_id: number;
      crop_name: string;
      days_until_available: number;
      expected_available_date: string;
    };
  };
  summary: {
    can_plant_immediately: boolean;
    suggested_action: 'PLANT_NOW' | 'QUEUE_SUGGESTIONS';
  };
}

interface CropSelection {
  crop_index: number;
  crop_name: string;
  crop_variety: string;
  crop_type: string;
  selected_shelf?: {
    rack_id: number;
    shelf_id: number;
  };
}

interface PlantResponse {
  data: {
    immediate?: Array<{
      cycle_id: number;
      crop_name: string;
      crop_variety: string;
      rack_id: number;
      shelf_id: number;
      status: string;
    }>;
    queued?: Array<{
      cycle_id: number;
      crop_name: string;
      crop_variety: string;
      rack_id: number;
      shelf_id: number;
      waiting_for_cycle: number;
      waiting_for_crop: string;
      status: string;
    }>;
    total: number;
  };
  message: string;
  statusCode: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  farmId: number;
  crops: Array<{
    name: string;
    variety: string;
    crop_type: string;
  }>;
  onConfirm: (selections: CropSelection[], plantResponse?: PlantResponse) => void;
}

const RackShelfSelectionModal: React.FC<Props> = ({
  open,
  onClose,
  farmId,
  crops,
  onConfirm
}) => {
  const [loading, setLoading] = useState(true);
  const [planting, setPlanting] = useState(false);
  const [shelfData, setShelfData] = useState<ShelfAvailabilityData | null>(null);
  const [selections, setSelections] = useState<CropSelection[]>([]);
  const [currentCropIndex, setCurrentCropIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'available' | 'occupied' | 'all'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && farmId) {
      fetchShelfAvailability();
      initializeSelections();
    }
  }, [open, farmId]);

  const initializeSelections = () => {
    const initialSelections = crops.map((crop, index) => ({
      crop_index: index,
      crop_name: crop.name,
      crop_variety: crop.variety,
      crop_type: crop.crop_type
    }));
    setSelections(initialSelections);
  };

  const fetchShelfAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `/api/cropcycle/shelf-availability?farmId=${farmId}`
      );
      
      const data = response.data.data;
      const processedData = processShelfData(data);
      
      setShelfData(processedData);
    } catch (error: any) {
      console.error('Error fetching shelf availability:', error);
      setError(error.response?.data?.message || 'Failed to fetch shelf availability');
    } finally {
      setLoading(false);
    }
  };

  const processShelfData = (data: ShelfAvailabilityData): ShelfAvailabilityData => {
    const allShelves = [...data.shelves.availableShelves, ...data.shelves.occupiedShelves];
    
    const availableShelves: Shelf[] = [];
    const occupiedShelves: Shelf[] = [];
    
    allShelves.forEach(shelf => {
      const isDaysZero = shelf.currentCycle?.days_until_harvest === 0;
      const isStatusAvailable = shelf.status === 'AVAILABLE' || shelf.isAvailable;
      
      if (isStatusAvailable || isDaysZero) {
        availableShelves.push({
          ...shelf,
          isAvailable: true,
          status: 'AVAILABLE'
        });
      } else {
        occupiedShelves.push({
          ...shelf,
          isAvailable: false,
          status: 'ACTIVE'
        });
      }
    });
    
    return {
      ...data,
      shelves: {
        availableShelves,
        occupiedShelves,
        totalAvailable: availableShelves.length,
        totalOccupied: occupiedShelves.length
      }
    };
  };

  const handleShelfSelect = (rack_id: number, shelf_id: number) => {
    const updatedSelections = [...selections];
    updatedSelections[currentCropIndex] = {
      ...updatedSelections[currentCropIndex],
      selected_shelf: { rack_id, shelf_id }
    };
    setSelections(updatedSelections);

    if (currentCropIndex < crops.length - 1) {
      setCurrentCropIndex(currentCropIndex + 1);
    }
  };

  const handleConfirm = async () => {
    const allSelected = selections.every(s => s.selected_shelf);
    if (!allSelected) {
      setError('Please select a shelf for all crops');
      return;
    }

    try {
      setPlanting(true);
      setError(null);
      
      // ✅ Transform selections to match backend expected format
      const cropsPayload = selections.map(selection => ({
        crop_name: selection.crop_name,
        crop_variety: selection.crop_variety,
        crop_type: selection.crop_type,
        target_rack_id: selection.selected_shelf!.rack_id,
        target_shelf_id: selection.selected_shelf!.shelf_id
      }));
      
      console.log('🚀 Sending payload:', {
        farm_id: farmId,
        crops: cropsPayload
      });
      
      // ✅ Call API with correct field names
      const response = await api.post('/api/cropcycle', {
        farm_id: farmId,  // Backend expects farm_id, not farmId
        crops: cropsPayload  // Backend expects crops array with target_rack_id/target_shelf_id
      });

      const plantData: PlantResponse = response.data;
      
      console.log('✅ Plant response:', plantData);
      
      // Check for queued crops
      if (plantData.data?.queued && plantData.data.queued.length > 0) {
        console.log('📋 Crops queued:', plantData.data.queued);
        localStorage.setItem('recentlyQueued', 'true');
      }
      
      // Call onConfirm with selections and response
      onConfirm(selections, plantData);
      
    } catch (error: any) {
      console.error('❌ Error planting crops:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error planting crops. Please try again.';
      setError(errorMessage);
    } finally {
      setPlanting(false);
    }
  };

  const currentCrop = crops[currentCropIndex];
  const currentSelection = selections[currentCropIndex];

  const getFilteredShelves = (): Shelf[] => {
    if (!shelfData) return [];
    
    const { availableShelves, occupiedShelves } = shelfData.shelves;
    
    switch (viewMode) {
      case 'available':
        return availableShelves;
      case 'occupied':
        return occupiedShelves;
      default:
        return [...availableShelves, ...occupiedShelves];
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Select Rack & Shelf for Your Crops
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose the optimal location for each crop in your farm
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error && !shelfData ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{error}</Alert>
            <Button onClick={fetchShelfAvailability} sx={{ mt: 2 }}>
              Retry
            </Button>
          </Box>
        ) : (
          <>
            {error && (
              <Box sx={{ px: 3, pt: 2 }}>
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              </Box>
            )}

            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', bgcolor: '#fafafa' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Step {currentCropIndex + 1} of {crops.length}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #FF5E00',
                    flexShrink: 0
                  }}
                >
                  <Image
                    src={`/apps/crop_icons/${currentCrop.name.toLowerCase()}_${currentCrop.variety.toLowerCase()}_${currentCrop.crop_type.toLowerCase().replace(/-/g, '_')}.svg`}
                    alt={currentCrop.name}
                    width={48}
                    height={48}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {currentCrop.name} - {currentCrop.variety}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary" component="span">
                      Type: {currentCrop.crop_type}
                    </Typography>
                    {currentSelection.selected_shelf && (
                      <Chip
                        label={`Rack ${currentSelection.selected_shelf.rack_id}, Shelf ${currentSelection.selected_shelf.shelf_id}`}
                        size="small"
                        color="success"
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                {crops.map((crop, index) => {
                  const hasSelection = selections[index]?.selected_shelf;
                  return (
                    <Box
                      key={index}
                      onClick={() => setCurrentCropIndex(index)}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: `2px solid ${
                          index === currentCropIndex
                            ? '#FF5E00'
                            : hasSelection
                            ? '#4caf50'
                            : 'rgba(0, 0, 0, 0.12)'
                        }`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        bgcolor: index === currentCropIndex ? 'rgba(255, 94, 0, 0.1)' : 'white',
                        position: 'relative',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {index + 1}
                      </Typography>
                      {hasSelection && (
                        <CheckCircleIcon
                          sx={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            fontSize: 16,
                            color: '#4caf50'
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            <Box sx={{ px: 3, py: 1.5, display: 'flex', gap: 1, bgcolor: '#f5f5f5' }}>
              {[
                { label: 'All Shelves', value: 'all' },
                { label: `Available (${shelfData?.shelves.totalAvailable || 0})`, value: 'available' },
                { label: `Occupied (${shelfData?.shelves.totalOccupied || 0})`, value: 'occupied' }
              ].map((tab) => (
                <Button
                  key={tab.value}
                  variant={viewMode === tab.value ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setViewMode(tab.value as any)}
                  sx={{
                    bgcolor: viewMode === tab.value ? '#008756' : 'transparent',
                    borderColor: '#008756',
                    color: viewMode === tab.value ? 'white' : '#008756',
                    '&:hover': {
                      bgcolor: viewMode === tab.value ? '#006644' : 'rgba(0, 135, 86, 0.08)'
                    }
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>

            <Box 
              sx={{ 
                flexGrow: 1, 
                overflow: 'auto', 
                px: 3, 
                py: 2,
                minHeight: 0,
                maxHeight: 'calc(90vh - 400px)'
              }}
            >
              <Grid container spacing={2}>
                {getFilteredShelves().map((shelf) => {
                  const isSelected =
                    currentSelection.selected_shelf?.rack_id === shelf.rack_id &&
                    currentSelection.selected_shelf?.shelf_id === shelf.shelf_id;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={`${shelf.rack_id}-${shelf.shelf_id}`}>
                      <Paper
                        elevation={isSelected ? 8 : 2}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          border: `2px solid ${
                            isSelected
                              ? '#FF5E00'
                              : shelf.isAvailable
                              ? '#4caf50'
                              : 'rgba(0, 0, 0, 0.12)'
                          }`,
                          bgcolor: isSelected
                            ? 'rgba(255, 94, 0, 0.05)'
                            : shelf.isAvailable
                            ? 'rgba(76, 175, 80, 0.05)'
                            : 'white',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: 6,
                            borderColor: '#FF5E00',
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={() => handleShelfSelect(shelf.rack_id, shelf.shelf_id)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography variant="h6" fontWeight={600}>
                            Rack {shelf.rack_id}, Shelf {shelf.shelf_id}
                          </Typography>
                          <Chip
                            label={shelf.isAvailable ? 'Available' : 'Occupied'}
                            size="small"
                            color={shelf.isAvailable ? 'success' : 'warning'}
                          />
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {shelf.isAvailable ? (
                          <Box>
                            <Typography variant="body2" color="success.main" fontWeight={500} gutterBottom>
                              ✅ Ready for immediate planting
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Type: {shelf.crop_type || 'Any'}
                            </Typography>
                            {shelf.currentCycle && shelf.currentCycle.days_until_harvest === 0 ? (
                              <Typography variant="caption" color="info.main" display="block" sx={{ mt: 0.5 }}>
                                🎉 Current crop ready for harvest today!
                              </Typography>
                            ) : (
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                💡 Will start from SEEDING stage
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Box>
                            <Typography variant="body2" fontWeight={500} gutterBottom>
                              Currently: {shelf.currentCycle?.crop_name} - {shelf.currentCycle?.crop_variety}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Stage: {shelf.currentCycle?.current_stage}
                            </Typography>
                            <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 0.5, fontWeight: 600 }}>
                              ⏳ Available in {shelf.currentCycle?.days_until_harvest} day(s)
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Harvest Date: {new Date(shelf.currentCycle?.expected_harvest_date || '').toLocaleDateString()}
                            </Typography>

                            {shelf.queueLength! > 0 && (
                              <Alert severity="info" sx={{ mt: 1, py: 0.5 }}>
                                <Typography variant="caption">
                                  {shelf.queueLength} crop(s) already in queue
                                </Typography>
                              </Alert>
                            )}

                            <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic', color: 'info.main' }}>
                              💡 Your crop will start from TRANSPLANT stage
                            </Typography>
                          </Box>
                        )}

                        {isSelected && (
                          <Box
                            sx={{
                              mt: 1.5,
                              p: 1,
                              bgcolor: 'rgba(255, 94, 0, 0.1)',
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <CheckCircleIcon sx={{ color: '#FF5E00', fontSize: 20 }} />
                            <Typography variant="caption" fontWeight={600} color="#FF5E00">
                              Selected for {currentCrop.name}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            <Box
              sx={{
                p: 2.5,
                borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#fafafa'
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {selections.filter(s => s.selected_shelf).length} of {crops.length} crops assigned
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={onClose}
                  disabled={planting}
                  sx={{
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    '&:hover': {
                      borderColor: 'rgba(0, 0, 0, 0.5)',
                      bgcolor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirm}
                  disabled={!selections.every(s => s.selected_shelf) || planting}
                  sx={{
                    bgcolor: '#FF5E00',
                    '&:hover': { bgcolor: '#cc4500' },
                    '&:disabled': {
                      bgcolor: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)'
                    }
                  }}
                >
                  {planting ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    `Confirm & Plant (${selections.filter(s => s.selected_shelf).length}/${crops.length})`
                  )}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default RackShelfSelectionModal;