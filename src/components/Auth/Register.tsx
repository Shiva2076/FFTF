'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  InputAdornment,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { api } from "@/constants";

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
// Add this at the top of your component or in a custom `declarations.d.ts` file
declare module 'react-phone-input-2' {
  interface PhoneInputProps {
    separateDialCode?: boolean;
  }
}
interface CountryData {
  name: string;
  dialCode: string;
  countryCode: string;
  format: string;
}
interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSwitch: () => void;
}


const Register = ({ open, onClose, onSwitch }: RegisterModalProps) => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [localNumber, setLocalNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const errorBoxRef = useRef<HTMLDivElement>(null);
  
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Reset all fields
  const resetForm = () => {
    setName('');
    setCountryCode('');
    setLocalNumber('');
    setPhone('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
    setFieldErrors({});
    setLoading(false);
  };

  // Reset form and close modal
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setError('');
    setFieldErrors({});
    
    // Validate all required fields
    const errors: typeof fieldErrors = {};
    if (!name.trim()) {
      errors.name = 'Full Name is required';
    }
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (!email.trim()) {
      errors.email = 'Email Address is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    }
    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to error box after a brief delay to ensure it's rendered
      setTimeout(() => {
        errorBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(`/api/users`, {
        name,
        email,
        countryCode,
        phone: localNumber,
        password,
      });

      console.log('Registered:', response.data);

      resetForm();
      onClose();
      onSwitch();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
      // Scroll to error box after a brief delay to ensure it's rendered
      setTimeout(() => {
        errorBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '1.6rem',
          color: '#058c42',
          paddingTop: '1.5rem',
        }}
      >
        Create your Account
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 4, pt: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            textAlign: 'center',
            fontSize: '0.95rem',
            color: '#444',
          }}
        >
          Get real-time market insights, AI recommendations, and farm optimization tools.
        </Typography>

        <Box display="flex" flexDirection="column" gap="1.5rem">
          <TextField
            label="Full Name"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name || error) {
                setFieldErrors({ ...fieldErrors, name: undefined });
                setError('');
              }
            }}
            required
            size="medium"
          />
          <PhoneInput
            country={'in'}
            separateDialCode={true}
            value={phone}
            onChange={(value: string, data: CountryData) => {
              setPhone(value);
              setCountryCode(data.dialCode);
              setLocalNumber(value.slice(data.dialCode.length));
              if (fieldErrors.phone || error) {
                setFieldErrors({ ...fieldErrors, phone: undefined });
                setError('');
              }
            }}
            inputProps={{
              name: 'phone',
              required: true,
              autoFocus: false,
            }}
            enableSearch
            inputStyle={{
              width: '100%',
              height: '56px',
              fontSize: '16px',
              paddingLeft: '75px',
              borderRadius: '4px',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              boxShadow: 'none',
            }}
            buttonStyle={{
              border: 'none',
              background: 'transparent',
              borderRight: '1px solid #ccc',
              marginRight: '8px',
            }}
            containerStyle={{
              width: '100%',
            }}
          />
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email || error) {
                setFieldErrors({ ...fieldErrors, email: undefined });
                setError('');
              }
            }}
            required
            size="medium"
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password || error) {
                setFieldErrors({ ...fieldErrors, password: undefined });
                setError('');
              }
            }}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      console.log("toggling password", !showPassword);
                      setShowPassword((prev) => !prev);
                    }}
                    edge="end"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword || error) {
                setFieldErrors({ ...fieldErrors, confirmPassword: undefined });
                setError('');
              }
            }}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      console.log("toggling confirmPassword", !showConfirmPassword);
                      setShowConfirmPassword((prev) => !prev);
                    }}
                    edge="end"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {(Object.values(fieldErrors).filter(Boolean).length > 0 || error) && (
            <Box
              ref={errorBoxRef}
              sx={{
                mt: -1,
                p: 1.5,
                borderRadius: '4px',
                backgroundColor: '#ffebee',
                border: '1px solid #ef5350',
              }}
            >
              <Typography color="error" variant="body2" sx={{ fontSize: '0.875rem' }}>
                {Object.values(fieldErrors).filter(Boolean)[0] || error}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          flexDirection: 'column',
          gap: 2,
          px: 4,
          pb: 4,
          pt: 3,
        }}
      >
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ fontSize: '0.8rem', color: '#666' }}
        >
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            padding: '0.75rem',
            borderRadius: '6px',
            fontWeight: 600,
            textTransform: 'uppercase',
            backgroundColor: '#ff5e00',
            color: '#000',
            '&:hover': {
              backgroundColor: '#e65300',
            },
          }}
        >
          {loading ? (<CircularProgress size={24} color="inherit" />) : (
            <Typography sx={{ color: "#fff", fontWeight: 600 }}>SIGN UP</Typography>
          )}
        </Button>

        {/* <Button
          variant="outlined"
          fullWidth
          sx={{
            padding: '0.75rem',
            borderRadius: '6px',
            fontWeight: 600,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.2,
          }}
        >
          <Image src="/google.svg" alt="Google" width={22} height={22} />
          Sign up with Google
        </Button> */}

        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: '0.9rem',
          }}
        >
          Already have an account?{' '}
          <span
            style={{
              color: '#ff5e00',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => {
              resetForm();
              onClose();
              onSwitch();
            }}
          >
            Log in
          </span>
        </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default Register;
