// src/components/smart-robotics/MapSection.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Image from 'next/image';

const RobotMapSection: React.FC = () => (
  <Box>
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      AI Robot Map
    </Typography>
    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'rgba(0,18,25,0.6)' }}>
      Visualize Drones locations and activity in real time.
    </Typography>
    <Paper variant="outlined" sx={{ borderRadius: '4px', mt: 2 }}>
      <Image
        src="/apps/1673253180115 1.png"
        alt="Map"
        width={588}
        height={416}
        style={{ width: '100%', objectFit: 'cover' }}
      />
    </Paper>
  </Box>
);

export default RobotMapSection;
