"use client";

import React, { useRef, useState } from 'react';
import { Box, Paper, IconButton, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const VIDEO_SRC = '/apps/SmartRobotics/INNOFarmsAIGrowSmartRobotics.mp4';
const CALENDLY_URL = 'https://calendly.com/innofarmsai89/30min';

const SmartRoboticsVideoCard: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
  };

   const openCalendlyPopup = () => {
     if (typeof window === 'undefined') return;
     const calendly = (window as any).Calendly;
     if (calendly && typeof calendly.initPopupWidget === 'function') {
       calendly.initPopupWidget({ url: CALENDLY_URL });
     } else {
       // Fallback: open in new tab if widget isn't loaded for some reason
       window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
     }
   };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 0,
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid rgba(0, 135, 86, 0.3)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '480px',
          position: 'relative',
          bgcolor: '#000',
        }}
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          preload="metadata"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            sx={{
              bgcolor: 'rgba(0, 135, 86, 0.9)',
              color: '#fff',
              width: 72,
              height: 72,
              '&:hover': { bgcolor: 'rgba(0, 135, 86, 1)' },
            }}
          >
            {isPlaying ? (
              <PauseIcon sx={{ fontSize: 40 }} />
            ) : (
              <PlayArrowIcon sx={{ fontSize: 40 }} />
            )}
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 2,
          display: 'flex',
          justifyContent: 'center',
          bgcolor: '#fafafa',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Button
          type="button"
          onClick={openCalendlyPopup}
          variant="contained"
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: '999px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 14,
            backgroundColor: '#008756',
            boxShadow: '0 8px 16px rgba(0, 135, 86, 0.25)',
            '&:hover': {
              backgroundColor: '#006f45',
              boxShadow: '0 10px 20px rgba(0, 135, 86, 0.35)',
            },
          }}
        >
          Request Live Robotics Crop Scouting Demo
        </Button>
      </Box>
    </Paper>
  );
};

export default SmartRoboticsVideoCard;
