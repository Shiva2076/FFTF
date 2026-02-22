"use client";
import React, { useState } from 'react';
import { Box, Typography, IconButton, Avatar, CircularProgress } from '@mui/material';
import capitalize from 'lodash/capitalize';
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';
import { formatUnderscoreString } from "@/utils/Capitalize";
import BlurWrapper from '@/components/common/BlurWrapper';

interface CompletedCycle {
  cycle_id: number;
  crop_name: string;
  crop_variety: string;
  crop_type: string;
  growth_cycle: number;
  status: string;
}

interface Props {
  completedCycleSummaryData?: CompletedCycle[];
  iot?: boolean;
}

const CompletedCycleSummary: React.FC<Props> = ({ completedCycleSummaryData, iot = true }) => {
  const [page, setPage] = useState(0);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const itemsPerPage = 5;

  const hasData = Array.isArray(completedCycleSummaryData) && completedCycleSummaryData.length > 0;
  
  // Sort cycles by cycle_id in descending order
  const sortedData = hasData
    ? [...completedCycleSummaryData].sort((a, b) => b.cycle_id - a.cycle_id)
    : [];
  
  const paginatedData = hasData
    ? sortedData.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)
    : [];

  const maxPage = hasData ? Math.floor((sortedData.length - 1) / itemsPerPage) : 0;

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, maxPage));
  };

  // ✅ Download PDF function
  const handleDownloadPDF = async (cycle: CompletedCycle) => {
    try {
      setDownloadingId(cycle.cycle_id);

      // Get token from cookies or localStorage
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('jwt='))
        ?.split('=')[1];

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/xos/dashboard/download-cycle-report?cycleId=${cycle.cycle_id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include', // Include cookies
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to download PDF');
      }

      // Convert response to blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create filename: "Lettuce_Butterhead_Green_Cycle_488_Report.pdf"
      const filename = `${formatUnderscoreString(cycle.crop_name)}_${formatUnderscoreString(cycle.crop_variety)}_Cycle_${cycle.cycle_id}_Report.pdf`;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert(`Failed to download PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        height: '92%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#fff',
        flexGrow: 1,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 2,
          borderBottom: '1px solid rgba(0,0,0,0.12)',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 16, fontWeight: 600, fontFamily: 'Poppins' }}>
            Completed Cycle Summary
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'rgba(0, 18, 25, 0.6)', fontFamily: 'Poppins' }}>
            Download completed cycle summary.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent:"flex-end", gap: 1 }}>
          <PaginationArrowButtons
            page={page}
            totalPages={maxPage + 1}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        </Box>
      </Box>

      {/* List */}
      <BlurWrapper isBlurred={!iot} messageType="iot">
      <Box
        sx={{
          height: 338,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: hasData ? 'flex-start' : 'center',
          alignItems: hasData ? 'stretch' : 'center',
          gap: 1,
          overflow: 'auto',
        }}
      >
        {hasData ? (
          paginatedData.map((cycle) => (
            <Box
              key={cycle.cycle_id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F9FAFB',
                borderRadius: 1,
                px: 2,
                py: 1.5,
                border: '1px solid #D1D9E2',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  src={`/apps/crop_icons/${(cycle.crop_name + '_' + cycle.crop_variety).toLowerCase().replace(/\s+/g, '')}_${cycle.crop_type.toLowerCase().replace(/-/g, "_")}.svg`}
                  alt="crop"
                  sx={{ width: 30, height: 30 }}
                />
                <Typography sx={{ fontSize: 14, fontWeight: 500, fontFamily: 'Poppins' }}>
                  {`${formatUnderscoreString(cycle.crop_name)} - ${formatUnderscoreString(cycle.crop_variety)}-${cycle.crop_type} (${cycle.cycle_id})`}
                </Typography>
              </Box>

              {/* ✅ Download button with loading state */}
              <IconButton 
                size="small"
                onClick={() => handleDownloadPDF(cycle)}
                disabled={downloadingId === cycle.cycle_id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(45, 80, 22, 0.08)',
                  },
                }}
              >
                {downloadingId === cycle.cycle_id ? (
                  <CircularProgress size={20} sx={{ color: '#2d5016' }} />
                ) : (
                  <Box 
                    component="img" 
                    src="/apps/dashboard/download.svg" 
                    alt="download" 
                    sx={{ width: 24, height: 24 }} 
                  />
                )}
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: '#001219',
              opacity: 0.8,
            }}
          >
            No Completed Cycles at the moment.
          </Typography>
        )}
      </Box>
      </BlurWrapper>
    </Box>
  );
};

export default CompletedCycleSummary;