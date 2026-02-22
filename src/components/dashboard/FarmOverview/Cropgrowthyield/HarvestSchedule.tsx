'use client';

import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import Image from 'next/image';
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';

type HarvestApiItem = {
  cycleId: number;
  daysLeft: number;
  totalDays: number;
  daysDone: number;
  expectedHarvestDate:string;
};

interface HarvestScheduleProps {
  harvestSchedule: HarvestApiItem[];
  onCropCycleClick?: (cycleId: number) => void;
}

const ITEMS_PER_PAGE = 6;

const HarvestSchedule: React.FC<HarvestScheduleProps> = ({ harvestSchedule, onCropCycleClick }) => {
  const hasData = harvestSchedule?.length > 0;
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(harvestSchedule.length / ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

  const paginatedData = harvestSchedule.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <Card
  elevation={0}
  sx={{
    borderRadius: '8px',
    fontFamily: 'Poppins',
    minHeight: '465px',
    flexDirection: 'column',
    flexGrow: 1,
    border: '1px solid #E0E0E0',
    backgroundColor: '#fff',
    boxShadow: 'none', 
    display: 'flex', 
  }}
> {/* Header */}
      <CardContent
      
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.12)',
          padding: '1rem 1rem 0.5rem',
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Harvest Schedule
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(0,18,25,0.6)' }}>
            Shows upcoming crop harvest dates.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <PaginationArrowButtons
            page={page}
            totalPages={totalPages}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        </Box>
        </Box>
      </CardContent>

      {/* Content */}
      <CardContent sx={{ padding: '1rem', height: '17.3rem' }}>
        {hasData ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {paginatedData.map((item) => {
              const progressPercent = Math.round((item.daysDone / item.totalDays) * 100);

              return (
                <Box key={item.cycleId} sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                      variant="body2"
                      onClick={() => onCropCycleClick?.(item.cycleId)}
                      sx={{ color: '#ff5e00', fontWeight: 500, textDecoration: 'underline',cursor: 'pointer' }}
                    >
                      Crop Cycle {item.cycleId}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(0, 18, 25, 0.7)', fontWeight: 500 }}
                    >
                      Harvest expect on {item.expectedHarvestDate}
                    </Typography>
                  </Box>
                  <Box sx={{ backgroundColor: '#e6e9ec', borderRadius: '4px', height: '1rem' }}>
                    <Box
                      sx={{
                        width: `${progressPercent}%`,
                        backgroundColor: '#8bc34a',
                        height: '100%',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease-in-out',
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#001219' }}>
            No Upcoming harvest
          </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default HarvestSchedule;
