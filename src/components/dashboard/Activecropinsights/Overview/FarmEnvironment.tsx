'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import BlurWrapper from '@/components/common/BlurWrapper';

interface MetricEntry {
  min: number;
  max: number;
  value: number | string | null;
}

interface FarmEnvironmentData {
  [key: string]: MetricEntry;
}

interface Props {
  farmEnvironmentData?: FarmEnvironmentData;
  iot?: boolean;
}

const FarmEnvironmentMetrics: React.FC<Props> = ({ farmEnvironmentData, iot = true }) => {
  const params = farmEnvironmentData || {};

  const metrics = [
    {
      label: 'Stage Duration',
      key: 'Stage Duration',
      unit: 'days',
    },
    {
      label: 'PPFD Range',
       key: 'PAR Sensor',
      unit: 'µmol/m²/s',
    },
    {
      label: 'Photo Period Range',
      key: 'Photo Period',
      unit: 'hrs/day',
    },
    {
      label: 'Temperature Range',
      key: 'Etemp',
      unit: '°C',
    },
    {
      label: 'Humidity Range',
      key: 'Humidity',
      unit: '%',
    },
    {
      label: 'CO₂ Range',
      key: 'CO2',
      unit: 'ppm',
    },
    {
      label: 'EC Range',
      key: 'EC Sensor',
      unit: 'mS/cm',
    },
    {
      label: 'pH Range',
      key: 'PH Sensor',
      unit: '',
    },
    {
      label: 'Water Temp Range',
      key: 'Water Temperature Sensor',
      unit: '°C',
    },
  ];

  return (
    <Paper variant="outlined" sx={{ borderRadius: 1, height: '100%', width: '100%' }}>
      <Box p={3}>
        <Typography fontWeight={600}>Farm Environment</Typography>
        <Typography variant="body2" color="text.secondary">
          Tracks environmental factors for optimal conditions.
        </Typography>
      </Box>

      <Box display="flex" px={3} py={1} bgcolor="rgba(0, 18, 25, 0.08)">
        <Box width="12rem">Metric</Box>
        <Box flex={1}>Real time Value </Box>
        <Box flex={1}>AI Parameters</Box>
      </Box>

      <Box position="relative" display="flex">
        <Box>
          {metrics.map((item, index) => (
            <Box
              key={index}
              px={2}
              py={1}
              borderBottom="1px solid rgba(0,0,0,0.12)"
              fontSize="0.8rem"
              sx={{ whiteSpace: 'nowrap' }}
              width="12rem"
            >
              {item.label}
            </Box>
          ))}
        </Box>
        <Box flex={2} display="flex" position="relative">
          {/* Value Column - Blurred */}
          <Box flex={1} position="relative">
            <BlurWrapper isBlurred={!iot} messageType="iot">
              {metrics.map((item, index) => {
                const data = params[item.key];

                const displayValue = (() => {
                  if (!data) return '-';
                  if (item.key === 'Stage Duration') {
                    return data.value != null
                      ? `${data.value}`
                      : `${data.min} - ${data.max} ${item.unit}`;
                  }
                  const val = data.value != null ? data.value : data.min;
                  return val != null ? `${val} ${item.unit}` : '-';
                })();

                return (
                  <Box
                    key={index}
                    px={2}
                    py={1}
                    borderBottom="1px solid rgba(0,0,0,0.12)"
                    fontSize="0.8rem"
                  >
                    {displayValue}
                  </Box>
                );
              })}
            </BlurWrapper>
          </Box>
          {/* AI Parameters Column - Not Blurred */}
          <Box flex={1}>
            {metrics.map((item, index) => {
              const data = params[item.key];
              const range = data
                ? `${data.min ?? '-'} - ${data.max ?? '-'} ${item.unit}`
                : '-';

              return (
                <Box
                  key={index}
                  px={2}
                  py={1}
                  borderBottom="1px solid rgba(0,0,0,0.12)"
                  fontSize="0.8rem"
                >
                  {range}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default FarmEnvironmentMetrics;
