'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, MenuItem, Select, CircularProgress, Skeleton, IconButton, Drawer, Chip } from '@mui/material';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import CloseIcon from '@mui/icons-material/Close';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import BlurWrapper from '@/components/common/BlurWrapper';

interface DateOption {
  value: string;
  label: string;
}

interface ImageData {
  date: string;
  filename: string;
  plugId: string;
  url: string;
  dayNumber?: string;
  hasAiAnalysis?: boolean;
  aiAnalysisUrl?: string;
  healthscore?: number;
}

interface LiveMonitoringData {
  rackId: number;
  shelfId: number;
  cycleId: number;
  cropName: string;
  cropVariety: string;
  status: string;
  imagesByDate: { [date: string]: ImageData[] }; 
  availableDates: DateOption[];
  vegetativeStartDate: string;
  vegetativeEndDate: string;
}

interface LiveMonitoringSectionProps {
  liveMonitoring?: {
    [key: string]: LiveMonitoringData;
  };
  isLoading?: boolean;
  ai?: boolean;
}

// Helper function to get health status with darker green colors
const getHealthStatus = (score?: number) => {
  if (score === undefined || score === null) {
    return { 
      label: 'N/A', 
      color: '#9e9e9e', 
      bgColor: 'rgba(158, 158, 158, 0.1)',
      glowColor: 'rgba(158, 158, 158, 0.3)',
      darkColor: '#757575',
      gradient: 'linear-gradient(135deg, #9e9e9e 0%, #bdbdbd 100%)',
      iconColor: '#bdbdbd'
    };
  }
  
  if (score >= 75) {
    return { 
      label: 'Healthy', 
      color: '#2E7D32',  // Darker green
      bgColor: 'rgba(46, 125, 50, 0.15)',
      glowColor: 'rgba(46, 125, 50, 0.4)',
      darkColor: '#1B5E20',  // Even darker green
      gradient: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
      iconColor: '#388E3C'
    };
  } else if (score >= 60) {
    return { 
      label: 'Moderate', 
      color: '#FF9800', 
      bgColor: 'rgba(255, 152, 0, 0.15)',
      glowColor: 'rgba(255, 152, 0, 0.4)',
      darkColor: '#F57C00',
      gradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
      iconColor: '#FFA726'
    };
  } else {
    return { 
      label: 'Unhealthy', 
      color: '#f44336', 
      bgColor: 'rgba(244, 67, 54, 0.15)',
      glowColor: 'rgba(244, 67, 54, 0.4)',
      darkColor: '#D32F2F',
      gradient: 'linear-gradient(135deg, #f44336 0%, #E57373 100%)',
      iconColor: '#EF5350'
    };
  }
};

// Enhanced health score badge component
const HealthScoreBadge: React.FC<{ healthScore?: number }> = ({ healthScore }) => {
  const healthStatus = getHealthStatus(healthScore);
  const [glow, setGlow] = useState(false);

  // Create pulsing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlow(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: healthStatus.bgColor,
        backdropFilter: 'blur(12px)',
        border: `2px solid ${healthStatus.color}`,
        borderRadius: '20px',
        px: 1.5,
        py: 0.75,
        zIndex: 2,
        boxShadow: glow 
          ? `0 0 20px ${healthStatus.glowColor}, 0 0 40px ${healthStatus.glowColor}`
          : `0 0 10px ${healthStatus.glowColor}`,
        transition: 'all 0.3s ease',
        animation: 'float 3s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      }}
    >
      {/* Shine effect overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
          transform: 'skewX(-20deg)',
          animation: 'shine 3s infinite',
          '@keyframes shine': {
            '0%': { left: '-100%' },
            '100%': { left: '200%' },
          },
        }}
      />
      
      {/* Score text with shine effect */}
      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            fontFamily: 'Poppins',
            letterSpacing: '0.5px',
            background: healthStatus.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: `0 0 10px ${healthStatus.glowColor}`,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {healthScore !== undefined && healthScore !== null ? `${healthScore.toFixed(1)}%` : 'N/A'}
        </Typography>
        
        {/* Text shine effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            transform: 'skewX(-20deg)',
            animation: 'textShine 4s infinite',
            '@keyframes textShine': {
              '0%': { left: '-100%' },
              '100%': { left: '200%' },
            },
          }}
        />
      </Box>
      
      {/* Status label */}
      <Typography
        sx={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: healthStatus.darkColor,
          fontFamily: 'Poppins',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          ml: 0.5,
          opacity: 0.9,
        }}
      >
        {healthStatus.label}
      </Typography>
    </Box>
  );
};

const LiveMonitoringSection: React.FC<LiveMonitoringSectionProps> = ({
  liveMonitoring = {},
  isLoading = false,
  ai = true,
}) => {
  const availableKeys = Object.keys(liveMonitoring);
  const defaultKey = availableKeys.find(key => key === 'rack_2_shelf_2') || availableKeys[0] || '';
  const [selectedKey, setSelectedKey] = useState(defaultKey);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loadingImages, setLoadingImages] = useState<{ [key: number]: boolean }>({});
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiImageLoading, setAiImageLoading] = useState(true);
  
  const currentData = liveMonitoring[selectedKey];
  
  useEffect(() => {
    if (currentData?.availableDates && currentData.availableDates.length > 0) {
      setSelectedDate(currentData.availableDates[0].value);
    }
  }, [selectedKey, currentData?.availableDates]);

  // Close AI drawer when lightbox closes
  useEffect(() => {
    if (!lightboxOpen) {
      setAiDrawerOpen(false);
    }
  }, [lightboxOpen]);

  // Reset loading when drawer opens
  useEffect(() => {
    if (aiDrawerOpen) {
      setAiImageLoading(true);
    }
  }, [aiDrawerOpen]);

  // Get images for currently selected date
  const currentImagesData = React.useMemo(() => {
    const imagesData = currentData?.imagesByDate?.[selectedDate];
    if (!imagesData) return [];
    return imagesData;
  }, [currentData?.imagesByDate, selectedDate]);

  const currentImages = currentImagesData.map((item: any) => {
    if (typeof item === 'string') return item;
    return item.url;
  });

  const hasLiveFeeds = currentImages.length > 0;

  const formatLabel = (key: string, data: LiveMonitoringData) => {
    const parts = key.split('_');
    const rackShelf = `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} ${parts[1]} - ${parts[2].charAt(0).toUpperCase() + parts[2].slice(1)} ${parts[3]}`;
    
    if (data?.cropName) {
      return `${rackShelf} (${data.cropName})`;
    }
    
    return rackShelf;
  };

  const slides = currentImages.map((url) => ({ src: url }));

  const handleImageLoad = (idx: number) => {
    setLoadingImages(prev => ({ ...prev, [idx]: false }));
  };

  const handleImageError = (idx: number) => {
    setLoadingImages(prev => ({ ...prev, [idx]: false }));
  };

  const currentImageData = currentImagesData[photoIndex];
  const hasAiAnalysis = currentImageData?.hasAiAnalysis;
  const aiAnalysisUrl = currentImageData?.aiAnalysisUrl;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: '4px 4px 0 0',
          p: '1.5rem',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          backgroundColor: '#fff',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient effect with darker green */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
           }}
        />
        
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: 0 }}>
          <Typography sx={{ letterSpacing: '0.15px', fontWeight: 600, lineHeight: '200%' }}>
            Live Monitoring
          </Typography>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: 'rgba(0, 18, 25, 0.6)',
              letterSpacing: '0.4px',
              lineHeight: '166%',
            }}
          >
            View historical images from farm monitoring (last updates daily at 6 PM).
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {availableKeys.length > 0 && (
            <Select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              size="small"
              sx={{
                minWidth: 180,
                height: 40,
                px: 2,
                borderRadius: 1,
                backgroundColor: 'white',
                fontFamily: 'Poppins',
                fontSize: 14,
                fontWeight: 400,
                letterSpacing: '0.17px',
                color: 'rgba(0, 18, 25, 0.87)',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                '& .MuiSelect-icon': {
                  color: 'rgba(0, 18, 25, 0.87)',
                },
                '&:hover': {
                  borderColor: '#2E7D32',
                  boxShadow: '0 0 0 1px rgba(46, 125, 50, 0.2)',
                },
              }}
            >
              {availableKeys.map((key) => (
                <MenuItem key={key} value={key} sx={{ fontFamily: 'Poppins' }}>
                  {formatLabel(key, liveMonitoring[key])}
                </MenuItem>
              ))}
            </Select>
          )}

          {currentData?.availableDates && currentData.availableDates.length > 0 && (
            <Select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              size="small"
              sx={{
                minWidth: 150,
                height: 40,
                px: 2,
                borderRadius: 1,
                backgroundColor: 'white',
                fontFamily: 'Poppins',
                fontSize: 14,
                fontWeight: 400,
                letterSpacing: '0.17px',
                color: 'rgba(0, 18, 25, 0.87)',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                '& .MuiSelect-icon': {
                  color: 'rgba(0, 18, 25, 0.87)',
                },
                '&:hover': {
                  borderColor: '#2196F3',
                  boxShadow: '0 0 0 1px rgba(33, 150, 243, 0.2)',
                },
              }}
            >
              {currentData.availableDates.map((dateOption) => (
                <MenuItem key={dateOption.value} value={dateOption.value} sx={{ fontFamily: 'Poppins' }}>
                  {dateOption.label}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
      </Paper>

      <BlurWrapper isBlurred={!ai} messageType="ai">
      <Box
        sx={{
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: '0 0 4px 4px',
          backgroundColor: '#fff',
          minHeight: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          position: 'relative',
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={40} />
            <Typography sx={{ fontSize: '0.875rem', color: 'rgba(0, 18, 25, 0.6)' }}>
              Loading images...
            </Typography>
          </Box>
        ) : !hasLiveFeeds ? (
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#001219' }}>
            No images available for this date.
          </Typography>
        ) : (
          <Box
            sx={{
              width: '100%',
              overflowX: 'auto',
              overflowY: 'hidden',
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#2E7D32',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#1B5E20',
                },
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                pb: 1,
              }}
            >
              {currentImages.map((imageUrl, idx) => {
                const imageData = currentImagesData[idx];
                const healthScore = imageData?.healthscore;
                const hasAiForThisImage = imageData?.hasAiAnalysis;

                return (
                  <Box
                    key={idx}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      setPhotoIndex(idx);
                      setLightboxOpen(true);
                    }}
                    sx={{
                      position: 'relative',
                      width: '180px',
                      height: '180px',
                      flexShrink: 0,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '2px solid transparent',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.03)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.2), 0 4px 12px rgba(46, 125, 50, 0.3)',
                        borderColor: '#2E7D32',
                        '& .health-badge': {
                          transform: 'scale(1.1)',
                        }
                      },
                    }}
                  >
                    {/* Image loading skeleton */}
                    {loadingImages[idx] !== false && (
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          bgcolor: 'grey.200',
                        }}
                      />
                    )}
                    
                    {/* Main image */}
                    <img
                      src={imageUrl}
                      alt={`Live Monitoring ${idx + 1}`}
                      crossOrigin="anonymous"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: loadingImages[idx] === false ? 'block' : 'none',
                      }}
                      onLoad={() => handleImageLoad(idx)}
                      onError={(e) => {
                        handleImageError(idx);
                        console.error(`Failed to load image ${idx}:`, imageUrl);
                      }}
                    />
                    
                    {/* Enhanced Health Score Badge */}
                    <Box
                      className="health-badge"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        zIndex: 2,
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <HealthScoreBadge healthScore={healthScore} />
                    </Box>

                    {/* AI Analysis Overlay on Hover */}
                    {hasAiForThisImage && hoveredIndex === idx && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 3,
                          animation: 'fadeIn 0.2s ease-in',
                          '@keyframes fadeIn': {
                            from: { opacity: 0 },
                            to: { opacity: 1 },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              backgroundColor: 'rgba(46, 125, 50, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px solid #2E7D32',
                              animation: 'pulse 2s infinite',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: '#2E7D32',
                                fontFamily: 'Poppins',
                              }}
                            >
                              AI
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: 'white',
                              fontFamily: 'Poppins',
                              textAlign: 'center',
                              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            }}
                          >
                            AI Analysis Available
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.75rem',
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontFamily: 'Poppins',
                              textAlign: 'center',
                              maxWidth: '140px',
                            }}
                          >
                            Click to view detailed plant health analysis
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
      </BlurWrapper>

      {/* Lightbox with custom toolbar */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={photoIndex}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        on={{
          view: ({ index }) => setPhotoIndex(index),
        }}
        toolbar={{
          buttons: [
            hasAiAnalysis ? (
              <Box
                key="ai-analysis"
                onClick={() => setAiDrawerOpen(true)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1.25,
                  backgroundColor: 'rgba(46, 125, 50, 0.9)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(46, 125, 50, 1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(46, 125, 50, 0.5)',
                  },
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)' },
                    '50%': { boxShadow: '0 4px 20px rgba(46, 125, 50, 0.6)' },
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    color: 'white',
                    letterSpacing: '0.5px',
                  }}
                >
                  AI ANALYSIS
                </Typography>
              </Box>
            ) : null,
            'zoom',
            'close',
          ],
        }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
        }}
        carousel={{
          finite: slides.length <= 1,
        }}
      />

      {/* AI Analysis Drawer */}
      <Drawer
        anchor="right"
        open={aiDrawerOpen && lightboxOpen}
        onClose={() => setAiDrawerOpen(false)}
        sx={{
          zIndex: 10001,
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 500, md: 600 },
            backgroundColor: '#1a1a1a',
            color: 'white',
          },
        }}
        ModalProps={{
          keepMounted: false,
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'linear-gradient(90deg, #1a1a1a, #2a2a2a)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box>
                <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontSize: '1.125rem', fontWeight: 700 }}>
                  AI Plant Health Analysis
                </Typography>
               </Box>
            </Box>
            <IconButton 
              onClick={() => setAiDrawerOpen(false)} 
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'rotate(90deg)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
            {aiAnalysisUrl ? (
              <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* AI Analysis Image */}
                <Box sx={{ flex: 1, position: 'relative', backgroundColor: '#000' }}>
                  {aiImageLoading && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        zIndex: 1,
                      }}
                    >
                      <CircularProgress 
                        size={60} 
                        sx={{ 
                          color: '#2E7D32',
                          '& .MuiCircularProgress-circle': {
                            animationDuration: '1.5s',
                          }
                        }} 
                      />
                      <Typography sx={{ fontSize: '0.875rem', fontFamily: 'Poppins', color: 'rgba(255, 255, 255, 0.6)' }}>
                        Loading AI analysis...
                      </Typography>
                    </Box>
                  )}
                  <img
                    src={aiAnalysisUrl}
                    alt="AI Analysis"
                    crossOrigin="anonymous"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: aiImageLoading ? 'none' : 'block',
                    }}
                    onLoad={() => setAiImageLoading(false)}
                    onError={(e) => {
                      setAiImageLoading(false);
                      console.error('Failed to load AI analysis image:', aiAnalysisUrl);
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
                <Typography sx={{ fontSize: '1.25rem', fontFamily: 'Poppins', fontWeight: 700, mb: 1, color: 'white' }}>
                  No AI Analysis Available
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', fontFamily: 'Poppins', color: 'rgba(255, 255, 255, 0.6)', maxWidth: '300px', margin: '0 auto' }}>
                  AI analysis has not been generated for this image yet. Check back later for detailed plant health insights.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default LiveMonitoringSection;