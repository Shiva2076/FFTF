"use client";
import { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Dialog,Snackbar, Alert } from '@mui/material';
import Login from '@/components/Auth/Signin';
import Register from '@/components/Auth/Register';
import PriceModal from '@/components/Markettrend/Email/PriceModel';
import Primemember from '@/components/Markettrend/Email/Primemember';

const MarketTrendSubscribe: FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [openPrime, setOpenPrime] = useState(false);
  const [showSubscribedToast, setShowSubscribedToast] = useState(false);

  const isAuthenticated = Boolean(userInfo?.user_id);
  const ismarkettrendsubscribed = Boolean(userInfo?.markettrendsubscribed);

  useEffect(() => {
    if (open) {
      if (isAuthenticated) {
        if (!ismarkettrendsubscribed) {
          setOpenPrice(true); // ✅ Show price modal
        } else {
          setShowSubscribedToast(true); // ✅ Show toast
          onClose(); // ✅ Already subscribed, no need to show anything
        }
      } else {
        setOpenLogin(true); // 🔐 Show login
      }
    }
  }, [open, isAuthenticated, ismarkettrendsubscribed]);
  

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
    onClose();
  };

  const handleOpenPriceModal = () => {
    setOpenLogin(false);
    setOpenRegister(false);
    setOpenPrice(true);
  };

  const handleSubscribeSuccess = () => {
    setOpenPrice(false);
    setOpenPrime(true);
  };

  return (
    <>
      <Dialog open={openLogin} onClose={handleCloseAll}>
        <Login onClose={handleCloseAll} onSwitch={handleOpenRegister} />
      </Dialog>

      <Dialog open={openRegister} onClose={handleCloseAll}>
        <Register open={openRegister} onClose={handleCloseAll} onSwitch={handleOpenLogin} />
      </Dialog>

      <PriceModal
        open={openPrice}
        onClose={handleCloseAll}
        onSubscribeSuccess={handleSubscribeSuccess}
      />

      <Dialog open={openPrime} onClose={handleCloseAll}>
        <Primemember onClose={handleCloseAll} />
      </Dialog>
      <Snackbar
        open={showSubscribedToast}
        autoHideDuration={4000}
        onClose={() => setShowSubscribedToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSubscribedToast(false)} severity="info" sx={{ width: '100%' }}>
          You’re already subscribed to Market Trend!
        </Alert>
      </Snackbar>
    </>
  );
};

export default MarketTrendSubscribe;
