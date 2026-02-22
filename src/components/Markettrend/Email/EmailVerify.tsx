import { NextPage } from "next";
import Image from "next/image";
import { Button, Box, Typography, Container, Paper } from "@mui/material";

const VerificationEmail: NextPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#f7f7f7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: "Poppins",
      }}
    >
      {/* Content */}
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            padding: "2rem",
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Verify Your Email to Get Started
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We've sent a verification link to <b style={{ color: "#008756" }}>user@email.com</b>.
            Click the link to activate your account.
          </Typography>
          <Box sx={{ display: "flex", gap: "1rem", width: "100%" }}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ textTransform: "uppercase", fontWeight: "500" }}
            >
              Change Email Address
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ textTransform: "uppercase", fontWeight: "500" }}
            >
              Resend Verification Email
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default VerificationEmail;
