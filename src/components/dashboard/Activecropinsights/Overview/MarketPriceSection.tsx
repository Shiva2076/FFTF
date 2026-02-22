'use client';
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

interface MarketPriceCardProps {
  label: string;
  value: string | null;
  currency?: string;
  weight?: string;
}

const MarketPriceCard: React.FC<MarketPriceCardProps> = ({ label, value, currency, weight }) => {
  const shouldDisplayPrice = value !== null && value !== undefined && value !== '';

  const displayValue = shouldDisplayPrice
    ? `${value} ${currency}/${weight}`
    : '-';

  return (
    <Paper
      variant="outlined"
      sx={{
        flex: 1,
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            letterSpacing: '1px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          {label}
          <Tooltip title="Retail Price" arrow>
            <InfoOutlinedIcon sx={{ fontSize: '1rem', color: 'rgba(236, 106, 12, 0.54)' }} />
          </Tooltip>
        </Typography>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: 'rgba(0,18,25,0.87)' }}
        >
          {displayValue}
        </Typography>
      </Box>
    </Paper>
  );
};

export interface MarketPriceSectionProps {
  minimumMarketPriceData?: string | null;
  maximumMarketPriceData?: string | null;
}

const MarketPriceSection: React.FC<MarketPriceSectionProps> = ({
  minimumMarketPriceData,
  maximumMarketPriceData,
}) => {
  const { currency, weight } = useSelector(
    (state: RootState) => state.locationMeta
  );

  const marketPriceData = [
    {
      label: 'Minimum market price',
      value: minimumMarketPriceData,
    },
    {
      label: 'Maximum market price',
      value: maximumMarketPriceData,
    },
  ];

  return (
    <Box sx={{ width: '100%', display: 'flex', gap: '1.5rem', fontSize: '0.75rem' }}>
      {marketPriceData.map((item, index) => (
        <MarketPriceCard
          key={index}
          label={item.label}
          value={item.value ?? null}
          currency={
            item.value !== null && item.value !== undefined && item.value !== ''
              ? currency
              : undefined
          }
          weight={
            item.value !== null && item.value !== undefined && item.value !== ''
              ? weight
              : undefined
          }
        />
      ))}
    </Box>
  );
};

export default MarketPriceSection;
