import { FunctionComponent } from 'react';
import { Box, Card, CardContent, Typography, Grid, Stack } from '@mui/material';
import { CropData } from '@/constants/cropsData';

interface Props {
  data: CropData['liveImpact'];
}

const LiveImpactSnapshot: FunctionComponent<Props> = ({ data }) => {
  const impactMetrics = [
    { label: 'CARBON SAVED', value: data.carbon, unit: 'kg CO₂', color: '#4A7C59' },
    { label: 'WATER SAVED', value: data.water, unit: 'L', color: '#B8D96D' },
    { label: 'ENERGY SAVED', value: data.energy, unit: 'kWh', color: '#E6B85C' },
    { label: 'CROP HEALTH', value: data.health, unit: '%', color: '#e2692f' },
  ];

  return (
    <Box sx={{ width: '98%', py: 1.5 }}>
      <Card sx={{ border: '2px solid #3D550C', borderRadius: '12px', boxShadow: 'none' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" sx={{ fontSize: '16px', fontWeight: 600, color: '#3D550C', mb: 0.3, fontFamily: 'Poppins' }}>
              Live Impact Snapshot
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '9px', color: '#1E1E1E', fontFamily: 'Poppins' }}>
              Real-time impact overview.
            </Typography>
          </Box>

          <Grid container spacing={1}>
            {/* Left Side - Circular Chart */}
            <Grid item xs={2.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: '100%' }}>
                <Box sx={{ position: 'relative', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="45" cy="45" r="38" fill="none" stroke="#E8E8E8" strokeWidth="9" />
                    <circle cx="45" cy="45" r="38" fill="none" stroke="url(#gradient)" strokeWidth="9" strokeDasharray={`${2 * Math.PI * 38 * (Number(data.score)/100)} ${2 * Math.PI * 38}`} strokeLinecap="round" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6096f0" />
                        <stop offset="100%" stopColor="#6096f0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <Box sx={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h2" sx={{ fontSize: '20px', fontWeight: 700, color: '#000', fontFamily: 'Poppins', lineHeight: 1 }}>{data.score}</Typography>
                    <Typography variant="body1" sx={{ fontSize: '7px', fontWeight: 600, color: '#000', fontFamily: 'Poppins', mt: 0.2 }}>Impact Score</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Middle - Metrics */}
            <Grid item xs={5.5}>
              <Stack spacing={3.5} sx={{ height: '100%', justifyContent: 'center', py: 0.5, pl: 4 }}>
                {impactMetrics.map((metric, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Box sx={{ width: 15, height: 15, backgroundColor: metric.color, borderRadius: '3px', flexShrink: 0 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '8px', fontWeight: 600, color: '#000', fontFamily: 'Poppins', lineHeight: 1.3, mb: 0.2 }}>{metric.label}</Typography>
                      <Typography variant="h6" sx={{ fontSize: '9.5px', fontWeight: 700, color: '#000', fontFamily: 'Poppins', lineHeight: 1.2 }}>{metric.value} {metric.unit}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Right Side - Image */}
            <Grid item xs={4}>
              <Box sx={{ width: '100%', height: '100%', minHeight: 120, maxHeight: 120, borderRadius: '10px', overflow: 'hidden' }}>
                <Box component="img" src={data.image} alt="Impact" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LiveImpactSnapshot;