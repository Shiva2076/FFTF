'use client';

import React from 'react';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { PieChart, Pie, Cell } from 'recharts';

interface OverallCropHealthStatus {
  healthy?: number;
  stressed?: number;
}

interface CropHealthStatusProps {
  overallCropHealthStatus?: OverallCropHealthStatus;
}

const CropHealthStatus: React.FC<CropHealthStatusProps> = ({ overallCropHealthStatus }) => {
  const healthy = overallCropHealthStatus?.healthy;
  const stressed = overallCropHealthStatus?.stressed;
  const isEmpty = healthy === undefined && stressed === undefined;

  const COLORS = ['#8bc34a', '#ef5350'];
  const EMPTY_COLOR = '#E0E0E0';

  const data = !isEmpty
    ? [
      { name: 'Healthy', value: healthy },
      { name: 'Stressed', value: stressed},
    ]
    : [{ name: 'Empty', value: 100 }];

  const renderPie = (
    <PieChart width={128} height={128}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        paddingAngle={0}
        stroke="none"
        innerRadius={40}
        outerRadius={60}
        startAngle={90}
        endAngle={-270}
        dataKey="value"
        strokeWidth={0}
      >
        {!isEmpty
          ? data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)
          : <Cell fill={EMPTY_COLOR} />}
      </Pie>
    </PieChart>
  );

  return (
    <Card elevation={0}
      sx={{
        borderRadius: '8px',
        mb: 2,
        border: '1px solid #E0E0E0',
        backgroundColor: '#fff',
        boxShadow: 'none',
      }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Overall Crop Health Status
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(0,18,25,0.6)', mb: 2, display: 'block' }}>
          Percentage of healthy vs. stressed crops.
        </Typography>
        <Divider sx={{ mx: -2, my: 2.7, borderColor: "rgba(0, 0, 0, 0.12)" }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Pie Chart */}
          <Box>{renderPie}</Box>

          {/* Labels */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, ml: 2 }}>
            {/* Healthy */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Box sx={{ width: '1rem', height: '1rem', backgroundColor: '#8bc34a', borderRadius: '3px' }} />
                <Typography variant="caption">Healthy</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {healthy !== undefined ? `${healthy}%` : '-'}
              </Typography>
            </Box>

            <Divider sx={{ backgroundColor: 'rgba(0,0,0,0.12)' }} />

            {/* Stressed */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Box sx={{ width: '1rem', height: '1rem', backgroundColor: '#ef5350', borderRadius: '3px' }} />
                <Typography variant="caption">Stressed</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {stressed !== undefined ? `${stressed}%` : '-'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CropHealthStatus;
