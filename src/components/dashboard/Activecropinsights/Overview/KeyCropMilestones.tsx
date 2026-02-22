'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface Milestone {
  label: string;
  date: string;
}

interface Props {
  milestones: Milestone[] | null;
}

const KeyCropMilestones: React.FC<Props> = ({ milestones }) => {
  const hasData = Array.isArray(milestones) && milestones.length > 0;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 1, width: '100%' }}>
      <Box sx={{ padding: '1.5rem' }}>
        <Typography fontWeight={600}>Key Crop Milestones</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          View sowing, transplant, and harvest dates at a glance.
        </Typography>
      </Box>

      {hasData ? (
        <Box display="flex" borderTop="1px solid rgba(0,0,0,0.12)">
          {milestones.map((milestone, idx) => (
            <Box
              key={idx}
              flex={1}
              sx={{
                borderRight:
                  idx < milestones.length - 1 ? '1px solid rgba(0,0,0,0.12)' : 'none',
                p: '1rem 1.5rem',
              }}
            >
              <Typography
                variant="caption"
                sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.6rem'  }}
              >
                {milestone.label}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {milestone.date}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ px: '1.5rem', py: '1rem' }}>
          <Typography variant="body2" color="text.secondary">
            No milestone data available.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default KeyCropMilestones;
