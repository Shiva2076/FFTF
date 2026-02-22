'use client';
import {api} from '@/constants';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const passwordRequirements = [
    { text: 'Must be at least 8 characters long.', met: newPassword.length >= 8 },
    { text: 'Must include at least one uppercase letter (A-Z).', met: /[A-Z]/.test(newPassword) },
    { text: 'Must include at least one lowercase letter (a-z).', met: /[a-z]/.test(newPassword) },
    { text: 'Must include at least one number (0-9).', met: /\d/.test(newPassword) },
    { text: 'Must include at least one special character (!@#$%&*).', met: /[!@#$%&*]/.test(newPassword) }
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';

  useEffect(() => {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const headerElement = header || nav || document.querySelector('[data-testid="header"]');
    
    if (headerElement) {
      headerElement.style.display = 'none';
    }

    return () => {
      if (headerElement) {
        headerElement.style.display = '';
      }
    };
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setChecking(false);
        setValid(false);
        return;
      }
      try {
        const res = await api.get(`/api/users/verify-reset-token?token=${token}`);
        setValid(res.data.verified === true);
      } catch {
        setValid(false);
      } finally {
        setChecking(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleReset = async () => {
    if (!allRequirementsMet) {
      setToast({
        open: true,
        message: 'Please meet all password requirements.',
        severity: 'error'
      });
      return;
    }

    if (!passwordsMatch) {
      setToast({
        open: true,
        message: 'Passwords do not match.',
        severity: 'error'
      });
      return;
    }

    try {
      const res = await api.post(
        '/api/users/forgot-reset-password',
        { token, newPassword, confirmPassword }
      );
      
      if (res.status === 200) {
        setToast({
          open: true,
          message: 'Password updated successfully!',
          severity: 'success'
        });
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          router.push('/markettrend');
        }, 1200);
      } else {
        setToast({
          open: true,
          message: res.data?.message || 'Failed to reset password.',
          severity: 'error'
        });
      }
    } catch (err: any) {
      setToast({
        open: true,
        message: err.response?.data?.message || 'Something went wrong.',
        severity: 'error'
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        position: 'relative',
        zIndex: 1000,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 3,
          width: { xs: '95%', sm: 600 }, // Responsive width
          maxWidth: 600,
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 2,
          bgcolor: 'white',
        }}
      >
        <Typography 
          sx={{ mb: 2, textAlign: 'center' }}
        >
          Reset Password
        </Typography>

        {checking ? (
          <Typography>Validating token…</Typography>
        ) : !valid ? (
          <Typography color="error">Token is invalid or has expired.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Left side - Form */}
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                flex: 1
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleReset();
              }}
            >
              <TextField
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                fullWidth
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={newPassword !== '' && !allRequirementsMet}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowNewPassword((show) => !show)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault();
                  }
                }}
              />

              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword !== '' && !passwordsMatch}
                helperText={
                  confirmPassword !== '' && !passwordsMatch
                    ? 'Passwords do not match'
                    : ''
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowConfirmPassword((show) => !show)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault();
                  }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={!newPassword || !allRequirementsMet || !passwordsMatch}
                sx={{ 
                  mt: 1, 
                  bgcolor: '#FF5E00',
                  '&:hover': {
                    bgcolor: '#E55100'
                  }
                }}
              >
                Reset Password
              </Button>
            </Box>

            {/* Right side - Password Requirements */}
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                Password Requirements:
              </Typography>
              <List dense sx={{ py: 0 }}>
                {passwordRequirements.map((requirement, index) => (
                  <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      {requirement.met ? (
                        <CheckCircle sx={{ fontSize: 18, color: 'success.main' }} />
                      ) : (
                        <RadioButtonUnchecked sx={{ fontSize: 18, color: 'text.disabled' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={requirement.text}
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: requirement.met ? 'success.main' : 'text.secondary',               
                        fontSize: '0.875rem'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        )}

        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={toast.severity}
            sx={{ width: '100%' }}
            onClose={() => setToast((t) => ({ ...t, open: false }))}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}