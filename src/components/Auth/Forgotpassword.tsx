'use client';
import { useState } from 'react';
import {
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Typography, 
  TextField, 
  Button, 
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { api } from '@/constants';

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPassword({ open, onClose }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isEmailValid = isValidEmail(email);

  const handleClose = () => {
    setEmail('');
    setMessage('');
    setError('');
    setLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!isEmailValid) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/api/users/forgot-password', {
        email: email
      });

      if (response.status === 200) {
        setMessage('Password reset instructions have been sent to your email address.');
      } else {
        setError(response.data.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative'
      }}>
        <Typography  color="#008756">
          Reset Password
        </Typography>
        <IconButton 
          onClick={handleClose}
          sx={{ 
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your email address and we'll send you instructions to reset your password.
        </Typography>
        
        <TextField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {message && (
          <Typography color="success.main" variant="body2" sx={{ mb: 2 }}>
            {message}
          </Typography>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !isEmailValid}
          sx={{ 
            backgroundColor: isEmailValid ? '#ff5e00' : '#ccc',
            '&:hover': {
              backgroundColor: isEmailValid ? '#e55100' : '#ccc'
            },
            '&:disabled': {
              backgroundColor: '#ccc',
              color: '#999'
            }
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}