// src/components/smart-robotics/DroneScanStatus.tsx
import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

const RobotScanStatus: React.FC = () => (
  <Paper
    variant="outlined"
    sx={{
      borderRadius: '4px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: '100%',
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      Drone Scan Status
    </Typography>
    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'rgba(0,18,25,0.6)' }}>
      Tracks Drone crop scans and status.
    </Typography>
    <Box sx={{ position: 'relative', width: '15rem', height: '15rem', mt: 2 }}>
      <CircularProgress
        variant="determinate"
        value={31}
        size="100%"
        thickness={4}
        sx={{ color: '#e6e9ec', position: 'absolute', top: 0, left: 0 }}
      />
      <CircularProgress
        variant="determinate"
        value={31}
        size="100%"
        thickness={4}
        sx={{ color: '#039be5', position: 'absolute', top: 0, left: 0 }}
      />
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          31%
        </Typography>
        <Typography variant="subtitle2">Scanning</Typography>
      </Box>
    </Box>
  </Paper>
);

export default RobotScanStatus;
