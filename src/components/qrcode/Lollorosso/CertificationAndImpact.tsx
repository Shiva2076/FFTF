import { FunctionComponent } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Paper,
  Stack,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BugReportIcon from '@mui/icons-material/BugReport';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const CertificationAndImpact: FunctionComponent = () => {
  const certifications = [
    {
      icon: <VerifiedIcon sx={{ fontSize: 16, color: '#3D550C' }} />,
      title: 'HACCP Certified',
      description: 'Hazard Analysis and Critical Control Points certification ensures food safety'
    },
    {
      icon: <ThumbUpIcon sx={{ fontSize: 16, color: '#3D550C' }} />,
      title: 'GAP (Good Agricultural Practices)',
      description: 'Certified sustainable and responsible farming practices'
    },
    {
      icon: <BugReportIcon sx={{ fontSize: 16, color: '#3D550C' }} />,
      title: 'Pesticide-Free Verified',
      description: '100% pesticide-free produce guaranteed'
    },
    {
      icon: <LocalFloristIcon sx={{ fontSize: 16, color: '#3D550C' }} />,
      title: 'Organic Certified',
      description: 'Meets international organic farming standards'
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 16, color: '#3D550C' }} />,
      title: 'Food Safety Certified',
      description: 'Compliant with global food safety regulations'
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
          {/* Header */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: '12px',
              fontWeight: 600,
              color: '#3D550C',
              mb: 2,
              fontFamily: 'Poppins',
              textTransform: 'uppercase'
            }}
          >
            <WorkspacePremiumIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
            Certification
          </Typography>

          {/* Certification List */}
          <List sx={{ width: '100%', p: 0, mb: 2 }}>
            {certifications.map((cert, index) => (
              <ListItem
                key={index}
                sx={{
                  mb: 1,
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  backgroundColor: '#fff',
                  p: 1
                }}
              >
                <ListItemAvatar sx={{ minWidth: 35 }}>
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
                        fontSize: '8px',
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
                        fontSize: '7px',
                        color: '#666',
                        fontFamily: 'Poppins',
                        display: 'block',
                        mt: 0.3,
                        lineHeight: 1.3
                      }}
                    >
                      {cert.description}
                    </Typography>
                  }
                />
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: 10 }} />}
                  label="Verified"
                  size="small"
                  sx={{
                    backgroundColor: '#3D550C',
                    color: '#fff',
                    fontSize: '6px',
                    height: '18px',
                    fontWeight: 600,
                    ml: 1
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Certification Badges Display */}
          <Paper
            elevation={2}
            sx={{
              background: 'linear-gradient(135deg, rgba(61, 85, 12, 0.05) 0%, rgba(61, 85, 12, 0.1) 100%)',
              borderRadius: '10px',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              border: '2px dashed #3D550C',
              mb: 2
            }}
          >
            <Stack spacing={1.5} alignItems="center">
              <WorkspacePremiumIcon 
                sx={{ 
                  fontSize: 50, 
                  color: '#3D550C',
                  mb: 1
                }} 
              />
              
              <Typography
                variant="h6"
                sx={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#3D550C',
                  textAlign: 'center',
                  fontFamily: 'Poppins',
                  mb: 0.5
                }}
              >
                Certified Excellence
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontSize: '7px',
                  color: '#666',
                  textAlign: 'center',
                  fontFamily: 'Poppins',
                  mb: 1.5,
                  lineHeight: 1.4
                }}
              >
                Our produce meets the highest international standards for quality, safety, and sustainability
              </Typography>

              {/* Badge Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 1,
                  mt: 1
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((badge) => (
                  <Box
                    key={badge}
                    sx={{
                      width: 35,
                      height: 35,
                      backgroundColor: '#fff',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #3D550C',
                      boxShadow: 1
                    }}
                  >
                    <VerifiedIcon sx={{ fontSize: 20, color: '#3D550C' }} />
                  </Box>
                ))}
              </Box>

              {/* Trust Badge */}
              <Box
                sx={{
                  mt: 2,
                  p: 1.2,
                  backgroundColor: '#3D550C',
                  borderRadius: '6px',
                  width: '100%'
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '7px',
                    color: '#fff',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    textAlign: 'center',
                    display: 'block'
                  }}
                >
                  ✓ Trusted by Leading Retailers Worldwide
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Additional Info Section */}
          <Box 
            sx={{ 
              p: 1.5, 
              backgroundColor: 'rgba(61, 85, 12, 0.05)',
              borderRadius: '6px',
              borderLeft: '3px solid #3D550C'
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '7px',
                color: '#3D550C',
                fontFamily: 'Poppins',
                fontWeight: 600,
                mb: 0.5
              }}
            >
              Why Certifications Matter
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '7px',
                color: '#666',
                fontFamily: 'Poppins',
                display: 'block',
                lineHeight: 1.4
              }}
            >
              Our certifications guarantee that every step of our farming process meets rigorous international standards. 
              From seed to harvest, we ensure the highest quality, safety, and environmental responsibility.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CertificationAndImpact;