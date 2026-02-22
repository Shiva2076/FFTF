"use client";

import { FC, useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Country, State, City } from "country-state-city";
import { api } from "@/constants";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

interface FarmRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onSubmit: (data: any) => void;
}

const FarmRegisterModal: FC<FarmRegisterModalProps> = ({
  open,
  onClose,
  onBack,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    farmName: "",
    country: "",
    countryCode: "",
    state: "",
    city: "",
    location: "",
    pinCode: "",
  });

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (form.countryCode) {
      const stateList = State.getStatesOfCountry(form.countryCode);
      setStates(stateList);
      setForm((prev) => ({ ...prev, state: "", city: "" }));
      setCities([]);
    }
  }, [form.countryCode]);

  useEffect(() => {
    const selectedState = states.find((s) => s.name === form.state);
    if (form.countryCode && selectedState) {
      const cityList = City.getCitiesOfState(
        form.countryCode,
        selectedState.isoCode
      );
      setCities(cityList);
      setForm((prev) => ({ ...prev, city: "" }));
    }
  }, [form.state, form.countryCode]);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "farmName",
      "country",
      "state",
      "city",
      "location",
      "pinCode",
    ];
    const hasMissing = requiredFields.some(
      (field) => !form[field as keyof typeof form]?.trim()
    );

    if (hasMissing) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true);
      const requestBody = {
        farmName: form.farmName.trim(),
        country: form.country.trim(),
        countryCode: form.countryCode,
        state: form.state.trim(),
        city: form.city.trim(),
        location: form.location.trim(),
        pincode: form.pinCode.trim(),
      };

      const response = await api.post("/api/farm/register", requestBody);
      const createdFarm = response.data.data.farm;

      onSubmit(response.data);
      onClose();
    } catch (error) {
      console.error("Farm registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 650,
          bgcolor: "#fff",
          borderRadius: "12px",
          boxShadow: 24,
          p: 4,
          fontFamily: "Poppins",
          maxHeight: "90vh",
          overflowY: "auto",
          zIndex: 2000, // <-- add this

        }}
      >
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 16, right: 16 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight={600} color="#008756" gutterBottom>
          Register Your Farm
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }} color="text.secondary">
          Enter your farm details to get started with your vertical farming operations.
          Our team will review your submission and contact you as soon as possible
          to assist with the setup.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Farm Name"
              value={form.farmName}
              onChange={(e) => handleChange("farmName", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                value={form.countryCode}
                onChange={(e) => {
                  const selected = countries.find(c => c.isoCode === e.target.value);
                  setForm({
                    ...form,
                    countryCode: selected.isoCode,
                    country: selected.name,
                  });
                }}
              >
                {countries.map((country) => (
                  <MenuItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!form.countryCode}>
              <InputLabel>State</InputLabel>
              <Select
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
              >
                {states.map((state) => (
                  <MenuItem key={state.isoCode} value={state.name}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!form.state}>
              <InputLabel>City</InputLabel>
              <Select
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
              >
                {cities.map((city) => (
                  <MenuItem key={city.name} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pin Code"
              value={form.pinCode}
              onChange={(e) => handleChange("pinCode", e.target.value)}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              width: 200,
              textTransform: "uppercase",
              fontWeight: 500,
              backgroundColor: "#ff5e00",
              color: "#fff",
              "&:hover": { backgroundColor: "#e65500" },
            }}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FarmRegisterModal;
