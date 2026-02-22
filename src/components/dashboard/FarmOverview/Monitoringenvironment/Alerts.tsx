'use client';

import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';
import {formatEventTime} from '@/utils/functions';
import BlurWrapper from '@/components/common/BlurWrapper';

const ITEMS_PER_PAGE = 5;
const ROW_HEIGHT = 56.2;

interface AlertItem {
  message: string;
  action: string;
  updates: {
    timestamp: string;
    [key: string]: any;
  };
}

interface AlertsProps {
  alerts?: AlertItem[];
  ai?: boolean;
}

const Alerts: React.FC<AlertsProps> = ({ alerts = [], ai = true }) => {
  const [page, setPage] = useState(0);
  
  // Sort alerts in ascending order (oldest first)
  const sortedAlerts = useMemo(() => {
    return [...alerts].sort((a, b) => {
      const timeA = new Date(a?.updates?.timestamp).getTime();
      const timeB = new Date(b?.updates?.timestamp).getTime();
      return timeB - timeA; // ascending order
    });
  }, [alerts]);
  
  const totalPages = Math.ceil(sortedAlerts.length / ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

  const currentData = sortedAlerts.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const hasData = sortedAlerts.length > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        borderRadius: '8px',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography fontSize={16} fontWeight={600} fontFamily="Poppins" color="rgba(0, 18, 25, 0.87)">
            Alerts
          </Typography>
          <Typography fontSize={12} fontWeight={400} fontFamily="Poppins" color="rgba(0, 18, 25, 0.6)">
            Notifies critical farm events and issues.
          </Typography>
        </Box>

        {hasData && (
          <PaginationArrowButtons
            page={page}
            totalPages={totalPages}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        )}
      </Box>

      <Divider />

      {/* Column headers */}
      <Box display="flex" px={3} py={2} bgcolor="rgba(0, 18, 25, 0.08)" fontWeight={500}>
        <Box flex={1}>
          <Typography fontSize={14} fontFamily="Poppins" color="rgba(0, 18, 25, 0.87)">
            Alerts
          </Typography>
        </Box>
        <Box flex={1} textAlign="center" ml="8rem">
          <Typography fontSize={14} fontFamily="Poppins" color="rgba(0, 18, 25, 0.87)">
            Action
          </Typography>
        </Box>
        <Box flex={1} textAlign="right">
          <Typography fontSize={14} fontFamily="Poppins" color="rgba(0, 18, 25, 0.87)">
            Last Updated
          </Typography>
        </Box>
      </Box>

      {/* Body */}
      <BlurWrapper isBlurred={!ai} messageType="ai">
      {hasData ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: `${ITEMS_PER_PAGE * ROW_HEIGHT}px`,
            maxHeight: `${ITEMS_PER_PAGE * ROW_HEIGHT}px`,
          }}
        >
          {currentData.map((alert, idx) => (
            <Box
              key={`alert-${idx}`}
              sx={{
                height: `${ROW_HEIGHT}px`,
                display: 'flex',
                alignItems: 'center',
                px: 3,
                borderTop: '1px solid rgba(0,0,0,0.12)',
              }}
            >
              <Box flex={1}>
                <Typography
                  fontSize={14}
                  fontWeight={400}
                  fontFamily="Poppins"
                  color="rgba(0, 18, 25, 0.87)"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {alert?.message}
                </Typography>
              </Box>
              <Box flex={1} textAlign="right">
                <Typography
                  fontSize={14}
                  fontWeight={400}
                  fontFamily="Poppins"
                  color="rgba(0, 18, 25, 0.87)"
                >
                  Take action immediately
                </Typography>
              </Box>
              <Box flex={1} textAlign="right">
                <Typography
                  fontSize={14}
                  fontWeight={400}
                  fontFamily="Poppins"
                  color="rgba(0, 18, 25, 0.87)"
                >
                  {formatEventTime(alert?.updates?.timestamp) || '—'}
                </Typography>
              </Box>
            </Box>
          ))}

          {/* Placeholder rows */}
          {Array.from({ length: ITEMS_PER_PAGE - currentData.length }).map((_, idx) => (
            <Box
              key={`placeholder-${idx}`}
              sx={{
                height: `${ROW_HEIGHT}px`,
                display: 'flex',
                alignItems: 'center',
                px: 3,
                borderTop: '1px solid rgba(0,0,0,0.12)',
                opacity: 0,
                pointerEvents: 'none',
              }}
            >
              <Box flex={1}><Typography fontSize={14}>placeholder</Typography></Box>
              <Box flex={1} textAlign="right"><Typography fontSize={14}>placeholder</Typography></Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          px={3}
          py={1.5}
          borderTop="1px solid rgba(0,0,0,0.12)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          minHeight={`${ITEMS_PER_PAGE * ROW_HEIGHT}px`}
        >
          <Typography fontSize={12} fontWeight={400} fontFamily="Poppins" lineHeight="20px" color="rgba(0, 18, 25, 0.87)">
            No Alerts Found
          </Typography>
        </Box>
      )}
      </BlurWrapper>
    </Paper>
  );
};

export default Alerts;