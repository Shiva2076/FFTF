import { FunctionComponent } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Chip,
  Divider,
  Stack,
  Rating
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TimerIcon from '@mui/icons-material/Timer';
import OpacityIcon from '@mui/icons-material/Opacity';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GrassIcon from '@mui/icons-material/Grass';

const ProductDescription: FunctionComponent = () => {
  const productDetails = [
    {
      icon: <InventoryIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Product Type',
      value: 'Fresh Romaine Lettuce'
    },
    {
      icon: <LocalOfferIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Weight',
      value: '150-180g per head'
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Shelf Life',
      value: '7-10 days (refrigerated)'
    },
    {
      icon: <TimerIcon sx={{ fontSize: 14, color: '#3D550C' }} />,
      label: 'Best Before',
      value: '10 days from the date of harvest'
    },
  ];

  const nutritionalInfo = [
    { nutrient: 'Calories', value: '17 kcal', per: '100g', icon: <LocalFireDepartmentIcon sx={{ fontSize: 12 }} /> },
    { nutrient: 'Protein', value: '1.2g', per: '100g', icon: <FitnessCenterIcon sx={{ fontSize: 12 }} /> },
    { nutrient: 'Fiber', value: '2.1g', per: '100g', icon: <GrassIcon sx={{ fontSize: 12 }} /> },
    { nutrient: 'Vitamin A', value: '174% DV', per: '100g', icon: <GrassIcon sx={{ fontSize: 12 }} /> },
    { nutrient: 'Vitamin K', value: '85% DV', per: '100g', icon: <GrassIcon sx={{ fontSize: 12 }} /> },
    { nutrient: 'Folate', value: '34% DV', per: '100g', icon: <GrassIcon sx={{ fontSize: 12 }} /> },
  ];

  const features = [
    '100% Pesticide-Free',
    'Hydroponically Grown',
    'AI-Monitored Growth',
    'Climate Controlled',
    'Non-GMO',
    'Crisp & Fresh'
  ];

  return (
    <Box sx={{ width: '98%', py:2 }}>
      <Card 
        sx={{ 
          border: '1px solid #3D550C',
          borderRadius: '6px',
          boxShadow: 'none'
        }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          {/* Product Header */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#3D550C',
                    mb: 0.5,
                    fontFamily: 'Poppins'
                  }}
                >
                  Romaine Lettuce
                </Typography>
                
               
              </Box>

             </Stack>

            {/* Feature Chips */}
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mt: 1.5 }}>
              {features.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(61, 85, 12, 0.1)',
                    color: '#3D550C',
                    fontSize: '9px',
                    height: '18px',
                    fontWeight: 600,
                    fontFamily: 'Poppins',
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Product Details Grid with Image */}
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid item xs={7}>
              <Grid container spacing={1.5}>
                {productDetails.map((detail, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      {detail.icon}
                      <Box>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontSize: '10px',
                            color: '#666',
                            fontFamily: 'Poppins',
                            display: 'block'
                          }}
                        >
                          {detail.label}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#1E1E1E',
                            fontFamily: 'Poppins'
                          }}
                        >
                          {detail.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            
            <Grid item xs={5}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: '120px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5'
                }}
              >
                {/* Replace with your actual image */}
                <img 
                  src="fresh2/Rectangle 46.png" 
                  alt="Romaine Lettuce"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 1.5 }} />

          {/* Product Description */}
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: '12px',
                fontWeight: 600,
                color: '#3D550C',
                mb: 0.8,
                fontFamily: 'Poppins',
                }}
            >
              About This Product
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '11.5px',
                color: '#1E1E1E',
                lineHeight: 1.5,
                fontFamily: 'Poppins',
                fontWeight: 400
              }}
            >
              Our Romaine Lettuce is grown in a state-of-the-art AI-powered vertical farm, ensuring 
              optimal growing conditions 24/7. Each head is carefully monitored from seed to harvest, 
              resulting in crisp, fresh lettuce with superior taste and nutritional value. Perfect for 
              salads, sandwiches, and wraps.
            </Typography>
          </Box>

          {/* Nutritional Information */}
          <Box>
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
              Nutritional Information
            </Typography>
            
            <Grid container spacing={0.8}>
              {nutritionalInfo.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Box
                    sx={{
                      px: 0.8,
                      py: 0.5,
                      border: '1px solid #3D550C',
                      borderRadius: '6px',
                      backgroundColor: '#d7dbce',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.6
                    }}
                  >
                    <Box
                      sx={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#3D550C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: '#fff'
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: '8px',
                          color: '#3D550C',
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.nutrient}: {item.value} per {item.per}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Storage Tips */}
          <Box 
            sx={{ 
              mt: 2, 
              p: 1.5, 
              backgroundColor: 'rgba(249, 79, 11, 0.05)',
              borderRadius: '6px',
              borderLeft: '3px solid #FF5722'
            }}
          >
            <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.8 }}>
              <OpacityIcon sx={{ fontSize: 18, color: '#3D550C' }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '12px',
                  color: 'black',
                  fontFamily: 'Poppins',
                  fontWeight: 600
                }}
              >
                Storage Tips
              </Typography>
            </Stack>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '10px',
                color: '#666',
                fontFamily: 'Poppins',
                display: 'block',
                lineHeight: 1.5
              }}
            >
              • Store in refrigerator at 2-4°C<br/>
              • Keep in original packaging or wrap in damp paper towel<br/>
              • Wash just before consumption<br/>
              • Best consumed within 7-10 days of purchase
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDescription;