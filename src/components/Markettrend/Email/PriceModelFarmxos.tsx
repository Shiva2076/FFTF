"use client";
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import Primemember from "@/components/Markettrend/Email/Primemember";

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

interface PriceModelFarmxosProps {
  onSubscribeSuccess: () => void;
}

const PriceModelFarmxos: FC<PriceModelFarmxosProps> = ({ onSubscribeSuccess }) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [showSuccess, setShowSuccess] = useState(false);

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
      <Box
        sx={{
          p: { xs: 3, sm: 4 },
          bgcolor: "#fff",
          border: "1px solid #d1d9e2",
          borderRadius: 2,
          width: "90%",
          maxWidth: 1100,
          mx: "auto",
          my: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: "#008756", mb: 2 }}
        >
          Grow Smarter with INNOFarms.AI Technology
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Why guess when you can know what to grow?
          <br />
          With INNOMarketFarms.AI Technology stay ahead with AI Market Insights — anticipate
          demand, optimize production, align farming with real‑time consumer
          needs through advanced predictive analytics.
        </Typography>

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

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CardPremium
              paypalClientId={paypalClientId as string}
              onSuccess={() => {
                setShowSuccess(true);
                onSubscribeSuccess();
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardEnterprise />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ order: { xs: 3, md: 3 }, mt: isMdUp ? 0 : -1 }}
          >
            <CardBreakdown />
          </Grid>
        </Grid>
      </Box>

      {showSuccess && <Primemember onClose={() => setShowSuccess(false)} />}
    </>
  );
};

const CardPremium: FC<{
  paypalClientId: string;
  onSuccess: () => void;
}> = ({ paypalClientId, onSuccess }) => (
  <Box
    sx={{
      p: 1,
      border: "1px solid #d1d9e2",
      borderRadius: 1,
      display: "flex",
      flexDirection: "column",
      gap: 2,
      height: "100%",
    }}
  >
    <Typography fontWeight={600} color="#008756">
      Premium Plan
    </Typography>

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
        1499
      </Typography>
      <Typography component="span" sx={{ fontSize: "0.875rem" }}>
        $/Mo
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Or $16,999/year (save $989)
      </Typography>
    </Box>

    <Typography
      variant="subtitle2"
      sx={{ color: "#008756", fontWeight: 600, mt: 1 }}
    >
      FEATURES
    </Typography>
    {[
      "AI Market and Crop Trend Insights",
      "AI Crop ROI Planner",
      "Forecast & Price Alerts",
      "Dynamic Crop Calendar",
      "IOT Farm Automation",
      "Grow Smart Robotics", // ← this one stays normal
      "AI Crop Health Monitoring",
      "Agronomy and Tech Support",
    ].map((t) => {
      const isDefault = t === "Grow Smart Robotics";
    
      return (
        <Box key={t} sx={{ display: "flex", gap: 1 }}>
          <Image
            src="/apps/check.svg"
            alt=""
            width={12}
            height={12}
            style={{
              flexShrink: 0,
              marginTop: 2,
              filter: isDefault ? "none" : "invert(19%) sepia(97%) saturate(1041%) hue-rotate(92deg) brightness(95%) contrast(85%)", // dark green
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {t}
          </Typography>
        </Box>
      );
    })}

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
      p: 1,
      border: "1px solid #d1d9e2",
      borderRadius: 1,
      display: "flex",
      flexDirection: "column",
      gap: 2,
      height: "100%",
    }}
  >
    <Typography fontWeight={600} color="#008756">
      Enterprise Plan
    </Typography>

    <Typography variant="h4" fontWeight={700} gutterBottom>
      Custom Pricing
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Custom price (Based on Farm Size)
    </Typography>

    <Typography variant="body2" color="text.secondary">
      Ideal for medium to large farms, retail chains, or Gov programs
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

const CardBreakdown: FC = () => (
  <Box
    sx={{
      p: 1,
      border: "1px solid #d1d9e2",
      borderRadius: 1,
      display: "flex",
      flexDirection: "column",
      gap: 2,
      height: "100%",
    }}
  >
    <Typography fontWeight={600} color="#008756">
      Price Breakdown for Premium
    </Typography>

    {[
      ["Base Price:", "$1499/month"],
      ["Estimated Tax (VAT 5%):", "$74.95"],
      ["Paypal Processing Fee (3.5%):", "$52.46"],
    ].map(([l, r]) => (
      <Row key={l} left={l} right={r} />
    ))}

    <Divider sx={{ my: 1 }} />
    <Row left="Total Monthly Cost:" right="$1626.41" bold />
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

export default PriceModelFarmxos;
