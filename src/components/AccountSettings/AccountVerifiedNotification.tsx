"use client";
import React, { useState, useEffect } from 'react';
import { Box, Modal, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSearchParams } from 'next/navigation';

interface AccountVerifiedNotificationProps {
  children: React.ReactNode;
}

const AccountVerifiedNotification: React.FC<AccountVerifiedNotificationProps> = ({ children }) => {
  const searchParams = useSearchParams();
  const verifiedParam = searchParams.get('verified');
  const [notification, setNotification] = useState<string | null>(null);
  const openNotif = Boolean(notification);

  useEffect(() => {
    if (verifiedParam === 'true') {
      setNotification('Your account has been successfully verified!');
    }
  }, [verifiedParam]);

  const handleClose = () => {
    setNotification(null);
  };

  return (
    <Box sx={{ filter: openNotif ? 'blur(4px)' : 'none', position: 'relative', overflowY: 'hidden' }}>
      <Modal
        open={openNotif}
        onClose={handleClose}
        BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.2)' } }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 0,
            outline: 'none',
          }}
        >
          {/* Close button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton
              onClick={handleClose}
              sx={{
                color: 'grey.500',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ px: 4, pb: 4, pt: 2, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: '#4CAF50',
                fontWeight: 'bold',
                mb: 3,
                fontSize: '2rem',
              }}
            >
              Account Verified
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'grey.600',
                lineHeight: 1.6,
                fontSize: '1rem',
              }}
            >
              Your account is now ready. Gain data-driven insights,
              optimize your farm strategies, and stay ahead in the
              industry.
            </Typography>
          </Box>
        </Box>
      </Modal>
      
      {/* Render the wrapped content */}
      {children}
    </Box>
  );
};

export default AccountVerifiedNotification;