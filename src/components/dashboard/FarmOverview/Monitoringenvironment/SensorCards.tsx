'use client';

import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import Image from 'next/image';
import BlurWrapper from '@/components/common/BlurWrapper';

interface SensorCardProps {
  label: string;
  value: string | number;
  indicator: string | null;
  lastUpdated: any;
  iconSrc: string;
  iconBgColor: string;
  isBlurred?: boolean;
  messageType?: 'iot' | 'ai';
}

const getIndicatorColor = (indicator: string | null) => {
  switch (indicator) {
    case 'High':
      return '#e53935';
    case 'Optimal':
      return '#43a047';
    case 'Low':
      return '#f9a825';
    default:
      return '#bdbdbd';
  }
};

const SensorCard: React.FC<SensorCardProps> = ({
  label,
  value,
  indicator,
  lastUpdated,
  iconSrc,
  iconBgColor,
  isBlurred = false,
  messageType = 'iot',
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        flex: 1,
        borderRadius: '6px',
        p: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minWidth: 0,
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '0.75rem' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Typography
            sx={{
              letterSpacing: '1px',
              textTransform: 'uppercase',
              lineHeight: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#6b7280',
            }}
          >
            {label}
          </Typography>
          <BlurWrapper isBlurred={isBlurred} messageType={messageType}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#001219',
                  }}
                >
                  {value}
                </Typography>
                {indicator && (
                  <Chip
                    label={`${indicator}`}
                    size="small"
                    sx={{
                      width: '80px',
                      backgroundColor: getIndicatorColor(indicator),
                      color: '#fff',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                    }}
                  />
                )}
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: '#6b7280',
                    lineHeight: 1.2,
                  }}
                >
                  Last updated: {lastUpdated}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '8px',
                  backgroundColor: iconBgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image src={iconSrc} alt={`${label} icon`} width={24} height={24} />
              </Box>
            </Box>
          </BlurWrapper>
        </Box>
      </Box>
    </Paper>
  );
};
 
interface SensorCardsProps {
  sensorData: {
    temperature?: number | null;
    lastUpdatedTemp?: any;
    lastUpdatedCO2?: any;
    lastUpdatedHumidity?: any;
    humidity?: number | null;
    co2?: number | null;
    indicatorTemp?: string | null;
    indicatorHumidity?: string | null;
    indicatorCO2?: string | null;
  };
  iot?: boolean;
}
 
const SensorCards: React.FC<SensorCardsProps> = ({ sensorData, iot = true }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: '1.5rem',
        width: '100%',
      }}
    >
      <SensorCard
        label="Temperature"
        value={
          sensorData?.temperature !== null
            ? `${sensorData.temperature} °C`
            : '—'
        }
        indicator={sensorData?.indicatorTemp || null}
        lastUpdated={
          sensorData?.lastUpdatedTemp
            ? new Date(sensorData.lastUpdatedTemp).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })
            : '-'
        }
        iconSrc="/apps/dashboard/temperature.svg"
        iconBgColor="#008756"
        isBlurred={!iot}
        messageType="iot"
      />
      <SensorCard
        label="Humidity"
        value={
          sensorData?.humidity !== null
            ? `${sensorData.humidity} %`
            : '—'
        }
        indicator={sensorData?.indicatorHumidity || null}
        lastUpdated={
          sensorData?.lastUpdatedHumidity
            ? new Date(sensorData.lastUpdatedHumidity).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })
            : '-'
        }
        iconSrc="/apps/dashboard/humidity.svg"
        iconBgColor="#81b462"
        isBlurred={!iot}
        messageType="iot"
      />
      <SensorCard
        label="CO₂"
        value={sensorData?.co2 !== null ? `${sensorData.co2} ppm` : '—'}
        indicator={sensorData?.indicatorCO2 || null}
        lastUpdated={
          sensorData?.lastUpdatedCO2
            ? new Date(sensorData.lastUpdatedCO2).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })
            : '-'
        }
        iconSrc="/apps/dashboard/carbondioxide.svg"
        iconBgColor="#c8d04f"
        isBlurred={!iot}
        messageType="iot"
      />
    </Box>
  );
};
 
export default SensorCards;