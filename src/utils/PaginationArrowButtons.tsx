'use client';
 
import { Button, Box } from '@mui/material';
import Image from 'next/image';
import React from 'react';
 
interface PaginationArrowButtonsProps {
  page: number;
  totalPages: number;
  handlePrev: () => void;
  handleNext: () => void;
}
 
const PaginationArrowButtons: React.FC<PaginationArrowButtonsProps> = ({
  page,
  totalPages,
  handlePrev,
  handleNext,
}) => {
  return (
    <Box display="flex" gap={1}>
      <Button
        onClick={handlePrev}
        disabled={page === 0}
        variant="contained"
        sx={{
          width: 32,
          height: 32,
          minWidth: 'unset',
          borderRadius: '50%',
          backgroundColor: '#ff5e00',
          boxShadow: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: '#e65100',
          },
          '&:disabled': {
            backgroundColor: 'rgba(0,0,0,0.12)',
          },
        }}
      >
        <Image
          src="/apps/rightarrow.svg"
          alt="Left"
          width={12}
          height={12}
          style={{ transform: 'rotate(-180deg)' }}
        />
      </Button>
 
      <Button
        onClick={handleNext}
        disabled={page >= totalPages - 1}
        variant="contained"
        sx={{
          width: 32,
          height: 32,
          minWidth: 'unset',
          borderRadius: '50%',
          backgroundColor: '#ff5e00',
          boxShadow: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: '#e65100',
          },
          '&:disabled': {
            backgroundColor: 'rgba(0,0,0,0.12)',
          },
        }}
      >
        <Image
          src="/apps/rightarrow.svg"
          alt="Right"
          width={12}
          height={12}
        />
      </Button>
    </Box>
  );
};
 
export default PaginationArrowButtons;
