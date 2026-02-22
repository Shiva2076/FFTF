"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { api } from "@/constants";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Verified } from "@mui/icons-material";

// Minimal typing for the phone input data payload
interface CountryData {
  name: string;
  dialCode: string;
  countryCode: string;
  format: string;
}

const featureHighlights = [
  "AI-driven crop guidance tailored to your farm.",
  "Live monitoring with predictive alerts.",
  "One dashboard for teams, devices, and orders.",
];

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [localNumber, setLocalNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (value: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !phone.trim() ||
      !countryCode.trim() ||
      !localNumber.trim()
    ) {
      setError("Please fill in your name, email, phone code, phone number, password, and confirmation.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/users", {
        name,
        email,
        countryCode,
        phone: localNumber,
        password,
        role: "GULFOOD",
        verified: true,
        subscribed: true,
      });
      setSuccess("Account created! Check your email to verify and then log in.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");
      setCountryCode("");
      setLocalNumber("");
      setTimeout(() => router.push("/"), 1200);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 20% 20%, #fbe9e7 0, #f5f5f5 35%, #e3f2fd 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 1200,
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          backdropFilter: "blur(6px)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.12)",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              background: "linear-gradient(145deg, #0b6b40 0%, #058c42 45%, #fcb045 100%)",
              color: "#fefefe",
              p: { xs: 4, sm: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Stack spacing={3}>
              <Typography variant="overline" sx={{ letterSpacing: 1.6, fontWeight: 700 }}>
                INNOFARMS.AI
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Grow smarter with precision insights and real-time actions.
              </Typography>
              <Typography sx={{ opacity: 0.92, fontSize: "0.98rem" }}>
                Sign up to unlock advanced controls, predictive automation, and a clean command center for your farm operations.
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              {featureHighlights.map((item) => (
                <Stack direction="row" spacing={1.5} alignItems="center" key={item}>
                  <CheckCircleOutlineIcon fontSize="small" />
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 600 }}>{item}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={7} sx={{ p: { xs: 3, sm: 5 } }}>
            <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#102a43" }}>
                  Create your account
                </Typography>
                <Typography sx={{ color: "#52616b", mt: 0.5 }}>
                  Start with the basics. You can add team members and devices later.
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" variant="outlined" sx={{ borderRadius: 2 }}>
                  {success}
                </Alert>
              )}

              <TextField
                label="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                size="medium"
              />

              <TextField
                label="Work email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                size="medium"
              />

              <PhoneInput
                country={"in"}
                separateDialCode
                value={phone}
                onChange={(value: string, data: CountryData) => {
                  setPhone(value);
                  setCountryCode(data.dialCode);
                  setLocalNumber(value.slice(data.dialCode.length));
                }}
                inputProps={{
                  name: "phone",
                  required: true,
                  autoFocus: false,
                }}
                enableSearch
                inputStyle={{
                  width: "100%",
                  height: "56px",
                  fontSize: "16px",
                  paddingLeft: "75px",
                  borderRadius: "4px",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  boxShadow: "none",
                }}
                buttonStyle={{
                  border: "none",
                  background: "transparent",
                  borderRight: "1px solid #ccc",
                  marginRight: "8px",
                }}
                containerStyle={{
                  width: "100%",
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                size="medium"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
                size="medium"
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 0.5,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #ff7a18 0%, #ff5e00 50%, #ffb347 100%)",
                  color: "#0c0c0c",
                  boxShadow: "0 14px 30px rgba(255, 126, 24, 0.35)",
                  textTransform: "none",
                  fontSize: "1rem",
                  '&:hover': {
                    background: "linear-gradient(135deg, #ff6b0a 0%, #f24c00 50%, #ff9c2f 100%)",
                    boxShadow: "0 16px 32px rgba(242, 76, 0, 0.3)",
                  },
                }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Create account"}
              </Button>

              <Divider>Or</Divider>

              <Stack direction="row" spacing={1} justifyContent="center">
                <Typography sx={{ color: "#52616b" }}>Already registered?</Typography>
                <Typography
                  onClick={() => router.push("/login")}
                  sx={{ color: "#ff5e00", fontWeight: 700, cursor: "pointer" }}
                >
                  Go to login
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
