'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';
import { formatEventTime } from '@/utils/functions';

interface AlertPacket {
  packet_id: string;
  message: string;
  action: string;
  updates?: { timestamp: string };
}

interface Props {
  alertData: AlertPacket[] | null;
}

const ITEMS_PER_PAGE = 3;

const Alerts: React.FC<Props> = ({ alertData }) => {
  const [page, setPage] = useState(0);

  // 1. Normalize to an array
  const alerts: AlertPacket[] = Array.isArray(alertData) ? alertData : [];

  const hasData = alerts.length > 0;
  const totalPages = Math.ceil(alerts.length / ITEMS_PER_PAGE);
  const visibleAlerts = alerts.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        borderRadius: 1,
        border: '1px solid rgba(0,0,0,0.12)',
        bgcolor: '#fff',
        fontFamily: 'Poppins',
      }}
    >
      {/* Header */}
      <Box px={3} py={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography fontSize={16} fontWeight={600}>
            Alerts
          </Typography>
          <Typography fontSize={12} color="rgba(0,0,0,0.6)">
            Notifies critical farm events and issues.
          </Typography>
        </Box>

        {hasData && (
          <PaginationArrowButtons
            page={page}
            totalPages={totalPages}
            handlePrev={() => setPage(p => Math.max(p - 1, 0))}
            handleNext={() => setPage(p => Math.min(p + 1, totalPages - 1))}
          />
        )}
      </Box>

      {/* Column headers */}
      <Box display="flex" px={3} py={1.5} bgcolor="rgba(0, 18, 25, 0.08)" fontWeight={500}>
        <Box flex={1} display="flex" textAlign="center" ml="1rem">
          <Typography fontSize={14} color="rgba(0,18,25,0.87)">
            Alert
          </Typography>
        </Box>
        <Box flex={1} textAlign="center">
          <Typography fontSize={14} color="rgba(0,18,25,0.87)">
            Action To Take
          </Typography>
        </Box>
        <Box flex={1} textAlign="center">
          <Typography fontSize={14} color="rgba(0,18,25,0.87)">
            Last Updated
          </Typography>
        </Box>
      </Box>

      {/* Body */}
      {hasData ? (
        <>
          {visibleAlerts.map((alert) => (
            <Box
              key={alert.packet_id}
              display="flex"
              px={3}
              py={2}
              borderTop="1px solid rgba(0,0,0,0.12)"
              alignItems="center"
            >
              <Box flex={1}>
                <Typography fontSize={12} color="rgba(0,18,25,0.87)">
                  {alert.message}
                </Typography>
              </Box>
              <Box flex={1} textAlign="center">
                <Typography fontSize={12} color="rgba(0,18,25,0.87)">
                  Take action immediately
                </Typography>
              </Box>
              <Box flex={1} textAlign="right">
                <Typography fontSize={12} color="rgba(0,18,25,0.87)">
                {alert.updates?.timestamp? formatEventTime(alert.updates.timestamp): '—'}                
                </Typography>
              </Box>
            </Box>
          ))}

          {/* Placeholder rows */}
          {Array.from({ length: ITEMS_PER_PAGE - visibleAlerts.length }).map((_, idx) => (
            <Box
              key={`ph-${idx}`}
              display="flex"
              px={3}
              py={2}
              borderTop="1px solid rgba(0,0,0,0.12)"
              alignItems="center"
              sx={{ opacity: 0, pointerEvents: 'none' }}
            >
              <Box flex={1}>placeholder</Box>
              <Box flex={1} textAlign="right">
                placeholder
              </Box>
              <Box flex={1} textAlign="right">
                placeholder
              </Box>
            </Box>
          ))}
        </>
      ) : (
        <Box
          px={3}
          py={4}
          textAlign="center"
          color="rgba(0,0,0,0.6)"
        >
          <Typography fontSize={12}>No Alerts Found.</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Alerts;
