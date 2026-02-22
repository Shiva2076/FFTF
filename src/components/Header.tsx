'use client';

import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogContent,
  Badge
} from '@mui/material';
import { styled } from '@mui/system';
import { LogoutOutlined, ArrowDropDown, Close } from '@mui/icons-material';
import { useState, useEffect, useRef, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { useLogoutMutation } from '../app/slices/usersApiSlice';
import { logout } from '../app/slices/authSlice';
import { useRouter, usePathname } from 'next/navigation';
import type { ButtonProps } from '@mui/material';
import Image from 'next/image';

import Register from '@/components/Auth/Register';
import Login from '@/components/Auth/Signin';

const SignInButton = styled((props: ButtonProps) => <Button {...props} />)({
  borderRadius: '4px',
  border: '1px solid rgba(0, 18, 25, 0.87)',
  padding: '0.5rem 1.375rem',
  textTransform: 'uppercase',
  fontWeight: 500,
  color: 'rgba(0, 18, 25, 0.87)',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(0, 18, 25, 0.1)',
  },
});

const RegisterButton = styled((props: ButtonProps) => <Button {...props} />)({
  borderRadius: '4px',
  padding: '0.5rem 1.375rem',
  textTransform: 'uppercase',
  fontWeight: 500,
  backgroundColor: '#ff5e00',
  color: '#f7f7f7',
  boxShadow:
    '0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    backgroundColor: '#e65100',
  },
});

const Header = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const growBasket = useSelector((state: RootState) => state.growBasket);

  const isAuthenticated = Boolean(userInfo?.user_id);
  const ismarkettrendsubscribed = Boolean(userInfo?.markettrendsubscribed);
  const cartCount = growBasket?.basket?.length || 0;
  const shouldDisableBasket = !isAuthenticated || !ismarkettrendsubscribed || cartCount === 0;

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [logoutApiCall] = useLogoutMutation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const userClosedModalRef = useRef(false);

  // Automatically open login modal if user is on /apps/markettrend and not authenticated
  useEffect(() => {
    if (pathname === '/markettrend' && !isAuthenticated && !openLogin && !openRegister && !userClosedModalRef.current) {
      setOpenLogin(true);
    }
    // Reset the flag when pathname changes away from markettrend
    if (pathname !== '/markettrend') {
      userClosedModalRef.current = false;
    }
  }, [pathname, isAuthenticated, openLogin, openRegister]);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenLogin = () => {
    setOpenRegister(false);
    setOpenLogin(true);
    userClosedModalRef.current = false; // Reset flag when manually opening
  };

  const handleOpenRegister = () => {
    setOpenLogin(false);
    setOpenRegister(true);
    userClosedModalRef.current = false; // Reset flag when manually opening
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
    userClosedModalRef.current = true; // Mark that user manually closed
  };
  const handleCloseRegister = () => {
    setOpenRegister(false);
    userClosedModalRef.current = true; // Mark that user manually closed
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      handleMenuClose(); // Close dropdown
      handleOpenLogin(); // Show login modal
      router.push('/markettrend'); // Redirect to /apps/markettrend
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#fff',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: 'none',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '1rem 1.5rem',
          }}
        >
          <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* Cart Icon */}
            <IconButton
                onClick={() => {
                  if (!shouldDisableBasket) {
                    router.push('/markettrend/grow-basket');
                  }
                }}
                disabled={shouldDisableBasket}
                sx={{ 
                  color: shouldDisableBasket ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 18, 25, 0.87)',
                  mr: 3,
                  cursor: shouldDisableBasket ? 'not-allowed' : 'pointer',
                  opacity: shouldDisableBasket ? 0.4 : 1,
                }}
              >
              <Badge badgeContent={cartCount} color="error" overlap="rectangular">
                <Image
                  src="/apps/cart.svg"
                  alt="Cart"
                  width={24}
                  height={24}
                  style={{ objectFit: 'contain' }}
                />
              </Badge>
            </IconButton>
            {userInfo ? (
              <>
                <Button
                  onClick={handleMenuClick}
                  endIcon={<ArrowDropDown />}
                  sx={{ color: 'rgba(0, 18, 25, 0.87)', textTransform: 'none' }}
                >
                  {userInfo.username }
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      router.push('/accountsettings');
                    }}
                  >Account Settings</MenuItem>
                  <MenuItem onClick={logoutHandler}>
                    <LogoutOutlined fontSize="small" sx={{ marginRight: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <SignInButton onClick={handleOpenLogin}>Sign In</SignInButton>
                <RegisterButton onClick={handleOpenRegister}>Register Now</RegisterButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Login Dialog */}
      <Dialog open={openLogin} onClose={handleCloseLogin} maxWidth="xs" fullWidth>
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseLogin}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'grey.500' }}
          >
            <Close />
          </IconButton>
          <Login onClose={handleCloseLogin} onSwitch={handleOpenRegister} />
        </DialogContent>
      </Dialog>

      {/* Register Dialog */}
      <Register
        open={openRegister}
        onClose={handleCloseRegister}
        onSwitch={handleOpenLogin}
      />
    </>
  );
};

export default Header;