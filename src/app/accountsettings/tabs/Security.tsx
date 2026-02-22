'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Link,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { api } from '@/constants';

export default function Security() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const passwordRequirements = [
    { text: 'Must be at least 8 characters long.', met: newPassword.length >= 8 },
    { text: 'Must include at least one uppercase letter (A-Z).', met: /[A-Z]/.test(newPassword) },
    { text: 'Must include at least one lowercase letter (a-z).', met: /[a-z]/.test(newPassword) },
    { text: 'Must include at least one number (0-9).', met: /\d/.test(newPassword) },
    { text: 'Must include at least one special character (!@#$%&*).', met: /[!@#$%&*]/.test(newPassword) }
  ];

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';
  const passwordsDontMatch = confirmPassword !== '' && newPassword !== confirmPassword;
  const canUpdate = currentPassword !== '' && allRequirementsMet && passwordsMatch;

  const canSendResetLink = resetEmail.trim() !== '' && isValidEmail(resetEmail);

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const valueWithoutSpaces = value.replace(/\s/g, '');
    setCurrentPassword(valueWithoutSpaces);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const valueWithoutSpaces = value.replace(/\s/g, '');
    setNewPassword(valueWithoutSpaces);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const valueWithoutSpaces = value.replace(/\s/g, '');
    setConfirmPassword(valueWithoutSpaces);
  };

  const handleUpdate = () => {
    if (canUpdate) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmUpdate = async () => {
    try {
      const response = await api.post('/api/users/reset-password', {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword
      });

      if (response.status === 200) {
        setSnackbarMessage('Password updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setSnackbarMessage(response.data.message || 'Failed to update password');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }

      setShowConfirmDialog(false);
    } catch (error: any) {
      console.error('Error updating password:', error);
      setSnackbarMessage(error.response?.data?.message || 'Something went wrong');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setShowConfirmDialog(false);
    }
  };


  const handleCancelUpdate = () => {
    setShowConfirmDialog(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordDialog(true);
  };

  const handleSendResetLink = async () => {
    if (!canSendResetLink) return;

    try {
      const response = await api.post('/api/users/forgot-password', { email: resetEmail });
      if (response.status === 200) {
        console.log('Reset link sent to:', resetEmail);
        setSnackbarMessage('Reset link sent to your email successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setShowForgotPasswordDialog(false);
        setResetEmail('');
      } else {
        console.error('Error:', response.data.message);
        setSnackbarMessage(response.data.message || 'Failed to send reset link');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error: any) {
      console.error('Error sending reset link:', error);
      setSnackbarMessage(error.response?.data?.message || 'Something went wrong while sending reset link');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };


  const handleCancelForgotPassword = () => {
    setShowForgotPasswordDialog(false);
    setResetEmail('');
  };
   const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
     {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: 24 }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: '100%',
            fontWeight: 500,
            '& .MuiAlert-message': {
              fontSize: '0.875rem'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #d1d5db',
          overflow: 'hidden',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ px: 3, py: 2 }}>Security</Typography>
      </Paper> 
       <Paper elevation={0} sx={{
        p: 3,
        borderRadius: '0 0 8px 8px',
        border: '1px solid rgba(0,0,0,0.12)',
        borderTop: 'none',
        bgcolor: 'white',
      }}>
        <Grid container spacing={6}>
          {/* Password Form */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {/* Current Password */}
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
                  Current Password
                </Typography>
                <TextField
                  fullWidth
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                  placeholder="Enter Current Password"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      '& fieldset': { borderColor: '#e0e0e0' },
                      '&:hover fieldset': { borderColor: '#bdbdbd' },
                      '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Stack direction="row" spacing={1} alignItems="center">
                          {currentPassword && (
                            <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                          )}
                          <Button
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            sx={{ minWidth: 'auto', p: 0.5, color: '#666' }}
                          >
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </Button>
                        </Stack>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* New Password */}
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
                  New Password
                </Typography>
                <TextField
                  fullWidth
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  placeholder="Enter New Password"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      '& fieldset': { borderColor: '#e0e0e0' },
                      '&:hover fieldset': { borderColor: '#bdbdbd' },
                      '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Stack direction="row" spacing={1} alignItems="center">
                          {newPassword && (
                            !allRequirementsMet ? 
                            (
                              <Cancel sx={{ color: 'error.main', fontSize: 20 }} />        
                               ):(
                              <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />                         
                             ) 
                          )}
                          <Button
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            sx={{ minWidth: 'auto', p: 0.5, color: '#666' }}
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </Button>
                        </Stack>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Confirm New Password */}
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
                  Confirm New Password
                </Typography>
                <TextField
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm New Password"
                  variant="outlined"
                  error={passwordsDontMatch}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      '& fieldset': { borderColor: passwordsDontMatch ? '#f44336' : '#e0e0e0' },
                      '&:hover fieldset': { borderColor: passwordsDontMatch ? '#f44336' : '#bdbdbd' },
                      '&.Mui-focused fieldset': { borderColor: passwordsDontMatch ? '#f44336' : '#4caf50' },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Stack direction="row" spacing={1} alignItems="center">
                          {passwordsMatch && confirmPassword && (
                            <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                          )}
                          {passwordsDontMatch && (
                            <Cancel sx={{ color: 'error.main', fontSize: 20 }} />
                          )}
                          <Button
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            sx={{ minWidth: 'auto', p: 0.5, color: '#666' }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </Button>
                        </Stack>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleForgotPassword}
                    sx={{
                      color: '#1976d2',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {/* Forgot Password? */}
                  </Link>
                </Box>

              </Box>

              {/* Update Button */}
              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={!canUpdate}
                sx={{
                  bgcolor: ' #FF5E00',
                  color: canUpdate ? 'white' : '#666',
                  fontWeight: 600,
                  py: 1.5,
                  px: 4,
                  borderRadius: 1,
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  alignSelf: 'flex-start',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: ' #FF5E00',
                    boxShadow: 'none'
                  },
                  '&:disabled': {
                    bgcolor: '#e0e0e0',
                    color: '#666'
                  }
                }}
              >
                UPDATE
              </Button>
            </Stack>
          </Grid>

          {/* Password Requirements */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                color: '#333',
                mb: 3,
                fontSize: '1.125rem'
              }}
            >
              Password Requirements:
            </Typography>
            <Stack spacing={2}>
              {passwordRequirements.map((requirement, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircle
                    sx={{
                      color: requirement.met ? 'success.main' : '#e0e0e0',
                      fontSize: 20,
                      mt: 0.1
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: requirement.met ? 'success.dark' : '#666',
                      lineHeight: 1.5,
                      fontSize: '0.875rem'
                    }}
                  >
                    {requirement.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <Dialog
          open={showConfirmDialog}
          onClose={handleCancelUpdate}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 2,
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, color: '#4caf50', pb: 1 }}>
            Confirm Password Change
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
              You are about to update your password. Please make sure to remember your new password, as you will need it for your next login. Would you like to proceed?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: 2, pt: 2 }}>
            <Button
              onClick={handleCancelUpdate}
              variant="outlined"
              sx={{
                color: '#666',
                borderColor: '#e0e0e0',
                px: 3,
                py: 1,
                textTransform: 'uppercase',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#bdbdbd',
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              CANCEL
            </Button>
            <Button
              onClick={handleConfirmUpdate}
              variant="contained"
              sx={{
                bgcolor: ' #FF5E00',
                color: 'white',
                px: 3,
                py: 1,
                textTransform: 'uppercase',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: ' #FF5E00',
                  boxShadow: 'none'
                }
              }}
            >
              UPDATE PASSWORD
            </Button>
          </DialogActions>
        </Dialog>

        {/* Forgot Password Dialog */}
        <Dialog
          open={showForgotPasswordDialog}
          onClose={handleCancelForgotPassword}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 2,
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, color: 'green', pb: 1, position: 'relative' }}>
            Forgot Password?
            <IconButton
              onClick={handleCancelForgotPassword}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: '#666',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  color: '#333'
                }
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6, mb: 3 }}>
              Enter your email address and we'll send you a reset link.
            </Typography>
            <TextField
              fullWidth
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter your email address"
              variant="outlined"
              error={resetEmail.trim() !== '' && !isValidEmail(resetEmail)}
              helperText={resetEmail.trim() !== '' && !isValidEmail(resetEmail) ? 'Please enter a valid email address' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '& fieldset': {
                    borderColor: resetEmail.trim() !== '' && !isValidEmail(resetEmail) ? '#f44336' : '#e0e0e0'
                  },
                  '&:hover fieldset': {
                    borderColor: resetEmail.trim() !== '' && !isValidEmail(resetEmail) ? '#f44336' : '#bdbdbd'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: resetEmail.trim() !== '' && !isValidEmail(resetEmail) ? '#f44336' : '#1976d2'
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {canSendResetLink && (
                      <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                    )}
                    {resetEmail.trim() !== '' && !isValidEmail(resetEmail) && (
                      <Cancel sx={{ color: 'error.main', fontSize: 20 }} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: 2, pt: 2 }}>
            <Button
              onClick={handleCancelForgotPassword}
              variant="outlined"
              sx={{
                color: '#666',
                borderColor: '#e0e0e0',
                px: 3,
                py: 1,
                textTransform: 'uppercase',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#bdbdbd',
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              CANCEL
            </Button>
            <Button
              onClick={handleSendResetLink}
              variant="contained"
              disabled={!canSendResetLink}
              sx={{
                bgcolor: '#FF5E00',
                color: 'white',
                px: 3,
                py: 1,
                textTransform: 'uppercase',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#FF5E00',
                  boxShadow: 'none'
                },
                '&:disabled': {
                  bgcolor: '#e0e0e0',
                  color: '#666'
                }
              }}
            >
              SEND RESET LINK
            </Button>
          </DialogActions>
        </Dialog>
        </Paper>
    </Box>
  );
}