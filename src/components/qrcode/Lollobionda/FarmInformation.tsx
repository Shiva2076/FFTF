import { FunctionComponent } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BugReportIcon from '@mui/icons-material/BugReport';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const FarmInformation: FunctionComponent = () => {
  const farmDetails = [
    { label: 'Farm Name:', value: 'INNOFarms.AI- Singapore & UAE Model Farm' },
    { label: 'Location:', value: 'Udyog Vihar, Sector 23, Gurugram' },
    { label: 'Farm Type:', value: 'Indoor AI-powered vertical farm' },
    { label: 'Started In:', value: '2024' },
    { label: 'Farm Size:', value: '62 m² growing area (One GrowZone)' },
  ];

  const certifications = [
    
   
    {
      icon: <BugReportIcon sx={{ fontSize: 16, color: '#3D550C' }} />,
      title: 'Pesticide-Free Verified',
      description: '100% pesticide-free produce guaranteed'
    },
    
    {
      icon: <RestaurantIcon sx={{ fontSize: 16, color: '#3D550C' }} />,
      title: 'Food Safety and Standards Authority of India (FSSAI) Certified',
      description: 'Compliant with global food safety regulations'
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
          {/* Farm Details Section */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: '12px',
              fontWeight: 600,
              color: '#000',
              mb: 1.5,
              fontFamily: 'Poppins'
            }}
          >
            Farm Details
          </Typography>

          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {/* Farm Details - Left Side */}
            <Grid item xs={7}>
              <Stack spacing={1.2}>
                {farmDetails.map((detail, index) => (
                  <Box key={index}>
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
                         fontWeight: 400,
                        fontFamily: 'Poppins',
                        lineHeight: 1.5
                      }}
                    >
                      {detail.value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            
            {/* Farm Photo - Right Side */}
            <Grid item xs={5}>
              <Box
                component="img"
                src="fresh/Labs.png"
                alt="Farm Photo"
                sx={{
                  width: '100%',
                  height: '100%',
                  maxHeight: '120px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '1px solid #e0e0e0'
                }}
              />
            </Grid>
          </Grid>

          {/* Certification Section */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: '12px',
              fontWeight: 600,
              color: '#3D550C',
              mb: 1.5,
              fontFamily: 'Poppins',
              mt: 2,
              textTransform: 'uppercase'
            }}
          >
            CERTIFICATION
          </Typography>

          {/* Certification List */}
          <List sx={{ width: '100%', p: 0 }}>
            {certifications.map((cert, index) => (
              <ListItem
                key={index}
                sx={{
                  mb: 1,
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  p: 1.5,
                  '&:last-child': {
                    mb: 0
                  }
                }}
              >
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar
                    sx={{
                      backgroundColor: 'rgba(61, 85, 12, 0.1)',
                      width: 32,
                      height: 32
                    }}
                  >
                    {cert.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#1E1E1E',
                        fontFamily: 'Poppins'
                      }}
                    >
                      {cert.title}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '10px',
                        color: '#666',
                        fontFamily: 'Poppins',
                        display: 'block',
                        mt: 0.3,
                        lineHeight: 1.5,
                        fontWeight: 400
                      }}
                    >
                      {cert.description}
                    </Typography>
                  }
                />
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: 12, color: '#fff' }} />}
                  label="Verified"
                  size="small"
                  sx={{
                    backgroundColor: '#3D550C',
                    color: '#fff',
                    fontSize: '9px',
                    height: '22px',
                    fontWeight: 600,
                    ml: 1,
                    fontFamily: 'Poppins',
                    '& .MuiChip-icon': {
                      color: '#fff'
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FarmInformation;