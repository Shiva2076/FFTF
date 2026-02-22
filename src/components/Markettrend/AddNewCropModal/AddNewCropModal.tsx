'use client';

import { FC, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { api } from '@/constants';

interface AddNewCropModalProps {
  open: boolean;
  onClose: () => void;
  region: string;
}

const AddNewCropModal: FC<AddNewCropModalProps> = ({ open, onClose, region }) => {
  const [cropName, setCropName] = useState<string>('');
  const [cropType, setCropType] = useState<string>('');
  const [cropVariety, setCropVariety] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Helper function
  const normalizeString = (str: string) => (str || '').toLowerCase().trim();

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setCropName('');
      setCropType('');
      setCropVariety('');
      setErrorMessage('');
    }
  }, [open]);

  const handleSubmit = async () => {
    setErrorMessage('');

    // Validate required fields
    if (!cropName.trim() || !cropType.trim() || !cropVariety.trim()) {
      alert(`Please ${!cropName.trim() ? 'enter a crop name' : !cropType.trim() ? 'enter a crop type' : 'enter a crop variety'}`);
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await api.post('/api/marketstatistics/addcrop', {
        crop_name: normalizeString(cropName),
        crop_type: normalizeString(cropType),
        crop_variety: normalizeString(cropVariety),
        region: region || null,
      });

      if (response.data.success) {
        setToastOpen(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error: any) {
      console.error('Failed to submit crop request:', error);
      setErrorMessage(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Failed to submit crop request. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => onClose();

  return (
    <>
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-new-crop-modal"
      aria-describedby="add-new-crop-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '500px' },
          maxWidth: '500px',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          outline: 'none',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" color="#008756">
             Add New Crop to Track
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Crop Name */}
          <TextField
            label="Crop Name"
            required
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            placeholder="Enter crop name"
            fullWidth
          />

          {/* Crop Type */}
          <TextField
            label="Crop Type"
            required
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            placeholder="Enter crop type"
            fullWidth
          />

          {/* Crop Variety */}
          <TextField
            label="Crop Variety"
            required
            value={cropVariety}
            onChange={(e) => setCropVariety(e.target.value)}
            placeholder="Enter crop variety"
            fullWidth
          />

          {/* Error Message */}
            {errorMessage && (
              <Alert severity="error">
                {errorMessage}
              </Alert>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={submitting}
                sx={{ textTransform: 'uppercase', fontWeight: 500 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting || !cropName.trim() || !cropType.trim() || !cropVariety.trim()}
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  backgroundColor: '#ff5e00',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#e65500',
                  },
                }}
              >
                {submitting ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
              </Button>
            </Box>
          </Box>
      </Box>
    </Modal>

    {/* Success Toast - Outside Modal */}
    <Snackbar
      open={toastOpen}
      autoHideDuration={4000}
      onClose={() => setToastOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={() => setToastOpen(false)}
        severity="success"
        sx={{ width: '100%' }}
        variant="filled"
      >
        Crop submission received! We'll review and add it to the system.
      </Alert>
    </Snackbar>
    </>
  );
};

export default AddNewCropModal;

