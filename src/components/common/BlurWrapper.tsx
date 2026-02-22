'use client';

import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

interface BlurWrapperProps {
  children: React.ReactNode;
  isBlurred: boolean;
  heading?: string | React.ReactNode;
  headingComponent?: React.ReactNode;
  messageType?: 'iot' | 'ai';
}

/**
 * BlurWrapper component that blurs content but keeps headings visible
 * Shows appropriate message based on messageType when blurred
 */
const BlurWrapper: React.FC<BlurWrapperProps> = ({
  children,
  isBlurred,
  heading,
  headingComponent,
  messageType = 'iot',
}) => {
  if (!isBlurred) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Heading - always visible */}
      {heading && (
        <Box sx={{ mb: 2 }}>
          {typeof heading === 'string' ? (
            <Typography variant="h6" fontWeight={600}>
              {heading}
            </Typography>
          ) : (
            heading
          )}
        </Box>
      )}
      {headingComponent}

      {/* Blurred content */}
      <Box
        sx={{
          filter: 'blur(4px)',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.5,
        }}
      >
        {children}
      </Box>

      {/* Overlay lock icon with tooltip */}
      <Box
        sx={{
          position: 'absolute',
          top: heading || headingComponent ? '50%' : '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          textAlign: 'center',
          pointerEvents: 'auto',
        }}
      >
        <Tooltip
          title={messageType === 'iot' ? 'Will show after iot integration' : 'Will show after ai integration'}
          arrow
          placement="top"
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <LockIcon
              sx={{
                fontSize: '24px',
                color: 'rgba(0, 18, 25, 0.87)',
              }}
            />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default BlurWrapper;

