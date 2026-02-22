'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
// import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Box,
  Paper,
  Typography,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';

import {
  ArrowForward,
  Close,
  VerifiedUser
} from '@mui/icons-material';
import type { RootState } from '../../store';
import { api, USERS_URL } from "@/constants";

export default function AccountActions() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const email = userInfo?.email ?? '';
  const isVerified = userInfo?.verified ?? false;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showChangeEmailDialog, setShowChangeEmailDialog] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [snackbar, setSnackbar] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(0); 
  const [canResend, setCanResend] = useState(true);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startResendTimer = (startFrom = 30) => {
    setCanResend(false);
    setCountdown(startFrom);
    if (timerRef.current) clearInterval(timerRef.current);
    let t = startFrom;
    timerRef.current = setInterval(() => {
      t--;
      setCountdown(t);
      if (t <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setCanResend(true);
        setCountdown(0);
      }
    }, 1000);
  };

  const validatePassword = (input: string) => input === 'password123';

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setIsPasswordValid(validatePassword(val));
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      router.push('/farmsxos?accountDeleted=true');
    } catch (error) {
      console.error('Delete failed', error);
      setIsDeleting(false);
    }
  };

  const handleSendVerification = async () => {
    if (!canResend) return; 
    if (!userInfo?.user_id) return;
    startResendTimer(30);
    try {
      const res = await api.post(`${USERS_URL}/resend-verification`, {
        user_id: userInfo.email,
      });
      setSnackbar({ type: 'success', msg: res.data.message || 'Verification email sent successfully!' });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to resend verification email';
      setSnackbar({ type: 'error', msg: errorMessage });
    }
  };

const handleVerifyAccount = async () => {
  setShowVerifyDialog(true);
  
  if (!canResend) return;
  
  if (!userInfo?.user_id) return;
  
  startResendTimer(30);
  
  try {
    const res = await api.post(`${USERS_URL}/resend-verification`, {
      user_id: userInfo.email,
    });
    setSnackbar({ 
      type: 'success', 
      msg: res.data.message || 'Verification email sent successfully!'
    });
  } catch (err) {
    const errorMessage = (err as any).response?.data?.message || (err as any).message || 'Failed to resend verification email';
    setSnackbar({ 
      type: 'error', 
      msg: errorMessage 
    });
  }
};
  useEffect(() => {
    if (!canResend && countdown > 0 && !timerRef.current) {
      startResendTimer(countdown);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

 const handleChangeEmailSubmit = async () => {
  if (!newEmail || newEmail === email) return;
  if (!userInfo) {
    setSnackbar({ type: 'error', msg: 'User not found in state.' });
    return;
  }
  setIsChangingEmail(true);
  try {
    const res = await api.post(`${USERS_URL}/change-email`, {
    user_id: userInfo.user_id,
      newEmail,
    });
    const json = res.data;
    setSnackbar({ type: 'success', msg: json.message });
    setShowChangeEmailDialog(false);
    setShowVerifyDialog(false);
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to change email';
    setSnackbar({ type: 'error', msg: errorMessage });
  } finally {
    setIsChangingEmail(false);
  }
};

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
              elevation={0}
              sx={{
                border: '1px solid #d1d5db',
                overflow: 'hidden',
                borderRadius: '8px',
              }}
            > <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #d1d5db' }}>
          <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151' }}>
            Account Actions
          </Typography>
        </Box>
        <Box sx={{ bgcolor: 'white', p: 3 }}>
          <Stack spacing={2}>
            {/* Delete Account */}
            <ButtonBase
              onClick={() => setShowDeleteDialog(true)}
              disabled={true} 
              sx={{
                px: 3, py: 2, bgcolor: '#f3f4f6', border: '1px solid #e5e7eb', opacity: 0.6,pointerEvents: 'none',
                '&:hover': { bgcolor: '#e5e7eb' },
                display: 'flex', justifyContent: 'space-between', borderRadius: 2, width: '100%',
                '& .arrow-icon': { transition: 'all 0.2s ease' },
                '&:hover .arrow-icon': { transform: 'translateX(4px)' }
              }}
            >
              <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#111827' }}>
                Delete My Account
              </Typography>
              <ArrowForward className="arrow-icon" sx={{ fontSize: '1.25rem' }} />
            </ButtonBase>

            {!isVerified && (
              <ButtonBase
                onClick={handleVerifyAccount}
                sx={{
                  px: 3, py: 2, border: '1px solid #e5e7eb', bgcolor: '#f3f4f6',
                  '&:hover': { bgcolor: '#e5e7eb' },
                  display: 'flex', justifyContent: 'space-between', borderRadius: 2, width: '100%',
                  '& .arrow-icon': { transition: 'all 0.2s ease' },
                  '&:hover .arrow-icon': { transform: 'translateX(4px)' }
                }}
              >
                <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#111827' }}>
                  Verify Account
                </Typography>
                <ArrowForward className="arrow-icon" sx={{ fontSize: '1.25rem' }} />
              </ButtonBase>
            )}

            {/* Verified Status */}
            {isVerified && (
              <Box sx={{ px: 3, py: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                <VerifiedUser sx={{ mr: 2, color: '#16a34a' }} />
                <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#15803d' }}>
                  Account Verified
                </Typography>
                <Chip label="Verified" size="small" color="success" sx={{ ml: 'auto' }} />
              </Box>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth="sm" >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', color: 'green', fontWeight: 600 }}>
          Permanently Delete Your Account?
          <IconButton sx={{ ml: 'auto' }} onClick={() => setShowDeleteDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography color="text.secondary" component="div" sx={{ lineHeight: 1.5 }}>
              Are you sure you want to delete your account?<br />
              This action is permanent and cannot be undone.<br />
              <br /><br />

              All your data, including farm settings, crop history,<br />
              and subscription details, will be permanently erased.<br /><br /><br />
              To proceed, please enter your password for verification.
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <Typography
                variant="body2"
                sx={{
                  position: 'absolute',
                  top: '-10px',
                  left: '16px',
                  backgroundColor: '#fff',
                  px: 0.5,
                  fontSize: '0.875rem',
                  color: '#666',
                  zIndex: 1,
                }}
              >
                Password
              </Typography>
              <TextField
                type="password"
                fullWidth
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                error={password.length > 0 && !isPasswordValid}
                helperText={password.length > 0 && !isPasswordValid ? 'Incorrect password' : ''}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowDeleteDialog(false)} variant="outlined">Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={!isPasswordValid || isDeleting}
            variant="contained"
            color="error"
            startIcon={isDeleting ? <CircularProgress size={16} /> : null}
          >
            {isDeleting ? 'Processing...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Verification Dialog */}
      <Dialog open={showVerifyDialog} onClose={() => setShowVerifyDialog(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <Paper variant="outlined" sx={{ p: 3, bgcolor: '#f8fafc' }}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Verify Your Email to Get Started
              </Typography>
              <Typography>
                We've sent a verification link to{' '}
                <Box component="span" sx={{ fontWeight: 600, color: 'green' }}>
                  {email}
                </Box>
                . Click the link to activate your account.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  onClick={() => { setShowVerifyDialog(false); setShowChangeEmailDialog(true); }}
                  variant="outlined"
                  sx={{ color: 'black' }}
                  disabled={isChangingEmail}
                >
                  Change Email Address
                </Button>
                <Button onClick={handleSendVerification} disabled={!canResend} variant="outlined" sx={{ color: 'black' }}>
                  {canResend ? 'ReSend Verification Email' : `Resend in ${countdown}s`}
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Button onClick={() => setShowVerifyDialog(false)} color="error">
                  SKIP FOR NOW
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showChangeEmailDialog}
        onClose={() => setShowChangeEmailDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'green', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
          Change Email Address
          <IconButton
            onClick={() => setShowChangeEmailDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Email"
            type="email"
            fullWidth
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowChangeEmailDialog(false)}>Cancel</Button>
          <Button
            onClick={handleChangeEmailSubmit}
            disabled={
              isChangingEmail ||
              !newEmail ||
              newEmail === email ||
              !/^\S+@\S+\.\S+$/.test(newEmail)
            }
            variant="contained"
            sx={{
              backgroundColor: '#FF5E00',
              '&:disabled': {
                backgroundColor: '#fff',
                opacity: 0.7,
                bgcolor: '#e0e0e0',
                color: '#666'
              }
            }}
          >
            {isChangingEmail ? 'Saving…' : 'Save & Send Verification'}
          </Button>
        </DialogActions>
      </Dialog>
      {snackbar && (
        <Snackbar
          open
          autoHideDuration={4000}
          onClose={() => setSnackbar(null)}
        >
          <Alert onClose={() => setSnackbar(null)} severity={snackbar.type} sx={{ width: '100%' }}>
            {snackbar.msg}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}