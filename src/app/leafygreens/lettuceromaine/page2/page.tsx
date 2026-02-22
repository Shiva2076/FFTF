"use client";
import { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Paper,
  Avatar,
  Typography,
  Stack,
} from '@mui/material';
import FarmInformation from '../../../../components/qrcode/Lolloromaine/FarmInformation';
import ProductDescription from '../../../../components/qrcode/Lolloromaine/ProductDescription';
import HarvestInformation from './tabs/HarvestDetails';
import KeyCropMilestones from './tabs/KeyCropMilestones';
import LiveImpactSnapshot from '../../../../components/qrcode/Lolloromaine/LiveImpactSnapshot';
// import CertificationAndImpact from './tabs/CertificationAndImpact';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const ProductInfoPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = [
    { label: 'Product Description', component: <ProductDescription /> },
    { label: 'Crop journey and Harvest Info', component: <KeyCropMilestones /> },
    { label: 'Live Impact Snapshot', component: <LiveImpactSnapshot /> },
    { label: 'Farm Details And Certifications', component: <FarmInformation /> },
    // { label: 'Harvest Information', component: <HarvestInformation /> },

    // { label: 'Certification And Impact', component: <CertificationAndImpact /> },
  ];

  return (
    <Box sx={{ 
      width: '100vw',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      backgroundColor: '#fff'
    }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        <Box
          sx={{
            p: 2,
            // background: 'linear-gradient(135deg, rgba(61, 85, 12, 0.05) 0%, rgba(61, 85, 12, 0.1) 100%)',
          }}
        >
          {/* Crop Title */}
          <Typography
            variant="h4"
            sx={{
              fontSize: '18px',
              fontWeight: 600,
              textAlign: 'center',
              color: '#3D550C',
              fontFamily: 'Poppins',
              mb: 1.5,
            }}
          >
            Romaine Lettuce
          </Typography>

          {/* Crop Image with Brand Overlay */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: 2,
            }}
          >
            {/* Background Lettuce Image */}
            <Box
  component="img"
  src="fresh/Rectangle_leafy.png"
  alt="Romaine Lettuce Background"
  sx={{
    width: '100%',
    height: '200px', 
    display: 'block',
    objectFit: 'cover', 
  }}
/>
            
            {/* Fresh from the Future Brand Image Overlay */}
            <Box
              component="img"
              src="fresh2/logo.png"
              alt="Fresh from the Future"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60%',
                maxWidth: '400px',
                height: 'auto',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translate(-50%, -50%) scale(1.05)',
                }
              }}
            />
          </Box>
        </Box>
    
        {/* Tabs Navigation */}
        <Box sx={{  borderColor: 'divider', px: 1, pt: 1 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: '36px',
              '& .MuiTab-root': {
                color: '#1E1E1E',
                borderRadius: '6px',
                border: '1px solid #3D550C',
                margin: '0 3px',
                minHeight: '30px',
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'none',
                fontFamily: 'Poppins',
                transition: 'all 0.3s ease',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: '#3D550C',
                  borderColor: '#3D550C',
                },
              },
              '& .Mui-selected': {
                backgroundColor: '#3D550C',
                color: '#fff !important',
                borderColor: '#3D550C',
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {/* Tab Panels */}
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={value} index={index}>
            {tab.component}
          </TabPanel>
        ))}
        
        {/* Contact Section */}
        <Box sx={{ px: 2, py: 3 }}>
          {/* Contact Us Heading */}
          <Typography 
            variant="h4" 
            sx={{ 
              fontSize: '18px',
              fontWeight: 700,
              color: '#3D550C',
              mb: 2,
              fontFamily: 'Poppins'
            }}
          >
            Contact Us
          </Typography>

          {/* Contact Information Box */}
          <Box
            sx={{
              backgroundColor: '#c4c9b5',
              borderRadius: '10px',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {/* Left Side - Contact Details */}
            <Stack spacing={1.5} sx={{ flex: 1 }}>
              {/* Phone */}
              <Box 
                component="a"
                href="tel:+919220309252"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <PhoneIcon sx={{ fontSize: 14, color: '#FF5722' }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: '9px',
                    fontFamily: 'Poppins',
                    color: '#000',
                    fontWeight: 500
                  }}
                >
                  +91 9220309252 / +91 9220346184
                </Typography>
              </Box>

              {/* Email */}
              <Box 
                component="a"
                href="mailto:Business@INNOFarms.AI"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <EmailIcon sx={{ fontSize: 14, color: '#FF5722' }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: '10px',
                    fontFamily: 'Poppins',
                    color: '#000',
                    fontWeight: 500
                  }}
                >
                  Business@INNOFarms.AI
                </Typography>
              </Box>

              {/* Website */}
              <Box 
                component="a"
                href="https://www.innofarms.ai"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <LanguageIcon sx={{ fontSize: 14, color: '#FF5722' }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: '10px',
                    fontFamily: 'Poppins',
                    color: '#000',
                    fontWeight: 500
                  }}
                >
                  www.innofarms.ai
                </Typography>
              </Box>
            </Stack>

            {/* Right Side - QR Codes */}
            <Stack 
              direction="row" 
              spacing={2}
              sx={{ 
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              {/* LinkedIn QR */}
              <Box 
                component="a"
                href="https://www.linkedin.com/company/innofarms-ai/?originalSubdomain=in"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  textAlign: 'center',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#fff',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 0.5,
                    overflow: 'hidden',
                    border: '2px solid #fff'
                  }}
                >
                  <Box
                    component="img"
                    src="fresh/Linkedin.png"
                    alt="LinkedIn QR"
                    sx={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '10px',
                    fontFamily: 'Poppins',
                    color: '#000',
                    fontWeight: 500
                  }}
                >
                  LinkedIn
                </Typography>
              </Box>

              {/* Instagram QR */}
              <Box 
                component="a"
                href="https://www.instagram.com/p/DRCe3cGAbmU/?utm_source=ig_web_copy_link"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  textAlign: 'center',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#fff',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 0.5,
                    overflow: 'hidden',
                    border: '2px solid #fff'
                  }}
                >
                  <Box
                    component="img"
                    src="fresh/Instagram.jpg"
                    alt="Instagram QR"
                    sx={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '10px',
                    fontFamily: 'Poppins',
                    color: '#000',
                    fontWeight: 500
                  }}
                >
                  Instagram
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProductInfoPage;