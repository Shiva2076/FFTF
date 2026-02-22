"use client";
import { FC, useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
  Grid,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/app/slices/authSlice";
import Primemember from "@/components/Markettrend/Email/Primemember";
import dynamic from "next/dynamic";

interface PriceModalProps {
  open: boolean;
  onClose: () => void;
  onSubscribeSuccess: () => void;
}

const PayPalSubscriptionButton = dynamic(
  () => import("@/components/settings/PaypalButton"),
  {
    ssr: false,
    loading: () => <Typography>Loading PayPal button…</Typography>,
  }
);

const bulletIcon = (
  <Image
    src="/apps/check.svg" // outlined‑circle bullet like in the design
    alt=""
    width={12}
    height={12}
    style={{ flexShrink: 0, marginTop: 2 }}
  />
);

const PriceModal: FC<PriceModalProps> = ({
  open,
  onClose,
  onSubscribeSuccess,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);

  const handleCloseAll = () => {
    setSuccess(false);
    onClose();
  };

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPALCLIENTID;
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if ((window as any).Calendly) {
        setCalendlyLoaded(true);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval); 
  }, []);
  return (
    <>
      {/* —————————————————  MAIN  ————————————————— */}
      <Dialog open={open} onClose={onClose} maxWidth="lg" >
        <DialogContent
          sx={{
            p: { xs: 3, sm: 4 },
            bgcolor: "#fff",
            border: "1px solid #d1d9e2",
            position: "relative",
            overflow: "visible",
            width:"650px"
          }}
        >
          {/* close icon */}
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            <Image
              src="/apps/close.svg"
              alt="close"
              width={24}
              height={24}
            />
          </Box>

          {/* header */}
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#008756", mb: 2 }}
          >
            Grow Smarter with INNOMarketTrend
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Why guess when you can know what to grow?
            <br />
            With INNOMarketTrend stay ahead with AI Market Insights — anticipate
            demand, optimize production, align farming with real‑time consumer
            needs through advanced predictive analytics.
          </Typography>

          {/* benefit bullets */}
          <Box component="ul" sx={{ pl: 3, color: "text.secondary", mb: 4 }}>
            {[
              "Reduce up to 25 % wastage from overproduction",
              "Increase yield profitability up to 20 % by aligning with real buyer demand",
              "Up to 25 % emissions cuts with streamlined production to create IMPACT",
            ].map((t) => (
              <Typography key={t} component="li" variant="body2">
                {t}
              </Typography>
            ))}
          </Box>

          {/* ----------- GRID ----------- */}
          <Grid container spacing={3}>
            {/* row‑1 : Premium + Enterprise */}
            <Grid item xs={12} md={6}>
              <CardPremium
                paypalClientId={paypalClientId as string}
                onSuccess={() => {
                  onClose();
                  setTimeout(() => setSuccess(true), 300);
                  onSubscribeSuccess();
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CardEnterprise />
            </Grid>

            {/* row‑2 : Breakdown (takes the same width as Premium) */}
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

      {/* success */}
      <Dialog open={success} onClose={handleCloseAll}>
        <Primemember onClose={handleCloseAll} />
      </Dialog>
    </>
  );
};

const CardPremium: FC<{
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
      Premium Plan
    </Typography>

    {/* price */}
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
        Or $4,999/year (save $989)
      </Typography>
    </Box>

    {/* feature list */}
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
      "Export Reports (PDF, XLS)",
      "WhatsApp Support",
    ].map((t) => (
      <Box key={t} sx={{ display: "flex", gap: 1 }}>
        {bulletIcon}
        <Typography variant="body2" color="text.secondary">
          {t}
        </Typography>
      </Box>
    ))}

    {/* actions */}
    <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
      <PayPalSubscriptionButton
        clientId={paypalClientId}
        planId="P-4YE7787934514324AM777UFI"
        onSubscribeSuccess={onSuccess}
      />
    </Box>
  </Box>
);

const CardEnterprise: FC = () => (
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
      Enterprise Plan
    </Typography>

    <Typography variant="h4" fontWeight={700} gutterBottom>
      Custom Pricing
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Custom price start from $1,499/month (12 Month Contract)
    </Typography>

    <Typography variant="body2" color="text.secondary">
      Ideal medium to large farms with multiple location & users, retail chains,
      Gov Program
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
      }}}
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
      Schedule Consultation
    </Button>
  </Box>
);

const CardBreakdown: FC = () => (
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
      Price Breakdown for Premium
    </Typography>

    {[
      ["Base Price:", "$1499/month"],
      ["Estimated Tax (VAT 5%):", "$74.95"],
      ["Paypal Processing Fee (3.5%):", "$52.46"],
    ].map(([l, r]) => (
      <Row key={l} left={l} right={r} />
    ))}

    <Divider sx={{ my: 1 }} />

    <Row left="Total Monthly Cost:" right="$541.42" bold />
  </Box>
);

const Row: FC<{
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

export default PriceModal;