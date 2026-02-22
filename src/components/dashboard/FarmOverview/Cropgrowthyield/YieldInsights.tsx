'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Select, MenuItem, FormControl } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Image from 'next/image';
import { formatUnderscoreString } from '@/utils/Capitalize';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: '#fff',
          border: '1px solid #d1d9e2',
          borderRadius: 1,
          boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.12)',
          px: 1.5,
          py: 1,
        }}
      >
        <Typography variant="body2" fontWeight={500}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: '#008756' }}>
          Yield: {payload[0].value} kg
        </Typography>
      </Box>
    );
  }
  return null;
};

interface YieldData {
  actual_yield: number;
  month?: string;
}

interface CropYieldData {
  crop_name: string;
  crop_variety: string;
  data: YieldData[];
}

interface YieldInsightsProps {
  yieldInsights: CropYieldData[];
}

const YieldInsights: React.FC<YieldInsightsProps> = ({ yieldInsights }) => {
  const hasData = Boolean(yieldInsights && yieldInsights.length && yieldInsights.some(item => item.data && item.data.length));

  const allMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getRolling6Months = useMemo(() => {
    const now = new Date();
    const currentIdx = now.getMonth();
    return Array.from({ length: 6 }, (_, i) => {
      const idx = (currentIdx - 5 + i + 12) % 12;
      return allMonths[idx];
    });
  }, []);

  const cropVarieties = useMemo(() => {
    if (!hasData) return [];
    return yieldInsights.map(item => {
      const formattedCrop = formatUnderscoreString(item.crop_name);
      const formattedVar = formatUnderscoreString(item.crop_variety);
      return {
        value: `${item.crop_name}-${item.crop_variety}`,
        label: `${formattedCrop} ${formattedVar}`,
        data: item.data,
      };
    });
  }, [yieldInsights, hasData]);

  const [selectedCrop, setSelectedCrop] = useState<string>('');

  // Update selectedCrop when cropVarieties changes
  useEffect(() => {
    if (cropVarieties.length > 0 && !selectedCrop) {
      setSelectedCrop(cropVarieties[0].value);
    }
  }, [cropVarieties, selectedCrop]);

  const selectedCropData = useMemo(() => {
    return (
      cropVarieties.find(c => c.value === selectedCrop)?.data || []
    );
  }, [cropVarieties, selectedCrop]);

  const chartData = useMemo(() => {
    if (!selectedCropData || selectedCropData.length === 0) {
      return getRolling6Months.map(month => ({ month, yield: 0 }));
    }

    // Create a map of month abbreviation to yield value
    const monthYieldMap = new Map<string, number>();

    selectedCropData.forEach(item => {
      if (item.month && item.actual_yield != null) {
        // Get first 3 characters and capitalize properly
        const monthAbbr = item.month.slice(0, 3);
        const monthLabel = monthAbbr.charAt(0).toUpperCase() + monthAbbr.slice(1).toLowerCase();
        // Find matching month in allMonths (case-insensitive)
        const matchedMonth = allMonths.find(m => m.toLowerCase() === monthLabel.toLowerCase());
        if (matchedMonth) {
          // Store by month abbreviation only (not year)
          monthYieldMap.set(matchedMonth, item.actual_yield);
        }
      }
    });

    // Map rolling 6 months to their yield values
    return getRolling6Months.map(month => ({
      month,
      yield: monthYieldMap.get(month) || 0
    }));
  }, [selectedCropData, getRolling6Months, allMonths]);

  const chartMetrics = useMemo(() => {
    const vals = chartData.map(d => d.yield);
    const maxY = Math.max(...vals, 0);
    return {
      maxYield: maxY > 0 ? maxY * 1.1 : 100,
    };
  }, [chartData]);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid #E0E0E0',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Poppins',
        mb: 2,
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.12)',
          pb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Yield Insights
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="textSecondary">
              Analyzes crop yield performance and trends.
            </Typography>
            <Typography variant="caption">•</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              <Image src="/apps/Vector.svg" alt="Time" width={7} height={8} />
              <Typography variant="caption">6m</Typography>
            </Box>
          </Box>
        </Box>

        {hasData && (
          <FormControl sx={{ minWidth: 160 }}>
            <Select
              value={selectedCrop}
              onChange={e => setSelectedCrop(e.target.value)}
              displayEmpty
              sx={{
                height: 40,
                borderRadius: 1,
                border: '1px solid rgba(0,0,0,0.12)',
                '& .MuiSelect-select': { py: 1, px: 2, display: 'flex', alignItems: 'center' },
                '& fieldset': { border: 'none' },
              }}
            >
              {cropVarieties.map(c => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </CardContent>

      <CardContent sx={{ pt: 2 }}>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mb: 1, display: 'block' }}
        >
          {hasData ? (
            <span>Yield (kg) </span>
          ) : (
            <span />
          )}
        </Typography>


        {hasData && chartData.length > 0 ? (
          <Box sx={{ height: 200, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(0,0,0,0.6)' }} />
                <YAxis domain={[0, Math.ceil(chartMetrics.maxYield)]} axisLine={false} tickLine={false} tick={{ fill: 'rgba(0,0,0,0.6)' }} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="yield" fill="#008756" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box
            sx={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography>Yield insights will be generated post cycle harvest</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default YieldInsights;