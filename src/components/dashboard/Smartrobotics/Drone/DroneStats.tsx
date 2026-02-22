// src/components/smart-robotics/DroneStats.tsx
import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import Image from 'next/image';

const DroneStats: React.FC = () => (
  <Grid container spacing={2}>
    {[
      { label: 'Total Drones', value: '10', color: '#066493', size: 24 },
      { label: 'Docked Drones', value: '3', color: '#039be5', size: 18 },
      { label: 'Scanning Drones', value: '7', color: '#09b1c4', size: 24 },
    ].map((stat, idx) => (
      <Grid item xs={12} sm={4} key={idx}>
        <Paper
          variant="outlined"
          sx={{
            borderRadius: '4px',
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
              {stat.label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'rgba(0,18,25,0.87)' }}>
              {stat.value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '4px',
              backgroundColor: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image src="/apps/Vector.svg" alt="Vector" width={stat.size} height={24} />
          </Box>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

export default DroneStats;