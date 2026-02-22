
'use client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '@/app/slices/usersApiSlice';
import { setCredentials } from '@/app/slices/authSlice';
import { checkMarketTrendSubscription } from '@/utils/utilsfuntions';
import ForgotPassword from './Forgotpassword';

interface Props {
  onClose: () => void;
  onSwitch: () => void;
}
export default function Login({ onClose, onSwitch }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const redirect = searchParams.get('redirect') || (pathname !== '/auth/login' ? pathname : '/farmsxos');
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state: any) => state.auth);
  useEffect(() => {
    if (userInfo) {
      router.push(redirect);
      onClose();
    }
  }, [userInfo]);
  const handleLogin = async () => {
    try {
      const res = await login({ email, password }).unwrap();
      // Ensure it matches the UserInfo interface
      if (res.token) {
        localStorage.setItem('token', res.token);
      } else {
        console.warn('⚠️ No token in response!');
      }
      
      const markettrendsubscription = checkMarketTrendSubscription(res?.usersubscription || []);
      const userInfo = {
        user_id: res.user_id || '',
        username: res.username || '',
        email: res.email || '',
        role: res.role || 'user',
        user_type: res.user_type || 'primary', 
        verified: res.verified || false,
        phone_code: res.phone_code || '',
        phone_number: res.phone_number || '',
        markettrendsubscribed: markettrendsubscription || false,
        token: res.token || '', // ← UNCOMMENT THIS
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      dispatch(setCredentials(userInfo));
      router.push(redirect);
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err?.data?.message || err?.error || 'Login failed');
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
  };

  return (
    <>
      {forgotPasswordOpen ? (
        <ForgotPassword 
          open={forgotPasswordOpen} 
          onClose={handleForgotPasswordClose} 
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            margin: '0 auto',
            backgroundColor: '#fff',
            padding: '1.5rem 1.5rem',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '1.5rem',
            overflowX: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" component="div" sx={{ mb: 1 }}>
              <span style={{ fontWeight: 'bold', color: '#008756' }}>Welcome</span>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Log in to access your INNOFarms.AI dashboard and stay ahead with real-time insights.
            </Typography>
          </Box>       
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ width: '100%' }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={{ width: '100%' }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    <VisibilityIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>         
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}       
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ width: '100%', padding: '0.75rem' }}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>        
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500, 
              cursor: 'pointer', 
              textAlign: 'center', 
              width: '100%' 
            }} 
            onClick={handleForgotPassword}
          >
            <span style={{ color: '#ff5e00', textDecoration: 'underline' }}>
              Forgot password?
            </span>
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500, 
              cursor: 'pointer', 
              textAlign: 'center', 
              width: '100%' 
            }} 
            onClick={onSwitch}
          >
            Don't have an account? <span style={{ color: '#ff5e00', textDecoration: 'underline' }}>Sign Up</span>
          </Typography>
        </Box>
      )}
    </>
  );
}