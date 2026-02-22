import { NextPage } from "next";
import Image from "next/image";
import { Button, Box, Typography, Container, Paper, TextField } from "@mui/material";

const EmailUpdate: NextPage = () => {
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
            Update Your Email Address
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Enter a new email address to receive your verification link.
          </Typography>
          <TextField
            fullWidth
            label="New Email Address"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Confirm New Email Address"
            variant="outlined"
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ backgroundColor: "#ff5e00", textTransform: "uppercase", fontWeight: "500" }}
          >
            Update Email
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default EmailUpdate;