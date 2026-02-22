'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';

interface RackShelfDataProps {
  data?: {
    shelves?: Record<string, string[]>; // e.g., { "1": ["1", "2"], "2": ["1"] }
  };
}

const RackShelfData: React.FC<RackShelfDataProps> = ({ data }) => {
  const shelves = data?.shelves ?? {};
  const rackKeys = Object.keys(shelves).sort(); // ensure consistent order
  const totalRacks = rackKeys.length;

  const [page, setPage] = useState(0);
  const currentRackId = rackKeys[page];
  const currentShelves = currentRackId ? shelves[currentRackId] : [];

  return (
    <Paper variant="outlined" sx={{ borderRadius: 1, width: '100%' }}>
      <Box sx={{ padding: '1.5rem' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography fontWeight={600}>Rack & Shelf Data</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              View one rack at a time with its allocated shelf positions.
            </Typography>
          </Box>
          {totalRacks > 1 && (
            <PaginationArrowButtons
              page={page}
              totalPages={totalRacks}
              handlePrev={() => setPage((p) => Math.max(0, p - 1))}
              handleNext={() => setPage((p) => Math.min(totalRacks - 1, p + 1))}
            />
          )}
        </Box>
      </Box>

      <Box display="flex" borderTop="1px solid rgba(0,0,0,0.12)">
        <Box
          flex={1}
          sx={{ borderRight: '1px solid rgba(0,0,0,0.12)', p: '1rem 1.5rem' }}
        >
          <Typography
            variant="caption"
            sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
          >
            Rack
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {currentRackId ? `${currentRackId}` : 'N/A'}
          </Typography>
        </Box>
        <Box flex={2} sx={{ p: '1rem 1.5rem' }}>
          <Typography
            variant="caption"
            sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
          >
            Shelf
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {currentShelves?.length > 0
              ? currentShelves.join(', ')
              : 'No shelves available'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default RackShelfData;
