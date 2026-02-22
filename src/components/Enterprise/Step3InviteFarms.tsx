"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Collapse,
  useMediaQuery,
  useTheme,
  Autocomplete,
} from "@mui/material";
import { useAddFarmsMutation } from "@/app/slices/enterpriseApiSlice";
import axios from "axios";
import { FaTrash, FaPlus, FaWhatsapp, FaEnvelope, FaInfoCircle, FaCheck } from "react-icons/fa";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import countryList from 'react-select-country-list';

interface Props {
  activationId: string;
  onNext: () => void;
  onBack: () => void;
  onError: (error: string) => void;
}

interface CountryData {
  name: string;
  dialCode: string;
  countryCode: string;
  format: string;
}

interface Farm {
  farm_name: string;
  farm_country: string;
  farm_crop_category: string;
  farm_contact_email: string;
  farm_whatsapp_number: string;
  farm_whatsapp_country_code: string;
}

const cropCategories = ['Leafy Greens', 'Herbs', 'Vegetables', 'Fruits', 'Other'];

export default function Step3InviteFarms({ activationId, onNext, onBack, onError }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Get all countries from react-select-country-list using useMemo
  const countries = useMemo(() => {
    return countryList().getData().map((country) => country.label);
  }, []);

  const [farms, setFarms] = useState<Farm[]>([
    {
      farm_name: "",
      farm_country: "UAE",
      farm_crop_category: "Leafy Greens",
      farm_contact_email: "",
      farm_whatsapp_number: "",
      farm_whatsapp_country_code: "971",
    },
    {
      farm_name: "",
      farm_country: "UAE",
      farm_crop_category: "Leafy Greens",
      farm_contact_email: "",
      farm_whatsapp_number: "",
      farm_whatsapp_country_code: "971",
    }
  ]);

  const [showProceedWith1Warning, setShowProceedWith1Warning] = useState(false);
  const [forceProceed, setForceProceed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [addFarms, { isLoading }] = useAddFarmsMutation();

  const handleAddFarm = () => {
    setFarms([...farms, {
      farm_name: "",
      farm_country: "UAE",
      farm_crop_category: "Leafy Greens",
      farm_contact_email: "",
      farm_whatsapp_number: "",
      farm_whatsapp_country_code: "971",
    }]);
  };

  const handleRemoveFarm = (index: number) => {
    if (farms.length > 1) {
      setFarms(farms.filter((_, i) => i !== index));
    }
  };

  const handleFarmChange = (index: number, field: keyof Farm, value: string) => {
    const newFarms = [...farms];
    (newFarms[index] as any)[field] = value;
    setFarms(newFarms);
  };

  const handlePhoneChange = (index: number, value: string, data: CountryData) => {
    const newFarms = [...farms];
    newFarms[index].farm_whatsapp_country_code = data.dialCode;
    newFarms[index].farm_whatsapp_number = value.slice(data.dialCode.length);
    setFarms(newFarms);
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateWhatsApp = (number: string) => {
    if (!number.trim()) return true;
    const cleaned = number.replace(/[\s-]/g, "");
    return cleaned.length >= 7 && cleaned.length <= 15;
  };

  const farmHasContact = (farm: Farm) => {
    return farm.farm_contact_email.trim() || farm.farm_whatsapp_number.trim();
  };

  const getValidFarmsCount = () => {
    return farms.filter(farm => farm.farm_name.trim() && farm.farm_name.trim().length >= 2).length;
  };

  const getFarmsWithContactCount = () => {
    return farms.filter(farm =>
      farm.farm_name.trim() &&
      farm.farm_name.trim().length >= 2 &&
      farmHasContact(farm)
    ).length;
  };

  const sendInvitationsAutomatically = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/enterprise/${activationId}/send-invitations`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[Step3] Invitations sent successfully:", response.data);
      return true;
    } catch (err: any) {
      console.error("[Step3] Auto-send failed:", err?.response?.data || err.message);
      onError(err?.response?.data?.message || "Failed to send invitations automatically");
      return false;
    }
  };

  const handleSubmit = async () => {
    const filledFarms = farms.filter(farm => farm.farm_name.trim());

    if (filledFarms.length === 0) {
      onError("Please add at least one farm");
      return;
    }

    for (let i = 0; i < filledFarms.length; i++) {
      const farm = filledFarms[i];
      const farmIndex = farms.indexOf(farm) + 1;

      if (farm.farm_name.trim().length < 2) {
        onError(`Farm ${farmIndex}: Name must be at least 2 characters`);
        return;
      }

      if (farm.farm_contact_email.trim() && !validateEmail(farm.farm_contact_email)) {
        onError(`Farm ${farmIndex}: Invalid email format`);
        return;
      }

      if (farm.farm_whatsapp_number.trim() && !validateWhatsApp(farm.farm_whatsapp_number)) {
        onError(`Farm ${farmIndex}: Invalid WhatsApp number`);
        return;
      }
    }

    const farmsWithContact = filledFarms.filter(farm => farmHasContact(farm));
    if (farmsWithContact.length === 0) {
      onError("Please provide at least one contact method (Email or WhatsApp) for at least one farm");
      return;
    }

    if (filledFarms.length === 1 && !showProceedWith1Warning && !forceProceed) {
      setShowProceedWith1Warning(true);
      return;
    }

    setIsProcessing(true);

    try {
      const formattedFarms = filledFarms.map(farm => ({
        farm_name: farm.farm_name.trim(),
        farm_country: farm.farm_country.trim(),
        farm_crop_category: farm.farm_crop_category,
        farm_contact_email: farm.farm_contact_email.trim() || "",
        farm_whatsapp_number: farm.farm_whatsapp_number.trim()
          ? `+${farm.farm_whatsapp_country_code}${farm.farm_whatsapp_number.replace(/[\s-]/g, "")}`
          : "",
      }));

      console.log("Submitting farms payload:", formattedFarms);

      await addFarms({
        activation_id: activationId,
        farms: formattedFarms,
      }).unwrap();

      console.log("Farms saved successfully");

      const farmEmails = formattedFarms
        .map(f => f.farm_contact_email?.trim())
        .filter(email => typeof email === 'string' && email.length > 0 && email.includes('@'));

      if (farmEmails.length > 0) {
        console.log(`Found ${farmEmails.length} valid farm email(s) → sending invitations`);
        try {
          await sendInvitationsAutomatically();
        } catch (invErr: any) {
          console.warn("Invitation send failed (continuing anyway):", invErr);
        }
      } else {
        console.log("No valid farm emails → skipping send-invitations");
        onError("Farms saved successfully. No invitations sent (add at least one valid farm email to trigger invites).");
      }

      onNext();

    } catch (err: any) {
      console.error("Process error:", err);
      onError(
        err?.data?.message ||
        err?.response?.data?.message ||
        "Failed to save farms"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const validFarmsCount = getValidFarmsCount();
  const farmsWithContactCount = getFarmsWithContactCount();

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 0, fontWeight: 600, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
          Invite Your Supplier Farms
        </Typography>
        <Box
          sx={{
            backgroundColor: "rgba(37, 211, 102, 0.1)",
            color: "#25D366",
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        >
          STEP 3 OF 4
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
        Add the farms you'd like to connect with. Invitations are sent automatically when at least one farm email is provided. (~5 minutes)
      </Typography>

      <Alert
        severity="info"
        sx={{ mb: { xs: 2, sm: 3 }, backgroundColor: 'rgba(0, 135, 86, 0.08)', borderColor: '#008756' }}
        icon={<FaInfoCircle color="#008756" />}
      >
        <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
          <strong>Recommended:</strong> Register at least 2 farms for better insights.<br />
          <strong>Email</strong> is required for automatic invitations. WhatsApp is optional.
        </Typography>
      </Alert>

      <Collapse in={showProceedWith1Warning}>
        <Alert
          severity="warning"
          sx={{ mb: { xs: 2, sm: 3 } }}
          action={
            <Box sx={{ display: "flex", gap: 1, flexDirection: { xs: "column", sm: "row" } }}>
              <Button size="small" color="inherit" onClick={() => { setShowProceedWith1Warning(false); setForceProceed(false); }}>
                Add More
              </Button>
              <Button size="small" variant="contained" color="warning" onClick={() => { setShowProceedWith1Warning(false); setForceProceed(true); }}>
                Proceed Anyway
              </Button>
            </Box>
          }
        >
          <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
            You're registering only 1 farm. We recommend adding at least 2 farms for better supply intelligence.
          </Typography>
        </Alert>
      </Collapse>

      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2.5, sm: 3 } }}>
        {farms.map((farm, index) => (
          <Card key={index} variant="outlined" sx={{ position: 'relative' }}>
            <CardContent sx={{ p: { xs: 2, sm: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "0.9rem", sm: "1rem", md: "1.125rem" } }}>
                  Farm {index + 1}
                  {index === 0 && <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>}
                </Typography>
                {farms.length > 1 && (
                  <IconButton onClick={() => handleRemoveFarm(index)} color="error" size="small">
                    <FaTrash size={isMobile ? 14 : 16} />
                  </IconButton>
                )}
              </Box>

              {/* All your existing form fields (unchanged) */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 } }}>
                <TextField
                  label="Farm Name"
                  value={farm.farm_name}
                  onChange={(e) => handleFarmChange(index, "farm_name", e.target.value)}
                  fullWidth
                  required
                  placeholder="e.g., Green Valley Farm"
                  disabled={isProcessing}
                  size={isMobile ? "small" : "medium"}
                />

                <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2 }, flexDirection: { xs: "column", sm: "row" } }}>
                  <Autocomplete
                    freeSolo
                    options={countries}
                    value={farm.farm_country}
                    onInputChange={(_, v) => handleFarmChange(index, "farm_country", v || "")}
                    onChange={(_, v) => handleFarmChange(index, "farm_country", typeof v === "string" ? v : v || "")}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          label="Country"
                          placeholder="Select or type your country"
                          required
                          disabled={isProcessing}
                          size={isMobile ? "small" : "medium"}
                        />
                      );
                    }}
                    sx={{ flex: 1, minWidth: 0 }}
                  />

                  <FormControl fullWidth required disabled={isProcessing} size={isMobile ? "small" : "medium"} sx={{ flex: 1, minWidth: 0 }}>
                    <InputLabel>Primary Crop</InputLabel>
                    <Select
                      value={farm.farm_crop_category}
                      onChange={(e) => handleFarmChange(index, "farm_crop_category", e.target.value)}
                      label="Primary Crop"
                    >
                      {cropCategories.map((category) => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{
                  p: { xs: 1.5, sm: 2 },
                  backgroundColor: "rgba(0,0,0,0.02)",
                  borderRadius: 1,
                  border: farmHasContact(farm) ? "1px solid #25D366" : "1px dashed rgba(0,0,0,0.12)",
                  mt: { xs: 0.5, sm: 0 },
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: { xs: 1.25, sm: 1.5 } }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                      Contact Details
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                      (Email required for invitation • WhatsApp optional)
                    </Typography>
                    {farmHasContact(farm) && <FaCheck color="#25D366" size={14} style={{ marginLeft: 'auto' }} />}
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 } }}>
                    <Box sx={{ width: "100%" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: { xs: 0.5, sm: 0.5 } }}>
                        <FaWhatsapp color="#25D366" size={14} />
                        <Typography variant="caption" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                          WhatsApp Number (optional)
                        </Typography>
                      </Box>
                      <PhoneInput
                        country={'ae'}
                        value={farm.farm_whatsapp_country_code + farm.farm_whatsapp_number}
                        onChange={(value: string, data: CountryData) => handlePhoneChange(index, value, data)}
                        inputProps={{ name: 'whatsapp', placeholder: 'WhatsApp Number' }}
                        enableSearch
                        inputStyle={{
                          width: '100%',
                          height: isMobile ? '36px' : '40px',
                          fontSize: isMobile ? '13px' : '14px',
                          paddingLeft: '75px',
                          borderRadius: '4px',
                          border: '1px solid rgba(0, 0, 0, 0.23)',
                        }}
                        buttonStyle={{ border: 'none', background: 'transparent', borderRight: '1px solid #ccc' }}
                        containerStyle={{ width: '100%' }}
                        disabled={isProcessing}
                      />
                    </Box>

                    <Box sx={{ width: "100%" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                        <FaEnvelope color="#666" size={12} />
                        <Typography variant="caption" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                          Email Address (required for invitation)
                        </Typography>
                      </Box>
                      <TextField
                        type="email"
                        value={farm.farm_contact_email}
                        onChange={(e) => handleFarmChange(index, "farm_contact_email", e.target.value)}
                        fullWidth
                        placeholder="farm@example.com"
                        disabled={isProcessing}
                        size="small"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            py: { xs: 1, sm: 1.25 }
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outlined"
          onClick={handleAddFarm}
          startIcon={<FaPlus />}
          disabled={isProcessing}
          sx={{
            borderStyle: "dashed",
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.8rem", sm: "0.875rem" }
          }}
        >
          Add Another Farm
        </Button>
      </Box>

      <Box sx={{ mt: 3, p: { xs: 1.5, sm: 2 }, backgroundColor: "rgba(0,0,0,0.02)", borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
          Farms ready: <strong>{validFarmsCount}</strong> / {farms.length}
          {validFarmsCount < 2 && (
            <Typography component="span" color="warning.main" sx={{ ml: 1 }}>
              (2+ recommended)
            </Typography>
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
          Farms with contact: <strong>{farmsWithContactCount}</strong>
          {farmsWithContactCount === 0 && (
            <Typography component="span" color="error" sx={{ ml: 1 }}>
              (at least 1 required)
            </Typography>
          )}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", mt: { xs: 3, sm: 4 }, gap: { xs: 1.5, sm: 2 } }}>
        <Button
          onClick={onBack}
          disabled={isProcessing}
          sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isProcessing || validFarmsCount === 0 || farmsWithContactCount === 0}
          size={isMobile ? "medium" : "large"}
          sx={{
            minWidth: { xs: 140, sm: 180 },
            backgroundColor: "#ff6200",
            "&:hover": { backgroundColor: "#e55a00" },
            color: "white",
            fontWeight: 600,
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          {isProcessing ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Processing...
            </>
          ) : (
            "NEXT & SEND INVITATIONS"
          )}
        </Button>
      </Box>
    </Box>
  );
}