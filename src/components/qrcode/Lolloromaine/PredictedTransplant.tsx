import { FunctionComponent } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Stack
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const PredictedTransplant: FunctionComponent = () => {
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
            Predicted Transplant
          </Typography>

          <Grid container spacing={1.5}>
            {/* Left Side - Details */}
            <Grid item xs={7}>
              <Stack spacing={1.5}>
                {/* Predicted Transplant Date */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: 14, color: '#3D550C', mt: 0.2 }} />
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
                      Predicted Transplant Date:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1E1E1E',
                        fontSize: '11px',
                        fontFamily: 'Poppins',
                        fontWeight: 400
                      }}
                    >
                      November 08, 2025
                    </Typography>
                  </Box>
                </Box>

                {/* Predicted Transplant Time */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <AccessTimeIcon sx={{ fontSize: 14, color: '#3D550C', mt: 0.2 }} />
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
                      Predicted Transplant Time:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1E1E1E',
                        fontSize: '11px',
                        fontFamily: 'Poppins',
                        fontWeight: 400
                      }}
                    >
                      10:00 AM
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* Right Side - Image */}
            <Grid item xs={5}>
              <Box
                component="img"
                src="fresh2/Gemini_Generated_Image_pzp2d4pzp2d4pzp2.png"
                alt="Predicted Transplant"
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: '120px',
                  maxHeight: '150px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '1px solid #e0e0e0'
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PredictedTransplant;