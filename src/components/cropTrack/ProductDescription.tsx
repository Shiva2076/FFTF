import { FunctionComponent } from 'react';
import { 
  Box, Card, CardContent, Typography, Grid, Chip, Divider, Stack 
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TimerIcon from '@mui/icons-material/Timer';
import OpacityIcon from '@mui/icons-material/Opacity';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GrassIcon from '@mui/icons-material/Grass';
import { CropData } from '@/constants/cropsData';

interface Props {
  data: CropData['productDescription'];
}

const ProductDescription: FunctionComponent<Props> = ({ data }) => {
  const getNutrientIcon = (name: string) => {
    if (name.includes('Calor')) return <LocalFireDepartmentIcon sx={{ fontSize: 12 }} />;
    if (name.includes('Protein')) return <FitnessCenterIcon sx={{ fontSize: 12 }} />;
    return <GrassIcon sx={{ fontSize: 12 }} />;
  };

  const productDetails = [
    { icon: <InventoryIcon sx={{ fontSize: 14, color: '#3D550C' }} />, label: 'Product Type', value: data.type },
    { icon: <LocalOfferIcon sx={{ fontSize: 14, color: '#3D550C' }} />, label: 'Weight', value: data.weight },
    { icon: <RestaurantIcon sx={{ fontSize: 14, color: '#3D550C' }} />, label: 'Shelf Life', value: data.shelfLife },
    { icon: <TimerIcon sx={{ fontSize: 14, color: '#3D550C' }} />, label: 'Best Before', value: data.bestBefore },
  ];

  return (
    <Box sx={{ width: '98%', py: 2 }}>
      <Card sx={{ border: '1px solid #3D550C', borderRadius: '6px', boxShadow: 'none' }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          {/* Header */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontSize: '16px', fontWeight: 600, color: '#3D550C', mb: 0.5, fontFamily: 'Poppins' 
                  }}
                >
                  {data.type.split(' - ')[1] || data.type}
                </Typography>
              </Box>
            </Stack>

            {/* Chips */}
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mt: 1.5 }}>
              {data.features.map((feature, index) => (
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
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Details & Image Grid */}
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid item xs={7}>
              <Grid container spacing={1.5}>
                {productDetails.map((detail, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      {detail.icon}
                      <Box>
                        <Typography variant="caption" sx={{ fontSize: '10px', color: '#666', fontFamily: 'Poppins', display: 'block' }}>
                          {detail.label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 600, color: '#1E1E1E', fontFamily: 'Poppins' }}>
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
                  width: '100%', height: '100%', minHeight: '120px', borderRadius: '8px',
                  overflow: 'hidden', border: '1px solid #e0e0e0', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5'
                }}
              >
                {data.image && (
                  <img src={data.image} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 1.5 }} />

          {/* Description */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 600, color: '#3D550C', mb: 0.8, fontFamily: 'Poppins' }}>
              About This Product
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '11.5px', color: '#1E1E1E', lineHeight: 1.5, fontFamily: 'Poppins', fontWeight: 400 }}>
              {data.description}
            </Typography>
          </Box>

          {/* Nutritional Info */}
          <Box>
            <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 600, color: '#3D550C', mb: 1.5, fontFamily: 'Poppins' }}>
              Nutritional Information
            </Typography>
            <Grid container spacing={0.8}>
              {data.nutritionalInfo.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Box sx={{ px: 0.8, py: 0.5, border: '1px solid #3D550C', borderRadius: '6px', backgroundColor: '#d7dbce', height: '28px', display: 'flex', alignItems: 'center', gap: 0.6 }}>
                    <Box sx={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#3D550C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
                      {getNutrientIcon(item.nutrient)}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" sx={{ fontSize: '8px', color: '#3D550C', fontFamily: 'Poppins', fontWeight: 500, lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.nutrient}: {item.value} per {item.per}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Storage Tips */}
          <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'rgba(249, 79, 11, 0.05)', borderRadius: '6px', borderLeft: '3px solid #FF5722' }}>
            <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.8 }}>
              <OpacityIcon sx={{ fontSize: 18, color: '#3D550C' }} />
              <Typography variant="body2" sx={{ fontSize: '12px', color: 'black', fontFamily: 'Poppins', fontWeight: 600 }}>
                Storage Tips
              </Typography>
            </Stack>
            {data.storageTips.map((tip, i) => (
              <Typography key={i} variant="caption" sx={{ fontSize: '10px', color: '#666', fontFamily: 'Poppins', display: 'block', lineHeight: 1.5 }}>
                • {tip}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDescription;