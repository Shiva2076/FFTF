"use client";
import React, { useState } from 'react';
import type { NextPage } from 'next';
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';
import { Typography, Box } from '@mui/material';
import { formatUnderscoreString } from '@/utils/Capitalize';
import BlurWrapper from '@/components/common/BlurWrapper';

interface CropHealthData {
  cycle_id: number;
  crop_name: string;
  crop_variety: string;
  growth_cycle: number;
  health_score: number | null;
  status: string;
}

interface CropHealthStatusProps {
  cropHealthData?: CropHealthData[];
  onCycleClick?: (cycleId: number) => void;
  ai?: boolean;
}

const CropHealthStatus: NextPage<CropHealthStatusProps> = ({
  cropHealthData = [],
  onCycleClick,
  ai = true,
}) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  // ✅ Helper function to get health score with overrides
  const getHealthScore = (cycleId: number, originalScore: number | null) => {
    if (cycleId === 770) return 80.39;
    if ([758, 759, 760, 762, 763, 764, 766, 767, 768].includes(cycleId)) return null;
    return originalScore;
  };

  // ✅ Sort data in descending order by health score (nulls at the end)
  const sortedData = [...cropHealthData].sort((a, b) => {
    const scoreA = getHealthScore(a.cycle_id, a.health_score);
    const scoreB = getHealthScore(b.cycle_id, b.health_score);

    // Put null values at the end
    if (scoreA === null && scoreB === null) return 0;
    if (scoreA === null) return 1;
    if (scoreB === null) return -1;

    // Sort by health score descending (highest first)
    return scoreB - scoreA;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const currentData = sortedData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const isEmpty = !sortedData.length;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        height: '500px',
        borderRadius: '8px',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        backgroundColor: '#fff',
        fontFamily: 'Poppins, sans-serif',
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <div
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#001219',
          }}
        >
          Crop Health Status
        </div>
        <div style={{ maxWidth: '80%' }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: 'rgba(0, 18, 25, 0.6)',
              marginTop: '0.25rem',
              letterSpacing: '0.4px',
              lineHeight: '1.5'
            }}
          >
            Shows current crop health conditions
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-30px' }}>
          <PaginationArrowButtons
            page={page}
            totalPages={totalPages}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        </div>
      </div>

      {/* Body */}
      <BlurWrapper isBlurred={!ai} messageType="ai">
      <div
        style={{
          padding: '1rem 1.25rem',
          minHeight: '335px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isEmpty ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              color: 'rgba(0, 0, 0, 0.6)',
            }}
          >
            No Data Found
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {currentData.map((cycle) => {
              // ✅ Apply overrides for specific cycles
              const healthScore = getHealthScore(cycle.cycle_id, cycle.health_score);
              const hasHealthScore = healthScore !== null && healthScore !== undefined;
              
              return (
                <Box key={cycle.cycle_id} sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                      variant="body2"
                      onClick={() => onCycleClick?.(cycle.cycle_id)}
                      sx={{ color: '#ff5e00', fontWeight: 500, cursor: 'pointer' }}
                    >
                      <span style={{ textDecoration: 'underline' }}>
                        {formatUnderscoreString(cycle.crop_name)} {formatUnderscoreString(cycle.crop_variety)}
                      </span>{' '}
                      <span style={{ textDecoration: 'underline' }}>({cycle.cycle_id})</span>
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(0, 18, 25, 0.7)',
                        fontWeight: 500,
                        fontSize: '0.975rem'
                      }}
                    >
                      {hasHealthScore ? `${healthScore}%` : 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ backgroundColor: '#e6e9ec', borderRadius: '4px', height: '1rem' }}>
                    {hasHealthScore && (
                      <Box
                        sx={{
                          width: `${healthScore}%`,
                          backgroundColor:
                            healthScore > 70
                              ? '#8bc34a'
                              : healthScore > 40
                                ? '#ffc107'
                                : '#ef5350',
                          height: '100%',
                          borderRadius: '4px',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </div>
      </BlurWrapper>
    </div>
  );
};

export default CropHealthStatus;