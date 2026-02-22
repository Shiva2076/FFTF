'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider, CircularProgress, Chip, Alert } from '@mui/material';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

interface ChannelImage {
  url: string;
  date: string;
  channel: number;
}

interface ShelfData {
  rackId?: number;
  shelfId?: number;
  firstChannel?: ChannelImage[];
  middleChannel?: ChannelImage[];
  lastChannel?: ChannelImage[];
  channelInfo?: {
    firstChannelNum: number;
    middleChannelNum: number;
    lastChannelNum: number;
    totalChannels: number;
    availableChannels: number[];
  } | null;
  totalImages?: number;
  usingFallback?: boolean;
  fallbackMessage?: string;
  error?: string;
}

interface ScannedCropImagesProps {
  scannedcropimages?: Record<string, ShelfData>;
  loading?: boolean;
}

const ScannedCropImages: React.FC<ScannedCropImagesProps> = ({ 
  scannedcropimages,
  loading = false
}) => {
  const [imageStates, setImageStates] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [currentSlides, setCurrentSlides] = useState<Array<{src: string; alt?: string}>>([]);

  // Safe data extraction with null checks
  const shelfKeys = scannedcropimages ? Object.keys(scannedcropimages).filter(key => key && scannedcropimages[key]) : [];
  const firstShelfKey = shelfKeys[0];
  const shelfData = firstShelfKey ? scannedcropimages?.[firstShelfKey] : null;

  // Validate shelf data structure
  const hasValidShelfData = shelfData && 
    shelfData.channelInfo && 
    (
      (shelfData.firstChannel && shelfData.firstChannel.length > 0) ||
      (shelfData.middleChannel && shelfData.middleChannel.length > 0) ||
      (shelfData.lastChannel && shelfData.lastChannel.length > 0)
    );

  const handleImageLoad = (imageKey: string) => {
    setImageStates(prev => ({ ...prev, [imageKey]: 'loaded' }));
  };

  const handleImageError = (imageKey: string) => {
    setImageStates(prev => ({ ...prev, [imageKey]: 'error' }));
  };

  const openLightbox = (images: ChannelImage[], startIndex: number) => {
    try {
      if (!images || images.length === 0) return;
      
      const slides = images.map((image, idx) => ({
        src: image?.url || '',
        alt: `Channel ${image?.channel || 'N/A'} - ${image?.date || 'N/A'} - Image ${idx + 1}`
      })).filter(slide => slide.src); // Filter out invalid URLs

      if (slides.length === 0) return;

      setCurrentSlides(slides);
      setPhotoIndex(startIndex);
      setLightboxOpen(true);
    } catch (error) {
      console.error('Error opening lightbox:', error);
    }
  };

  const renderImageGrid = (images: ChannelImage[] | undefined, channelLabel: string, channelNum: number | undefined) => {
    // Validate inputs
    if (!images || !Array.isArray(images) || images.length === 0 || !channelNum) {
      return (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {channelLabel}
            </Typography>
            <Chip 
              label={`Channel ${channelNum || 'N/A'}`} 
              size="small" 
              sx={{ 
                height: '20px',
                fontSize: '0.75rem',
                backgroundColor: '#e3f2fd',
                color: '#1976d2'
              }} 
            />
            <Chip 
              label="No images" 
              size="small" 
              sx={{ 
                height: '20px',
                fontSize: '0.75rem',
                backgroundColor: '#ffebee',
                color: '#c62828'
              }} 
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No images available for {channelLabel}
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
          }}
        >
          {images.map((image, idx) => {
            // Validate image object
            if (!image || typeof image !== 'object') return null;

            const imageKey = `${channelLabel}-${image.channel || idx}-${idx}`;
            const state = imageStates[imageKey] || 'loading';

            return (
              <Box
                key={imageKey}
                onClick={() => openLightbox(images, idx)}
                sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  backgroundColor: '#f8f8f8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                }}
              >
                {/* Always show loading spinner until image loads */}
                {state === 'loading' && (
                  <CircularProgress 
                    size={30} 
                    sx={{ 
                      position: 'absolute',
                      zIndex: 1
                    }} 
                  />
                )}
                
                {state === 'error' ? (
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="caption" color="error" sx={{ display: 'block', mb: 0.5 }}>
                      Failed to load
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      Channel {image.channel || 'N/A'}
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {image.url && (
                      <Box
                        component="img"
                        src={image.url}
                        alt={`Channel ${image.channel || 'N/A'} - ${image.date || 'N/A'} - Image ${idx + 1}`}
                        loading="eager"
                        crossOrigin="anonymous"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: state === 'loaded' ? 1 : 0,
                          transition: 'opacity 0.3s ease-in-out',
                        }}
                        onLoad={() => handleImageLoad(imageKey)}
                        onError={() => handleImageError(imageKey)}
                      />
                    )}
                    {state === 'loaded' && image.url && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '6px 8px',
                          fontSize: '0.7rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span>{image.date || 'N/A'}</span>
                        <span>{`Channel ${image.channel || 'N/A'}`}</span>
                        <span>#{idx + 1}</span>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <Paper variant="outlined" sx={{ width: '100%', borderRadius: 1, overflow: 'hidden', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: '0.25rem', backgroundColor: '#fff' }}>
          <Typography fontWeight={600} fontSize="1rem">Scanned Crop Images</Typography>
          <Typography variant="body2" color="text.secondary">Loading images...</Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.12)' }} />
        <Box sx={{ p: 3, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  // Check for errors
  if (shelfData?.error) {
    return (
      <Paper variant="outlined" sx={{ width: '100%', borderRadius: 1, overflow: 'hidden', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: '0.25rem', backgroundColor: '#fff' }}>
          <Typography fontWeight={600} fontSize="1rem">Scanned Crop Images</Typography>
          <Typography variant="body2" color="text.secondary">Error loading images</Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.12)' }} />
        <Box sx={{ p: 3, backgroundColor: '#fff' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {shelfData.error}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Please check the browser console for more details.
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Show empty state
  if (!scannedcropimages || !hasValidShelfData || shelfKeys.length === 0) {
    return (
      <Paper variant="outlined" sx={{ width: '100%', borderRadius: 1, overflow: 'hidden', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: '0.25rem', backgroundColor: '#fff' }}>
          <Typography fontWeight={600} fontSize="1rem">Scanned Crop Images</Typography>
          <Typography variant="body2" color="text.secondary">No images available</Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.12)' }} />
        <Box sx={{ p: 3, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No scanned crop images available for this cycle
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Safely get channel info
  const channelInfo = shelfData.channelInfo || {
    firstChannelNum: 0,
    middleChannelNum: 0,
    lastChannelNum: 0,
    totalChannels: 0,
    availableChannels: []
  };

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            backgroundColor: '#fff',
          }}
        >
          <Typography fontWeight={600} fontSize="1rem">
            Scanned Crop Images
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Displays representative images from first, middle, and last channels
          </Typography>
          
          {/* Show fallback notice if using fallback */}
          {shelfData.usingFallback && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {shelfData.fallbackMessage || 'Showing previous images - no images found in requested date range'}
            </Alert>
          )}
        </Box>

        {/* Divider */}
        <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.12)' }} />

        {/* Body */}
        <Box
          sx={{
            p: 3,
            backgroundColor: '#fff',
          }}
        >
          {/* First Channel Images */}
          {renderImageGrid(
            shelfData.firstChannel, 
            'First Channel', 
            channelInfo.firstChannelNum
          )}

          {/* Middle Channel Images */}
          {renderImageGrid(
            shelfData.middleChannel, 
            'Middle Channel', 
            channelInfo.middleChannelNum
          )}

          {/* Last Channel Images */}
          {renderImageGrid(
            shelfData.lastChannel, 
            'Last Channel', 
            channelInfo.lastChannelNum
          )}
        </Box>
      </Paper>

      {/* Lightbox */}
      {currentSlides.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={currentSlides}
          index={photoIndex}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 3,
            scrollToZoom: true,
          }}
        />
      )}
    </>
  );
};

export default ScannedCropImages;