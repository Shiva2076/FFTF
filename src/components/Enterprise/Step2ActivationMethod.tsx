// src/components/Enterprise/Step2ActivationMethod.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  CircularProgress,
  Collapse,
  Alert,
} from "@mui/material";
import { useChooseActivationMethodMutation } from "@/app/slices/enterpriseApiSlice";
import { FaUsers, FaHandshake, FaArrowLeft } from "react-icons/fa";

interface Props {
  activationId: string;
  onNext: (method: string) => void;
  onBack: () => void;
  onError: (error: string) => void;
  showAssistedPilotFallback?: boolean;
}

export default function Step2ActivationMethod({ activationId, onNext, onBack, onError, showAssistedPilotFallback = false }: Props) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(showAssistedPilotFallback ? null : "InviteFarms");
  const [showFallbackOption, setShowFallbackOption] = useState(showAssistedPilotFallback);
  const [chooseMethod, { isLoading }] = useChooseActivationMethodMutation();

  // Auto-select InviteFarms as primary method
  useEffect(() => {
    if (!showAssistedPilotFallback) {
      setSelectedMethod("InviteFarms");
    }
  }, [showAssistedPilotFallback]);

  const handleSubmit = async () => {
    if (!selectedMethod) {
      onError("Please select an activation method");
      return;
    }

    try {
      await chooseMethod({
        activation_id: activationId,
        activation_method: selectedMethod,
      }).unwrap();

      onNext(selectedMethod);
    } catch (err: any) {
      console.error(err);
      onError(err?.data?.message || "Failed to choose activation method");
    }
  };

  const handleBackWithFallback = () => {
    if (selectedMethod === "InviteFarms" && !showFallbackOption) {
      // Show Assisted Pilot as fallback option
      setShowFallbackOption(true);
      setSelectedMethod(null);
    } else {
      onBack();
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 1, fontWeight: 600 }}>
        Choose Your Activation Method
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select how you'd like to activate Enterprise Supply Intelligence
      </Typography>

      {/* Fallback Alert - shown when user goes back */}
      <Collapse in={showFallbackOption}>
        <Alert
          severity="info"
          sx={{ mb: 3, backgroundColor: 'rgba(255, 94, 0, 0.08)', borderColor: '#ff5e00' }}
          icon={<FaHandshake color="#ff5e00" />}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Not ready to invite farms yourself? Let our team help you with an Assisted Pilot program.
          </Typography>
        </Alert>
      </Collapse>

      <Grid container spacing={3}>
        {/* Invite Farms - Primary Option */}
        <Grid item xs={12} md={showFallbackOption ? 6 : 12}>
          <Card
            sx={{
              height: '100%',
              border: selectedMethod === 'InviteFarms' ? '2px solid #008756' : '1px solid #e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-4px)',
              },
            }}
            onClick={() => setSelectedMethod('InviteFarms')}
          >
            {!showFallbackOption && (
              <Box sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: '#008756',
                color: '#fff',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                RECOMMENDED
              </Box>
            )}
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ fontSize: 60, color: '#008756', mb: 2 }}>
                <FaUsers />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Invite Farms
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect with 1-3 existing supplier farms directly. Send them invitations to join your supply intelligence network.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                variant={selectedMethod === 'InviteFarms' ? 'contained' : 'outlined'}
                color="primary"
              >
                {selectedMethod === 'InviteFarms' ? 'Selected' : 'Select'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Assisted Pilot - Fallback Option (shown when user clicks back or showFallbackOption is true) */}
        {showFallbackOption && (
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                border: selectedMethod === 'AssistedPilot' ? '2px solid #ff5e00' : '1px solid #e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => setSelectedMethod('AssistedPilot')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ fontSize: 60, color: '#ff5e00', mb: 2 }}>
                  <FaHandshake />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Assisted Pilot
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Work with our team to design a custom pilot program. We'll help you identify and onboard the right suppliers.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant={selectedMethod === 'AssistedPilot' ? 'contained' : 'outlined'}
                  sx={{
                    backgroundColor: selectedMethod === 'AssistedPilot' ? '#ff5e00' : 'transparent',
                    color: selectedMethod === 'AssistedPilot' ? '#fff' : '#ff5e00',
                    '&:hover': {
                      backgroundColor: selectedMethod === 'AssistedPilot' ? '#e65000' : 'rgba(255, 94, 0, 0.04)',
                    },
                  }}
                >
                  {selectedMethod === 'AssistedPilot' ? 'Selected' : 'Select'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button onClick={handleBackWithFallback} disabled={isLoading} startIcon={<FaArrowLeft />}>
          {showFallbackOption ? "Back" : "Back"}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedMethod || isLoading}
          size="large"
          sx={{
            minWidth: 150,
            backgroundColor: "#ff5e00",
            "&:hover": { backgroundColor: "#e65300" },
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : "NEXT"}
        </Button>
      </Box>
    </Box>
  );
}