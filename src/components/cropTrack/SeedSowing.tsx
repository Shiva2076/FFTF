import { FunctionComponent } from 'react';
import { Box, Card, CardContent, Typography, Grid, Stack } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SpaIcon from '@mui/icons-material/Spa';
import { CropData } from '@/constants/cropsData';

interface Props {
  data: CropData['milestones']['sowing'];
  displayDate: string;
}

const SeedSowing: FunctionComponent<Props> = ({ data, displayDate }) => {
  const details = [
    { icon: <CalendarTodayIcon sx={{ fontSize: 14, color: '#3D550C', mt: 0.2 }} />, label: 'Sowing Date:', value: displayDate },
    { icon: <SpaIcon sx={{ fontSize: 14, color: '#3D550C', mt: 0.2 }} />, label: 'Type of Seeds:', value: data.seedType },
    { icon: <AccessTimeIcon sx={{ fontSize: 14, color: '#3D550C', mt: 0.2 }} />, label: 'Sowing Time:', value: '10:00 AM' },
    { icon: <LocalOfferIcon sx={{ fontSize: 14, color: '#3D550C', mt: 0.2 }} />, label: 'Batch ID:', value: 'BHL-0726-AF04' },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ border: '1px solid #3D550C', borderRadius: '6px', boxShadow: 'none' }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 600, color: '#3D550C', mb: 1.5, fontFamily: 'Poppins' }}>
            Seed Sowing
          </Typography>
          <Grid container spacing={1.5}>
            <Grid item xs={7}>
              <Stack spacing={1.5}>
                {details.map((detail, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    {detail.icon}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#000', fontSize: '10px', fontFamily: 'Poppins', mb: 0.3 }}>
                        {detail.label}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1E1E1E', fontSize: '11px', fontFamily: 'Poppins', fontWeight: 400 }}>
                        {detail.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={5}>
              <Box component="img" src={data.image} alt="Seed Sowing" 
                sx={{ width: '100%', height: '100%', minHeight: '120px', maxHeight: '150px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e0e0e0' }} 
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SeedSowing;