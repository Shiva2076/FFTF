'use client';
import { FC } from 'react';
import { DialogContent, Typography, Button, Box } from '@mui/material';

interface PrimeMemberProps {
  onClose: () => void;
}

const Primemember: FC<PrimeMemberProps> = ({ onClose }) => {
  return (
    <DialogContent
      sx={{
        p: 4,
        textAlign: 'center',
        borderRadius: 2,
        bgcolor: '#fff',
        border: '1px solid #d1d9e2',
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#008756"
        sx={{ letterSpacing: '0.25px', lineHeight: '123.5%' }}
      >
        Success! You’re a Premium Member.
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mt: 2, fontSize: '1rem', letterSpacing: '0.15px', lineHeight: '175%' }}
      >
        Enjoy full access to insights, analytics, and priority features.
      </Typography>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={onClose} // ✅ Close modal on click
          sx={{
            bgcolor: '#ff5e00',
            color: '#f7f7f7',
            fontWeight: 'bold',
            borderRadius: '4px',
            px: 3,
            py: 1,
            boxShadow:
              '0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)',
            '&:hover': { bgcolor: '#e04e00' },
          }}
        >
          Start Exploring
        </Button>
      </Box>
    </DialogContent>
  );
};

export default Primemember;
