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
  DialogContent
} from '@mui/material';
import { styled } from '@mui/system';
import { LogoutOutlined, ArrowDropDown, Close } from '@mui/icons-material';
import { useState, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { useLogoutMutation } from '../app/slices/usersApiSlice';
import { logout } from '../app/slices/authSlice';
import { useRouter } from 'next/navigation';
import type { ButtonProps } from '@mui/material';

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
  const isAuthenticated = Boolean(userInfo?.user_id);

  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutApiCall] = useLogoutMutation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenLogin = () => {
    setOpenRegister(false);
    setOpenLogin(true);
  };

  const handleOpenRegister = () => {
    setOpenLogin(false);
    setOpenRegister(true);
  };

  const handleCloseLogin = () => setOpenLogin(false);
  const handleCloseRegister = () => setOpenRegister(false);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      handleMenuClose();
      handleOpenLogin();
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
            {userInfo ? (
              <>
                <Button
                  onClick={handleMenuClick}
                  endIcon={<ArrowDropDown />}
                  sx={{ color: 'rgba(0, 18, 25, 0.87)', textTransform: 'none' }}
                >
                  {userInfo.username}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
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
