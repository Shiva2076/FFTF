// src/components/cropTrack/KeyCropMilestones.tsx

import { FunctionComponent, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button } from '@mui/material';
import SeedSowing from './SeedSowing';
import PredictedTransplant from './PredictedTransplant';
import HarvestDetails from './HarvestDetails';
import { CropData } from '@/constants/cropsData';

interface Props {
  data: CropData['milestones']; 
  envData: CropData['environment']; 
  qrHarvestDate?: string | null;
  qrSeedingDate?: string | null;
  qrTransplantDate?: string | null;
}

const KeyCropMilestones: FunctionComponent<Props> = ({ 
  data, 
  envData, 
  qrHarvestDate, 
  qrSeedingDate, 
  qrTransplantDate
}) => {
  const [activeView, setActiveView] = useState<string | null>(null);

  // ✅ ADD THIS FUNCTION - Converts YYYY-MM-DD to readable format
  const formatDisplayDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Date not provided';
    
    try {
      // Handle both YYYY-MM-DD and already formatted dates
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return as-is if already formatted or invalid
      }
      
      // Convert to readable format: "December 16, 2024"
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return dateString || 'Invalid date';
    }
  };

  // Convert dates to display format BEFORE using them
  const finalHarvestDate = formatDisplayDate(qrHarvestDate || data.harvest.defaultDate);
  const finalSeedingDate = formatDisplayDate(qrSeedingDate || data.sowing.defaultDate);
  const finalTransplantDate = formatDisplayDate(qrTransplantDate || data.transplant.defaultDate);

  // DEBUGGER: Uncomment to verify
  console.log("=== KEY CROP MILESTONES DEBUG ===");
  console.log("1. RAW Input Dates:");
  console.log("   - qrHarvestDate:", qrHarvestDate);
  console.log("   - qrSeedingDate:", qrSeedingDate);
  console.log("   - qrTransplantDate:", qrTransplantDate);
  
  console.log("2. FORMATTED Display Dates:");
  console.log("   - finalHarvestDate:", finalHarvestDate);
  console.log("   - finalSeedingDate:", finalSeedingDate);
  console.log("   - finalTransplantDate:", finalTransplantDate);
  console.log("=================================");

  const milestones = [
    { title: 'Seed Sowing', onClick: () => setActiveView('sowing') },
    { title: 'Transplant Date & Time', onClick: () => setActiveView('transplant') },
    { title: 'Harvest Details', onClick: () => setActiveView('harvest') },
  ];

  return (
    <Box sx={{ width: '98%', py: 2 }}>
      <Card sx={{ border: '1px solid #3D550C', borderRadius: '6px', boxShadow: 'none' }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          {!activeView && (
            <>
              <Typography variant="body2" sx={{ fontSize: '11.5px', color: '#1E1E1E', mb: 2, fontFamily: 'Poppins', textAlign: 'center', lineHeight: 1.5, fontWeight: 400 }}>
                Click the buttons below to instantly get the information you need.
              </Typography>
              <Grid container spacing={1.5}>
                {milestones.map((m, i) => (
                  <Grid item xs={4} key={i}>
                    <Button 
                      onClick={m.onClick} 
                      fullWidth 
                      sx={{ 
                        border: '2px solid #3D550C', borderRadius: '12px', p: 1.5, height: '50px',
                        backgroundColor: '#c4c9b5', color: '#000', textTransform: 'none',
                        fontFamily: 'Poppins', fontSize: '11px', fontWeight: 600,
                        '&:hover': { backgroundColor: '#f5f5f5', border: '2px solid #3D550C' }
                      }}
                    >
                      {m.title}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {activeView && (
            <Box>
              <Button 
                onClick={() => setActiveView(null)} 
                sx={{ 
                  mb: 2, fontSize: '10px', fontFamily: 'Poppins', color: '#3D550C',
                  textTransform: 'none', fontWeight: 500,
                  '&:hover': { backgroundColor: 'rgba(61, 85, 12, 0.05)' }
                }}
              >
                ← Back to Menu
              </Button>
              
              {activeView === 'sowing' && (
                <SeedSowing 
                  data={data.sowing} 
                  displayDate={finalSeedingDate} 
                />
              )}

              {activeView === 'transplant' && (
                <PredictedTransplant 
                  data={data.transplant} 
                  displayDate={finalTransplantDate}
                />
              )}
              
              {activeView === 'harvest' && (
                <HarvestDetails 
                  harvestData={data.harvest} 
                  envData={envData} 
                  displayDate={finalHarvestDate} 
                />
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default KeyCropMilestones;