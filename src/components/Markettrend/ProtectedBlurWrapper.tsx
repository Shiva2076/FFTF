'use client';

import { FC, ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Box, Button, Dialog } from '@mui/material';
import Login from '@/components/Auth/Signin';
import Register from '@/components/Auth/Register';
import PriceModal from '@/components/Markettrend/Email/PriceModel';
import Primemember from '@/components/Markettrend/Email/Primemember';

interface Props {
  children: ReactNode;
}

const ProtectedBlurWrapper: FC<Props> = ({ children }) => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [openPrime, setOpenPrime] = useState(false); // ✅ Success modal

  const isAuthenticated = Boolean(userInfo?.user_id);
  const ismarkettrendsubscribed = Boolean(userInfo?.markettrendsubscribed);
  const shouldBlur = !isAuthenticated || !ismarkettrendsubscribed;

  const handleOpenLogin = () => {
    setOpenRegister(false);
    setOpenLogin(true);
  };

  const handleOpenRegister = () => {
    setOpenLogin(false);
    setOpenRegister(true);
  };

  const handleCloseAll = () => {
    setOpenLogin(false);
    setOpenRegister(false);
    setOpenPrice(false);
    setOpenPrime(false);
  };

  const handleOpenPriceModal = () => {
    setOpenLogin(false);
    setOpenRegister(false);
    setOpenPrice(true);
  };

  const handleSubscribeSuccess = () => {
    setOpenPrice(false);
    setOpenPrime(true); // ✅ open success modal
  };

  const renderButton = () => {
    if (!isAuthenticated) {
      return (
        <Button onClick={handleOpenLogin} sx={buttonStyle}>
          Sign In
        </Button>
      );
    }
    if (!ismarkettrendsubscribed) {
      return (
        <Button onClick={handleOpenPriceModal} sx={buttonStyle}>
          Get Full Access
        </Button>
      );
    }
    return null;
  };

  return (
    <Box sx={{ position: 'relative',width: '100%', height: '100%' }}>
      <Box
        sx={{
          filter: shouldBlur ? 'blur(6px)' : 'none',
          pointerEvents: shouldBlur ? 'none' : 'auto',
          transition: '0.3s ease',
        }}
      >
        {children}
      </Box>

      {shouldBlur && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          {renderButton()}
        </Box>
      )}

      {/* Modals */}
      <Dialog open={openLogin} onClose={handleCloseAll}>
        <Login onClose={handleCloseAll} onSwitch={handleOpenRegister} />
      </Dialog>

      <Dialog open={openRegister} onClose={handleCloseAll}>
        <Register open={openRegister} onClose={handleCloseAll} onSwitch={handleOpenLogin} />
      </Dialog>

      {/* ✅ PriceModal handles its own <Dialog> */}
      <PriceModal
        open={openPrice}
        onClose={handleCloseAll}
        onSubscribeSuccess={handleSubscribeSuccess}
      />

      {/* ✅ Success Modal */}
      <Dialog open={openPrime} onClose={handleCloseAll}>
        <Primemember onClose={handleCloseAll} />
      </Dialog>

    </Box>
  );
};

const buttonStyle = {
  backgroundColor: '#ff5e00',
  color: '#fff',
  fontWeight: 600,
  textTransform: 'uppercase',
  padding: '0.75rem 1.5rem',
  '&:hover': {
    backgroundColor: '#e65500',
  },
};

export default ProtectedBlurWrapper;
