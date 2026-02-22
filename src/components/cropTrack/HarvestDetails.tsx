import { FunctionComponent } from 'react';
import { Box, Card, CardContent, Typography, Grid, Divider } from '@mui/material';
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
import { CropData } from '@/constants/cropsData';

interface Props {
  harvestData: CropData['milestones']['harvest'];
  envData: CropData['environment'];
  displayDate: string;
}

const HarvestDetails: FunctionComponent<Props> = ({ harvestData, envData, displayDate }) => {
  
  const renderItem = (icon: React.ReactNode, label: string, value: string) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
      <Box sx={{ mt: 0.2 }}>{icon}</Box>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#000', fontSize: '10px', fontFamily: 'Poppins', mb: 0.3 }}>
            {label}
        </Typography>
        <Typography variant="body2" sx={{ color: '#1E1E1E', fontSize: '11px', fontFamily: 'Poppins', fontWeight: 400, lineHeight: 1.5 }}>
            {value || 'N/A'}
        </Typography>
      </Box>
    </Box>
  );

  // Check if headSize exists to determine layout
  const hasHeadSize = !!harvestData.headSize;

  // LAYOUT FOR CROPS WITHOUT headSize (Basil) - 2 Columns
  const twoColumnYieldLeft = [
    {
      icon: <ScaleIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Total Boxes for the batch:',
      value: harvestData.yieldBoxes
    }
  ];

  const twoColumnYieldRight = [
    {
      icon: <BugReportIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Pesticide Use:',
      value: harvestData.pesticide
    }
  ];

  // LAYOUT FOR CROPS WITH headSize (Lettuces) - 4 Columns
  const fourColumnYieldLeft = [
    {
      icon: <ScaleIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Total Yield This Batch:',
      value: harvestData.yieldBoxes
    },
    {
      icon: <StraightenIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Average Head Size:',
      value: harvestData.headSize || ''
    }
  ];

  const fourColumnYieldRight = [
    {
      icon: <BugReportIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Pesticide Use:',
      value: harvestData.pesticide
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Packaging Time:',
      value: 'Within 2 hours of harvest to preserve freshness'
    }
  ];

  // Select layout based on headSize presence
  const yieldLeft = hasHeadSize ? fourColumnYieldLeft : twoColumnYieldLeft;
  const yieldRight = hasHeadSize ? fourColumnYieldRight : twoColumnYieldRight;

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ border: '1px solid #3D550C', borderRadius: '6px', boxShadow: 'none' }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          
          {/* --- SECTION 1: HARVEST INFO --- */}
          <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 600, color: '#3D550C', mb: 1.5, fontFamily: 'Poppins' }}>
            Harvest Details
          </Typography>
          <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
            <Grid item xs={6}>
              {renderItem(<CalendarTodayIcon sx={{ fontSize: 14, color: '#3D550C' }} />, 'Harvest Date:', displayDate)}
              {renderItem(<TimerIcon sx={{ fontSize: 14, color: '#3D550C' }} />, 'Growth Duration:', harvestData.duration)}
            </Grid>
            <Grid item xs={6}>
              {renderItem(<LocalOfferIcon sx={{ fontSize: 14, color: '#3D550C' }} />, 'Harvest Batch ID:', harvestData.batchId)}
              {renderItem(<PanToolIcon sx={{ fontSize: 14, color: '#3D550C' }} />, 'Harvest Method:', harvestData.method)}
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 1.5 }} />
          
          {/* --- SECTION 2: ENVIRONMENT --- */}
          <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 600, color: '#3D550C', mb: 1.5, fontFamily: 'Poppins' }}>
            Farm Environment
          </Typography>
          <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
            <Grid item xs={6}>
              {renderItem(<ThermostatIcon sx={{ fontSize: 14, color: '#3D550C' }} />, 'Temperature:', envData.temp)}
              {renderItem(<WaterDropIcon sx={{ fontSize: 14, color: '#3D550C' }} />, 'Humidity:', envData.humidity)}
            </Grid>
            <Grid item xs={6}>
              {renderItem(<WbSunnyIcon sx={{ fontSize: 14, color: '#3D550C' }} />, 'Lighting:', envData.lighting)}
              {renderItem(<NatureIcon sx={{ fontSize: 14, color: '#3D550C' }} />, 'Nutrient Delivery:', envData.nutrients)}
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 1.5 }} />
          
          {/* --- SECTION 3: YIELD & QUALITY (Auto 2 or 4 columns) --- */}
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