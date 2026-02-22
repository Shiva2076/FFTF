'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/constants';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link');
      setLoading(false);
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await api.get(`/api/auth/verify-reset-token/${token}`);
      setValidToken(true);
      setUserEmail(response.data.email);
      setUsername(response.data.username);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid or expired reset link');
      setValidToken(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPasswordValidation({
      minLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    });
  }, [newPassword]);

  const isPasswordValid = Object.values(passwordValidation).every((v) => v);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/api/auth/reset-password', {
        token,
        newPassword,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push('/');
      }, 3000);

    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8f9fa',
        }}
      >
        <CircularProgress sx={{ color: '#FF5E00' }} />
      </Box>
    );
  }

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8f9fa',
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: 500,
            width: '100%',
            p: 4,
            textAlign: 'center',
          }}
        >
          <CheckCircle sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Password Reset Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your password has been successfully reset. You can now log in with your new password.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirecting to login page...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!validToken) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8f9fa',
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: 500,
            width: '100%',
            p: 4,
            textAlign: 'center',
          }}
        >
          <ErrorIcon sx={{ fontSize: 64, color: '#f44336', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Invalid Reset Link
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error || 'This password reset link is invalid or has expired.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
            sx={{
              bgcolor: '#FF5E00',
              '&:hover': { bgcolor: '#c2410c' },
            }}
          >
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8f9fa',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
          width: '100%',
          p: 4,
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Set New Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Welcome, {username}! Please set your new password to continue.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type={showNewPassword ? 'text' : 'password'}
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mb: 3, p: 2, bgcolor: '#f9fafb', borderRadius: 1 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Password must contain:
            </Typography>
            {[
              { key: 'minLength', label: 'At least 8 characters' },
              { key: 'hasUpperCase', label: 'One uppercase letter' },
              { key: 'hasLowerCase', label: 'One lowercase letter' },
              { key: 'hasNumber', label: 'One number' },
              { key: 'hasSpecialChar', label: 'One special character' },
            ].map(({ key, label }) => (
              <Typography
                key={key}
                variant="body2"
                sx={{
                  color: passwordValidation[key as keyof typeof passwordValidation]
                    ? '#4caf50'
                    : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {passwordValidation[key as keyof typeof passwordValidation] ? '✓' : '○'} {label}
              </Typography>
            ))}
          </Box>

          <TextField
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword !== '' && !passwordsMatch}
            helperText={
              confirmPassword !== '' && !passwordsMatch ? 'Passwords do not match' : ''
            }
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!isPasswordValid || !passwordsMatch || submitting}
            sx={{
              bgcolor: '#FF5E00',
              py: 1.5,
              textTransform: 'uppercase',
              fontWeight: 600,
              '&:hover': { bgcolor: '#c2410c' },
              '&:disabled': {
                bgcolor: '#e5e7eb',
                color: '#9ca3af',
              },
            }}
          >
            {submitting ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}