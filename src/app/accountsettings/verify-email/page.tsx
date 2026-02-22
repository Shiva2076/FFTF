'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { api } from '@/constants';

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token  = params.get('token');
  const router = useRouter();
  const [status, setStatus] = useState<'loading'|'success'|'error'>('loading');
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    (async () => {
      try {
        const res = await api.get(`/api/users/verify-email?token=${token}`);
        const data = res.data;
        if (data.verified !== false) {
          setStatus('success');
          setToast({
            open: true,
            message: 'Email verified successfully!',
            severity: 'success'
          });
        } else {
          throw new Error(data.message || 'Verification failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setToast({
          open: true,
          message: 'Invalid or expired link.',
          severity: 'error'
        });
      }
    })();
  }, [token]);

  if (status === 'loading') {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress/>
        <Typography>Verifying your email…</Typography>
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="error">
          Oops—invalid or expired link.
        </Typography>
        <Button onClick={()=>router.push('/accountsettings')}>Back to Settings</Button>
      </Box>
    );
  }

  return (
    <Box p={4} textAlign="center">
      <Typography variant="h5" color="green">
         Your email is now verified!
      </Typography>
      <Button
        variant="contained"
        onClick={() => router.push('/accountsettings')}
        sx={{ mt: 2,bgcolor: '#FF5E00', textTransform: 'uppercase' }}
      >
        Go to Account Settings
      </Button>
    </Box>
  );
}
