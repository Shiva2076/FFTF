import { FunctionComponent, useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Button
} from '@mui/material';
import SeedSowing from '../../../../../components/qrcode/Lolloromaine/SeedSowing';
import PredictedTransplant from '../../../../../components/qrcode/Lolloromaine/PredictedTransplant';
import HarvestDetails from './HarvestDetails';

const KeyCropMilestones: FunctionComponent = () => {
  const [activeView, setActiveView] = useState<string | null>(null);

  const milestones = [
    {
      title: 'Seed Sowing',
      onClick: () => setActiveView('sowing')
    },
    {
      title: 'Transplant Date & Time',
      onClick: () => setActiveView('transplant')
    },
    {
      title: 'Harvest Details',
      onClick: () => setActiveView('harvest')
    },
  ];

  return (
    <Box sx={{ width: '98%', py: 2 }}>
      <Card 
        sx={{ 
          border: '1px solid #3D550C',
          borderRadius: '6px',
          boxShadow: 'none'
        }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          {/* Show buttons only when no view is active */}
          {!activeView && (
            <>
              {/* Description */}
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '11.5px',
                  color: '#1E1E1E',
                  mb: 2,
                  fontFamily: 'Poppins',
                  textAlign: 'center',
                  lineHeight: 1.5,
                  fontWeight: 400
                }}
              >
                Click the buttons below to instantly get the information you need.
              </Typography>

              {/* Milestones Grid */}
              <Grid container spacing={1.5}>
                {milestones.map((milestone, index) => (
                  <Grid item xs={4} key={index}>
                    <Button
                      onClick={milestone.onClick}
                      fullWidth
                      sx={{
                        border: '2px solid #3D550C',
                        borderRadius: '12px',
                        p: 1.5,
                        height: '50px',
                        backgroundColor: '#c4c9b5',
                        color: '#000',
                        textTransform: 'none',
                        fontFamily: 'Poppins',
                        fontSize: '12px',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          border: '2px solid #3D550C'
                        }
                      }}
                    >
                      {milestone.title}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {/* Conditional Rendering based on activeView */}
          {activeView && (
            <Box>
              {/* Close/Back Button */}
              <Button
                onClick={() => setActiveView(null)}
                sx={{
                  mb: 2,
                  fontSize: '10px',
                  fontFamily: 'Poppins',
                  color: '#3D550C',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(61, 85, 12, 0.05)'
                  }
                }}
              >
                ← Back to Menu
              </Button>

              {activeView === 'sowing' && <SeedSowing />}
              {activeView === 'transplant' && <PredictedTransplant />}
              {activeView === 'harvest' && <HarvestDetails />}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default KeyCropMilestones;