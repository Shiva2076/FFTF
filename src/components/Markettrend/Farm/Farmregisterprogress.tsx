import { NextPage } from "next";
import Image from "next/image";
import { Box, Typography, Button, Paper } from "@mui/material";

const Content: NextPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        boxSizing: "border-box",
        gap: 5,
        textAlign: "center",
        fontSize: "2.125rem",
        color: "#008756",
        fontFamily: "Poppins",
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="flex-start" gap={1}>
        <Typography variant="h5" fontWeight="bold">
          Your Farm Registration is in Progress
        </Typography>
        <Typography variant="body1" color="#39414c">
          Our team is reviewing your submission. You’ll be notified at each stage of the process.
        </Typography>
      </Box>

      {/* Steps Progress */}
      <Box display="flex" alignItems="center" gap={1}>
        {[
          "Submitted",
          "Verification",
          "Review Complete",
          "Approved",
          "Setup Done",
        ].map((step, index) => (
          <Box key={index} textAlign="center">
            <Image src="/apps/StepSymbol.svg" width={32} height={32} alt={step} />
            <Typography variant="caption" display="block" textTransform="uppercase">
              {step}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Farm Details */}
      <Paper
        sx={{
          width: "26rem",
          borderRadius: 1,
          backgroundColor: "#f7f7f7",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          p: 3,
          textAlign: "left",
        }}
      >
        <Typography variant="h6">GreenFuture HydroFarm</Typography>
        <Typography variant="body2" color="rgba(0, 18, 25, 0.6)">
          California, USA (Los Angeles)
        </Typography>

        {[
          { label: "Total Racks", value: 10 },
          { label: "Shelves Per Rack", value: 5 },
          { label: "Channels Per Shelf", value: 4 },
          { label: "Plugs Per Channel", value: 12 },
        ].map(({ label, value }) => (
          <Box key={label} display="flex" justifyContent="space-between">
            <Typography variant="body2">{label}</Typography>
            <Typography variant="body2" color="#008756">
              {value}
            </Typography>
          </Box>
        ))}
      </Paper>

      {/* Back Button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#ff5e00",
          color: "#f7f7f7",
          textTransform: "uppercase",
          fontWeight: 500,
          letterSpacing: "0.46px",
          "&:hover": { backgroundColor: "#e65000" },
        }}
      >
        Back to Market Trend
      </Button>
    </Box>
  );
};

export default Content;
