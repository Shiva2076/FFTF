'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import Image from 'next/image';

/* ── Types ── */
interface MetricItem {
  id: string;
  title: string;
  value: string;
  iconSrc: string;
  iconBg: string;
}

interface MetricsSectionProps {
  topCardsData?: {
    cropProfitData?: { value?: string } | string;
    cropHealthScoreData?: string;
    predictedYieldData?: string;
    activeCropHealthData?: string;
    statusData?: string;
  };
  cycleId?: number;
}

/* ── MetricCard Component ── */
const MetricCard: React.FC<MetricItem> = ({
  title,
  value,
  iconSrc,
  iconBg,
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 1,
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 2,
          '&:last-child': { pb: 2 },
        }}
      >
        {/* Text */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              letterSpacing: 1,
              textTransform: 'uppercase',
              lineHeight: 1.5,
              height: '40px',
              display: 'flex',
              alignItems: 'start',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h6"
            component="p"
            fontWeight={600}
            color="rgba(0,18,25,0.87)"
            mt={0.5}
          >
            {value}
          </Typography>
        </Box>
        {/* Icon */}
        <Box
          sx={{
            height: 40,
            width: 40,
            borderRadius: 1,
            backgroundColor: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Image src={iconSrc} alt={title} width={24} height={24} />
        </Box>
      </CardContent>
    </Card>
  );
};

const getValue = (data: { value?: string } | string | undefined): string => {
  if (!data) return 'N/A';
  if (typeof data === 'string') return data;
  return data.value || 'N/A';
};

const MetricsSection: React.FC<MetricsSectionProps> = ({ topCardsData, cycleId }) => {
  const theme = useTheme();


  const metrics: MetricItem[] = [
    {
      id: 'profit',
      title: 'Crop Profit',
      value: getValue(topCardsData?.cropProfitData),
      iconSrc: '/apps/dashboard/cropprofit.svg',
      iconBg: '#008756',
    },
    {
      id: 'health',
      title: 'Crop Health Score',
      value: getValue(topCardsData?.cropHealthScoreData),
      iconSrc: '/apps/dashboard/crophealthscore.svg',
      iconBg: '#81b462',
    },
    {
      id: 'yield',
      title: 'AI Predicted Yield',
      value: getValue(topCardsData?.predictedYieldData),
      iconSrc: '/apps/dashboard/predicatedhealth.svg',
      iconBg: '#c8d04f',
    },
    {
      id: 'status',
      title: 'Active Crop Health',
      value: getValue(topCardsData?.activeCropHealthData),
      iconSrc: '/apps/dashboard/activecrophealth.svg',
      iconBg: '#eea92b',
    },
    {
      id: 'stage',
      title: 'Status',
      value: getValue(topCardsData?.statusData),
      iconSrc: '/apps/dashboard/status.svg',
      iconBg: '#ff5e00',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1.5rem',
        width: '100%',
        [theme.breakpoints.down('md')]: {
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
        [theme.breakpoints.down('sm')]: {
          gridTemplateColumns: '1fr',
        },
      }}
    >
      {metrics.map((item) => (
        <Box key={item.id}>
          <MetricCard {...item} />
        </Box>
      ))}
    </Box>
  );
};

export default MetricsSection;