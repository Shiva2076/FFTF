"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  useGetLatestUserActivationQuery,
} from "@/app/slices/enterpriseApiSlice";
import EnterpriseWizard from "@/components/Enterprise/EnterpriseWizard";
import ActivationStatusBar from "@/components/Enterprise/ActivationStatusBar";
import {
  Box,
  Typography,
  Dialog,
  Container,
  Tooltip,
  CircularProgress,
  Alert,
  Paper,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Login from "@/components/Auth/Signin";
import Register from "@/components/Auth/Register";
import BannerWithPagination from "@/components/Markettrend/MarketOverview/Bannerwithpagination";
import Currentdatetime from "@/components/dashboard/helper/Currentdatetime";

type AuthModal = "closed" | "login" | "register";

interface TabItem {
  label: string;
  shortLabel?: string;
  key: string;
  disabled: boolean;
  tooltip?: string;
}

const TERMINAL_STATUSES = ["invitations_sent", "pilot_requested", "completed"];
const IN_PROGRESS_STATUSES = [
  "draft",
  "details_added",
  "method_selected",
  "farms_added",
];

export default function EnterpriseActivationPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const isAuthenticated = Boolean(userInfo?.user_id);
  const [authModal, setAuthModal] = React.useState<AuthModal>(isAuthenticated ? "closed" : "register");
  const [activeTab, setActiveTab] = React.useState("overview");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const {
    data: latestResponse,
    isLoading,
    isError,
    refetch: refetchLatest,
  } = useGetLatestUserActivationQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  const latestActivation = latestResponse?.data ?? null;
  const showStatusBar = latestActivation && TERMINAL_STATUSES.includes(latestActivation.status);

  const tabs: TabItem[] = [
    { label: "Overview", key: "overview", disabled: false },
    {
      label: "Supply Intelligence",
      shortLabel: "Supply",
      key: "supply-intelligence",
      disabled: true,
      tooltip: "Complete activation to unlock",
    },
    {
      label: "Traceability & Sustainability",
      shortLabel: "Traceability",
      key: "traceability",
      disabled: true,
      tooltip: "Complete activation to unlock",
    },
    {
      label: "Risk & Alerts",
      shortLabel: "Alerts",
      key: "risk-alerts",
      disabled: true,
      tooltip: "Complete activation to unlock",
    },
    {
      label: "Invite Farms",
      shortLabel: "Farms",
      key: "invite-farms",
      disabled: true,
      tooltip: "Complete activation to unlock",
    },
  ];

  if (!isAuthenticated) {
    return (
      <>
        <Box
          sx={{
            maxWidth: 900,
            mx: "auto",
            py: { xs: 4, md: 8 },
            px: { xs: 2, md: 3 },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Enterprise Supply Intelligence
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 4,
              fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" },
            }}
          >
            Connect market demand with real supply readiness across your supplier farms
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please login to activate Enterprise Supply Intelligence
          </Typography>
        </Box>
        <Dialog
          open={!isAuthenticated}
          onClose={() => router.push("/enterprise/innomarkettrend")}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
        >
          {authModal === "login" ? (
            <Login
              onClose={() => router.push("/enterprise/innomarkettrend")}
              onSwitch={() => setAuthModal("register")}
            />
          ) : (
            <Register
              open={true}
              onClose={() => router.push("/enterprise/innomarkettrend")}
              onSwitch={() => setAuthModal("login")}
            />
          )}
        </Dialog>
      </>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ my: 4 }} action={<Button onClick={refetchLatest}>Retry</Button>}>
          Failed to load your activation status
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ width: "100%", backgroundColor: "#fff", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Banner - hide on very small screens */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <BannerWithPagination />
        </Box>

        {/* Welcome Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            pt: { xs: 2, md: 4 },
            pb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                fontWeight: 700,
                fontFamily: "Poppins",
                color: "rgba(0, 18, 25, 0.87)",
                lineHeight: 1.2,
              }}
            >
              Welcome back, {userInfo?.username || "Guest"}!
            </Typography>
            <Box
              sx={{
                fontSize: { xs: "0.875rem", md: "1rem" },
                fontFamily: "Poppins",
                lineHeight: "200%",
                letterSpacing: "0.15px",
                color: "rgba(0, 18, 25, 0.6)",
              }}
            >
              <Currentdatetime />
            </Box>
          </Box>
        </Box>

        {/* Enterprise Intelligence Suite Header */}
        <Box
          sx={{
            py: { xs: 2, md: 2.5 },
            textAlign: "center",
            borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
            mb: { xs: 2, md: 3 },
          }}
        >
          <Typography
            sx={{
              textTransform: "uppercase",
              letterSpacing: { xs: "1.2px", md: "2.2px" },
              color: "rgba(0, 18, 25, 0.65)",
              fontWeight: 600,
              fontSize: { xs: "0.78rem", sm: "0.82rem", md: "0.95rem" },
              lineHeight: 1.4,
              fontFamily: "Poppins",
            }}
          >
            Enterprise Intelligence Suite
          </Typography>
          <Typography
            sx={{
              mt: { xs: 0.75, md: 1 },
              color: "rgba(0, 18, 25, 0.50)",
              fontWeight: 400,
              fontSize: { xs: "0.78rem", sm: "0.82rem", md: "0.92rem" },
              lineHeight: 1.5,
              letterSpacing: "0.3px",
              maxWidth: { md: "520px" },
              mx: "auto",
              fontFamily: "Poppins",
            }}
          >
            Unified Visibility Across Supplier Farms
          </Typography>
        </Box>

        {/* Tabs - FIXED: always left-aligned + better spacing */}
        <Box
          sx={{
            width: "100%",
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            overflow: "hidden",
            bgcolor: "#ffffff",
            mb: { xs: 2, md: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              justifyContent: "flex-start", // ← Changed: always start from left
              px: { xs: 2, sm: 3, md: 4 }, // ← More padding for better spacing
              minWidth: "100%", // Ensure full width
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <Tooltip
                  key={tab.key}
                  title={tab.tooltip || ""}
                  arrow
                  placement="bottom"
                  disableHoverListener={!tab.disabled}
                >
                  <Box
                    onClick={() => !tab.disabled && setActiveTab(tab.key)}
                    sx={{
                      position: "relative",
                      flexShrink: 0,
                      cursor: tab.disabled ? "not-allowed" : "pointer",
                      color: isActive
                        ? "#ff5e00"
                        : tab.disabled
                        ? "rgba(0, 18, 25, 0.38)"
                        : "rgba(0, 18, 25, 0.70)",
                      fontWeight: isActive ? 600 : 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
                      transition: "color 0.18s ease",
                      "&:hover": {
                        color: tab.disabled ? "rgba(0, 18, 25, 0.38)" : "#ff5e00",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        py: { xs: "12px", sm: "14px", md: "16px" }, // ← Slightly reduced on mobile
                        px: { xs: "14px", sm: "18px", md: "22px" }, // ← Reduced padding so more tabs fit
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "0.82rem", sm: "0.875rem", md: "0.94rem" },
                          lineHeight: "1.5",
                          fontFamily: "Poppins",
                        }}
                      >
                        {isMobile ? tab.shortLabel || tab.label : tab.label}
                      </Typography>
                    </Box>
                    {/* Thick orange underline */}
                    {isActive && !tab.disabled && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "3.5px",
                          backgroundColor: "#ff5e00",
                          borderRadius: "4px 4px 0 0",
                        }}
                      />
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>

        {/* Main Content Paper */}
        <Paper
          elevation={isMobile ? 1 : 3}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: { xs: 1, md: 2 },
            mb: { xs: 2, md: 0 },
          }}
        >
          {showStatusBar && latestActivation ? (
            <ActivationStatusBar
              activation={latestActivation}
            />
          ) : (
            <EnterpriseWizard
              initialActivation={latestActivation}
              onActivationComplete={refetchLatest}
            />
          )}
        </Paper>
      </Container>
    </Box>
  );
}