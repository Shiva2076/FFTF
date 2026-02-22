'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import ErrorIcon from '@mui/icons-material/Error';

// IMPORT COMPONENTS
import ProductDescription from '@/components/cropTrack/ProductDescription';
import KeyCropMilestones from '@/components/cropTrack/KeyCropMilestones';
import LiveImpactSnapshot from '@/components/cropTrack/LiveImpactSnapshot';
import FarmInformation from '@/components/leafy-greens-overview/tabs/FarmInformation';

// IMPORT DATA
import { CROPS_DATA } from '@/constants/cropsData';

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
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

// CROP OPTIONS
const CROP_OPTIONS = [
  { value: 'romaine-lettuce', label: 'Romaine Lettuce' },
  { value: 'basil-italian', label: 'Basil Italian' },
  { value: 'lollo-bionda', label: 'Lollo Bionda' },
  { value: 'lollo-rosso', label: 'Lollo Rosso' },
];

// ERROR COMPONENT
function ErrorState({ message, cropName }: { message: string; cropName?: string }) {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <ErrorIcon sx={{ fontSize: 60, color: '#FF5722', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, color: '#3D550C', fontWeight: 600 }}>
            Unable to Load Crop Information
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            {message}
          </Typography>
          {cropName && (
            <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#999' }}>
              Crop: {cropName}
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

// LOADING COMPONENT
function LoadingState() {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <CircularProgress sx={{ color: '#3D550C' }} />
        <Typography sx={{ color: '#3D550C', fontFamily: 'Poppins' }}>
          Loading crop information...
        </Typography>
      </Stack>
    </Box>
  );
}

export default function DisplayDataPage() {
  const searchParams = useSearchParams();
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cropData, setCropData] = useState<any>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('romaine-lettuce');

  const [qrHarvest, setQrHarvest] = useState<string | null>(null);
  const [qrSeeding, setQrSeeding] = useState<string | null>(null);
  const [qrTransplant, setQrTransplant] = useState<string | null>(null);
  const [urlCrop, setUrlCrop] = useState<string | null>(null);

  // EFFECT: Decode URL parameters - prioritize localStorage (same device), fallback to URL params (cross-device)
  useEffect(() => {
    try {
      const shortId = searchParams?.get('id');
      
      // Strategy 1: Try localStorage first (works on same device - fast, clean)
      if (shortId && typeof window !== 'undefined') {
        const storedData = localStorage.getItem(`qr_${shortId}`);
        
        if (storedData) {
          const data = JSON.parse(storedData);
          
          // Set the decoded values (note: using short keys c, h, s, t)
          setUrlCrop(data.c || null);
          setQrHarvest(data.h || null);
          setQrSeeding(data.s || null);
          setQrTransplant(data.t || null);
          
          console.log('🔓 Data from localStorage (same device):', shortId, data);
          return; // Success, exit early
        }
      }
      
      // Strategy 2: Fallback to URL parameters (works across devices - phone, different browser, etc.)
      const urlCropParam = searchParams?.get('crop');
      const urlHarvestParam = searchParams?.get('harvest');
      const urlSeedingParam = searchParams?.get('seeded');
      const urlTransplantParam = searchParams?.get('transplant');
      
      if (urlCropParam || urlHarvestParam || urlSeedingParam || urlTransplantParam) {
        setUrlCrop(urlCropParam || null);
        setQrHarvest(urlHarvestParam || null);
        setQrSeeding(urlSeedingParam || null);
        setQrTransplant(urlTransplantParam || null);
        
        console.log('🔓 Data from URL parameters (cross-device):', {
          crop: urlCropParam,
          harvest: urlHarvestParam,
          seeded: urlSeedingParam,
          transplant: urlTransplantParam
        });
      } else if (shortId) {
        console.warn('⚠️ No data found in localStorage or URL params for ID:', shortId);
      }
    } catch (err) {
      console.error('Error decoding URL:', err);
      // Final fallback to direct params
      setUrlCrop(searchParams?.get('crop') || null);
      setQrHarvest(searchParams?.get('harvest') || null);
      setQrSeeding(searchParams?.get('seeded') || null);
      setQrTransplant(searchParams?.get('transplant') || null);
    }
  }, [searchParams]);

  // EFFECT: Load crop data
  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      const cropToLoad = urlCrop || selectedCrop;
      
      if (!cropToLoad) {
        setError('No crop specified.');
        setIsLoading(false);
        return;
      }

      const slug = cropToLoad.toLowerCase().replace(/\s+/g, '-');
      const data = CROPS_DATA[slug] || CROPS_DATA[cropToLoad] || null;

      if (!data) {
        console.warn(`Crop data not found for: ${cropToLoad}, ${slug}`);
        setCropData(CROPS_DATA['default'] || null);
        if (!CROPS_DATA['default']) {
          setError(`Crop "${cropToLoad}" not found in database.`);
        }
      } else {
        setCropData(data);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error loading crop data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load crop information');
      setIsLoading(false);
    }
  }, [selectedCrop, urlCrop]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCropChange = (event: any) => {
    setSelectedCrop(event.target.value);
    setValue(0);
  };

  // TABS CONFIGURATION
  const tabs = [
    {
      label: 'Product Description',
      component: cropData ? (
        <ProductDescription data={cropData.productDescription} />
      ) : (
        <Typography>No product information available</Typography>
      ),
    },
    {
      label: 'Crop Journey And Harvest Info',
      component: cropData ? (
        <KeyCropMilestones
          data={cropData.milestones}
          envData={cropData.environment}
          qrHarvestDate={qrHarvest}
          qrSeedingDate={qrSeeding}
          qrTransplantDate={qrTransplant}
        />
      ) : (
        <Typography>No milestone information available</Typography>
      ),
    },
    {
      label: 'Live Impact Snapshot',
      component: cropData ? (
        <LiveImpactSnapshot data={cropData.liveImpact} />
      ) : (
        <Typography>No impact data available</Typography>
      ),
    },
    {
      label: 'Farm Details And Certification',
      component: <FarmInformation />,
    },
  ];

  if (isLoading) {
    return <LoadingState />;
  }

  if (error && !cropData) {
    return <ErrorState message={error} cropName={selectedCrop || 'Unknown'} />;
  }

  // MAIN RENDER
  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: '#fff',
        overflowX: 'hidden',
        pb: 1,
      }}
    >
      {error && (
        <Alert severity="warning" sx={{ mx: 2, mt: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ borderRadius: 0, overflow: 'hidden', backgroundColor: '#fff' }}>
        <Box sx={{ p: 2 }}>
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
            {cropData?.name || 'Crop Information'}
          </Typography>

          <Box
            sx={{
              position: 'relative',
              width: '100%',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: 2,
              backgroundColor: '#f5f5f5',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {cropData?.heroImage ? (
              <Box
                component="img"
                src={cropData.heroImage}
                alt={cropData?.name || 'Crop'}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                sx={{
                  width: '100%',
                  height: '200px',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Typography sx={{ color: '#999', fontFamily: 'Poppins' }}>
                No image available
              </Typography>
            )}

            <Box
              component="img"
              src="/apps/fresh2/logo.png"
              alt="Fresh from the Future"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
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
                },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ borderColor: 'divider', px: 1, pt: 1 }}>
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
                  color: '#fff !important',
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

        {tabs.map((tab, index) => (
          <Box key={index} sx={{ px: 2 }}>
            <TabPanel value={value} index={index}>
              {tab.component}
            </TabPanel>
          </Box>
        ))}

        <Box sx={{ px: 2, py: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#3D550C',
              mb: 2,
              fontFamily: 'Poppins',
            }}
          >
            Contact Us
          </Typography>

          <Box
            sx={{
              backgroundColor: '#c4c9b5',
              borderRadius: '10px',
              p: 2,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Stack spacing={1.5} sx={{ flex: 1 }}>
              <Box component="a" href="tel:+919220309252" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}>
                <PhoneIcon sx={{ fontSize: 14, color: '#FF5722' }} />
                <Typography variant="body1" sx={{ fontSize: '9px', fontFamily: 'Poppins', color: '#000', fontWeight: 500 }}>
                  +91 9220309252 / +91 9220346184
                </Typography>
              </Box>

              <Box component="a" href="mailto:Business@INNOFarms.AI" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}>
                <EmailIcon sx={{ fontSize: 14, color: '#FF5722' }} />
                <Typography variant="body1" sx={{ fontSize: '10px', fontFamily: 'Poppins', color: '#000', fontWeight: 500 }}>
                  Business@INNOFarms.AI
                </Typography>
              </Box>

              <Box component="a" href="https://www.innofarms.ai" target="_blank" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}>
                <LanguageIcon sx={{ fontSize: 14, color: '#FF5722' }} />
                <Typography variant="body1" sx={{ fontSize: '10px', fontFamily: 'Poppins', color: '#000', fontWeight: 500 }}>
                  www.innofarms.ai
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexShrink: 0 }}>
              <Box component="a" href="https://www.linkedin.com/company/innofarms-ai/" target="_blank" sx={{ textAlign: 'center', textDecoration: 'none' }}>
                <Box sx={{ width: 40, height: 40, backgroundColor: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5, border: '2px solid #fff' }}>
                  <Box component="img" src="/apps/fresh/Linkedin.png" alt="LinkedIn" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Box>
                <Typography variant="body2" sx={{ fontSize: '10px', fontFamily: 'Poppins', color: '#000', fontWeight: 500 }}>LinkedIn</Typography>
              </Box>

              <Box component="a" href="https://www.instagram.com/p/DRCe3cGAbmU/" target="_blank" sx={{ textAlign: 'center', textDecoration: 'none' }}>
                <Box sx={{ width: 40, height: 40, backgroundColor: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5, border: '2px solid #fff' }}>
                  <Box component="img" src="/apps/fresh/Instagram.jpg" alt="Instagram" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Box>
                <Typography variant="body2" sx={{ fontSize: '10px', fontFamily: 'Poppins', color: '#000', fontWeight: 500 }}>Instagram</Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}