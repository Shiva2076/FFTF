// src/components/Enterprise/Step1EnterpriseDetails.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
} from "@mui/material";
import { useStartActivationMutation, useUpdateEnterpriseDetailsMutation } from "@/app/slices/enterpriseApiSlice";
import { usePathname } from "next/navigation";
import { FaWhatsapp, FaCheck } from "react-icons/fa";
import { api } from "@/constants";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

interface CountryData {
  name: string;
  dialCode: string;
  countryCode: string;
  format: string;
}

interface Props {
  onNext: (activationId: string) => void;
  onError: (error: string) => void;
  registrationSource?: string;
}

const roles = [
  "Procurement / Sourcing",
  "Operations",
  "Sustainability / ESG",
  "Innovation / Digital",
  "Finance / Strategy",
  "Other",
];

const goalOptions = [
  "Demand planning & forecasting",
  "Supply risk visibility",
  "Traceability & ESG readiness",
  "Pilot evaluation",
  "Supplier benchmarking",
];

type VerificationStep = "details" | "otp" | "verified";

export default function Step1EnterpriseDetails({ onNext, onError, registrationSource }: Props) {
  const pathname = usePathname();
  const isFromMarketTrend = pathname?.includes("/enterprise/innomarkettrend") || registrationSource === "Gulfood";

  // Form fields
  const [enterpriseName, setEnterpriseName] = useState("");
  const [role, setRole] = useState("");
  const [goals, setGoals] = useState<string[]>([]);

  // WhatsApp verification
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("971"); // Default Dubai
  const [localNumber, setLocalNumber] = useState("");
  const [verificationStep, setVerificationStep] = useState<VerificationStep>("details");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  // Loading states
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // OTP input refs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [startActivation, { isLoading: isStarting }] = useStartActivationMutation();
  const [updateDetails, { isLoading: isUpdating }] = useUpdateEnterpriseDetailsMutation();

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleGoalChange = (goal: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setGoals((prev) => [...prev, goal]);
    } else {
      setGoals((prev) => prev.filter((g) => g !== goal));
    }
  };

  const validatePhone = () => {
    const cleaned = localNumber.replace(/[\s-]/g, "");
    return cleaned.length >= 7 && cleaned.length <= 15;
  };

  // Send OTP to WhatsApp
  const handleSendOtp = async () => {
    if (!validatePhone()) {
      return onError("Please enter a valid phone number");
    }

    setIsSendingOtp(true);
    setOtpError("");

    try {
      const fullNumber = `+${countryCode}${localNumber.replace(/[\s-]/g, "")}`;
      await api.post("/api/enterprise/send-whatsapp-otp", {
        whatsapp_number: fullNumber,
        enterprise_name: enterpriseName.trim(),
      });

      setVerificationStep("otp");
      setResendTimer(60); // 60 seconds cooldown

      // Focus first OTP input
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      onError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last digit
    setOtp(newOtp);
    setOtpError("");

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (newOtp.every(digit => digit) && newOtp.join("").length === 6) {
      verifyOtp(newOtp.join(""));
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      verifyOtp(pastedData);
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const verifyOtp = async (otpCode: string) => {
    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      const fullNumber = `+${countryCode}${localNumber.replace(/[\s-]/g, "")}`;
      await api.post("/api/enterprise/verify-whatsapp-otp", {
        whatsapp_number: fullNumber,
        otp: otpCode,
      });

      setIsVerified(true);
      setVerificationStep("verified");
    } catch (err: any) {
      setOtpError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (resendTimer === 0) {
      handleSendOtp();
    }
  };

  // Final submit
  const handleSubmit = async () => {
    if (!enterpriseName.trim()) return onError("Enterprise name is required");
    if (!role) return onError("Please select your role");
    if (goals.length === 0) return onError("Please select at least one goal");

    // For Gulfood registration, require WhatsApp verification
    if (isFromMarketTrend && !isVerified) {
      return onError("Please verify your WhatsApp number");
    }

    try {
      const fullNumber = isFromMarketTrend ? `+${countryCode}${localNumber.replace(/[\s-]/g, "")}` : undefined;

      const startRes = await startActivation({
        enterprise_name: enterpriseName.trim(),
        registration_source: isFromMarketTrend ? "Gulfood" : "Direct",
        whatsapp_number: fullNumber,
        whatsapp_verified: isVerified,
      }).unwrap();
      const activationId = startRes.data.activation_id;

      await updateDetails({
        activation_id: activationId,
        enterprise_name: enterpriseName.trim(),
        user_role_in_company: role,
        goals,
        registration_source: isFromMarketTrend ? "Gulfood" : "Direct",
        whatsapp_number: fullNumber,
        whatsapp_verified: isVerified,
      }).unwrap();

      onNext(activationId);
    } catch (err: any) {
      console.error(err);
      onError(err?.data?.message || "Failed to create activation");
    }
  };

  const isLoading = isStarting || isUpdating;

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 0 } }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Tell us about your enterprise
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, minHeight: "420px" }}>
        <TextField
          label="Enterprise Name"
          value={enterpriseName}
          onChange={(e) => setEnterpriseName(e.target.value)}
          fullWidth
          required
          placeholder="e.g., Fresh Valley Foods"
          disabled={isLoading}
        />

        <FormControl fullWidth required disabled={isLoading}>
          <FormLabel sx={{ mb: 1 }}>
            Your Role in Company
          </FormLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            displayEmpty
            disabled={isLoading}
          >
            <MenuItem value="" disabled>
              Select your role
            </MenuItem>
            {roles.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl component="fieldset" required disabled={isLoading}>
          <FormLabel component="legend" sx={{ mb: 1 }}>
            What are your goals? (select all that apply)
          </FormLabel>
          <FormGroup sx={{ pl: 1 }}>
            {goalOptions.map((goal) => (
              <FormControlLabel
                key={goal}
                control={
                  <Checkbox
                    checked={goals.includes(goal)}
                    onChange={handleGoalChange(goal)}
                    sx={{ py: 0.75 }}
                  />
                }
                label={<Typography variant="body2">{goal}</Typography>}
              />
            ))}
          </FormGroup>
        </FormControl>

        {/* WhatsApp Verification - shown for Gulfood/MarketTrend registrations */}
        {isFromMarketTrend && (
          <Box sx={{
            p: 2.5,
            border: "1px solid",
            borderColor: isVerified ? "#25D366" : "rgba(0,0,0,0.12)",
            borderRadius: 2,
            backgroundColor: isVerified ? "rgba(37, 211, 102, 0.05)" : "transparent"
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <FaWhatsapp color="#25D366" size={24} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                WhatsApp Verification
              </Typography>
              {isVerified && (
                <Box sx={{
                  ml: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#25D366",
                  fontWeight: 600,
                  fontSize: "0.875rem"
                }}>
                  <FaCheck /> Verified
                </Box>
              )}
            </Box>

            {verificationStep === "details" && (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Enter your WhatsApp number to receive a verification code
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", flexDirection: { xs: "column", sm: "row" } }}>
                  <Box sx={{ width: "100%" }}>
                    <PhoneInput
                      country={'ae'}
                      value={phone}
                      onChange={(value: string, data: CountryData) => {
                        setPhone(value);
                        setCountryCode(data.dialCode);
                        setLocalNumber(value.slice(data.dialCode.length));
                      }}
                      inputProps={{
                        name: 'phone',
                        required: true,
                      }}
                      enableSearch
                      inputStyle={{
                        width: '100%',
                        height: '48px',
                        fontSize: '16px',
                        paddingLeft: '75px',
                        borderRadius: '4px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                      }}
                      buttonStyle={{
                        border: 'none',
                        background: 'transparent',
                        borderRight: '1px solid #ccc',
                      }}
                      containerStyle={{ width: '100%' }}
                      disabled={isSendingOtp}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || !localNumber}
                    sx={{
                      minWidth: { xs: "100%", sm: 140 },
                      height: 48,
                      backgroundColor: "#25D366",
                      "&:hover": { backgroundColor: "#128C7E" }
                    }}
                  >
                    {isSendingOtp ? <CircularProgress size={20} color="inherit" /> : "Send OTP"}
                  </Button>
                </Box>
              </>
            )}

            {verificationStep === "otp" && (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Enter the 6-digit code sent to +{countryCode} {localNumber}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
                  {otp.map((digit, index) => (
                    <TextField
                      key={index}
                      inputRef={(el) => (otpRefs.current[index] = el)}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      inputProps={{
                        maxLength: 1,
                        style: {
                          textAlign: "center",
                          fontSize: "1.5rem",
                          fontWeight: 600,
                          padding: "12px 0"
                        }
                      }}
                      sx={{
                        width: { xs: 40, sm: 48 },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1
                        }
                      }}
                      disabled={isVerifyingOtp}
                    />
                  ))}
                </Box>

                {isVerifyingOtp && (
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}

                {otpError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {otpError}
                  </Alert>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Button
                    variant="text"
                    onClick={() => setVerificationStep("details")}
                    sx={{ color: "text.secondary" }}
                  >
                    Change Number
                  </Button>
                  <Button
                    variant="text"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0}
                    sx={{ color: resendTimer > 0 ? "text.disabled" : "#25D366" }}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                  </Button>
                </Box>
              </>
            )}

            {verificationStep === "verified" && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  +{countryCode} {localNumber}
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    setVerificationStep("details");
                    setIsVerified(false);
                    setOtp(["", "", "", "", "", ""]);
                  }}
                  sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                >
                  Change
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Spacer */}
        <Box sx={{ flexGrow: 1, minHeight: { xs: 40, sm: 60 } }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading || (isFromMarketTrend && !isVerified)}
            size="large"
           sx={{
    minWidth: 160,
    py: 1.5,
    backgroundColor: "#ff6200",
    color: "white",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#ff6200",
    },
    "&:disabled": {
      backgroundColor: "#ffab7a",
      color: "white",
    },
  }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "NEXT"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
