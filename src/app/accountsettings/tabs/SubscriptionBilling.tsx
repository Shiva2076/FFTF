'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogContent,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { setCredentials } from '@/app/slices/authSlice';
import { api } from '@/constants';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Primemember from '@/components/Markettrend/Email/Primemember';

interface UserInfo {
  user_id: string;
  username: string;
  email: string;
  role: string;
  verified: boolean;
  markettrendsubscribed: boolean;
  token?: string;
  usersubscription?: any[];
}

const PayPalSubscriptionButton = dynamic(
  () => import("@/components/settings/PaypalButton"),
  {
    ssr: false,
    loading: () => <Typography>Loading PayPal button…</Typography>,
  }
);

const bulletIcon = (
  <Image
    src="/apps/check.svg"
    alt=""
    width={12}
    height={12}
    style={{ flexShrink: 0, marginTop: 2 }}
  />
);

const SubscriptionBilling: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { userInfo } = useSelector((state: RootState) => state.auth);
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);

  const hasPremiumPlan = userInfo?.markettrendsubscribed || false;
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPALCLIENTID;

  useEffect(() => {
    const interval = setInterval(() => {
      if ((window as any).Calendly) {
        setCalendlyLoaded(true);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleCloseModal = () => {
    setShowUpgradeModal(false);
  };

  const handleSubscribeSuccess = () => {
    const updatedUserInfo: UserInfo = {
      ...userInfo!,
      markettrendsubscribed: true,
    };
    dispatch(setCredentials(updatedUserInfo));
    setShowUpgradeModal(false);
    setTimeout(() => setShowSuccessModal(true), 300);
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/users/cancel-subscription');
      console.log('Subscription cancelled:', response.data);
      
      const updatedUserInfo: UserInfo = {
        ...userInfo!,
        markettrendsubscribed: false,
      };
      dispatch(setCredentials(updatedUserInfo));
      
      setAlertMessage('Subscription cancelled successfully.');
      setTimeout(() => setAlertMessage(''), 5000);
    } catch (error) {
      console.error('Cancel subscription failed:', error);
      setAlertMessage('Failed to cancel subscription. Please try again.');
      setTimeout(() => setAlertMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {alertMessage && (
        <Alert 
          severity={alertMessage.includes('failed') || alertMessage.includes('Failed') ? 'error' : 'success'} 
          sx={{ mb: 2 }}
        >
          {alertMessage}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          px: 3,
          py: 2,
          border: '1px solid #d1d5db',
          overflow: 'hidden',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Subscription & Billing
        </Typography>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '0 0 8px 8px',
          border: '1px solid rgba(0,0,0,0.12)',
          borderTop: 'none',
          bgcolor: 'white',
        }}
      >
        {hasPremiumPlan ? (
          <>
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(0, 18, 25, 0.04)' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Premium Plan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This plan is designed for professionals and businesses seeking data-driven strategies to
                maximize profits.
              </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(0, 18, 25, 0.04)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Next Payment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    14 March 2025
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 30, height: 20, bgcolor: '#FF5F00', borderRadius: '4px 0 0 4px' }} />
                  <Box sx={{ width: 30, height: 20, bgcolor: '#EB001B', borderRadius: '0 4px 4px 0' }} />
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    •••• •••• •••• 3912
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  flex: 1,
                  borderColor: '#d1d5db',
                  color: '#374151',
                  '&:hover': { borderColor: '#9ca3af' }
                }}
              >
                Premium Plan
                <Box component="span" sx={{ ml: 'auto' }}>→</Box>
              </Button>
            </Box>

            <Button
              variant="outlined"
              sx={{
                flex: 1,
                mt: 2,
                borderColor: '#d1d5db',
                color: '#374151',
                '&:hover': { borderColor: '#9ca3af' }
              }}
              fullWidth
            >
              View Payment History
              <Box component="span" sx={{ ml: 'auto' }}>→</Box>
            </Button>

            <Button
              variant="outlined"
              color="error"
              sx={{ width: '100%', mt: 2 }}
              onClick={handleCancelSubscription}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'CANCEL SUBSCRIPTION'}
            </Button>
          </>
        ) : (
          <>
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(0, 18, 25, 0.04)' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Free Plan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This plan is ideal for users who need a quick market overview but do not require in-depth
                analysis.
              </Typography>
            </Paper>

            <Button
              variant="contained"
              sx={{
                bgcolor: '#FF5E00',
                color: 'white',
                width: '100%',
                py: 1.5,
                fontWeight: 600,
                textTransform: 'uppercase',
                '&:hover': { bgcolor: '#e04e00' }
              }}
              onClick={handleUpgradeClick}
            >
              Upgrade Plan
            </Button>
          </>
        )}
      </Paper>

      <Dialog open={showUpgradeModal} onClose={handleCloseModal} maxWidth="lg">
        <DialogContent
          sx={{
            p: { xs: 3, sm: 4 },
            bgcolor: "#fff",
            border: "1px solid #d1d9e2",
            position: "relative",
            overflow: "visible",
            width: "650px"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              cursor: "pointer",
            }}
            onClick={handleCloseModal}
          >
            <Image
              src="/apps/close.svg"
              alt="close"
              width={24}
              height={24}
            />
          </Box>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#008756", mb: 2 }}
          >
            Grow Smarter with INNOMarketTrend
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Why guess when you can know what to grow?
            <br />
            With INNOMarketTrend stay ahead with AI Market Insights — anticipate
            demand, optimize production, align farming with real‑time consumer
            needs through advanced predictive analytics.
          </Typography>

          {/* Benefit Bullets */}
          <Box component="ul" sx={{ pl: 3, color: "text.secondary", mb: 4 }}>
            {[
              "Reduce up to 25% wastage from overproduction",
              "Increase yield profitability up to 20% by aligning with real buyer demand",
              "Up to 25% emissions cuts with streamlined production to create IMPACT",
            ].map((t) => (
              <Typography key={t} component="li" variant="body2">
                {t}
              </Typography>
            ))}
          </Box>

          {/* Plans Grid */}
          <Grid container spacing={3}>
            {/* Premium Plan */}
            <Grid item xs={12} md={6}>
              <CardPremium
                paypalClientId={paypalClientId as string}
                onSuccess={handleSubscribeSuccess}
              />
            </Grid>

            {/* Enterprise Plan */}
            <Grid item xs={12} md={6}>
              <CardEnterprise calendlyLoaded={calendlyLoaded} />
            </Grid>

            {/* Price Breakdown */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{ order: { xs: 3, md: 3 }, mt: isMdUp ? 0 : -1 }}
            >
              <CardBreakdown />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <Primemember onClose={() => setShowSuccessModal(false)} />
      </Dialog>
    </Box>
  );
};

// Premium Plan Card Component
const CardPremium: React.FC<{
  paypalClientId: string;
  onSuccess: () => void;
}> = ({ paypalClientId, onSuccess }) => (
  <Box
    sx={{
      p: 3,
      border: "1px solid #d1d9e2",
      borderRadius: 1,
      display: "flex",
      flexDirection: "column",
      gap: 2,
      height: "90%",
    }}
  >
    <Typography fontWeight={600} color="#008756">
      Premium Plan
    </Typography>

    {/* Price */}
    <Box sx={{ lineHeight: 1 }}>
      <Typography
        component="span"
        sx={{
          fontSize: "3.5rem",
          fontWeight: 700,
          lineHeight: 1,
          mr: 0.5,
        }}
      >
        499
      </Typography>
      <Typography component="span" sx={{ fontSize: "0.875rem" }}>
        $/Mo
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Or $4,999/year (save $989)
      </Typography>
    </Box>

    {/* Features */}
    <Typography
      variant="subtitle2"
      sx={{ color: "#008756", fontWeight: 600, mt: 1 }}
    >
      FEATURES
    </Typography>
    {[
      "All Market & Crop Trends",
      "AI Crop ROI Planner",
      "Forecast & Price Alerts",
      "Export Reports (PDF, XLS)",
      "WhatsApp Support",
    ].map((t) => (
      <Box key={t} sx={{ display: "flex", gap: 1 }}>
        {bulletIcon}
        <Typography variant="body2" color="text.secondary">
          {t}
        </Typography>
      </Box>
    ))}

    {/* PayPal Button */}
    <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
      <PayPalSubscriptionButton
        clientId={paypalClientId}
        planId="P-4YE7787934514324AM777UFI"
        onSubscribeSuccess={onSuccess}
      />
    </Box>
  </Box>
);

// Enterprise Plan Card Component
const CardEnterprise: React.FC<{ calendlyLoaded: boolean }> = ({ calendlyLoaded }) => (
  <Box
    sx={{
      p: 3,
      border: "1px solid #d1d9e2",
      borderRadius: 1,
      display: "flex",
      flexDirection: "column",
      gap: 2,
      height: "90%",
    }}
  >
    <Typography fontWeight={600} color="#008756">
      Enterprise Plan
    </Typography>

    <Typography variant="h4" fontWeight={700} gutterBottom>
      Custom Pricing
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Custom price start from $1,499/month (12 Month Contract)
    </Typography>

    <Typography variant="body2" color="text.secondary">
      Ideal medium to large farms with multiple location & users, retail chains,
      Gov Program
    </Typography>

    <Typography
      variant="subtitle2"
      sx={{ color: "#008756", fontWeight: 600, mt: 1 }}
    >
      FEATURES
    </Typography>
    {[
      "Everything in Premium",
      "Multi‑user Dashboard",
      "API & ERP Integration",
      "Dedicated Onboarding",
      "Account Manager",
    ].map((t) => (
      <Box key={t} sx={{ display: "flex", gap: 1 }}>
        {bulletIcon}
        <Typography variant="body2" color="text.secondary">
          {t}
        </Typography>
      </Box>
    ))}

    <Button
      onClick={() => {
        if ((window as any).Calendly) {
          (window as any).Calendly.initPopupWidget({
            url: "https://calendly.com/innofarmsai89/30min",
          });
        } else {
          console.warn("Calendly widget not ready yet.");
        }
      }}
      sx={{
        mt: "auto",
        bgcolor: "#ff5e00",
        color: "#fff",
        fontWeight: 500,
        textTransform: "uppercase",
        "&:hover": { bgcolor: "#e55300" },
      }}
      fullWidth
    >
      Schedule Consultation
    </Button>
  </Box>
);

const CardBreakdown: React.FC = () => (
  <Box
    sx={{
      p: 3,
      border: "1px solid #d1d9e2",
      borderRadius: 1,
      display: "flex",
      flexDirection: "column",
      gap: 2,
      height: "80%",
    }}
  >
    <Typography fontWeight={600} color="#008756">
      Price Breakdown for Premium
    </Typography>

    {[
      ["Base Price:", "$499/month"],
      ["Estimated Tax (VAT 5%):", "$24.95"],
      ["PayPal Processing Fee (3.5%):", "$17.47"],
    ].map(([l, r]) => (
      <Row key={l} left={l} right={r} />
    ))}

    <Divider sx={{ my: 1 }} />

    <Row left="Total Monthly Cost:" right="$541.42" bold />
  </Box>
);

const Row: React.FC<{
  left: string;
  right: string;
  bold?: boolean;
}> = ({ left, right, bold }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
    <Typography variant="body2" color="text.secondary" fontWeight={bold ? 600 : 400}>
      {left}
    </Typography>
    <Typography variant="body2" fontWeight={bold ? 600 : 400}>
      {right}
    </Typography>
  </Box>
);

export default SubscriptionBilling;