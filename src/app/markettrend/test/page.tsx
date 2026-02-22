"use client";
import { NextPage } from "next";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { api } from "@/constants";

const PriceModal: NextPage = () => {
  return (
    <Dialog open={true} fullWidth maxWidth="md">
      <DialogContent
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          bgcolor: "#fff",
          border: "1px solid #d1d9e2",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <Box
          sx={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            cursor: "pointer",
          }}
        >
          <Image src="/apps/close.svg" alt="Close" width={24} height={24} />
        </Box>

        {/* Header */}
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#008756", mb: 1 }}
        >
          Stay ahead with market trends!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gain real-time insights, make data-driven decisions, and maximize
          farm profitability.
        </Typography>

        {/* Billing Toggle Tabs */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
            mb: 3,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              border: "1px solid #d1d9e2",
              borderRadius: 2,
              overflow: "hidden",
              maxWidth: 320,
              width: "100%",
            }}
          >
            <Button
              sx={{
                flex: 1,
                fontWeight: "bold",
                borderRadius: 0,
                bgcolor: "#fff",
                color: "#000",
              }}
            >
              Monthly Billing
            </Button>
            <Button
              sx={{
                flex: 1,
                fontWeight: "bold",
                borderRadius: 0,
                bgcolor: "#fff8f3",
                color: "#ff5e00",
                borderBottom: "3px solid #ff5e00",
              }}
            >
              Annually Billing
            </Button>
          </Box>
        </Box>

        {/* Plans */}
        <Grid container spacing={3}>
          {/* Free Plan */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: "1px solid #d1d9e2",
                borderRadius: 2,
                textAlign: "left",
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Free Plan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This plan is ideal for users who need a quick market overview
                but do not require in-depth analysis.
              </Typography>

              {/* Price */}
              <Box sx={{ display: "flex", alignItems: "flex-end", mt: 2 }}>
                <Typography variant="h6" fontWeight="bold" mr={0.5}>
                  $
                </Typography>
                <Typography variant="h3" color="#008756" fontWeight="bold">
                  0
                </Typography>
                <Typography variant="body2" ml={0.5}>
                  /Mo
                </Typography>
              </Box>

              {/* Current Plan Button */}
              <Button
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: "#e0e0e0",
                  color: "#757575",
                  fontWeight: "bold",
                  borderRadius: 1,
                  textTransform: "none",
                }}
              >
                Current Plan
              </Button>

              {/* Features */}
              <Typography
                variant="body2"
                color="#008756"
                mt={3}
                fontWeight="bold"
              >
                FEATURES
              </Typography>
              {[
                "Basic Market Trends",
                "Short-Term Demand Data",
                "7-Day Price History",
                "Basic Competitor Comparison",
                "Standard Support",
              ].map((feature, index) => (
                <Box key={index} display="flex" alignItems="center" mt={1}>
                  <Image src="/apps/check.svg" alt="Check" width={16} height={16} />
                  <Typography ml={1} variant="body2">
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Premium Plan */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: "1px solid #d1d9e2",
                borderRadius: 2,
                textAlign: "left",
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Premium Plan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This plan is designed for professionals and businesses seeking
                data-driven strategies to maximize profits.
              </Typography>

              {/* Price */}
              <Box sx={{ display: "flex", alignItems: "flex-end", mt: 2 }}>
                <Typography variant="h6" fontWeight="bold" mr={0.5}>
                  $
                </Typography>
                <Typography variant="h3" color="#008756" fontWeight="bold">
                  199
                </Typography>
                <Typography variant="body2" ml={0.5}>
                  /Mo
                </Typography>
              </Box>

              {/* Upgrade Button */}
              <Button
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: "#ff5e00",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: 1,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#e04e00" },
                }}
                onClick={async () => {
                  try {
                    const response = await api.get("/api/users/subscribe");
                    console.log("Subscription successful:", response.data);
                    // Optionally close modal or show success message here
                  } catch (error) {
                    console.error("Subscription failed:", error);
                    // Optionally show error message
                  }
                }}
              >
                Upgrade to Premium
              </Button>

              {/* Features */}
              <Typography
                variant="body2"
                color="#008756"
                mt={3}
                fontWeight="bold"
              >
                FEATURES
              </Typography>
              {[
                "Full Market Insights",
                "Advanced Demand Forecasting",
                "12-Month Price History",
                "Competitor & Regional Pricing",
                "Smart Cost & Planting Strategies",
                "Priority Support",
              ].map((feature, index) => (
                <Box key={index} display="flex" alignItems="center" mt={1}>
                  <Image src="/apps/check.svg" alt="Check" width={16} height={16} />
                  <Typography ml={1} variant="body2">
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PriceModal;
