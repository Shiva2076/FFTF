// src/components/smart-robotics/FarmBlueprint.tsx
import React from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import Image from 'next/image';

const RobotFarmBlueprint: React.FC = () => (
  <Box>
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      Farm Blueprint
    </Typography>
    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'rgba(0,18,25,0.6)' }}>
      Visual layout of your farm's structure and systems.
    </Typography>
    <Box sx={{ display: 'flex', gap: '0.5rem', mt: 1 }}>
      <IconButton size="small">
        <Image src="/apps/Vector.svg" alt="Prev" width={12} height={12} style={{ transform: 'rotate(180deg)' }} />
      </IconButton>
      <IconButton size="small">
        <Image src="/apps/Vector.svg" alt="Next" width={12} height={12} />
      </IconButton>
    </Box>
    <Paper variant="outlined" sx={{ borderRadius: '4px', mt: 2 }}>
      <Image
        src="/apps/1673253180115 1.png"
        alt="Blueprint"
        width={588}
        height={416}
        style={{ width: '100%', objectFit: 'cover' }}
      />
    </Paper>
  </Box>
);

export default RobotFarmBlueprint;
