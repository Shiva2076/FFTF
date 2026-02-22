"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  useMediaQuery,
  useTheme,
  MobileStepper,
  Typography,
} from "@mui/material";
import Step1EnterpriseDetails from "./Step1EnterpriseDetails";
import Step2ActivationMethod from "./Step2ActivationMethod";
import Step3InviteFarms from "./Step3InviteFarms";
import Step4Confirmation from "./Step4Confirmation";
import ActivationStatusBar from "./ActivationStatusBar";

const steps = ["Enterprise Details", "Activation Method", "Invite Farms", "Confirmation"];
const mobileSteps = ["Details", "Method", "Farms", "Done"];

interface EnterpriseWizardProps {
  initialActivation?: any;
  onActivationComplete?: () => void;
  registrationSource?: string;
}

export default function EnterpriseWizard({ initialActivation, onActivationComplete, registrationSource }: EnterpriseWizardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeStep, setActiveStep] = useState(() => {
    if (!initialActivation?.current_step) return 0;
    return Math.max(0, Math.min(initialActivation.current_step - 1, 3));
  });

  const [activationId, setActivationId] = useState<string | null>(initialActivation?.activation_id || null);
  const [activationMethod, setActivationMethod] = useState<string | null>(initialActivation?.activation_method || null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessComplete, setIsProcessComplete] = useState(false);

  useEffect(() => {
    if (initialActivation?.status && ["invitations_sent", "pilot_requested", "completed"].includes(initialActivation.status)) {
      setIsProcessComplete(true);
    }
  }, [initialActivation]);

  const handleNext = () => {
    setError(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setActiveStep((prev) => prev - 1);
  };

  const handleActivationCreated = (id: string) => {
    setActivationId(id);
    handleNext();
  };

  const handleMethodSelected = (method: string) => {
    setActivationMethod(method);
    if (method === "AssistedPilot") {
      setActiveStep(3);
    } else {
      handleNext();
    }
  };

  const handleError = (msg: string) => setError(msg);

  const handleReset = () => {
    setActiveStep(0);
    setActivationId(null);
    setError(null);
    setActivationMethod(null);
    setIsProcessComplete(false);
  };

  const handleComplete = () => {
    setIsProcessComplete(true);
    onActivationComplete?.();
  };

  // Calculate effective steps count (excluding Invite Farms for AssistedPilot)
  const effectiveSteps = activationMethod === "AssistedPilot" ? 3 : 4;
  const effectiveActiveStep = activationMethod === "AssistedPilot" && activeStep === 3 ? 2 : activeStep;

  return (
    <Paper elevation={0} sx={{ p: { xs: 0, sm: 2, md: 4 }, borderRadius: 2 }}>
      {/* Mobile Stepper - Progress bar style */}
      {isMobile ? (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, px: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Step {effectiveActiveStep + 1} of {effectiveSteps}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: "#008756" }}>
              {mobileSteps[activeStep]}
            </Typography>
          </Box>
          <MobileStepper
            variant="progress"
            steps={effectiveSteps}
            position="static"
            activeStep={effectiveActiveStep}
            sx={{
              flexGrow: 1,
              backgroundColor: "transparent",
              p: 0,
              "& .MuiMobileStepper-progress": {
                width: "100%",
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(0, 135, 86, 0.15)",
              },
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#008756",
                borderRadius: 3,
              },
            }}
            backButton={null}
            nextButton={null}
          />
        </Box>
      ) : (
        /* Desktop Stepper */
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, index) => {
            if (index === 2 && activationMethod === "AssistedPilot") return null;
            return (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontSize: { sm: "0.75rem", md: "0.875rem" },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, mx: { xs: 0, sm: 0 } }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Box sx={{ minHeight: { xs: "auto", sm: 420 } }}>
        {!isProcessComplete ? (
          <>
            {activeStep === 0 && (
              <Step1EnterpriseDetails
                onNext={handleActivationCreated}
                onError={handleError}
                registrationSource={registrationSource}
              />
            )}
            {activeStep === 1 && activationId && (
              <Step2ActivationMethod
                activationId={activationId}
                onNext={handleMethodSelected}
                onBack={handleBack}
                onError={handleError}
              />
            )}
            {activeStep === 2 && activationId && activationMethod === "InviteFarms" && (
              <Step3InviteFarms
                activationId={activationId}
                onNext={handleNext}
                onBack={handleBack}
                onError={handleError}
              />
            )}
            {activeStep === 3 && activationId && (
              <Step4Confirmation
                activationId={activationId}
                activationMethod={activationMethod}
                onReset={handleReset}
                onActivationComplete={handleComplete}
              />
            )}
          </>
        ) : (
          <Box sx={{ py: { xs: 3, md: 6 }, textAlign: "center" }}>
            {initialActivation && (
              <ActivationStatusBar activation={initialActivation} />
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
