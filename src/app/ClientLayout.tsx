'use client';

import { useEffect, useState } from 'react';
import { Box, Alert, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { usePathname, useRouter  } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import type { RootState } from "../app/store";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Initialize sidebar state from localStorage or default to false
  const [open, setOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpen');
      return saved === 'true';
    }
    return false;
  });
  const [isMounted, setIsMounted] = useState(false);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const isLoggedIn = Boolean(userInfo?.user_id );
  const isVerified = useSelector((s: RootState) => s.auth.userInfo?.verified);
  const pathname = usePathname();
  
  useEffect(() => {
    // Avoid hydration mismatch by only rendering after mount
    setIsMounted(true);
  }, []);

  // Persist sidebar state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', open.toString());
    }
  }, [open]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar open={open} setOpen={setOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: open ? '240px' : '80px',
          transition: 'margin-left 0.3s',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <Header />
        { isLoggedIn && !isVerified && pathname !== '/verify-email' && (
          <Alert
            severity="error"
            sx={{
              borderRadius: 0,
              bgcolor: '#dc2626',
              color: 'white',
              '& .MuiAlert-message': { width: '100%' },
              py: 0.2,
            }}
          >
            <Box sx={{ maxWidth: 1200 }}>
              <Typography variant="body2">
                Your account is unverified. Check your email for the verification link or{' '}
                <Box
                  component="span"
                  sx={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() => router.push('/accountsettings?tab=AccountActions')}
                >
                  resend/update your email
                </Box>.
              </Typography>
            </Box>
          </Alert>
        )}
        {children}
      </Box>
    </Box>
  );
}