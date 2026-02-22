import { FunctionComponent } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Divider,
  Chip
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

const HarvestInformation: FunctionComponent = () => {
  const harvestDetails = [
    {
      icon: <CalendarTodayIcon sx={{ fontSize: 12, color: '#3D550C' }} />,
      label: 'Harvest Date:',
      value: 'August 25, 2025'
    },
    {
      icon: <TimerIcon sx={{ fontSize: 12, color: '#3D550C' }} />,
      label: 'Growth Duration:',
      value: '60 days from germination to harvest'
    },
    {
      icon: <LocalOfferIcon sx={{ fontSize: 12, color: '#3D550C' }} />,
      label: 'Harvest Batch ID:',
      value: 'BHL-0725-AF04'
    },
    {
      icon: <PanToolIcon sx={{ fontSize: 12, color: '#3D550C' }} />,
      label: 'Harvest Method:',
      value: 'Hand-picked and quality-checked under AI-guided lighting'
    },
  ];

  const environmentDetails = [
    {
      label: 'Temperature:',
      value: '20–22°C (maintained 24/7)',
      icon: <ThermostatIcon sx={{ fontSize: 12, color: '#3D550C' }} />
    },
    {
      label: 'Humidity:',
      value: '55–65% RH',
      icon: <WaterDropIcon sx={{ fontSize: 12, color: '#3D550C' }} />
    },
    {
      label: 'Lighting:',
      value: 'Full-spectrum LED, 14 hours/day',
      icon: <WbSunnyIcon sx={{ fontSize: 12, color: '#3D550C' }} />
    },
    {
      label: 'Nutrient Delivery:',
      value: 'Automated hydroponic flow with AI-adjusted EC and pH levels',
      icon: <WaterDropIcon sx={{ fontSize: 12, color: '#3D550C' }} />
    },
  ];

  const yieldDetails = [
    {
      icon: <ScaleIcon sx={{ fontSize: 12, color: '#3D550C' }} />,
      label: 'Total Yield This Batch:',
      value: '120 kg'
    },
    {
      icon: <StraightenIcon sx={{ fontSize: 12, color: '#3D550C' }} />,
      label: 'Average Head Size:',
      value: '150–180g per head'
    },
    {
      icon: <BugReportIcon sx={{ fontSize: 12, color: '#3D550C' }} />,
      label: 'Pesticide Use:',
      value: 'None',
      highlight: true
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 12, color: '#3D550C' }} />,
      label: 'Packaging Time:',
      value: 'Within 2 hours of harvest to preserve freshness'
    },
  ];

  return (
    <Box sx={{ width: '98%' }}>
      <Card 
        sx={{ 
          border: '1px solid #3D550C',
          borderRadius: '6px',
          boxShadow: 'none'
        }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          {/* Basic Harvest Information */}
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

          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {harvestDetails.map((detail, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    minWidth: '14px',
                    pt: 0.2 
                  }}>
                    {detail.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#000',
                        fontSize: '8px',
                        fontFamily: 'Poppins',
                        mb: 0.3,
                        lineHeight: 1.4
                      }}
                    >
                      {detail.label}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1E1E1E',
                        fontSize: '8px',
                        fontFamily: 'Poppins',
                        lineHeight: 1.4
                      }}
                    >
                      {detail.value}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 1.5 }} />

          {/* Farm Environment */}
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

          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {environmentDetails.map((detail, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    minWidth: '14px',
                    pt: 0.2 
                  }}>
                    {detail.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#000',
                        fontSize: '8px',
                        fontFamily: 'Poppins',
                        mb: 0.3,
                        lineHeight: 1.4
                      }}
                    >
                      {detail.label}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1E1E1E',
                        fontSize: '8px',
                        fontFamily: 'Poppins',
                        lineHeight: 1.4
                      }}
                    >
                      {detail.value}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 1.5 }} />

          {/* Yield & Quality Information */}
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
            {yieldDetails.map((detail, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    minWidth: '14px',
                    pt: 0.2 
                  }}>
                    {detail.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#000',
                        fontSize: '8px',
                        fontFamily: 'Poppins',
                        mb: 0.3,
                        lineHeight: 1.4
                      }}
                    >
                      {detail.label}
                    </Typography>
                    {detail.highlight ? (
                      <Chip 
                        label={detail.value}
                        size="small"
                        sx={{ 
                          backgroundColor: '#3D550C',
                          color: '#fff',
                          fontSize: '7px',
                          height: '16px',
                          fontFamily: 'Poppins',
                          fontWeight: 600
                        }}
                      />
                    ) : (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#1E1E1E',
                          fontSize: '8px',
                          fontFamily: 'Poppins',
                          lineHeight: 1.4
                        }}
                      >
                        {detail.value}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HarvestInformation;