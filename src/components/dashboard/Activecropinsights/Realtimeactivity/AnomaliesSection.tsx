'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';
import {formatEventTime} from '@/utils/functions';

interface AnomalyPacket {
  packet_id: string;
  message: string;
  action: string;
  updates?: { timestamp: string };
}

interface Props {
  anomalyData: AnomalyPacket[] | null;
}

const ITEMS_PER_PAGE = 3;

const Anomalies: React.FC<Props> = ({ anomalyData }) => {
  const [page, setPage] = useState(0);

  const anomalies: AnomalyPacket[] = Array.isArray(anomalyData) ? anomalyData : [];

  const hasData = anomalies.length > 0;
  const totalPages = Math.ceil(anomalies.length / ITEMS_PER_PAGE);
  const visible = anomalies.slice(
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
            Crop Level Anomalies
          </Typography>
          <Typography fontSize={12} color="rgba(0,0,0,0.6)">
            Tracks crop health irregularities.
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
            Anomaly
          </Typography>
        </Box>
        <Box flex={1} textAlign="center">
          <Typography fontSize={14} color="rgba(0,18,25,0.87)">
            Action
          </Typography>
        </Box>
        <Box flex={1} textAlign="center">
          <Typography fontSize={14} color="rgba(0,18,25,0.87)">
            Last Updated
          </Typography>
        </Box>
      </Box>

      {/* Rows */}
      {hasData ? (
        <>
          {visible.map((item) => (
            <Box
              key={item.packet_id}
              display="flex"
              px={3}
              py={2}
              borderTop="1px solid rgba(0,0,0,0.12)"
              alignItems="center"
            >
              <Box flex={1}>
                <Typography fontSize={12} color="rgba(0,18,25,0.87)">
                  {item.message}
                </Typography>
              </Box>
              <Box flex={1} textAlign="center">
                <Typography fontSize={12} color="rgba(0,18,25,0.87)">
                  {item.action}
                </Typography>
              </Box>
              <Box flex={1} textAlign="right">
                <Typography fontSize={12} color="rgba(0,18,25,0.87)">
                {item.updates?.timestamp ? formatEventTime(item.updates.timestamp): '—'}   
                </Typography>
              </Box>
            </Box>
          ))}

          {/* Placeholder rows */}
          {Array.from({ length: ITEMS_PER_PAGE - visible.length }).map((_, idx) => (
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
              <Box flex={1} textAlign="right">placeholder</Box>
              <Box flex={1} textAlign="right">placeholder</Box>
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
          <Typography fontSize={12}>No Anomalies Found.</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Anomalies;
