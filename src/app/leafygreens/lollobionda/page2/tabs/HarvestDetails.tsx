import { FunctionComponent } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Divider
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PanToolIcon from '@mui/icons-material/PanTool';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ScaleIcon from '@mui/icons-material/Scale';
import StraightenIcon from '@mui/icons-material/Straighten';
import BugReportIcon from '@mui/icons-material/BugReport';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NatureIcon from '@mui/icons-material/Nature';

const HarvestDetails: FunctionComponent = () => {
  const harvestDetailsLeft = [
    {
      icon: <CalendarTodayIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Harvest Date:',
      value: 'November 28, 2025'
    },
    {
      icon: <TimerIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Growth Duration:',
      value: '60 days from germination to harvest'
    }
  ];

  const harvestDetailsRight = [
    {
      icon: <LocalOfferIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Harvest Batch ID:',
      value: '701'
    },
    {
      icon: <PanToolIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Harvest Method:',
      value: 'Hand-picked and quality-checked under AI-guided lighting'
    }
  ];

  const environmentLeft = [
    {
      icon: <ThermostatIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Temperature:',
      value: '20–22°C (maintained 24/7)'
    },
    {
      icon: <WaterDropIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Humidity:',
      value: '55–65% RH'
    }
  ];

  const environmentRight = [
    {
      icon: <WbSunnyIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Lighting:',
      value: 'Full-spectrum LED, 14 hours/day'
    },
    {
      icon: <NatureIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Nutrient Delivery:',
      value: 'Automated hydroponic flow with AI-adjusted EC and pH levels'
    }
  ];

  const yieldLeft = [
    {
      icon: <ScaleIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Total Yield This Batch:',
      value: '120 kg'
    },
    {
      icon: <StraightenIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Average Head Size:',
      value: '150–180g per head'
    }
  ];

  const yieldRight = [
    {
      icon: <BugReportIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Pesticide Use:',
      value: 'None'
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Packaging Time:',
      value: 'Within 2 hours of harvest to preserve freshness'
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Card 
        sx={{ 
          border: '1px solid #3D550C',
          borderRadius: '6px',
          boxShadow: 'none'
        }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          {/* Harvest Details Section */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: '12px',
              fontWeight: 600,
              color: '#3D550C',
              mb: 1.5,
              fontFamily: 'Poppins'
            }}
          >
            Harvest Details
          </Typography>

          <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
            {/* Left Column */}
            <Grid item xs={6}>
              {harvestDetailsLeft.map((detail, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                  <Box sx={{ mt: 0.2 }}>{detail.icon}</Box>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#000',
                        fontSize: '10px',
                        fontFamily: 'Poppins',
                        mb: 0.3
                      }}
                    >
                      {detail.label}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1E1E1E',
                        fontSize: '11px',
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
                      {detail.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>

            {/* Right Column */}
            <Grid item xs={6}>
              {harvestDetailsRight.map((detail, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                  <Box sx={{ mt: 0.2 }}>{detail.icon}</Box>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#000',
                        fontSize: '10px',
                        fontFamily: 'Poppins',
                        mb: 0.3
                      }}
                    >
                      {detail.label}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1E1E1E',
                        fontSize: '11px',
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
                      {detail.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>
          </Grid>

          <Divider sx={{ my: 1.5 }} />

          {/* Farm Environment Section */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: '12px',
              fontWeight: 600,
              color: '#3D550C',
              mb: 1.5,
              fontFamily: 'Poppins'
            }}
          >
            Farm Environment
          </Typography>

          <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
            {/* Left Column */}
            <Grid item xs={6}>
              {environmentLeft.map((detail, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                  <Box sx={{ mt: 0.2 }}>{detail.icon}</Box>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#000',
                        fontSize: '10px',
                        fontFamily: 'Poppins',
                        mb: 0.3
                      }}
                    >
                      {detail.label}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1E1E1E',
                        fontSize: '11px',
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
                      {detail.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>

            {/* Right Column */}
            <Grid item xs={6}>
              {environmentRight.map((detail, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                  <Box sx={{ mt: 0.2 }}>{detail.icon}</Box>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#000',
                        fontSize: '10px',
                        fontFamily: 'Poppins',
                        mb: 0.3
                      }}
                    >
                      {detail.label}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1E1E1E',
                        fontSize: '11px',
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
                      {detail.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>
          </Grid>

          <Divider sx={{ my: 1.5 }} />

          {/* Yield & Quality Section */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: '12px',
              fontWeight: 600,
              color: '#3D550C',
              mb: 1.5,
              fontFamily: 'Poppins'
            }}
          >
            Yield & Quality
          </Typography>

          <Grid container spacing={1.5}>
            {/* Left Column */}
            <Grid item xs={6}>
              {yieldLeft.map((detail, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                  <Box sx={{ mt: 0.2 }}>{detail.icon}</Box>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#000',
                        fontSize: '10px',
                        fontFamily: 'Poppins',
                        mb: 0.3
                      }}
                    >
                      {detail.label}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1E1E1E',
                        fontSize: '11px',
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
                      {detail.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>

            {/* Right Column */}
            <Grid item xs={6}>
              {yieldRight.map((detail, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                  <Box sx={{ mt: 0.2 }}>{detail.icon}</Box>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#000',
                        fontSize: '10px',
                        fontFamily: 'Poppins',
                        mb: 0.3
                      }}
                    >
                      {detail.label}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1E1E1E',
                        fontSize: '11px',
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
                      {detail.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HarvestDetails;