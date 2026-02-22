import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";

const Header = () => {
  return (
    <Box
      sx={{
        alignSelf: "stretch",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "1rem",
        width: "100%",
      }}
    >
      {/* Left Side: Welcome + Date/Time */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          fontSize: "3rem",
        }}
      >
        <Typography
          variant="h2"
          sx={{ lineHeight: "116.7%", fontWeight: "bold", fontSize: "3rem" }}
        >
          Welcome back, John Doe!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1rem",
            letterSpacing: "0.15px",
            lineHeight: "200%",
            color: "rgba(0, 18, 25, 0.6)",
          }}
        >
          Today is Monday, February 26, 2025 | 10:15 AM
        </Typography>
      </Box>

      {/* Add Crops Button */}
      <Button
        variant="contained"
        sx={{
          boxShadow:
            "0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
          borderRadius: "4px",
          backgroundColor: "#e65000",
          color: "#f7f7f7",
          textTransform: "uppercase",
          fontWeight: 500,
          letterSpacing: "0.4px",
          height: "2.5rem",
        }}
      >
        Add Crops
      </Button>

      {/* Divider */}
      <Box
        sx={{
          width: "1px",
          backgroundColor: "rgba(0, 0, 0, 0.12)",
          height: "2.5rem",
          mx: 2,
        }}
      />

      {/* Farm Dropdown */}
      <Box
        sx={{
          borderRadius: "4px",
          backgroundColor: "#fff",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          boxSizing: "border-box",
          height: "2.5rem",
          display: "flex",
          alignItems: "center",
          px: "1rem",
        }}
      >
        <Typography
          sx={{
            letterSpacing: "0.17px",
            lineHeight: "180%",
            mr: 1,
          }}
        >
          Green Harvest Vertical Farm
        </Typography>
        <Image
          width={20}
          height={20}
          alt="Icon Right"
          src="/apps/Icon Right.svg"
        />
      </Box>
    </Box>
  );
};

export default Header;
