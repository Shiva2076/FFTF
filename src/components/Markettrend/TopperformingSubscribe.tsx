"use client";
import { FC, useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Dialog, Snackbar, Alert } from '@mui/material';
import Login from '@/components/Auth/Signin';
import Register from '@/components/Auth/Register';
import PriceModal from '@/components/Markettrend/Email/PriceModel';
import Primemember from '@/components/Markettrend/Email/Primemember';

interface Props {
  open: boolean;
  onClose: () => void;
  showPriceModal: boolean; // <-- new prop
}

const TopperformingcropsSubscribe: FC<Props> = ({
  open,
  onClose,
  showPriceModal,
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
      if (!isAuthenticated) {
        setOpenLogin(true);
      } else if (ismarkettrendsubscribed) {
        setShowSubscribedToast(true);
        onClose();
      } else if (showPriceModal) {
        setOpenPrice(true);
      }
    }
  }, [open, showPriceModal, isAuthenticated, ismarkettrendsubscribed]);

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

export default TopperformingcropsSubscribe;
