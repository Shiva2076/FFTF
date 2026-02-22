'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';
import {formatEventTime} from '@/utils/functions';
import BlurWrapper from '@/components/common/BlurWrapper';

interface Anomaly {
  message?: string;
  action?: string;
  status?: string;
  EventProcessedUtcTime?: string;
}
const getStatusColor = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case 'resolved':
      return '#43a047';
    case 'unresolved':
      return '#f9a825';
    case 'alert generated':
      return '#e53935';
    default:
      return '#bdbdbd';
  }
};
interface AnomaliesProps {
  anomalies?: Anomaly[];
  iot?: boolean;
}

const ITEMS_PER_PAGE = 5;
const ROW_HEIGHT = 56;

const Anomalies: React.FC<AnomaliesProps> = ({ anomalies = [], iot = true }) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(anomalies.length / ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

  const visibleAnomalies = anomalies.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const hasData = anomalies.length > 0;

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <Typography fontSize={16} fontWeight={600} fontFamily="Poppins" color="rgba(0, 18, 25, 0.87)">
            Farm Level Anomalies
          </Typography>
          <Typography fontSize={12} fontWeight={400} fontFamily="Poppins" color="rgba(0, 18, 25, 0.6)">
            Tracks crop health irregularities.
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

      {/* Column Headers */}
      <Box display="flex" px={3} py={2} bgcolor="rgba(0, 18, 25, 0.08)" fontWeight={500}>
        <Box flex={1}>
          <Typography fontSize={14} fontFamily="Poppins">Anomaly</Typography>
        </Box>
        <Box flex={3} display="flex">
          <Box flex={1} display="flex" justifyContent="flex-start" sx={{ pl: '4vw' }}>
            <Typography fontSize={14} fontFamily="Poppins">Action</Typography>
          </Box>
          <Box flex={1} display="flex" justifyContent="flex-start" sx={{ pl: '3vw' }}>
            <Typography fontSize={14} fontFamily="Poppins">Status</Typography>
          </Box>
          <Box flex={1}>
            <Typography fontSize={14} fontFamily="Poppins">Last Updated</Typography>
          </Box>
        </Box>
      </Box>

      {/* Body */}
      {hasData ? (
        <Box position="relative" display="flex">
          <Box flex={1}>
            {visibleAnomalies.map((item, index) => (
              <Box
                key={`anomaly-${index}`}
                px={3}
                py={1}
                borderTop={index === 0 ? 'none' : '1px solid rgba(0,0,0,0.12)'}
                sx={{
                  height: `${ROW_HEIGHT}px`,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography fontSize={14} fontFamily="Poppins" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                  {item?.message || '—'}
                </Typography>
              </Box>
            ))}
            {/* Placeholder rows */}
            {Array.from({ length: ITEMS_PER_PAGE - visibleAnomalies.length }).map((_, idx) => (
              <Box
                key={`placeholder-${idx}`}
                px={3}
                py={1}
                borderTop="1px solid rgba(0,0,0,0.12)"
                sx={{
                  height: `${ROW_HEIGHT}px`,
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              >
                <Typography fontSize={14}>placeholder</Typography>
              </Box>
            ))}
          </Box>
          <Box flex={3} position="relative">
            <BlurWrapper isBlurred={!iot} messageType="iot">
              {visibleAnomalies.map((item, index) => (
                <Box
                  key={`row-${index}`}
                  display="flex"
                  px={3}
                  py={1}
                  borderTop={index === 0 ? 'none' : '1px solid rgba(0,0,0,0.12)'}
                  sx={{
                    height: `${ROW_HEIGHT}px`,
                    alignItems: 'center',
                  }}
                >
                  <Box flex={1}>
                    <Typography fontSize={14} fontFamily="Poppins">
                      {item?.action || '—'}
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    {item?.status ? (
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.25,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '12px',
                          backgroundColor: getStatusColor(item.status),
                          color: '#fff',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          fontFamily: 'Poppins',
                          textTransform: 'capitalize',
                          width: '50%',
                        }}
                      >
                        {item?.status.toUpperCase() || '—'}
                      </Box>
                    ) : (
                      <Typography fontSize={14} fontFamily="Poppins">—</Typography>
                    )}
                  </Box>
                  <Box flex={1}>
                    {formatEventTime(item?.EventProcessedUtcTime)}
                  </Box>
                </Box>
              ))}
              {/* Placeholder rows */}
              {Array.from({ length: ITEMS_PER_PAGE - visibleAnomalies.length }).map((_, idx) => (
                <Box
                  key={`placeholder-blur-${idx}`}
                  display="flex"
                  px={3}
                  py={1}
                  borderTop="1px solid rgba(0,0,0,0.12)"
                  sx={{
                    height: `${ROW_HEIGHT}px`,
                    opacity: 0,
                    pointerEvents: 'none',
                  }}
                >
                  <Box flex={1}><Typography fontSize={14}>placeholder</Typography></Box>
                  <Box flex={1}><Typography fontSize={14}>placeholder</Typography></Box>
                  <Box flex={1}><Typography fontSize={14}>placeholder</Typography></Box>
                </Box>
              ))}
            </BlurWrapper>
          </Box>
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
          <Typography fontSize={12} fontFamily="Poppins" color="rgba(0, 18, 25, 0.87)">
            No Anomalies Found.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Anomalies;
