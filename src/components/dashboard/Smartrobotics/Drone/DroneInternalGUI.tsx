// src/components/smart-robotics/DroneInternalGUI.tsx
import React from 'react';
import { Box, Typography, Paper, IconButton, Avatar } from '@mui/material';
import Image from 'next/image';

const DroneInternalGUI: React.FC = () => {
  const rows = [
    { id: 'DRT001', status: 'Completed', images: Array(6).fill('/image.png') },
    { id: 'DRT002', status: 'Completed', images: Array(6).fill('/image.png') },
  ];
  return (
    <Paper variant="outlined" sx={{ borderRadius: '4px', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', gap: '1.5rem' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Drone Internal GUI
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'rgba(0,18,25,0.6)' }}>
            Interface for monitoring and controlling drones
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <IconButton size="small">
            <Image src="/apps/Vector.svg" alt="Prev" width={12} height={12} style={{ transform: 'rotate(180deg)' }} />
          </IconButton>
          <IconButton size="small">
            <Image src="/apps/Vector.svg" alt="Next" width={12} height={12} />
          </IconButton>
        </Box>
      </Box>
      {rows.map((row, index) => (
        <Box
          key={index}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.12)' }}
        >
          <Typography sx={{ width: '5rem' }}>{row.id}</Typography>
          <Typography sx={{ width: '7.5rem' }}>{row.status}</Typography>
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            {row.images.map((src, idx) => (
              <Avatar key={idx} variant="rounded" src={src} sx={{ width: 40, height: 40 }} />
            ))}
          </Box>
        </Box>
      ))}
    </Paper>
  );
};

export default DroneInternalGUI;
